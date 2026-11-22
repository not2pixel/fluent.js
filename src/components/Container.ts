import { h, setRich } from "../core/dom";
import { builtinIcon, createIcon } from "../core/icons";
import type { FluentLibrary } from "../library";
import type { Window } from "./Window";
import type { ElementContext } from "../elements/base";
import { Button, Code, Divider, Paragraph, Space } from "../elements/basic";
import { Checkbox, Toggle } from "../elements/Toggle";
import { Slider } from "../elements/Slider";
import { Input } from "../elements/Input";
import { Dropdown } from "../elements/Dropdown";
import { Colorpicker } from "../elements/Colorpicker";
import { Keybind } from "../elements/Keybind";
import { Audio, ImageElement, ProgressBar, Video, Viewport } from "../elements/media";
import { Discord, Social } from "../elements/social";
import type {
  AudioConfig,
  ButtonConfig,
  CodeConfig,
  ColorpickerConfig,
  DiscordConfig,
  DropdownConfig,
  GroupConfig,
  ImageConfig,
  InputConfig,
  KeybindConfig,
  ParagraphConfig,
  ProgressBarConfig,
  SliderConfig,
  SocialConfig,
  ToggleConfig,
  VideoConfig,
  ViewportConfig,
} from "../types";

/**
 * Anything elements can be added to: Tab, Section, CollapsibleSection, Group column.
 * Value elements take a flag first, like the Luau API: sec.AddToggle("AutoFarm", { ... }).
 */
export class Container {
  constructor(readonly Library: FluentLibrary, readonly Window: Window, readonly Container: HTMLElement) {}

  protected get ctx(): ElementContext {
    return { library: this.Library, window: this.Window, container: this.Container };
  }

  AddSection(title: string, icon?: string) {
    return new Section(this, title, icon);
  }
  AddCollapsibleSection(title: string, icon?: string, open = true) {
    return new CollapsibleSection(this, title, icon, open);
  }
  AddGroup(cfg: GroupConfig = {}) {
    return new Group(this, cfg);
  }

  AddParagraph(cfg: ParagraphConfig) {
    return new Paragraph(this.ctx, cfg);
  }
  AddButton(cfg: ButtonConfig) {
    return new Button(this.ctx, cfg);
  }
  AddToggle(flag: string, cfg: ToggleConfig = {}) {
    return new Toggle(this.ctx, flag, cfg);
  }
  AddCheckbox(flag: string, cfg: ToggleConfig = {}) {
    return new Checkbox(this.ctx, flag, cfg);
  }
  AddSlider(flag: string, cfg: SliderConfig = {}) {
    return new Slider(this.ctx, flag, cfg);
  }
  AddInput(flag: string, cfg: InputConfig = {}) {
    return new Input(this.ctx, flag, cfg);
  }
  AddDropdown(flag: string, cfg: DropdownConfig = {}) {
    return new Dropdown(this.ctx, flag, cfg);
  }
  AddColorpicker(flag: string, cfg: ColorpickerConfig = {}) {
    return new Colorpicker(this.ctx, flag, cfg);
  }
  AddKeybind(flag: string, cfg: KeybindConfig = {}) {
    return new Keybind(this.ctx, flag, cfg);
  }
  AddProgressBar(flag: string | undefined, cfg: ProgressBarConfig = {}) {
    return new ProgressBar(this.ctx, flag, cfg);
  }
  AddCode(cfg: CodeConfig) {
    return new Code(this.ctx, cfg);
  }
  AddDivider() {
    return new Divider(this.ctx);
  }
  AddSpace(cfg: { Height?: number } = {}) {
    return new Space(this.ctx, cfg);
  }
  AddImage(cfg: ImageConfig) {
    return new ImageElement(this.ctx, cfg);
  }
  AddVideo(cfg: VideoConfig) {
    return new Video(this.ctx, cfg);
  }
  AddAudio(cfg: AudioConfig) {
    return new Audio(this.ctx, cfg);
  }
  AddViewport(cfg: ViewportConfig) {
    return new Viewport(this.ctx, cfg);
  }
  AddDiscord(cfg: DiscordConfig) {
    return new Discord(this.ctx, cfg);
  }
  AddSocial(cfg: SocialConfig) {
    return new Social(this.ctx, cfg);
  }
}

export class Section extends Container {
  readonly Type: string = "Section";
  readonly Root: HTMLElement;
  protected header: HTMLElement;
  protected titleEl: HTMLElement;

  constructor(parent: Container, title: string, icon?: string, extraClass = "") {
    const body = h("div", { class: "fl-section-body" });
    super(parent.Library, parent.Window, body);
    this.titleEl = h("span", { class: "fl-section-title" });
    setRich(this.titleEl, title);
    this.header = h("div", { class: "fl-section-header" }, [createIcon(icon, 16), this.titleEl]);
    this.Root = h("section", { class: `fl-section ${extraClass}` }, [this.header, body]);
    parent.Container.append(this.Root);
  }
  SetTitle(t: string) {
    setRich(this.titleEl, t);
  }
  Destroy() {
    this.Root.remove();
  }
}

export class CollapsibleSection extends Section {
  readonly Type = "CollapsibleSection";
  Opened: boolean;
  constructor(parent: Container, title: string, icon: string | undefined, open: boolean) {
    super(parent, title, icon, "fl-collapsible");
    this.Opened = open;
    const chevron = builtinIcon("chevronDown", 16);
    chevron.classList.add("fl-collapse-chevron");
    this.header.append(chevron);
    this.header.setAttribute("role", "button");
    this.header.tabIndex = 0;
    this.header.addEventListener("click", () => this.Toggle());
    this.header.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.Toggle()));
    // wrap body for height animation
    const wrap = h("div", { class: "fl-collapse-wrap" });
    this.Container.replaceWith(wrap);
    wrap.append(this.Container);
    this.render();
  }
  private render() {
    this.Root.classList.toggle("fl-collapsed", !this.Opened);
  }
  Toggle(open = !this.Opened) {
    this.Opened = open;
    this.render();
  }
  Open() {
    this.Toggle(true);
  }
  Close() {
    this.Toggle(false);
  }
}

export class Group {
  readonly Type = "Group";
  readonly Frame: HTMLElement;
  readonly Columns: Container[] = [];
  constructor(private parent: Container, cfg: GroupConfig) {
    this.Frame = h("div", { class: "fl-group", style: { gap: `${cfg.Gap ?? 6}px` } });
    this.Frame.style.gridTemplateColumns = `repeat(${Math.max(1, cfg.Columns ?? 2)}, minmax(0, 1fr))`;
    parent.Container.append(this.Frame);
  }
  /** Creates the next column; returns a container with the usual Add… methods. */
  AddElement(): Container {
    const col = h("div", { class: "fl-group-col" });
    this.Frame.append(col);
    const c = new Container(this.parent.Library, this.parent.Window, col);
    this.Columns.push(c);
    return c;
  }
  Destroy() {
    this.Frame.remove();
  }
}
