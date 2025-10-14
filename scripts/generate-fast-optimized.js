#!/usr/bin/env node

/**
 * Fast Optimized Keypad Background Generator
 *
 * Strategy:
 * 1. Pre-render all digit glyphs once (0-9 in 4 colors) = 40 sharp + 40 blurred PNGs
 * 2. For each combination, simply composite pre-rendered glyphs (fast blit operations)
 * 3. Process in parallel batches for maximum speed
 *
 * Output:
 * - /keypad-backgrounds/sharp/*.png
 * - /keypad-backgrounds/blurred/*.png
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
const GLYPHS_DIR = path.join(OUTPUT_DIR, ".glyphs");

const COLORS = ["#27A9FF", "#FF83A2", "#00FFBC", "#FFFF78"];
const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;
const DIGIT_WIDTH = 350; // Width of each digit glyph
const DIGIT_HEIGHT = 700;
const DIGIT_SPACING = 50; // Space between digits

const FORCE = process.argv.includes("--force");
const BATCH_SIZE = 100;

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
  console.log("\n📐 Generating digit glyphs...");

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

      if (!FORCE && (await fileExists(sharpPath)) && (await fileExists(blurredPath))) {
        continue;
      }

      tasks.push({ digit, colorIdx, color, sharpPath, blurredPath });
    }
  }

  if (tasks.length === 0) {
    console.log("✅ All glyphs already exist (use --force to regenerate)");
    return;
  }

  console.log(`Generating ${tasks.length} glyphs...`);

  // Process all in parallel
  await Promise.all(
    tasks.map(async ({ digit, color, sharpPath, blurredPath }) => {
      const svg = generateDigitSVG(digit, color);
      const buffer = Buffer.from(svg);

      // Sharp version
      const sharpBuffer = await sharp(buffer)
        .png({ quality: 80, compressionLevel: 9 })
        .toBuffer();
      await fs.writeFile(sharpPath, sharpBuffer);

      // Blurred version
      const blurredBuffer = await sharp(buffer)
        .blur(5)
        .modulate({ brightness: 0.9, saturation: 0.9 })
        .png({ quality: 80, compressionLevel: 9 })
        .toBuffer();
      await fs.writeFile(blurredPath, blurredBuffer);

      stats.glyphsGenerated += 2;
    })
  );

  console.log(`✅ Generated ${stats.glyphsGenerated} glyphs`);
}

/**
 * Step 2: Compose backgrounds
 */
async function composeBackgrounds() {
  console.log("\n🎨 Composing backgrounds...");

  await fs.mkdir(SHARP_DIR, { recursive: true });
  await fs.mkdir(BLURRED_DIR, { recursive: true });

  // Generate all combinations
  const combinations = [];

  for (let i = 0; i <= 9; i++) combinations.push(String(i));
  for (let i = 0; i <= 99; i++) combinations.push(String(i).padStart(2, "0"));
  for (let i = 0; i <= 999; i++) combinations.push(String(i).padStart(3, "0"));
  for (let i = 0; i <= 9999; i++) combinations.push(String(i).padStart(4, "0"));

  const progressBar = new cliProgress.SingleBar({
    format: "Progress |{bar}| {percentage}% | {value}/{total}",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  progressBar.start(combinations.length * 2, 0);

  // Process in batches
  for (let i = 0; i < combinations.length; i += BATCH_SIZE) {
    const batch = combinations.slice(i, i + BATCH_SIZE);
    const tasks = [];

    for (const code of batch) {
      tasks.push(composeBackground(code, "sharp", progressBar));
      tasks.push(composeBackground(code, "blurred", progressBar));
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
async function composeBackground(code, variant, progressBar) {
  const outputDir = variant === "sharp" ? SHARP_DIR : BLURRED_DIR;
  const filepath = path.join(outputDir, `${code}.png`);

  if (!FORCE && (await fileExists(filepath))) {
    stats.skipped++;
    progressBar.increment();
    return;
  }

  const digits = code.split("").map(Number);
  const glyphsDir = path.join(GLYPHS_DIR, variant);

  // Calculate total width including spacing between digits
  const totalWidth = DIGIT_WIDTH * digits.length + DIGIT_SPACING * (digits.length - 1);
  const xOffset = (IMAGE_WIDTH - totalWidth) / 2;
  const yOffset = (IMAGE_HEIGHT - DIGIT_HEIGHT) / 2;

  // Build composites
  const composites = [];
  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    const colorIdx = i % COLORS.length;
    const glyphPath = path.join(glyphsDir, `${digit}_${colorIdx}.png`);

    composites.push({
      input: glyphPath,
      left: Math.round(xOffset + i * (DIGIT_WIDTH + DIGIT_SPACING)),
      top: Math.round(yOffset),
    });
  }

  // Create base image
  const buffer = await sharp({
    create: {
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      channels: 4,
      background: { r: 23, g: 23, b: 23, alpha: 1 },
    },
  })
    .composite(composites)
    .png({ quality: 80, compressionLevel: 9 })
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
  console.log("🚀 Fast Optimized Keypad Background Generator\n");
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Force: ${FORCE}\n`);

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
  console.log(`  Speed: ${((stats.generated * 2) / parseFloat(duration)).toFixed(1)} images/sec`);
}

main().catch(console.error);
