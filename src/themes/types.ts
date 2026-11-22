import type { ColorLike } from "../core/color";

/** [time 0..1, color] keypoints — mirrors Roblox ColorSequence. */
export type ColorSequence = Array<[number, ColorLike]>;

export interface ThemeDefinition {
  Name?: string;
  Accent?: ColorLike;
  AcrylicMain?: ColorLike;
  AcrylicBorder?: ColorLike;
  AcrylicGradient?: ColorSequence;
  AcrylicNoise?: number;
  TitleBarLine?: ColorLike;
  Tab?: ColorLike;
  Element?: ColorLike;
  ElementBorder?: ColorLike;
  InElementBorder?: ColorLike;
  ElementTransparency?: number;
  ElementBorderThickness?: number;
  ToggleSlider?: ColorLike;
  ToggleToggled?: ColorLike;
  SliderRail?: ColorLike;
  CheckboxUnchecked?: ColorLike;
  CheckboxChecked?: ColorLike;
  CheckboxCheck?: ColorLike;
  ProgressBarRail?: ColorLike;
  ProgressBarFill?: ColorLike;
  DropdownFrame?: ColorLike;
  DropdownHolder?: ColorLike;
  DropdownBorder?: ColorLike;
  DropdownOption?: ColorLike;
  DropdownBorderThickness?: number;
  Keybind?: ColorLike;
  Input?: ColorLike;
  InputFocused?: ColorLike;
  InputIndicator?: ColorLike;
  Dialog?: ColorLike;
  DialogHolder?: ColorLike;
  DialogHolderLine?: ColorLike;
  DialogButton?: ColorLike;
  DialogButtonBorder?: ColorLike;
  DialogBorder?: ColorLike;
  DialogInput?: ColorLike;
  DialogInputLine?: ColorLike;
  Text?: ColorLike;
  SubText?: ColorLike;
  IconColor?: ColorLike;
  Hover?: ColorLike;
  HoverChange?: number;
  /** CSS-loadable image URL (rbxassetid backgrounds are dropped). */
  Background?: string;
  BackgroundTransparency?: number;
  ShineEnabled?: boolean;
  Shine?: { Speed?: number; RotationSpeed?: number; ColorSequence?: ColorSequence };
  StrokeShine?: boolean;
  StrokeDark?: ColorLike;
  ButtonGradient?: { Background?: ColorSequence; Stroke?: ColorSequence };
  DiscordJoinButton?: ColorLike;
  WarningNotifyColor?: ColorLike;
  SuccessNotifyColor?: ColorLike;
  ErrorNotifyColor?: ColorLike;
  InfoNotifyColor?: ColorLike;
  ThemeAccentColors?: ColorLike[];
  [key: string]: unknown;
}
