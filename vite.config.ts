import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true
  },
  plugins: [
    viteStaticCopy({
      targets: [{ src: "manifest.json", dest: "." }]
    })
  ]
});
