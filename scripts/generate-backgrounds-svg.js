#!/usr/bin/env node

/**
 * SVG-based Keypad Background Generator
 *
 * Generates 10,000 PNG backgrounds by composing SVG digit files.
 * This approach is:
 * - Faster than toPng (no DOM rendering needed)
 * - 100% pixel-perfect (uses exact same SVG files as runtime)
 * - Independent of browser/fonts (pre-rendered SVG)
 *
 * Usage:
 *   npm run generate:backgrounds
 *   npm run generate:backgrounds -- --force
 *   npm run generate:backgrounds -- --count=100
 */

import puppeteer from "puppeteer";
import sharp from "sharp";
import cliProgress from "cli-progress";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OUTPUT_DIR = path.join(__dirname, "../public/keypad-backgrounds");
const SVG_DIR = path.join(__dirname, "../public/keypad-digits");
const COLORS = ["#27A9FF", "#FF83A2", "#00FFBC", "#FFFF78"];
const FORCE = process.argv.includes("--force");
const TEST_COUNT = process.argv.find((arg) => arg.startsWith("--count"));
const MAX_COUNT = TEST_COUNT ? parseInt(TEST_COUNT.split("=")[1]) : 10000;
const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;

// Statistics
const stats = {
  generated: 0,
  skipped: 0,
  failed: 0,
  totalSize: 0,
  startTime: Date.now(),
};

// Load all SVG files into memory
let svgCache = {};

/**
 * Load SVG files (0-9) into memory
 */
async function loadSVGFiles() {
  for (let i = 0; i < 10; i++) {
    const svgPath = path.join(SVG_DIR, `${i}.svg`);
    const svgContent = await fs.readFile(svgPath, "utf-8");
    // Convert to base64 for embedding
    svgCache[i] =
      "data:image/svg+xml;base64," + Buffer.from(svgContent).toString("base64");
  }
}

/**
 * Generate HTML for composition
 */
function generateHTML(digits) {
  const digitElements = digits
    .map((digit, index) => {
      const color = COLORS[index % COLORS.length];
      const svgDataURL = svgCache[digit];

      return `
      <div class="background-digit" style="background-color: ${color};">
        <img src="${svgDataURL}" class="digit-svg" />
      </div>
    `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: #171717;
      width: ${IMAGE_WIDTH}px;
      height: ${IMAGE_HEIGHT}px;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    .background-numbers {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    .background-digit {
      width: auto;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      /* Negative margin for overlap - same as runtime */
      margin: 0 -30px;
    }

    .background-digit:first-child {
      margin-left: 0;
    }

    .background-digit:last-child {
      margin-right: 0;
    }

    .digit-svg {
      width: 700px;
      height: 700px;
      display: block;
      /* Mix blend mode to make black text visible on colored background */
      mix-blend-mode: multiply;
    }
  </style>
</head>
<body>
  <div class="background-numbers">
    ${digitElements}
  </div>
</body>
</html>`;
}

/**
 * Check if file exists
 */
async function fileExists(filepath) {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format file size
 */
function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

/**
 * Generate single background
 */
async function generateBackground(browser, combination, progressBar) {
  const code = combination.toString().padStart(4, "0");
  const filename = `${code}.png`;
  const filepath = path.join(OUTPUT_DIR, filename);

  // Skip if exists
  if (!FORCE && (await fileExists(filepath))) {
    stats.skipped++;
    progressBar.increment();
    return;
  }

  try {
    const digits = code.split("").map(Number);
    const html = generateHTML(digits);

    // Create page
    const page = await browser.newPage();
    await page.setViewport({
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      deviceScaleFactor: 1,
    });
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Screenshot
    const screenshotBuffer = await page.screenshot({
      type: "png",
      omitBackground: false,
    });

    await page.close();

    // Apply filters and optimize with sharp
    const finalBuffer = await sharp(screenshotBuffer)
      .blur(15) // blur(15px) в sharp = сильнее, чем blur(15px) в CSS
      .modulate({
        brightness: 0.9,
        saturation: 1.0,
      })
      .linear(1.0, 0) // contrast
      .png({
        quality: 80,
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true,
      })
      .toBuffer();

    // Save
    await fs.writeFile(filepath, finalBuffer);

    stats.generated++;
    stats.totalSize += finalBuffer.length;
    progressBar.increment();
  } catch (error) {
    stats.failed++;
    console.error(`\nFailed to generate ${code}:`, error.message);
    progressBar.increment();
  }
}

/**
 * Main
 */
async function main() {
  console.log("🎨 SVG-based Keypad Background Generator\n");
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Size: ${IMAGE_WIDTH}x${IMAGE_HEIGHT}px`);
  console.log(`Total: ${MAX_COUNT} combinations`);
  console.log(`Force: ${FORCE}\n`);

  // Load SVG files
  console.log("📦 Loading SVG files...");
  await loadSVGFiles();
  console.log("✅ Loaded 10 SVG digits\n");

  // Create output dir
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Launch browser
  console.log("🚀 Launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // Progress bar
  const progressBar = new cliProgress.SingleBar({
    format:
      "Progress |{bar}| {percentage}% | {value}/{total} | Generated: {generated} | Skipped: {skipped} | Failed: {failed}",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  progressBar.start(MAX_COUNT, 0, {
    generated: 0,
    skipped: 0,
    failed: 0,
  });

  // Generate all
  const batchSize = 10;
  for (let i = 0; i < MAX_COUNT; i += batchSize) {
    const batch = [];
    for (let j = i; j < Math.min(i + batchSize, MAX_COUNT); j++) {
      batch.push(generateBackground(browser, j, progressBar));
    }
    await Promise.all(batch);

    progressBar.update(Math.min(i + batchSize, MAX_COUNT), {
      generated: stats.generated,
      skipped: stats.skipped,
      failed: stats.failed,
    });
  }

  progressBar.stop();

  await browser.close();

  // Summary
  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  const avgSize = stats.generated > 0 ? stats.totalSize / stats.generated : 0;

  console.log("\n✅ Generation complete!\n");
  console.log("Statistics:");
  console.log(`  Generated: ${stats.generated}`);
  console.log(`  Skipped: ${stats.skipped}`);
  console.log(`  Failed: ${stats.failed}`);
  console.log(`  Total size: ${formatSize(stats.totalSize)}`);
  console.log(`  Average size: ${formatSize(avgSize)}`);
  console.log(`  Duration: ${duration}s`);
  console.log(`  Speed: ${(MAX_COUNT / duration).toFixed(1)} images/sec`);
}

main().catch(console.error);
