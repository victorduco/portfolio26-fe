import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Adobe Fonts (first 2350 added to project)
const adobeFontsData = JSON.parse(fs.readFileSync('adobe-fonts-list.json', 'utf-8'));
const FONTS_TO_TEST = adobeFontsData.fonts.slice(0, 2350).map(font => {
  // Adobe Fonts use slug format: lowercase with dashes
  const slug = font.name.toLowerCase().replace(/\s+/g, '-');
  return {
    name: font.name.replace(/\s+/g, '-'),
    value: `"${slug}", sans-serif`,
    adobeFontId: font.id,
  };
});

const SCREENSHOTS_DIR = path.join(process.cwd(), 'adobe-fonts-screenshots');
const ADOBE_PROJECT_ID = 'nme2qkx';
const VIEWPORT = { width: 1920, height: 1080 };

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock auth endpoints
const setupAuthStubs = async (page) => {
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
};

// Change font dynamically and wait for it to load
async function changeFontInPage(page, fontConfig) {
  await page.evaluate(async ({ fontValue }) => {
    // Update CSS variable
    document.documentElement.style.setProperty('--font-family-base', fontValue);

    // Extract font family name (remove quotes and fallbacks)
    const fontFamily = fontValue.split(',')[0].replace(/['"]/g, '').trim();

    // Wait for font to load using Font Loading API
    try {
      await document.fonts.load(`16px "${fontFamily}"`);
      await document.fonts.load(`400 16px "${fontFamily}"`);
      await document.fonts.load(`600 16px "${fontFamily}"`);
    } catch (e) {
      // Font might not exist or already loaded
      console.log(`Font load attempted: ${fontFamily}`);
    }
  }, { fontValue: fontConfig.value });

  // Additional wait for rendering
  await wait(2000);
}

async function main() {
  console.log('Adobe Fonts Screenshot Test Script');
  console.log('====================================\n');
  console.log(`Testing ${FONTS_TO_TEST.length} Adobe Fonts...\n`);

  // Create screenshots directory
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    ignoreHTTPSErrors: true,
    bypassCSP: true,
    storageState: undefined,
  });
  const page = await context.newPage();

  // Setup auth stubs
  await setupAuthStubs(page);

  try {
    // Load page first
    console.log('Loading main page...');
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await wait(3000);

    // Inject Adobe Fonts CSS link in head
    console.log('Loading Adobe Fonts project...');
    await page.evaluate((projectId) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://use.typekit.net/${projectId}.css`;
      document.head.appendChild(link);
    }, ADOBE_PROJECT_ID);

    // Wait for Adobe Fonts CSS to load and fonts to become available
    await page.waitForFunction(() => {
      return document.fonts.size > 0;
    }, { timeout: 10000 });

    await wait(3000);
    console.log('Adobe Fonts CSS loaded!');

    console.log('Taking keypad screenshots for all fonts...\n');

    // Screenshot 1: Keypad with all fonts
    const keypadDir = path.join(SCREENSHOTS_DIR, '01-keypad');
    if (!fs.existsSync(keypadDir)) {
      fs.mkdirSync(keypadDir, { recursive: true });
    }

    for (const fontConfig of FONTS_TO_TEST) {
      console.log(`  - ${fontConfig.name} (keypad)...`);
      await changeFontInPage(page, fontConfig);
      await page.screenshot({
        path: path.join(keypadDir, `${fontConfig.name}.png`),
        fullPage: false,
      });
    }

    // Enter code 1234
    console.log('\nEntering code 1234...');
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

    console.log('Taking intro screenshots for all fonts...\n');

    // Screenshot 2: Intro with all fonts
    const introDir = path.join(SCREENSHOTS_DIR, '02-intro');
    if (!fs.existsSync(introDir)) {
      fs.mkdirSync(introDir, { recursive: true });
    }

    for (const fontConfig of FONTS_TO_TEST) {
      console.log(`  - ${fontConfig.name} (intro)...`);
      await changeFontInPage(page, fontConfig);
      await page.screenshot({
        path: path.join(introDir, `${fontConfig.name}.png`),
        fullPage: false,
      });
    }

    // Click first rectangle
    console.log('\nClicking first rectangle...');
    const firstSquare = page.locator('.intro-square').first();
    if (await firstSquare.isVisible()) {
      await firstSquare.click();
      await wait(1000);
    }

    console.log('Taking intro-opened screenshots for all fonts...\n');

    // Screenshot 3: Intro opened with all fonts
    const introOpenedDir = path.join(SCREENSHOTS_DIR, '03-intro-opened');
    if (!fs.existsSync(introOpenedDir)) {
      fs.mkdirSync(introOpenedDir, { recursive: true });
    }

    for (const fontConfig of FONTS_TO_TEST) {
      console.log(`  - ${fontConfig.name} (intro-opened)...`);
      await changeFontInPage(page, fontConfig);
      await page.screenshot({
        path: path.join(introOpenedDir, `${fontConfig.name}.png`),
        fullPage: false,
      });
    }

    console.log('\n====================================');
    console.log('✓ All Adobe Fonts tests complete!');
    console.log(`  Screenshots saved to: ${SCREENSHOTS_DIR}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
