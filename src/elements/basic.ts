import { h, setRich } from "../core/dom";
import { builtinIcon } from "../core/icons";
import { ElementFrame, type ElementContext } from "./base";
import type { ButtonConfig, CodeConfig, ParagraphConfig } from "../types";

export class Paragraph {
  readonly Type = "Paragraph";
  readonly Element: ElementFrame;
  constructor(ctx: ElementContext, cfg: ParagraphConfig) {
    this.Element = new ElementFrame(ctx, { title: cfg.Title, description: cfg.Content, icon: cfg.Icon, className: "fl-paragraph" });
  }
  get Frame() {
    return this.Element.Frame;
  }
  SetTitle(t: string) {
    this.Element.SetTitle(t);
  }
  SetDesc(t: string) {
    this.Element.SetDesc(t);
  }
  SetContent(t: string) {
    this.Element.SetDesc(t);
  }
  Destroy() {
    this.Element.Destroy();
  }
}

export class Button {
  readonly Type = "Button";
  readonly Element: ElementFrame;
  Callback?: () => void;
  constructor(ctx: ElementContext, cfg: ButtonConfig) {
    this.Callback = cfg.Callback;
    this.Element = new ElementFrame(ctx, {
      title: cfg.Title,
      description: cfg.Description,
      icon: cfg.Icon,
      iconColor: cfg.IconColor,
      clickable: true,
      className: "fl-button",
    });
    this.Element.Right.append(builtinIcon("chevronRight", 16));
    this.Element.Frame.addEventListener("click", (e) => {
      ripple(this.Element.Frame, e as MouseEvent);
      ctx.library.SafeCallback(this.Callback);
    });
  }
  get Frame() {
    return this.Element.Frame;
  }
  SetTitle(t: string) {
    this.Element.SetTitle(t);
  }
  SetDesc(t: string) {
    this.Element.SetDesc(t);
  }
  Destroy() {
    this.Element.Destroy();
  }
}

export function ripple(el: HTMLElement, e: MouseEvent) {
  const r = el.getBoundingClientRect();
  const size = Math.max(r.width, r.height) * 2;
  const dot = h("span", {
    class: "fl-ripple",
    style: { width: `${size}px`, height: `${size}px`, left: `${e.clientX - r.left - size / 2}px`, top: `${e.clientY - r.top - size / 2}px` },
  });
  el.append(dot);
  setTimeout(() => dot.remove(), 600);
}

export class Divider {
  readonly Type = "Divider";
  readonly Frame: HTMLElement;
  constructor(ctx: ElementContext) {
    this.Frame = h("div", { class: "fl-divider" });
    ctx.container.append(this.Frame);
  }
  Destroy() {
    this.Frame.remove();
  }
}

export class Space {
  readonly Type = "Space";
  readonly Frame: HTMLElement;
  constructor(ctx: ElementContext, cfg: { Height?: number } = {}) {
    this.Frame = h("div", { class: "fl-space", style: { height: `${cfg.Height ?? 8}px` } });
    ctx.container.append(this.Frame);
  }
  SetHeight(px: number) {
    this.Frame.style.height = `${px}px`;
  }
  Destroy() {
    this.Frame.remove();
  }
}

const LUA_KW = /\b(local|function|end|if|then|else|elseif|for|in|do|while|repeat|until|return|not|and|or|nil|true|false|break)\b/g;
const JS_KW = /\b(const|let|var|function|return|if|else|for|of|in|while|new|class|extends|import|from|export|await|async|null|undefined|true|false|this|typeof)\b/g;

function highlight(code: string, lang: CodeConfig["Language"]): string {
  const esc = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (lang === "plain") return esc;
  // Tokenise strings & comments first so keywords inside them are not touched.
  const tokens: string[] = [];
  const stash = (cls: string) => (m: string) => {
    tokens.push(`<span class="fl-tok-${cls}">${m}</span>`);
    return `\u0000${tokens.length - 1}\u0000`;
  };
  let out = esc
    .replace(lang === "lua" ? /--[^\n]*/g : /\/\/[^\n]*/g, stash("comment"))
    .replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/g, stash("string"))
    .replace(lang === "lua" ? LUA_KW : JS_KW, '<span class="fl-tok-kw">$1</span>')
    .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="fl-tok-num">$1</span>')
    .replace(/\b([A-Za-z_]\w*)(?=\s*\()/g, '<span class="fl-tok-fn">$1</span>');
  out = out.replace(/\u0000(\d+)\u0000/g, (_, i) => tokens[Number(i)]);
  return out;
}

export class Code {
  readonly Type = "Code";
  readonly Frame: HTMLElement;
  private pre: HTMLElement;
  private titleEl: HTMLElement;
  private code = "";
  constructor(private ctx: ElementContext, private cfg: CodeConfig) {
    this.titleEl = h("div", { class: "fl-code-title" });
    setRich(this.titleEl, cfg.Title ?? "Code");
    const copyBtn = h("button", { class: "fl-code-copy", type: "button", title: "Copy" }, [builtinIcon("copy", 14), h("span", { text: "Copy" })]);
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(this.code);
      } catch {
        /* clipboard may be blocked (file://, permissions) */
      }
      copyBtn.classList.add("fl-copied");
      (copyBtn.lastChild as HTMLElement).textContent = "Copied!";
      setTimeout(() => {
        copyBtn.classList.remove("fl-copied");
        (copyBtn.lastChild as HTMLElement).textContent = "Copy";
      }, 1400);
      ctx.library.SafeCallback(cfg.OnCopy);
    });
    this.pre = h("pre", { class: "fl-code-pre" });
    this.Frame = h("div", { class: "fl-element fl-code" }, [h("div", { class: "fl-code-head" }, [this.titleEl, copyBtn]), this.pre]);
    ctx.container.append(this.Frame);
    ctx.window.registerSearchable(this.Frame, () => `${this.titleEl.textContent} ${this.code}`);
    this.SetCode(cfg.Code ?? "");
  }
  SetCode(code: string) {
    this.code = code;
    const lang = this.cfg.Language ?? (/\blocal\b|\bend\b|:\w+\(/.test(code) ? "lua" : "js");
    this.pre.innerHTML = highlight(code, lang);
  }
  SetTitle(t: string) {
    setRich(this.titleEl, t);
  }
  Destroy() {
    this.ctx.window.unregisterSearchable(this.Frame);
    this.Frame.remove();
  }
}

