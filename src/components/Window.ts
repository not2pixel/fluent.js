import { clamp, h, setRich } from "../core/dom";
import { builtinIcon, createIcon } from "../core/icons";
import { toCss } from "../core/color";
import { toCode } from "../core/keys";
import type { FluentLibrary } from "../library";
import { readSize, type TabConfig, type WindowConfig } from "../types";
import { Tab } from "./Tab";
import { Dialog, type DialogInternalConfig } from "./Dialog";

interface Searchable {
  getText: () => string;
}

/** Port of Components/Window.lua + TitleBar.lua */
export class Window {
  readonly Root: HTMLElement;
  /** Layer above the window content for popups (dropdowns, dialogs). Not clipped. */
  readonly Overlay: HTMLElement;
  readonly ScrollContainer: HTMLElement;
  readonly Tabs: Tab[] = [];
  SelectedTab: Tab | null = null;
  Minimized = false;
  Maximized = false;
  TabWidth: number;
  Size: [number, number];
  MinimizeKey: string;

  private host: HTMLElement;
  private inner: HTMLElement;
  private tabList: HTMLElement;
  private selector: HTMLElement;
  private tabTitle: HTMLElement;
  private tabTitleText: HTMLElement;
  private content: HTMLElement;
  private searchInput: HTMLInputElement | null = null;
  private restorePill: HTMLElement;
  private titleEl: HTMLElement;
  private subTitleEl: HTMLElement;
  private searchables = new Map<HTMLElement, Searchable>();
  private outsideSides = new Set<"left" | "right">();
  private popups = new Set<{ Close(): void }>();
  private savedRect: { left: number; top: number; width: number; height: number } | null = null;
  private disposers: Array<() => void> = [];
  private destroyed = false;

