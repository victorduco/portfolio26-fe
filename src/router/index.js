import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../pages/main-page/MainPage.vue";
import StoryPage from "../pages/story-page/StoryPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";
import { mixpanel } from "../plugins/mixpanel.js";

const scrollPositions = new Map();

const routes = [
  { path: "/", name: "Home", component: MainPage },
  ...["one", "two", "three"].map((id, i) => ({
    path: `/story/${id}`,
    name: `Story${["One", "Two", "Three"][i]}`,
    component: StoryPage,
    props: { storyId: String(i + 1) },
  })),
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.path.startsWith("/story")) return { top: 0, behavior: "instant" };
    if (to.path === "/" && from.path?.startsWith("/story")) {
      const savedScroll = scrollPositions.get("/");
      if (savedScroll !== undefined) {
        return new Promise((resolve) => setTimeout(() => resolve({ top: savedScroll, behavior: "instant" }), 50));
      }
    }
    return savedPosition || { top: 0, behavior: "instant" };
  },
});

router.beforeEach((to, from, next) => {
  if (from.path === "/" && to.path.startsWith("/story")) {
    scrollPositions.set("/", window.scrollY || window.pageYOffset);
  }
  const cameFromStory = from.path?.startsWith("/story");
  to.meta.skipNavIntro = to.path === "/" && Boolean(cameFromStory);
  if (to.path === "/" && !cameFromStory) scrollPositions.delete("/");
  next();
});

router.afterEach((to, from) => {
  if (mixpanel) mixpanel.track("Page View", { page: to.path, page_name: to.name, from_page: from.path, from_page_name: from.name });
});

export default router;
