import Fluent, { Color3, UDim2, SaveManager, InterfaceManager, BuiltinThemes } from "fluent.js";
import demoSource from "./demo.js?raw";

const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector(sel) as T;
const STORE_KEY = "fluentpro-playground:code";
const store = {
  get(k: string) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k: string, v: string) {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* ignore */
    }
  },
};

const editor = $<HTMLTextAreaElement>("#editor");
const gutter = $("#gutter");
const stage = $("#stage");
const status = $("#status");
const logList = $("#log");
const logCount = $("#log-count");

// ------------------------------------------------------------------ panel tabs
document.querySelectorAll<HTMLButtonElement>(".pg-tab").forEach((tab) =>
  tab.addEventListener("click", () => {
    document.querySelectorAll(".pg-tab, .pg-pane").forEach((el) => el.classList.remove("pg-active"));
    tab.classList.add("pg-active");
    $(`[data-pane="${tab.dataset.tab}"]`).classList.add("pg-active");
    if (tab.dataset.tab === "log") {
      unread = 0;
      logCount.textContent = "0";
      logCount.classList.remove("pg-new");
    }
  })
);
$("#toggle-panel").addEventListener("click", () => document.body.classList.toggle("pg-panel-hidden"));

// ------------------------------------------------------------------ resizer
const resizer = $("#resizer");
resizer.addEventListener("pointerdown", (e) => {
  resizer.setPointerCapture(e.pointerId);
  const move = (ev: PointerEvent) => {
    const w = Math.min(Math.max(ev.clientX, 280), window.innerWidth - 360);
    document.documentElement.style.setProperty("--pg-panel", `${w}px`);
  };
  const up = () => {
    resizer.removeEventListener("pointermove", move);
    resizer.removeEventListener("pointerup", up);
  };
  resizer.addEventListener("pointermove", move);
  resizer.addEventListener("pointerup", up);
});

// ------------------------------------------------------------------ log
let unread = 0;
function fmt(v: unknown): string {
  if (v instanceof Color3) return v.toHex();
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}
function log(...args: unknown[]) {
  const li = document.createElement("li");
  const time = new Date().toLocaleTimeString([], { hour12: false });
  li.innerHTML = `<span class="pg-time">${time}</span>`;
  li.append(args.map(fmt).join(" "));
  logList.prepend(li);
  while (logList.children.length > 300) logList.lastChild?.remove();
  if (!$('[data-pane="log"]').classList.contains("pg-active")) {
    unread++;
    logCount.textContent = String(unread);
    logCount.classList.add("pg-new");
  }
}
$("#clear-log").addEventListener("click", () => logList.replaceChildren());

// ------------------------------------------------------------------ editor
function updateGutter() {
  const lines = editor.value.split("\n").length;
  gutter.textContent = Array.from({ length: lines }, (_, i) => i + 1).join("\n");
}
editor.value = store.get(STORE_KEY) ?? demoSource;
updateGutter();
editor.addEventListener("input", () => {
  updateGutter();
  store.set(STORE_KEY, editor.value);
});
editor.addEventListener("scroll", () => (gutter.scrollTop = editor.scrollTop));
editor.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
    e.preventDefault();
    run();
    return;
  }
  if (e.key === "Tab") {
    e.preventDefault();
    const { selectionStart: s, selectionEnd: en, value } = editor;
    editor.value = value.slice(0, s) + "  " + value.slice(en);
    editor.selectionStart = editor.selectionEnd = s + 2;
    editor.dispatchEvent(new Event("input"));
  }
});

// ------------------------------------------------------------------ run
Fluent.SetErrorHandler((msg) => {
  log("⚠ Callback error:", msg);
  Fluent.Notify({ Title: "Callback error", Content: msg, Type: "Error", Duration: 5 });
});

