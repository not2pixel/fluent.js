import { h, setRich } from "../core/dom";
import { builtinIcon, createIcon } from "../core/icons";
import type { FluentLibrary } from "../library";
import type { NotifyConfig } from "../types";

export interface NotificationHandle {
  Close(): void;
  readonly Root: HTMLElement;
}

export class NotificationHost {
  readonly Holder: HTMLElement;
  constructor(library: FluentLibrary, parent: HTMLElement) {
    this.Holder = h("div", { class: "fl-notifications" });
    parent.append(this.Holder);
    library.track(this.Holder);
  }

  push(cfg: NotifyConfig): NotificationHandle {
    const type = (cfg.Type ?? "Info").toLowerCase();
    const title = h("div", { class: "fl-notify-title" });
    setRich(title, cfg.Title ?? "Notification");
    const content = h("div", { class: "fl-notify-content" });
    setRich(content, cfg.Content ?? "");
    const sub = cfg.SubContent ? h("div", { class: "fl-notify-sub" }) : null;
    if (sub) setRich(sub, cfg.SubContent);
    const close = h("button", { class: "fl-notify-close", type: "button", title: "Close" }, [builtinIcon("close", 14)]);
    const progress = h("div", { class: "fl-notify-progress" });
    const icon = (cfg.Icon && createIcon(cfg.Icon, 18)) || builtinIcon(type, 18);
    const root = h("div", { class: `fl-notify fl-notify-${type}` }, [
      h("div", { class: "fl-notify-accent" }),
      h("div", { class: "fl-notify-icon" }, [icon]),
      h("div", { class: "fl-notify-body" }, [title, content, sub]),
      close,
      cfg.Duration ? progress : null,
    ]);
    this.Holder.append(root);
    requestAnimationFrame(() => root.classList.add("fl-visible"));

    let timer = 0;
    let closed = false;
    const handle: NotificationHandle = {
      Root: root,
      Close: () => {
        if (closed) return;
        closed = true;
        clearTimeout(timer);
        root.classList.remove("fl-visible");
        root.classList.add("fl-leaving");
        setTimeout(() => root.remove(), 260);
      },
    };
    close.addEventListener("click", handle.Close);
    if (cfg.Duration) {
      progress.style.animationDuration = `${cfg.Duration}s`;
      timer = window.setTimeout(handle.Close, cfg.Duration * 1000);
    }
    return handle;
  }

  destroy() {
    this.Holder.remove();
  }
}
