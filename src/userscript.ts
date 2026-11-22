// Single-file build for userscripts (Tampermonkey / Violentmonkey / Greasemonkey):
//   // @require https://cdn.jsdelivr.net/gh/not2pixel/fluent.js@v1.1.0/dist/fluent.user.js
// Exposes one global, `Fluent` — the library instance with the helper classes attached.
import css from "./styles/fluent.css?inline";
import * as API from "./main";

const STYLE_FLAG = "__fluentJsStyleInjected";

/**
 * Injects the stylesheet once. Constructable stylesheets are not subject to the page's
 * CSP `style-src`, so this works on strict sites; a <style> tag is the fallback.
 */
function injectStyles() {
  const g = globalThis as unknown as Record<string, unknown>;
  if (g[STYLE_FLAG]) return;
  g[STYLE_FLAG] = true;
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    return;
  } catch {
    /* older engines: fall through */
  }
  const style = document.createElement("style");
  style.id = "fluent-js-styles";
  style.textContent = css;
  (document.head ?? document.documentElement).append(style);
}

injectStyles();

const Fluent = Object.assign(API.default, {
  Color3: API.Color3,
  UDim2: API.UDim2,
  SaveManager: API.SaveManager,
  InterfaceManager: API.InterfaceManager,
  FluentLibrary: API.FluentLibrary,
  BuiltinThemes: API.BuiltinThemes,
});

export default Fluent;
