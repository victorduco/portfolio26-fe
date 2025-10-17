import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../pages/main-page/MainPage.vue";
import CasePage from "../pages/case-page/CasePage.vue";
import { mixpanel } from "../plugins/mixpanel.js";

const routes = [
  {
    path: "/",
    name: "Home",
    component: MainPage,
  },
  {
    path: "/story/one",
    name: "StoryOne",
    component: CasePage,
    props: { caseId: "1" },
  },
  {
    path: "/story/two",
    name: "StoryTwo",
    component: CasePage,
    props: { caseId: "2" },
  },
  {
    path: "/story/three",
    name: "StoryThree",
    component: CasePage,
    props: { caseId: "3" },
  },
];

const scrollPositions = new Map();

const getScrollTop = () => {
  if (typeof window === "undefined") return 0;
  const container = document.querySelector(".scroll-snap-container.fullscreen");
  return container ? container.scrollTop : window.scrollY || window.pageYOffset;
};

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;

    if (to.path === "/" && from.path.startsWith("/story")) {
      const savedScroll = scrollPositions.get("/");
      if (savedScroll !== undefined) {
        return new Promise((resolve) => {
          setTimeout(
            () => resolve({ top: savedScroll, behavior: "instant" }),
            50
          );
        });
      }
    }

    if (to.path.startsWith("/story")) return { top: 0, behavior: "instant" };

    return { top: 0, behavior: "instant" };
  },
});

router.beforeEach(async (to, from, next) => {
  // Сохраняем позицию скролла
  if (from.path === "/") {
    scrollPositions.set("/", getScrollTop());
  }

  // Мета для навигации и скролла
  if (to.path === "/") {
    const cameFromStory = from.path?.startsWith("/story");
    to.meta.skipNavIntro = Boolean(cameFromStory);
    to.meta.restoreScrollTop = cameFromStory
      ? scrollPositions.get("/") ?? 0
      : undefined;
  } else {
    to.meta.skipNavIntro = false;
    to.meta.restoreScrollTop = undefined;
  }

  next();
});

// Track page views after navigation
router.afterEach((to, from) => {
  if (mixpanel) {
    mixpanel.track("Page View", {
      page: to.path,
      page_name: to.name,
      from_page: from.path,
      from_page_name: from.name,
    });
  }
});

export default router;
