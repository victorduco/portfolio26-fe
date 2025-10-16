#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");
const videosDir = path.join(projectRoot, "src/assets/case-videos");
const compressionLogPath = path.join(projectRoot, ".video-compression-log.json");

// Load compression log
function loadCompressionLog() {
  try {
    if (fs.existsSync(compressionLogPath)) {
      return JSON.parse(fs.readFileSync(compressionLogPath, "utf8"));
    }
  } catch (error) {
    console.warn("⚠️  Could not load compression log, starting fresh");
  }
  return {};
}

// Save compression log
function saveCompressionLog(log) {
  try {
    fs.writeFileSync(compressionLogPath, JSON.stringify(log, null, 2));
  } catch (error) {
    console.error("❌ Could not save compression log:", error.message);
  }
}

// Get file hash for tracking changes
function getFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return crypto.createHash("md5").update(content).digest("hex");
  } catch (error) {
    return null;
  }
}

// Check if file was already compressed
function isAlreadyCompressed(filePath, log) {
  const fileName = path.basename(filePath);
  const fileHash = getFileHash(filePath);
  
  if (!fileHash) return false;
  
  const logEntry = log[fileName];
  if (!logEntry) return false;
  
  // Check if file hash matches (file hasn't changed)
  return logEntry.hash === fileHash && logEntry.compressed === true;
}

// Mark file as compressed
function markAsCompressed(filePath, log) {
  const fileName = path.basename(filePath);
  const fileHash = getFileHash(filePath);
  
  log[fileName] = {
    hash: fileHash,
    compressed: true,
    timestamp: new Date().toISOString(),
  };
}

// Check if ffmpeg is available
function checkFFmpeg() {
  try {
    execSync("ffmpeg -version", { stdio: "pipe" });
    return true;
  } catch (error) {
    console.error(
      "❌ FFmpeg not found. Please install FFmpeg to compress videos."
    );
    console.error("Install with: brew install ffmpeg (on macOS)");
    return false;
  }
}

// Compress a single video file
function compressVideo(inputPath, outputPath) {
  const tempPath = outputPath.replace(".mp4", "_temp.mp4");

  try {
    console.log(`🎬 Compressing: ${path.basename(inputPath)}`);

    // Get original file size
    const originalStats = fs.statSync(inputPath);
    const originalSizeMB = (originalStats.size / (1024 * 1024)).toFixed(1);

    // Compress video with optimized settings
    const command = [
      "ffmpeg",
      "-i",
      inputPath,
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "18",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
      "-y", // Overwrite output file
      tempPath,
    ].join(" ");

    execSync(command, { stdio: "pipe" });

    // Get compressed file size
    const compressedStats = fs.statSync(tempPath);
    const compressedSizeMB = (compressedStats.size / (1024 * 1024)).toFixed(1);
    const compressionRatio = (
      (1 - compressedStats.size / originalStats.size) *
      100
    ).toFixed(1);

    // Replace original with compressed version
    fs.renameSync(tempPath, outputPath);

    console.log(
      `✅ Compressed: ${originalSizeMB}MB → ${compressedSizeMB}MB (${compressionRatio}% reduction)`
    );

    return {
      original: originalSizeMB,
      compressed: compressedSizeMB,
      ratio: compressionRatio,
    };
  } catch (error) {
    // Clean up temp file if it exists
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    throw error;
  } finally {
    // Clean up temp file after successful operation
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
}

// Main compression function
function compressAllVideos() {
  console.log("🎥 Starting video compression...\n");

  if (!fs.existsSync(videosDir)) {
    console.log("📁 No videos directory found, skipping compression");
    return;
  }

  // Load compression log
  const compressionLog = loadCompressionLog();

  const videoFiles = fs
    .readdirSync(videosDir)
    .filter((file) => file.endsWith(".mp4") && !file.includes("_original"))
    .map((file) => path.join(videosDir, file));

  if (videoFiles.length === 0) {
    console.log("📁 No MP4 files found to compress");
    return;
  }

  console.log(`Found ${videoFiles.length} video file(s) to check:\n`);

  const results = [];
  const newFilesToCompress = [];
  const alreadyCompressed = [];

  // Check which files need compression
  for (const videoPath of videoFiles) {
    const fileName = path.basename(videoPath);
    
    if (isAlreadyCompressed(videoPath, compressionLog)) {
      alreadyCompressed.push(fileName);
      console.log(`⏭️  Skipping ${fileName} (already compressed)`);
    } else {
      newFilesToCompress.push(videoPath);
    }
  }

  if (newFilesToCompress.length === 0) {
    console.log("✅ All videos are already compressed!");
    if (alreadyCompressed.length > 0) {
      console.log(`📋 Skipped ${alreadyCompressed.length} already compressed file(s)`);
    }
    return;
  }

  console.log(`\n🎬 Compressing ${newFilesToCompress.length} new/updated file(s):\n`);

  // Compress new/updated files
  for (const videoPath of newFilesToCompress) {
    try {
      // Compress video directly (no backup)
      const result = compressVideo(videoPath, videoPath);
      
      // Mark as compressed in log
      markAsCompressed(videoPath, compressionLog);
      
      results.push({
        file: path.basename(videoPath),
        ...result,
      });
    } catch (error) {
      console.error(
        `❌ Failed to compress ${path.basename(videoPath)}:`,
        error.message
      );
    }
  }

  // Save updated compression log
  saveCompressionLog(compressionLog);

  // Summary
  if (results.length > 0) {
    console.log("\n📊 Compression Summary:");
    console.log("─".repeat(50));

    let totalOriginal = 0;
    let totalCompressed = 0;

    results.forEach((result) => {
      console.log(
        `${result.file}: ${result.original}MB → ${result.compressed}MB (${result.ratio}%)`
      );
      totalOriginal += parseFloat(result.original);
      totalCompressed += parseFloat(result.compressed);
    });

    const totalReduction = (
      (1 - totalCompressed / totalOriginal) *
      100
    ).toFixed(1);
    console.log("─".repeat(50));
    console.log(
      `Total: ${totalOriginal.toFixed(1)}MB → ${totalCompressed.toFixed(
        1
      )}MB (${totalReduction}% reduction)`
    );
    console.log(
      `💾 Space saved: ${(totalOriginal - totalCompressed).toFixed(1)}MB`
    );
  }

  console.log("\n✅ Video compression completed!");
}

// Run compression
if (checkFFmpeg()) {
  compressAllVideos();
} else {
  process.exit(1);
}
