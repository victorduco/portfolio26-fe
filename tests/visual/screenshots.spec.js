import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

const SCREENSHOTS_DIR = path.join(process.cwd(), "test-screenshots");

// Mock backend auth endpoints to make tests deterministic
const setupAuthStubs = async (page) => {
  // whoami always authenticated
  await page.route("**/api/whoami", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  // check-code: success only for 1234
  await page.route("**/api/check-code", async (route, request) => {
    try {
      const postData = request.postDataJSON?.();
      const isOk = postData && postData.code === "1234";
      if (isOk) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ok: true }),
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ ok: false, error: "Invalid code" }),
        });
      }
    } catch {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, error: "stub error" }),
      });
    }
  });
};

test.beforeAll(async () => {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
});

test.beforeEach(async ({ page }) => {
  await setupAuthStubs(page);
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const authenticate = async (page) => {
  await page.goto("/gate");
  await wait(2000);
  await page.keyboard.press("1");
  await wait(300);
  await page.keyboard.press("2");
  await wait(300);
  await page.keyboard.press("3");
  await wait(300);
  await page.keyboard.press("4");
  // Wait for navigation to main page after successful auth
  await page.waitForURL((url) => url.pathname === "/", {
    timeout: 10000,
  });
  await wait(1000);
};

const scrollToSection = async (page, sectionId) => {
  await page.evaluate((id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  }, sectionId);
  await wait(1500);
};

test.describe("Visual Screenshots", () => {
  test.describe("Gate Page", () => {
    test("Initial state", async ({ page, browserName }) => {
      await page.goto("/gate");
      await wait(2000);
      await page.screenshot({
        path: path.join(
          SCREENSHOTS_DIR,
          "gate",
          `initial-${browserName}-${page.viewportSize().width}x${
            page.viewportSize().height
          }.png`
        ),
        fullPage: false,
      });
    });

    test("With 4 digits entered", async ({ page, browserName }) => {
      await page.goto("/gate");
      await wait(2000);
      await page.keyboard.press("1");
      await wait(300);
      await page.keyboard.press("2");
      await wait(300);
      await page.keyboard.press("3");
      await wait(300);
      await page.keyboard.press("4");
      await wait(500);
      await page.screenshot({
        path: path.join(
          SCREENSHOTS_DIR,
          "gate",
          `4digits-${browserName}-${page.viewportSize().width}x${
            page.viewportSize().height
          }.png`
        ),
        fullPage: false,
      });
    });

    test("Fail state", async ({ page, browserName }) => {
      await page.goto("/gate");
      await wait(2000);
      await page.keyboard.press("9");
      await wait(300);
      await page.keyboard.press("9");
      await wait(300);
      await page.keyboard.press("9");
      await wait(300);
      await page.keyboard.press("9");
      await wait(2000);
      await page.screenshot({
        path: path.join(
          SCREENSHOTS_DIR,
          "gate",
          `fail-${browserName}-${page.viewportSize().width}x${
            page.viewportSize().height
          }.png`
        ),
        fullPage: false,
      });
    });
  });

  test.describe("Main Page - Intro", () => {
    test("Intro initial state", async ({ page, browserName }) => {
      await authenticate(page);
      await page.goto("/");

      // Wait for navigation animation to complete and intro to become visible
      await page.waitForFunction(
        () => {
          const introSection = document.getElementById("intro");
          return (
            introSection && introSection.classList.contains("intro-visible")
          );
        },
        { timeout: 15000 }
      );

      // Wait for intro squares to be visible and animated
      await page.waitForFunction(
        () => {
          const squares = document.querySelectorAll(".intro-square");
          return (
            squares.length === 4 &&
            Array.from(squares).every((square) => {
              const computedStyle = window.getComputedStyle(square);
              return (
                computedStyle.opacity === "1" &&
                computedStyle.visibility !== "hidden"
              );
            })
          );
        },
        { timeout: 15000 }
      );

      // Additional wait for animation to settle
      await wait(1000);

      await page.screenshot({
        path: path.join(
          SCREENSHOTS_DIR,
          "main-intro",
          `initial-${browserName}-${page.viewportSize().width}x${
            page.viewportSize().height
          }.png`
        ),
        fullPage: false,
      });
    });

    test("Intro with 1 block opened (first)", async ({ page, browserName }) => {
      await authenticate(page);
      await page.goto("/");

      // Wait for navigation animation to complete and intro to become visible
      await page.waitForFunction(
        () => {
          const introSection = document.getElementById("intro");
          return (
            introSection && introSection.classList.contains("intro-visible")
          );
        },
        { timeout: 15000 }
      );

      // Wait for intro squares to be visible and animated
      await page.waitForFunction(
        () => {
          const squares = document.querySelectorAll(".intro-square");
          return (
            squares.length === 4 &&
            Array.from(squares).every((square) => {
              const computedStyle = window.getComputedStyle(square);
              return (
                computedStyle.opacity === "1" &&
                computedStyle.visibility !== "hidden"
              );
            })
          );
        },
        { timeout: 15000 }
      );

      // Additional wait for animation to settle
      await wait(1000);

      const firstBlock = page.locator(".intro-square").first();
      if (await firstBlock.isVisible()) {
        await firstBlock.click();
        await wait(1000);
      }
      await page.screenshot({
        path: path.join(
          SCREENSHOTS_DIR,
          "main-intro",
          `1block-first-${browserName}-${page.viewportSize().width}x${
            page.viewportSize().height
          }.png`
        ),
        fullPage: false,
      });
    });

    test("Intro with 2 blocks opened (first two)", async ({
      page,
      browserName,
    }) => {
      await authenticate(page);
      await page.goto("/");

      // Wait for navigation animation to complete and intro to become visible
      await page.waitForFunction(
        () => {
          const introSection = document.getElementById("intro");
          return (
            introSection && introSection.classList.contains("intro-visible")
          );
        },
        { timeout: 15000 }
      );

      // Wait for intro squares to be visible and animated
      await page.waitForFunction(
        () => {
          const squares = document.querySelectorAll(".intro-square");
          return (
            squares.length === 4 &&
            Array.from(squares).every((square) => {
              const computedStyle = window.getComputedStyle(square);
              return (
                computedStyle.opacity === "1" &&
                computedStyle.visibility !== "hidden"
              );
            })
          );
        },
        { timeout: 15000 }
      );

      // Additional wait for animation to settle
      await wait(1000);
      const blocks = page.locator(".intro-square");
      if (await blocks.nth(0).isVisible()) {
        await blocks.nth(0).click();
        await wait(500);
        await blocks.nth(1).click();
        await wait(1000);
      }
      await page.screenshot({
        path: path.join(
          SCREENSHOTS_DIR,
          "main-intro",
          `2blocks-first-two-${browserName}-${page.viewportSize().width}x${
            page.viewportSize().height
          }.png`
        ),
        fullPage: false,
      });
    });

    test("Intro with 2 blocks opened (diagonal)", async ({
      page,
      browserName,
    }) => {
      await authenticate(page);
      await page.goto("/");

      // Wait for navigation animation to complete and intro to become visible
      await page.waitForFunction(
        () => {
          const introSection = document.getElementById("intro");
          return (
            introSection && introSection.classList.contains("intro-visible")
          );
        },
        { timeout: 15000 }
      );

      // Wait for intro squares to be visible and animated
      await page.waitForFunction(
        () => {
          const squares = document.querySelectorAll(".intro-square");
          return (
            squares.length === 4 &&
            Array.from(squares).every((square) => {
              const computedStyle = window.getComputedStyle(square);
              return (
                computedStyle.opacity === "1" &&
                computedStyle.visibility !== "hidden"
              );
            })
          );
        },
        { timeout: 15000 }
      );

      // Additional wait for animation to settle
      await wait(1000);
      const blocks = page.locator(".intro-square");
      if (await blocks.nth(0).isVisible()) {
        await blocks.nth(0).click();
        await wait(500);
        await blocks.nth(2).click();
        await wait(1000);
      }
      await page.screenshot({
        path: path.join(
          SCREENSHOTS_DIR,
          "main-intro",
          `2blocks-diagonal-${browserName}-${page.viewportSize().width}x${
            page.viewportSize().height
          }.png`
        ),
        fullPage: false,
      });
    });

    test("Intro with 3 blocks opened (first three)", async ({
      page,
      browserName,
    }) => {
      await authenticate(page);
      await page.goto("/");

      // Wait for navigation animation to complete and intro to become visible
      await page.waitForFunction(
        () => {
          const introSection = document.getElementById("intro");
          return (
            introSection && introSection.classList.contains("intro-visible")
          );
        },
        { timeout: 15000 }
      );

      // Wait for intro squares to be visible and animated
      await page.waitForFunction(
        () => {
          const squares = document.querySelectorAll(".intro-square");
          return (
            squares.length === 4 &&
            Array.from(squares).every((square) => {
              const computedStyle = window.getComputedStyle(square);
              return (
                computedStyle.opacity === "1" &&
                computedStyle.visibility !== "hidden"
              );
            })
          );
        },
        { timeout: 15000 }
      );

      // Additional wait for animation to settle
      await wait(1000);
      const blocks = page.locator(".intro-square");
      if (await blocks.nth(0).isVisible()) {
        await blocks.nth(0).click();
        await wait(500);
        await blocks.nth(1).click();
        await wait(500);
        await blocks.nth(2).click();
        await wait(1000);
      }
      await page.screenshot({
        path: path.join(
          SCREENSHOTS_DIR,
          "main-intro",
          `3blocks-first-three-${browserName}-${page.viewportSize().width}x${
            page.viewportSize().height
          }.png`
        ),
        fullPage: false,
      });
    });

    test("Intro with 3 blocks opened (corners)", async ({
      page,
      browserName,
    }) => {
      await authenticate(page);
      await page.goto("/");

      // Wait for navigation animation to complete and intro to become visible
      await page.waitForFunction(
        () => {
          const introSection = document.getElementById("intro");
          return (
            introSection && introSection.classList.contains("intro-visible")
          );
        },
        { timeout: 15000 }
      );

      // Wait for intro squares to be visible and animated
      await page.waitForFunction(
        () => {
          const squares = document.querySelectorAll(".intro-square");
          return (
            squares.length === 4 &&
            Array.from(squares).every((square) => {
              const computedStyle = window.getComputedStyle(square);
              return (
                computedStyle.opacity === "1" &&
                computedStyle.visibility !== "hidden"
              );
            })
          );
        },
        { timeout: 15000 }
      );

      // Additional wait for animation to settle
      await wait(1000);
      const blocks = page.locator(".intro-square");
      if (await blocks.nth(0).isVisible()) {
        await blocks.nth(0).click();
        await wait(500);
        await blocks.nth(1).click();
        await wait(500);
        await blocks.nth(3).click();
        await wait(1000);
      }
      await page.screenshot({
        path: path.join(
          SCREENSHOTS_DIR,
          "main-intro",
          `3blocks-corners-${browserName}-${page.viewportSize().width}x${
            page.viewportSize().height
          }.png`
        ),
        fullPage: false,
      });
    });

    test("Intro with 4 blocks opened (all)", async ({ page, browserName }) => {
      await authenticate(page);
      await page.goto("/");

      // Wait for navigation animation to complete and intro to become visible
      await page.waitForFunction(
        () => {
          const introSection = document.getElementById("intro");
          return (
            introSection && introSection.classList.contains("intro-visible")
          );
        },
        { timeout: 15000 }
      );

      // Wait for intro squares to be visible and animated
      await page.waitForFunction(
        () => {
          const squares = document.querySelectorAll(".intro-square");
          return (
            squares.length === 4 &&
            Array.from(squares).every((square) => {
              const computedStyle = window.getComputedStyle(square);
              return (
                computedStyle.opacity === "1" &&
                computedStyle.visibility !== "hidden"
              );
            })
          );
        },
        { timeout: 15000 }
      );

      // Additional wait for animation to settle
      await wait(1000);
      const blocks = page.locator(".intro-square");
      if (await blocks.nth(0).isVisible()) {
        await blocks.nth(0).click();
        await wait(500);
        await blocks.nth(1).click();
        await wait(500);
        await blocks.nth(2).click();
        await wait(500);
        await blocks.nth(3).click();
        await wait(1000);
      }
      await page.screenshot({
        path: path.join(
          SCREENSHOTS_DIR,
          "main-intro",
          `4blocks-all-${browserName}-${page.viewportSize().width}x${
            page.viewportSize().height
          }.png`
        ),
        fullPage: false,
      });
    });
  });

  test.describe("Main Page - Cases", () => {
    test("Case 1 section", async ({ page, browserName }) => {
      await authenticate(page);
      await page.goto("/");
      await wait(3000);
      await scrollToSection(page, "case1");
      await page.screenshot({
        path: path.join(
          SCREENSHOTS_DIR,
          "main-case1",
          `case1-${browserName}-${page.viewportSize().width}x${
            page.viewportSize().height
          }.png`
        ),
        fullPage: false,
      });
    });

    test("Case 2 section", async ({ page, browserName }) => {
      await authenticate(page);
      await page.goto("/");
      await wait(3000);
      await scrollToSection(page, "case2");
      await page.screenshot({
        path: path.join(
          SCREENSHOTS_DIR,
          "main-case2",
          `case2-${browserName}-${page.viewportSize().width}x${
            page.viewportSize().height
          }.png`
        ),
        fullPage: false,
      });
    });

    test("Case 3 section", async ({ page, browserName }) => {
      await authenticate(page);
      await page.goto("/");
      await wait(3000);
      await scrollToSection(page, "case3");
      await page.screenshot({
        path: path.join(
          SCREENSHOTS_DIR,
          "main-case3",
          `case3-${browserName}-${page.viewportSize().width}x${
            page.viewportSize().height
          }.png`
        ),
        fullPage: false,
      });
    });
  });

  test.describe("Story Pages", () => {
    test("Story One", async ({ page, browserName }) => {
      await authenticate(page);
      await page.goto("/story/one");
      await wait(2000);
      await page.screenshot({
        path: path.join(
          SCREENSHOTS_DIR,
          "story-one",
          `initial-${browserName}-${page.viewportSize().width}x${
            page.viewportSize().height
          }.png`
        ),
        fullPage: false,
      });
    });

    test("Story Two", async ({ page, browserName }) => {
      await authenticate(page);
      await page.goto("/story/two");
      await wait(2000);
      await page.screenshot({
        path: path.join(
          SCREENSHOTS_DIR,
          "story-two",
          `initial-${browserName}-${page.viewportSize().width}x${
            page.viewportSize().height
          }.png`
        ),
        fullPage: false,
      });
    });

    test("Story Three", async ({ page, browserName }) => {
      await authenticate(page);
      await page.goto("/story/three");
      await wait(2000);
      await page.screenshot({
        path: path.join(
          SCREENSHOTS_DIR,
          "story-three",
          `initial-${browserName}-${page.viewportSize().width}x${
            page.viewportSize().height
          }.png`
        ),
        fullPage: false,
      });
    });
  });
});