  constructor(readonly Library: FluentLibrary, readonly Config: WindowConfig) {
    this.host = Config.Parent ?? Library.root;
    if (Config.Parent && getComputedStyle(Config.Parent).position === "static") Config.Parent.style.position = "relative";
    this.TabWidth = Config.TabWidth ?? 160;
    this.Size = readSize(Config.Size, [580, 460]);
    this.MinimizeKey = Config.MinimizeKey ?? "LeftControl";

    // ---------- Title bar ----------
    this.titleEl = h("span", { class: "fl-titlebar-title" });
    this.subTitleEl = h("span", { class: "fl-titlebar-subtitle" });
    setRich(this.titleEl, Config.Title ?? "Fluent");
    setRich(this.subTitleEl, Config.SubTitle ?? "");
    const tags = (Config.Tags ?? []).map((t) => {
      const tag = h("span", { class: "fl-tag" });
      setRich(tag, t.Text.trim());
      if (t.Color) tag.style.setProperty("--fl-tag-color", toCss(t.Color)!);
      return tag;
    });
    if (Config.Version) tags.push(h("span", { class: "fl-tag fl-tag-version", text: Config.Version }));

    const btn = (icon: string, label: string, fn: () => void, cls = "") => {
      const b = h("button", { class: `fl-titlebar-btn ${cls}`, type: "button", title: label, "aria-label": label }, [builtinIcon(icon, 14)]);
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        fn();
      });
      return b;
    };
    const maxBtn = btn("maximize", "Maximize", () => {
      this.ToggleMaximize();
      maxBtn.replaceChildren(builtinIcon(this.Maximized ? "restore" : "maximize", 14));
    });
    const titleIcon = createIcon(Config.TitleIcon ?? Config.Icons, 18);
    const titleBar = h("div", { class: "fl-titlebar" }, [
      h("div", { class: "fl-titlebar-left" }, [
        titleIcon,
        this.titleEl,
        this.subTitleEl,
        tags.length ? h("div", { class: "fl-tags" }, tags) : null,
      ]),
      h("div", { class: "fl-titlebar-buttons" }, [
        btn("minimize", "Minimize", () => this.Minimize()),
        maxBtn,
        Config.Closable === false ? null : btn("close", "Close", () => this.confirmClose(), "fl-close"),
      ]),
    ]);
    titleBar.addEventListener("dblclick", (e) => {
      if ((e.target as HTMLElement).closest("button")) return;
      maxBtn.click();
    });

    // ---------- Sidebar ----------
    this.selector = h("div", { class: "fl-tab-selector" });
    this.tabList = h("div", { class: "fl-tab-list" }, [this.selector]);
    const sidebarTop: HTMLElement[] = [];
    const userCard = this.buildUserInfo();
    if (userCard && (Config.UserInfoTop ?? true)) sidebarTop.push(userCard);
    if (Config.Search) {
      this.searchInput = h("input", { class: "fl-search-input", type: "search", placeholder: "Search", spellcheck: "false" });
      this.searchInput.addEventListener("input", () => this.applySearch());
      sidebarTop.push(h("label", { class: "fl-search" }, [builtinIcon("search", 14), this.searchInput]));
    }
    const sidebar = h("nav", { class: "fl-sidebar", style: { width: `${this.TabWidth}px` } }, [
      ...sidebarTop,
      h("div", { class: "fl-tab-scroll" }, [this.tabList]),
      userCard && Config.UserInfoTop === false ? userCard : null,
    ]);

    // ---------- Content ----------
    this.tabTitleText = h("span");
    this.tabTitle = h("div", { class: "fl-content-title" }, [this.tabTitleText]);
    this.content = h("div", { class: "fl-content-inner" });
    this.ScrollContainer = h("div", { class: "fl-content-scroll" }, [this.content]);
    const contentCol = h("main", { class: "fl-content" }, [this.tabTitle, this.ScrollContainer]);

    const resize = h("div", { class: "fl-resize", title: "Resize" }, [builtinIcon("resize", 12)]);

    this.inner = h("div", { class: "fl-window-inner" }, [
      h("div", { class: "fl-acrylic" }, [h("div", { class: "fl-acrylic-gradient" }), h("div", { class: "fl-acrylic-image" }), h("div", { class: "fl-acrylic-noise" })]),
      titleBar,
      h("div", { class: "fl-titlebar-line" }),
      h("div", { class: "fl-body" }, [sidebar, contentCol]),
      resize,
    ]);
    this.Overlay = h("div", { class: "fl-overlay" });
    this.Root = h("div", { class: "fl-window fl-opening" }, [h("div", { class: "fl-window-shine" }), this.inner, this.Overlay]);
    this.Root.style.width = `${this.Size[0]}px`;
    this.Root.style.height = `${this.Size[1]}px`;

    this.restorePill = h("button", { class: "fl-restore-pill", type: "button" }, [
      titleIcon?.cloneNode(true) ?? builtinIcon("layers", 14),
      h("span", { text: this.titleEl.textContent || "Open" }),
    ]);
    this.restorePill.addEventListener("click", () => this.Minimize(false));

    this.host.append(this.Root, this.restorePill);
    Library.track(this.Root);
    Library.track(this.restorePill);

    // Position: centered in host unless specified. Re-centered on the next frame because
    // userscripts can run before the viewport has its final size.
    const place = () => {
      const [hostW, hostH] = this.hostSize();
      const pos = Config.Position
        ? readSize(Config.Position, [0, 0])
        : [Math.max(8, (hostW - this.Size[0]) / 2), Math.max(8, (hostH - this.Size[1]) / 2)];
      this.Root.style.left = `${pos[0]}px`;
      this.Root.style.top = `${pos[1]}px`;
    };
    place();
    requestAnimationFrame(() => {
      place();
      requestAnimationFrame(() => this.Root.classList.remove("fl-opening"));
    });

    this.setupDrag(titleBar);
    this.setupResize(resize);
    this.setupMinimizeKey();
    const ro = new ResizeObserver(() => this.moveSelector());
    ro.observe(this.tabList);
    this.disposers.push(() => ro.disconnect());
  }

  // ------------------------------------------------------------------ public API

  AddTab(cfg: TabConfig): Tab {
    const tab = new Tab(this.Library, this, cfg, this.Tabs.length);
    this.Tabs.push(tab);
    this.tabList.append(tab.Button);
    this.content.append(tab.Root);
    if (!this.SelectedTab) this.SelectTab(0);
    return tab;
  }

  /** 0-based index (Luau used 1-based; numbers ≥ Tabs.length are clamped). */
  SelectTab(index: number) {
    const tab = this.Tabs[clamp(index, 0, this.Tabs.length - 1)];
    if (!tab || tab === this.SelectedTab) return;
    this.closePopups();
    this.SelectedTab?.Button.classList.remove("fl-selected");
    this.SelectedTab?.Root.classList.remove("fl-active");
    this.SelectedTab = tab;
    tab.Button.classList.add("fl-selected");
    tab.Root.classList.add("fl-active");
    this.ScrollContainer.scrollTop = 0;
    this.refreshTabTitle();
    this.moveSelector();
    if (this.searchInput?.value) {
      this.searchInput.value = "";
      this.applySearch();
    }
  }

  refreshTabTitle() {
    if (!this.SelectedTab) return;
    this.tabTitleText.innerHTML = this.SelectedTab.DisplayTitle;
    this.tabTitle.classList.remove("fl-title-anim");
    void this.tabTitle.offsetWidth;
    this.tabTitle.classList.add("fl-title-anim");
  }

  Dialog(cfg: DialogInternalConfig): Dialog {
    this.closePopups();
    return new Dialog(this.Library, this.Overlay, cfg);
  }

  Minimize(value = !this.Minimized) {
    this.Minimized = value;
    this.closePopups();
    this.Root.classList.toggle("fl-minimized", value);
    this.restorePill.classList.toggle("fl-visible", value);
  }
  Show() {
    this.Minimize(false);
  }
  Hide() {
    this.Minimize(true);
  }

  ToggleMaximize(value = !this.Maximized) {
    this.Maximized = value;
    const s = this.Root.style;
    if (value) {
      this.savedRect = { left: this.Root.offsetLeft, top: this.Root.offsetTop, width: this.Root.offsetWidth, height: this.Root.offsetHeight };
      const [w, hgt] = this.hostSize();
      Object.assign(s, { left: "8px", top: "8px", width: `${w - 16}px`, height: `${hgt - 16}px` });
    } else if (this.savedRect) {
      const r = this.savedRect;
      Object.assign(s, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    }
    this.Root.classList.toggle("fl-maximized", value);
    setTimeout(() => this.moveSelector(), 260);
  }

  SetTitle(t: string) {
    setRich(this.titleEl, t);
  }
  SetSubTitle(t: string) {
    setRich(this.subTitleEl, t);
  }
  SetMinimizeKey(key: string) {
    this.MinimizeKey = key;
  }

  Destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.closePopups();
    for (const [flag, opt] of Object.entries(this.Library.Options)) {
      if ((opt as any).ctx?.window === this) {
        try {
          opt.Destroy?.();
        } catch {
          /* ignore */
        }
        delete this.Library.Options[flag];
      }
    }
    this.disposers.forEach((fn) => fn());
    this.Library.untrack(this.Root);
    this.Library.untrack(this.restorePill);
    this.Root.remove();
    this.restorePill.remove();
    const i = this.Library.Windows.indexOf(this);
    if (i >= 0) this.Library.Windows.splice(i, 1);
  }

  // ------------------------------------------------------------------ internals used by elements

  /** Registers cleanup to run when the window is destroyed (global listeners, media…). */
  OnDestroy(fn: () => void) {
    this.disposers.push(fn);
  }

  registerSearchable(frame: HTMLElement, getText: () => string) {
    this.searchables.set(frame, { getText });
  }
  unregisterSearchable(frame: HTMLElement) {
    this.searchables.delete(frame);
  }

  registerPopup(p: { Close(): void }) {
    this.popups.add(p);
  }

  /** Closes open dropdowns/popups. `keepOutside` leaves DropdownOutsideWindow panels open. */
  closePopups(except?: { Close(): void }, keepOutside = false) {
    for (const p of this.popups) if (p !== except) p.Close();
    for (const opt of Object.values(this.Library.Options)) {
      const o = opt as any;
      if (o === except || !o.Opened || typeof o.Close !== "function" || o.ctx?.window !== this) continue;
      if (keepOutside && o.cfg?.DropdownOutsideWindow) continue;
      o.Close();
    }
  }

  claimOutsideSide(): "left" | "right" {
    const side = !this.outsideSides.has("right") ? "right" : !this.outsideSides.has("left") ? "left" : "right";
    this.outsideSides.add(side);
    return side;
  }
  releaseOutsideSide(side: "left" | "right") {
    this.outsideSides.delete(side);
  }

  // ------------------------------------------------------------------ private

  private buildUserInfo(): HTMLElement | null {
    const c = this.Config;
    if (!c.UserInfoTitle && !c.UserInfoSubtitle && !c.UserInfo && !c.UserInfoTop) return null;
    const avatar = c.UserInfoAvatar ? h("img", { class: "fl-user-avatar", src: c.UserInfoAvatar, alt: "" }) : h("div", { class: "fl-user-avatar" }, [builtinIcon("user", 18)]);
    const title = h("div", { class: "fl-user-title" });
    const sub = h("div", { class: "fl-user-sub" });
    setRich(title, c.UserInfoTitle ?? "User");
    setRich(sub, c.UserInfoSubtitle ?? "");
    const card = h("div", { class: "fl-user" }, [avatar, h("div", { class: "fl-user-text" }, [title, sub])]);
    if (c.UserInfoColor) card.style.setProperty("--fl-user-color", toCss(c.UserInfoColor)!);
    return card;
  }

  private hostSize(): [number, number] {
    if (this.host === this.Library.root) return [window.innerWidth, window.innerHeight];
    return [this.host.clientWidth, this.host.clientHeight];
  }

  private moveSelector() {
    const b = this.SelectedTab?.Button;
    if (!b) return;
    this.selector.style.transform = `translateY(${b.offsetTop + b.offsetHeight / 2 - 8}px)`;
    this.selector.style.opacity = "1";
  }

  private applySearch() {
    const q = (this.searchInput?.value ?? "").trim().toLowerCase();
    this.content.classList.toggle("fl-searching", !!q);
    for (const [frame, s] of this.searchables) {
      frame.classList.toggle("fl-search-hidden", !!q && !s.getText().toLowerCase().includes(q));
    }
    // hide empty sections / tabs while searching
    this.content.querySelectorAll<HTMLElement>(".fl-section").forEach((sec) => {
      const any = [...this.searchables.keys()].some((f) => sec.contains(f) && !f.classList.contains("fl-search-hidden"));
      sec.classList.toggle("fl-search-hidden", !!q && !any);
    });
    for (const tab of this.Tabs) {
      const any = [...this.searchables.keys()].some((f) => tab.Root.contains(f) && !f.classList.contains("fl-search-hidden"));
      tab.Root.classList.toggle("fl-search-match", !!q && any);
    }
    this.tabTitleText.innerHTML = q ? "Search results" : this.SelectedTab?.DisplayTitle ?? "";
  }

  private setupDrag(handle: HTMLElement) {
    handle.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || (e.target as HTMLElement).closest("button, input, a")) return;
      if (this.Maximized) return;
      const startX = e.clientX,
        startY = e.clientY;
      const left = this.Root.offsetLeft,
        top = this.Root.offsetTop;
      handle.setPointerCapture(e.pointerId);
      this.Root.classList.add("fl-dragging");
      const move = (ev: PointerEvent) => {
        const [w, hgt] = this.hostSize();
        const nl = clamp(left + ev.clientX - startX, -this.Root.offsetWidth + 80, w - 80);
        const nt = clamp(top + ev.clientY - startY, 0, hgt - 40);
        this.Root.style.left = `${nl}px`;
        this.Root.style.top = `${nt}px`;
      };
      const up = () => {
        this.Root.classList.remove("fl-dragging");
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", up);
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
    });
  }

  private setupResize(handle: HTMLElement) {
    handle.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || this.Maximized) return;
      e.preventDefault();
      const sx = e.clientX,
        sy = e.clientY;
      const w = this.Root.offsetWidth,
        hgt = this.Root.offsetHeight;
      handle.setPointerCapture(e.pointerId);
      this.Root.classList.add("fl-resizing");
      const move = (ev: PointerEvent) => {
        this.Root.style.width = `${Math.max(this.TabWidth + 300, w + ev.clientX - sx)}px`;
        this.Root.style.height = `${Math.max(320, hgt + ev.clientY - sy)}px`;
        this.closePopups();
      };
      const up = () => {
        this.Root.classList.remove("fl-resizing");
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", up);
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
    });
  }

  private setupMinimizeKey() {
    const onKey = (e: KeyboardEvent) => {
      const a = document.activeElement as HTMLElement | null;
      if (a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.isContentEditable)) return;
      if (e.code === toCode(this.MinimizeKey)) this.Minimize();
    };
    document.addEventListener("keydown", onKey);
    this.disposers.push(() => document.removeEventListener("keydown", onKey));
  }

  private confirmClose() {
    this.Dialog({
      Title: "Close",
      Content: "Are you sure you want to unload the interface?",
      Buttons: [{ Title: "Yes", Callback: () => this.Destroy() }, { Title: "No" }],
    });
  }
}
