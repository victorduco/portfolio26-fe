#!/usr/bin/env node
/**
 * Unified Font Testing Script
 *
 * Usage:
 *   node scripts/test-all-fonts.mjs                                    # Test all fonts from config
 *   node scripts/test-all-fonts.mjs "https://fonts.google.com/..."     # Test single Google Font
 *   node scripts/test-all-fonts.mjs "https://fonts.adobe.com/..." id   # Test single Adobe Font
 *
 * Workflow:
 * 1. Save original typography.css and index.html
 * 2. For Adobe fonts: Add to Adobe project and publish
 * 3. For each font:
 *    - Google: Update @import and --font-family-base in typography.css
 *    - Adobe: Add link to index.html, update --font-family-base in typography.css
 *    - Wait for Vite to reload
 *    - Take screenshots (keypad, intro, intro-opened)
 * 4. Restore original files
 */

import { chromium } from 'playwright';
import https from 'https';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { FONTS_TO_TEST } from '../fonts-config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ADOBE_API_TOKEN = '01c487c410f58d24edd08cda2440d4be022ca3cd';
const ADOBE_PROJECT_ID = 'nme2qkx';
const SCREENSHOTS_DIR = path.join(process.cwd(), 'font-test-screenshots');
const TYPOGRAPHY_CSS = path.join(process.cwd(), 'src/styles/typography.css');
const INDEX_HTML = path.join(process.cwd(), 'index.html');
const VIEWPORT = { width: 1920, height: 1080 };

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Save originals
let ORIGINAL_TYPOGRAPHY_CSS = '';
let ORIGINAL_INDEX_HTML = '';

// ============================================================================
// Command Line Argument Parsing
// ============================================================================

function parseSingleFontFromArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    return null; // Use all fonts from config
  }

  const url = args[0];

  // Detect font type from URL
  if (url.includes('fonts.google.com')) {
    // Extract font name from URL
    const match = url.match(/\/specimen\/([^/?]+)/);
    if (!match) {
      console.error('❌ Invalid Google Fonts URL. Expected format: https://fonts.google.com/specimen/Font+Name');
      process.exit(1);
    }

    const fontFamily = match[1];
    const fontName = fontFamily.replace(/\+/g, ' ');

    return {
      type: 'google',
      name: fontName,
      url: url,
    };
  } else if (url.includes('fonts.adobe.com')) {
    // For Adobe fonts, ID is required as second argument
    const id = args[1];
    if (!id) {
      console.error('❌ Adobe Font ID required as second argument.');
      console.error('   Usage: node scripts/test-all-fonts.mjs "https://fonts.adobe.com/fonts/futura-pt" pcpv');
      process.exit(1);
    }

    const match = url.match(/\/fonts\/([^/?]+)/);
    if (!match) {
      console.error('❌ Invalid Adobe Fonts URL. Expected format: https://fonts.adobe.com/fonts/font-slug');
      process.exit(1);
    }

    const slug = match[1];
    const fontName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
      type: 'adobe',
      name: fontName,
      url: url,
      id: id,
    };
  } else {
    console.error('❌ Invalid URL. Must be either Google Fonts or Adobe Fonts URL.');
    process.exit(1);
  }
}

// ============================================================================
// File Modification Functions
// ============================================================================

function saveOriginalFiles() {
  console.log('💾 Saving original files...');
  ORIGINAL_TYPOGRAPHY_CSS = fs.readFileSync(TYPOGRAPHY_CSS, 'utf-8');
  ORIGINAL_INDEX_HTML = fs.readFileSync(INDEX_HTML, 'utf-8');
  console.log('  ✓ Files saved!\n');
}

function restoreOriginalFiles() {
  console.log('🔄 Restoring original files...');
  fs.writeFileSync(TYPOGRAPHY_CSS, ORIGINAL_TYPOGRAPHY_CSS, 'utf-8');
  fs.writeFileSync(INDEX_HTML, ORIGINAL_INDEX_HTML, 'utf-8');
  console.log('  ✓ Files restored!\n');
}

function extractGoogleFontFamily(url) {
  // Extract from: https://fonts.google.com/specimen/Open+Sans
  const match = url.match(/\/specimen\/(.+)$/);
  if (!match) return null;
  return match[1]; // Returns "Open+Sans" or "Roboto"
}

function extractAdobeFontSlug(url) {
  // Extract from: https://fonts.adobe.com/fonts/futura-pt
  const match = url.match(/\/fonts\/(.+)$/);
  if (!match) return null;
  return match[1]; // Returns "futura-pt"
}

