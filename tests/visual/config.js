// Visual test configuration

export const config = {
  // Screenshot settings
  screenshots: {
    outputDir: "test-screenshots",
    fullPage: false,
    format: "png",
  },

  // Animation wait times (ms)
  waitTimes: {
    pageLoad: 2000,
    afterKeypress: 300,
    afterAnimation: 500,
    afterScroll: 1000,
  },

  // Pages to test
  pages: {
    gate: {
      enabled: true,
      states: ["initial", "1digit", "2digits", "3digits", "4digits", "fail"],
    },
    main: {
      enabled: true,
      sections: ["intro", "cases", "contacts"],
    },
    stories: {
      enabled: true,
      ids: ["one", "two", "three"],
    },
    interactions: {
      enabled: true,
      tests: ["hover", "mobileMenu"],
    },
  },

  // Device sizes (defined in playwright.config.js)
  devices: {
    mobile: { width: 375, height: 812 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
  },

  // Authentication
  auth: {
    // Correct code for gate authentication
    correctCode: "1234",
  },
};

export default config;
