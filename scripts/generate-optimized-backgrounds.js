#!/usr/bin/env node

/**
 * Optimized Keypad Background Generator
 *
 * Strategy:
 * 1. Pre-render all digit glyphs (0-9) in all colors (4 colors) = 40 base PNGs
 * 2. Pre-render blurred versions of all glyphs = 40 blurred PNGs
 * 3. Compose final images by concatenating pre-rendered glyphs
 * 4. Reuse intermediate results: to make 1230-1239, reuse existing "123" image
 *
 * Output:
 * - /keypad-backgrounds/sharp/*.png (sharp composites)
 * - /keypad-backgrounds/blurred/*.png (blurred composites)
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
const SHARP_DIR = path.join(OUTPUT_DIR, "sharp");
const BLURRED_DIR = path.join(OUTPUT_DIR, "blurred");
const GLYPHS_DIR = path.join(OUTPUT_DIR, ".glyphs"); // Hidden dir for cached glyphs

const COLORS = ["#27A9FF", "#FF83A2", "#00FFBC", "#FFFF78"];
const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;
const DIGIT_WIDTH = 400;
const DIGIT_HEIGHT = 700;

const FORCE = process.argv.includes("--force");

// Statistics
const stats = {
  glyphsGenerated: 0,
  compositionsGenerated: 0,
  compositionsReused: 0,
  skipped: 0,
  totalSize: 0,
  startTime: Date.now(),
};

/**
 * Generate single SVG digit
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
 * Step 1: Generate all digit glyphs (sharp and blurred)
 */
async function generateGlyphs(progressBar) {
  console.log("\n📐 Step 1: Generating digit glyphs...");

  const glyphsSharpDir = path.join(GLYPHS_DIR, "sharp");
  const glyphsBlurredDir = path.join(GLYPHS_DIR, "blurred");

  await fs.mkdir(glyphsSharpDir, { recursive: true });
  await fs.mkdir(glyphsBlurredDir, { recursive: true });

  const tasks = [];

  for (let digit = 0; digit <= 9; digit++) {
    for (let colorIdx = 0; colorIdx < COLORS.length; colorIdx++) {
      const color = COLORS[colorIdx];
      const glyphName = `${digit}_${colorIdx}.png`;
      const sharpPath = path.join(glyphsSharpDir, glyphName);
      const blurredPath = path.join(glyphsBlurredDir, glyphName);

      // Skip if already exists and not forced
      if (
        !FORCE &&
        (await fileExists(sharpPath)) &&
        (await fileExists(blurredPath))
      ) {
        continue;
      }

      tasks.push(async () => {
        const svg = generateDigitSVG(digit, color);
        const buffer = Buffer.from(svg);

        // Generate sharp version
        const sharpBuffer = await sharp(buffer)
          .png({ quality: 80, compressionLevel: 9 })
          .toBuffer();
        await fs.writeFile(sharpPath, sharpBuffer);

        // Generate blurred version
        const blurredBuffer = await sharp(buffer)
          .blur(15)
          .modulate({ brightness: 0.9, saturation: 1.0 })
          .png({ quality: 80, compressionLevel: 9 })
          .toBuffer();
        await fs.writeFile(blurredPath, blurredBuffer);

        stats.glyphsGenerated += 2;
        progressBar.increment();
      });
    }
  }

  progressBar.start(tasks.length, 0);

  // Process in batches
  const batchSize = 10;
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    await Promise.all(batch.map((task) => task()));
  }

  progressBar.stop();
  console.log(`✅ Generated ${stats.glyphsGenerated} glyphs`);
}

/**
 * Step 2: Compose final backgrounds by concatenating glyphs
 * Reuse intermediate results where possible
 */
async function composeBackgrounds(progressBar) {
  console.log("\n🎨 Step 2: Composing backgrounds...");

  await fs.mkdir(SHARP_DIR, { recursive: true });
  await fs.mkdir(BLURRED_DIR, { recursive: true });

  // Generate all combinations: 1-digit, 2-digit, 3-digit, 4-digit
  const combinations = [];

  // 1 digit: 0-9
  for (let i = 0; i <= 9; i++) {
    combinations.push(String(i));
  }

  // 2 digits: 00-99
  for (let i = 0; i <= 99; i++) {
    combinations.push(String(i).padStart(2, "0"));
  }

  // 3 digits: 000-999
  for (let i = 0; i <= 999; i++) {
    combinations.push(String(i).padStart(3, "0"));
  }

  // 4 digits: 0000-9999
  for (let i = 0; i <= 9999; i++) {
    combinations.push(String(i).padStart(4, "0"));
  }

  progressBar.start(combinations.length * 2, 0); // x2 for sharp and blurred

  const cache = new Map(); // Cache for reusing intermediate images

  for (const code of combinations) {
    await composeBackground(code, "sharp", cache, progressBar);
    await composeBackground(code, "blurred", cache, progressBar);
  }

  progressBar.stop();
  console.log(`✅ Composed ${stats.compositionsGenerated} backgrounds`);
  console.log(`♻️  Reused ${stats.compositionsReused} intermediate results`);
}

