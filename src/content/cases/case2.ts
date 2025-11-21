export const case2Content = {
  background: {
    heading: {
      main: 'Background',
      subtitle: undefined,
    },
    sections: [
      {
        heading: {
          main: 'Leader in Employee Communications',
          subtitle: 'About Smarp',
        },
        textBefore: 'Smarp is the leading employee communication platform trusted by global enterprises including Google, Coca-Cola, and L\'Oréal. With over 50,000 active users across Fortune 500 companies, Smarp empowers organizations to connect teams, share knowledge, and build stronger company culture.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: '/src/assets/images/p2-3@2x.png',
            mediaLabel: 'Side-by-Side Comparison of the Old and New Home Screens',
          },
        },
      },
      {
        heading: {
          main: 'Desktop-First Mobile Experience',
          subtitle: 'Challenge',
        },
        textBefore: 'The previous design was built on legacy patterns that no longer served modern workplace needs. Cluttered interfaces, inconsistent components, and outdated visual language created friction across the entire user experience. Navigation was confusing, key features were buried, and the mobile experience was an afterthought.',
        media: {
          type: 'layered-cards' as const,
          props: {
            imageLeft: '/src/assets/images/case2_challenge_1.png',
            imageCenter: '/src/assets/images/case2_challenge_2.png',
            imageRight: '/src/assets/images/case2_challenge_3.png',
            speedLeft: 0.5,
            speedCenter: 1.0,
            speedRight: 1.5,
            zIndexLeft: 2,
            zIndexCenter: 1,
            zIndexRight: 3,
            mediaLabel: 'Overview of Issues in the Previous Mobile App',
          },
        },
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
        heading: {
          main: 'Best Practices & User Interviews',
          subtitle: 'Discovery',
        },
        textBefore: 'Through extensive user research with employees across different departments and seniority levels, we identified key pain points in the existing communication flow. Conducted stakeholder interviews, competitive analysis, and analyzed usage analytics to understand how teams were actually using the platform versus how we intended them to use it.',
        media: {
          type: 'layered-cards' as const,
          props: {
            imageLeft: '/src/assets/images/case2_discovery_1.png',
            imageCenter: '/src/assets/images/case2_discovery_2.png',
            imageRight: '/src/assets/images/case2_discovery_3.png',
            speedLeft: 0.5,
            speedCenter: 1.0,
            speedRight: 1.5,
            mediaLabel: 'Sample Documents From the Initial Discovery Stage',
          },
        },
      },
      {
        heading: {
          main: 'Defining What Matters Most for Employee Comms',
          subtitle: 'Ideation & Prioritization',
        },
        textBefore: 'Created low-fidelity wireframes to explore new navigation patterns and information architecture. Iterated rapidly through multiple concepts, testing different approaches to content organization, feature discoverability, and user flows. Collaborated closely with product managers and engineers to ensure technical feasibility while pushing for better UX.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: '/src/assets/images/case2_wireframes.png',
            mediaLabel: 'Wireframes Exploring Different Solution Concepts',
          },
        },
      },
      {
        heading: {
          main: 'Polishing the UX of the New Flows',
          subtitle: 'Prototype Testing',
        },
        textBefore: 'Built high-fidelity interactive prototypes and conducted usability testing sessions with 25+ users across different personas. Gathered feedback on key workflows, refined interaction patterns, and validated design decisions through A/B testing. Iteratively improved the design based on real user behavior and feedback before final implementation.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop',
            mediaLabel: 'Interactive Prototype Used During User Testing',
          },
        },
      },
    ],
  },

  design: {
    heading: {
      main: 'Final Design',
      subtitle: undefined,
    },
    sections: [
      {
        heading: {
          main: 'Enhanced Content Options for Employees and Community Managers',
          subtitle: 'Home Screen',
        },
        textBefore: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: '/src/assets/images/case2_final1.png',
            mediaLabel: 'Home screen featuring a slider, an interactive widget, articles, company events, channels, personal recommendations, and curated content for key moments.',
          },
        },
      },
      {
        heading: {
          main: 'Supporting New Content Types and Improving UX',
          subtitle: 'Internal Screens',
        },
        textBefore: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: '/src/assets/images/case2_final2.png',
            mediaLabel: 'Channel and search result screens updated to support the new features.',
          },
        },
      },
    ],
  },
}
