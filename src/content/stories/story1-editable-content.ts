/**
 * Story 1 - Editable Content
 *
 * Этот файл содержит ВСЕ текстовое содержимое Story 1 в структурированном формате
 * для ручного редактирования. После редактирования можно будет перенести обратно в код.
 *
 * НЕ ВКЛЮЧЕНО: технические параметры (цвета, отступы, типы медиа и т.д.)
 * ВКЛЮЧЕНО: все заголовки, текстовый контент, метаданные маркеров
 */

export const story1EditableContent = {
  // ============================================================================
  // НАЗВАНИЕ ПРОЕКТА И SUMMARY
  // ============================================================================
  projectTitle: 'Transforming Account Reconciliation with AI-Driven User Experience',

  summary: {
    timeline: 'Feb 2022 - Present',
    projectType: '0-1 Product',
    role: 'Senior Product Designer & Product Manager',
    contribution: ['User Research', 'Interface Design', 'Interaction Design', 'Product Strategy'],
    organizationType: 'Team',
    organizationName: 'Apple Financial Services',
  },

  // ============================================================================
  // RESULTS (хранятся отдельно)
  // ============================================================================
  results: [
    {
      title: "Noticeable Time Reduction",
      description: "Task completion times improved significantly, with reductions in time required depending on task complexity.",
    },
    {
      title: "Lower SLA Violations",
      description: "AI has enhanced the system's ability to identify incidents and perform predictive analysis, improving decision-making.",
    },
    {
      title: "Peak Load Support",
      description: "Workload management during peak financial periods has improved, resulting in smoother operations and reduced stress for users.",
    },
  ],

  // ============================================================================
  // СЕКЦИИ КОНТЕНТА
  // ============================================================================

  // ----------------------------------------------------------------------------
  // BACKGROUND
  // ----------------------------------------------------------------------------
  background: {
    // Section Tag (подзаголовок первого уровня)
    sectionTag: null,
    // Main Heading (основной заголовок первого уровня)
    mainHeading: "Background",

    sections: [
      {
        // Section Tag (подзаголовок)
        sectionTag: "Account Reconciliation Specifics",
        // Heading (заголовок секции)
        heading: "Something Went Wrong, Somehow",

        // Текст ДО медиа
        textBefore: "A rapidly growing SaaS company faced critical user engagement issues despite having a solid product. Their bounce rate hit 67%, with only 23% adopting key features. The mobile experience was particularly weak, converting at just 8%.",

        // Медиа: image - story1-domain-tree.png
        mediaLabel: "Users must grasp multiple subdomains to resolve problems.",

        // Маркеры для этого изображения (текст временный - оставляем метаданные)
        markers: [
          {
            note: "Marker 1 на изображении story1-domain-tree.png",
            text: "Bounce rate of 67% indicates major UX issues in the onboarding flow",
          },
        ],
      },
      {
        sectionTag: "Global Product Research",
        heading: "Identifying Cross-Regional Patterns in User Workflows",

        textBefore: "The platform processes over 2.5 million transactions daily across 50+ enterprise clients, handling reconciliation for accounts ranging from $10M to $2B in monthly volume. Our AI models maintain 99.7% accuracy while reducing processing time from hours to minutes.",

        // Медиа: layered-cards (3 изображения)
        // story1-scale-1.png (center), story1-scale-2.png (left), story1-scale-3.png (right)
        mediaLabel: "Research Summary and Business Context",

        markers: [],
      },
    ],
  },

  // ----------------------------------------------------------------------------
  // SOLUTION
  // ----------------------------------------------------------------------------
  solution: {
    sectionTag: null,
    mainHeading: "Solution",

    sections: [
      {
        sectionTag: "Conversational & Classic UI",
        heading: "Pairing Natural Dialogue with Heavy Data Workflows",

        textBefore: "Our hybrid approach seamlessly integrates AI-powered conversational interfaces with traditional UI components. Users can switch between chat-based interactions and classic forms based on their preference and task complexity, ensuring flexibility without sacrificing efficiency.",

        // Медиа: tabbed-video (2 вкладки)
        // story1-ai-flow.mp4, story1-classic-flow.mp4
        mediaLabel: "Two workflows, one unified experience. Users pick what fits best.",
      },
      {
        sectionTag: "Data Visualization",
        heading: "Helping Users See What Truly Matters in the Data",

        textBefore: "Through multiple design iterations, we refined the visual language to balance clarity with sophistication. Each iteration brought us closer to a design that feels both approachable and professional.",

        // Медиа: tabbed-img (2 версии с маркерами)
        mediaLabel: "Four stages of visual refinement",

        tabs: [
          {
            tabTitle: "Version 1",
            imageSrc: "story1-data-1-1.png",
            markers: [
              {
                note: "Marker 1 на Version 1",
                text: "Initial navigation concept with basic structure",
              },
              {
                note: "Marker 2 на Version 1",
                text: "Early content layout experimentation",
              },
              {
                note: "Marker 3 на Version 1",
                text: "Third marker",
              },
            ],
          },
          {
            tabTitle: "Version 2",
            imageSrc: "story1-data-1-2.png",
            markers: [
              {
                note: "Marker 1 на Version 2",
                text: "Simplified color palette for better readability",
              },
              {
                note: "Marker 2 на Version 2",
                text: "Second marker",
              },
              {
                note: "Marker 3 на Version 2",
                text: "Third marker",
              },
            ],
          },
        ],
      },
      {
        sectionTag: "Product Vision & Design System",
        heading: "Consistent Experience Across Variable Inputs",

        textBefore: "We developed a comprehensive AI framework that combines conversational design with intelligent automation. The system uses natural language processing to understand user intent and provides contextual assistance throughout the reconciliation workflow, reducing the learning curve by 70%.",

        // Медиа: parallax (3 изображения)
        // story1-framework-1.png, story1-framework-2.png, story1-framework-3.png
        mediaLabel: "Input & Output Elements for Chat and Classic UI",
      },
      {
        sectionTag: "Dynamic UI Feedback",
        heading: "Interactive State Management",

        textBefore: "Our chat interface demonstrates sophisticated state management with smooth transitions between different interaction states. Each state change provides clear visual feedback to guide users through their workflow.",

        // Медиа: tabbed-img с двумя состояниями (state1/state2)
        mediaLabel: "Chat interface state transitions",

        tabs: [
          {
            tabTitle: "Chat History",
            imageSrcState1: "story1-chat-history-state1.png",
            imageSrcState2: "story1-chat-history-state2.png",
            markers: [
              {
                note: "Marker 1 на Chat History",
                text: "Real-time message updates with smooth transitions",
              },
              {
                note: "Marker 2 на Chat History",
                text: "Context-aware action buttons appear on hover",
              },
            ],
          },
          {
            tabTitle: "Account View",
            imageSrcState1: "story1-chat-account-state1.png",
            imageSrcState2: "story1-chat-account-state2.png",
            markers: [
              {
                note: "Marker 1 на Account View",
                text: "Dynamic account information loading",
              },
              {
                note: "Marker 2 на Account View",
                text: "Interactive controls with state feedback",
              },
            ],
          },
        ],
      },
      {
        sectionTag: "Adaptive Interface Elements",
        heading: "Contextual Intelligence",

        textBefore: "Our system intelligently adapts to user context, providing relevant information and actions at the right moment. Each interaction is enhanced with smart suggestions and dynamic content that responds to user behavior.",

        // Медиа: tabbed-img с двумя состояниями (state1/state2)
        mediaLabel: "Context-aware interface features",

        tabs: [
          {
            tabTitle: "Context Recognition",
            imageSrcState1: "story1-chat-context-state1.png",
            imageSrcState2: "story1-chat-context-state2.png",
            markers: [
              {
                note: "Marker 1 на Context Recognition",
                text: "AI-powered context detection adapts interface elements",
              },
            ],
          },
          {
            tabTitle: "Ticket Management",
            imageSrcState1: "story1-chat-ticket-state1.png",
            imageSrcState2: "story1-chat-ticket-state2.png",
            markers: [
              {
                note: "Marker 1 на Ticket Management",
                text: "Smart ticket suggestions based on user behavior",
              },
            ],
          },
          {
            tabTitle: "Smart Linking",
            imageSrcState1: "story1-chat-link2-state1.png",
            imageSrcState2: "story1-chat-link2-state2.png",
            markers: [
              {
                note: "Marker 1 на Smart Linking",
                text: "Intelligent relationship detection between entities",
              },
            ],
          },
        ],
      },
    ],
  },
};
