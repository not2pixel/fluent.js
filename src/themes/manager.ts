import { toCss, toColor3, type ColorLike } from "../core/color";
import { BuiltinThemeNames, BuiltinThemes } from "./builtin";
import type { ColorSequence, ThemeDefinition } from "./types";

const BASE = "Dark";

function seqToStops(seq: ColorSequence | undefined): string | undefined {
  if (!seq || !seq.length) return undefined;
  return seq.map(([t, c]) => `${toCss(c)} ${Math.round(t * 100)}%`).join(", ");
}

export class ThemeManager {
  readonly themes: Record<string, ThemeDefinition> = { ...BuiltinThemes };
  readonly names: string[] = [...BuiltinThemeNames];

  register(name: string, def: ThemeDefinition) {
    this.themes[name] = { ...def, Name: name };
    if (!this.names.includes(name)) this.names.push(name);
  }

  get(name: string): ThemeDefinition {
    const base = this.themes[BASE] ?? Object.values(this.themes)[0];
    return { ...base, ...(this.themes[name] ?? {}) };
  }

  /** Converts a theme into CSS custom properties (`--fl-*`). */
  toCssVars(name: string, opts: { transparency?: boolean } = {}): Record<string, string> {
    const t = this.get(name);
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(t)) {
      if (typeof value === "string" && value.startsWith("#")) vars[`--fl-${key}`] = toCss(value)!;
      else if (typeof value === "number") vars[`--fl-${key}`] = String(value);
    }
    const color = (c: ColorLike | undefined, a = 1) => toCss(c ?? "#ffffff", a)!;

    const elementAlpha = 1 - (t.ElementTransparency ?? 0.87);
    vars["--fl-ElementBg"] = color(t.Element, Math.max(0.06, elementAlpha));
    vars["--fl-ElementBgHover"] = color(t.Element, Math.min(1, Math.max(0.06, elementAlpha) + (t.HoverChange ?? 0.04) * 1.5));
    vars["--fl-ElementBorderWidth"] = `${t.ElementBorderThickness ?? 1}px`;
    vars["--fl-DropdownBorderWidth"] = `${t.DropdownBorderThickness ?? 1}px`;

    const accent = toColor3(t.Accent as ColorLike);
    vars["--fl-AccentSoft"] = accent.toCss(0.25);
    vars["--fl-AccentRgb"] = accent.toRGB().join(", ");

    // Window background: acrylic main color + gradient tint.
    const transparency = opts.transparency === false ? 0 : t.BackgroundTransparency ?? 0;
    const mainAlpha = opts.transparency === false ? 1 : 0.88;
    vars["--fl-WindowBg"] = color(t.AcrylicMain, mainAlpha);
    const grad = seqToStops(t.AcrylicGradient);
    vars["--fl-AcrylicGradientCss"] = grad ? `linear-gradient(135deg, ${grad})` : "none";
    vars["--fl-AcrylicGradientOpacity"] = String(Math.max(0.2, 1 - (t.AcrylicNoise ?? 0.9)) * 2.5);
    vars["--fl-BackgroundImage"] = t.Background ? `url("${t.Background}")` : "none";
    vars["--fl-BackgroundOpacity"] = String(1 - transparency);

    const shine = seqToStops(t.Shine?.ColorSequence);
    vars["--fl-ShineConic"] = shine
      ? `conic-gradient(from var(--fl-angle), ${t.Shine!.ColorSequence!.map(([p, c]) => `${toCss(c)} ${Math.round(p * 100)}%`).join(", ")})`
      : `conic-gradient(from var(--fl-angle), ${color(t.AcrylicBorder)}, ${color(t.AcrylicBorder)})`;
    vars["--fl-ShineDuration"] = `${Math.max(1, 360 / Math.max(1, t.Shine?.RotationSpeed ?? 25))}s`;
    const btnBg = seqToStops(t.ButtonGradient?.Background);
    const btnStroke = seqToStops(t.ButtonGradient?.Stroke);
    vars["--fl-ButtonGradientBg"] = btnBg ? `linear-gradient(90deg, ${btnBg})` : color(t.DialogButton);
    vars["--fl-ButtonGradientStroke"] = btnStroke ? `linear-gradient(90deg, ${btnStroke})` : color(t.DialogButtonBorder);

    vars["--fl-DiscordJoinButton"] = color(t.DiscordJoinButton ?? "#5865f2");
    vars["--fl-InfoNotifyColor"] = color(t.InfoNotifyColor ?? t.Accent);
    vars["--fl-SuccessNotifyColor"] = color(t.SuccessNotifyColor ?? "#50dc8c");
    vars["--fl-WarningNotifyColor"] = color(t.WarningNotifyColor ?? "#ffc850");
    vars["--fl-ErrorNotifyColor"] = color(t.ErrorNotifyColor ?? "#ff465a");
    vars["--fl-IconColor"] = color(t.IconColor ?? t.SubText);
    vars["--fl-CheckboxUnchecked"] = color(t.CheckboxUnchecked ?? t.ToggleSlider);
    vars["--fl-CheckboxChecked"] = color(t.CheckboxChecked ?? t.Accent);
    vars["--fl-CheckboxCheck"] = color(t.CheckboxCheck ?? t.ToggleToggled);
    vars["--fl-ProgressBarRail"] = color(t.ProgressBarRail ?? t.SliderRail);
    vars["--fl-ProgressBarFill"] = color(t.ProgressBarFill ?? t.Accent);
    return vars;
  }

  applyTo(el: HTMLElement, name: string, opts?: { transparency?: boolean }) {
    for (const [k, v] of Object.entries(this.toCssVars(name, opts))) el.style.setProperty(k, v);
    const t = this.get(name);
    el.dataset.flShine = t.ShineEnabled ? "on" : "off";
    el.dataset.flStrokeShine = t.StrokeShine ? "on" : "off";
  }
}