function updateTypographyForGoogleFont(font) {
  const fontFamily = extractGoogleFontFamily(font.url);
  if (!fontFamily) {
    console.error(`  ✗ Invalid Google Font URL: ${font.url}`);
    return;
  }

  const fontName = fontFamily.replace(/\+/g, ' ');
  const fontValue = `"${fontName}", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;

  // Create new typography.css content
  const newContent = `@import url("https://fonts.googleapis.com/css2?family=${fontFamily}:wght@100..900&display=swap");

:root {
  --font-family-base: ${fontValue};
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-size-h1: clamp(40px, 5vw, 64px);
  --font-size-h2: clamp(32px, 4vw, 48px);
  --font-size-h3: clamp(24px, 3vw, 32px);
  --font-size-h4: clamp(20px, 2.5vw, 24px);
  --font-size-h5: clamp(18px, 2vw, 20px);
  --font-size-h6: clamp(16px, 1.8vw, 18px);
  --line-height-tight: 1.1;
  --line-height-snug: 1.2;
  --line-height-relaxed: 1.35;
}

h1,
.h1 {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-h1);
  line-height: var(--line-height-tight);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  margin: 0;
}

h2,
.h2 {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-h2);
  line-height: var(--line-height-snug);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  margin: 0;
}

h3,
.h3 {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-h3);
  line-height: var(--line-height-snug);
  color: var(--color-text-primary);
  margin: 0;
}

h4,
.h4 {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-h4);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-primary);
  margin: 0;
}

h5,
.h5 {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-h5);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-primary);
  margin: 0;
}

h6,
.h6 {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-h6);
  line-height: var(--line-height-relaxed);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-secondary);
  margin: 0;
}

p {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-regular);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 70ch;
}

.body1 {
  font-family: var(--font-family-base);
  font-weight: 300;
  font-size: clamp(20px, 3vw, 30px);
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin: 0;
}
`;

  fs.writeFileSync(TYPOGRAPHY_CSS, newContent, 'utf-8');
}

function updateTypographyForAdobeFont(font) {
  const slug = extractAdobeFontSlug(font.url);
  if (!slug) {
    console.error(`  ✗ Invalid Adobe Font URL: ${font.url}`);
    return;
  }

  const fontValue = `"${slug}", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;

  // For Adobe fonts, we don't need @import, just update the CSS variable
  // The font will be loaded via <link> in index.html
  let content = ORIGINAL_TYPOGRAPHY_CSS;

  // Remove @import line if exists
  content = content.replace(/@import url\([^)]+\);?\n?/g, '');

  // Update --font-family-base
  content = content.replace(
    /--font-family-base: [^;]+;/,
    `--font-family-base: ${fontValue};`
  );

  fs.writeFileSync(TYPOGRAPHY_CSS, content, 'utf-8');
}

function addAdobeFontsToHTML() {
  let html = ORIGINAL_INDEX_HTML;

  // Add Adobe Fonts link before </head>
  const adobeLink = `    <!-- Adobe Fonts -->\n    <link rel="stylesheet" href="https://use.typekit.net/${ADOBE_PROJECT_ID}.css" />\n  </head>`;
  html = html.replace('</head>', adobeLink);

  fs.writeFileSync(INDEX_HTML, html, 'utf-8');
}

function removeAdobeFontsFromHTML() {
  let html = fs.readFileSync(INDEX_HTML, 'utf-8');

  // Remove Adobe Fonts section
  html = html.replace(/<!-- Adobe Fonts -->\n.*?use\.typekit\.net.*?\n/g, '');

  fs.writeFileSync(INDEX_HTML, html, 'utf-8');
}

// ============================================================================
// Adobe Fonts API Functions
// ============================================================================

function addFontToAdobeProject(fontId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'typekit.com',
      port: 443,
      path: `/api/v1/json/kits/${ADOBE_PROJECT_ID}/families/${fontId}`,
      method: 'POST',
      headers: {
        'X-Typekit-Token': ADOBE_API_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve({ success: true, fontId });
        } else {
          resolve({ success: false, fontId, status: res.statusCode, data });
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.end();
  });
}

function publishAdobeProject() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'typekit.com',
      port: 443,
      path: `/api/v1/json/kits/${ADOBE_PROJECT_ID}/publish`,
      method: 'POST',
      headers: {
        'X-Typekit-Token': ADOBE_API_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (error) => reject(error));
    req.end();
  });
}

