import mixpanel from "mixpanel-browser";

const ENABLE_MIXPANEL_IN_DEV = false;

const shouldInitialize = import.meta.env.PROD || ENABLE_MIXPANEL_IN_DEV;

if (shouldInitialize) {
  mixpanel.init("92b17c4d676f977a493c89b740ddf7ec", {
    autocapture: true,
    record_sessions_percent: 100,
    debug: import.meta.env.DEV,
    track_pageview: true,
    persistence: "localStorage",
  });
}

// Vue plugin
export default {
  install(app) {
    if (shouldInitialize) {
      app.config.globalProperties.$mixpanel = mixpanel;
      app.provide("mixpanel", mixpanel);
    } else {
      // Provide stub in dev when disabled
      const stub = {
        track: () => {},
        identify: () => {},
        people: { set: () => {} },
      };
      app.config.globalProperties.$mixpanel = stub;
      app.provide("mixpanel", stub);
    }
  },
};

export { mixpanel };
