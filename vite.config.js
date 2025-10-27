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
            const { font, provider, cssName } = JSON.parse(body);
            const typographyPath = fileURLToPath(
              new URL("./src/styles/typography.css", import.meta.url)
            );
            let content = fs.readFileSync(typographyPath, "utf-8");

            let newFontValue;

            if (provider === "current") {
              // Keep zedou as is
              newFontValue = "zedou";
            } else if (provider === "google") {
              // Google fonts: use the display name
              const fontName = font.replace(/\+/g, " ");
              newFontValue = `"${fontName}", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;

              // Add Google Font import if not present
              const importUrl = `https://fonts.googleapis.com/css2?family=${font}:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap`;

              if (!content.includes(`@import url("${importUrl}")`)) {
                // Remove any existing @import
                content = content.replace(/@import url\([^)]+\);?\n?/g, "");
                // Add new @import at the beginning
                content = `@import url("${importUrl}");\n\n${content}`;
              }
            } else if (provider === "adobe") {
              // Adobe fonts: use the CSS name from Adobe
              newFontValue = `"${cssName}", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
              // Remove any @import for Google fonts
              content = content.replace(/@import url\([^)]+\);?\n?/g, "");
            }

            // Replace font-family value
            content = content.replace(
              /--font-family-base:\s*[^;]+;/,
              `--font-family-base: ${newFontValue};`
            );

            fs.writeFileSync(typographyPath, content, "utf-8");
            console.log(`✅ Font changed to: ${cssName || font} (${provider})`);

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
