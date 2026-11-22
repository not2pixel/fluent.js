import { h } from "../core/dom";
import { mouseButtonName, toCode, toName } from "../core/keys";
import { ElementFrame, ValueElement, type ElementContext } from "./base";
import type { KeybindConfig, KeybindMode } from "../types";

/**
 * Value is the Roblox-style key name ("RightAlt", "Q", "MB2").
 * Modes: "Toggle" → callback(bool) on each press; "Always" → callback() every press; "Hold" → callback(true/false) on down/up.
 */
export class Keybind extends ValueElement<string> {
  readonly Type = "Keybind";
  readonly Element: ElementFrame;
  Mode: KeybindMode;
  Toggled = false;
  Holding = false;
  ChangedCallback?: (key: string) => void;
  private picking = false;
  private pill: HTMLButtonElement;
  private clickHandlers: Array<() => void> = [];
  private dispose: () => void;

  constructor(ctx: ElementContext, flag: string | undefined, cfg: KeybindConfig) {
    super(ctx, flag);
    this.ChangedCallback = cfg.ChangedCallback;
    this.Value = cfg.Default ?? "None";
    this.Mode = cfg.Mode ?? "Toggle";
    this.Element = new ElementFrame(ctx, {
      title: cfg.Title,
      description: cfg.Description,
      icon: cfg.Icon,
      iconColor: cfg.IconColor,
      className: "fl-keybind",
    });
    this.pill = h("button", { class: "fl-keybind-pill", type: "button" });
    this.Element.Right.append(this.pill);
    this.pill.addEventListener("click", (e) => {
      e.stopPropagation();
      this.startPicking();
    });

    const isTyping = () => {
      const a = document.activeElement as HTMLElement | null;
      return !!a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.isContentEditable);
    };
    const press = (name: string) => {
      if (this.picking || name !== this.Value || this.Value === "None") return;
      if (this.Mode === "Toggle") {
        this.Toggled = !this.Toggled;
        ctx.library.SafeCallback(cfg.Callback, this.Toggled);
      } else if (this.Mode === "Hold") {
        if (this.Holding) return;
        this.Holding = true;
        ctx.library.SafeCallback(cfg.Callback, true);
      } else ctx.library.SafeCallback(cfg.Callback);
      this.clickHandlers.forEach((fn) => ctx.library.SafeCallback(fn));
      this.flash();
    };
    const release = (name: string) => {
      if (this.Mode === "Hold" && this.Holding && name === this.Value) {
        this.Holding = false;
        ctx.library.SafeCallback(cfg.Callback, false);
      }
    };
    const kd = (e: KeyboardEvent) => !isTyping() && !e.repeat && press(toName(e.code));
    const ku = (e: KeyboardEvent) => release(toName(e.code));
    const md = (e: MouseEvent) => {
      const n = mouseButtonName(e.button);
      if (n && !this.Element.Frame.contains(e.target as Node)) press(n);
    };
    const mu = (e: MouseEvent) => {
      const n = mouseButtonName(e.button);
      if (n) release(n);
    };
    document.addEventListener("keydown", kd);
    document.addEventListener("keyup", ku);
    document.addEventListener("mousedown", md);
    document.addEventListener("mouseup", mu);
    this.dispose = () => {
      document.removeEventListener("keydown", kd);
      document.removeEventListener("keyup", ku);
      document.removeEventListener("mousedown", md);
      document.removeEventListener("mouseup", mu);
    };
    this.render();
  }

  get Frame() {
    return this.Element.Frame;
  }

  private flash() {
    this.pill.classList.remove("fl-flash");
    void this.pill.offsetWidth;
    this.pill.classList.add("fl-flash");
  }

  private render() {
    this.pill.textContent = this.picking ? "..." : this.Value;
    this.pill.classList.toggle("fl-picking", this.picking);
    this.Element.Frame.classList.toggle("fl-on", this.Mode === "Toggle" && this.Toggled);
  }

  private startPicking() {
    if (this.picking) return;
    this.picking = true;
    this.render();
    const finish = (name: string | null) => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("mousedown", onMouse, true);
      this.picking = false;
      if (name) this.SetValue(name);
      else this.render();
    };
    const onKey = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.code === "Escape") finish(null);
      else if (e.code === "Backspace" || e.code === "Delete") finish("None");
      else finish(toName(e.code));
    };
    const onMouse = (e: MouseEvent) => {
      if (e.target === this.pill && e.button === 0) return;
      e.preventDefault();
      e.stopPropagation();
      finish(mouseButtonName(e.button));
    };
    setTimeout(() => {
      document.addEventListener("keydown", onKey, true);
      document.addEventListener("mousedown", onMouse, true);
    }, 0);
  }

  /** True while the bind is "on" (Toggle mode) or held (Hold mode). */
  GetState(): boolean {
    if (this.Mode === "Toggle") return this.Toggled;
    if (this.Mode === "Hold") return this.Holding;
    return false;
  }

  SetValue(key: unknown, mode?: unknown) {
    const name = toName(toCode(String(key ?? "None"))) || "None";
    if (typeof mode === "string") this.Mode = mode as KeybindMode;
    const changed = name !== this.Value;
    this.Value = name;
    this.render();
    if (changed) {
      this.ctx.library.SafeCallback(this.ChangedCallback, name);
      for (const fn of this.changedHandlers) this.ctx.library.SafeCallback(fn, name);
    }
  }
  OnClick(fn: () => void) {
    this.clickHandlers.push(fn);
    return this;
  }
  SetTitle(t: string) {
    this.Element.SetTitle(t);
  }
  SetDesc(t: string) {
    this.Element.SetDesc(t);
  }
  Destroy() {
    this.dispose();
    this.Element.Destroy();
    this.unregister();
  }
}
