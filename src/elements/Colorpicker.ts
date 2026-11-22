import { clamp, h, onDrag } from "../core/dom";
import { Color3, toColor3 } from "../core/color";
import { ElementFrame, ValueElement, type ElementContext } from "./base";
import type { ColorpickerConfig } from "../types";

export class Colorpicker extends ValueElement<Color3> {
  readonly Type = "Colorpicker";
  readonly Element: ElementFrame;
  Transparency: number;
  Hue = 0;
  Sat = 0;
  Vib = 0;
  private hasAlpha: boolean;
  private swatch: HTMLElement;

  constructor(ctx: ElementContext, flag: string | undefined, private cfg: ColorpickerConfig) {
    super(ctx, flag);
    this.Callback = cfg.Callback;
    this.hasAlpha = cfg.Transparency !== undefined;
    this.Transparency = cfg.Transparency ?? 0;
    this.Value = toColor3(cfg.Default ?? "#60cdff");
    [this.Hue, this.Sat, this.Vib] = this.Value.toHSV();

    this.Element = new ElementFrame(ctx, {
      title: cfg.Title,
      description: cfg.Description,
      icon: cfg.Icon,
      iconColor: cfg.IconColor,
      clickable: true,
      className: "fl-colorpicker",
    });
    this.swatch = h("span", { class: "fl-swatch-color" });
    this.Element.Right.append(h("span", { class: "fl-swatch fl-checker" }, [this.swatch]));
    this.Element.Frame.addEventListener("click", () => this.openPicker());
    this.render();
    ctx.library.SafeCallback(this.Callback, this.Value);
  }

  get Frame() {
    return this.Element.Frame;
  }

  private render() {
    this.swatch.style.background = this.Value.toCss(1 - this.Transparency);
  }

  /** Same signature as Luau: SetValue({h, s, v}, transparency) with components in 0..1 */
  SetValue(hsv: unknown, transparency?: unknown) {
    if (hsv instanceof Color3 || typeof hsv === "string") return this.SetValueRGB(hsv, transparency as number | undefined);
    const [hh, s, v] = Array.isArray(hsv) ? hsv : [(hsv as any).h ?? (hsv as any)[1], (hsv as any).s, (hsv as any).v];
    this.Hue = hh;
    this.Sat = s;
    this.Vib = v;
    if (typeof transparency === "number") this.Transparency = clamp(transparency, 0, 1);
    this.Value = Color3.fromHSV(this.Hue, this.Sat, this.Vib);
    this.render();
    this.emit();
  }

  SetValueRGB(color: Color3 | string, transparency?: number) {
    const c = toColor3(color);
    [this.Hue, this.Sat, this.Vib] = c.toHSV();
    this.Value = c;
    if (typeof transparency === "number") this.Transparency = clamp(transparency, 0, 1);
    this.render();
    this.emit();
  }

  private openPicker() {
    const win = this.ctx.window;
    let hue = this.Hue,
      sat = this.Sat,
      vib = this.Vib,
      alpha = 1 - this.Transparency;
    const previous = this.Value.toCss(1 - this.Transparency);

    const svCursor = h("div", { class: "fl-cp-cursor" });
    const sv = h("div", { class: "fl-cp-sv" }, [h("div", { class: "fl-cp-sv-white" }), h("div", { class: "fl-cp-sv-black" }), svCursor]);
    const hueKnob = h("div", { class: "fl-cp-bar-knob" });
    const hueBar = h("div", { class: "fl-cp-bar fl-cp-hue" }, [hueKnob]);
    const alphaKnob = h("div", { class: "fl-cp-bar-knob" });
    const alphaFill = h("div", { class: "fl-cp-alpha-fill" });
    const alphaBar = h("div", { class: "fl-cp-bar fl-cp-alpha fl-checker" }, [alphaFill, alphaKnob]);
    const newSw = h("div", { class: "fl-cp-compare-new" });
    const compare = h("div", { class: "fl-cp-compare fl-checker" }, [newSw, h("div", { class: "fl-cp-compare-old", style: { background: previous } })]);

    const field = (label: string) => {
      const input = h("input", { class: "fl-cp-input", type: "text", spellcheck: "false" });
      return { input, el: h("label", { class: "fl-cp-field" }, [h("span", { text: label }), input]) };
    };
    const hex = field("Hex");
    const r = field("R"),
      g = field("G"),
      b = field("B"),
      a = field("Alpha");

    const update = (skip?: HTMLInputElement) => {
      const c = Color3.fromHSV(hue, sat, vib);
      sv.style.backgroundColor = Color3.fromHSV(hue, 1, 1).toCss();
      svCursor.style.left = `${sat * 100}%`;
      svCursor.style.top = `${(1 - vib) * 100}%`;
      hueKnob.style.left = `${hue * 100}%`;
      alphaKnob.style.left = `${alpha * 100}%`;
      alphaFill.style.background = `linear-gradient(90deg, transparent, ${c.toCss()})`;
      newSw.style.background = c.toCss(alpha);
      const [R, G, B] = c.toRGB();
      if (skip !== hex.input) hex.input.value = c.toHex().slice(1).toUpperCase();
      if (skip !== r.input) r.input.value = String(R);
      if (skip !== g.input) g.input.value = String(G);
      if (skip !== b.input) b.input.value = String(B);
      if (skip !== a.input) a.input.value = `${Math.round(alpha * 100)}%`;
    };

    onDrag(sv, {
      move: (e) => {
        const rc = sv.getBoundingClientRect();
        sat = clamp((e.clientX - rc.left) / rc.width, 0, 1);
        vib = 1 - clamp((e.clientY - rc.top) / rc.height, 0, 1);
        update();
      },
    });
    onDrag(hueBar, {
      move: (e) => {
        const rc = hueBar.getBoundingClientRect();
        hue = clamp((e.clientX - rc.left) / rc.width, 0, 0.9999);
        update();
      },
    });
    onDrag(alphaBar, {
      move: (e) => {
        const rc = alphaBar.getBoundingClientRect();
        alpha = clamp((e.clientX - rc.left) / rc.width, 0, 1);
        update();
      },
    });
    hex.input.addEventListener("change", () => {
      if (/^#?[0-9a-f]{3}([0-9a-f]{3})?$/i.test(hex.input.value.trim())) {
        [hue, sat, vib] = Color3.fromHex(hex.input.value).toHSV();
      }
      update();
    });
    for (const f of [r, g, b]) {
      f.input.addEventListener("change", () => {
        const c = Color3.fromRGB(clamp(+r.input.value || 0, 0, 255), clamp(+g.input.value || 0, 0, 255), clamp(+b.input.value || 0, 0, 255));
        [hue, sat, vib] = c.toHSV();
        update();
      });
    }
    a.input.addEventListener("change", () => {
      alpha = clamp((parseFloat(a.input.value) || 0) / 100, 0, 1);
      update();
    });

    const body = h("div", { class: "fl-cp" }, [
      h("div", { class: "fl-cp-main" }, [
        sv,
        h("div", { class: "fl-cp-side" }, [compare, hex.el, h("div", { class: "fl-cp-rgb" }, [r.el, g.el, b.el]), this.hasAlpha ? a.el : null]),
      ]),
      hueBar,
      this.hasAlpha ? alphaBar : null,
    ]);
    update();

    win.Dialog({
      Title: this.cfg.Title ?? "Colorpicker",
      Body: body,
      Buttons: [
        {
          Title: "Done",
          Callback: () => this.SetValue({ h: hue, s: sat, v: vib }, this.hasAlpha ? 1 - alpha : undefined),
        },
        { Title: "Cancel" },
      ],
    });
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
