// ==UserScript==
// @name         fluent.js example
// @namespace    https://github.com/not2pixel/fluent.js
// @version      1.0.0
// @description  Minimal userscript using fluent.js
// @match        *://*/*
// @require      https://cdn.jsdelivr.net/gh/not2pixel/fluent.js@v1.0.0/dist/fluent.user.js
// @grant        none
// @noframes
// ==/UserScript==

(function () {
  "use strict";
  // `Fluent` is the global created by the @require above.
  const { Color3, UDim2, SaveManager, InterfaceManager } = Fluent;

  const Window = Fluent.CreateWindow({
    Title: "My Script",
    SubTitle: location.hostname,
    Size: UDim2.fromOffset(560, 420),
    Theme: "Deep Violet",
    Search: true,
    MinimizeKey: "RightControl", // press to hide / show
  });

  const Tabs = {
    Main: Window.AddTab({ Title: "Main", Icon: "lucide/home" }),
    Settings: Window.AddTab({ Title: "Settings", Icon: "lucide/settings" }),
  };

  const page = Tabs.Main.AddSection("Page tools", "lucide/wrench");

  page.AddToggle("DarkPage", {
    Title: "Invert page colors",
    Default: false,
    Callback: (on) => {
      document.documentElement.style.filter = on ? "invert(1) hue-rotate(180deg)" : "";
    },
  });

  page.AddSlider("Zoom", {
    Title: "Page zoom",
    Min: 50,
    Max: 200,
    Default: 100,
    Suffix: "%",
    Callback: (v) => (document.body.style.zoom = v / 100),
  });

  page.AddColorpicker("Highlight", {
    Title: "Link color",
    Default: Color3.fromRGB(96, 205, 255),
    Callback: (c) => document.querySelectorAll("a").forEach((a) => (a.style.color = c.toHex())),
  });

  page.AddButton({
    Title: "Count links",
    Callback: () =>
      Fluent.Notify({ Title: "Links", Content: `${document.links.length} links on this page`, Type: "Info", Duration: 4 }),
  });

  // Theme picker + config save/load (stored in this site's localStorage).
  new InterfaceManager().SetLibrary(Fluent).SetFolder("MyScript").BuildInterfaceSection(Tabs.Settings);
  const saves = new SaveManager().SetLibrary(Fluent).SetFolder("MyScript");
  saves.BuildConfigSection(Tabs.Settings);
  saves.LoadAutoloadConfig();

  Window.SelectTab(0);
})();
