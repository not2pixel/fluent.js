import { clamp, h, onDrag, richText } from "../core/dom";
import { builtinIcon } from "../core/icons";
import { ValueElement, type ElementContext } from "./base";
import type { AudioConfig, ImageConfig, ProgressBarConfig, VideoConfig, ViewportConfig } from "../types";

function ratioToCss(r: string | undefined): string | undefined {
  if (!r) return undefined;
  const m = /^(\d+(?:\.\d+)?)\s*[:/x]\s*(\d+(?:\.\d+)?)$/.exec(r.trim());
  return m ? `${m[1]} / ${m[2]}` : undefined;
}

const fmtTime = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

abstract class MediaFrame {
  readonly Frame: HTMLElement;
  constructor(protected ctx: ElementContext, cfg: { AspectRatio?: string; Radius?: number; Height?: number }, className: string, children: HTMLElement[]) {
    this.Frame = h("div", { class: `fl-media ${className}` }, children);
    this.Frame.style.borderRadius = `${cfg.Radius ?? 6}px`;
    if (cfg.Height) this.Frame.style.height = `${cfg.Height}px`;
    else this.Frame.style.aspectRatio = ratioToCss(cfg.AspectRatio) ?? "16 / 9";
    ctx.container.append(this.Frame);
  }
  SetAspectRatio(r: string) {
    this.Frame.style.height = "";
    this.Frame.style.aspectRatio = ratioToCss(r) ?? "16 / 9";
  }
  Destroy() {
    this.Frame.remove();
  }
}

export class ImageElement extends MediaFrame {
  readonly Type = "Image";
  private img: HTMLImageElement;
  constructor(ctx: ElementContext, cfg: ImageConfig) {
    const img = h("img", { class: "fl-media-img", alt: cfg.Title ?? "", draggable: "false" });
    super(ctx, cfg, "fl-image", [img]);
    this.img = img;
    this.SetImage(cfg.Image ?? "");
  }
  SetImage(src: string) {
    const loadable = !!src && !src.startsWith("rbxasset");
    this.Frame.classList.toggle("fl-media-missing", !loadable);
    if (loadable) this.img.src = src;
    else this.img.removeAttribute("src");
  }
}

export class Viewport extends MediaFrame {
  readonly Type = "Viewport";
  constructor(ctx: ElementContext, cfg: ViewportConfig) {
    super(ctx, cfg, "fl-viewport", []);
    if (cfg.Object) this.SetObject(cfg.Object);
  }
  SetObject(node: HTMLElement) {
    this.Frame.replaceChildren(node);
  }
}

