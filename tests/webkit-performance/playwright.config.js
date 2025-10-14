import { defineConfig, devices } from "@playwright/test";

const BASE_URL =
  (process.env.PLAYWRIGHT_BASE_URL &&
    process.env.PLAYWRIGHT_BASE_URL.replace(/\/$/, "")) ||
  "http://localhost:5173";

export default defineConfig({
  testDir: "./",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 120000,
  reporter: "list",
  outputDir: "../../test-results/webkit-performance-output",
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "webkit-desktop",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1920, height: 980 },
        headless: false,
        launchOptions: {
          slowMo: 70,
          args: ["--window-position=0,25"],
        },
      },
    },
  ],
});
