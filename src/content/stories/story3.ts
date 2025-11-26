const h = (main: string, sectionTag?: string) => ({ main, sectionTag });
const cards = (
  l: string,
  c: string,
  r: string,
  label: string,
  opts = {},
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
    markers,
    ...opts,
  },
});
const img = (src: string, label: string, markers: any[] = []) => ({
  type: "image",
  props: { imageSrc: src, mediaLabel: label, markers },
});

export const story3Content = {
  background: {
    heading: h("Background"),
    sections: [
      {
        heading: h("Harsh Conditions, Critical Actions", "User Challenge"),
        textBefore:
          "Field operators work in harsh, high-pressure conditions where every step must follow strict procedures. They log actions, follow multi-stage instructions, and complete safety-critical tasks with almost no margin for error.",
        media: cards(
          "/images/story3-challenge-1.png",
          "/images/story3-challenge-3.png",
          "/images/story3-challenge-2.png",
          "Typical field conditions: rain, safety equipment, and a tablet with a protective screen.",
          {},
          [
            {
              targetImage: "left",
              position: { x: 91.11, y: 12.93 },
              text: "Example of the environments where the mobile app is used.",
              buttonColor: "#ca4034",
            },
            {
              targetImage: "center",
              position: { x: 51.59, y: 88.53 },
              text: "Enterprise devices often rely on outdated hardware and protective layers that impact usability.",
              buttonColor: "#ca4034",
            },
          ]
        ),
      },
      {
        heading: h("Previous Design"),
        textBefore:
          "As an external expert, I was brought in to evaluate the product objectively, identify core UX issues, and clarify what needed to change to make the app usable for field operators.",
        media: img(
          "/images/story3-task.png",
          "Previous version: Home screen, My Tasks (two views), and user profile.",
          [
            {
              position: { x: 39.8, y: 10.47 },
              text: "Previous home screen showed all information for all user types in one view.",
              buttonColor: "#ca4034",
            },
          ]
        ),
      },
    ],
  },
  audit: {
    heading: h("UX Audit"),
    sections: [
      {
        heading: h(
          "Building a Fact-Based Case for Change",
          "User & Competitor Research"
        ),
        textBefore:
          "I began by validating assumptions through user interviews, operational observations, and competitor analysis. My goal was to build a factual foundation for change, rooted in actual user behavior and real task patterns.",
        media: cards(
          "/images/story3-ground-1.png",
          "/images/story3-ground-3.png",
          "/images/story3-ground-2.png",
          "Internal documentation samples: personas, best practices, and user testing of the previous design.",
          {},
          [
            {
              targetImage: "center",
              position: { x: 77.6, y: 36.9 },
              text: "I conducted interviews with 12 users to understand their needs and workflows.",
              buttonColor: "#ca4034",
            },
            {
              targetImage: "right",
              position: { x: 50, y: 0 },
              text: "The document covers most companies in the market with structured UX data for each.",
              buttonColor: "#ca4034",
            },
          ]
        ),
      },
      {
        heading: h(
          "Prioritized and Actionable Summary of UX Problems",
          "UX Audit Report"
        ),
        textBefore:
          "For leadership, I delivered a highly structured audit highlighting the most critical UX issues and concrete, feasible fixes.",
        media: cards(
          "/images/story3-audit-1.png",
          "/images/story3-audit-3.png",
          "/images/story3-audit-2.png",
          "Sample slides from the final report showing issues and solutions.",
          {},
          [
            {
              targetImage: "center",
              position: { x: 88.87, y: 37.41 },
              text: "The final report is organized by user types with clear action points and examples.",
              buttonColor: "#ca4034",
            },
          ]
        ),
        textAfter:
          "Leadership quickly recognized the clarity and depth of the audit and decided to continue working with me on a full redesign of the application.",
      },
    ],
  },
  redesign: {
    heading: h("App Redesign"),
    sections: [
      {
        heading: h(
          "Keeping Only What Matters, Without Losing the Experience",
          "Home Page"
        ),
        textBefore:
          "I segmented the UX by user groups and focused the home experience on operators' real needs, keeping only essential information visible and removing distracting or irrelevant items from their workflow.",
        media: cards(
          "/images/story3-home-1-1.png",
          "/images/story3-home-1-3.png",
          "/images/story3-home-1-2.png",
          "The home screen adapts to the user's current situation, showing only what matters most.",
          { borderRadius: 25 },
          [
            {
              targetImage: "right",
              position: { x: 75.25, y: 12.84 },
              text: "The header, illustration and other elements adapt based on the user's context.",
              buttonColor: "#ca4034",
            },
          ]
        ),
      },
      {
        textBefore:
          "Because operators repeatedly encounter similar order patterns, I designed interactions that simplify these scenarios and make daily tasks feel smoother and more predictable.",
        media: {
          type: "horizontalParallax",
          props: {
            image1: "/images/story3-illustr-1.png",
            image2: "/images/story3-illustr-2.png",
            image3: "/images/story3-illustr-3.png",
            speed1: 1,
            speed2: 0.7,
            speed3: 1.3,
            height1: "33.33%",
            height2: "33.33%",
            height3: "33.33%",
            backgroundColor: "#f5f5f7",
            mediaLabel:
              "Illustration samples for different order types, statuses, and conditions.",
            alt: "Platform migration process",
          },
        },
      },
      {
        heading: h("Attention Goes to What Truly Matters", "App Navigation"),
        textBefore:
          "Navigation was rebuilt to spotlight critical tasks. Non-essential items were collapsed, and all interactive elements were intentionally large to support quick, confident use in challenging field conditions.",
        media: cards(
          "/images/story3-nav-1-1.png",
          "/images/story3-nav-1-3.png",
          "/images/story3-nav-1-2.png",
          "Examples of visual hierarchy: (1) the menu stays low-priority; (2) notifications gain prominence only when something critical happens.",
          { borderRadius: 25 },
          [
            {
              targetImage: "left",
              position: { x: 26.52, y: 50.41 },
              text: "All essential tools for Operators are surfaced on the home screen, with everything else collapsed into the menu.",
              buttonColor: "#ca4034",
            },
            {
              targetImage: "right",
              position: { x: 82.01, y: 28.45 },
              text: "Critical notifications are clearly highlighted.",
              buttonColor: "#ca4034",
            },
          ]
        ),
      },
      {
        heading: h(
          "Flatter Navigation With 50% Fewer Transitions",
          "Order View"
        ),
        textBefore:
          "Order pages now use a flattened structure that reduces transitions by half. Key information appears earlier, and navigation between task stages has become faster and more intuitive.",
        media: cards(
          "/images/story3-order-1-1.png",
          "/images/story3-order-1-3.png",
          "/images/story3-order-1-2.png",
          "Examples of order screens: main view, steps panel, and order overview.",
          { borderRadius: 25 },
          [
            {
              targetImage: "left",
              position: { x: 21.23, y: 85.9 },
              text: "Flat navigation structure reduced the number of required transitions and made moving across order details significantly faster.",
              buttonColor: "#ca4034",
            },
            {
              targetImage: "center",
              position: { x: 50, y: 0 },
              text: "Contextual guidance is embedded directly into the core workflow, helping operators stay confident without breaking focus.",
              buttonColor: "#ca4034",
            },
            {
              targetImage: "center",
              position: { x: 22.99, y: 83.81 },
              text: "Quick access to supplementary information is always available for cases where operators need additional context on the spot.",
              buttonColor: "#ca4034",
            },
            {
              targetImage: "center",
              position: { x: 80.54, y: 61.77 },
              text: "Comment creation and review are integrated into the main flow, eliminating detours and making communication effortless.",
              buttonColor: "#ca4034",
            },
            {
              targetImage: "right",
              position: { x: 24.32, y: 15.67 },
              text: "The overview screen consolidates all required information so users don't need to piece things together.",
              buttonColor: "#ca4034",
            },
          ]
        ),
      },
      {
        textBefore:
          "Smaller interaction enhancements across navigation and task flows collectively reduced cognitive load, helping operators stay focused on their demanding, safety-critical responsibilities.",
        media: cards(
          "/images/story3-nav-2-1.png",
          "/images/story3-nav-2-3.png",
          "/images/story3-nav-2-2.png",
          "Multiple other improvements driven by insights from the research phase."
        ),
      },
    ],
  },
};
