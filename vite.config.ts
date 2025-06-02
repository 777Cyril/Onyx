// vite.config.ts
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";


export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup:      "popup.html",
        options:    "options.html",
        content:    "src/content/inject.ts",
        background: "src/background.ts",
      },
      output: {
        // emit popup.js, options.js, content.js, background.js at dist root
        entryFileNames: "[name].js",
        // leave any CSS or other assets alone
        assetFileNames: "[name].[ext]"
      }
      
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "manifest.json",         dest: "." },
      ]
    })
  ]
  
});
