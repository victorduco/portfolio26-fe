import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'P26 Cases',
  description: 'Case studies documentation',

  // Настройки темной темы
  appearance: 'dark',

  themeConfig: {
    // Отключаем ненужные элементы для встроенных страниц
    nav: [],
    sidebar: false,

    // Настройки под дизайн приложения
    footer: {
      message: '',
      copyright: ''
    }
  },

  // Кастомные стили для соответствия дизайну (#171717)
  head: [
    [
      'style',
      {},
      `
        :root {
          --vp-c-bg: #171717;
          --vp-c-bg-soft: #1f1f1f;
          --vp-c-bg-alt: #262626;
          --vp-c-text-1: #ffffff;
          --vp-c-text-2: #e5e5e5;
          --vp-c-text-3: #a3a3a3;
        }

        .VPNav,
        .VPSidebar,
        .VPFooter {
          display: none !important;
        }

        .VPDoc.has-sidebar .content-container {
          max-width: 100% !important;
        }

        .vp-doc {
          padding: 32px 48px !important;
        }

        body {
          background: #171717;
          color: #ffffff;
        }
      `
    ]
  ],

  // Markdown конфигурация
  markdown: {
    theme: 'github-dark',
    lineNumbers: true
  }
})
