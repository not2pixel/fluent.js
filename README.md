# fluent.js

A Fluent-style UI library for the web, written in plain TypeScript with no framework and no runtime dependencies.
It is a port of the **Fluent** and **FluentPro** Roblox UI libraries. It gives you draggable acrylic windows, tabs, sections, toggles,
sliders, dropdowns, color pickers, keybinds, dialogs, notifications and 23 built-in themes. It also includes a local playground where you
can edit code and see the result right away.

```ts
import Fluent from "fluent.js";

const Window = Fluent.CreateWindow({ Title: "fluent.js", SubTitle: "hello web", Theme: "Deep Violet" });
const Main = Window.AddTab({ Title: "Main", Icon: "lucide/home" });

Main.AddToggle("AutoFarm", {
  Title: "Auto farm",
  Default: false,
  Callback: (on) => console.log("AutoFarm:", on),
});
```

---

## Contents

- [Credits](#credits)
- [Installation](#installation)
- [Userscripts](#userscripts)
- [Playground](#playground)
- [Quick start](#quick-start)
- [Window](#window)
- [Tabs, sections & groups](#tabs-sections--groups)
- [Elements](#elements)
- [Options & flags](#options--flags)
- [Dialog & notifications](#dialog--notifications)
- [Themes](#themes)
- [Save & interface managers](#save--interface-managers)
- [Icons, rich text & keys](#icons-rich-text--keys)
- [Coming from the Luau version](#coming-from-the-luau-version)
- [Scripts](#scripts)
- [License](#license)

---

## Credits

fluent.js is built on the work of these projects:

- **[Fluent](https://github.com/dawid-scripts/Fluent)** by **dawid** is the original Roblox UI library. The design, the component set
  and the API (`CreateWindow`, `AddTab`, `AddToggle`, `Options`, …) all come from it.
- **[FluentPro / Fluent-modded](https://github.com/StyearX/Fluent-modded)** by **StyearX** and **Vraigos** is the modded version this
  port follows. It added search, tags, user info, collapsible sections, groups, media elements, Discord/Social cards, outside-window
  dropdowns, animated "shine" themes, and the theme set that ships here.

fluent.js re-implements those libraries for the browser using TypeScript and the DOM. All credit for the original design goes to the
authors above, and the original MIT license and copyright notices are kept in [`LICENSE`](LICENSE).

---

## Installation

fluent.js is not published to npm (the `fluent.js` name there belongs to another package), so install it straight from GitHub:

```bash
npm install github:not2pixel/fluent.js
```

`npm install` runs the `prepare` script, which builds `lib/` for you. Then:

```ts
import Fluent, { Color3, UDim2 } from "fluent.js"; // the CSS is included automatically by bundlers (Vite, webpack, …)
```

### Without a bundler

Build once (`npm run build`), then copy `lib/fluent.umd.cjs` and `lib/fluent.css` into your site:

```html
<link rel="stylesheet" href="fluent.css" />
<script src="fluent.umd.cjs"></script>
<script>
  const { Color3, UDim2 } = window.Fluent;
  const Fluent = window.Fluent.default; // the shared library instance
  Fluent.CreateWindow({ Title: "No bundler" });
</script>
```

---

## Userscripts

`dist/fluent.user.js` is a single-file build for Tampermonkey, Violentmonkey and Greasemonkey. The CSS is bundled inside it and
injected automatically, so one `@require` line is all you need:

```js
// ==UserScript==
// @name         My Script
// @match        https://example.com/*
// @require      https://cdn.jsdelivr.net/gh/not2pixel/fluent.js@v1.0.0/dist/fluent.user.js
// @grant        none
// @noframes
// ==/UserScript==

const { Color3, UDim2, SaveManager, InterfaceManager } = Fluent; // `Fluent` is a global

const Window = Fluent.CreateWindow({ Title: "My Script", Theme: "Deep Violet", MinimizeKey: "RightControl" });
const Main = Window.AddTab({ Title: "Main", Icon: "lucide/home" });
Main.AddToggle("Enabled", { Title: "Enabled", Default: true, Callback: (on) => console.log(on) });
```

A complete example is in [`examples/example.user.js`](examples/example.user.js).

- **Pin a version.** Use `@v1.0.0` in the URL, not `@main`, so a future update can't break your script. The same file is also attached to
  each [GitHub release](https://github.com/not2pixel/fluent.js/releases), at
  `https://github.com/not2pixel/fluent.js/releases/download/v1.0.0/fluent.user.js`.
- **Global.** The `Fluent` global is the library instance. `Fluent.Color3`, `Fluent.UDim2`, `Fluent.SaveManager`,
  `Fluent.InterfaceManager` and `Fluent.BuiltinThemes` are attached to it.
- **Strict CSP.** Styles are added with a constructable stylesheet (`document.adoptedStyleSheets`), so they still load on sites whose
  Content-Security-Policy blocks inline `<style>`. On those sites, Iconify icons can still fail to load if the site's `img-src` blocks
  `api.iconify.design`. Rich-text colors inside `<font>` can be dropped too.
- **Run timing.** It works with the default `@run-at document-end`. With `document-start` it also works, because the window mounts on
  `<html>` until `<body>` exists.
- **Storage.** `SaveManager` and `InterfaceManager` save to the current site's `localStorage`, so each site keeps its own settings.
- **Stacking.** The UI sits above the page at `z-index: 2147483000`. Very aggressive site CSS can still affect it.

---

## Playground

```bash
git clone https://github.com/not2pixel/fluent.js
cd fluent.js
npm install
npm run dev      # → http://localhost:5173
```

The playground has four panels:

| Panel | What it does |
|---|---|
| **Code** | A live script editor. Press **Ctrl/Cmd + Enter** or click **Run** to rebuild the window. Your code is saved in the browser. Click **Reset demo** to restore the sample script. |
| **Themes** | Switch between the 23 themes, change the stage background, and turn Acrylic, Transparency and Animated on or off. |
| **Event log** | Shows every callback value and anything you pass to `log(...)`. |
| **API** | A quick reference for every method. |

These globals are available inside the editor: `Fluent`, `Color3`, `UDim2`, `SaveManager`, `InterfaceManager`, `stage` (the element the
window mounts into) and `log(...)`.

---

## Quick start

```ts
import Fluent, { Color3, UDim2, SaveManager, InterfaceManager } from "fluent.js";

const Window = Fluent.CreateWindow({
  Title: "GoonWares",
  SubTitle: "Made by: StyearX",
  TabWidth: 160,
  Size: UDim2.fromOffset(580, 460),
  Theme: "Blood Red",
  Search: true,
  Tags: [{ Text: "Beta", Color: Color3.fromRGB(211, 15, 40) }],
  Version: "v1.0",
  MinimizeKey: "RightControl",
});

const Tabs = {
  Main: Window.AddTab({ Title: "Main", Icon: "lucide/swords" }),
  Settings: Window.AddTab({ Title: "Settings", Icon: "lucide/settings" }),
};

const combat = Tabs.Main.AddSection("Combat", "solar/layers-bold");

combat.AddSlider("WalkSpeed", { Title: "Walk speed", Min: 16, Max: 200, Default: 16, Rounding: 0 });
combat.AddDropdown("Weapon", { Title: "Weapon", Values: ["Sword", "Bow", "Staff"], Default: "Sword" });
combat.AddButton({
  Title: "Say hi",
  Callback: () => Fluent.Notify({ Title: "Hi!", Content: "It works.", Type: "Success", Duration: 4 }),
});

// Settings tab: theme picker and config save/load
new InterfaceManager().SetLibrary(Fluent).SetFolder("MyApp").BuildInterfaceSection(Tabs.Settings);
new SaveManager().SetLibrary(Fluent).SetFolder("MyApp").BuildConfigSection(Tabs.Settings);

Window.SelectTab(0);
```

---

## Window

`Fluent.CreateWindow(config)` returns a `Window`.

| Property | Type | Description |
|---|---|---|
| `Title` / `SubTitle` | string | Text in the title bar (rich text supported) |
| `Size` | `UDim2.fromOffset(w, h)` \| `[w, h]` | Window size, default `580×460` |
| `Position` | same as `Size` | Position inside the parent. The window is centered by default |
| `TabWidth` | number | Sidebar width in px, default `160` |
| `Theme` | string | Theme applied on load |
| `Acrylic` | boolean | Blurred, see-through background (`backdrop-filter`) |
| `Animated` | boolean | Animated shine border for themes that support it |
| `Search` | boolean | Search box that filters elements across every tab |
| `TitleIcon` / `Icons` | string | Icon in the title bar |
| `Tags` | `{ Text, Color }[]` | Colored badges in the title bar |
| `Version` | string | Version badge in the title bar |
| `UserInfoTop`, `UserInfoTitle`, `UserInfoSubtitle`, `UserInfoColor`, `UserInfoAvatar` | | User card at the top of the sidebar (`UserInfoTop: false` moves it to the bottom) |
| `MinimizeKey` | string | Key that toggles the window, e.g. `"RightControl"`, `"LeftAlt"` |
| `Closable` | boolean | Show the close (X) button, default `true` |
| `Parent` | HTMLElement | Element to mount into. Defaults to a fixed overlay on `<body>` |

**Methods:** `AddTab`, `SelectTab(index)` (0-based), `Dialog`, `Minimize()`, `Show()`, `Hide()`, `ToggleMaximize()`, `SetTitle`,
`SetSubTitle`, `SetMinimizeKey`, `OnDestroy(fn)`, `Destroy()`.

You can drag the window by its title bar (double-click to maximize) and resize it from the bottom-right corner. When minimized, it
shows a small pill you can click to restore it.

---

## Tabs, sections & groups

```ts
const tab = Window.AddTab({ Title: "Main", Icon: "lucide/home" });

tab.AddButton({ Title: "Elements can go directly on a tab" });

const sec = tab.AddSection("Title", "lucide/star");              // labeled group of elements
const col = tab.AddCollapsibleSection("More", "lucide/folder", false); // third argument: start open?
col.Toggle(); col.Open(); col.Close();

const group = sec.AddGroup({ Columns: 2, Gap: 6 });               // elements side by side
group.AddElement().AddButton({ Title: "Left" });
group.AddElement().AddButton({ Title: "Right" });
```

Tabs, sections, collapsible sections and group columns all have the same `Add…` methods.

---

## Elements

Elements that hold a value take a **flag** as their first argument. The flag registers the element in `Fluent.Options` (see
[Options & flags](#options--flags)). Every `Title` / `Description` accepts rich text.

Common config fields: `Title`, `Description`, `Icon`, `IconColor`.

### Paragraph
```ts
const p = sec.AddParagraph({ Title: "Info", Content: "Line one\nLine two" });
p.SetTitle("New title"); p.SetDesc("New content");
```

### Button
```ts
sec.AddButton({ Title: "Click me", Description: "optional", Icon: "lucide/zap", Callback: () => {} });
```

### Toggle / Checkbox
```ts
sec.AddToggle("Flag", { Title: "Toggle", Default: false, Callback: (v) => {} });
sec.AddCheckbox("Flag2", { Title: "Checkbox", Default: true, Callback: (v) => {} });
```

### Slider
```ts
sec.AddSlider("Speed", { Title: "Speed", Min: 0, Max: 100, Default: 50, Rounding: 1, Suffix: "%", Callback: (v) => {} });
// Click the number to type a value. Shift + mouse wheel nudges it. Methods: SetMin, SetMax.
```

### Input
```ts
sec.AddInput("Name", {
  Title: "Name",
  Placeholder: "Type…",
  Default: "",
  Numeric: false,   // allow numbers only
  Finished: true,   // fire the callback only on Enter / blur
  MaxLength: 32,
  Callback: (text) => {},
});
```

### Dropdown
```ts
const dd = sec.AddDropdown("Weapon", {
  Title: "Weapon",
  Values: ["Sword", "Bow", "Staff"],
  Default: "Sword",            // multi: ["Sword", "Bow"] or { Sword: true }
  Multi: false,
  AllowNull: false,
  Searchable: true,            // on automatically for more than 8 values
  Animated: false,             // animated gradient border
  DropdownOutsideWindow: false,// open as a side panel next to the window
  DropdownBackgroundTransparency: 0.1,
  DropdownBackgroundImages: "https://…/bg.png",
  Callback: (value) => {},     // string, or { Option: true } when Multi
});
dd.SetValues(["A", "B"]); dd.GetActiveValues(); dd.Open(); dd.Close();
```
If two dropdowns with `DropdownOutsideWindow` are open at once, one opens on the left of the window and the other on the right.

### Colorpicker
```ts
const cp = sec.AddColorpicker("Color", {
  Title: "Color",
  Default: Color3.fromRGB(96, 205, 255), // or "#60cdff"
  Transparency: 0,                       // include this to show the alpha slider
  Callback: (color) => console.log(color.toHex(), cp.Transparency),
});
cp.SetValueRGB("#ff0000", 0.5);
```
The picker shows the new and the previous color side by side, plus Hex, RGB and Alpha fields.

### Keybind
```ts
const kb = sec.AddKeybind("Fly", {
  Title: "Fly",
  Default: "F",
  Mode: "Toggle",                // "Toggle" → callback(bool) | "Always" → callback() | "Hold" → callback(true/false)
  Callback: (state) => {},
  ChangedCallback: (key) => {},  // fires when the user picks a new key
});
kb.GetState(); kb.OnClick(() => {}); kb.SetValue("G", "Hold");
```
Click the key to rebind it. Press Esc to cancel, or Backspace to set it to `None`. Mouse buttons are recorded as `MB1`, `MB2` and `MB3`.

### ProgressBar
```ts
const bar = sec.AddProgressBar("Load", { Title: "Loading", Min: 0, Max: 100, Default: 25, ShowPercent: true });
bar.Increment(10); bar.SetValue(100);
```

### Code
```ts
sec.AddCode({ Title: "Example", Code: "console.log('hi')", Language: "js", OnCopy: () => {} });
```
The code block has a copy button and basic syntax highlighting for `js`, `ts`, `lua` and `plain`.

### Divider / Space
```ts
sec.AddDivider();
sec.AddSpace({ Height: 12 });
```

### Image / Video / Audio / Viewport
```ts
sec.AddImage({ Image: "https://picsum.photos/800/450", AspectRatio: "16:9", Radius: 8 });
sec.AddVideo({ Video: "/clip.mp4", AspectRatio: "16:9", AutoPlay: false, Looped: true, Volume: 0.5 });
sec.AddAudio({ Audio: "/song.mp3", AudioTitle: "Track", AudioSubtitle: "Artist", Cover: "/cover.jpg", Volume: 0.5 });
sec.AddViewport({ Object: myCanvasOrIframe, AspectRatio: "16:9" }); // embed any DOM node (canvas, three.js, iframe…)
```
Images and video have `SetAspectRatio(ratio)`. Video controls appear when you tap or hover. Audio pauses when it scrolls out of view
unless you set `PlayOutsideWindow: true`.

### Discord / Social
```ts
sec.AddDiscord({ InviteCode: "discord-developers" });           // live server card with online/member counts
sec.AddSocial({ ProfileUrl: "https://github.com/StyearX" });    // platform & username are detected from the URL
sec.AddSocial({ Username: "vitejs", DisplayName: "Vite", Platform: "GitHub" });
```

Every element has `Destroy()`, and most also have `SetTitle()` / `SetDesc()`.

---

## Options & flags

```ts
sec.AddToggle("AutoFarm", { Title: "Auto farm" });

Fluent.Options.AutoFarm.Value;               // read
Fluent.Options.AutoFarm.SetValue(true);      // write (fires the callback)
Fluent.Options.AutoFarm.OnChanged((v) => {}); // subscribe (runs once right away, like the Luau version)
```

---

## Dialog & notifications

```ts
Window.Dialog({
  Title: "Rename",
  Content: "Enter a new name",
  Input: { Placeholder: "Name…", Default: "" },     // optional
  Buttons: [
    { Title: "Confirm", Callback: (value) => console.log(value) },
    { Title: "Cancel" },                             // a button with no callback just closes the dialog
  ],
});

const n = Fluent.Notify({
  Title: "Saved",
  Content: "Your config was saved",
  SubContent: "optional second line",
  Type: "Success",          // Info | Success | Warning | Error
  Icon: "lucide/save",      // optional
  Duration: 5,              // seconds; leave it out to keep the notification until closed
});
n.Close();
```

Errors thrown inside callbacks are caught and shown as a notification. You can handle them yourself instead:

```ts
Fluent.SetErrorHandler((message, error) => console.warn(message));
```

---

## Themes

```ts
Fluent.Themes;                  // list of theme names
Fluent.SetTheme("Neon Cyber");
Fluent.ToggleAcrylic(false);
Fluent.ToggleTransparency(false);
Fluent.ToggleAnimated(true);
Fluent.OnThemeChanged((name) => {});
```

Built-in themes: Deep Violet, Dark, Charcoal, Pearl White, Blood Red, Neon Purple, Deep Ocean, Midnight Blue, Royal Blue, Rose, Neon Cyber,
Arctic Frost, Cotton Candy, Cyanic, Amber Glow, Bloomings, Crimson, Gold, Lavender Pink, AMOLED, Ash Gray, Galaxy Purple, RGB.

### Custom theme

Any key you leave out falls back to the `Dark` theme. Colors can be hex strings or `Color3`. Gradients are `[position, color]` stops.

```ts
Fluent.RegisterCustomTheme("Mint", {
  Accent: "#3ddc97",
  AcrylicMain: "#0f1a16",
  AcrylicBorder: "#2a5a48",
  AcrylicGradient: [[0, "#123d2f"], [1, "#0b1511"]],
  TitleBarLine: "#2a5a48",
  Tab: "#7fe0b8",
  Element: "#7fe0b8",
  ElementTransparency: 0.88,
  InElementBorder: "#3a7a62",
  ToggleSlider: "#7fe0b8",
  ToggleToggled: "#0f1a16",
  Text: "#f0fff8",
  SubText: "#a8d8c4",
  ShineEnabled: true,               // animated border when Animated is on
  Shine: { RotationSpeed: 30, ColorSequence: [[0, "#123d2f"], [0.5, "#3ddc97"], [1, "#123d2f"]] },
  Background: "https://…/wallpaper.jpg", // optional background image
  BackgroundTransparency: 0.6,
});
Fluent.SetTheme("Mint");
```

Other keys (same names as the Luau version): `ElementBorder`, `ElementBorderThickness`, `SliderRail`, `CheckboxUnchecked/Checked/Check`,
`ProgressBarRail/Fill`, `DropdownFrame/Holder/Border/Option`, `Keybind`, `Input`, `InputFocused`, `InputIndicator`,
`Dialog`, `DialogHolder`, `DialogHolderLine`, `DialogButton`, `DialogButtonBorder`, `DialogBorder`, `DialogInput`, `DialogInputLine`,
`Hover`, `HoverChange`, `IconColor`, `ButtonGradient`, `DiscordJoinButton`, `Info/Success/Warning/ErrorNotifyColor`.

Every theme value is exposed as a CSS variable (`--fl-Accent`, `--fl-Text`, …), so you can style your own elements to match.

---

## Save & interface managers

```ts
const iface = new InterfaceManager().SetLibrary(Fluent).SetFolder("MyApp");
iface.BuildInterfaceSection(settingsTab); // theme, acrylic, transparency, animated, minimize key
iface.ApplyCustomFont("'JetBrains Mono', monospace");

const saves = new SaveManager().SetLibrary(Fluent).SetFolder("MyApp");
saves.IgnoreThemeSettings();              // leave theme options out of configs
saves.SetIgnoreIndexes(["SomeFlag"]);
saves.BuildConfigSection(settingsTab);    // create / load / overwrite / delete / autoload
saves.LoadAutoloadConfig();
```

Settings and configs are stored in `localStorage` under the folder name you choose.

---

## Icons, rich text & keys

**Icons.** Any [Iconify](https://icon-sets.iconify.design/) icon works (more than 200k): `"lucide/home"`, `"solar/layers-bold"`,
`"mdi:sword"`. A bare name like `"home"` means Lucide. Image URLs work too. Iconify icons follow the theme's text color.

**Rich text.** Titles, descriptions and content support `<b>`, `<i>`, `<u>`, `<s>`, `<br>`, `<mark>`, `<sc>`, `<uppercase>` and
`<font color="rgb(255,120,120)" size="18" face="Montserrat" weight="bold" transparency="0.3">`. Any other HTML is escaped.

**Keys.** You can use Roblox-style names (`RightControl`, `LeftShift`, `Q`, `One`, `F1`, `MB2`) or
[`KeyboardEvent.code`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/code) values (`ControlRight`, `KeyQ`).

---

## Coming from the Luau version

Scripts translate almost line for line: replace `:` with `.` and `{ Key = v }` with `{ Key: v }`.

| Luau (FluentPro) | fluent.js |
|---|---|
| `loadstring(game:HttpGet(...))()` | `import Fluent from "fluent.js"` |
| `Window:AddTab({ Title = "Main" })` | `Window.AddTab({ Title: "Main" })` |
| `Color3.fromRGB(r, g, b)` | `Color3.fromRGB(r, g, b)` or `"#rrggbb"` |
| `UDim2.fromOffset(w, h)` | `UDim2.fromOffset(w, h)` or `[w, h]` |
| `Enum.KeyCode.RightControl` | `"RightControl"` |
| `rbxassetid://…` icons | Iconify names or image URLs |
| `rbxassetid://…` images / video / audio | regular URLs |
| `AddViewport({ Object = model })` | `AddViewport({ Object: htmlElement })` |
| `writefile` configs | `localStorage` |
| `Window:SelectTab(1)` (1-based) | `Window.SelectTab(0)` (0-based) |

These Roblox-only addons have no web version: FloatingButtonManager, MediaManager and animatedgui.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the playground at http://localhost:5173 |
| `npm run build` | Build the library into `lib/` (ESM, UMD, `.d.ts`, `fluent.css`) and the userscript file `dist/fluent.user.js` |
| `npm run build:userscript` | Build only `dist/fluent.user.js` (commit it, because jsDelivr serves it from the repo) |
| `npm run build:playground` | Build the playground as a static site into `playground-dist/` |
| `npm run typecheck` | Type-check the library and the playground |

Project layout:

```
src/
  index.ts            bundler entry (exports + CSS import)
  main.ts             public exports + the shared Fluent instance
  library.ts          FluentLibrary (CreateWindow, Notify, themes, Options…)
  components/         Window, Tab, Section/Group containers, Dialog, Notification
  elements/           Toggle, Slider, Input, Dropdown, Colorpicker, Keybind, media, social…
  addons/             SaveManager, InterfaceManager
  themes/             built-in themes + CSS-variable theme manager
  styles/fluent.css   all styles
  userscript.ts       entry for dist/fluent.user.js (global `Fluent`, CSS injected)
dist/fluent.user.js   prebuilt single-file build for userscript @require
examples/             example userscript
playground/           the live playground (Vite)
```

---

## License

[MIT](LICENSE). The copyright notices of the original Fluent (dawid) and FluentPro / Fluent-modded (StyearX, Vraigos) authors are kept
alongside the notice for this port.
