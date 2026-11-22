import { h, richText } from "../core/dom";
import { builtinIcon } from "../core/icons";
import { ElementFrame, ValueElement, type ElementContext } from "./base";
import type { DropdownConfig, DropdownValue } from "../types";

export class Dropdown extends ValueElement<DropdownValue> {
  readonly Type = "Dropdown";
  readonly Element: ElementFrame;
  Values: string[];
  readonly Multi: boolean;
  AllowNull: boolean;
  Opened = false;

  private display: HTMLButtonElement;
  private displayText: HTMLElement;
  private panel: HTMLElement;
  private list: HTMLElement;
  private search: HTMLInputElement | null = null;
  private side: "left" | "right" | null = null;
  private cleanup: Array<() => void> = [];

  constructor(ctx: ElementContext, flag: string | undefined, private cfg: DropdownConfig) {
    super(ctx, flag);
    this.Callback = cfg.Callback;
    this.Values = [...(cfg.Values ?? [])];
    this.Multi = !!cfg.Multi;
    this.AllowNull = !!cfg.AllowNull;
    this.Value = this.Multi ? {} : null;
    this.applyDefault(cfg.Default);

    this.Element = new ElementFrame(ctx, {
      title: cfg.Title,
      description: cfg.Description,
      icon: cfg.Icon,
      iconColor: cfg.IconColor,
      className: "fl-dropdown",
    });
    this.displayText = h("span", { class: "fl-dropdown-text" });
    this.display = h("button", { class: "fl-dropdown-display", type: "button" }, [this.displayText, builtinIcon("chevronDown", 14)]);
    this.display.addEventListener("click", (e) => {
      e.stopPropagation();
      this.Opened ? this.Close() : this.Open();
    });
    this.Element.Right.append(this.display);

    this.list = h("div", { class: "fl-dropdown-list" });
    const searchable = cfg.Searchable ?? this.Values.length > 8;
    if (searchable) {
      this.search = h("input", { class: "fl-dropdown-search", type: "text", placeholder: "Search…", spellcheck: "false" });
      this.search.addEventListener("input", () => this.BuildList());
    }
    this.panel = h(
      "div",
      {
        class: `fl-dropdown-panel ${cfg.Animated ? "fl-dropdown-animated" : ""} ${cfg.DropdownOutsideWindow ? "fl-dropdown-outside" : ""}`,
      },
      [
        cfg.DropdownBackgroundImages ? h("div", { class: "fl-dropdown-bgimg", style: { backgroundImage: `url("${cfg.DropdownBackgroundImages}")` } }) : null,
        cfg.DropdownOutsideWindow ? h("div", { class: "fl-dropdown-panel-title", html: richText(cfg.Title ?? "") }) : null,
        this.search,
        this.list,
      ]
    );
    if (cfg.DropdownBackgroundTransparency !== undefined)
      this.panel.style.setProperty("--fl-dd-alpha", String(1 - cfg.DropdownBackgroundTransparency));
    this.panel.addEventListener("pointerdown", (e) => e.stopPropagation());

    this.Display();
    if (this.Value !== null) ctx.library.SafeCallback(this.Callback, this.Value);
  }

  get Frame() {
    return this.Element.Frame;
  }

  private applyDefault(def: DropdownConfig["Default"]) {
    if (def === undefined || def === null) return;
    if (this.Multi) {
      const v: Record<string, boolean> = {};
      if (Array.isArray(def)) def.forEach((k) => this.Values.includes(k) && (v[k] = true));
      else if (typeof def === "object") Object.entries(def).forEach(([k, on]) => on && this.Values.includes(k) && (v[k] = true));
      else if (typeof def === "string" && this.Values.includes(def)) v[def] = true;
      this.Value = v;
    } else {
      // Luau accepts an index (1-based) or a value.
      const val = typeof def === "number" ? this.Values[def - 1] : Array.isArray(def) ? def[0] : typeof def === "string" ? def : null;
      this.Value = val && this.Values.includes(val) ? val : null;
    }
  }

  /** Returns selected values as an array. */
  GetActiveValues(): string[] {
    if (this.Multi) return Object.keys((this.Value as Record<string, boolean>) ?? {}).filter((k) => (this.Value as Record<string, boolean>)[k]);
    return this.Value ? [this.Value as string] : [];
  }

  Display() {
    const active = this.GetActiveValues();
    const text = active.length ? active.join(", ") : "--";
    this.displayText.textContent = text;
    this.display.title = text;
    this.Element.Frame.classList.toggle("fl-empty", !active.length);
  }

  BuildList() {
    const q = this.search?.value.trim().toLowerCase() ?? "";
    const active = new Set(this.GetActiveValues());
    this.list.replaceChildren(
      ...this.Values.filter((v) => !q || v.toLowerCase().includes(q)).map((v) => {
        const opt = h("button", { class: `fl-dropdown-option ${active.has(v) ? "fl-selected" : ""}`, type: "button" }, [
          h("span", { class: "fl-dropdown-option-bar" }),
          h("span", { class: "fl-dropdown-option-text", html: richText(v) }),
          this.Multi ? h("span", { class: "fl-dropdown-option-check" }, [builtinIcon("check", 12)]) : null,
        ]);
        opt.addEventListener("click", () => this.select(v));
        return opt;
      })
    );
    if (!this.list.children.length) this.list.append(h("div", { class: "fl-dropdown-empty", text: "No results" }));
  }

