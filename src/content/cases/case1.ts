export const case1Content = {
  challenge: {
    heading: {
      main: 'User Challenge',
      subtitle: undefined,
    },
    sections: [
      {
        heading: {
          main: 'Something Went Wrong, Somehow',
          subtitle: 'Account Reconciliation Specifics',
        },
        textBefore: 'A rapidly growing SaaS company faced critical user engagement issues despite having a solid product. Their bounce rate hit 67%, with only 23% adopting key features. The mobile experience was particularly weak, converting at just 8%.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: '/images/case1-domain-tree.png',
            enableMagnifier: true,
            mediaLabel: 'Users must grasp multiple subdomains to resolve problems.',
          },
        },
      },
    ],
  },

  scale: {
    sections: [
      {
        heading: {
          main: 'Identifying Cross-Regional Patterns in User Workflows',
          subtitle: 'Global Product Research',
        },
        textBefore: 'The platform processes over 2.5 million transactions daily across 50+ enterprise clients, handling reconciliation for accounts ranging from $10M to $2B in monthly volume. Our AI models maintain 99.7% accuracy while reducing processing time from hours to minutes.',
        media: {
          type: 'layered-cards' as const,
          props: {
            imageLeft: '/images/case1-scale-1.png',
            imageCenter: '/images/case1-scale-2.png',
            imageRight: '/images/case1-scale-3.png',
            speedLeft: 0.5,
            speedCenter: 1.0,
            speedRight: 1.5,
            mediaLabel: 'Research Summary and Business Context',
          },
        },
      },
    ],
  },

  solution: {
    heading: {
      main: 'Solution',
      subtitle: undefined,
    },
    sections: [
      {
        heading: {
          main: 'Consistent Experience Across Variable Inputs',
          subtitle: 'Product Vision & Design System',
        },
        textBefore: 'We developed a comprehensive AI framework that combines conversational design with intelligent automation. The system uses natural language processing to understand user intent and provides contextual assistance throughout the reconciliation workflow, reducing the learning curve by 70%.',
        media: {
          type: 'parallax' as const,
          props: {
            image1: '/images/case1-framework-1.png',
            image2: '/images/case1-framework-2.png',
            image3: '/images/case1-framework-3.png',
            mediaLabel: 'Input & Output Elements for Chat and Classic UI',
          },
        },
      },
      {
        heading: {
          main: 'Pairing Natural Dialogue with Heavy Data Workflows',
          subtitle: 'Conversational & Classic UI',
        },
        textBefore: 'Our hybrid approach seamlessly integrates AI-powered conversational interfaces with traditional UI components. Users can switch between chat-based interactions and classic forms based on their preference and task complexity, ensuring flexibility without sacrificing efficiency.',
        media: {
          type: 'chaptered-video' as const,
          props: {
            videoSrc: '/videos/case1-chaptered-test.mp4',
            mediaLabel: 'Two workflows, one unified experience. Users pick what fits best.',
            chapterGroups: [
              {
                groupTitle: 'Interface Design',
                chapters: [
                  { title: 'Chat Interface', time: 0 },
                  { title: 'Form Interface', time: 3 },
                  { title: 'Hybrid Approach', time: 6 },
                  { title: 'Component Library', time: 9 },
                ],
              },
              {
                groupTitle: 'User Experience',
                chapters: [
                  { title: 'Interaction Flow', time: 12 },
                  { title: 'Context Switching', time: 15 },
                  { title: 'Progress Tracking', time: 17 },
                  { title: 'Adaptive UI', time: 19 },
                ],
              },
            ],
          },
        },
      },
      {
        heading: {
          main: 'Building Users\' Trust Through Transparency',
          subtitle: 'AI Output Interpretation',
        },
        textBefore: 'The transition between AI-assisted and traditional workflows is seamless and intuitive. Users can effortlessly move between interaction modes without losing context or progress, ensuring a consistent experience regardless of their chosen approach.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop',
            mediaLabel: 'LLM responses are unified and passed through a reliability check.',
          },
        },
      },
      {
        heading: {
          main: 'Helping Users See What Truly Matters in the Data',
          subtitle: 'Data Visualization',
        },
        textBefore: 'We built adaptive display tools that intelligently render information in either conversational or traditional formats. The system analyzes data complexity and user context to determine the optimal presentation method, improving comprehension and reducing cognitive load.',
        media: {
          type: 'image' as const,
          props: {
            imageSrc: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&h=900&fit=crop',
            mediaLabel: 'Results tailored to users\' specific task context.',
          },
        },
      },
    ],
  },
}
