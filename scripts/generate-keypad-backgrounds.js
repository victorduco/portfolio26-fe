#!/usr/bin/env node

/**
 * Keypad Background Generator
 *
 * Generates all 10,000 possible keypad combinations (0000-9999) as PNG images.
 * Replicates the exact HTML/CSS structure from Keypad.vue component.
 *
 * Usage:
 *   npm run generate:backgrounds
 *   npm run generate:backgrounds -- --force (regenerate all)
 *   npm run generate:backgrounds -- --count 100 (generate first 100 only, for testing)
 */

import puppeteer from 'puppeteer';
import sharp from 'sharp';
import cliProgress from 'cli-progress';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OUTPUT_DIR = path.join(__dirname, '../public/keypad-backgrounds');
const IMAGE_SIZE = 2000; // 2000x2000px
const COLORS = ['#27A9FF', '#FF83A2', '#00FFBC', '#FFFF78'];
const FORCE = process.argv.includes('--force');
const TEST_COUNT = process.argv.find(arg => arg.startsWith('--count'));
const MAX_COUNT = TEST_COUNT ? parseInt(TEST_COUNT.split('=')[1]) : 10000;

// Statistics
const stats = {
  generated: 0,
  skipped: 0,
  failed: 0,
  totalSize: 0,
  startTime: Date.now(),
};

/**
 * Generate HTML for a specific combination of digits
 */
function generateHTML(digits) {
  const digitElements = digits
    .map((digit, index) => {
      const color = COLORS[index % COLORS.length];
      return `<div class="background-digit" style="color: ${color};">${digit}</div>`;
    })
    .join('');

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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      width: ${IMAGE_SIZE}px;
      height: ${IMAGE_SIZE}px;
      overflow: hidden;
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
      font-size: ${Math.floor(IMAGE_SIZE * 0.35)}px; /* 35% of image size */
      font-weight: 400;
      line-height: 1;
      opacity: 1;
      user-select: none;
      margin: 0 ${Math.floor(-IMAGE_SIZE * 0.015)}px; /* -1.5% spacing */
      display: block;
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
 * Check if a file already exists
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
 * Format file size in human-readable format
 */
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Generate a single background image
 */
async function generateBackground(browser, combination, progressBar) {
  const code = combination.toString().padStart(4, '0');
  const filename = `${code}.png`;
  const filepath = path.join(OUTPUT_DIR, filename);

  // Skip if file exists and not forced
  if (!FORCE && await fileExists(filepath)) {
    stats.skipped++;
    progressBar.increment();
    return;
  }

  try {
    // Convert code to digit array
    const digits = code.split('').map(Number);

    // Generate HTML
    const html = generateHTML(digits);

    // Create new page
    const page = await browser.newPage();
    await page.setViewport({ width: IMAGE_SIZE, height: IMAGE_SIZE, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Take screenshot
    const screenshotBuffer = await page.screenshot({
      type: 'png',
      omitBackground: false,
    });

    await page.close();

    // Apply CSS filters and optimize with sharp
    const finalBuffer = await sharp(screenshotBuffer)
      .blur(5) // blur(10px) in CSS ≈ blur(5) in sharp
      .modulate({
        brightness: 0.9,
        saturation: 0.9,
      })
      .linear(1.0, 0) // contrast adjustment
      .png({
        quality: 80,
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true, // Use palette-based PNG for smaller file size
      })
      .toBuffer();

    // Save to file
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
 * Main execution
 */
async function main() {
  console.log('🎨 Keypad Background Generator\n');
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Image size: ${IMAGE_SIZE}x${IMAGE_SIZE}px`);
  console.log(`Total combinations: ${MAX_COUNT}`);
  console.log(`Force regenerate: ${FORCE}\n`);

  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Launch browser
  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // Create progress bar
  const progressBar = new cliProgress.SingleBar({
    format: 'Progress |{bar}| {percentage}% | {value}/{total} | Generated: {generated} | Skipped: {skipped} | Failed: {failed}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  progressBar.start(MAX_COUNT, 0, {
    generated: 0,
    skipped: 0,
    failed: 0,
  });

  // Generate all combinations
  const batchSize = 10; // Process 10 images concurrently
  for (let i = 0; i < MAX_COUNT; i += batchSize) {
    const batch = [];
    for (let j = i; j < Math.min(i + batchSize, MAX_COUNT); j++) {
      batch.push(generateBackground(browser, j, progressBar));
    }
    await Promise.all(batch);

    // Update progress bar with current stats
    progressBar.update(Math.min(i + batchSize, MAX_COUNT), {
      generated: stats.generated,
      skipped: stats.skipped,
      failed: stats.failed,
    });
  }

  progressBar.stop();

  // Close browser
  await browser.close();

  // Print summary
  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  const avgSize = stats.generated > 0 ? stats.totalSize / stats.generated : 0;

  console.log('\n✅ Generation complete!\n');
  console.log('Statistics:');
  console.log(`  Generated: ${stats.generated}`);
  console.log(`  Skipped: ${stats.skipped}`);
  console.log(`  Failed: ${stats.failed}`);
  console.log(`  Total size: ${formatSize(stats.totalSize)}`);
  console.log(`  Average size: ${formatSize(avgSize)}`);
  console.log(`  Duration: ${duration}s`);
  console.log(`  Speed: ${(MAX_COUNT / duration).toFixed(1)} images/sec`);
}

// Run
main().catch(console.error);
