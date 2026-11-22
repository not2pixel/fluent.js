import { h } from "../core/dom";
import { builtinIcon } from "../core/icons";
import { ElementFrame, ValueElement, type ElementContext } from "./base";
import type { ToggleConfig } from "../types";

export class Toggle extends ValueElement<boolean> {
  readonly Type: string = "Toggle";
  readonly Element: ElementFrame;
  protected control: HTMLElement;

  constructor(ctx: ElementContext, flag: string | undefined, cfg: ToggleConfig, kind: "toggle" | "checkbox" = "toggle") {
    super(ctx, flag);
    this.Callback = cfg.Callback;
    this.Value = !!cfg.Default;
    this.Element = new ElementFrame(ctx, {
      title: cfg.Title,
      description: cfg.Description,
      icon: cfg.Icon,
      iconColor: cfg.IconColor,
      clickable: true,
      className: `fl-${kind}`,
    });
    this.control =
      kind === "toggle"
        ? h("span", { class: "fl-switch", role: "switch" }, [h("span", { class: "fl-switch-knob" })])
        : h("span", { class: "fl-checkbox-box", role: "checkbox" }, [builtinIcon("check", 14)]);
    this.Element.Right.append(this.control);
    this.Element.Frame.addEventListener("click", () => this.SetValue(!this.Value));
    this.render();
    // Luau fires the callback with the default value on creation.
    ctx.library.SafeCallback(this.Callback, this.Value);
  }

  get Frame() {
    return this.Element.Frame;
  }

  private render() {
    this.Element.Frame.classList.toggle("fl-on", this.Value);
    this.control.setAttribute("aria-checked", String(this.Value));
  }

  SetValue(value: unknown) {
    const v = !!value;
    if (v === this.Value) return;
    this.Value = v;
    this.render();
    this.emit();
  }
  SetTitle(t: string) {
    this.Element.SetTitle(t);
  }
  SetDesc(t: string) {
    this.Element.SetDesc(t);
  }
  Destroy() {
    this.Element.Destroy();
    this.unregister();
  }
}

export class Checkbox extends Toggle {
  readonly Type = "Checkbox";
  constructor(ctx: ElementContext, flag: string | undefined, cfg: ToggleConfig) {
    super(ctx, flag, cfg, "checkbox");
  }
}
