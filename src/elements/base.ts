import { h, setRich } from "../core/dom";
import { createIcon } from "../core/icons";
import { toCss, type ColorLike } from "../core/color";
import type { FluentLibrary } from "../library";
import type { Window } from "../components/Window";

export interface ElementContext {
  library: FluentLibrary;
  window: Window;
  /** DOM node new elements are appended to. */
  container: HTMLElement;
}

export interface FrameOptions {
  title?: string;
  description?: string;
  icon?: string;
  iconColor?: ColorLike;
  clickable?: boolean;
  className?: string;
}

/** Port of Components/Element.lua — the standard row every element sits in. */
export class ElementFrame {
  readonly Frame: HTMLElement;
  readonly TitleLabel: HTMLElement;
  readonly DescLabel: HTMLElement;
  /** Right-hand slot for controls (toggle switch, slider, etc). */
  readonly Right: HTMLElement;
  readonly Left: HTMLElement;
  private iconEl: HTMLElement | null = null;

  constructor(private ctx: ElementContext, opts: FrameOptions) {
    this.TitleLabel = h("div", { class: "fl-el-title" });
    this.DescLabel = h("div", { class: "fl-el-desc" });
    const text = h("div", { class: "fl-el-text" }, [this.TitleLabel, this.DescLabel]);
    this.Left = h("div", { class: "fl-el-left" }, [text]);
    this.Right = h("div", { class: "fl-el-right" });
    this.Frame = h(opts.clickable ? "button" : ("div" as "div"), {
      class: `fl-element ${opts.clickable ? "fl-clickable" : ""} ${opts.className ?? ""}`,
      type: opts.clickable ? "button" : undefined,
    }, [this.Left, this.Right]);
    if (opts.icon) this.SetIcon(opts.icon, opts.iconColor);
    this.SetTitle(opts.title);
    this.SetDesc(opts.description);
    ctx.container.append(this.Frame);
    ctx.window.registerSearchable(this.Frame, () => `${this.TitleLabel.textContent ?? ""} ${this.DescLabel.textContent ?? ""}`);
  }

  SetTitle(text?: string) {
    setRich(this.TitleLabel, text ?? "");
    this.TitleLabel.hidden = !text;
  }
  SetDesc(text?: string) {
    setRich(this.DescLabel, text ?? "");
    this.DescLabel.hidden = !text;
    this.Frame.classList.toggle("fl-has-desc", !!text);
  }
  SetIcon(icon?: string, color?: ColorLike) {
    this.iconEl?.remove();
    this.iconEl = createIcon(icon, 18, toCss(color));
    if (this.iconEl) {
      this.iconEl.classList.add("fl-el-icon");
      this.Left.prepend(this.iconEl);
    }
  }
  Destroy() {
    this.ctx.window.unregisterSearchable(this.Frame);
    this.Frame.remove();
  }
}

/** Shared behaviour of elements that hold a value (Toggle, Slider, Dropdown…). */
export abstract class ValueElement<T> {
  abstract readonly Type: string;
  Value!: T;
  Callback?: (value: T) => void;
  readonly Flag?: string;
  protected changedHandlers: Array<(value: T) => void> = [];

  constructor(protected ctx: ElementContext, flag?: string) {
    this.Flag = flag;
    if (flag) ctx.library.Options[flag] = this;
  }

  get Library() {
    return this.ctx.library;
  }

  /** Same semantics as Luau: registers the handler and immediately calls it with the current value. */
  OnChanged(fn: (value: T) => void) {
    this.changedHandlers.push(fn);
    this.ctx.library.SafeCallback(fn, this.Value);
    return this;
  }

  protected emit() {
    this.ctx.library.SafeCallback(this.Callback, this.Value);
    for (const fn of this.changedHandlers) this.ctx.library.SafeCallback(fn, this.Value);
  }

  abstract SetValue(value: unknown, ...rest: unknown[]): void;
  abstract Destroy(): void;

  protected unregister() {
    if (this.Flag && this.ctx.library.Options[this.Flag] === this) delete this.ctx.library.Options[this.Flag];
  }
}
