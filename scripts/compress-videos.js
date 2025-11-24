#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const videosDir = path.join(__dirname, "../public/videos");

const checkFFmpeg = () => {
  try {
    execSync("ffmpeg -version", { stdio: "pipe" });
    return true;
  } catch {
    console.error("❌ FFmpeg not found. Install: brew install ffmpeg (macOS) or visit ffmpeg.org");
    return false;
  }
};

const isAlreadyCompressed = (videoPath) => {
  try {
    const output = execSync(`ffprobe -v quiet -print_format json -show_format -show_streams "${videoPath}"`, { stdio: "pipe" });
    const { format, streams } = JSON.parse(output.toString());
    return format?.tags?.comment === "compressed" || streams?.some(s => s.tags?.comment === "compressed");
  } catch {
    return false;
  }
};

const formatSize = (bytes) => (bytes / 1024 / 1024).toFixed(1);

const compressVideo = (inputPath) => {
  const tempPath = inputPath.replace(".mp4", "_temp.mp4");
  try {
    console.log(`🎬 Compressing: ${path.basename(inputPath)}`);
    const originalSize = fs.statSync(inputPath).size;

    execSync(`ffmpeg -i "${inputPath}" -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 128k -movflags +faststart -metadata comment=compressed -y "${tempPath}"`, { stdio: "pipe" });

    const compressedSize = fs.statSync(tempPath).size;
    fs.renameSync(tempPath, inputPath);

    const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    console.log(`✅ Compressed: ${formatSize(originalSize)}MB → ${formatSize(compressedSize)}MB (${ratio}% reduction)`);
    return { original: originalSize, compressed: compressedSize };
  } finally {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
};

const compressAllVideos = () => {
  console.log("🎥 Starting video compression...\n");

  if (!fs.existsSync(videosDir)) {
    console.log("📁 No videos directory found");
    return;
  }

  const videoFiles = fs.readdirSync(videosDir)
    .filter(f => f.endsWith(".mp4") && !f.includes("_original"))
    .map(f => path.join(videosDir, f));

  if (!videoFiles.length) {
    console.log("📁 No MP4 files found");
    return;
  }

  console.log(`Found ${videoFiles.length} video file(s) to check:\n`);

  const results = videoFiles.reduce((acc, videoPath) => {
    const fileName = path.basename(videoPath);
    if (isAlreadyCompressed(videoPath)) {
      console.log(`⏭️  Skipping ${fileName} (already compressed)`);
      return acc;
    }
    try {
      acc.push({ file: fileName, ...compressVideo(videoPath) });
    } catch (e) {
      console.error(`❌ Failed to compress ${fileName}:`, e);
    }
    return acc;
  }, []);

  if (results.length) {
    const totals = results.reduce((t, r) => ({ o: t.o + r.original, c: t.c + r.compressed }), { o: 0, c: 0 });
    console.log(`\n📊 Summary: ${formatSize(totals.o)}MB → ${formatSize(totals.c)}MB (${((1 - totals.c / totals.o) * 100).toFixed(1)}% reduction)`);
    console.log(`💾 Space saved: ${formatSize(totals.o - totals.c)}MB`);
  }

  console.log("\n✅ Video compression completed!");
};

if (checkFFmpeg()) compressAllVideos();
else process.exit(1);
