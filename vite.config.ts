// vite.config.ts
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
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
        { src: "src/popup/index.html",    dest: ".", rename: "popup.html" },
        { src: "src/options/index.html",  dest: ".", rename: "options.html" }
      ]
    })
  ]
  
});
