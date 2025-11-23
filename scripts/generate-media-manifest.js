#!/usr/bin/env node

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

// Directories to process
const MEDIA_DIRS = {
  images: path.join(projectRoot, "public/images"),
  videos: path.join(projectRoot, "public/videos"),
  documents: path.join(projectRoot, "public/documents"),
};

// Output manifest path
const MANIFEST_PATH = path.join(projectRoot, "public/media-manifest.json");

// Supported extensions
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"];
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];
const DOCUMENT_EXTENSIONS = [".pdf"];

// Generate content hash for a file
function getContentHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(content).digest("hex").slice(0, 8);
}

// Get hashed filename
function getHashedFilename(filePath) {
  const ext = path.extname(filePath);
  const basename = path.basename(filePath, ext);
  const hash = getContentHash(filePath);
  return `${basename}.${hash}${ext}`;
}

// Rename file to hashed version if needed
function ensureHashedFilename(filePath, dryRun = false) {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const basename = path.basename(filePath, ext);

  // Check if already hashed (pattern: name.8charhash.ext)
  const hashPattern = /^(.+)\.([a-f0-9]{8})$/;
  const match = basename.match(hashPattern);

  if (match) {
    // Already has hash, verify it's correct
    const originalName = match[1];
    const existingHash = match[2];
    const currentHash = getContentHash(filePath);

    if (existingHash === currentHash) {
      // Hash is correct, no change needed
      return {
        originalName: `${originalName}${ext}`,
        hashedName: path.basename(filePath),
        changed: false,
      };
    } else {
      // Content changed, need new hash
      const newHashedName = `${originalName}.${currentHash}${ext}`;
      const newPath = path.join(dir, newHashedName);
      const oldPath = filePath;

      if (!dryRun) {
        fs.renameSync(filePath, newPath);
        // Delete old file with previous hash (already renamed, so delete oldPath which is now non-existent)
        // Actually, renameSync already moved it, so we don't need to delete
      }

      return {
        originalName: `${originalName}${ext}`,
        hashedName: newHashedName,
        changed: true,
        oldName: path.basename(filePath),
        oldPath: oldPath,
      };
    }
  } else {
    // No hash yet, add one
    const hash = getContentHash(filePath);
    const hashedName = `${basename}.${hash}${ext}`;
    const newPath = path.join(dir, hashedName);

    if (!dryRun) {
      fs.renameSync(filePath, newPath);
    }

    return {
      originalName: `${basename}${ext}`,
      hashedName: hashedName,
      changed: true,
    };
  }
}

// Clean up orphaned hashed files (files with hash but no corresponding current version)
function cleanOrphanedFiles(dirPath, extensions, processedFiles) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const hashPattern = /^(.+)\.([a-f0-9]{8})(\.[^.]+)$/;
  const allFiles = fs.readdirSync(dirPath);
  let cleanedCount = 0;

  for (const file of allFiles) {
    const ext = path.extname(file).toLowerCase();
    if (!extensions.includes(ext) || file.startsWith(".")) {
      continue;
    }

    const match = file.match(hashPattern);
    if (match) {
      const originalName = match[1] + match[3];

      // Check if this file is in our processed results
      const isCurrentVersion = Object.values(processedFiles).includes(file);

      if (!isCurrentVersion) {
        // This is an orphaned file (old hash version)
        const filePath = path.join(dirPath, file);
        fs.unlinkSync(filePath);
        console.log(`  🗑️  Removed orphaned file: ${file}`);
        cleanedCount++;
      }
    }
  }

  if (cleanedCount > 0) {
    console.log(`  ✨ Cleaned up ${cleanedCount} orphaned file(s)`);
  }
}

// Process a directory
function processDirectory(dirPath, extensions, mediaType) {
  const results = {};

  if (!fs.existsSync(dirPath)) {
    console.log(`📁 Directory not found: ${dirPath}`);
    return results;
  }

  const files = fs.readdirSync(dirPath).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    // Skip hidden files and already processed manifest
    return extensions.includes(ext) && !file.startsWith(".");
  });

  console.log(`\n📂 Processing ${mediaType}: ${files.length} files`);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const result = ensureHashedFilename(filePath);

    results[result.originalName] = result.hashedName;

    if (result.changed) {
      if (result.oldName) {
        console.log(`  🔄 ${result.oldName} → ${result.hashedName} (rehashed)`);
      } else {
        console.log(`  ✨ ${result.originalName} → ${result.hashedName}`);
      }
    } else {
      console.log(`  ✓ ${result.hashedName} (unchanged)`);
    }
  }

  // Clean up orphaned files after processing
  cleanOrphanedFiles(dirPath, extensions, results);

  return results;
}

// Main function
function generateManifest() {
  console.log("🎬 Generating media manifest...\n");

  const manifest = {
    generated: new Date().toISOString(),
    images: {},
    videos: {},
    documents: {},
  };

  // Process images
  manifest.images = processDirectory(
    MEDIA_DIRS.images,
    IMAGE_EXTENSIONS,
    "images"
  );

  // Process videos
  manifest.videos = processDirectory(
    MEDIA_DIRS.videos,
    VIDEO_EXTENSIONS,
    "videos"
  );

  // Process documents
  manifest.documents = processDirectory(
    MEDIA_DIRS.documents,
    DOCUMENT_EXTENSIONS,
    "documents"
  );

  // Write manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  // Summary
  const totalImages = Object.keys(manifest.images).length;
  const totalVideos = Object.keys(manifest.videos).length;
  const totalDocuments = Object.keys(manifest.documents).length;

  console.log("\n" + "─".repeat(50));
  console.log("📊 Manifest Summary:");
  console.log(`   Images: ${totalImages} files`);
  console.log(`   Videos: ${totalVideos} files`);
  console.log(`   Documents: ${totalDocuments} files`);
  console.log(`   Output: ${MANIFEST_PATH}`);
  console.log("─".repeat(50));
  console.log("\n✅ Media manifest generated successfully!");
}

// Run
generateManifest();
