#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "../public/images");
const markerPath = path.join(imagesDir, ".compressed-images.json");

const SETTINGS = {
  png: { quality: 80, compressionLevel: 9, effort: 10 },
  jpeg: { quality: 85, mozjpeg: true },
  webp: { quality: 85 },
};

const FORMATS = { ".png": "png", ".jpg": "jpeg", ".jpeg": "jpeg", ".webp": "webp" };

const loadRegistry = () => {
  try { return fs.existsSync(markerPath) ? JSON.parse(fs.readFileSync(markerPath, "utf-8")) : {}; }
  catch { return {}; }
};

const getFileHash = (p) => { const s = fs.statSync(p); return `${s.size}-${s.mtimeMs}`; };

const toKB = (bytes) => (bytes / 1024).toFixed(1);

async function compressImage(inputPath, registry) {
  const ext = path.extname(inputPath).toLowerCase();
  const fileName = path.basename(inputPath);
  const format = FORMATS[ext];

  if (!format) return null;
  if (registry[fileName]?.hash === getFileHash(inputPath)) {
    console.log(`⏭️  Skipping ${fileName} (already compressed)`);
    return null;
  }

  const tempPath = inputPath.replace(ext, `_temp${ext}`);
  try {
    console.log(`🖼️  Compressing: ${fileName}`);
    const origSize = fs.statSync(inputPath).size;

    await sharp(inputPath)[format](SETTINGS[format]).toFile(tempPath);
    const newSize = fs.statSync(tempPath).size;

    if (newSize >= origSize) {
      fs.unlinkSync(tempPath);
      console.log(`⏭️  Skipping ${fileName} (already optimized)`);
      registry[fileName] = { hash: getFileHash(inputPath), compressedAt: new Date().toISOString() };
      return null;
    }

    fs.renameSync(tempPath, inputPath);
    const ratio = ((1 - newSize / origSize) * 100).toFixed(1);
    console.log(`✅ Compressed: ${toKB(origSize)}KB → ${toKB(newSize)}KB (${ratio}% reduction)`);

    registry[fileName] = { hash: getFileHash(inputPath), compressedAt: new Date().toISOString() };
    return { original: origSize / 1024, compressed: newSize / 1024, ratio: +ratio };
  } catch (error) {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    throw error;
  }
}

async function compressAllImages() {
  console.log("🖼️  Starting image compression...\n");

  if (!fs.existsSync(imagesDir)) {
    console.log("📁 No images directory found, skipping compression");
    return;
  }

  const registry = loadRegistry();
  const imageFiles = fs.readdirSync(imagesDir)
    .filter((f) => FORMATS[path.extname(f).toLowerCase()] && !f.includes("_temp"))
    .map((f) => path.join(imagesDir, f));

  if (!imageFiles.length) {
    console.log("📁 No image files found to compress");
    return;
  }

  console.log(`Found ${imageFiles.length} image file(s) to check:\n`);

  const results = [];
  for (const imagePath of imageFiles) {
    try {
      const result = await compressImage(imagePath, registry);
      if (result) results.push(result);
    } catch (error) {
      console.error(`❌ Failed to compress ${path.basename(imagePath)}:`, error);
    }
  }

  fs.writeFileSync(markerPath, JSON.stringify(registry, null, 2));

  if (results.length) {
    const totalOrig = results.reduce((s, r) => s + r.original, 0);
    const totalComp = results.reduce((s, r) => s + r.compressed, 0);
    const totalRatio = ((1 - totalComp / totalOrig) * 100).toFixed(1);

    console.log("\n📊 Compression Summary:");
    console.log("─".repeat(50));
    console.log(`Total: ${totalOrig.toFixed(1)}KB → ${totalComp.toFixed(1)}KB (${totalRatio}% reduction)`);
    console.log(`💾 Space saved: ${(totalOrig - totalComp).toFixed(1)}KB`);
  }

  console.log("\n✅ Image compression completed!");
}

compressAllImages().catch((error) => {
  console.error("❌ Image compression failed:", error);
  process.exit(1);
});
