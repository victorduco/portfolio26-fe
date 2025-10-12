import { createApp } from "vue";
import "./styles/colors.css";
import "./styles/typography.css";
import "./style.css";
import "./styles/glass.css";
import "./assets/fonts/fontello/fontello-icons.css";
import App from "./App.vue";
import directivesPlugin from "./plugins/directives.js";
import router from "./router/index.js";

const app = createApp(App);
app.use(directivesPlugin);
app.use(router);
app.mount("#app");
