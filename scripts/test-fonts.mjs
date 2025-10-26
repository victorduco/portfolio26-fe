import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of fonts to test
// Popular Google Fonts for web/UI design
const FONTS_TO_TEST = [
  { name: 'Inter', value: '"Inter", sans-serif', googleFont: 'Inter:wght@100..900' },
  { name: 'Roboto', value: 'Roboto, sans-serif', googleFont: 'Roboto:wght@100;300;400;500;700;900' },
  { name: 'Open-Sans', value: '"Open Sans", sans-serif', googleFont: 'Open+Sans:wght@300..800' },
  { name: 'Lato', value: 'Lato, sans-serif', googleFont: 'Lato:wght@100;300;400;700;900' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif', googleFont: 'Montserrat:wght@100..900' },
  { name: 'Poppins', value: 'Poppins, sans-serif', googleFont: 'Poppins:wght@100;200;300;400;500;600;700;800;900' },
  { name: 'Raleway', value: 'Raleway, sans-serif', googleFont: 'Raleway:wght@100..900' },
  { name: 'Nunito', value: 'Nunito, sans-serif', googleFont: 'Nunito:wght@200..1000' },
  { name: 'Work-Sans', value: '"Work Sans", sans-serif', googleFont: 'Work+Sans:wght@100..900' },
  { name: 'DM-Sans', value: '"DM Sans", sans-serif', googleFont: 'DM+Sans:wght@100..1000' },
];

const SCREENSHOTS_DIR = path.join(process.cwd(), 'font-test-screenshots');
const TYPOGRAPHY_CSS_PATH = path.join(process.cwd(), 'src/styles/typography.css');

// Desktop viewport
const VIEWPORT = { width: 1920, height: 1080 };

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock auth endpoints
const setupAuthStubs = async (page) => {
  // whoami returns NOT authenticated initially
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
        // Set user as authenticated after successful code
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

// Update typography.css with new font
const updateFontInCSS = (fontValue, googleFont) => {
  const cssContent = fs.readFileSync(TYPOGRAPHY_CSS_PATH, 'utf-8');

  // Replace @import statement
  const googleFontImport = `@import url("https://fonts.googleapis.com/css2?family=${googleFont}&display=swap");`;
  let updatedCSS = cssContent.replace(
    /@import url\("https:\/\/fonts\.googleapis\.com\/css2\?family=[^"]+"\);/,
    googleFontImport
  );

  // Replace font-family variable
  updatedCSS = updatedCSS.replace(
    /--font-family-base:\s*[^;]+;/,
    `--font-family-base: ${fontValue};`
  );

  fs.writeFileSync(TYPOGRAPHY_CSS_PATH, updatedCSS, 'utf-8');
};

// Restore original typography.css
let originalTypographyCSS = '';

const saveOriginalCSS = () => {
  originalTypographyCSS = fs.readFileSync(TYPOGRAPHY_CSS_PATH, 'utf-8');
};

const restoreOriginalCSS = () => {
  if (originalTypographyCSS) {
    fs.writeFileSync(TYPOGRAPHY_CSS_PATH, originalTypographyCSS, 'utf-8');
  }
};

async function testFont(fontConfig) {
  const browser = await chromium.launch({ headless: true });
  // Create incognito context (fresh session, no storage)
  const context = await browser.newContext({
    viewport: VIEWPORT,
    // Incognito mode settings
    ignoreHTTPSErrors: true,
    bypassCSP: true,
    // No storage state - fresh session
    storageState: undefined,
  });
  const page = await context.newPage();

  // Setup auth stubs BEFORE navigating
  await setupAuthStubs(page);

  console.log(`Testing font: ${fontConfig.name}`);

  try {
    // Screenshot 1: Keypad
    console.log(`  - Loading main page...`);
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await wait(3000); // Wait for keypad animation

    console.log(`  - Taking keypad screenshot...`);
    const keypadDir = path.join(SCREENSHOTS_DIR, '01-keypad');
    if (!fs.existsSync(keypadDir)) {
      fs.mkdirSync(keypadDir, { recursive: true });
    }
    await page.screenshot({
      path: path.join(keypadDir, `${fontConfig.name}.png`),
      fullPage: false,
    });

    // Enter code 1234 to get to intro
    console.log(`  - Entering code 1234...`);
    await page.keyboard.press('1');
    await wait(300);
    await page.keyboard.press('2');
    await wait(300);
    await page.keyboard.press('3');
    await wait(300);
    await page.keyboard.press('4');
    await wait(500);

    // Wait for intro section to become visible
    console.log(`  - Waiting for intro section...`);
    await page.waitForFunction(
      () => {
        const introSection = document.getElementById('intro');
        return introSection && introSection.classList.contains('intro-visible');
      },
      { timeout: 15000 }
    );

    // Wait for intro squares to be visible and animated
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

    await wait(1500); // Additional wait for animation to fully settle

    // Screenshot 2: Intro section (all closed)
    console.log(`  - Taking intro screenshot...`);
    const introDir = path.join(SCREENSHOTS_DIR, '02-intro');
    if (!fs.existsSync(introDir)) {
      fs.mkdirSync(introDir, { recursive: true });
    }
    await page.screenshot({
      path: path.join(introDir, `${fontConfig.name}.png`),
      fullPage: false,
    });

    // Screenshot 3: Intro with first rectangle opened
    console.log(`  - Clicking first rectangle...`);
    const firstSquare = page.locator('.intro-square').first();
    if (await firstSquare.isVisible()) {
      await firstSquare.click();
      await wait(1000); // Wait for opening animation

      console.log(`  - Taking intro with opened rectangle screenshot...`);
      const introOpenedDir = path.join(SCREENSHOTS_DIR, '03-intro-opened');
      if (!fs.existsSync(introOpenedDir)) {
        fs.mkdirSync(introOpenedDir, { recursive: true });
      }
      await page.screenshot({
        path: path.join(introOpenedDir, `${fontConfig.name}.png`),
        fullPage: false,
      });
    }

    console.log(`  ✓ Done testing ${fontConfig.name}`);
  } catch (error) {
    console.error(`  ✗ Error testing ${fontConfig.name}:`, error.message);
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('Font Screenshot Test Script');
  console.log('============================\n');

  // Create screenshots directory
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  // Save original CSS
  saveOriginalCSS();

  try {
    // Test each font
    for (const fontConfig of FONTS_TO_TEST) {
      // Update CSS file with new font (including @import)
      updateFontInCSS(fontConfig.value, fontConfig.googleFont);

      // Wait a bit for file system and font loading
      await wait(1000);

      // Test this font
      await testFont(fontConfig);

      // Small delay between fonts
      await wait(1000);
    }

    console.log('\n============================');
    console.log('All font tests complete!');
    console.log(`Screenshots saved to: ${SCREENSHOTS_DIR}`);
  } finally {
    // Restore original CSS
    console.log('\nRestoring original typography.css...');
    restoreOriginalCSS();
    console.log('✓ Original CSS restored');
  }
}

main().catch(console.error);
