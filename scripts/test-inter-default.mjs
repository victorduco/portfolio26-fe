#!/usr/bin/env node
/**
 * Screenshot script for default Inter font
 */

import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.join(process.cwd(), 'font-test-screenshots-inter');
const VIEWPORT = { width: 1920, height: 1080 };
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Create screenshots directory
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}
['01-keypad', '02-intro', '03-intro-opened'].forEach((dir) => {
  const fullPath = path.join(SCREENSHOTS_DIR, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

console.log('🚀 Taking screenshots with default Inter font\n');
console.log('================================\n');

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: VIEWPORT });
const page = await context.newPage();

console.log('🌐 Launching browser...\n');
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
console.log('Loading main page...\n');
await wait(3000);

console.log('📸 Taking screenshots...\n');

// Keypad screenshot
console.log('Taking keypad screenshot...');
await page.screenshot({
  path: path.join(SCREENSHOTS_DIR, '01-keypad', 'Inter___default.png'),
  fullPage: false,
});
console.log('  ✓ Inter (keypad)\n');

// Enter code and take intro screenshot
console.log('Entering code 1234...');
await page.keyboard.press('1');
await wait(300);
await page.keyboard.press('2');
await wait(300);
await page.keyboard.press('3');
await wait(300);
await page.keyboard.press('4');
await wait(300);

console.log('Waiting for intro section...\n');
await wait(3000);

console.log('Taking intro screenshot...');
await page.screenshot({
  path: path.join(SCREENSHOTS_DIR, '02-intro', 'Inter___default.png'),
  fullPage: false,
});
console.log('  ✓ Inter (intro)\n');

// Click first square for intro-opened
console.log('Clicking first square...\n');
const square = page.locator('.intro-square').first();
await square.click();
await wait(1000);

console.log('Taking intro-opened screenshot...');
await page.screenshot({
  path: path.join(SCREENSHOTS_DIR, '03-intro-opened', 'Inter___default.png'),
  fullPage: false,
});
console.log('  ✓ Inter (intro-opened)\n');

await browser.close();

console.log('================================');
console.log('✅ All done!');
console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);