function run() {
  Fluent.Destroy();
  stage.querySelectorAll(".fl-window, .fl-restore-pill").forEach((el) => el.remove());
  const started = performance.now();
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function("Fluent", "Color3", "UDim2", "SaveManager", "InterfaceManager", "stage", "log", editor.value);
    fn(Fluent, Color3, UDim2, SaveManager, InterfaceManager, stage, log);
    status.textContent = `✓ Ran in ${(performance.now() - started).toFixed(1)} ms — ${Object.keys(Fluent.Options).length} flagged options`;
    status.className = "pg-status pg-ok";
    syncThemeUi();
  } catch (err) {
    console.error(err);
    status.textContent = `✗ ${err instanceof Error ? err.message : String(err)}`;
    status.className = "pg-status pg-error";
  }
}
$("#run").addEventListener("click", run);
$("#reset").addEventListener("click", () => {
  editor.value = demoSource;
  store.set(STORE_KEY, editor.value);
  updateGutter();
  run();
});

// ------------------------------------------------------------------ themes
const grid = $("#theme-grid");
function swatch(name: string) {
  const t = BuiltinThemes[name] ?? {};
  const c = (k: string) => (typeof t[k] === "string" ? (t[k] as string) : "#444");
  const btn = document.createElement("button");
  btn.className = "pg-theme";
  btn.dataset.name = name;
  btn.innerHTML = `
    <span class="pg-theme-preview" style="background:${c("AcrylicMain")};border-color:${c("AcrylicBorder")}">
      <span style="background:${c("Accent")}"></span><span style="background:${c("Element")}"></span><span style="background:${c("Text")}"></span>
    </span>
    <span class="pg-theme-name"></span>`;
  (btn.querySelector(".pg-theme-name") as HTMLElement).textContent = name;
  btn.addEventListener("click", () => {
    const dd = Fluent.Options.InterfaceTheme;
    if (dd) dd.SetValue(name);
    else Fluent.SetTheme(name);
    syncThemeUi();
  });
  return btn;
}
function renderThemes() {
  grid.replaceChildren(...Fluent.Themes.map(swatch));
}
function syncThemeUi() {
  grid.querySelectorAll<HTMLElement>(".pg-theme").forEach((b) => b.classList.toggle("pg-active", b.dataset.name === Fluent.Theme));
  ($("#opt-acrylic") as HTMLInputElement).checked = Fluent.Acrylic;
  ($("#opt-transparency") as HTMLInputElement).checked = Fluent.Transparency;
  ($("#opt-animated") as HTMLInputElement).checked = Fluent.Animated;
}
Fluent.OnThemeChanged(syncThemeUi);
const bindSwitch = (id: string, flag: string, fn: (v: boolean) => void) =>
  $(id).addEventListener("change", (e) => {
    const v = (e.target as HTMLInputElement).checked;
    const opt = Fluent.Options[flag];
    if (opt) opt.SetValue(v);
    else fn(v);
  });
bindSwitch("#opt-acrylic", "AcrylicToggle", (v) => Fluent.ToggleAcrylic(v));
bindSwitch("#opt-transparency", "TransparentToggle", (v) => Fluent.ToggleTransparency(v));
bindSwitch("#opt-animated", "AnimatedToggle", (v) => Fluent.ToggleAnimated(v));

// stage backgrounds — the acrylic blur only shows off over something colorful
const BACKGROUNDS: Record<string, string> = {
  Aurora: "radial-gradient(at 20% 20%, #4f2a8a 0, transparent 50%), radial-gradient(at 80% 30%, #0e6f8f 0, transparent 50%), radial-gradient(at 50% 90%, #8a1f4f 0, transparent 55%), #0b0b14",
  Sunset: "linear-gradient(135deg, #ff7e5f, #feb47b 40%, #6a3093)",
  Ocean: "linear-gradient(160deg, #0f2027, #203a43, #2c5364)",
  Photo: "url('https://picsum.photos/seed/fluent-bg/1600/1000') center/cover",
  Dark: "#0d0d10",
  Light: "linear-gradient(135deg, #e0eafc, #cfdef3)",
};
const bgList = $("#bg-list");
for (const [name, css] of Object.entries(BACKGROUNDS)) {
  const b = document.createElement("button");
  b.className = "pg-bg";
  b.title = name;
  b.style.background = css;
  b.addEventListener("click", () => {
    stage.style.background = css;
    store.set("fluentpro-playground:bg", name);
    bgList.querySelectorAll(".pg-bg").forEach((x) => x.classList.toggle("pg-active", x === b));
  });
  bgList.append(b);
}
const savedBg = store.get("fluentpro-playground:bg") ?? "Aurora";
(bgList.children[Math.max(0, Object.keys(BACKGROUNDS).indexOf(savedBg))] as HTMLElement).click();