  private select(v: string) {
    if (this.Multi) {
      const cur = { ...((this.Value as Record<string, boolean>) ?? {}) };
      if (cur[v]) {
        if (!this.AllowNull && Object.keys(cur).filter((k) => cur[k]).length === 1) return;
        delete cur[v];
      } else cur[v] = true;
      this.Value = cur;
    } else {
      if (this.Value === v) {
        if (!this.AllowNull) {
          this.Close();
          return;
        }
        this.Value = null;
      } else this.Value = v;
    }
    this.Display();
    this.BuildList();
    this.emit();
    if (!this.Multi) this.Close();
  }

  Open() {
    if (this.Opened) return;
    // Outside-window panels can stay open side by side (they split left / right).
    this.ctx.window.closePopups(this, !!this.cfg.DropdownOutsideWindow);
    this.Opened = true;
    this.Element.Frame.classList.add("fl-open");
    this.BuildList();
    const overlay = this.ctx.window.Overlay;
    overlay.append(this.panel);
    if (this.cfg.DropdownOutsideWindow) {
      this.side = this.ctx.window.claimOutsideSide();
      this.panel.dataset.side = this.side;
    } else {
      this.position();
      const onScroll = () => this.position();
      const scroller = this.ctx.window.ScrollContainer;
      scroller.addEventListener("scroll", onScroll, { passive: true });
      this.cleanup.push(() => scroller.removeEventListener("scroll", onScroll));
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && this.Close();
    document.addEventListener("keydown", onKey);
    this.cleanup.push(() => document.removeEventListener("keydown", onKey));
    if (!this.cfg.DropdownOutsideWindow) {
      const onDoc = (e: PointerEvent) => {
        if (!this.panel.contains(e.target as Node) && !this.display.contains(e.target as Node)) this.Close();
      };
      setTimeout(() => document.addEventListener("pointerdown", onDoc), 0);
      this.cleanup.push(() => document.removeEventListener("pointerdown", onDoc));
    }
    requestAnimationFrame(() => this.panel.classList.add("fl-visible"));
    this.search?.focus({ preventScroll: true });
  }

  private position() {
    const win = this.ctx.window.Root.getBoundingClientRect();
    const d = this.display.getBoundingClientRect();
    const maxH = 240;
    const below = win.bottom - d.bottom - 12;
    const openUp = below < 140 && d.top - win.top > below;
    this.panel.style.left = `${d.left - win.left}px`;
    this.panel.style.width = `${Math.max(d.width, 170)}px`;
    this.panel.style.maxHeight = `${Math.min(maxH, Math.max(120, openUp ? d.top - win.top - 12 : below))}px`;
    if (openUp) {
      this.panel.style.top = "";
      this.panel.style.bottom = `${win.bottom - d.top + 4}px`;
    } else {
      this.panel.style.bottom = "";
      this.panel.style.top = `${d.bottom - win.top + 4}px`;
    }
    // Hide when the display scrolls out of the content area.
    const sc = this.ctx.window.ScrollContainer.getBoundingClientRect();
    this.panel.style.visibility = d.bottom < sc.top || d.top > sc.bottom ? "hidden" : "";
  }

  Close() {
    if (!this.Opened) return;
    this.Opened = false;
    this.Element.Frame.classList.remove("fl-open");
    this.cleanup.forEach((fn) => fn());
    this.cleanup = [];
    if (this.side) this.ctx.window.releaseOutsideSide(this.side);
    this.side = null;
    this.panel.classList.remove("fl-visible");
    setTimeout(() => !this.Opened && this.panel.remove(), 160);
    if (this.search) this.search.value = "";
  }

  SetValues(values: string[]) {
    this.Values = [...values];
    if (this.Multi) {
      const cur = (this.Value as Record<string, boolean>) ?? {};
      this.Value = Object.fromEntries(Object.keys(cur).filter((k) => values.includes(k)).map((k) => [k, true]));
    } else if (this.Value && !values.includes(this.Value as string)) this.Value = null;
    this.Display();
    if (this.Opened) this.BuildList();
  }
  /** Alias kept for scripts written against older Fluent versions. */
  Refresh(values: string[]) {
    this.SetValues(values);
  }

  SetValue(value: unknown) {
    this.applyDefault(value === null ? undefined : (value as DropdownConfig["Default"]));
    if (value === null || value === undefined) this.Value = this.Multi ? {} : null;
    this.Display();
    if (this.Opened) this.BuildList();
    this.emit();
  }
  SetTitle(t: string) {
    this.Element.SetTitle(t);
  }
  SetDesc(t: string) {
    this.Element.SetDesc(t);
  }
  Destroy() {
    this.Close();
    this.Element.Destroy();
    this.unregister();
  }
}