/**
 * Compose single background
 * Strategy: Try to reuse existing prefix image (e.g., "123" for "1230")
 */
async function composeBackground(code, variant, cache, progressBar) {
  const outputDir = variant === "sharp" ? SHARP_DIR : BLURRED_DIR;
  const filepath = path.join(outputDir, `${code}.png`);

  // Skip if exists
  if (!FORCE && (await fileExists(filepath))) {
    stats.skipped++;
    progressBar.increment();
    return;
  }

  const digits = code.split("").map(Number);
  const cacheKey = `${variant}:${code}`;

  // Try to reuse prefix (e.g., "123" for "1234")
  let baseImage = null;
  let baseDigitsCount = 0;

  if (digits.length > 1) {
    const prefix = code.slice(0, -1);
    const prefixKey = `${variant}:${prefix}`;

    if (cache.has(prefixKey)) {
      baseImage = cache.get(prefixKey);
      baseDigitsCount = prefix.length;
      stats.compositionsReused++;
    }
  }

  // If no reusable prefix, start from scratch
  if (!baseImage) {
    const totalWidth = DIGIT_WIDTH * digits.length;
    const xOffset = (IMAGE_WIDTH - totalWidth) / 2;
    const yOffset = (IMAGE_HEIGHT - DIGIT_HEIGHT) / 2;

    baseImage = sharp({
      create: {
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        channels: 4,
        background: { r: 23, g: 23, b: 23, alpha: 1 },
      },
    });

    // Composite all digits
    const composites = [];
    const glyphsDir = path.join(
      GLYPHS_DIR,
      variant === "sharp" ? "sharp" : "blurred"
    );

    for (let i = 0; i < digits.length; i++) {
      const digit = digits[i];
      const colorIdx = i % COLORS.length;
      const glyphPath = path.join(glyphsDir, `${digit}_${colorIdx}.png`);

      composites.push({
        input: glyphPath,
        left: Math.round(xOffset + i * DIGIT_WIDTH),
        top: Math.round(yOffset),
      });
    }

    baseImage = baseImage.composite(composites);
  } else {
    // Reuse prefix image and add only the last digit
    const lastDigit = digits[digits.length - 1];
    const colorIdx = baseDigitsCount % COLORS.length;

    const glyphsDir = path.join(
      GLYPHS_DIR,
      variant === "sharp" ? "sharp" : "blurred"
    );
    const glyphPath = path.join(glyphsDir, `${lastDigit}_${colorIdx}.png`);

    const totalWidth = DIGIT_WIDTH * digits.length;
    const xOffset = (IMAGE_WIDTH - totalWidth) / 2;
    const yOffset = (IMAGE_HEIGHT - DIGIT_HEIGHT) / 2;

    // Clone base and add last digit
    const baseBuffer = await baseImage.clone().toBuffer();

    baseImage = sharp(baseBuffer).composite([
      {
        input: glyphPath,
        left: Math.round(xOffset + baseDigitsCount * DIGIT_WIDTH),
        top: Math.round(yOffset),
      },
    ]);
  }

  // Save
  const buffer = await baseImage
    .png({ quality: 80, compressionLevel: 9 })
    .toBuffer();
  await fs.writeFile(filepath, buffer);

  // Cache for reuse
  cache.set(cacheKey, sharp(buffer));

  stats.compositionsGenerated++;
  stats.totalSize += buffer.length;
  progressBar.increment();
}

/**
 * Main
 */
async function main() {
  console.log("🚀 Optimized Keypad Background Generator\n");
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Force regenerate: ${FORCE}\n`);

  // Step 1: Generate glyphs
  const glyphProgressBar = new cliProgress.SingleBar({
    format: "Glyphs |{bar}| {percentage}% | {value}/{total}",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  await generateGlyphs(glyphProgressBar);

  // Step 2: Compose backgrounds
  const composeProgressBar = new cliProgress.SingleBar({
    format: "Compose |{bar}| {percentage}% | {value}/{total}",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  await composeBackgrounds(composeProgressBar);

  // Summary
  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  const avgSize =
    stats.compositionsGenerated > 0
      ? stats.totalSize / stats.compositionsGenerated
      : 0;

  console.log("\n✅ Generation complete!\n");
  console.log("Statistics:");
  console.log(`  Glyphs generated: ${stats.glyphsGenerated}`);
  console.log(`  Compositions generated: ${stats.compositionsGenerated}`);
  console.log(`  Compositions reused: ${stats.compositionsReused}`);
  console.log(`  Skipped: ${stats.skipped}`);
  console.log(`  Total size: ${formatSize(stats.totalSize)}`);
  console.log(`  Average size: ${formatSize(avgSize)}`);
  console.log(`  Duration: ${duration}s`);
}

main().catch(console.error);
