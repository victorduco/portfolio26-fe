#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");
const imagesDir = path.join(projectRoot, "public/images");

// Marker file to track compressed images
const COMPRESSED_MARKER = ".compressed-images.json";
const markerPath = path.join(imagesDir, COMPRESSED_MARKER);

// Compression settings
const SETTINGS = {
  png: {
    quality: 80,
    compressionLevel: 9,
    effort: 10,
  },
  jpeg: {
    quality: 85,
    mozjpeg: true,
  },
  webp: {
    quality: 85,
  },
};

// Load compressed images registry
function loadCompressedRegistry() {
  try {
    if (fs.existsSync(markerPath)) {
      const data = fs.readFileSync(markerPath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn("⚠️  Could not load compression registry, starting fresh");
  }
  return {};
}

// Save compressed images registry
function saveCompressedRegistry(registry) {
  fs.writeFileSync(markerPath, JSON.stringify(registry, null, 2));
}

// Get file hash based on size and mtime
function getFileHash(filePath) {
  const stats = fs.statSync(filePath);
  return `${stats.size}-${stats.mtimeMs}`;
}

// Check if image needs compression
function needsCompression(filePath, registry) {
  const fileName = path.basename(filePath);
  const currentHash = getFileHash(filePath);

  if (registry[fileName] && registry[fileName].hash === currentHash) {
    return false;
  }
  return true;
}

// Compress a single image
async function compressImage(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  const fileName = path.basename(inputPath);
  const tempPath = inputPath.replace(ext, `_temp${ext}`);

  try {
    console.log(`🖼️  Compressing: ${fileName}`);

    // Get original file size
    const originalStats = fs.statSync(inputPath);
    const originalSizeKB = (originalStats.size / 1024).toFixed(1);

    let sharpInstance = sharp(inputPath);

    // Get image metadata to preserve format-specific options
    const metadata = await sharpInstance.metadata();

    // Apply compression based on format
    if (ext === ".png") {
      sharpInstance = sharpInstance.png(SETTINGS.png);
    } else if (ext === ".jpg" || ext === ".jpeg") {
      sharpInstance = sharpInstance.jpeg(SETTINGS.jpeg);
    } else if (ext === ".webp") {
      sharpInstance = sharpInstance.webp(SETTINGS.webp);
    } else {
      console.log(`⏭️  Skipping ${fileName} (unsupported format)`);
      return null;
    }

    // Write to temp file
    await sharpInstance.toFile(tempPath);

    // Get compressed file size
    const compressedStats = fs.statSync(tempPath);
    const compressedSizeKB = (compressedStats.size / 1024).toFixed(1);

    // Only replace if we actually reduced size
    if (compressedStats.size < originalStats.size) {
      const compressionRatio = (
        (1 - compressedStats.size / originalStats.size) * 100
      ).toFixed(1);

      // Replace original with compressed version
      fs.renameSync(tempPath, inputPath);

      console.log(
        `✅ Compressed: ${originalSizeKB}KB → ${compressedSizeKB}KB (${compressionRatio}% reduction)`
      );

      return {
        original: parseFloat(originalSizeKB),
        compressed: parseFloat(compressedSizeKB),
        ratio: parseFloat(compressionRatio),
      };
    } else {
      // Remove temp file, keep original
      fs.unlinkSync(tempPath);
      console.log(`⏭️  Skipping ${fileName} (already optimized)`);
      return null;
    }
  } catch (error) {
    // Clean up temp file if it exists
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    throw error;
  }
}

// Main compression function
async function compressAllImages() {
  console.log("🖼️  Starting image compression...\n");

  if (!fs.existsSync(imagesDir)) {
    console.log("📁 No images directory found, skipping compression");
    return;
  }

  // Load registry of already compressed images
  const registry = loadCompressedRegistry();

  // Find all image files
  const imageExtensions = [".png", ".jpg", ".jpeg", ".webp"];
  const imageFiles = fs
    .readdirSync(imagesDir)
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext) && !file.includes("_temp");
    })
    .map((file) => path.join(imagesDir, file));

  if (imageFiles.length === 0) {
    console.log("📁 No image files found to compress");
    return;
  }

  console.log(`Found ${imageFiles.length} image file(s) to check:\n`);

  const results = [];
  const newFilesToCompress = [];
  const alreadyCompressed = [];

  // Check which files need compression
  for (const imagePath of imageFiles) {
    const fileName = path.basename(imagePath);

    if (!needsCompression(imagePath, registry)) {
      alreadyCompressed.push(fileName);
      console.log(`⏭️  Skipping ${fileName} (already compressed)`);
    } else {
      newFilesToCompress.push(imagePath);
    }
  }

  if (newFilesToCompress.length === 0) {
    console.log("\n✅ All images are already compressed!");
    if (alreadyCompressed.length > 0) {
      console.log(
        `📋 Skipped ${alreadyCompressed.length} already compressed file(s)`
      );
    }
    return;
  }

  console.log(
    `\n🖼️  Compressing ${newFilesToCompress.length} new/updated file(s):\n`
  );

  // Compress new/updated files
  for (const imagePath of newFilesToCompress) {
    try {
      const result = await compressImage(imagePath);

      if (result) {
        results.push({
          file: path.basename(imagePath),
          ...result,
        });
      }

      // Update registry with new hash
      const fileName = path.basename(imagePath);
      registry[fileName] = {
        hash: getFileHash(imagePath),
        compressedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error(
        `❌ Failed to compress ${path.basename(imagePath)}:`,
        error.message
      );
    }
  }

  // Save updated registry
  saveCompressedRegistry(registry);

  // Summary
  if (results.length > 0) {
    console.log("\n📊 Compression Summary:");
    console.log("─".repeat(50));

    let totalOriginal = 0;
    let totalCompressed = 0;

    results.forEach((result) => {
      console.log(
        `${result.file}: ${result.original}KB → ${result.compressed}KB (${result.ratio}%)`
      );
      totalOriginal += result.original;
      totalCompressed += result.compressed;
    });

    const totalReduction = (
      (1 - totalCompressed / totalOriginal) * 100
    ).toFixed(1);
    console.log("─".repeat(50));
    console.log(
      `Total: ${totalOriginal.toFixed(1)}KB → ${totalCompressed.toFixed(1)}KB (${totalReduction}% reduction)`
    );
    console.log(
      `💾 Space saved: ${(totalOriginal - totalCompressed).toFixed(1)}KB`
    );
  }

  console.log("\n✅ Image compression completed!");
}

// Run compression
compressAllImages().catch((error) => {
  console.error("❌ Image compression failed:", error.message);
  process.exit(1);
});
