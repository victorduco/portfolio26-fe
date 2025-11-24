import { watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { META_CONFIG } from "../config/meta.js";

/**
 * Composable для управления мета-тегами страницы
 * @param {string} pageKey - ключ страницы из META_CONFIG.pages
 */
export function useMeta(pageKey) {
  let route;
  try {
    route = useRoute();
  } catch {
    return { updateMeta: () => {} };
  }

  const setOrUpdateMeta = (selector, attributes) => {
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement(selector.includes("[property=") ? "meta" : selector.split("[")[0]);
      document.head.appendChild(element);
    }
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  };

  const updateMeta = (route) => {
    if (!route?.path) return;

    const title = META_CONFIG.getTitle(pageKey);
    const description = META_CONFIG.getDescription(pageKey);
    const url = `https://www.victorduco.com${route.path}`;
    const ogImage = "https://www.victorduco.com/og-image.png";

    document.title = title;

    const metaTags = [
      ['meta[name="description"]', { name: "description", content: description }],
      ['meta[property="og:title"]', { property: "og:title", content: title }],
      ['meta[property="og:description"]', { property: "og:description", content: description }],
      ['meta[property="og:url"]', { property: "og:url", content: url }],
      ['meta[property="og:image"]', { property: "og:image", content: ogImage }],
      ['meta[property="twitter:title"]', { property: "twitter:title", content: title }],
      ['meta[property="twitter:description"]', { property: "twitter:description", content: description }],
      ['meta[property="twitter:url"]', { property: "twitter:url", content: url }],
      ['meta[property="twitter:image"]', { property: "twitter:image", content: ogImage }],
    ];

    metaTags.forEach(([selector, attrs]) => setOrUpdateMeta(selector, attrs));
  };

  onMounted(() => route && updateMeta(route));
  watch(() => route?.path, () => route && updateMeta(route));

  return { updateMeta };
}
