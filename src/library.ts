import { h } from "./core/dom";
import { ThemeManager } from "./themes/manager";
import type { ThemeDefinition } from "./themes/types";
import type { FontConfig, FontSource, NotifyConfig, WindowConfig } from "./types";
import { Window } from "./components/Window";
import { NotificationHost, type NotificationHandle } from "./components/Notification";
import type { ValueElement } from "./elements/base";

export type ErrorHandler = (message: string, error: unknown) => void;

export class FluentLibrary {
  readonly Version = "2.0.0-alpha.0";
  /** Every element created with a flag, e.g. Options.MyToggle.Value */
  readonly Options: Record<string, ValueElement<any>> = {};
  readonly Windows: Window[] = [];
  readonly ThemeManager = new ThemeManager();

  Theme = "Dark";
  Acrylic = true;
  Transparency = true;
  Animated = true;
  Unloaded = false;
  /** CSS font-family applied to the UI (null = default stack). */
  Font: string | null = null;

  private themed = new Set<HTMLElement>();
  private errorHandler: ErrorHandler | null = null;
  private themeListeners = new Set<(name: string) => void>();
  private _root: HTMLElement | null = null;
  private _notifications: NotificationHost | null = null;

  get Themes(): string[] {
    return this.ThemeManager.names;
  }

  /** Fixed overlay holding windows (when no Parent is given) and notifications. */
  get root(): HTMLElement {
    if (!this._root) {
      this._root = h("div", { class: "fluent-root" });
      (document.body ?? document.documentElement).append(this._root);
      this.track(this._root);
    }
    return this._root;
  }

  CreateWindow(config: WindowConfig = {}): Window {
    if (config.Theme) this.Theme = config.Theme;
    if (config.Acrylic !== undefined) this.Acrylic = config.Acrylic;
    if (config.Animated !== undefined) this.Animated = config.Animated;
    const win = new Window(this, config);
    this.Windows.push(win);
    return win;
  }

  /** Registers an element so theme changes repaint it. */
  track(el: HTMLElement) {
    this.themed.add(el);
    this.paint(el);
  }
  untrack(el: HTMLElement) {
    this.themed.delete(el);
  }

  private paint(el: HTMLElement) {
    this.ThemeManager.applyTo(el, this.Theme, { transparency: this.Transparency });
    el.classList.toggle("fl-no-acrylic", !this.Acrylic);
    el.classList.toggle("fl-animated", this.Animated);
    if (this.Font) el.style.setProperty("--fl-font", this.Font);
    else el.style.removeProperty("--fl-font");
  }

  private repaint() {
    this.themed.forEach((el) => this.paint(el));
  }

  SetTheme(name: string) {
    if (!this.ThemeManager.themes[name]) {
      console.warn(`[Fluent] Unknown theme "${name}"`);
      return;
    }
    this.Theme = name;
    this.repaint();
    this.themeListeners.forEach((fn) => fn(name));
  }

  OnThemeChanged(fn: (name: string) => void) {
    this.themeListeners.add(fn);
    return () => this.themeListeners.delete(fn);
  }

  RegisterCustomTheme(name: string, def: ThemeDefinition) {
    this.ThemeManager.register(name, def);
    if (this.Theme === name) this.repaint();
  }

  ToggleAcrylic(value: boolean) {
    this.Acrylic = value;
    this.repaint();
  }
  ToggleTransparency(value: boolean) {
    this.Transparency = value;
    this.repaint();
  }
  ToggleAnimated(value: boolean) {
    this.Animated = value;
    this.repaint();
  }

  /**
   * Uses a custom font for the whole UI.
   *   Fluent.SetFont("Inter")                                    // already available font
   *   Fluent.SetFont({ Family: "SF Pro", Sources: [{ Url: ".../SF-Pro-Text-Regular.woff2", Weight: 400 }, …] })
   * The family is applied immediately (font-display: swap); the promise resolves once every file loaded.
   * Resolves to the list of sources that failed (empty = all good).
   */
  async SetFont(font: string | FontConfig | null): Promise<FontSource[]> {
    if (!font) {
      this.Font = null;
      this.repaint();
      return [];
    }
    // A full CSS stack ("Inter, sans-serif") is applied as-is.
    if (typeof font === "string" && font.includes(",")) {
      this.Font = font;
      this.repaint();
      return [];
    }
    const cfg: FontConfig = typeof font === "string" ? { Family: font } : font;
    const family = cfg.Family.replace(/["\\]/g, "");
    this.Font = `"${family}", ${cfg.Fallback ?? 'system-ui, -apple-system, "Segoe UI", sans-serif'}`;
    this.repaint();

    const failed: FontSource[] = [];
    if (!cfg.Sources?.length || typeof FontFace === "undefined") return failed;
    await Promise.all(
      cfg.Sources.map(async (src) => {
        const descriptors: FontFaceDescriptors = { weight: String(src.Weight ?? "400"), style: src.Style ?? "normal", display: "swap" };
        const locals = ([] as string[]).concat(src.Local ?? []).map((n) => `local("${n.replace(/["\\]/g, "")}")`);
        const fmt = (u: string) => {
          const ext = /\.(woff2|woff|ttf|otf)(\?|#|$)/i.exec(u)?.[1]?.toLowerCase();
          return ext ? ` format("${ext === "ttf" ? "truetype" : ext === "otf" ? "opentype" : ext}")` : "";
        };
        try {
          let face: FontFace;
          if (src.Data) face = new FontFace(family, src.Data as BufferSource, descriptors);
          else {
            const list = [...locals, ...(src.Url ? [`url("${encodeURI(decodeURI(src.Url))}")${fmt(src.Url)}`] : [])];
            if (!list.length) return;
            face = new FontFace(family, list.join(", "), descriptors);
          }
          await face.load();
          document.fonts.add(face);
        } catch (e) {
          failed.push(src);
          console.warn(
            `[Fluent] Could not load font "${family}" (${src.Url ?? "data"}, weight ${descriptors.weight}).` +
              (src.Url ? " If the site's CSP blocks fonts, pass the file bytes as `Data` instead." : ""),
            e
          );
        }
      })
    );
    if (failed.length === cfg.Sources.length) console.warn(`[Fluent] No "${family}" file loaded; falling back to ${cfg.Fallback ?? "system-ui"}.`);
    return failed;
  }

  SetErrorHandler(fn: ErrorHandler | null) {
    this.errorHandler = fn;
  }

  /** Runs a user callback, routing exceptions to the error handler (like SafeCallback in Luau). */
  SafeCallback<A extends unknown[]>(fn: ((...args: A) => unknown) | undefined, ...args: A) {
    if (typeof fn !== "function") return;
    try {
      const r = fn(...args);
      if (r instanceof Promise) r.catch((e) => this.reportError(e));
    } catch (e) {
      this.reportError(e);
    }
  }

  private reportError(e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (this.errorHandler) {
      try {
        this.errorHandler(msg, e);
      } catch (inner) {
        console.error(inner);
      }
      return;
    }
    console.error("[Fluent] Callback error:", e);
    this.Notify({ Title: "Callback error", Content: msg, Type: "Error", Duration: 6 });
  }

  Notify(config: NotifyConfig): NotificationHandle {
    if (!this._notifications) this._notifications = new NotificationHost(this, this.root);
    return this._notifications.push(config);
  }

  Destroy() {
    this.Unloaded = true;
    [...this.Windows].forEach((w) => w.Destroy());
    this._notifications?.destroy();
    this._notifications = null;
    this._root?.remove();
    this._root = null;
    this.themed.clear();
    for (const k of Object.keys(this.Options)) delete this.Options[k];
  }
}
