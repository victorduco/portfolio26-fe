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
    path: "/case1",
    name: "Case1",
    component: Case1Page,
  },
  {
    path: "/case2",
    name: "Case2",
    component: Case2Page,
  },
  {
    path: "/case3",
    name: "Case3",
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
    if (to.path === "/" && from.path.startsWith("/case")) {
      const savedScroll = scrollPositions.get("/");
      if (savedScroll) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ top: savedScroll, behavior: "instant" });
          }, 50);
        });
      }
    }

    // При переходе на кейс - в начало
    if (to.path.startsWith("/case")) {
      return { top: 0, behavior: "instant" };
    }

    // По умолчанию
    return { top: 0, behavior: "instant" };
  },
});

// Сохраняем позицию скролла перед переходом
router.beforeEach((to, from, next) => {
  if (from.path === "/") {
    scrollPositions.set("/", window.scrollY || window.pageYOffset);
  }
  next();
});

export default router;
