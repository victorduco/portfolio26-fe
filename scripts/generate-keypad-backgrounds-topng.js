#!/usr/bin/env node

/**
 * Keypad Background Generator (toPng-based)
 *
 * Uses the EXACT same rendering pipeline as runtime for pixel-perfect matching:
 * 1. Launches your real Vue app in a headless browser
 * 2. Navigates to the keypad page
 * 3. Uses the browser's toPng function (same as GeBackground.vue)
 * 4. Applies the same CSS filters
 * 5. Saves the result
 *
 * This guarantees 100% identical output to what users see in production.
 *
 * Usage:
 *   npm run generate:backgrounds
 *   npm run generate:backgrounds -- --force (regenerate all)
 *   npm run generate:backgrounds -- --count=100 (generate first 100 only)
 */

import puppeteer from 'puppeteer';
import sharp from 'sharp';
import cliProgress from 'cli-progress';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OUTPUT_DIR = path.join(__dirname, '../public/keypad-backgrounds');
const DEV_SERVER_URL = 'http://localhost:5174'; // Vite dev server
const FORCE = process.argv.includes('--force');
const TEST_COUNT = process.argv.find(arg => arg.startsWith('--count'));
const MAX_COUNT = TEST_COUNT ? parseInt(TEST_COUNT.split('=')[1]) : 10000;
const BATCH_SIZE = 5; // Smaller batches for stability

// Statistics
const stats = {
  generated: 0,
  skipped: 0,
  failed: 0,
  totalSize: 0,
  startTime: Date.now(),
};

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
 * Wait for dev server to be ready
 */
async function waitForServer(url, timeout = 30000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch (error) {
      // Server not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error(`Server not ready at ${url} after ${timeout}ms`);
}

/**
 * Generate a single background image using the real app + toPng
 */
async function generateBackground(page, combination, progressBar) {
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
    const digits = code.split('').map(Number);

    // Click digits to populate enteredDigits array
    for (const digit of digits) {
      await page.keyboard.press(String(digit));
      await new Promise(resolve => setTimeout(resolve, 50)); // Wait for Vue reactivity
    }

    // Wait for background generation to complete
    await new Promise(resolve => setTimeout(resolve, 300));

    // Now capture the generated background from CSS variable
    const dataURL = await page.evaluate(async () => {
      // Get the current background from CSS variable
      const bgValue = getComputedStyle(document.documentElement).getPropertyValue('--global-keypad-bg');

      // Extract URL from `url("...")`
      const match = bgValue.match(/url\(["']?([^"')]+)["']?\)/);
      if (match && match[1]) {
        return match[1]; // This is already a data URL from toPng
      }

      throw new Error('No background generated');
    });

    // Convert data URL to buffer
    const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Optimize with sharp (optional, for smaller file size)
    const optimizedBuffer = await sharp(buffer)
      .png({
        quality: 80,
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true,
      })
      .toBuffer();

    // Save to file
    await fs.writeFile(filepath, optimizedBuffer);

    stats.generated++;
    stats.totalSize += optimizedBuffer.length;
    progressBar.increment();

  } catch (error) {
    stats.failed++;
    console.error(`\nFailed to generate ${code}:`, error.message);
    progressBar.increment();
  }
}

/**
 * Start dev server
 */
function startDevServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting Vite dev server...');

    const devServer = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '..'),
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });

    let serverReady = false;

    devServer.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:') && !serverReady) {
        serverReady = true;
        console.log('✅ Dev server ready');
        resolve(devServer);
      }
    });

    devServer.stderr.on('data', (data) => {
      const output = data.toString();
      if (output.includes('error') || output.includes('Error')) {
        console.error('Dev server error:', output);
      }
    });

    devServer.on('error', (error) => {
      reject(new Error(`Failed to start dev server: ${error.message}`));
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!serverReady) {
        devServer.kill();
        reject(new Error('Dev server did not start within 30 seconds'));
      }
    }, 30000);
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('🎨 Keypad Background Generator (toPng-based)\n');
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Total combinations: ${MAX_COUNT}`);
  console.log(`Force regenerate: ${FORCE}`);
  console.log(`Dev server: ${DEV_SERVER_URL}\n`);

  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Check if dev server is already running
  let devServer = null;
  let serverWasRunning = false;

  try {
    await waitForServer(DEV_SERVER_URL, 2000);
    console.log('✅ Dev server already running');
    serverWasRunning = true;
  } catch {
    // Start dev server
    devServer = await startDevServer();
    await waitForServer(DEV_SERVER_URL, 30000);
  }

  // Launch browser
  console.log('🌐 Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Navigate to the gate page (where keypad is located)
  console.log('📄 Loading gate page...');
  await page.goto(`${DEV_SERVER_URL}/gate`, { waitUntil: 'networkidle0' });

  // Wait for the background element to exist
  await page.waitForSelector('#keypad-bg-export', { timeout: 10000 });
  console.log('✅ App loaded, background element found\n');

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
  for (let i = 0; i < MAX_COUNT; i += BATCH_SIZE) {
    const batch = [];
    for (let j = i; j < Math.min(i + BATCH_SIZE, MAX_COUNT); j++) {
      batch.push(generateBackground(page, j, progressBar));
    }
    await Promise.all(batch);

    // Update progress bar with current stats
    progressBar.update(Math.min(i + BATCH_SIZE, MAX_COUNT), {
      generated: stats.generated,
      skipped: stats.skipped,
      failed: stats.failed,
    });
  }

  progressBar.stop();

  // Close browser
  await browser.close();

  // Stop dev server if we started it
  if (devServer && !serverWasRunning) {
    console.log('\n🛑 Stopping dev server...');
    devServer.kill();
  }

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
main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
