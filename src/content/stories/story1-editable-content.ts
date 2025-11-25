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
        heading: "Why Does This Feel Like Solving a Case?",

        // Текст ДО медиа
        textBefore: "A rapidly growing SaaS company faced critical user engagement issues despite having a solid product. Their bounce rate hit 67%, with only 23% adopting key features. The mobile experience was particularly weak, converting at just 8%.",

        // Медиа: image - story1-domain-tree.png
        mediaLabel: "Reconciliation Domain Map",

        // Маркеры для этого изображения
        markers: [
          {
            note: "1.1.1 — ОСТАВИТЬ",
            text: "Users must grasp multiple subdomains to resolve problems.",
          },
          {
            note: "1.1.2 — ДОБАВИТЬ новый маркер",
            text: "The correct entry point for resolving an issue is rarely obvious.",
          },
        ],
      },
      {
        sectionTag: "Global Product Research",
        heading: "Spotting the Patterns Hidden Across Regions",

        textBefore: "The platform processes over 2.5 million transactions daily across 50+ enterprise clients, handling reconciliation for accounts ranging from $10M to $2B in monthly volume. Our AI models maintain 99.7% accuracy while reducing processing time from hours to minutes.",

        // Медиа: layered-cards (3 изображения)
        // story1-scale-1.png (center), story1-scale-2.png (left), story1-scale-3.png (right)
        mediaLabel: "Scale & Research Highlights",

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
        heading: "Let's Blend Natural Language With Serious Data Tasks",

        textBefore: "Our hybrid approach seamlessly integrates AI-powered conversational interfaces with traditional UI components. Users can switch between chat-based interactions and classic forms based on their preference and task complexity, ensuring flexibility without sacrificing efficiency.",

        // Медиа: tabbed-video (2 вкладки)
        // story1-ai-flow.mp4, story1-classic-flow.mp4
        mediaLabel: "Conversational and Classic Workflows",
      },
      {
        sectionTag: "Data Visualization",
        heading: "Flowing Smoothly From Conversation to Full Data View",

        textBefore: "Through multiple design iterations, we refined the visual language to balance clarity with sophistication. Each iteration brought us closer to a design that feels both approachable and professional.",

        // Медиа: tabbed-img (2 версии с маркерами)
        mediaLabel: "Chat–Full View Linking",

        tabs: [
          {
            tabTitle: "Static Data",
            note: "ПЕРЕИМЕНОВАТЬ таб: Version 1 → Static Data",
            imageSrc: "story1-data-1-1.png",
            markers: [
              {
                note: "2.1.1 — новый текст",
                text: "User can dive from the summary view into a full-screen data snapshot.",
              },
              {
                note: "2.1.2 — новый текст",
                text: "Classic UI features like filters help users navigate large data sets.",
              },
              {
                note: "2.1.3 — новый текст",
                text: "After reviewing the data, users can reference it and return to the chat.",
              },
            ],
          },
          {
            tabTitle: "Interactive Mode",
            note: "ПЕРЕИМЕНОВАТЬ таб: Version 2 → Interactive Mode",
            imageSrc: "story1-data-1-2.png",
            markers: [
              {
                note: "2.1.4 — новый текст",
                text: "User can dive from the summary view into a full-screen mode to perform actions.",
              },
              {
                note: "2.1.5 — новый текст",
                text: "Users can perform key actions directly within the chat or in the classic UI.",
              },
              {
                note: "2.1.6 — ОСТАВИТЬ",
                text: "After completing actions, the user can return to the conversation.",
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
        mediaLabel: "Universal Input & Output Elements",
      },
      {
        sectionTag: "Core AI Features",
        heading: "The Project-Specific Chat Features",

        textBefore: "Our chat interface demonstrates sophisticated state management with smooth transitions between different interaction states. Each state change provides clear visual feedback to guide users through their workflow.",

        // Медиа: tabbed-img с двумя состояниями (state1/state2)
        mediaLabel: "Chat UI Patterns",

        tabs: [
          {
            tabTitle: "Quick Actions",
            note: "2.2.0 — ДОБАВИТЬ новый первый таб",
            imageSrcState1: "ТРЕБУЕТСЯ_НОВОЕ_ИЗОБРАЖЕНИЕ",
            imageSrcState2: "ТРЕБУЕТСЯ_НОВОЕ_ИЗОБРАЖЕНИЕ",
            markers: [
              {
                note: "2.2.0 — новый маркер",
                text: "Most frequent requests are available in one click.",
              },
            ],
          },
          {
            tabTitle: "Chat History",
            note: "2.2.1-2.2.2 — изменения в маркерах",
            imageSrcState1: "story1-chat-history-state1.png",
            imageSrcState2: "story1-chat-history-state2.png",
            markers: [
              {
                note: "2.2.1 — УДАЛИТЬ этот маркер полностью",
                text: "[УДАЛИТЬ] Real-time message updates with smooth transitions",
                action: "DELETE",
              },
              {
                note: "2.2.2 — ОСТАВИТЬ",
                text: "Context and attachments help users quickly find the right conversation in the history.",
              },
            ],
          },
          {
            tabTitle: "Adding Context",
            note: "ПЕРЕИМЕНОВАТЬ таб: Account View → Adding Context",
            imageSrcState1: "story1-chat-account-state1.png",
            imageSrcState2: "story1-chat-account-state2.png",
            markers: [
              {
                note: "2.2.3 — ОСТАВИТЬ",
                text: "Users can add context in multiple ways.",
              },
              {
                note: "2.2.4 — УДАЛИТЬ этот маркер полностью",
                text: "[УДАЛИТЬ] Interactive controls with state feedback",
                action: "DELETE",
              },
            ],
          },
        ],
      },
      {
        sectionTag: "Context Input",
        heading: "Flexible Ways to Add Context",

        textBefore: "Our system intelligently adapts to user context, providing relevant information and actions at the right moment. Each interaction is enhanced with smart suggestions and dynamic content that responds to user behavior.",

        // Медиа: tabbed-img с двумя состояниями (state1/state2)
        mediaLabel: "Users may need a wide range of different context types.",

        tabs: [
          {
            tabTitle: "Add from List",
            note: "ПЕРЕИМЕНОВАТЬ таб: Context Recognition → Add from List",
            imageSrcState1: "story1-chat-context-state1.png",
            imageSrcState2: "story1-chat-context-state2.png",
            markers: [
              {
                note: "2.3.1 — ОСТАВИТЬ",
                text: "User can add context directly from a predefined list.",
              },
            ],
          },
          {
            tabTitle: "Search by Details",
            note: "ПЕРЕИМЕНОВАТЬ таб: Ticket Management → Search by Details",
            imageSrcState1: "story1-chat-ticket-state1.png",
            imageSrcState2: "story1-chat-ticket-state2.png",
            markers: [
              {
                note: "2.3.2 — ОСТАВИТЬ",
                text: "User can search for specific context types through the list.",
              },
            ],
          },
          {
            tabTitle: "Added Context",
            note: "ПЕРЕИМЕНОВАТЬ таб: Smart Linking → Added Context",
            imageSrcState1: "story1-chat-link2-state1.png",
            imageSrcState2: "story1-chat-link2-state2.png",
            markers: [
              {
                note: "2.3.3 — ОСТАВИТЬ",
                text: "After adding context, users can see details without opening external systems.",
              },
            ],
          },
        ],
      },
    ],
  },
};
