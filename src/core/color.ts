/** Minimal Color3 equivalent so Luau-style code ports over 1:1. */
export class Color3 {
  /** Channels in 0..1, like Roblox. */
  constructor(public R = 0, public G = 0, public B = 0) {}

  static new(r = 0, g = 0, b = 0) {
    return new Color3(r, g, b);
  }
  static fromRGB(r = 0, g = 0, b = 0) {
    return new Color3(r / 255, g / 255, b / 255);
  }
  static fromHex(hex: string) {
    let h = hex.replace("#", "").trim();
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h.slice(0, 6), 16) || 0;
    return Color3.fromRGB((n >> 16) & 255, (n >> 8) & 255, n & 255);
  }
  /** h, s, v in 0..1 */
  static fromHSV(h: number, s: number, v: number) {
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    const [r, g, b] = [
      [v, t, p],
      [q, v, p],
      [p, v, t],
      [p, q, v],
      [t, p, v],
      [v, p, q],
    ][((i % 6) + 6) % 6];
    return new Color3(r, g, b);
  }

  toHSV(): [number, number, number] {
    const { R: r, G: g, B: b } = this;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
      if (h < 0) h += 1;
    }
    return [h, max === 0 ? 0 : d / max, max];
  }
  toRGB(): [number, number, number] {
    return [Math.round(this.R * 255), Math.round(this.G * 255), Math.round(this.B * 255)];
  }
  toHex() {
    return "#" + this.toRGB().map((v) => v.toString(16).padStart(2, "0")).join("");
  }
  toCss(alpha = 1) {
    const [r, g, b] = this.toRGB();
    return alpha >= 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  Lerp(to: Color3, t: number) {
    return new Color3(this.R + (to.R - this.R) * t, this.G + (to.G - this.G) * t, this.B + (to.B - this.B) * t);
  }
  toString() {
    return this.toHex();
  }
}

export type ColorLike = Color3 | string;

export function toColor3(c: ColorLike | undefined, fallback = "#ffffff"): Color3 {
  if (c instanceof Color3) return c;
  return Color3.fromHex(typeof c === "string" ? c : fallback);
}

export function toCss(c: ColorLike | undefined, alpha = 1): string | undefined {
  if (c === undefined) return undefined;
  if (typeof c === "string" && !c.startsWith("#")) return c; // already a css color
  return toColor3(c).toCss(alpha);
}
