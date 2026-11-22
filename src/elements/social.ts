import { h } from "../core/dom";
import { builtinIcon } from "../core/icons";
import type { ElementContext } from "./base";
import type { DiscordConfig, SocialConfig } from "../types";

/** Live Discord invite card (uses the public invite endpoint, which allows CORS). */
export class Discord {
  readonly Type = "Discord";
  readonly Frame: HTMLElement;
  constructor(private ctx: ElementContext, cfg: DiscordConfig) {
    const code = cfg.InviteCode.replace(/^https?:\/\/(www\.)?(discord\.gg|discord\.com\/invite)\//, "");
    const icon = h("div", { class: "fl-discord-icon" }, [builtinIcon("user", 22)]);
    const name = h("div", { class: "fl-el-title", text: "Loading invite…" });
    const stats = h("div", { class: "fl-discord-stats" });
    const banner = h("div", { class: "fl-discord-banner" });
    const join = h("a", { class: "fl-discord-join", href: `https://discord.gg/${code}`, target: "_blank", rel: "noopener noreferrer", text: "Join" });
    this.Frame = h("div", { class: "fl-element fl-discord" }, [
      banner,
      h("div", { class: "fl-discord-row" }, [icon, h("div", { class: "fl-discord-info" }, [name, stats]), join]),
    ]);
    ctx.container.append(this.Frame);
    ctx.window.registerSearchable(this.Frame, () => `discord ${name.textContent}`);

    fetch(`https://discord.com/api/v10/invites/${encodeURIComponent(code)}?with_counts=true`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        const g = data.guild ?? {};
        name.textContent = g.name ?? code;
        stats.replaceChildren(
          h("span", { class: "fl-discord-dot fl-online" }),
          h("span", { text: `${(data.approximate_presence_count ?? 0).toLocaleString()} Online` }),
          h("span", { class: "fl-discord-dot" }),
          h("span", { text: `${(data.approximate_member_count ?? 0).toLocaleString()} Members` })
        );
        if (g.icon) icon.replaceChildren(h("img", { src: `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=128`, alt: "" }));
        if (g.banner) banner.style.backgroundImage = `url("https://cdn.discordapp.com/banners/${g.id}/${g.banner}.png?size=480")`;
        else if (g.splash) banner.style.backgroundImage = `url("https://cdn.discordapp.com/splashes/${g.id}/${g.splash}.png?size=480")`;
      })
      .catch(() => {
        name.textContent = `discord.gg/${code}`;
        stats.textContent = "Invite preview unavailable";
      });
  }
  Destroy() {
    this.ctx.window.unregisterSearchable(this.Frame);
    this.Frame.remove();
  }
}

const PLATFORMS: Array<[RegExp, string, string]> = [
  [/github\.com\/([^/?#]+)/i, "GitHub", "github"],
  [/(?:twitter|x)\.com\/([^/?#]+)/i, "X", "x"],
  [/youtube\.com\/@([^/?#]+)/i, "YouTube", "youtube"],
  [/instagram\.com\/([^/?#]+)/i, "Instagram", "instagram"],
  [/tiktok\.com\/@([^/?#]+)/i, "TikTok", "tiktok"],
  [/twitch\.tv\/([^/?#]+)/i, "Twitch", "twitch"],
  [/reddit\.com\/u(?:ser)?\/([^/?#]+)/i, "Reddit", "reddit"],
  [/roblox\.com\/users\/(\d+)/i, "Roblox", "roblox"],
];

/** Social profile card. Pass just ProfileUrl and the rest is detected. */
export class Social {
  readonly Type = "Social";
  readonly Frame: HTMLElement;
  constructor(private ctx: ElementContext, cfg: SocialConfig) {
    let { Username, DisplayName, Platform } = cfg;
    let slug = Platform?.toLowerCase();
    if (cfg.ProfileUrl) {
      for (const [re, label, s] of PLATFORMS) {
        const m = re.exec(cfg.ProfileUrl);
        if (m) {
          Username ??= m[1];
          Platform ??= label;
          slug ??= s;
          break;
        }
      }
    }
    Username ??= "unknown";
    DisplayName ??= Username;
    Platform ??= "Website";
    const avatarSrc = slug && slug !== "roblox" ? `https://unavatar.io/${slug}/${encodeURIComponent(Username)}` : `https://unavatar.io/${encodeURIComponent(Username)}`;
    const avatar = h("img", { class: "fl-social-avatar", src: avatarSrc, alt: "", loading: "lazy" });
    avatar.addEventListener("error", () => avatar.replaceWith(h("div", { class: "fl-social-avatar" }, [builtinIcon("user", 20)])));
    const copyable = (text: string, cls: string) => {
      const el = h("button", { class: cls, type: "button", title: "Click to copy", text });
      el.addEventListener("click", () => {
        navigator.clipboard?.writeText(text).catch(() => {});
        ctx.library.Notify({ Title: "Copied", Content: text, Type: "Success", Duration: 2 });
      });
      return el;
    };
    this.Frame = h("div", { class: "fl-element fl-social" }, [
      avatar,
      h("div", { class: "fl-social-info" }, [copyable(DisplayName, "fl-el-title fl-social-copy"), copyable(`@${Username}`, "fl-el-desc fl-social-copy")]),
      cfg.ProfileUrl
        ? h("a", { class: "fl-social-platform", href: cfg.ProfileUrl, target: "_blank", rel: "noopener noreferrer", text: Platform })
        : h("span", { class: "fl-social-platform", text: Platform }),
    ]);
    ctx.container.append(this.Frame);
    ctx.window.registerSearchable(this.Frame, () => `${DisplayName} ${Username} ${Platform}`);
  }
  Destroy() {
    this.ctx.window.unregisterSearchable(this.Frame);
    this.Frame.remove();
  }
}
