export const case3Content = {
  background: {
    heading: {
      main: "Background",
      subtitle: undefined,
    },
    sections: [
      {
        heading: {
          main: "Harsh Conditions, Critical Actions",
          subtitle: "User Challenge",
        },
        textBefore:
          "The platform faced critical challenges across multiple dimensions. Users struggled with fragmented workflows, inconsistent interfaces, and a steep learning curve that resulted in low feature adoption. The mobile experience was particularly problematic, with conversion rates significantly lagging behind desktop. These issues compounded into a broader problem of user retention and engagement.",
        media: {
          type: 'layered-cards' as const,
          props: {
            imageLeft: '/images/case3-challenge-1.png',
            imageCenter: '/images/case3-challenge-2.png',
            imageRight: '/images/case3-challenge-3.png',
            speedLeft: 0.5,
            speedCenter: 1.0,
            speedRight: 1.5,
            zIndexLeft: 2,
            zIndexCenter: 1,
            zIndexRight: 3,
            mediaLabel: 'Typical field conditions: rain, safety equipment, and a tablet with a protective screen.',
          },
        },
      },
      {
        heading: {
          main: "Previous Design",
          subtitle: undefined,
        },
        textBefore:
          "The e-commerce platform suffered from severe usability issues that were driving customers away. Complex navigation made product discovery frustrating, the checkout flow had 7+ steps causing massive cart abandonment, and mobile experience was broken with tiny buttons and unresponsive layouts. Performance was abysmal with 8+ second load times on mobile, causing users to leave before pages even loaded.",
        media: {
          type: "image" as const,
          props: {
            imageSrc: "/images/case3-task.png",
            mediaLabel: "Previous version: Home screen, My Tasks (two views), and user profile.",
          },
        },
      },
    ],
  },

  audit: {
    heading: {
      main: "UX Audit",
      subtitle: undefined,
    },
    sections: [
      {
        heading: {
          main: "Building a Fact-Based Case for Change",
          subtitle: "User & Competitor Research",
        },
        textBefore:
          "Conducted extensive usability testing with 30+ participants and analyzed top 10 competitors to identify industry best practices. Heat maps revealed friction points, scroll depth analytics showed content discovery issues, and competitor analysis identified key opportunities for differentiation in navigation, checkout flows, and mobile experience.",
        media: {
          type: 'layered-cards' as const,
          props: {
            imageLeft: '/images/case3-ground-1.png',
            imageCenter: '/images/case3-ground-2.png',
            imageRight: '/images/case3-ground-3.png',
            speedLeft: 0.5,
            speedCenter: 1.0,
            speedRight: 1.5,
            zIndexLeft: 2,
            zIndexCenter: 1,
            zIndexRight: 3,
            mediaLabel: "Internal documentation samples: personas, best practices, and user testing of the previous design.",
          },
        },
      },
      {
        heading: {
          main: "Prioritized and Actionable Summary of UX Problems",
          subtitle: "UX Audit Report",
        },
        textBefore:
          "Delivered comprehensive UX audit report with prioritized recommendations across 5 key areas: navigation & IA, product discovery, checkout optimization, mobile experience, and performance. Each recommendation included severity rating, estimated impact, implementation effort, and supporting data from user testing. Created detailed roadmap for phased implementation aligned with business priorities.",
        media: {
          type: 'layered-cards' as const,
          props: {
            imageLeft: '/images/case3-audit-1.png',
            imageCenter: '/images/case3-audit-2.png',
            imageRight: '/images/case3-audit-3.png',
            speedLeft: 0.5,
            speedCenter: 1.0,
            speedRight: 1.5,
            zIndexLeft: 2,
            zIndexCenter: 1,
            zIndexRight: 3,
            mediaLabel: "Sample slides from the final report showing issues and solutions.",
          },
        },
        textAfter:
          "The audit findings provided a clear foundation for the redesign phase. Armed with data-driven insights and validated recommendations, the team was ready to transform the platform from a frustrating experience into an intuitive, high-performing e-commerce solution.",
      },
    ],
  },

  redesign: {
    heading: {
      main: "App Redesign",
      subtitle: undefined,
    },
    sections: [
      {
        heading: {
          main: "Keeping Only What Matters, Without Losing the Experience",
          subtitle: "Home Page",
        },
        textBefore:
          "A design system with 142 components provided consistency. Navigation restructured through user testing reduced clicks-to-product from 4.2 to 2.1. Mobile got touch-optimized interactions and streamlined checkout. A/B tests validated every decision.",
        media: {
          type: 'layered-cards' as const,
          props: {
            imageLeft: '/images/case3-home-1-1.png',
            imageCenter: '/images/case3-home-1-2.png',
            imageRight: '/images/case3-home-1-3.png',
            speedLeft: 0.5,
            speedCenter: 1.0,
            speedRight: 1.5,
            zIndexLeft: 2,
            zIndexCenter: 1,
            zIndexRight: 3,
            borderRadius: 25,
            mediaLabel: "The home screen adapts to the user's current situation, showing only what matters most.",
          },
        },
      },
      {
        textBefore:
          "The new interface introduced streamlined workflows that significantly reduced cognitive load. By consolidating related actions and providing contextual information at the right moment, users could accomplish tasks with fewer clicks and less mental effort. Progressive disclosure techniques ensured that advanced features remained accessible without overwhelming new users.",
        media: {
          type: "horizontalParallax" as const,
          props: {
            image1: "/images/case3-illustr-1.png",
            image2: "/images/case3-illustr-2.png",
            image3: "/images/case3-illustr-3.png",
            speed1: 1,
            speed2: 0.7,
            speed3: 1.3,
            height1: "33.33%",
            height2: "33.33%",
            height3: "33.33%",
            backgroundColor: "#f5f5f7",
            mediaLabel: "Illustration samples for different order types, statuses, and conditions.",
            alt: "Platform migration process",
          },
        },
      },
      {
        heading: {
          main: "Attention Goes to What Truly Matters",
          subtitle: "App Navigation",
        },
        textBefore:
          "Gradual migration allowed business continuity while rebuilding. We audited 47 page templates, prioritized revenue-driving pages, and set targets: 75% faster loads, 100% mobile conversion increase, Lighthouse scores above 95.",
        media: {
          type: 'layered-cards' as const,
          props: {
            imageLeft: '/images/case3-nav-1-1.png',
            imageCenter: '/images/case3-nav-1-2.png',
            imageRight: '/images/case3-nav-1-3.png',
            speedLeft: 0.5,
            speedCenter: 1.0,
            speedRight: 1.5,
            zIndexLeft: 2,
            zIndexCenter: 1,
            zIndexRight: 3,
            borderRadius: 25,
            mediaLabel: "Examples of visual hierarchy: (1) the menu stays low-priority; (2) notifications gain prominence only when something critical happens.",
          },
        },
      },
      {
        heading: {
          main: "Flatter Navigation With 50% Fewer Transitions",
          subtitle: "Order View",
        },
        textBefore:
          "Redesigned the homepage with a clean, modern aesthetic that prioritizes product discovery and creates clear visual hierarchy. Implemented large hero imagery, featured product carousels, and category navigation that guides users naturally through the experience. Reduced clutter by 60%, improved above-the-fold conversion triggers, and created a mobile-first responsive layout that adapts beautifully across all screen sizes.",
        media: {
          type: 'layered-cards' as const,
          props: {
            imageLeft: '/images/case3-order-1-1.png',
            imageCenter: '/images/case3-order-1-2.png',
            imageRight: '/images/case3-order-1-3.png',
            speedLeft: 0.5,
            speedCenter: 1.0,
            speedRight: 1.5,
            zIndexLeft: 2,
            zIndexCenter: 1,
            zIndexRight: 3,
            borderRadius: 25,
            mediaLabel: "Examples of order screens: main view, steps panel, and order overview.",
          },
        },
      },
      {
        textBefore:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        media: {
          type: 'layered-cards' as const,
          props: {
            imageLeft: '/images/case3-nav-2-1.png',
            imageCenter: '/images/case3-nav-2-2.png',
            imageRight: '/images/case3-nav-2-3.png',
            speedLeft: 0.5,
            speedCenter: 1.0,
            speedRight: 1.5,
            zIndexLeft: 2,
            zIndexCenter: 1,
            zIndexRight: 3,
            mediaLabel: "Multiple other improvements driven by insights from the research phase.",
          },
        },
      },
    ],
  },

  conclusion: {
    heading: {
      main: "Redesign Results",
      subtitle: undefined,
    },
    sections: [
      {
        textBefore:
          "The comprehensive redesign transformed the platform from a struggling e-commerce experience into a high-performing solution. Load times dropped 79%, cart abandonment fell from 73% to 34%, and revenue increased 142% in six months. Within 12 months, the user base grew from 2M to 4.2M users, the platform moved from #7 to #2 in market rankings, and won Awwwards Site of the Day while being featured in TechCrunch and Smashing Magazine.",
      },
    ],
  },
};
