import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const SCREENSHOTS_DIR = path.join(process.cwd(), "test-screenshots");

// Ensure screenshots directory exists
test.beforeAll(async () => {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
});

// Helper to wait for animations
const waitForAnimations = async (page, timeout = 1000) => {
  await page.waitForTimeout(timeout);
};

// Helper to authenticate
const authenticate = async (page) => {
  await page.goto("/gate");
  await waitForAnimations(page, 2000);

  // Enter correct code: 1234
  await page.keyboard.press("1");
  await waitForAnimations(page, 300);
  await page.keyboard.press("2");
  await waitForAnimations(page, 300);
  await page.keyboard.press("3");
  await waitForAnimations(page, 300);
  await page.keyboard.press("4");

  // Wait for authentication and redirect
  await waitForAnimations(page, 3000);
};

// Helper to scroll to section by ID
const scrollToSection = async (page, sectionId) => {
  await page.evaluate((id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, sectionId);
  await waitForAnimations(page, 1500);
};

test.describe("Visual Screenshots - All Pages", () => {
  test.describe("Gate Page", () => {
    test("Initial state", async ({ page, browserName }) => {
      await page.goto("/gate");
      await waitForAnimations(page, 2000);

      const dir = path.join(SCREENSHOTS_DIR, "gate");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `initial-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });

    test("With 1 digit entered", async ({ page, browserName }) => {
      await page.goto("/gate");
      await waitForAnimations(page, 2000);

      await page.keyboard.press("1");
      await waitForAnimations(page, 500);

      const dir = path.join(SCREENSHOTS_DIR, "gate");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `1digit-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });

    test("With 2 digits entered", async ({ page, browserName }) => {
      await page.goto("/gate");
      await waitForAnimations(page, 2000);

      await page.keyboard.press("1");
      await waitForAnimations(page, 300);
      await page.keyboard.press("2");
      await waitForAnimations(page, 500);

      const dir = path.join(SCREENSHOTS_DIR, "gate");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `2digits-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });

    test("With 3 digits entered", async ({ page, browserName }) => {
      await page.goto("/gate");
      await waitForAnimations(page, 2000);

      await page.keyboard.press("1");
      await waitForAnimations(page, 300);
      await page.keyboard.press("2");
      await waitForAnimations(page, 300);
      await page.keyboard.press("3");
      await waitForAnimations(page, 500);

      const dir = path.join(SCREENSHOTS_DIR, "gate");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `3digits-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });

    test("With 4 digits entered", async ({ page, browserName }) => {
      await page.goto("/gate");
      await waitForAnimations(page, 2000);

      await page.keyboard.press("1");
      await waitForAnimations(page, 300);
      await page.keyboard.press("2");
      await waitForAnimations(page, 300);
      await page.keyboard.press("3");
      await waitForAnimations(page, 300);
      await page.keyboard.press("4");
      await waitForAnimations(page, 500);

      const dir = path.join(SCREENSHOTS_DIR, "gate");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `4digits-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });

    test("Fail state", async ({ page, browserName }) => {
      await page.goto("/gate");
      await waitForAnimations(page, 2000);

      // Enter wrong code
      await page.keyboard.press("1");
      await waitForAnimations(page, 300);
      await page.keyboard.press("2");
      await waitForAnimations(page, 300);
      await page.keyboard.press("3");
      await waitForAnimations(page, 300);
      await page.keyboard.press("4");

      // Wait for fail animation
      await waitForAnimations(page, 2000);

      const dir = path.join(SCREENSHOTS_DIR, "gate");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `fail-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });

    test("Hover state", async ({ page, browserName }) => {
      await page.goto("/gate");
      await waitForAnimations(page, 2000);

      const button = page.locator(".keypad-button").first();
      if (await button.isVisible()) {
        await button.hover();
        await waitForAnimations(page, 500);

        const dir = path.join(SCREENSHOTS_DIR, "gate");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const screenshotPath = path.join(
          dir,
          `hover-${browserName}-${page.viewportSize().width}x${
            page.viewportSize().height
          }.png`
        );
        await page.screenshot({ path: screenshotPath, fullPage: false });
      }
    });
  });

  test.describe("Main Page - Intro", () => {
    test("Intro initial state", async ({ page, browserName }) => {
      await authenticate(page);

      await page.goto("/");
      // Wait 5 seconds for intro animation to complete
      await waitForAnimations(page, 5000);

      const dir = path.join(SCREENSHOTS_DIR, "main-intro");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `initial-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });

    test("Intro with 1 block opened", async ({ page, browserName }) => {
      await authenticate(page);

      await page.goto("/");
      await waitForAnimations(page, 5000);

      // Click on first block to open it
      const firstBlock = page.locator(".intro-square").first();
      if (await firstBlock.isVisible()) {
        await firstBlock.click();
        await waitForAnimations(page, 1000);
      }

      const dir = path.join(SCREENSHOTS_DIR, "main-intro");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `1block-open-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });

    test("Intro with 2 blocks opened", async ({ page, browserName }) => {
      await authenticate(page);

      await page.goto("/");
      await waitForAnimations(page, 5000);

      // Click on first and second blocks to open them
      const blocks = page.locator(".intro-square");
      if (await blocks.nth(0).isVisible()) {
        await blocks.nth(0).click();
        await waitForAnimations(page, 500);
        await blocks.nth(1).click();
        await waitForAnimations(page, 1000);
      }

      const dir = path.join(SCREENSHOTS_DIR, "main-intro");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `2blocks-open-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });

    test("Intro with 3 blocks opened", async ({ page, browserName }) => {
      await authenticate(page);

      await page.goto("/");
      await waitForAnimations(page, 5000);

      // Click on first three blocks to open them
      const blocks = page.locator(".intro-square");
      if (await blocks.nth(0).isVisible()) {
        await blocks.nth(0).click();
        await waitForAnimations(page, 500);
        await blocks.nth(1).click();
        await waitForAnimations(page, 500);
        await blocks.nth(2).click();
        await waitForAnimations(page, 1000);
      }

      const dir = path.join(SCREENSHOTS_DIR, "main-intro");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `3blocks-open-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });

    test("Intro with 4 blocks opened", async ({ page, browserName }) => {
      await authenticate(page);

      await page.goto("/");
      await waitForAnimations(page, 5000);

      // Click on all four blocks to open them
      const blocks = page.locator(".intro-square");
      if (await blocks.nth(0).isVisible()) {
        await blocks.nth(0).click();
        await waitForAnimations(page, 500);
        await blocks.nth(1).click();
        await waitForAnimations(page, 500);
        await blocks.nth(2).click();
        await waitForAnimations(page, 500);
        await blocks.nth(3).click();
        await waitForAnimations(page, 1000);
      }

      const dir = path.join(SCREENSHOTS_DIR, "main-intro");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `4blocks-open-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });
  });

  test.describe("Main Page - Case 1", () => {
    test("Case 1 section", async ({ page, browserName }) => {
      await authenticate(page);

      await page.goto("/");
      await waitForAnimations(page, 3000);

      await scrollToSection(page, "case1");

      const dir = path.join(SCREENSHOTS_DIR, "main-case1");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `case1-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });
  });

  test.describe("Main Page - Case 2", () => {
    test("Case 2 section", async ({ page, browserName }) => {
      await authenticate(page);

      await page.goto("/");
      await waitForAnimations(page, 3000);

      await scrollToSection(page, "case2");

      const dir = path.join(SCREENSHOTS_DIR, "main-case2");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `case2-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });
  });

  test.describe("Main Page - Case 3", () => {
    test("Case 3 section", async ({ page, browserName }) => {
      await authenticate(page);

      await page.goto("/");
      await waitForAnimations(page, 3000);

      await scrollToSection(page, "case3");

      const dir = path.join(SCREENSHOTS_DIR, "main-case3");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `case3-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });
  });

  test.describe("Main Page - AI Play", () => {
    test("AI Play section", async ({ page, browserName }) => {
      await authenticate(page);

      await page.goto("/");
      await waitForAnimations(page, 3000);

      await scrollToSection(page, "ai-play");

      const dir = path.join(SCREENSHOTS_DIR, "main-ai-play");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `ai-play-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });
  });

  test.describe("Main Page - Contacts", () => {
    test("Contacts section", async ({ page, browserName }) => {
      await authenticate(page);

      await page.goto("/");
      await waitForAnimations(page, 3000);

      await scrollToSection(page, "contacts");

      const dir = path.join(SCREENSHOTS_DIR, "main-contacts");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `contacts-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });
  });

  test.describe("Story One", () => {
    test("Initial view", async ({ page, browserName }) => {
      await authenticate(page);

      await page.goto("/story/one");
      await waitForAnimations(page, 2000);

      const dir = path.join(SCREENSHOTS_DIR, "story-one");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `initial-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });

    test("Scrolled view", async ({ page, browserName }) => {
      await authenticate(page);

      await page.goto("/story/one");
      await waitForAnimations(page, 2000);

      await page.evaluate(() => {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      });
      await waitForAnimations(page, 1000);

      const dir = path.join(SCREENSHOTS_DIR, "story-one");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `scrolled-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });
  });

  test.describe("Story Two", () => {
    test("Initial view", async ({ page, browserName }) => {
      await authenticate(page);

      await page.goto("/story/two");
      await waitForAnimations(page, 2000);

      const dir = path.join(SCREENSHOTS_DIR, "story-two");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `initial-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });

    test("Scrolled view", async ({ page, browserName }) => {
      await authenticate(page);

      await page.goto("/story/two");
      await waitForAnimations(page, 2000);

      await page.evaluate(() => {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      });
      await waitForAnimations(page, 1000);

      const dir = path.join(SCREENSHOTS_DIR, "story-two");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `scrolled-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });
  });

  test.describe("Story Three", () => {
    test("Initial view", async ({ page, browserName }) => {
      await authenticate(page);

      await page.goto("/story/three");
      await waitForAnimations(page, 2000);

      const dir = path.join(SCREENSHOTS_DIR, "story-three");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `initial-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });

    test("Scrolled view", async ({ page, browserName }) => {
      await authenticate(page);

      await page.goto("/story/three");
      await waitForAnimations(page, 2000);

      await page.evaluate(() => {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      });
      await waitForAnimations(page, 1000);

      const dir = path.join(SCREENSHOTS_DIR, "story-three");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const screenshotPath = path.join(
        dir,
        `scrolled-${browserName}-${page.viewportSize().width}x${
          page.viewportSize().height
        }.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
    });
  });

  test.describe("Mobile Menu", () => {
    test("Mobile navigation menu (mobile only)", async ({
      page,
      browserName,
    }) => {
      await authenticate(page);

      await page.goto("/");
      await waitForAnimations(page, 2000);

      // Check if mobile
      if (page.viewportSize().width < 768) {
        // Try to find and click mobile menu button
        const menuButton = page
          .locator('[aria-label*="menu"], .mobile-menu-button, .hamburger')
          .first();
        if (await menuButton.isVisible()) {
          await menuButton.click();
          await waitForAnimations(page, 500);

          const dir = path.join(SCREENSHOTS_DIR, "mobile-menu");
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

          const screenshotPath = path.join(
            dir,
            `menu-open-${browserName}-${page.viewportSize().width}x${
              page.viewportSize().height
            }.png`
          );
          await page.screenshot({ path: screenshotPath, fullPage: false });
        }
      }
    });
  });
});
