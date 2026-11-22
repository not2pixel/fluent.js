import type { FluentLibrary } from "../library";
import type { Container } from "../components/Container";

interface InterfaceSettings {
  Theme: string;
  Acrylic: boolean;
  Transparency: boolean;
  Animated: boolean;
  MenuKeybind: string;
  Font?: string;
}

/** Port of Addons/InterfaceManager.lua — theme / acrylic / transparency / minimize key, persisted in localStorage. */
export class InterfaceManager {
  Library!: FluentLibrary;
  Folder = "FluentSettings";
  Settings: InterfaceSettings = { Theme: "Dark", Acrylic: true, Transparency: true, Animated: true, MenuKeybind: "LeftControl" };

  SetLibrary(lib: FluentLibrary) {
    this.Library = lib;
    return this;
  }
  SetFolder(folder: string) {
    this.Folder = folder;
    return this;
  }

  private get key() {
    return `${this.Folder}/options`;
  }

  private ready = false;

  SaveSettings() {
    if (!this.ready) return; // ignore the initial callbacks fired while building
    try {
      localStorage.setItem(this.key, JSON.stringify(this.Settings));
    } catch {
      /* ignore */
    }
  }

  LoadSettings() {
    try {
      const raw = localStorage.getItem(this.key);
      if (raw) Object.assign(this.Settings, JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }

  /** Applies a CSS font-family to every Fluent surface (web equivalent of ApplyCustomFont). */
  ApplyCustomFont(fontFamily: string, weight?: number | string) {
    this.Settings.Font = fontFamily;
    document.documentElement.style.setProperty("--fl-font", fontFamily);
    if (weight) document.documentElement.style.setProperty("--fl-font-weight", String(weight));
    this.SaveSettings();
  }

  BuildInterfaceSection(tab: Container) {
    const lib = this.Library;
    const s = this.Settings;
    Object.assign(s, { Theme: lib.Theme, Acrylic: lib.Acrylic, Transparency: lib.Transparency, Animated: lib.Animated });
    if (lib.Windows[0]) s.MenuKeybind = lib.Windows[0].MinimizeKey;
    this.ready = false;
    this.LoadSettings();
    const section = tab.AddSection("Interface", "lucide/palette");

    section
      .AddDropdown("InterfaceTheme", {
        Title: "Theme",
        Description: "Changes the interface theme.",
        Values: lib.Themes,
        Default: lib.Themes.includes(s.Theme) ? s.Theme : lib.Theme,
        Callback: (v) => {
          if (typeof v !== "string") return;
          lib.SetTheme(v);
          s.Theme = v;
          this.SaveSettings();
        },
      });

    section.AddToggle("AcrylicToggle", {
      Title: "Acrylic",
      Description: "The blurred background requires backdrop-filter support.",
      Default: s.Acrylic,
      Callback: (v) => {
        lib.ToggleAcrylic(v);
        s.Acrylic = v;
        this.SaveSettings();
      },
    });
    section.AddToggle("TransparentToggle", {
      Title: "Transparency",
      Description: "Makes the interface transparent.",
      Default: s.Transparency,
      Callback: (v) => {
        lib.ToggleTransparency(v);
        s.Transparency = v;
        this.SaveSettings();
      },
    });
    section.AddToggle("AnimatedToggle", {
      Title: "Animated",
      Description: "Animated shine border for themes that support it.",
      Default: s.Animated,
      Callback: (v) => {
        lib.ToggleAnimated(v);
        s.Animated = v;
        this.SaveSettings();
      },
    });
    const kb = section.AddKeybind("MenuKeybind", { Title: "Minimize Bind", Default: s.MenuKeybind, Mode: "Always" });
    kb.OnChanged((key) => {
      s.MenuKeybind = key;
      lib.Windows.forEach((w) => w.SetMinimizeKey(key));
      this.SaveSettings();
    });
    if (s.Font) this.ApplyCustomFont(s.Font);
    this.ready = true;
  }
}
