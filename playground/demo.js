// Live playground script — edit and press Ctrl/Cmd + Enter (or "Run").
// Available globals: Fluent, Color3, UDim2, SaveManager, InterfaceManager, stage, log(...)

const Window = Fluent.CreateWindow({
  Title: "fluent.js",
  SubTitle: "web playground",
  TabWidth: 160,
  Size: UDim2.fromOffset(640, 520),
  Acrylic: true,
  Theme: "Deep Violet",
  Search: true,
  TitleIcon: "lucide/sparkles",
  Tags: [
    { Text: "TS", Color: Color3.fromRGB(49, 120, 198) },
    { Text: "Beta", Color: Color3.fromRGB(211, 15, 40) },
  ],
  Version: "v2.0",
  UserInfoTop: true,
  UserInfoTitle: "Le Goon",
  UserInfoSubtitle: "Playground user",
  MinimizeKey: "RightControl",
  Parent: stage,
});

const Tabs = {
  Main: Window.AddTab({ Title: "Main", Icon: "lucide/home" }),
  Inputs: Window.AddTab({ Title: "Inputs", Icon: "lucide/sliders-horizontal" }),
  Media: Window.AddTab({ Title: "Media", Icon: "lucide/image" }),
  Social: Window.AddTab({ Title: "Social", Icon: "lucide/users" }),
  Settings: Window.AddTab({ Title: "Settings", Icon: "lucide/settings" }),
};
const Options = Fluent.Options;

// ---------------------------------------------------------------- Main
const secInfo = Tabs.Main.AddSection("Welcome", "lucide/hand");
secInfo.AddParagraph({
  Title: "Rich text works <font color=\"rgb(255,200,90)\">everywhere</font>",
  Content: "This is the Fluent-modded UI ported to <b>plain TypeScript</b>.\nTry <i>italics</i>, <u>underline</u>, <s>strike</s> and <font size=\"16\">sizes</font>.",
});
secInfo.AddButton({
  Title: "Show notification",
  Description: "Fluent.Notify({...})",
  Icon: "lucide/bell",
  Callback: () =>
    Fluent.Notify({ Title: "Hello!", Content: "Notifications stack bottom-right.", SubContent: "Closes in 5s", Type: "Success", Duration: 5 }),
});
secInfo.AddButton({
  Title: "Open dialog",
  Icon: "lucide/message-square",
  Callback: () =>
    Window.Dialog({
      Title: "Rename",
      Content: "Dialogs can include an input field.",
      Input: { Placeholder: "New name…" },
      Buttons: [
        { Title: "Confirm", Callback: (value) => log("Dialog input:", value) },
        { Title: "Cancel" },
      ],
    }),
});
secInfo.AddButton({
  Title: "Throw an error",
  Description: "Errors in callbacks are caught and reported",
  Icon: "lucide/bug",
  IconColor: "#ff6b6b",
  Callback: () => {
    throw new Error("Something went wrong (on purpose)");
  },
});

const secToggles = Tabs.Main.AddSection("Toggles", "lucide/toggle-right");
secToggles.AddToggle("AutoFarm", {
  Title: "Auto farm",
  Description: "Toggle with a description",
  Icon: "lucide/zap",
  Default: false,
  Callback: (v) => log("AutoFarm →", v),
});
secToggles.AddCheckbox("ShowFps", { Title: "Show FPS (checkbox)", Default: true, Callback: (v) => log("ShowFps →", v) });

const progress = secToggles.AddProgressBar("Loading", { Title: "Progress", Default: 35 });
secToggles.AddButton({ Title: "+10% progress", Callback: () => progress.Increment(10) });

const col = Tabs.Main.AddCollapsibleSection("Collapsible section", "lucide/folder", true);
col.AddParagraph({ Title: "Nested", Content: "Click the header to collapse / expand." });
const group = col.AddGroup({ Columns: 2, Gap: 6 });
group.AddElement().AddButton({ Title: "Left", Callback: () => log("Left") });
group.AddElement().AddButton({ Title: "Right", Callback: () => log("Right") });

Tabs.Main.AddCode({
  Title: "Example (Lua → TS)",
  Code: 'local t = sec:AddToggle("Flag", {\n    Title = "Hello",\n    Default = true,\n})\n-- becomes\nconst t = sec.AddToggle("Flag", { Title: "Hello", Default: true });',
  OnCopy: () => log("code copied"),
});

// ---------------------------------------------------------------- Inputs
const secSl = Tabs.Inputs.AddSection("Sliders & text", "lucide/sliders");
secSl.AddSlider("WalkSpeed", {
  Title: "Walk speed",
  Description: "Drag, or click the number to type",
  Min: 16,
  Max: 200,
  Default: 16,
  Rounding: 0,
  Callback: (v) => log("WalkSpeed →", v),
});
secSl.AddSlider("Fov", { Title: "Field of view", Min: 30, Max: 120, Default: 70, Rounding: 1, Suffix: "°" });
secSl.AddInput("Username", {
  Title: "Username",
  Placeholder: "Type here…",
  Finished: true,
  Callback: (v) => log("Username →", v),
});
secSl.AddInput("Amount", { Title: "Numeric input", Numeric: true, Default: "10", Callback: (v) => log("Amount →", v) });