export class Video extends MediaFrame {
  readonly Type = "Video";
  readonly VideoElement: HTMLVideoElement;
  private hideTimer = 0;
  constructor(ctx: ElementContext, cfg: VideoConfig) {
    const video = h("video", { class: "fl-media-video", playsInline: true, preload: "metadata" });
    const playBtn = h("button", { class: "fl-media-btn", type: "button" }, [builtinIcon("play", 14)]);
    const stopBtn = h("button", { class: "fl-media-btn", type: "button" }, [builtinIcon("stop", 14)]);
    const seekFill = h("div", { class: "fl-seek-fill" });
    const seek = h("div", { class: "fl-seek" }, [seekFill]);
    const time = h("span", { class: "fl-media-time", text: "0:00 / 0:00" });
    const controls = h("div", { class: "fl-video-controls" }, [playBtn, stopBtn, seek, time]);
    super(ctx, cfg, "fl-video", [video, controls]);
    this.VideoElement = video;
    video.loop = !!cfg.Looped;
    video.volume = clamp(cfg.Volume ?? 0.5, 0, 1);
    video.muted = !!cfg.AutoPlay; // browsers only allow muted autoplay
    if (cfg.Video && !cfg.Video.startsWith("rbxasset")) video.src = cfg.Video;
    else this.Frame.classList.add("fl-media-missing");
    if (cfg.AutoPlay) video.play().catch(() => {});

    const sync = () => {
      playBtn.replaceChildren(builtinIcon(video.paused ? "play" : "pause", 14));
      seekFill.style.width = `${(video.currentTime / (video.duration || 1)) * 100}%`;
      time.textContent = `${fmtTime(video.currentTime)} / ${fmtTime(video.duration)}`;
    };
    ["timeupdate", "play", "pause", "loadedmetadata"].forEach((ev) => video.addEventListener(ev, sync));
    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      video.muted = false;
      video.paused ? video.play().catch(() => {}) : video.pause();
    });
    stopBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      video.pause();
      video.currentTime = 0;
    });
    onDrag(seek, {
      move: (e) => {
        const r = seek.getBoundingClientRect();
        if (video.duration) video.currentTime = clamp((e.clientX - r.left) / r.width, 0, 1) * video.duration;
      },
    });
    const reveal = () => {
      this.Frame.classList.add("fl-controls-visible");
      clearTimeout(this.hideTimer);
      this.hideTimer = window.setTimeout(() => this.Frame.classList.remove("fl-controls-visible"), 2800);
    };
    this.Frame.addEventListener("pointerdown", reveal);
    this.Frame.addEventListener("pointermove", reveal);
  }
  Play() {
    return this.VideoElement.play();
  }
  Pause() {
    this.VideoElement.pause();
  }
  Stop() {
    this.VideoElement.pause();
    this.VideoElement.currentTime = 0;
  }
  Destroy() {
    this.VideoElement.pause();
    super.Destroy();
  }
}

export class Audio {
  readonly Type = "Audio";
  readonly Frame: HTMLElement;
  readonly AudioElement: HTMLAudioElement;
  private observer?: IntersectionObserver;
  constructor(private ctx: ElementContext, cfg: AudioConfig) {
    const audio = new window.Audio();
    this.AudioElement = audio;
    audio.loop = !!cfg.Looped;
    audio.volume = clamp(cfg.Volume ?? 0.5, 0, 1);
    if (cfg.Audio && !cfg.Audio.startsWith("rbxasset")) audio.src = cfg.Audio;

    const playBtn = h("button", { class: "fl-audio-play", type: "button" }, [builtinIcon("play", 16)]);
    const seekFill = h("div", { class: "fl-seek-fill" });
    const seek = h("div", { class: "fl-seek" }, [seekFill]);
    const cur = h("span", { class: "fl-media-time", text: "0:00" });
    const dur = h("span", { class: "fl-media-time", text: "0:00" });
    const volFill = h("div", { class: "fl-seek-fill" });
    const vol = h("div", { class: "fl-seek fl-audio-vol" }, [volFill]);
    const cover = h("div", { class: "fl-audio-cover" }, [cfg.Cover ? h("img", { src: cfg.Cover, alt: "" }) : builtinIcon("volume", 22)]);
    this.Frame = h("div", { class: "fl-element fl-audio" }, [
      cover,
      h("div", { class: "fl-audio-body" }, [
        h("div", { class: "fl-audio-head" }, [
          h("div", { class: "fl-audio-meta" }, [
            h("div", { class: "fl-el-title", html: richText(cfg.AudioTitle ?? "Untitled") }),
            h("div", { class: "fl-el-desc", html: richText(cfg.AudioSubtitle ?? "") }),
          ]),
          playBtn,
        ]),
        h("div", { class: "fl-audio-row" }, [cur, seek, dur]),
        h("div", { class: "fl-audio-row fl-audio-volrow" }, [builtinIcon("volume", 13), vol]),
      ]),
    ]);
    ctx.container.append(this.Frame);
    ctx.window.registerSearchable(this.Frame, () => `${cfg.AudioTitle ?? ""} ${cfg.AudioSubtitle ?? ""}`);

    const sync = () => {
      playBtn.replaceChildren(builtinIcon(audio.paused ? "play" : "pause", 16));
      this.Frame.classList.toggle("fl-playing", !audio.paused);
      seekFill.style.width = `${(audio.currentTime / (audio.duration || 1)) * 100}%`;
      volFill.style.width = `${audio.volume * 100}%`;
      cur.textContent = fmtTime(audio.currentTime);
      dur.textContent = fmtTime(audio.duration);
    };
    ["timeupdate", "play", "pause", "loadedmetadata", "volumechange"].forEach((ev) => audio.addEventListener(ev, sync));
    sync();
    playBtn.addEventListener("click", () => (audio.paused ? audio.play().catch(() => {}) : audio.pause()));
    onDrag(seek, {
      move: (e) => {
        const r = seek.getBoundingClientRect();
        if (audio.duration) audio.currentTime = clamp((e.clientX - r.left) / r.width, 0, 1) * audio.duration;
      },
    });
    onDrag(vol, {
      move: (e) => {
        const r = vol.getBoundingClientRect();
        audio.volume = clamp((e.clientX - r.left) / r.width, 0, 1);
      },
    });
    if (cfg.AutoPlay) audio.play().catch(() => {});
    ctx.window.OnDestroy(() => audio.pause());
    if (!cfg.PlayOutsideWindow) {
      this.observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting && !audio.paused) audio.pause();
      });
      this.observer.observe(this.Frame);
    }
  }
  Play() {
    return this.AudioElement.play();
  }
  Pause() {
    this.AudioElement.pause();
  }
  SetVolume(v: number) {
    this.AudioElement.volume = clamp(v, 0, 1);
  }
  Destroy() {
    this.AudioElement.pause();
    this.observer?.disconnect();
    this.ctx.window.unregisterSearchable(this.Frame);
    this.Frame.remove();
  }
}

