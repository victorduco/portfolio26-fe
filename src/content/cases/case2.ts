export const case2Content = {
  background: {
    heading: {
      main: 'Background',
      subtitle: undefined,
    },
    sections: [
      {
        heading: {
          main: 'Smarp — Leader in Employee Communications',
          subtitle: undefined,
        },
        textBefore: 'Smarp is the leading employee communication platform trusted by global enterprises including Google, Coca-Cola, and L\'Oréal. With over 50,000 active users across Fortune 500 companies, Smarp empowers organizations to connect teams, share knowledge, and build stronger company culture.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: '/src/assets/images/p2-3@2x.png',
          },
        },
      },
      {
        heading: {
          main: 'The Challenge — Outdated Design Holding Back Growth',
          subtitle: undefined,
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
          main: 'Discovery',
          subtitle: undefined,
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
          },
        },
      },
      {
        heading: {
          main: 'Wireframing',
          subtitle: undefined,
        },
        textBefore: 'Created low-fidelity wireframes to explore new navigation patterns and information architecture. Iterated rapidly through multiple concepts, testing different approaches to content organization, feature discoverability, and user flows. Collaborated closely with product managers and engineers to ensure technical feasibility while pushing for better UX.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: '/src/assets/images/case2_wireframes.png',
          },
        },
      },
      {
        heading: {
          main: 'Prototype Evaluation and Testing',
          subtitle: undefined,
        },
        textBefore: 'Built high-fidelity interactive prototypes and conducted usability testing sessions with 25+ users across different personas. Gathered feedback on key workflows, refined interaction patterns, and validated design decisions through A/B testing. Iteratively improved the design based on real user behavior and feedback before final implementation.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop',
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
        textBefore: 'The redesigned platform features a clean, modern interface with intuitive navigation and improved information hierarchy. We introduced a unified design system with consistent components, reimagined the mobile experience from the ground up, and streamlined key workflows to reduce friction.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: '/src/assets/images/case2_final1.png',
          },
        },
        textAfter: 'The new design emphasizes clarity, accessibility, and ease of use while maintaining the powerful functionality that enterprise teams depend on. Every element was carefully crafted to enhance user experience across all devices and use cases.',
      },
      {
        media: {
          type: 'image' as const,
          props: {
            imageSrc: '/src/assets/images/case2_final2.png',
          },
        },
      },
    ],
  },
}
