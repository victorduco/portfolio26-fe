#!/usr/bin/env node

/**
 * Fast Keypad Background Generator
 *
 * Generates 10,000 PNG backgrounds by composing inline SVG digits.
 * Uses Sharp for SVG → PNG conversion (no browser needed).
 *
 * Features:
 * - Pure SVG composition (no DOM/browser)
 * - Parallel processing with batching
 * - Direct Sharp SVG → PNG conversion
 * - Automatic color cycling per digit
 *
 * Usage:
 *   npm run generate:backgrounds:fast
 *   npm run generate:backgrounds:fast -- --force
 *   npm run generate:backgrounds:fast -- --count=100
 */

import sharp from "sharp";
import cliProgress from "cli-progress";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OUTPUT_DIR = path.join(__dirname, "../public/keypad-backgrounds");
const COLORS = ["#27A9FF", "#FF83A2", "#00FFBC", "#FFFF78"];
const FORCE = process.argv.includes("--force");
const TEST_COUNT = process.argv.find((arg) => arg.startsWith("--count"));
const MAX_COUNT = TEST_COUNT ? parseInt(TEST_COUNT.split("=")[1]) : 10000;

// Image dimensions
const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;

// SVG digit dimensions - reduced to allow tight packing
const DIGIT_WIDTH = 400; // Reduced from 700 to pack tightly
const DIGIT_HEIGHT = 700;

// Statistics
const stats = {
  generated: 0,
  skipped: 0,
  failed: 0,
  totalSize: 0,
  startTime: Date.now(),
};

/**
 * Generate single SVG digit
 * @param {number} digit - Digit 0-9
 * @param {string} color - Hex color
 * @returns {string} - SVG string
 */
function generateDigitSVG(digit, color) {
  return `
    <svg
      viewBox="100 -50 500 900"
      width="${DIGIT_WIDTH}"
      height="${DIGIT_HEIGHT}"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <text
        x="350"
        y="400"
        font-size="825"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
        font-weight="400"
        text-anchor="middle"
        dominant-baseline="central"
        fill="${color}"
      >
        ${digit}
      </text>
    </svg>
  `.trim();
}

/**
 * Generate composite SVG with all digits placed horizontally
 * @param {number[]} digits - Array of 4 digits
 * @returns {string} - Complete SVG string
 */
function generateCompositeSVG(digits) {
  // Calculate total width (4 digits side by side)
  const totalDigitsWidth = DIGIT_WIDTH * digits.length;

  // Generate each digit as a group with x offset
  const digitElements = digits
    .map((digit, index) => {
      const color = COLORS[index % COLORS.length];
      const xOffset = index * DIGIT_WIDTH;

      return `
      <g transform="translate(${xOffset}, 0)">
        <svg
          viewBox="100 -50 500 900"
          width="${DIGIT_WIDTH}"
          height="${DIGIT_HEIGHT}"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="350"
            y="400"
            font-size="825"
            font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
            font-weight="400"
            text-anchor="middle"
            dominant-baseline="central"
            fill="${color}"
          >
            ${digit}
          </text>
        </svg>
      </g>
    `;
    })
    .join("");

  // Center the digits in the image
  const xOffset = (IMAGE_WIDTH - totalDigitsWidth) / 2;
  const yOffset = (IMAGE_HEIGHT - DIGIT_HEIGHT) / 2;

  return `
    <svg
      width="${IMAGE_WIDTH}"
      height="${IMAGE_HEIGHT}"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <rect width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" fill="#171717"/>
      <g transform="translate(${xOffset}, ${yOffset})">
        ${digitElements}
      </g>
    </svg>
  `.trim();
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
async function generateBackground(code, progressBar) {
  const filename = `${code}.png`;
  const filepath = path.join(OUTPUT_DIR, filename);

  // Skip if exists
  if (!FORCE && (await fileExists(filepath))) {
    stats.skipped++;
    progressBar.increment();
    return;
  }

  try {
    // Convert code to digit array
    const digits = code.split("").map(Number);

    // Generate composite SVG
    const svg = generateCompositeSVG(digits);

    // Convert to PNG with Sharp and apply effects
    const buffer = await sharp(Buffer.from(svg))
      .blur(5) // blur(10px) CSS ≈ blur(5) in sharp
      .modulate({
        brightness: 0.9,
        saturation: 0.9,
      })
      .linear(1.0, 0) // contrast
      .png({
        quality: 80,
        compressionLevel: 9,
        adaptiveFiltering: true,
      })
      .toBuffer();

    // Save
    await fs.writeFile(filepath, buffer);

    stats.generated++;
    stats.totalSize += buffer.length;
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
  console.log("🚀 Fast Keypad Background Generator\n");
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Size: ${IMAGE_WIDTH}x${IMAGE_HEIGHT}px`);

  // Generate all combinations: 1-digit, 2-digit, 3-digit, 4-digit
  const combinations = [];

  // 1 digit: 0-9 (10 combinations)
  for (let i = 0; i < 10; i++) {
    combinations.push(String(i));
  }

  // 2 digits: 00-99 (100 combinations)
  for (let i = 0; i < 100; i++) {
    combinations.push(String(i).padStart(2, "0"));
  }

  // 3 digits: 000-999 (1000 combinations)
  for (let i = 0; i < 1000; i++) {
    combinations.push(String(i).padStart(3, "0"));
  }

  // 4 digits: 0000-9999 (10000 combinations)
  for (let i = 0; i < 10000; i++) {
    combinations.push(String(i).padStart(4, "0"));
  }

  const totalCount = combinations.length;
  console.log(
    `Total: ${totalCount} combinations (1-digit: 10, 2-digit: 100, 3-digit: 1000, 4-digit: 10000)`
  );
  console.log(`Force: ${FORCE}\n`);

  // Create output dir
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Progress bar
  const progressBar = new cliProgress.SingleBar({
    format:
      "Progress |{bar}| {percentage}% | {value}/{total} | Generated: {generated} | Skipped: {skipped} | Failed: {failed}",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  progressBar.start(totalCount, 0, {
    generated: 0,
    skipped: 0,
    failed: 0,
  });

  // Generate all with parallel batches
  const batchSize = 100; // Process 100 at a time for maximum speed
  for (let i = 0; i < totalCount; i += batchSize) {
    const batch = [];
    for (let j = i; j < Math.min(i + batchSize, totalCount); j++) {
      batch.push(generateBackground(combinations[j], progressBar));
    }
    await Promise.all(batch);

    progressBar.update(Math.min(i + batchSize, totalCount), {
      generated: stats.generated,
      skipped: stats.skipped,
      failed: stats.failed,
    });
  }

  progressBar.stop();

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
  console.log(`  Speed: ${(totalCount / duration).toFixed(1)} images/sec`);
}

main().catch(console.error);
