const h = (main: string, sectionTag?: string) => ({ main, sectionTag });
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
          "Why Does This Feel Like Solving a Case?",
          "Account Reconciliation Specifics"
        ),
        textBefore:
          "Users spent significant time verifying whether transactions were reconciled correctly and investigating issues before deciding what action to take.",
        media: img(
          "/images/story1-domain-tree.png",
          "Reconciliation Domain Map",
          [
            {
              position: { x: 41.21, y: 26.76 },
              text: "Users must grasp multiple subdomains to resolve problems.",
              buttonColor: "#9B4AE2",
            },
            {
              position: { x: 58.79, y: 73.24 },
              text: "The correct entry point for resolving an issue is rarely obvious.",
              buttonColor: "#9B4AE2",
            },
          ]
        ),
      },
      {
        heading: h(
          "Spotting the Patterns Hidden Across Regions",
          "Global Product Research"
        ),
        textBefore:
          "I partnered with product and engineering teams to identify shared problems across regions and understand which improvements were feasible technically.",
        media: cards(
          "/images/story1-scale-2.png",
          "/images/story1-scale-1.png",
          "/images/story1-scale-3.png",
          "Scale & Research Highlights",
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
          "Let's Blend Natural Language With Serious Data Tasks",
          "Conversational & Classic UI"
        ),
        textBefore:
          "Since the AI layer extended an existing dashboard, the goal was to integrate both experiences seamlessly, using natural language to support complex data tasks.",
        media: {
          type: "tabbed-video",
          props: {
            mediaLabel: "Conversational and Classic Workflows",
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
          "Flowing Smoothly From Conversation to Full Data View",
          "Data Visualization"
        ),
        textBefore:
          "The challenge was enabling smooth transitions between chat and large-scale data views while keeping high-volume datasets clear and easy to explore.",
        media: {
          type: "tabbed-img",
          props: {
            mediaLabel: "Chat–Full View Linking",
            defaultButtonColor: "#9B4AE2",
            tabs: [
              {
                title: "Static Data",
                imageSrc: "/images/story1-data-1-1.png",
                alt: "Static data view",
                markers: [
                  {
                    position: { x: 32.93, y: 71.71 },
                    text: "User can dive from the summary view into a full-screen data snapshot.",
                  },
                  {
                    position: { x: 96.01, y: 10.66 },
                    text: "Classic UI features like filters help users navigate large data sets.",
                  },
                  {
                    position: { x: 57.65, y: 10.66 },
                    text: "After reviewing the data, users can reference it and return to the chat.",
                  },
                ],
              },
              {
                title: "Interactive Mode",
                imageSrc: "/images/story1-data-1-2.png",
                alt: "Interactive mode view",
                markers: [
                  {
                    position: { x: 46.57, y: 62.12 },
                    text: "User can dive from the summary view into a full-screen mode to perform actions.",
                  },
                  {
                    position: { x: 90.02, y: 59.11 },
                    text: "Users can perform key actions directly within the chat or in the classic UI.",
                  },
                  {
                    position: { x: 57.81, y: 9.06 },
                    text: "After completing actions, the user can return to the conversation.",
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
          "Different teams shipped different models, so I defined shared principles to maintain consistency across evolving inputs and product components.",
        media: {
          type: "parallax",
          props: {
            image1: "/images/story1-framework-1.png",
            image2: "/images/story1-framework-2.png",
            image3: "/images/story1-framework-3.png",
            mediaLabel: "Universal Input & Output Elements",
          },
        },
      },
      {
        heading: h("The Project-Specific Chat Features", "Core AI Features"),
        textBefore:
          "Users had specific mental models for how they searched and reviewed their work, which influenced how chat history and prompt patterns needed to function.",
        media: {
          type: "tabbed-img",
          props: {
            mediaLabel: "Chat UI Patterns",
            defaultButtonColor: "#9B4AE2",
            maxWidth: "1200px",
            borderWidth: "2px",
            borderColor: "#000000",
            borderRadius: "15px",
            tabs: [
              {
                title: "Quick Actions",
                imageSrc: "/images/story1-chat-quick-state1.png",
                imageSrcState2: "/images/story1-chat-quick-state2.png",
                alt: "Quick actions interface",
                markers: [
                  {
                    position: { x: 41.3, y: 66.44 },
                    text: "Most frequent requests are available in one click.",
                  },
                ],
              },
              {
                title: "Chat History",
                imageSrc: "/images/story1-chat-history-state1.png",
                imageSrcState2: "/images/story1-chat-history-state2.png",
                alt: "Chat history interface",
                markers: [
                  {
                    position: { x: 75.08, y: 77.46 },
                    text: "Context and attachments help users quickly find the right conversation in the history.",
                  },
                ],
              },
              {
                title: "Adding Context",
                imageSrc: "/images/story1-chat-account-state1.png",
                imageSrcState2: "/images/story1-chat-account-state2.png",
                alt: "Adding context view",
                markers: [
                  {
                    position: { x: 30.18, y: 56.04 },
                    text: "Users can add context in multiple ways.",
                  },
                ],
              },
            ],
          },
        },
      },
      {
        heading: h("Flexible Ways to Add Context", "Context Input"),
        textBefore:
          "Most user requests depended on structured data rather than text, so I focused on making context sharing feel as natural as handing information to a colleague.",
        media: {
          type: "tabbed-img",
          props: {
            mediaLabel:
              "Users may need a wide range of different context types.",
            defaultButtonColor: "#9B4AE2",
            maxWidth: "1200px",
            borderWidth: "2px",
            borderColor: "#000000",
            borderRadius: "15px",
            tabs: [
              {
                title: "Add from List",
                imageSrc: "/images/story1-chat-context-state1.png",
                imageSrcState2: "/images/story1-chat-context-state2.png",
                alt: "Add from list interface",
                markers: [
                  {
                    position: { x: 41.97, y: 56.8 },
                    text: "User can add context directly from a predefined list.",
                  },
                ],
              },
              {
                title: "Search by Details",
                imageSrc: "/images/story1-chat-ticket-state1.png",
                imageSrcState2: "/images/story1-chat-ticket-state2.png",
                alt: "Search by details view",
                markers: [
                  {
                    position: { x: 56.27, y: 60.83 },
                    text: "User can search for specific context types through the list.",
                  },
                ],
              },
              {
                title: "Added Context",
                imageSrc: "/images/story1-chat-link2-state1.png",
                imageSrcState2: "/images/story1-chat-link2-state2.png",
                alt: "Added context interface",
                markers: [
                  {
                    position: { x: 57.5, y: 68 },
                    text: "After adding context, users can see details without opening external systems.",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
};
