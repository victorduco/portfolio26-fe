/**
 * Story 2 - Editable Content
 *
 * Этот файл содержит ВСЕ текстовое содержимое Story 2 в структурированном формате
 * для ручного редактирования. После редактирования можно будет перенести обратно в код.
 *
 * НЕ ВКЛЮЧЕНО: технические параметры (цвета, отступы, типы медиа и т.д.)
 * ВКЛЮЧЕНО: все заголовки, текстовый контент, метаданные маркеров
 */

export const story2EditableContent = {
  // ============================================================================
  // НАЗВАНИЕ ПРОЕКТА И SUMMARY
  // ============================================================================
  projectTitle: 'Relaunching the Employee Comms App',

  summary: {
    timeline: 'Jan 2021 - Dec 2021',
    projectType: 'Redesign',
    role: 'Senior Product Designer',
    contribution: ['User Research', 'Interface Design', 'Interaction Design', 'Design System'],
    organizationType: 'Company',
    organizationName: 'Smarp (now Haiilo)',
  },

  // ============================================================================
  // RESULTS (хранятся отдельно)
  // ============================================================================
  results: [
    {
      label: "App Rating",
      title: "3.2 → 4.6",
      description: "Average rating in the App Store and Google Play Store.",
    },
    {
      label: "Installation Rate",
      title: "4.5% → 32%",
      description: "Percentage of users who installed the app out of the total user base.",
    },
    {
      label: "Active Users",
      title: "0.5% → 14%",
      description: "Percentage of users who became regular mobile app users out of the total user base.",
    },
  ],

  resultsIntro: "The results show impact 11 months post-launch. Metrics were measured and validated by the marketing team through comprehensive analytics tracking across App Store, Google Play, and internal user engagement platforms.",

  resultsConclusion: "These improvements demonstrate the significant impact of the redesign on user engagement and satisfaction. The mobile experience transformation led to measurable business outcomes and validated our design decisions through real-world usage data.",

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
        sectionTag: "About Smarp / Haiilo",
        heading: "Leader in Employee Communications",

        textBefore: "Smarp is the leading employee communication platform trusted by global enterprises including Google, Coca-Cola, and L'Oréal. With over 50,000 active users across Fortune 500 companies, Smarp empowers organizations to connect teams, share knowledge, and build stronger company culture.",

        // Медиа: layered-cards (3 изображения)
        // story2-about-1.png (left), story2-about-3.png (center), story2-about-2.png (right)
        mediaLabel: "Key Highlights from Smarp (now Haiilo) with major clients, core features, and results",

        markers: [],
      },
      {
        sectionTag: "Challenge",
        heading: "Desktop-First Mobile Experience",

        textBefore: "The previous design was built on legacy patterns that no longer served modern workplace needs. Cluttered interfaces, inconsistent components, and outdated visual language created friction across the entire user experience. Navigation was confusing, key features were buried, and the mobile experience was an afterthought.",

        // Медиа: layered-cards (3 изображения)
        // story2-challenge-1.png (left), story2-challenge-3.png (center), story2-challenge-2.png (right)
        mediaLabel: "Overview of Issues in the Previous Mobile App",

        markers: [
          {
            note: "Marker 1 на правом изображении (story2-challenge-2.png)",
            targetImage: "right",
            text: "Challenge marker",
          },
        ],
      },
    ],
  },

  // ----------------------------------------------------------------------------
  // PROCESS
  // ----------------------------------------------------------------------------
  process: {
    sectionTag: null,
    mainHeading: "Process",

    sections: [
      {
        sectionTag: "Discovery",
        heading: "Best Practices & User Interviews",

        textBefore: "Through extensive user research with employees across different departments and seniority levels, we identified key pain points in the existing communication flow. Conducted stakeholder interviews, competitive analysis, and analyzed usage analytics to understand how teams were actually using the platform versus how we intended them to use it.",

        // Медиа: layered-cards (3 изображения)
        // story2-discovery-2.png (left), story2-discovery-1.png (center), story2-discovery-3.png (right)
        mediaLabel: "Sample Documents From the Initial Discovery Stage",

        markers: [
          {
            note: "Marker 1 на центральном изображении (story2-discovery-1.png)",
            targetImage: "center",
            text: "Discovery marker 1",
          },
          {
            note: "Marker 2 на правом изображении (story2-discovery-3.png)",
            targetImage: "right",
            text: "Discovery marker 2",
          },
        ],
      },
      {
        sectionTag: "Ideation & Prioritization",
        heading: "Defining What Matters Most for Employee Comms",

        textBefore: "Created low-fidelity wireframes to explore new navigation patterns and information architecture. Iterated rapidly through multiple concepts, testing different approaches to content organization, feature discoverability, and user flows. Collaborated closely with product managers and engineers to ensure technical feasibility while pushing for better UX.",

        // Медиа: image - story2-wireframes.png
        mediaLabel: "Wireframes Exploring Different Solution Concepts",

        markers: [
          {
            note: "Marker 1 на изображении story2-wireframes.png",
            text: "Explored new navigation patterns and IA structures",
          },
        ],
      },
      {
        sectionTag: "Prototype Testing",
        heading: "Polishing the UX of the New Flows",

        textBefore: "Built high-fidelity interactive prototypes and conducted usability testing sessions with 25+ users across different personas. Gathered feedback on key workflows, refined interaction patterns, and validated design decisions through A/B testing. Iteratively improved the design based on real user behavior and feedback before final implementation.",

        // Медиа: layered-cards (3 изображения)
        // story2-prototype-1.png (left), story2-prototype-3.png (center), story2-prototype-2.png (right)
        mediaLabel: "Improvements from the testing, showing both pre-test and updated screen versions.",

        markers: [
          {
            note: "Marker 1 на центральном изображении (story2-prototype-3.png)",
            targetImage: "center",
            text: "Prototype testing marker",
          },
        ],
      },
    ],
  },

  // ----------------------------------------------------------------------------
  // FINAL DESIGN
  // ----------------------------------------------------------------------------
  design: {
    sectionTag: null,
    mainHeading: "Final Design",

    sections: [
      {
        sectionTag: "Home Screen",
        heading: "Enhanced Content Options for Employees and Community Managers",

        // PLACEHOLDER TEXT - не включаем в финальный контент
        textBefore: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",

        // Медиа: image - story2-final-1.png
        mediaLabel: "Home screen featuring a slider, an interactive widget, articles, company events, channels, personal recommendations, and curated content for key moments.",

        markers: [
          {
            note: "Marker 1 на изображении story2-final-1.png",
            text: "New marker 1",
          },
          {
            note: "Marker 2 на изображении story2-final-1.png",
            text: "New marker 3",
          },
          {
            note: "Marker 3 на изображении story2-final-1.png",
            text: "New marker 4",
          },
        ],
      },
      {
        sectionTag: "Internal Screens",
        heading: "Supporting New Content Types and Improving UX",

        // PLACEHOLDER TEXT - не включаем в финальный контент
        textBefore: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",

        // Медиа: image - story2-final-2.png
        mediaLabel: "Channel and search result screens updated to support the new features.",

        markers: [
          {
            note: "Marker 1 на изображении story2-final-2.png",
            text: "Updated channel and search screens",
          },
          {
            note: "Marker 2 на изображении story2-final-2.png",
            text: "New marker",
          },
        ],
      },
    ],
  },
};
