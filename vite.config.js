import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from 'vite-svg-loader';
import { fileURLToPath, URL } from "node:url";
import fs from "node:fs";
import path from "node:path";

// Check if pregenerated backgrounds exist
const publicDir = fileURLToPath(new URL("./public", import.meta.url));
const backgroundsDir = path.join(publicDir, "keypad-backgrounds");
const manifestPath = path.join(backgroundsDir, "manifest.json");
const backgroundsExist = fs.existsSync(backgroundsDir);
const manifestExists = fs.existsSync(manifestPath);

if (!backgroundsExist) {
  console.warn(
    "⚠️  Pregenerated keypad backgrounds not found. Run 'npm run generate:backgrounds' to create them."
  );
} else if (!manifestExists) {
  console.warn("⚠️  Manifest not found. Run 'npm run generate:backgrounds'");
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader({
      defaultImport: 'url' // По умолчанию импортировать как URL, а не компонент
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    manifest: true,
    // Ensure keypad-backgrounds are copied to dist
    rollupOptions: {
      external: [],
    },
  },
  // Configure dev server to disable caching completely
  server: {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  },
});
