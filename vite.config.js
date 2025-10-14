import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import fs from "node:fs";
import path from "node:path";

// Check if pregenerated backgrounds exist
const publicDir = fileURLToPath(new URL("./public", import.meta.url));
const backgroundsDir = path.join(publicDir, "keypad-backgrounds");
const backgroundsExist = fs.existsSync(backgroundsDir);

if (backgroundsExist) {
  console.log("✅ Pregenerated keypad backgrounds found");
} else {
  console.warn(
    "⚠️  Pregenerated keypad backgrounds not found. Run 'npm run generate:backgrounds' to create them."
  );
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
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
  // Configure dev server to serve images with proper headers
  server: {
    headers: {
      "Cache-Control": "public, max-age=31536000", // 1 year for static assets
    },
  },
});
