// Конфигурация мета-тегов для всего сайта
export const META_CONFIG = {
  // Общая часть, которая добавляется ко всем страницам
  siteName: "Victor Diukov",
  separator: " | ",

  // Путь к favicon
  favicon: "/favicon.svg",

  // Мета-данные для каждой страницы
  pages: {
    keypad: {
      title: "Victor Diukov",
      description: "Enter the code to unlock the portfolio",
    },
    home: {
      title: "Victor Diukov",
      description: "UX Designer Portfolio - Rectangles That Rules Numbers",
    },
    case1: {
      title: "Story One",
      description:
        "Design System Architecture - Building consistent and scalable UI components",
    },
    case2: {
      title: "Story Two",
      description:
        "User Experience Design - Creating intuitive and delightful interactions",
    },
    case3: {
      title: "Story Three",
      description: "Performance Optimization - Maximizing speed and efficiency",
    },
  },

  // Генерация полного title
  getTitle(pageKey) {
    const page = this.pages[pageKey];
    if (!page) return this.siteName;
    
    // Для страниц где title совпадает с siteName, не дублируем
    if (page.title === this.siteName) {
      return this.siteName;
    }
    
    // Для остальных добавляем separator и siteName
    return `${page.title}${this.separator}${this.siteName}`;
  },

  // Получение description
  getDescription(pageKey) {
    return this.pages[pageKey]?.description || "";
  },
};
