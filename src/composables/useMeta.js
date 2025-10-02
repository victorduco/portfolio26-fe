import { watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { META_CONFIG } from "../config/meta.js";

/**
 * Composable для управления мета-тегами страницы
 * @param {string} pageKey - ключ страницы из META_CONFIG.pages
 */
export function useMeta(pageKey) {
  const route = useRoute();

  const updateMeta = () => {
    // Обновляем title
    const title = META_CONFIG.getTitle(pageKey);
    document.title = title;

    // Обновляем description
    const description = META_CONFIG.getDescription(pageKey);
    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }

    metaDescription.content = description;

    // Обновляем favicon
    let linkFavicon = document.querySelector('link[rel="icon"]');

    if (!linkFavicon) {
      linkFavicon = document.createElement("link");
      linkFavicon.rel = "icon";
      document.head.appendChild(linkFavicon);
    }

    linkFavicon.href = META_CONFIG.favicon;
  };

  onMounted(() => {
    updateMeta();
  });

  // Обновляем мета при изменении роута (если компонент переиспользуется)
  watch(() => route.path, updateMeta);

  return {
    updateMeta,
  };
}