async function setupAdobeFonts(adobeFonts) {
  if (adobeFonts.length === 0) {
    console.log('No Adobe fonts to add.\n');
    return;
  }

  console.log(`\n📝 Adding ${adobeFonts.length} Adobe fonts to project...\n`);

  let added = 0;
  let failed = 0;
  const BATCH_SIZE = 10;
  const DELAY = 1000;

  for (let i = 0; i < adobeFonts.length; i += BATCH_SIZE) {
    const batch = adobeFonts.slice(i, i + BATCH_SIZE);
    const promises = batch.map(font => addFontToAdobeProject(font.id));
    const results = await Promise.all(promises);

    results.forEach((result, idx) => {
      if (result.success) {
        added++;
        console.log(`  ✓ [${added}/${adobeFonts.length}] ${batch[idx].name}`);
      } else {
        failed++;
        console.log(`  ✗ [${added}/${adobeFonts.length}] ${batch[idx].name} - Status: ${result.status}`);
      }
    });

    if (i + BATCH_SIZE < adobeFonts.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY));
    }
  }

  console.log(`\n  Added: ${added}, Failed: ${failed}`);

  console.log('\n📦 Publishing Adobe project...');
  const publishResult = await publishAdobeProject();
  console.log(`  Publish status: ${publishResult.status}`);

  // Wait for Adobe to propagate changes
  console.log('  Waiting for Adobe CDN to update...');
  await wait(5000);
  console.log('  ✓ Adobe fonts ready!\n');
}

// ============================================================================
// Auth Stubs
// ============================================================================

async function setupAuthStubs(page) {
  let isUserAuthenticated = false;

  await page.route('**/api/whoami', async (route) => {
    await route.fulfill({
      status: isUserAuthenticated ? 200 : 401,
      contentType: 'application/json',
      body: JSON.stringify({ ok: isUserAuthenticated }),
    });
  });

  await page.route('**/api/check-code', async (route, request) => {
    try {
      const postData = await request.postDataJSON();
      const isOk = postData && postData.code === '1234';
      if (isOk) {
        isUserAuthenticated = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true }),
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ ok: false, error: 'Invalid code' }),
        });
      }
    } catch {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ ok: false, error: 'stub error' }),
      });
    }
  });
}

// ============================================================================
// Screenshot Functions
// ============================================================================

async function takeScreenshotsForFont(page, font, dirs) {
  const { keypadDir, introDir, introOpenedDir } = dirs;
  const safeName = font.name.replace(/\s+/g, '-');

  // Update files based on font type
  if (font.type === 'google') {
    updateTypographyForGoogleFont(font);
  } else if (font.type === 'adobe') {
    updateTypographyForAdobeFont(font);
  }

  // Wait for Vite to reload
  await wait(3000);

  // Reload page to pick up changes
  await page.reload({ waitUntil: 'domcontentloaded' });
  await wait(2000);

  // Screenshot 1: Keypad
  console.log(`  - ${font.name} (keypad)...`);
  await page.screenshot({
    path: path.join(keypadDir, `${safeName}.png`),
    fullPage: false,
  });

  return { safeName };
}

