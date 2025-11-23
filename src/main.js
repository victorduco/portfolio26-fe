import { createApp } from "vue";
import "./styles/colors.css";
import "./styles/typography.css";
import "./style.css";
import "./styles/glass.css";
// import "./styles/lenis.css";
import "./assets/fonts/intro-icons/intro-icons.css";
// import "lenis/dist/lenis.css";
import App from "./App.vue";
import directivesPlugin from "./plugins/directives.js";
import mixpanelPlugin from "./plugins/mixpanel.js";
import router from "./router/index.js";
import { initMediaResolver } from "./utils/mediaResolver.js";
import { loadFonts } from "./utils/fontLoader.js";

// Disable browser's automatic scroll restoration
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

// Initialize media resolver (loads manifest for CDN path resolution)
initMediaResolver();

// Load fonts from CDN in production
loadFonts();

const app = createApp(App);
app.use(directivesPlugin);
app.use(mixpanelPlugin);
app.use(router);
app.mount("#app");
