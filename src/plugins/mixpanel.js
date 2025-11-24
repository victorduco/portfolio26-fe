import mixpanel from "mixpanel-browser";

const stub = { track: () => {}, identify: () => {}, people: { set: () => {} } };
const shouldInit = import.meta.env.PROD || false;

if (shouldInit) {
  mixpanel.init("92b17c4d676f977a493c89b740ddf7ec", {
    autocapture: true,
    record_sessions_percent: 100,
    debug: import.meta.env.DEV,
    track_pageview: true,
    persistence: "localStorage",
  });
}

const mixpanelInstance = shouldInit ? mixpanel : stub;

export default {
  install: (app) => {
    app.config.globalProperties.$mixpanel = mixpanelInstance;
    app.provide("mixpanel", mixpanelInstance);
  },
};

export { mixpanelInstance as mixpanel };
