#!/usr/bin/env node

/**
 * Fast WebP Keypad Background Generator (Test Version)
 *
 * Strategy:
 * 1. Pre-render all digit glyphs once (0-9 in 4 colors) = 40 WebP images
 * 2. For each combination, simply composite pre-rendered glyphs (fast blit operations)
 * 3. Process in parallel batches for maximum speed
 *
 * Output:
 * - /keypad-backgrounds-webp/*.webp
 */

import sharp from "sharp";
import cliProgress from "cli-progress";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OUTPUT_DIR = path.join(__dirname, "../public/keypad-backgrounds-webp");
const GLYPHS_DIR = path.join(OUTPUT_DIR, ".glyphs");

const COLORS = ["#27A9FF", "#FF83A2", "#00FFBC", "#FFFF78"];
const IMAGE_WIDTH = 3840; // 2x for retina
const IMAGE_HEIGHT = 2160; // 2x for retina
const DIGIT_WIDTH = 700; // 2x for retina
const DIGIT_HEIGHT = 1300; // 2x for retina
const DIGIT_SPACING = 100; // 2x for retina

const FORCE = process.argv.includes("--force");
const SINGLE_DIGITS_ONLY = process.argv.includes("--single-digits");
const BATCH_SIZE = 200; // Increased for WebP (faster format)

// WebP settings optimized for speed
const WEBP_QUALITY = 80;
const WEBP_EFFORT = 4; // 0-6, lower = faster (default is 4)

// Statistics
const stats = {
  glyphsGenerated: 0,
  generated: 0,
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
      viewBox="0 -100 1000 1800"
      width="${DIGIT_WIDTH}"
      height="${DIGIT_HEIGHT}"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <text
        x="510"
        y="900"
        font-size="1650"
        font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
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

async function fileExists(filepath) {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

/**
 * Step 1: Generate all digit glyphs
 */
async function generateGlyphs() {
  console.log("\n📐 Generating digit glyphs (WebP)...");

  await fs.mkdir(GLYPHS_DIR, { recursive: true });

  const tasks = [];

  for (let digit = 0; digit <= 9; digit++) {
    for (let colorIdx = 0; colorIdx < COLORS.length; colorIdx++) {
      const color = COLORS[colorIdx];
      const glyphName = `${digit}_${colorIdx}.webp`;
      const glyphPath = path.join(GLYPHS_DIR, glyphName);

      if (!FORCE && (await fileExists(glyphPath))) {
        continue;
      }

      tasks.push({ digit, colorIdx, color, glyphPath });
    }
  }

  if (tasks.length === 0) {
    console.log("✅ All glyphs already exist (use --force to regenerate)");
    return;
  }

  console.log(`Generating ${tasks.length} glyphs...`);

  // Process all in parallel
  await Promise.all(
    tasks.map(async ({ digit, color, glyphPath }) => {
      const svg = generateDigitSVG(digit, color);
      const buffer = Buffer.from(svg);

      // Generate WebP
      await sharp(buffer)
        .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
        .toFile(glyphPath);

      stats.glyphsGenerated++;
    })
  );

  console.log(`✅ Generated ${stats.glyphsGenerated} glyphs`);
}

/**
 * Step 2: Compose backgrounds
 */
async function composeBackgrounds() {
  console.log("\n🎨 Composing backgrounds (WebP)...");

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Generate combinations
  const combinations = [];

  if (SINGLE_DIGITS_ONLY) {
    // Only 0-9.webp
    for (let i = 0; i <= 9; i++) combinations.push(String(i));
  } else {
    // All combinations (0-9999)
    for (let i = 0; i <= 9; i++) combinations.push(String(i));
    for (let i = 0; i <= 99; i++) combinations.push(String(i).padStart(2, "0"));
    for (let i = 0; i <= 999; i++)
      combinations.push(String(i).padStart(3, "0"));
    for (let i = 0; i <= 9999; i++)
      combinations.push(String(i).padStart(4, "0"));
  }

  const progressBar = new cliProgress.SingleBar({
    format: "Progress |{bar}| {percentage}% | {value}/{total}",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  progressBar.start(combinations.length, 0);

  // Process in batches
  for (let i = 0; i < combinations.length; i += BATCH_SIZE) {
    const batch = combinations.slice(i, i + BATCH_SIZE);
    const tasks = [];

    for (const code of batch) {
      tasks.push(composeBackground(code, progressBar));
    }

    await Promise.all(tasks);
  }

  progressBar.stop();
  console.log(`✅ Generated ${stats.generated} backgrounds`);
  console.log(`⏭️  Skipped ${stats.skipped} existing files`);
}

/**
 * Compose single background
 */
async function composeBackground(code, progressBar) {
  const filepath = path.join(OUTPUT_DIR, `${code}.webp`);

  if (!FORCE && (await fileExists(filepath))) {
    stats.skipped++;
    progressBar.increment();
    return;
  }

  const digits = code.split("").map(Number);

  // Calculate total width including spacing between digits
  const totalWidth =
    DIGIT_WIDTH * digits.length + DIGIT_SPACING * (digits.length - 1);
  const xOffset = (IMAGE_WIDTH - totalWidth) / 2;
  const yOffset = (IMAGE_HEIGHT - DIGIT_HEIGHT) / 2;

  // Build composites
  const composites = [];
  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    const colorIdx = i % COLORS.length;
    const glyphPath = path.join(GLYPHS_DIR, `${digit}_${colorIdx}.webp`);

    composites.push({
      input: glyphPath,
      left: Math.round(xOffset + i * (DIGIT_WIDTH + DIGIT_SPACING)),
      top: Math.round(yOffset),
    });
  }

  // Create base image
  const backgroundColor = { r: 23, g: 23, b: 23, alpha: 1 }; // #171717

  const buffer = await sharp({
    create: {
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      channels: 4,
      background: backgroundColor,
    },
  })
    .composite(composites)
    .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
    .toBuffer();

  await fs.writeFile(filepath, buffer);

  stats.generated++;
  stats.totalSize += buffer.length;
  progressBar.increment();
}

/**
 * Main
 */
async function main() {
  console.log("🚀 Fast WebP Keypad Background Generator (TEST)\n");
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(
    `Mode: ${
      SINGLE_DIGITS_ONLY
        ? "Single digits only (0-9)"
        : "All combinations (0-9999)"
    }`
  );
  console.log(`Force: ${FORCE}`);
  console.log(`WebP quality: ${WEBP_QUALITY}, effort: ${WEBP_EFFORT}\n`);

  await generateGlyphs();
  await composeBackgrounds();

  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  const avgSize = stats.generated > 0 ? stats.totalSize / stats.generated : 0;

  console.log("\n✅ Complete!\n");
  console.log("Statistics:");
  console.log(`  Glyphs: ${stats.glyphsGenerated}`);
  console.log(`  Generated: ${stats.generated}`);
  console.log(`  Skipped: ${stats.skipped}`);
  console.log(`  Total size: ${formatSize(stats.totalSize)}`);
  console.log(`  Average size: ${formatSize(avgSize)}`);
  console.log(`  Duration: ${duration}s`);
  console.log(
    `  Speed: ${(stats.generated / parseFloat(duration)).toFixed(1)} images/sec`
  );
}

main().catch(console.error);
