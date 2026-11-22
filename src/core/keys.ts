/**
 * Key names follow Roblox Enum.KeyCode names ("RightControl", "LeftAlt", "Q", "One", "F1", "MB1")
 * so configs port over unchanged. KeyboardEvent.code values ("ControlRight", "KeyQ") are accepted too.
 */
const ROBLOX_TO_CODE: Record<string, string> = {
  LeftControl: "ControlLeft",
  RightControl: "ControlRight",
  LeftShift: "ShiftLeft",
  RightShift: "ShiftRight",
  LeftAlt: "AltLeft",
  RightAlt: "AltRight",
  LeftSuper: "MetaLeft",
  RightSuper: "MetaRight",
  Return: "Enter",
  Delete: "Delete",
  Backspace: "Backspace",
  Space: "Space",
  Tab: "Tab",
  Escape: "Escape",
  Insert: "Insert",
  Home: "Home",
  End: "End",
  PageUp: "PageUp",
  PageDown: "PageDown",
  Up: "ArrowUp",
  Down: "ArrowDown",
  Left: "ArrowLeft",
  Right: "ArrowRight",
  CapsLock: "CapsLock",
  Minus: "Minus",
  Equals: "Equal",
  LeftBracket: "BracketLeft",
  RightBracket: "BracketRight",
  Semicolon: "Semicolon",
  Quote: "Quote",
  Comma: "Comma",
  Period: "Period",
  Slash: "Slash",
  BackSlash: "Backslash",
  Backquote: "Backquote",
};
const DIGITS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const CODE_TO_ROBLOX: Record<string, string> = Object.fromEntries(
  Object.entries(ROBLOX_TO_CODE).map(([k, v]) => [v, k])
);

/** Roblox-style name → KeyboardEvent.code (or "MB1"/"MB2"/"MB3" for mouse). */
export function toCode(name: string): string {
  if (!name) return "";
  if (/^MB[123]$/.test(name)) return name;
  if (ROBLOX_TO_CODE[name]) return ROBLOX_TO_CODE[name];
  if (/^[A-Z]$/.test(name)) return "Key" + name;
  const d = DIGITS.indexOf(name);
  if (d >= 0) return "Digit" + d;
  if (/^KeypadZero|Keypad/.test(name)) return name.replace("Keypad", "Numpad");
  return name; // assume already a KeyboardEvent.code (F1, KeyQ, ControlRight …)
}

/** KeyboardEvent.code → Roblox-style display name. */
export function toName(code: string): string {
  if (!code) return "None";
  if (CODE_TO_ROBLOX[code]) return CODE_TO_ROBLOX[code];
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit\d$/.test(code)) return DIGITS[Number(code.slice(5))];
  if (code.startsWith("Numpad")) return code.replace("Numpad", "Keypad");
  return code;
}

export function mouseButtonName(button: number): string | null {
  return button === 0 ? "MB1" : button === 2 ? "MB2" : button === 1 ? "MB3" : null;
}
