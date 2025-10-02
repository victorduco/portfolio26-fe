// Конфигурация мета-тегов для всего сайта
export const META_CONFIG = {
  // Общая часть, которая добавляется ко всем страницам
  siteName: "VDCP26",
  separator: " | ",

  // Путь к favicon
  favicon: "/favicon.svg",

  // Мета-данные для каждой страницы
  pages: {
    keypad: {
      title: "Enter Code",
      description: "Enter the code to unlock the portfolio",
    },
    home: {
      title: "Portfolio",
      description: "UX Designer Portfolio - Rectangles That Rules Numbers",
    },
    case1: {
      title: "Case Study 1",
      description: "Design System Architecture - Building consistent and scalable UI components",
    },
    case2: {
      title: "Case Study 2",
      description: "User Experience Design - Creating intuitive and delightful interactions",
    },
    case3: {
      title: "Case Study 3",
      description: "Performance Optimization - Maximizing speed and efficiency",
    },
  },

  // Генерация полного title
  getTitle(pageKey) {
    const pageTitle = this.pages[pageKey]?.title || "Page";
    return `${pageTitle}${this.separator}${this.siteName}`;
  },

  // Получение description
  getDescription(pageKey) {
    return this.pages[pageKey]?.description || "";
  },
};
