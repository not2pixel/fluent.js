import { h } from "./dom";

/** Built-in SVG icons used by the library chrome (works offline). Lucide-style, 24x24 stroke. */
const BUILTIN: Record<string, string> = {
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  minimize: '<path d="M5 12h14"/>',
  maximize: '<rect x="5" y="5" width="14" height="14" rx="2"/>',
  restore: '<rect x="4" y="8" width="12" height="12" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  play: '<path d="M6 4l14 8-14 8z" fill="currentColor"/>',
  pause: '<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>',
  stop: '<rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor"/>',
  volume: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  success: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  warning: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  error: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
  resize: '<path d="M21 15 15 21M21 8 8 21"/>',
  keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  pipette: '<path d="m2 22 1-1h3l9-9M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
};

export function builtinIcon(name: keyof typeof BUILTIN | string, size = 16): HTMLElement {
  const span = h("span", { class: "fl-icon", style: { width: `${size}px`, height: `${size}px` } });
  span.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${BUILTIN[name] ?? BUILTIN.layers}</svg>`;
  return span;
}

/**
 * Resolves an icon string the way the Luau lib accepts them:
 *  - "lucide/swords", "solar/layers-bold", "mdi:home" → Iconify API (any of 200k icons)
 *  - "swords" (bare name) → lucide
 *  - "https://…" / "data:" / "/path.svg" → image
 *  - "rbxassetid://…" → can't load on the web, falls back to a generic icon
 */
export function resolveIconUrl(icon: string): string | null {
  if (!icon) return null;
  if (/^(https?:|data:|blob:|\/|\.\/)/.test(icon)) return icon;
  if (icon.startsWith("rbxasset")) return null;
  const m = /^([a-z0-9-]+)[/:]([a-z0-9-]+)$/i.exec(icon);
  if (m) return `https://api.iconify.design/${m[1]}/${m[2]}.svg`;
  if (/^[a-z0-9-]+$/i.test(icon)) return `https://api.iconify.design/lucide/${icon}.svg`;
  return null;
}

/** Creates an icon element. Iconify SVGs are rendered as a CSS mask so they follow `color`. */
export function createIcon(icon: string | undefined, size = 16, color?: string): HTMLElement | null {
  if (!icon) return null;
  if (icon.startsWith("builtin:")) return builtinIcon(icon.slice(8), size);
  const url = resolveIconUrl(icon);
  if (!url) return builtinIcon("layers", size);
  const isIconify = url.startsWith("https://api.iconify.design/");
  const isSvg = isIconify || /\.svg(\?|$)/i.test(url);
  if (isSvg && isIconify) {
    return h("span", {
      class: "fl-icon fl-icon-mask",
      style: {
        width: `${size}px`,
        height: `${size}px`,
        maskImage: `url("${url}")`,
        webkitMaskImage: `url("${url}")`,
        ...(color ? { backgroundColor: color } : {}),
      },
    });
  }
  return h("img", { class: "fl-icon fl-icon-img", src: url, alt: "", style: { width: `${size}px`, height: `${size}px` } });
}
