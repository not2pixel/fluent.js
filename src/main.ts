import { FluentLibrary } from "./library";

export { FluentLibrary } from "./library";
export { Window } from "./components/Window";
export { Tab } from "./components/Tab";
export { Container, Section, CollapsibleSection, Group } from "./components/Container";
export { Dialog } from "./components/Dialog";
export { Paragraph, Button, Divider, Space, Code } from "./elements/basic";
export { Toggle, Checkbox } from "./elements/Toggle";
export { Slider } from "./elements/Slider";
export { Input } from "./elements/Input";
export { Dropdown } from "./elements/Dropdown";
export { Colorpicker } from "./elements/Colorpicker";
export { Keybind } from "./elements/Keybind";
export { ImageElement, Video, Audio, Viewport, ProgressBar } from "./elements/media";
export { Discord, Social } from "./elements/social";
export { ValueElement, ElementFrame } from "./elements/base";
export { SaveManager } from "./addons/SaveManager";
export { InterfaceManager } from "./addons/InterfaceManager";
export { Color3, type ColorLike } from "./core/color";
export { UDim2 } from "./types";
export type * from "./types";
export type { ThemeDefinition, ColorSequence } from "./themes/types";
export { BuiltinThemes, BuiltinThemeNames } from "./themes/builtin";

/** Shared default instance — `import Fluent from "fluent.js"` mirrors `local Fluent = loadstring(...)()`. */
const Fluent = new FluentLibrary();
export default Fluent;
