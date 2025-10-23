import { watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { META_CONFIG } from "../config/meta.js";

/**
 * Composable для управления мета-тегами страницы
 * @param {string} pageKey - ключ страницы из META_CONFIG.pages
 */
export function useMeta(pageKey) {
  // Безопасно получаем route, если он доступен
  let route = null;
  try {
    route = useRoute();
  } catch (error) {
    // Route недоступен (компонент вне RouterView или до инициализации роутера)
    console.warn("useMeta: component is outside router context, meta tags will not be updated");
    return {
      updateMeta: () => {},
    };
  }

  const setOrUpdateMeta = (selector, attributes) => {
    let element = document.querySelector(selector);
    if (!element) {
      const tagName = selector.includes("[property=")
        ? "meta"
        : selector.split("[")[0];
      element = document.createElement(tagName);
      document.head.appendChild(element);
    }
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  };

  const updateMeta = (route) => {
    // Проверяем, что route доступен и имеет path
    if (!route || !route.path) {
      return;
    }

    // Получаем данные для страницы
    const title = META_CONFIG.getTitle(pageKey);
    const description = META_CONFIG.getDescription(pageKey);
    const url = `https://www.victorduco.com${route.path}`;
    const ogImage = "https://www.victorduco.com/og-image.png";

    // Обновляем title
    document.title = title;

    // Обновляем description
    setOrUpdateMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });

    // Обновляем Open Graph теги
    setOrUpdateMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });

    setOrUpdateMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });

    setOrUpdateMeta('meta[property="og:url"]', {
      property: "og:url",
      content: url,
    });

    setOrUpdateMeta('meta[property="og:image"]', {
      property: "og:image",
      content: ogImage,
    });

    // Обновляем Twitter Card теги
    setOrUpdateMeta('meta[property="twitter:title"]', {
      property: "twitter:title",
      content: title,
    });

    setOrUpdateMeta('meta[property="twitter:description"]', {
      property: "twitter:description",
      content: description,
    });

    setOrUpdateMeta('meta[property="twitter:url"]', {
      property: "twitter:url",
      content: url,
    });

    setOrUpdateMeta('meta[property="twitter:image"]', {
      property: "twitter:image",
      content: ogImage,
    });
  };

  onMounted(() => {
    // Обновляем мета после монтирования
    if (route) {
      updateMeta(route);
    }
  });

  // Обновляем мета при изменении роута (если компонент переиспользуется)
  watch(
    () => route?.path,
    () => {
      if (route) {
        updateMeta(route);
      }
    }
  );

  return {
    updateMeta: (route) => updateMeta(route),
  };
}
