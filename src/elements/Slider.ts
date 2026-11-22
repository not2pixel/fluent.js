import { clamp, h, onDrag, round } from "../core/dom";
import { ElementFrame, ValueElement, type ElementContext } from "./base";
import type { SliderConfig } from "../types";

export class Slider extends ValueElement<number> {
  readonly Type = "Slider";
  readonly Element: ElementFrame;
  Min: number;
  Max: number;
  Rounding: number;
  private fill: HTMLElement;
  private knob: HTMLElement;
  private valueInput: HTMLInputElement;
  private suffix: string;

  constructor(ctx: ElementContext, flag: string | undefined, cfg: SliderConfig) {
    super(ctx, flag);
    this.Callback = cfg.Callback;
    this.Min = cfg.Min ?? 0;
    this.Max = cfg.Max ?? 100;
    this.Rounding = cfg.Rounding ?? 0;
    this.suffix = cfg.Suffix ?? "";
    this.Value = clamp(cfg.Default ?? this.Min, this.Min, this.Max);

    this.Element = new ElementFrame(ctx, {
      title: cfg.Title,
      description: cfg.Description,
      icon: cfg.Icon,
      iconColor: cfg.IconColor,
      className: "fl-slider",
    });
    this.fill = h("div", { class: "fl-slider-fill" });
    this.knob = h("div", { class: "fl-slider-knob" });
    const rail = h("div", { class: "fl-slider-rail" }, [this.fill, this.knob]);
    const hit = h("div", { class: "fl-slider-hit" }, [rail]);
    this.valueInput = h("input", { class: "fl-slider-value", type: "text", spellcheck: "false" });
    this.valueInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.valueInput.blur();
    });
    this.valueInput.addEventListener("blur", () => {
      const n = parseFloat(this.valueInput.value);
      if (!Number.isNaN(n)) this.SetValue(n);
      else this.render();
    });
    this.Element.Right.append(this.valueInput, hit);

    onDrag(hit, {
      start: () => this.Element.Frame.classList.add("fl-dragging"),
      move: (e) => {
        const r = rail.getBoundingClientRect();
        const pct = clamp((e.clientX - r.left) / r.width, 0, 1);
        this.SetValue(this.Min + (this.Max - this.Min) * pct);
      },
      end: () => this.Element.Frame.classList.remove("fl-dragging"),
    });
    hit.addEventListener("wheel", (e) => {
      if (!e.shiftKey) return;
      e.preventDefault();
      const step = this.Rounding > 0 ? Math.pow(10, -this.Rounding) : 1;
      this.SetValue(this.Value + (e.deltaY < 0 ? step : -step));
    });

    this.render();
    ctx.library.SafeCallback(this.Callback, this.Value);
  }

  get Frame() {
    return this.Element.Frame;
  }

  private render() {
    const pct = this.Max === this.Min ? 0 : (this.Value - this.Min) / (this.Max - this.Min);
    this.fill.style.width = `${pct * 100}%`;
    this.knob.style.left = `${pct * 100}%`;
    if (document.activeElement !== this.valueInput)
      this.valueInput.value = `${this.Value.toFixed(Math.max(0, this.Rounding))}${this.suffix}`;
  }

  SetValue(value: unknown) {
    const v = round(clamp(Number(value), this.Min, this.Max), this.Rounding);
    if (Number.isNaN(v)) return;
    const changed = v !== this.Value;
    this.Value = v;
    this.render();
    if (changed) this.emit();
  }
  SetMin(n: number) {
    this.Min = n;
    this.SetValue(this.Value);
    this.render();
  }
  SetMax(n: number) {
    this.Max = n;
    this.SetValue(this.Value);
    this.render();
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
