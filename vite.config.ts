// vite.config.ts
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup:      "src/popup/index.html",
        options:    "src/options/index.html",
        content:    "src/content/inject.ts",
        background: "src/background.ts"
      },
      output: {
        entryFileNames: "src/[name].js"
      }
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "manifest.json",         dest: "." },
        { src: "src/popup/**/*",        dest: "src/popup" },
        { src: "src/options/**/*",      dest: "src/options" }
      ]
    })
  ]
  
});
