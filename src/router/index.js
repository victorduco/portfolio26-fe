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

// Store scroll position when navigating from home page
const scrollPositions = new Map();

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top for story pages
    if (to.path.startsWith("/story")) {
      return { top: 0, behavior: "instant" };
    }

    // Restore saved scroll position when returning to home from story
    if (to.path === "/" && from.path?.startsWith("/story")) {
      const savedScroll = scrollPositions.get("/");
      if (savedScroll !== undefined) {
        console.log('📍 Restoring scroll position:', savedScroll);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ top: savedScroll, behavior: "instant" });
          }, 50);
        });
      }
    }

    // Use browser's saved position for other back/forward navigation
    if (savedPosition) {
      return savedPosition;
    }

    // Default: scroll to top
    return { top: 0, behavior: "instant" };
  },
});

router.beforeEach(async (to, from, next) => {
  // Save scroll position when leaving home page to story
  if (from.path === "/" && to.path.startsWith("/story")) {
    const scrollTop = window.scrollY || window.pageYOffset;
    scrollPositions.set("/", scrollTop);
    console.log('💾 Saved scroll position:', scrollTop);
  }

  // Set meta for skipping intro animation when returning from story
  if (to.path === "/") {
    const cameFromStory = from.path?.startsWith("/story");
    to.meta.skipNavIntro = Boolean(cameFromStory);

    // Clear saved position if not coming from story (e.g., page reload)
    if (!cameFromStory) {
      scrollPositions.delete("/");
    }
  } else {
    to.meta.skipNavIntro = false;
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
