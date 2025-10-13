import { createApp } from "vue";
import "./styles/colors.css";
import "./styles/typography.css";
import "./style.css";
import "./styles/glass.css";
import "./assets/fonts/fontello/fontello-icons.css";
import { RouterView } from "vue-router";
import directivesPlugin from "./plugins/directives.js";
import mixpanelPlugin from "./plugins/mixpanel.js";
import router from "./router/index.js";

const app = createApp(RouterView);
app.use(directivesPlugin);
app.use(mixpanelPlugin);
app.use(router);
app.mount("#app");
