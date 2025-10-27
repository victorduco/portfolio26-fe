import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import fs from "node:fs";
import path from "node:path";

// Check if pregenerated backgrounds exist
const publicDir = fileURLToPath(new URL("./public", import.meta.url));
const backgroundsDir = path.join(publicDir, "keypad-backgrounds");
const manifestPath = path.join(backgroundsDir, "manifest.json");
const backgroundsExist = fs.existsSync(backgroundsDir);
const manifestExists = fs.existsSync(manifestPath);

if (backgroundsExist) {
  console.log("✅ Pregenerated keypad backgrounds found");
  if (manifestExists) {
    console.log("✅ Background manifest found");
  } else {
    console.warn("⚠️  Manifest not found. Run 'npm run generate:backgrounds'");
  }
} else {
  console.warn(
    "⚠️  Pregenerated keypad backgrounds not found. Run 'npm run generate:backgrounds' to create them."
  );
}

// TEMP: Font switcher plugin (remove when done)
const tempFontSwitcherPlugin = () => ({
  name: "temp-font-switcher",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === "/__temp_change_font" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            const { font } = JSON.parse(body);
            const typographyPath = fileURLToPath(
              new URL("./src/styles/typography.css", import.meta.url)
            );
            let content = fs.readFileSync(typographyPath, "utf-8");

            // Replace font-family value
            content = content.replace(
              /--font-family-base:\s*"[^"]+"/,
              `--font-family-base: "${font}"`
            );

            fs.writeFileSync(typographyPath, content, "utf-8");
            console.log(`✅ Font changed to: ${font}`);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, font }));
          } catch (error) {
            console.error("❌ Error changing font:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: error.message }));
          }
        });
      } else {
        next();
      }
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tempFontSwitcherPlugin()],
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