export class ProgressBar extends ValueElement<number> {
  readonly Type = "ProgressBar";
  readonly Frame: HTMLElement;
  Min: number;
  Max: number;
  private fill: HTMLElement;
  private pct: HTMLElement | null;
  private titleEl: HTMLElement | null;
  constructor(ctx: ElementContext, flag: string | undefined, cfg: ProgressBarConfig) {
    super(ctx, flag);
    this.Callback = cfg.Callback;
    this.Min = cfg.Min ?? 0;
    this.Max = cfg.Max ?? 100;
    this.Value = clamp(cfg.Default ?? this.Min, this.Min, this.Max);
    this.fill = h("div", { class: "fl-progress-fill" });
    this.titleEl = cfg.Title ? h("div", { class: "fl-el-title", html: richText(cfg.Title) }) : null;
    this.pct = cfg.ShowPercent !== false ? h("div", { class: "fl-progress-pct" }) : null;
    this.Frame = h("div", { class: "fl-progress" }, [
      this.titleEl || this.pct ? h("div", { class: "fl-progress-head" }, [this.titleEl ?? h("span"), this.pct]) : null,
      h("div", { class: "fl-progress-rail" }, [this.fill]),
    ]);
    ctx.container.append(this.Frame);
    ctx.window.registerSearchable(this.Frame, () => this.titleEl?.textContent ?? "");
    this.render();
  }
  private render() {
    const p = this.Max === this.Min ? 0 : (this.Value - this.Min) / (this.Max - this.Min);
    this.fill.style.width = `${p * 100}%`;
    if (this.pct) this.pct.textContent = `${Math.round(p * 100)}%`;
  }
  SetValue(v: unknown) {
    const n = clamp(Number(v), this.Min, this.Max);
    if (Number.isNaN(n) || n === this.Value) return;
    this.Value = n;
    this.render();
    this.emit();
  }
  Increment(by = 1) {
    this.SetValue(this.Value + by);
  }
  SetTitle(t: string) {
    if (this.titleEl) this.titleEl.innerHTML = richText(t);
  }
  Destroy() {
    this.ctx.window.unregisterSearchable(this.Frame);
    this.Frame.remove();
    this.unregister();
  }
}
