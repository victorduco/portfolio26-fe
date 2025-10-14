import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "html",

  use: {
    baseURL: "http://localhost:5173",
    screenshot: "only-on-failure",
    video: "off",
  },

  projects: [
    {
      name: "mobile-small",
      use: {
        ...devices["iPhone SE"],
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 12"],
        viewport: { width: 375, height: 812 },
      },
    },
    {
      name: "mobile-large",
      use: {
        ...devices["iPhone 12 Pro Max"],
        viewport: { width: 428, height: 926 },
      },
    },
    {
      name: "tablet",
      use: {
        viewport: { width: 768, height: 1024 },
        deviceScaleFactor: 2,
      },
    },
    {
      name: "tablet-large",
      use: {
        viewport: { width: 1024, height: 1366 },
        deviceScaleFactor: 2,
      },
    },
    {
      name: "desktop",
      use: {
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: "desktop-large",
      use: {
        viewport: { width: 2560, height: 1440 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: "desktop-ultrawide",
      use: {
        viewport: { width: 3440, height: 1440 },
        deviceScaleFactor: 1,
      },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