const secDd = Tabs.Inputs.AddSection("Dropdowns", "lucide/list");
secDd.AddDropdown("Weapon", {
  Title: "Weapon",
  Values: ["Sword", "Bow", "Staff", "Dagger", "Axe"],
  Default: "Sword",
  Callback: (v) => log("Weapon →", v),
});
secDd.AddDropdown("Buffs", {
  Title: "Buffs (multi)",
  Description: "Animated border",
  Values: ["Speed", "Jump", "Strength", "Shield", "Regen"],
  Multi: true,
  Animated: true,
  Default: ["Speed", "Shield"],
  Callback: (v) => log("Buffs →", v),
});
secDd.AddDropdown("Players", {
  Title: "Players (outside window)",
  Values: Array.from({ length: 30 }, (_, i) => `Player${i + 1}`),
  DropdownOutsideWindow: true,
  Callback: (v) => log("Players →", v),
});
secDd.AddDropdown("Maps", {
  Title: "Maps (outside window)",
  Description: "Open both outside dropdowns: they split left / right",
  Values: ["Desert", "Forest", "Snow", "City", "Volcano"],
  DropdownOutsideWindow: true,
  Callback: (v) => log("Maps →", v),
});

const secMisc = Tabs.Inputs.AddSection("Color & keys", "lucide/palette");
secMisc.AddColorpicker("EspColor", {
  Title: "ESP color",
  Default: Color3.fromRGB(96, 205, 255),
  Callback: (c) => log("EspColor →", c.toHex()),
});
secMisc.AddColorpicker("Glow", { Title: "Glow (with transparency)", Default: "#ff5ea8", Transparency: 0.3 });
secMisc.AddKeybind("Fly", {
  Title: "Fly (Toggle mode)",
  Default: "F",
  Mode: "Toggle",
  Callback: (on) => log("Fly toggled →", on),
});
secMisc.AddKeybind("Dash", { Title: "Dash (Always mode)", Default: "Q", Mode: "Always", Callback: () => log("Dash!") });
secMisc.AddKeybind("Sprint", { Title: "Sprint (Hold mode)", Default: "LeftShift", Mode: "Hold", Callback: (held) => log("Sprint →", held) });

// ---------------------------------------------------------------- Media
const secImg = Tabs.Media.AddSection("Image & video", "lucide/film");
secImg.AddImage({ Image: "https://picsum.photos/seed/fluentpro/960/540", AspectRatio: "16:9", Radius: 8 });
secImg.AddVideo({
  Video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  AspectRatio: "16:9",
  Looped: true,
  Volume: 0.4,
});
Tabs.Media.AddAudio({
  Audio: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
  AudioTitle: "T-Rex roar",
  AudioSubtitle: "MDN CC0 sample",
  Volume: 0.5,
});
const canvas = document.createElement("canvas");
canvas.width = 640;
canvas.height = 240;
const g = canvas.getContext("2d");
let t = 0;
(function draw() {
  if (!canvas.isConnected && t > 2) return;
  t += 0.02;
  g.fillStyle = "#0b0b14";
  g.fillRect(0, 0, 640, 240);
  for (let i = 0; i < 40; i++) {
    g.fillStyle = `hsl(${(i * 9 + t * 60) % 360} 80% 60%)`;
    g.beginPath();
    g.arc(320 + Math.cos(t + i / 3) * (i * 6), 120 + Math.sin(t * 1.3 + i / 3) * 80, 4, 0, Math.PI * 2);
    g.fill();
  }
  requestAnimationFrame(draw);
})();
Tabs.Media.AddViewport({ Object: canvas, AspectRatio: "8:3", Radius: 8 });

// ---------------------------------------------------------------- Social
const secSoc = Tabs.Social.AddSection("Community", "lucide/heart");
secSoc.AddDiscord({ InviteCode: "discord-developers" });
secSoc.AddSocial({ ProfileUrl: "https://github.com/StyearX" });
secSoc.AddSocial({ Username: "vitejs", DisplayName: "Vite", Platform: "GitHub" });

// ---------------------------------------------------------------- Settings
const iface = new InterfaceManager().SetLibrary(Fluent).SetFolder("FluentPlayground");
const saves = new SaveManager().SetLibrary(Fluent).SetFolder("FluentPlayground");
saves.IgnoreThemeSettings();
iface.BuildInterfaceSection(Tabs.Settings);
saves.BuildConfigSection(Tabs.Settings);

Window.SelectTab(0);
Options.AutoFarm.OnChanged((v) => log("OnChanged(AutoFarm):", v));
