import { createApp } from "vue";
import "./styles/colors.css";
import "./styles/typography.css";
import "./style.css";
import "./styles/glass.css";
import "./assets/fonts/intro-icons/intro-icons.css";
import App from "./App.vue";
import directivesPlugin from "./plugins/directives.js";
import mixpanelPlugin from "./plugins/mixpanel.js";
import router from "./router/index.js";
import { initMediaResolver } from "./utils/mediaResolver.js";
import { loadFonts } from "./utils/fontLoader.js";

if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";

// Initialize media resolver and load fonts before mounting app
Promise.all([initMediaResolver(), loadFonts()]).then(() => {
  createApp(App).use(directivesPlugin).use(mixpanelPlugin).use(router).mount("#app");
});
