import { h } from "./core/dom";
import { ThemeManager } from "./themes/manager";
import type { ThemeDefinition } from "./themes/types";
import type { NotifyConfig, WindowConfig } from "./types";
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
      document.body.append(this._root);
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
