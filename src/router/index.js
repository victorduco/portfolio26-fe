import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../pages/main-page/MainPage.vue";
import CasePage from "../pages/case-page/CasePage.vue";
import GateApp from "../GateApp.vue";

const routes = [
  {
    path: "/gate",
    name: "Gate",
    component: GateApp,
    meta: { public: true }, // Публичный роут, не требует авторизации
  },
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

// API URL from environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Проверка авторизации
let authCheckPromise = null;
async function checkAuth() {
  if (authCheckPromise) return authCheckPromise;

  authCheckPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}/api/whoami`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      return response.ok && data.ok;
    } catch (err) {
      console.error("Auth check error:", err);
      return false;
    }
  })();

  return authCheckPromise;
}

// Функция для сброса кэша аутентификации
export function resetAuthCache() {
  authCheckPromise = null;
}

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

  // Проверка авторизации для защищённых роутов
  if (!to.meta.public) {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
      // Не авторизован - редирект на /gate с параметром next
      if (to.path !== "/gate") {
        next({
          path: "/gate",
          query: { next: to.fullPath },
        });
        return;
      }
    }
  }

  next();
});

export default router;
