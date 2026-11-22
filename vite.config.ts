import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig(({ mode }) =>
  mode === "lib"
    ? {
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
          rollupOptions: { output: { assetFileNames: "fluent.[ext]", exports: "named" } },
        },
      }
    : {
        root: "playground",
        resolve: { alias: { "fluent.js": resolve(__dirname, "src/index.ts") } },
        server: { port: 5173, open: false },
        build: { outDir: resolve(__dirname, "playground-dist"), emptyOutDir: true },
      }
);
