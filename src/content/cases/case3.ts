export const case3Content = {
  background: {
    heading: {
      main: 'Background',
      subtitle: undefined,
    },
    sections: [
      {
        textBefore: 'An e-commerce platform with 2M users was losing customers to modernized competitors. Load times hit 4.2s desktop and 8.4s mobile. Despite 45% mobile traffic, it generated only 12% revenue. App Store ratings fell to 2.8 stars.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop',
          },
        },
        textAfter: 'They\'d lost 4.2% market share, dropping from #2 to #7. Cart abandonment reached 73%, NPS hit -12. An unmaintainable codebase made releases take 12+ weeks. The board\'s ultimatum: modernize or face acquisition.',
      },
      {
        media: {
          type: 'image' as const,
          props: {
            imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop',
          },
        },
        textAfter: 'Complete replatforming was needed—the monolithic architecture couldn\'t scale and lacked testing. Migration had to happen without disrupting 2M active users while maintaining SEO driving 40% of traffic. Timeline: six months to prove improvement.',
      },
    ],
  },

  audit: {
    heading: {
      main: 'UX Audit',
      subtitle: undefined,
    },
    sections: [
      {
        heading: {
          main: 'Task',
          subtitle: undefined,
        },
        textBefore: 'The e-commerce platform suffered from severe usability issues that were driving customers away. Complex navigation made product discovery frustrating, the checkout flow had 7+ steps causing massive cart abandonment, and mobile experience was broken with tiny buttons and unresponsive layouts. Performance was abysmal with 8+ second load times on mobile, causing users to leave before pages even loaded.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: '/images/case3_task.png',
          },
        },
      },
      {
        heading: {
          main: 'Building the Base',
          subtitle: undefined,
        },
        textBefore: 'Conducted extensive usability testing with 30+ participants and analyzed top 10 competitors to identify industry best practices. Heat maps revealed friction points, scroll depth analytics showed content discovery issues, and competitor analysis identified key opportunities for differentiation in navigation, checkout flows, and mobile experience.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: '/images/case3_docs.png',
          },
        },
      },
      {
        heading: {
          main: 'Final Report',
          subtitle: undefined,
        },
        textBefore: 'Delivered comprehensive UX audit report with prioritized recommendations across 5 key areas: navigation & IA, product discovery, checkout optimization, mobile experience, and performance. Each recommendation included severity rating, estimated impact, implementation effort, and supporting data from user testing. Created detailed roadmap for phased implementation aligned with business priorities.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: '/images/case3_rep2.png',
          },
        },
        textAfter: 'The audit findings provided a clear foundation for the redesign phase. Armed with data-driven insights and validated recommendations, the team was ready to transform the platform from a frustrating experience into an intuitive, high-performing e-commerce solution.',
      },
    ],
  },

  process: {
    heading: {
      main: 'Process',
      subtitle: undefined,
    },
    sections: [
      {
        textBefore: 'Gradual migration allowed business continuity while rebuilding. We audited 47 page templates, prioritized revenue-driving pages, and set targets: 75% faster loads, 100% mobile conversion increase, Lighthouse scores above 95.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&h=900&fit=crop',
          },
        },
        textAfter: 'A design system with 142 components provided consistency. Navigation restructured through user testing reduced clicks-to-product from 4.2 to 2.1. Mobile got touch-optimized interactions and streamlined checkout. A/B tests validated every decision.',
      },
      {
        media: {
          type: 'image' as const,
          props: {
            imageSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop',
          },
        },
        textAfter: 'Vue 3 with SSG, aggressive caching, and code splitting optimized performance. API-first architecture separated frontend from backend. 87% test coverage ensured stability. Rollout took 16 weeks, maintaining SEO and 100% feature parity.',
      },
    ],
  },

  redesign: {
    heading: {
      main: 'App Redesign',
      subtitle: undefined,
    },
    sections: [
      {
        heading: {
          main: 'Home Page',
          subtitle: undefined,
        },
        textBefore: 'Redesigned the homepage with a clean, modern aesthetic that prioritizes product discovery and creates clear visual hierarchy. Implemented large hero imagery, featured product carousels, and category navigation that guides users naturally through the experience. Reduced clutter by 60%, improved above-the-fold conversion triggers, and created a mobile-first responsive layout that adapts beautifully across all screen sizes.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop',
          },
        },
      },
      {
        heading: {
          main: 'Summary View',
          subtitle: undefined,
        },
        textBefore: 'Completely reimagined the product listing and search results pages to make browsing effortless. Introduced smart filtering with faceted search, infinite scroll with lazy loading for performance, and improved product cards with better imagery and quick-view functionality. Added persistent filters, sorting options, and comparison features that reduced time to find products by 73%.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop',
          },
        },
      },
      {
        heading: {
          main: 'Order View',
          subtitle: undefined,
        },
        textBefore: 'Streamlined the checkout process from 7+ steps down to a single-page checkout with progressive disclosure. Implemented smart form validation, guest checkout option, and integrated payment methods including Apple Pay and Google Pay. Added order tracking, saved addresses, and one-click reorder functionality that reduced checkout time from 4.2 minutes to under 60 seconds.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&h=900&fit=crop',
          },
        },
      },
    ],
  },

  conclusion: {
    heading: {
      main: 'Conclusion',
      subtitle: undefined,
    },
    sections: [
      {
        textBefore: 'The comprehensive redesign transformed the platform from a struggling e-commerce experience into a high-performing solution. Load times dropped 79%, cart abandonment fell from 73% to 34%, and revenue increased 142% in six months. Within 12 months, the user base grew from 2M to 4.2M users, the platform moved from #7 to #2 in market rankings, and won Awwwards Site of the Day while being featured in TechCrunch and Smashing Magazine.',
      },
    ],
  },
}
