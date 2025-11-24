#!/usr/bin/env node

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const MANIFEST_PATH = path.join(projectRoot, "public/media-manifest.json");

const MEDIA_CONFIG = {
  images: { dir: "public/images", ext: [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"] },
  videos: { dir: "public/videos", ext: [".mp4", ".webm", ".mov"] },
  documents: { dir: "public/documents", ext: [".pdf"] },
};

const getHash = (filePath) => crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex").slice(0, 8);
const HASH_PATTERN = /^(.+)\.([a-f0-9]{8})(\.[^.]+)$/;

const processFile = (filePath) => {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const basename = path.basename(filePath, ext);
  const match = basename.match(/^(.+)\.([a-f0-9]{8})$/);

  const originalName = match ? match[1] : basename;
  const existingHash = match ? match[2] : null;
  const currentHash = getHash(filePath);

  if (existingHash === currentHash) {
    return { originalName: `${originalName}${ext}`, hashedName: path.basename(filePath), changed: false };
  }

  const hashedName = `${originalName}.${currentHash}${ext}`;
  fs.renameSync(filePath, path.join(dir, hashedName));
  return { originalName: `${originalName}${ext}`, hashedName, changed: true, oldName: match ? path.basename(filePath) : null };
};

const processDirectory = (dirPath, extensions, mediaType) => {
  if (!fs.existsSync(dirPath)) {
    console.log(`📁 Directory not found: ${dirPath}`);
    return {};
  }

  const files = fs.readdirSync(dirPath).filter(f => !f.startsWith(".") && extensions.includes(path.extname(f).toLowerCase()));
  console.log(`\n📂 Processing ${mediaType}: ${files.length} files`);

  const results = {};
  for (const file of files) {
    const result = processFile(path.join(dirPath, file));
    results[result.originalName] = result.hashedName;
    console.log(result.changed
      ? result.oldName ? `  🔄 ${result.oldName} → ${result.hashedName}` : `  ✨ ${result.originalName} → ${result.hashedName}`
      : `  ✓ ${result.hashedName}`);
  }

  // Clean orphaned files
  const orphaned = fs.readdirSync(dirPath).filter(f => {
    if (f.startsWith(".") || !extensions.includes(path.extname(f).toLowerCase())) return false;
    const match = f.match(HASH_PATTERN);
    return match && !Object.values(results).includes(f);
  });
  orphaned.forEach(f => { fs.unlinkSync(path.join(dirPath, f)); console.log(`  🗑️  Removed: ${f}`); });
  if (orphaned.length) console.log(`  ✨ Cleaned ${orphaned.length} orphaned file(s)`);

  return results;
};

const generateManifest = () => {
  console.log("🎬 Generating media manifest...\n");

  const manifest = { generated: new Date().toISOString() };
  for (const [type, { dir, ext }] of Object.entries(MEDIA_CONFIG)) {
    manifest[type] = processDirectory(path.join(projectRoot, dir), ext, type);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log("\n" + "─".repeat(50));
  console.log(`📊 Summary: ${Object.entries(MEDIA_CONFIG).map(([t]) => `${t}: ${Object.keys(manifest[t]).length}`).join(", ")}`);
  console.log(`   Output: ${MANIFEST_PATH}`);
  console.log("─".repeat(50) + "\n✅ Done!");
};

generateManifest();
