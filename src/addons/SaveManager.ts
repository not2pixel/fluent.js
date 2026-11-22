import type { FluentLibrary } from "../library";
import type { Container } from "../components/Container";
import { Color3 } from "../core/color";

type Serialized = { type: string; idx: string; value: unknown; transparency?: number; mode?: string };

/**
 * Port of Addons/SaveManager.lua. Configs are stored in localStorage under `${folder}/settings/${name}`.
 */
export class SaveManager {
  Library!: FluentLibrary;
  Folder = "FluentSettings";
  Ignore = new Set<string>();

  SetLibrary(lib: FluentLibrary) {
    this.Library = lib;
    return this;
  }
  SetFolder(folder: string) {
    this.Folder = folder;
    return this;
  }
  SetIgnoreIndexes(list: string[]) {
    list.forEach((i) => this.Ignore.add(i));
  }
  IgnoreThemeSettings() {
    this.SetIgnoreIndexes(["InterfaceTheme", "AcrylicToggle", "TransparentToggle", "MenuKeybind"]);
  }

  private key(name: string) {
    return `${this.Folder}/settings/${name}`;
  }

  private serialize(): Serialized[] {
    const out: Serialized[] = [];
    for (const [idx, opt] of Object.entries(this.Library.Options)) {
      if (this.Ignore.has(idx)) continue;
      const o = opt as any;
      switch (o.Type) {
        case "Colorpicker":
          out.push({ type: o.Type, idx, value: (o.Value as Color3).toHex(), transparency: o.Transparency });
          break;
        case "Keybind":
          out.push({ type: o.Type, idx, value: o.Value, mode: o.Mode });
          break;
        case "Toggle":
        case "Checkbox":
        case "Slider":
        case "Input":
        case "Dropdown":
          out.push({ type: o.Type, idx, value: o.Value });
          break;
      }
    }
    return out;
  }

  Save(name: string): [boolean, string?] {
    if (!name) return [false, "no config file is selected"];
    try {
      localStorage.setItem(this.key(name), JSON.stringify({ objects: this.serialize() }));
      return [true];
    } catch (e) {
      return [false, String(e)];
    }
  }

  Load(name: string): [boolean, string?] {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(this.key(name));
    } catch {
      /* storage blocked */
    }
    if (!raw) return [false, "invalid file"];
    try {
      const { objects } = JSON.parse(raw) as { objects: Serialized[] };
      for (const o of objects) {
        const opt = this.Library.Options[o.idx] as any;
        if (!opt) continue;
        if (o.type === "Colorpicker") opt.SetValueRGB(Color3.fromHex(String(o.value)), o.transparency);
        else if (o.type === "Keybind") opt.SetValue(o.value, o.mode);
        else opt.SetValue(o.value);
      }
      return [true];
    } catch (e) {
      return [false, "decode error: " + String(e)];
    }
  }

  RefreshConfigList(): string[] {
    const prefix = this.key("");
    const out: string[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith(prefix)) out.push(k.slice(prefix.length));
      }
    } catch {
      /* storage blocked */
    }
    return out.sort();
  }

  Delete(name: string) {
    try {
      localStorage.removeItem(this.key(name));
    } catch {
      /* ignore */
    }
  }

  private get autoloadKey() {
    return `${this.Folder}/settings/__autoload`;
  }

  LoadAutoloadConfig() {
    let name: string | null = null;
    try {
      name = localStorage.getItem(this.autoloadKey);
    } catch {
      /* ignore */
    }
    if (!name) return;
    const [ok, err] = this.Load(name);
    this.Library.Notify({
      Title: "Interface",
      Content: "Config loader",
      SubContent: ok ? `Auto loaded config "${name}"` : `Failed to load autoload config: ${err}`,
      Type: ok ? "Success" : "Error",
      Duration: 7,
    });
  }

  BuildConfigSection(tab: Container) {
    const lib = this.Library;
    const section = tab.AddSection("Configuration", "lucide/save");
    const nameInput = section.AddInput("SaveManager_ConfigName", { Title: "Config name", Placeholder: "my-config" });
    const list = section.AddDropdown("SaveManager_ConfigList", { Title: "Config list", Values: this.RefreshConfigList(), AllowNull: true });
    this.Ignore.add("SaveManager_ConfigName").add("SaveManager_ConfigList");

    const notify = (ok: boolean, okMsg: string, err?: string) =>
      lib.Notify({ Title: "Interface", Content: "Config loader", SubContent: ok ? okMsg : `Failed: ${err}`, Type: ok ? "Success" : "Error", Duration: 5 });

    section.AddButton({
      Title: "Create config",
      Icon: "lucide/file-plus",
      Callback: () => {
        const name = nameInput.Value.trim();
        if (!name) return notify(false, "", "invalid config name (empty)");
        const [ok, err] = this.Save(name);
        notify(ok, `Created config "${name}"`, err);
        list.SetValues(this.RefreshConfigList());
        list.SetValue(name);
      },
    });
    const grp = section.AddGroup({ Columns: 2 });
    const c1 = grp.AddElement();
    const c2 = grp.AddElement();
    c1.AddButton({
      Title: "Load config",
      Callback: () => {
        const name = list.Value as string;
        const [ok, err] = this.Load(name);
        notify(ok, `Loaded config "${name}"`, err);
      },
    });
    c2.AddButton({
      Title: "Overwrite config",
      Callback: () => {
        const name = list.Value as string;
        const [ok, err] = this.Save(name);
        notify(ok, `Overwrote config "${name}"`, err);
      },
    });
    const c3 = grp.AddElement();
    const c4 = grp.AddElement();
    c3.AddButton({ Title: "Refresh list", Callback: () => list.SetValues(this.RefreshConfigList()) });
    c4.AddButton({
      Title: "Delete config",
      Callback: () => {
        const name = list.Value as string;
        if (!name) return;
        this.Delete(name);
        list.SetValues(this.RefreshConfigList());
        notify(true, `Deleted config "${name}"`);
      },
    });
    const autoload = section.AddParagraph({ Title: "Autoload", Content: "None" });
    try {
      autoload.SetDesc(localStorage.getItem(this.autoloadKey) ?? "None");
    } catch {
      /* ignore */
    }
    section.AddButton({
      Title: "Set as autoload",
      Callback: () => {
        const name = list.Value as string;
        if (!name) return;
        try {
          localStorage.setItem(this.autoloadKey, name);
        } catch {
          /* ignore */
        }
        autoload.SetDesc(name);
        notify(true, `Set "${name}" to auto load`);
      },
    });
  }
}
