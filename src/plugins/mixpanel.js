import mixpanel from "mixpanel-browser";

// Initialize Mixpanel
mixpanel.init("92b17c4d676f977a493c89b740ddf7ec", {
  autocapture: true,
  record_sessions_percent: 100,
  debug: import.meta.env.DEV, // Enable debug mode in development
  track_pageview: true,
  persistence: "localStorage",
});

// Vue plugin
export default {
  install(app) {
    // Make mixpanel available globally in the app
    app.config.globalProperties.$mixpanel = mixpanel;

    // Provide mixpanel for composition API
    app.provide("mixpanel", mixpanel);
  },
};

// Export mixpanel instance for direct use
export { mixpanel };
