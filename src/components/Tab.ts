import { h, setRich } from "../core/dom";
import { createIcon } from "../core/icons";
import type { FluentLibrary } from "../library";
import type { Window } from "./Window";
import { Container } from "./Container";
import type { TabConfig } from "../types";

export class Tab extends Container {
  readonly Type = "Tab";
  readonly Title: string;
  readonly Button: HTMLButtonElement;
  readonly Root: HTMLElement;
  readonly Index: number;
  private titleEl: HTMLElement;

  constructor(library: FluentLibrary, window: Window, cfg: TabConfig, index: number) {
    const root = h("div", { class: "fl-tab-container" });
    super(library, window, root);
    this.Root = root;
    this.Index = index;
    this.Title = cfg.Title;
    this.titleEl = h("span", { class: "fl-tab-title" });
    setRich(this.titleEl, cfg.Title.replace(/^\|\s*/, ""));
    this.Button = h("button", { class: "fl-tab-button", type: "button", title: this.titleEl.textContent ?? "" }, [
      createIcon(cfg.Icon, 16),
      this.titleEl,
    ]);
    this.Button.addEventListener("click", () => window.SelectTab(this.Index));
    root.dataset.tabTitle = this.titleEl.textContent ?? "";
  }

  get DisplayTitle() {
    return this.titleEl.innerHTML;
  }

  SetTitle(t: string) {
    setRich(this.titleEl, t);
    this.Root.dataset.tabTitle = this.titleEl.textContent ?? "";
    if (this.Window.SelectedTab === this) this.Window.refreshTabTitle();
  }

  Select() {
    this.Window.SelectTab(this.Index);
  }
}
