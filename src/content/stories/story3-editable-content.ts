/**
 * Story 3 - Editable Content
 *
 * Этот файл содержит ВСЕ текстовое содержимое Story 3 в структурированном формате
 * для ручного редактирования. После редактирования можно будет перенести обратно в код.
 *
 * НЕ ВКЛЮЧЕНО: технические параметры (цвета, отступы, типы медиа и т.д.)
 * ВКЛЮЧЕНО: все заголовки, текстовый контент, метаданные маркеров
 */

export const story3EditableContent = {
  // ============================================================================
  // НАЗВАНИЕ ПРОЕКТА И SUMMARY
  // ============================================================================
  projectTitle: 'A Full Redesign of an Oil Terminal Operations App',

  summary: {
    timeline: 'Feb 2025 - Jun 2025',
    projectType: 'UX Audit, Redesign, Mentorship',
    role: 'External UX Expert',
    contribution: ['UX Audit', 'User Research', 'Product Design', 'Team Support'],
    organizationType: 'Company',
    organizationName: 'Digineox (Houston, TX)',
  },

  // ============================================================================
  // RESULTS (хранятся отдельно)
  // ============================================================================
  simpleResults: {
    title: "Redesign Results",
    text: "The comprehensive redesign transformed the platform from a struggling e-commerce experience into a high-performing solution. Load times dropped 79%, cart abandonment fell from 73% to 34%, and revenue increased 142% in six months. Within 12 months, the user base grew from 2M to 4.2M users, the platform moved from #7 to #2 in market rankings, and won Awwwards Site of the Day while being featured in TechCrunch and Smashing Magazine.",
  },

  // ============================================================================
  // СЕКЦИИ КОНТЕНТА
  // ============================================================================

  // ----------------------------------------------------------------------------
  // BACKGROUND
  // ----------------------------------------------------------------------------
  background: {
    sectionTag: null,
    mainHeading: "Background",

    sections: [
      {
        sectionTag: "User Challenge",
        heading: "Harsh Conditions, Critical Actions",

        textBefore: "The platform faced critical challenges across multiple dimensions. Users struggled with fragmented workflows, inconsistent interfaces, and a steep learning curve that resulted in low feature adoption. The mobile experience was particularly problematic, with conversion rates significantly lagging behind desktop. These issues compounded into a broader problem of user retention and engagement.",

        // Медиа: layered-cards (3 изображения)
        // story3-challenge-1.png (left), story3-challenge-3.png (center), story3-challenge-2.png (right)
        mediaLabel: "Typical field conditions: rain, safety equipment, and a tablet with a protective screen.",

        markers: [
          {
            note: "Marker 1 на левом изображении (story3-challenge-1.png)",
            targetImage: "left",
            text: "Fragmented workflows caused confusion",
          },
          {
            note: "Marker 2 на центральном изображении (story3-challenge-3.png)",
            targetImage: "center",
            text: "Harsh field conditions require robust UX",
          },
        ],
      },
      {
        sectionTag: null,
        heading: "Previous Design",

        textBefore: "The e-commerce platform suffered from severe usability issues that were driving customers away. Complex navigation made product discovery frustrating, the checkout flow had 7+ steps causing massive cart abandonment, and mobile experience was broken with tiny buttons and unresponsive layouts. Performance was abysmal with 8+ second load times on mobile, causing users to leave before pages even loaded.",

        // Медиа: image - story3-task.png
        mediaLabel: "Previous version: Home screen, My Tasks (two views), and user profile.",

        markers: [],
      },
    ],
  },

  // ----------------------------------------------------------------------------
  // UX AUDIT
  // ----------------------------------------------------------------------------
  audit: {
    sectionTag: null,
    mainHeading: "UX Audit",

    sections: [
      {
        sectionTag: "User & Competitor Research",
        heading: "Building a Fact-Based Case for Change",

        textBefore: "Conducted extensive usability testing with 30+ participants and analyzed top 10 competitors to identify industry best practices. Heat maps revealed friction points, scroll depth analytics showed content discovery issues, and competitor analysis identified key opportunities for differentiation in navigation, checkout flows, and mobile experience.",

        // Медиа: layered-cards (3 изображения)
        // story3-ground-1.png (left), story3-ground-3.png (center), story3-ground-2.png (right)
        mediaLabel: "Internal documentation samples: personas, best practices, and user testing of the previous design.",

        markers: [
          {
            note: "Marker 1 на правом изображении (story3-ground-2.png)",
            targetImage: "right",
            text: "Usability testing insights",
          },
        ],
      },
      {
        sectionTag: "UX Audit Report",
        heading: "Prioritized and Actionable Summary of UX Problems",

        textBefore: "Delivered comprehensive UX audit report with prioritized recommendations across 5 key areas: navigation & IA, product discovery, checkout optimization, mobile experience, and performance. Each recommendation included severity rating, estimated impact, implementation effort, and supporting data from user testing. Created detailed roadmap for phased implementation aligned with business priorities.",

        // Медиа: layered-cards (3 изображения)
        // story3-audit-1.png (left), story3-audit-3.png (center), story3-audit-2.png (right)
        mediaLabel: "Sample slides from the final report showing issues and solutions.",

        markers: [
          {
            note: "Marker 1 на центральном изображении (story3-audit-3.png)",
            targetImage: "center",
            text: "Prioritized UX recommendations",
          },
        ],

        textAfter: "The audit findings provided a clear foundation for the redesign phase. Armed with data-driven insights and validated recommendations, the team was ready to transform the platform from a frustrating experience into an intuitive, high-performing e-commerce solution.",
      },
    ],
  },

  // ----------------------------------------------------------------------------
  // APP REDESIGN
  // ----------------------------------------------------------------------------
  redesign: {
    sectionTag: null,
    mainHeading: "App Redesign",

    sections: [
      {
        sectionTag: "Home Page",
        heading: "Keeping Only What Matters, Without Losing the Experience",

        textBefore: "A design system with 142 components provided consistency. Navigation restructured through user testing reduced clicks-to-product from 4.2 to 2.1. Mobile got touch-optimized interactions and streamlined checkout. A/B tests validated every decision.",

        // Медиа: layered-cards (3 изображения)
        // story3-home-1-1.png (left), story3-home-1-3.png (center), story3-home-1-2.png (right)
        mediaLabel: "The home screen adapts to the user's current situation, showing only what matters most.",

        markers: [
          {
            note: "Marker 1 на правом изображении (story3-home-1-2.png)",
            targetImage: "right",
            text: "Adaptive home screen",
          },
        ],
      },
      {
        sectionTag: null,
        heading: null,

        textBefore: "The new interface introduced streamlined workflows that significantly reduced cognitive load. By consolidating related actions and providing contextual information at the right moment, users could accomplish tasks with fewer clicks and less mental effort. Progressive disclosure techniques ensured that advanced features remained accessible without overwhelming new users.",

        // Медиа: horizontalParallax (3 изображения)
        // story3-illustr-1.png, story3-illustr-2.png, story3-illustr-3.png
        mediaLabel: "Illustration samples for different order types, statuses, and conditions.",
      },
      {
        sectionTag: "App Navigation",
        heading: "Attention Goes to What Truly Matters",

        textBefore: "Gradual migration allowed business continuity while rebuilding. We audited 47 page templates, prioritized revenue-driving pages, and set targets: 75% faster loads, 100% mobile conversion increase, Lighthouse scores above 95.",

        // Медиа: layered-cards (3 изображения)
        // story3-nav-1-1.png (left), story3-nav-1-3.png (center), story3-nav-1-2.png (right)
        mediaLabel: "Examples of visual hierarchy: (1) the menu stays low-priority; (2) notifications gain prominence only when something critical happens.",

        markers: [
          {
            note: "Marker 1 на левом изображении (story3-nav-1-1.png)",
            targetImage: "left",
            text: "Low-priority menu design",
          },
          {
            note: "Marker 2 на правом изображении (story3-nav-1-2.png)",
            targetImage: "right",
            text: "Critical notifications prominence",
          },
        ],
      },
      {
        sectionTag: "Order View",
        heading: "Flatter Navigation With 50% Fewer Transitions",

        textBefore: "Redesigned the homepage with a clean, modern aesthetic that prioritizes product discovery and creates clear visual hierarchy. Implemented large hero imagery, featured product carousels, and category navigation that guides users naturally through the experience. Reduced clutter by 60%, improved above-the-fold conversion triggers, and created a mobile-first responsive layout that adapts beautifully across all screen sizes.",

        // Медиа: layered-cards (3 изображения)
        // story3-order-1-1.png (left), story3-order-1-3.png (center), story3-order-1-2.png (right)
        mediaLabel: "Examples of order screens: main view, steps panel, and order overview.",

        markers: [
          {
            note: "Marker 1 на правом изображении (story3-order-1-2.png)",
            targetImage: "right",
            text: "Order overview",
          },
        ],
      },
      {
        sectionTag: null,
        heading: null,

        // PLACEHOLDER TEXT - не включаем в финальный контент
        textBefore: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",

        // Медиа: layered-cards (3 изображения)
        // story3-nav-2-1.png (left), story3-nav-2-3.png (center), story3-nav-2-2.png (right)
        mediaLabel: "Multiple other improvements driven by insights from the research phase.",

        markers: [],
      },
    ],
  },
};
