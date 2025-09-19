import { createApp } from "vue";
import "./styles/colors.css";
import "./styles/typography.css";
import "./style.css";
import "./styles/glass.css";
import App from "./App.vue";
import directivesPlugin from "./plugins/directives.js";

const app = createApp(App);
app.use(directivesPlugin);
app.mount("#app");