async function takeAllScreenshots(page, fonts) {
  console.log('\n📸 Taking screenshots...\n');

  // Create directories
  const keypadDir = path.join(SCREENSHOTS_DIR, '01-keypad');
  const introDir = path.join(SCREENSHOTS_DIR, '02-intro');
  const introOpenedDir = path.join(SCREENSHOTS_DIR, '03-intro-opened');

  [keypadDir, introDir, introOpenedDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const dirs = { keypadDir, introDir, introOpenedDir };

  // Take keypad screenshots for all fonts
  console.log('Taking keypad screenshots...');
  for (const font of fonts) {
    await takeScreenshotsForFont(page, font, dirs);
  }

  // Restore original to proceed with intro
  console.log('\nRestoring original font for navigation...');
  restoreOriginalFiles();
  await wait(2000);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await wait(2000);

  // Enter code 1234
  console.log('Entering code 1234...');
  await page.keyboard.press('1');
  await wait(300);
  await page.keyboard.press('2');
  await wait(300);
  await page.keyboard.press('3');
  await wait(300);
  await page.keyboard.press('4');
  await wait(500);

  // Wait for intro section
  console.log('Waiting for intro section...');
  await page.waitForFunction(
    () => {
      const introSection = document.getElementById('intro');
      return introSection && introSection.classList.contains('intro-visible');
    },
    { timeout: 15000 }
  );

  await page.waitForFunction(
    () => {
      const squares = document.querySelectorAll('.intro-square');
      return (
        squares.length === 4 &&
        Array.from(squares).every((square) => {
          const computedStyle = window.getComputedStyle(square);
          return (
            computedStyle.opacity === '1' &&
            computedStyle.visibility !== 'hidden'
          );
        })
      );
    },
    { timeout: 15000 }
  );

  await wait(1500);

  // Take intro screenshots for all fonts
  console.log('\nTaking intro screenshots...');
  for (const font of fonts) {
    const safeName = font.name.replace(/\s+/g, '-');

    if (font.type === 'google') {
      updateTypographyForGoogleFont(font);
    } else if (font.type === 'adobe') {
      updateTypographyForAdobeFont(font);
    }

    await wait(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await wait(2000);

    // Re-navigate to intro (code already entered)
    const hasIntro = await page.evaluate(() => {
      const intro = document.getElementById('intro');
      return intro && intro.classList.contains('intro-visible');
    });

    if (!hasIntro) {
      await page.keyboard.press('1');
      await wait(300);
      await page.keyboard.press('2');
      await wait(300);
      await page.keyboard.press('3');
      await wait(300);
      await page.keyboard.press('4');
      await wait(1500);
    }

    console.log(`  - ${font.name} (intro)...`);
    await page.screenshot({
      path: path.join(introDir, `${safeName}.png`),
      fullPage: false,
    });
  }

  // Restore and click first rectangle
  console.log('\nRestoring original font for rectangle click...');
  restoreOriginalFiles();
  await wait(2000);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await wait(2000);

  // Navigate back to intro
  await page.keyboard.press('1');
  await wait(300);
  await page.keyboard.press('2');
  await wait(300);
  await page.keyboard.press('3');
  await wait(300);
  await page.keyboard.press('4');
  await wait(1500);

  console.log('Clicking first rectangle...');
  const firstSquare = page.locator('.intro-square').first();
  if (await firstSquare.isVisible()) {
    await firstSquare.click();
    await wait(1000);
  }

  // Take intro-opened screenshots for all fonts
  console.log('\nTaking intro-opened screenshots...');
  for (const font of fonts) {
    const safeName = font.name.replace(/\s+/g, '-');

    if (font.type === 'google') {
      updateTypographyForGoogleFont(font);
    } else if (font.type === 'adobe') {
      updateTypographyForAdobeFont(font);
    }

    await wait(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await wait(2000);

    // Navigate back to opened state
    await page.keyboard.press('1');
    await wait(300);
    await page.keyboard.press('2');
    await wait(300);
    await page.keyboard.press('3');
    await wait(300);
    await page.keyboard.press('4');
    await wait(1500);

    const square = page.locator('.intro-square').first();
    if (await square.isVisible()) {
      await square.click();
      await wait(1000);
    }

    console.log(`  - ${font.name} (intro-opened)...`);
    await page.screenshot({
      path: path.join(introOpenedDir, `${safeName}.png`),
      fullPage: false,
    });
  }
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('🚀 Unified Font Testing Script');
  console.log('================================\n');

  // Check for single font argument
  const singleFont = parseSingleFontFromArgs();

  let fontsToTest;
  if (singleFont) {
    console.log('🎯 Single font mode');
    console.log(`   Font: ${singleFont.name}`);
    console.log(`   Type: ${singleFont.type}`);
    console.log(`   URL: ${singleFont.url}\n`);
    fontsToTest = [singleFont];
  } else {
    console.log(`Total fonts to test: ${FONTS_TO_TEST.length}`);
    fontsToTest = FONTS_TO_TEST;
  }

  const googleFonts = fontsToTest.filter(f => f.type === 'google');
  const adobeFonts = fontsToTest.filter(f => f.type === 'adobe');

  console.log(`  Google Fonts: ${googleFonts.length}`);
  console.log(`  Adobe Fonts: ${adobeFonts.length}\n`);

  // Step 1: Save original files
  saveOriginalFiles();

  try {
    // Step 2: Setup Adobe fonts if needed
    if (adobeFonts.length > 0) {
      await setupAdobeFonts(adobeFonts);
      addAdobeFontsToHTML();
    }

    // Step 3: Launch browser
    console.log('🌐 Launching browser...\n');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: VIEWPORT,
      ignoreHTTPSErrors: true,
      bypassCSP: true,
      storageState: undefined,
    });
    const page = await context.newPage();

    await setupAuthStubs(page);

    try {
      // Load page
      console.log('Loading main page...');
      await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
      await wait(3000);

      // Step 4: Take screenshots
      await takeAllScreenshots(page, fontsToTest);

      console.log('\n================================');
      console.log('✅ All done!');
      console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);

    } catch (error) {
      console.error('❌ Error:', error.message);
      throw error;
    } finally {
      await browser.close();
    }

  } finally {
    // Step 5: Always restore original files
    restoreOriginalFiles();
  }
}

main().catch(console.error);
