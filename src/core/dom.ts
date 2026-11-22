type Child = Node | string | null | undefined | false;
type Props = {
  class?: string;
  style?: Partial<CSSStyleDeclaration> | Record<string, string>;
  html?: string;
  text?: string;
  [attr: string]: unknown;
};

/** Tiny hyperscript helper: h("div", { class: "x", onclick }, [children]) */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Props = {},
  children: Child[] = []
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "class") el.className = String(v);
    else if (k === "style") Object.assign(el.style, v);
    else if (k === "html") el.innerHTML = String(v);
    else if (k === "text") el.textContent = String(v);
    else if (k.startsWith("on") && typeof v === "function")
      el.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
    else if (k in el && typeof v !== "string") (el as unknown as Record<string, unknown>)[k] = v;
    else el.setAttribute(k, v === true ? "" : String(v));
  }
  for (const c of children) if (c !== null && c !== undefined && c !== false) el.append(c);
  return el;
}

const ALLOWED_TAGS = new Set(["b", "i", "u", "s", "br", "font", "strong", "em", "sc", "uppercase", "stroke", "mark"]);

/**
 * Renders Roblox-style rich text (<b>, <i>, <font color="rgb(r,g,b)" size="22">, …)
 * into safe HTML. Anything not on the allow-list is escaped.
 */
export function richText(input: string | undefined | null): string {
  if (!input) return "";
  const escape = (s: string) => s.replace(/&(?!(lt|gt|amp|quot|apos);)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let out = "";
  const re = /<\/?([a-zA-Z]+)([^<>]*)>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  const stack: string[] = [];
  while ((m = re.exec(input))) {
    out += escape(input.slice(last, m.index)).replace(/\n/g, "<br>");
    last = re.lastIndex;
    const tag = m[1].toLowerCase();
    const closing = m[0].startsWith("</");
    if (!ALLOWED_TAGS.has(tag)) {
      out += escape(m[0]);
      continue;
    }
    if (tag === "br") {
      out += "<br>";
      continue;
    }
    const htmlTag = tag === "font" || tag === "stroke" || tag === "sc" || tag === "uppercase" ? "span" : tag;
    if (closing) {
      const idx = stack.lastIndexOf(htmlTag);
      if (idx >= 0) {
        out += `</${htmlTag}>`;
        stack.splice(idx, 1);
      }
      continue;
    }
    const style: string[] = [];
    const attr = (name: string) => new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i").exec(m![2])?.[1];
    if (tag === "font") {
      const color = attr("color");
      const size = attr("size");
      const face = attr("face");
      const weight = attr("weight");
      const transparency = attr("transparency");
      if (color && /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|[a-z]+)$/i.test(color)) style.push(`color:${color}`);
      if (size && /^\d+(\.\d+)?$/.test(size)) style.push(`font-size:${size}px`);
      if (face && /^[\w\s-]+$/.test(face)) style.push(`font-family:'${face}'`);
      if (weight && /^\w+$/.test(weight)) style.push(`font-weight:${/^\d+$/.test(weight) ? weight : weight.toLowerCase() === "bold" ? 700 : 400}`);
      if (transparency && /^[\d.]+$/.test(transparency)) style.push(`opacity:${1 - Number(transparency)}`);
    }
    if (tag === "sc") style.push("font-variant:small-caps");
    if (tag === "uppercase") style.push("text-transform:uppercase");
    if (tag === "mark") {
      const color = attr("color");
      if (color && /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\))$/i.test(color)) style.push(`background:${color}`);
    }
    out += `<${htmlTag}${style.length ? ` style="${style.join(";")}"` : ""}>`;
    stack.push(htmlTag);
  }
  out += escape(input.slice(last)).replace(/\n/g, "<br>");
  while (stack.length) out += `</${stack.pop()}>`;
  return out;
}

export function setRich(el: HTMLElement, text: string | undefined | null) {
  el.innerHTML = richText(text);
}

export function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function round(v: number, decimals: number) {
  const f = Math.pow(10, Math.max(0, decimals));
  return Math.round(v * f) / f;
}

/** Pointer drag helper that works for mouse + touch. */
export function onDrag(
  target: HTMLElement,
  handlers: { start?: (e: PointerEvent) => void; move: (e: PointerEvent) => void; end?: (e: PointerEvent) => void }
) {
  target.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    target.setPointerCapture(e.pointerId);
    handlers.start?.(e);
    handlers.move(e);
    const move = (ev: PointerEvent) => handlers.move(ev);
    const up = (ev: PointerEvent) => {
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", up);
      target.removeEventListener("pointercancel", up);
      handlers.end?.(ev);
    };
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", up);
    target.addEventListener("pointercancel", up);
  });
}
