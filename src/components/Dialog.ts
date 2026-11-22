import { h, setRich } from "../core/dom";
import type { DialogConfig } from "../types";
import type { FluentLibrary } from "../library";

export interface DialogInternalConfig extends DialogConfig {
  /** Custom DOM body (used by Colorpicker). */
  Body?: HTMLElement;
}

export class Dialog {
  readonly Root: HTMLElement;
  readonly Input: HTMLInputElement | null = null;
  private closed = false;

  constructor(private library: FluentLibrary, host: HTMLElement, cfg: DialogInternalConfig) {
    const title = h("div", { class: "fl-dialog-title" });
    setRich(title, cfg.Title ?? "Dialog");
    const content = cfg.Content ? h("div", { class: "fl-dialog-content" }) : null;
    if (content) setRich(content, cfg.Content);
    if (cfg.Input) {
      this.Input = h("input", {
        class: "fl-dialog-input",
        type: "text",
        placeholder: cfg.Input.Placeholder ?? "",
        spellcheck: "false",
      });
      this.Input.value = cfg.Input.Default ?? "";
    }
    const buttons = (cfg.Buttons?.length ? cfg.Buttons : [{ Title: "OK" }]).map((b) => {
      const btn = h("button", { class: "fl-dialog-button", type: "button" });
      setRich(btn, b.Title);
      btn.addEventListener("click", () => {
        this.Close();
        this.library.SafeCallback(b.Callback, this.Input?.value);
      });
      return btn;
    });
    const box = h("div", { class: "fl-dialog", role: "dialog", "aria-modal": "true" }, [
      h("div", { class: "fl-dialog-main" }, [
        title,
        content,
        cfg.Body ?? null,
        this.Input ? h("label", { class: "fl-textbox-wrap fl-dialog-input-wrap" }, [this.Input, h("span", { class: "fl-textbox-indicator" })]) : null,
      ]),
      h("div", { class: "fl-dialog-buttons", style: { gridTemplateColumns: `repeat(${buttons.length}, 1fr)` } }, buttons),
    ]);
    this.Root = h("div", { class: "fl-dialog-backdrop" }, [box]);
    this.Root.addEventListener("pointerdown", (e) => {
      if (e.target === this.Root) box.animate([{ transform: "scale(1)" }, { transform: "scale(1.02)" }, { transform: "scale(1)" }], { duration: 180 });
    });
    this.Root.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.Close();
      if (e.key === "Enter" && this.Input && document.activeElement === this.Input) buttons[0]?.click();
    });
    host.append(this.Root);
    requestAnimationFrame(() => {
      this.Root.classList.add("fl-visible");
      (this.Input ?? buttons[0])?.focus({ preventScroll: true });
    });
  }

  Close() {
    if (this.closed) return;
    this.closed = true;
    this.Root.classList.remove("fl-visible");
    setTimeout(() => this.Root.remove(), 180);
  }
}