// ------------------------------------------------------------------ API reference
const API: Array<[string, string, string]> = [
  ["Fluent.CreateWindow(cfg)", "Window", "Title, SubTitle, Size, TabWidth, Theme, Acrylic, Search, Tags, Version, UserInfo*, MinimizeKey, Parent"],
  ["Window.AddTab({ Title, Icon })", "Tab", "Icon: iconify name e.g. \"lucide/home\", \"solar/layers-bold\", \"mdi:sword\""],
  ["tab.AddSection(title, icon)", "Section", "Same Add… methods as a tab"],
  ["tab.AddCollapsibleSection(title, icon, open)", "Section", ".Toggle(), .Open(), .Close()"],
  ["x.AddGroup({ Columns, Gap })", "Group", "group.AddElement() → column container"],
  ["x.AddParagraph({ Title, Content })", "", "SetTitle / SetDesc"],
  ["x.AddButton({ Title, Description, Icon, Callback })", "", ""],
  ["x.AddToggle(flag, { Title, Default, Callback })", "Option", "Value, SetValue, OnChanged"],
  ["x.AddCheckbox(flag, { … })", "Option", "same as Toggle"],
  ["x.AddSlider(flag, { Min, Max, Default, Rounding, Suffix })", "Option", "SetMin / SetMax"],
  ["x.AddInput(flag, { Placeholder, Default, Numeric, Finished })", "Option", ""],
  ["x.AddDropdown(flag, { Values, Default, Multi, AllowNull, Animated, DropdownOutsideWindow })", "Option", "SetValues, GetActiveValues, Open, Close"],
  ["x.AddColorpicker(flag, { Default, Transparency })", "Option", "Value: Color3, SetValueRGB"],
  ["x.AddKeybind(flag, { Default, Mode })", "Option", "Mode: Toggle | Always | Hold; GetState(), OnClick"],
  ["x.AddProgressBar(flag, { Title, Min, Max, Default })", "Option", "Increment(n)"],
  ["x.AddCode({ Title, Code, OnCopy })", "", "SetCode"],
  ["x.AddDivider() / x.AddSpace({ Height })", "", ""],
  ["x.AddImage({ Image, AspectRatio, Radius })", "", "SetImage, SetAspectRatio"],
  ["x.AddVideo({ Video, AutoPlay, Looped, Volume })", "", "Play / Pause / Stop"],
  ["x.AddAudio({ Audio, AudioTitle, AudioSubtitle, Cover })", "", ""],
  ["x.AddViewport({ Object: HTMLElement })", "", "Embed any canvas / iframe"],
  ["x.AddDiscord({ InviteCode })", "", "Live invite card"],
  ["x.AddSocial({ ProfileUrl })", "", "Auto-detects platform & username"],
  ["Window.Dialog({ Title, Content, Input, Buttons })", "", ""],
  ["Fluent.Notify({ Title, Content, SubContent, Type, Duration })", "", "Type: Info | Success | Warning | Error"],
  ["Fluent.SetTheme(name) / RegisterCustomTheme(name, def)", "", "Fluent.Themes lists names"],
  ["Fluent.Options[flag]", "", "Every flagged element"],
];
$("#api").innerHTML = API.map(
  ([sig, ret, note]) =>
    `<div class="pg-api-row"><code></code>${ret ? `<span class="pg-badge">${ret}</span>` : ""}<div class="pg-muted"></div></div>`
).join("");
$("#api")
  .querySelectorAll(".pg-api-row")
  .forEach((row, i) => {
    row.querySelector("code")!.textContent = API[i][0];
    row.querySelector(".pg-muted")!.textContent = API[i][2];
  });

renderThemes();
run();
(window as unknown as { Fluent: typeof Fluent }).Fluent = Fluent;
