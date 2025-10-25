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
import { initGSAP } from "./pages/main-page/cases/gsap-utils.js";

// Initialize GSAP globally
initGSAP();

const app = createApp(App);
app.use(directivesPlugin);
app.use(mixpanelPlugin);
app.use(router);
app.mount("#app");
