import { h } from "../core/dom";
import { ElementFrame, ValueElement, type ElementContext } from "./base";
import type { InputConfig } from "../types";

export class Input extends ValueElement<string> {
  readonly Type = "Input";
  readonly Element: ElementFrame;
  readonly Numeric: boolean;
  readonly Finished: boolean;
  readonly Box: HTMLInputElement;

  constructor(ctx: ElementContext, flag: string | undefined, cfg: InputConfig) {
    super(ctx, flag);
    this.Callback = cfg.Callback;
    this.Numeric = !!cfg.Numeric;
    this.Finished = !!cfg.Finished;
    this.Value = cfg.Default ?? "";
    this.Element = new ElementFrame(ctx, {
      title: cfg.Title,
      description: cfg.Description,
      icon: cfg.Icon,
      iconColor: cfg.IconColor,
      className: "fl-input",
    });
    this.Box = h("input", {
      class: "fl-textbox",
      type: "text",
      placeholder: cfg.Placeholder ?? "",
      spellcheck: "false",
      maxLength: cfg.MaxLength ?? undefined,
      inputMode: this.Numeric ? "decimal" : undefined,
    });
    this.Box.value = this.Value;
    const wrap = h("label", { class: "fl-textbox-wrap" }, [this.Box, h("span", { class: "fl-textbox-indicator" })]);
    this.Element.Right.append(wrap);

    this.Box.addEventListener("input", () => {
      if (this.Numeric) {
        const cleaned = this.Box.value.replace(/[^\d.\-]/g, "");
        if (cleaned !== this.Box.value) this.Box.value = cleaned;
      }
      if (!this.Finished) this.SetValue(this.Box.value);
    });
    this.Box.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.Box.blur();
      }
    });
    this.Box.addEventListener("change", () => {
      if (this.Finished) this.SetValue(this.Box.value);
    });
  }

  get Frame() {
    return this.Element.Frame;
  }

  SetValue(value: unknown) {
    let v = String(value ?? "");
    if (this.Numeric && v !== "" && Number.isNaN(Number(v)) && v !== "-" && v !== ".") v = this.Value;
    if (this.Box.value !== v) this.Box.value = v;
    if (v === this.Value) return;
    this.Value = v;
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
