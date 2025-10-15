import mixpanel from "mixpanel-browser";

const ENABLE_MIXPANEL_IN_DEV = false;

const shouldInitialize = import.meta.env.PROD || ENABLE_MIXPANEL_IN_DEV;

// Stub for dev when disabled
const stub = {
  track: () => {},
  identify: () => {},
  people: { set: () => {} },
};

if (shouldInitialize) {
  mixpanel.init("92b17c4d676f977a493c89b740ddf7ec", {
    autocapture: true,
    record_sessions_percent: 100,
    debug: import.meta.env.DEV,
    track_pageview: true,
    persistence: "localStorage",
  });
}

// Export the right instance
const mixpanelInstance = shouldInitialize ? mixpanel : stub;

// Vue plugin
export default {
  install(app) {
    app.config.globalProperties.$mixpanel = mixpanelInstance;
    app.provide("mixpanel", mixpanelInstance);
  },
};

export { mixpanelInstance as mixpanel };
