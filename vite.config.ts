import { defineConfig } from "vite";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf8"));
const banner = `/*!
 * fluent.js v${pkg.version} — https://github.com/not2pixel/fluent.js
 * Web port of Fluent (dawid) and FluentPro / Fluent-modded (StyearX, Vraigos). MIT License.
 */`;

export default defineConfig(({ mode }) => {
  if (mode === "lib")
    return {
      build: {
        outDir: "lib",
        emptyOutDir: true,
        cssCodeSplit: false,
        lib: {
          entry: resolve(__dirname, "src/index.ts"),
          name: "Fluent",
          fileName: "fluent",
          formats: ["es", "umd"],
        },
        rollupOptions: { output: { assetFileNames: "fluent.[ext]", exports: "named", banner } },
      },
    };

  // One self-contained file (JS + CSS) that sets a global `Fluent`, for userscript @require.
  if (mode === "userscript")
    return {
      build: {
        outDir: "dist",
        emptyOutDir: true,
        minify: true,
        lib: {
          entry: resolve(__dirname, "src/userscript.ts"),
          name: "Fluent",
          fileName: () => "fluent.user.js",
          formats: ["iife"],
        },
        rollupOptions: { output: { exports: "default", banner } },
      },
    };

  return {
    root: "playground",
    resolve: { alias: { "fluent.js": resolve(__dirname, "src/index.ts") } },
    server: { port: 5173, open: false },
    build: { outDir: resolve(__dirname, "playground-dist"), emptyOutDir: true },
  };
});
