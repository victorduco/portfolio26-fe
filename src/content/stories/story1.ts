const h = (main: string, subtitle?: string) => ({ main, subtitle });
const cards = (
  l: string,
  c: string,
  r: string,
  label: string,
  markers: any[] = []
) => ({
  type: "layered-cards",
  props: {
    imageLeft: l,
    imageCenter: c,
    imageRight: r,
    zIndexLeft: 2,
    zIndexCenter: 3,
    zIndexRight: 1,
    mediaLabel: label,
    markers: markers,
    defaultButtonColor: "#4A90E2",
  },
});
const img = (src: string, label: string, markers: any[] = [], opts = {}) => ({
  type: "image",
  props: {
    imageSrc: src,
    mediaLabel: label,
    markers: markers,
    defaultButtonColor: "#4A90E2",
    ...opts,
  },
});

export const story1Content = {
  background: {
    heading: h("Background"),
    sections: [
      {
        heading: h(
          "Something Went Wrong, Somehow",
          "Account Reconciliation Specifics"
        ),
        textBefore:
          "A rapidly growing SaaS company faced critical user engagement issues despite having a solid product. Their bounce rate hit 67%, with only 23% adopting key features. The mobile experience was particularly weak, converting at just 8%.",
        media: img(
          "/images/story1-domain-tree.png",
          "Users must grasp multiple subdomains to resolve problems.",
          [
            {
              position: { x: 41.21, y: 26.76 },
              text: "Bounce rate of 67% indicates major UX issues in the onboarding flow",
              buttonColor: "#9B4AE2",
            },
          ]
        ),
      },
      {
        heading: h(
          "Identifying Cross-Regional Patterns in User Workflows",
          "Global Product Research"
        ),
        textBefore:
          "The platform processes over 2.5 million transactions daily across 50+ enterprise clients, handling reconciliation for accounts ranging from $10M to $2B in monthly volume. Our AI models maintain 99.7% accuracy while reducing processing time from hours to minutes.",
        media: cards(
          "/images/story1-scale-2.png",
          "/images/story1-scale-1.png",
          "/images/story1-scale-3.png",
          "Research Summary and Business Context",
          []
        ),
      },
    ],
  },
  solution: {
    heading: h("Solution"),
    sections: [
      {
        heading: h(
          "Pairing Natural Dialogue with Heavy Data Workflows",
          "Conversational & Classic UI"
        ),
        textBefore:
          "Our hybrid approach seamlessly integrates AI-powered conversational interfaces with traditional UI components. Users can switch between chat-based interactions and classic forms based on their preference and task complexity, ensuring flexibility without sacrificing efficiency.",
        media: {
          type: "tabbed-video",
          props: {
            mediaLabel:
              "Two workflows, one unified experience. Users pick what fits best.",
            tabs: [
              {
                title: "AI-Based User Flow",
                videoSrc: "/videos/story1-ai-flow.mp4",
              },
              {
                title: "Classic User Flow",
                videoSrc: "/videos/story1-classic-flow.mp4",
              },
            ],
          },
        },
      },
      {
        heading: h(
          "Helping Users See What Truly Matters in the Data",
          "Data Visualization"
        ),
        textBefore:
          "Through multiple design iterations, we refined the visual language to balance clarity with sophistication. Each iteration brought us closer to a design that feels both approachable and professional.",
        media: {
          type: "tabbed-img",
          props: {
            mediaLabel: "Four stages of visual refinement",
            defaultButtonColor: "#9B4AE2",
            tabs: [
              {
                title: "Version 1",
                imageSrc: "/images/story1-data-1-1.png",
                alt: "Initial design concept",
                markers: [
                  {
                    position: { x: 22.62, y: 0 },
                    text: "Initial navigation concept with basic structure",
                  },
                  {
                    position: { x: 76.5, y: 0 },
                    text: "Early content layout experimentation",
                  },
                ],
              },
              {
                title: "Version 2",
                imageSrc: "/images/story1-data-1-2.png",
                alt: "Refined layout",
                markers: [
                  {
                    position: { x: 50.19, y: 36.08 },
                    text: "Simplified color palette for better readability",
                  },
                ],
              },
            ],
          },
        },
      },
      {
        heading: h("Interactive State Management", "Dynamic UI Feedback"),
        textBefore:
          "Our chat interface demonstrates sophisticated state management with smooth transitions between different interaction states. Each state change provides clear visual feedback to guide users through their workflow.",
        media: {
          type: "tabbed-img",
          props: {
            mediaLabel: "Chat interface state transitions",
            defaultButtonColor: "#9B4AE2",
            maxWidth: "1200px",
            borderWidth: "2px",
            borderColor: "#000000",
            borderRadius: "15px",
            tabs: [
              {
                title: "Chat History",
                imageSrc: "/images/story1-chat-history-state1.png",
                imageSrcState2: "/images/story1-chat-history-state2.png",
                alt: "Chat history interface",
                markers: [
                  {
                    position: { x: 67.73, y: 14.51 },
                    text: "Real-time message updates with smooth transitions",
                  },
                  {
                    position: { x: 75.08, y: 77.46 },
                    text: "Context-aware action buttons appear on hover",
                  },
                ],
              },
              {
                title: "Account View",
                imageSrc: "/images/story1-chat-account-state1.png",
                imageSrcState2: "/images/story1-chat-account-state2.png",
                alt: "Account management view",
                markers: [
                  {
                    position: { x: 30.08, y: 59.24 },
                    text: "Dynamic account information loading",
                  },
                  {
                    position: { x: 52, y: 80.94 },
                    text: "Interactive controls with state feedback",
                  },
                ],
              },
            ],
          },
        },
      },
      {
        heading: h("Contextual Intelligence", "Adaptive Interface Elements"),
        textBefore:
          "Our system intelligently adapts to user context, providing relevant information and actions at the right moment. Each interaction is enhanced with smart suggestions and dynamic content that responds to user behavior.",
        media: {
          type: "tabbed-img",
          props: {
            mediaLabel: "Context-aware interface features",
            defaultButtonColor: "#9B4AE2",
            maxWidth: "1200px",
            borderWidth: "2px",
            borderColor: "#000000",
            borderRadius: "15px",
            tabs: [
              {
                title: "Context Recognition",
                imageSrc: "/images/story1-chat-context-state1.png",
                imageSrcState2: "/images/story1-chat-context-state2.png",
                alt: "Context recognition interface",
                markers: [
                  {
                    position: { x: 42.14, y: 59 },
                    text: "AI-powered context detection adapts interface elements",
                  },
                ],
              },
              {
                title: "Ticket Management",
                imageSrc: "/images/story1-chat-ticket-state1.png",
                imageSrcState2: "/images/story1-chat-ticket-state2.png",
                alt: "Ticket management view",
                markers: [
                  {
                    position: { x: 56.27, y: 60.83 },
                    text: "Smart ticket suggestions based on user behavior",
                  },
                ],
              },
              {
                title: "Smart Linking",
                imageSrc: "/images/story1-chat-link2-state1.png",
                imageSrcState2: "/images/story1-chat-link2-state2.png",
                alt: "Smart linking interface",
                markers: [
                  {
                    position: { x: 57.5, y: 68 },
                    text: "Intelligent relationship detection between entities",
                  },
                ],
              },
            ],
          },
        },
      },
      {
        heading: h(
          "Consistent Experience Across Variable Inputs",
          "Product Vision & Design System"
        ),
        textBefore:
          "We developed a comprehensive AI framework that combines conversational design with intelligent automation. The system uses natural language processing to understand user intent and provides contextual assistance throughout the reconciliation workflow, reducing the learning curve by 70%.",
        media: {
          type: "parallax",
          props: {
            image1: "/images/story1-framework-1.png",
            image2: "/images/story1-framework-2.png",
            image3: "/images/story1-framework-3.png",
            mediaLabel: "Input & Output Elements for Chat and Classic UI",
          },
        },
      },
    ],
  },
};
