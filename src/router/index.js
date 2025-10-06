import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../pages/main-page/MainPage.vue";
import Case1Page from "../pages/case1-page/Case1Page.vue";
import Case2Page from "../pages/case2-page/Case2Page.vue";
import Case3Page from "../pages/case3-page/Case3Page.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: MainPage,
  },
  {
    path: "/story/one",
    name: "StoryOne",
    component: Case1Page,
  },
  {
    path: "/story/two",
    name: "StoryTwo",
    component: Case2Page,
  },
  {
    path: "/story/three",
    name: "StoryThree",
    component: Case3Page,
  },
];

// Хранилище для позиций скролла
const scrollPositions = new Map();

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Если есть savedPosition (кнопки браузера вперед/назад)
    if (savedPosition) {
      return savedPosition;
    }

    // Если возвращаемся на главную со страницы кейса
    if (to.path === "/" && from.path.startsWith("/story")) {
      const savedScroll = scrollPositions.get("/");
      if (savedScroll !== undefined) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ top: savedScroll, behavior: "instant" });
          }, 50);
        });
      }
    }

    // При переходе на кейс - в начало
    if (to.path.startsWith("/story")) {
      return { top: 0, behavior: "instant" };
    }

    // По умолчанию
    return { top: 0, behavior: "instant" };
  },
});

// Сохраняем позицию скролла перед переходом
router.beforeEach((to, from, next) => {
  if (from.path === "/") {
    if (typeof window !== "undefined") {
      const container = document.querySelector(
        ".scroll-snap-container.fullscreen"
      );
      const scrollTop = container
        ? container.scrollTop
        : window.scrollY || window.pageYOffset;
      scrollPositions.set("/", scrollTop);
    } else {
      scrollPositions.set("/", 0);
    }
  }

  if (to.path === "/") {
    const cameFromStory = from.path?.startsWith("/story");
    to.meta.skipNavIntro = Boolean(cameFromStory);
    if (cameFromStory) {
      const savedScroll = scrollPositions.has("/")
        ? scrollPositions.get("/")
        : 0;
      to.meta.restoreScrollTop = savedScroll;
    } else if (to.meta.restoreScrollTop !== undefined) {
      to.meta.restoreScrollTop = undefined;
    }
  } else if (to.meta?.skipNavIntro) {
    to.meta.skipNavIntro = false;
    if (to.meta.restoreScrollTop !== undefined) {
      to.meta.restoreScrollTop = undefined;
    }
  }
  next();
});

export default router;
