import type { ColorLike } from "./core/color";

export type Callback<T = unknown> = (value: T) => void;

export type SizeLike = [number, number] | { X: number; Y: number } | { Width: number; Height: number };

/** Roblox-compat helper: UDim2.fromOffset(580, 460) → { X: 580, Y: 460 } */
export const UDim2 = {
  fromOffset: (x: number, y: number) => ({ X: x, Y: y }),
};

export function readSize(s: SizeLike | undefined, fallback: [number, number]): [number, number] {
  if (!s) return fallback;
  if (Array.isArray(s)) return s;
  if ("X" in s) return [s.X, s.Y];
  return [s.Width, s.Height];
}

export interface TagConfig {
  Text: string;
  Color?: ColorLike;
}

export interface WindowConfig {
  Title?: string;
  SubTitle?: string;
  Version?: string;
  TabWidth?: number;
  Size?: SizeLike;
  /** Absolute position inside the parent; centered by default. */
  Position?: SizeLike;
  Acrylic?: boolean;
  Theme?: string;
  /** Roblox KeyCode name ("RightControl", "LeftAlt"…) or KeyboardEvent.code. */
  MinimizeKey?: string;
  Search?: boolean;
  Icons?: string;
  TitleIcon?: string;
  UserInfoTop?: boolean;
  UserInfo?: boolean;
  UserInfoTitle?: string;
  UserInfoSubtitle?: string;
  UserInfoColor?: ColorLike;
  UserInfoAvatar?: string;
  Tags?: TagConfig[];
  Animated?: boolean;
  /** Element to mount into. Defaults to a fixed overlay on document.body. */
  Parent?: HTMLElement;
  /** Show the close (X) button. Default true. */
  Closable?: boolean;
}

export interface TabConfig {
  Title: string;
  Icon?: string;
}

export interface BaseElementConfig {
  Title?: string;
  Description?: string;
  Icon?: string;
  IconColor?: ColorLike;
}

export interface ParagraphConfig {
  Title?: string;
  Content?: string;
  Icon?: string;
}

export interface ButtonConfig extends BaseElementConfig {
  Callback?: () => void;
}

export interface ToggleConfig extends BaseElementConfig {
  Default?: boolean;
  Callback?: Callback<boolean>;
}

export interface SliderConfig extends BaseElementConfig {
  Min?: number;
  Max?: number;
  Default?: number;
  Rounding?: number;
  /** Suffix shown after the value, e.g. "%" or " studs". */
  Suffix?: string;
  Callback?: Callback<number>;
}

export interface InputConfig extends BaseElementConfig {
  Default?: string;
  Placeholder?: string;
  Numeric?: boolean;
  /** Only fire the callback on Enter / blur. */
  Finished?: boolean;
  MaxLength?: number;
  Callback?: Callback<string>;
}

export type DropdownValue = string | Record<string, boolean> | null;
export interface DropdownConfig extends BaseElementConfig {
  Values?: string[];
  Default?: string | number | string[] | Record<string, boolean>;
  Multi?: boolean;
  AllowNull?: boolean;
  Searchable?: boolean;
  Animated?: boolean;
  DropdownOutsideWindow?: boolean;
  DropdownBackgroundTransparency?: number;
  DropdownBackgroundImages?: string;
  Callback?: Callback<DropdownValue>;
}

export interface ColorpickerConfig extends BaseElementConfig {
  Default?: ColorLike;
  Transparency?: number;
  Callback?: Callback<import("./core/color").Color3>;
}

export type KeybindMode = "Toggle" | "Always" | "Hold";
export interface KeybindConfig extends BaseElementConfig {
  Default?: string;
  Mode?: KeybindMode;
  Callback?: (value?: boolean) => void;
  ChangedCallback?: (key: string) => void;
}

export interface CodeConfig {
  Title?: string;
  Code?: string;
  Language?: "lua" | "js" | "ts" | "plain";
  OnCopy?: () => void;
}

export interface MediaConfig {
  AspectRatio?: string;
  Radius?: number;
  Height?: number;
}
export interface ImageConfig extends MediaConfig {
  Image?: string;
  Title?: string;
}
export interface VideoConfig extends MediaConfig {
  Video?: string;
  AutoPlay?: boolean;
  Looped?: boolean;
  Volume?: number;
}
export interface AudioConfig {
  Audio?: string;
  Volume?: number;
  Looped?: boolean;
  AutoPlay?: boolean;
  AudioTitle?: string;
  AudioSubtitle?: string;
  Cover?: string;
  PlayOutsideWindow?: boolean;
}
export interface ViewportConfig extends MediaConfig {
  /** Any DOM node (canvas, iframe, three.js renderer…) rendered inside the frame. */
  Object?: HTMLElement;
}

export interface ProgressBarConfig {
  Title?: string;
  Min?: number;
  Max?: number;
  Default?: number;
  ShowPercent?: boolean;
  Callback?: Callback<number>;
}

export interface DiscordConfig {
  InviteCode: string;
}

export interface SocialConfig {
  ProfileUrl?: string;
  Username?: string;
  DisplayName?: string;
  Platform?: string;
}

export interface GroupConfig {
  Columns?: number;
  Gap?: number;
}

export interface DialogButton {
  Title: string;
  Callback?: (input?: string) => void;
}
export interface DialogConfig {
  Title?: string;
  Content?: string;
  Input?: { Placeholder?: string; Default?: string };
  Buttons?: DialogButton[];
}

export type NotifyType = "Info" | "Success" | "Warning" | "Error";
export interface NotifyConfig {
  Title?: string;
  Content?: string;
  SubContent?: string;
  Type?: NotifyType;
  Icon?: string;
  /** Seconds; omit / null to stay until closed. */
  Duration?: number | null;
}

export interface FontSource {
  /** URL of a .woff2/.woff/.ttf/.otf file. Subject to the page's CSP `font-src`. */
  Url?: string;
  /** Raw font bytes (e.g. fetched with GM_xmlhttpRequest). Not subject to CSP, so it works on strict sites. */
  Data?: ArrayBuffer | ArrayBufferView;
  /** Locally installed font names tried first, e.g. "SF Pro Text" (no download on machines that have it). */
  Local?: string | string[];
  /** CSS weight or range: 400, "600", "100 900" for variable fonts. Default "400". */
  Weight?: number | string;
  Style?: "normal" | "italic";
}

export interface FontConfig {
  /** Family name used inside the UI, e.g. "SF Pro". */
  Family: string;
  /** Files to load. Omit to use a font that is already available (installed or loaded by the page). */
  Sources?: FontSource[];
  /** Fallback stack after the family. Default: system-ui, -apple-system, "Segoe UI", sans-serif */
  Fallback?: string;
}
