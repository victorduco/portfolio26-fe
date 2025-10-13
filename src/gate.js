import { createApp } from "vue";
import GateApp from "./GateApp.vue";
import "./style.css";
import "./styles/colors.css";
import "./styles/typography.css";
import "./styles/glass.css";
import directivesPlugin from "./plugins/directives.js";

const app = createApp(GateApp);
app.use(directivesPlugin);
app.mount("#gate-app");
