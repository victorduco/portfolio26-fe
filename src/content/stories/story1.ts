const h = (main: string, subtitle?: string) => ({ main, subtitle })
const cards = (l: string, c: string, r: string, label: string, markers: any[] = []) => ({
  type: 'layered-cards',
  props: {
    imageLeft: l,
    imageCenter: c,
    imageRight: r,
    zIndexLeft: 2,
    zIndexCenter: 3,
    zIndexRight: 1,
    mediaLabel: label,
    markers: markers,
    defaultButtonColor: '#4A90E2'
  }
})
const img = (src: string, label: string, markers: any[] = [], opts = {}) => ({
  type: 'image',
  props: {
    imageSrc: src,
    mediaLabel: label,
    markers: markers,
    defaultButtonColor: '#4A90E2',
    ...opts
  }
})

export const story1Content = {
  background: {
    heading: h('Background'),
    sections: [
      {
        heading: h('Something Went Wrong, Somehow', 'Account Reconciliation Specifics'),
        textBefore: 'A rapidly growing SaaS company faced critical user engagement issues despite having a solid product. Their bounce rate hit 67%, with only 23% adopting key features. The mobile experience was particularly weak, converting at just 8%.',
        media: img(
          '/images/story1-domain-tree.png',
          'Users must grasp multiple subdomains to resolve problems.',
          [
            {
              position: { x: 25, y: 30 },
              text: 'Bounce rate of 67% indicates major UX issues in the onboarding flow',
              buttonColor: '#E24A4A'
            },
            {
              position: { x: 75, y: 55 },
              text: 'Only 23% feature adoption shows unclear value proposition',
              buttonColor: '#4A90E2'
            }
          ]
        ),
      },
      {
        heading: h('Identifying Cross-Regional Patterns in User Workflows', 'Global Product Research'),
        textBefore: 'The platform processes over 2.5 million transactions daily across 50+ enterprise clients, handling reconciliation for accounts ranging from $10M to $2B in monthly volume. Our AI models maintain 99.7% accuracy while reducing processing time from hours to minutes.',
        media: cards(
          '/images/story1-scale-2.png',
          '/images/story1-scale-1.png',
          '/images/story1-scale-3.png',
          'Research Summary and Business Context',
          [
            {
              targetImage: 'left',
              position: { x: 30, y: 35 },
              text: 'User research insights from 50+ enterprise clients across different regions',
              buttonColor: '#4A90E2'
            },
            {
              targetImage: 'center',
              position: { x: 50, y: 50 },
              text: 'Key metrics: 2.5M daily transactions with 99.7% accuracy rate',
              buttonColor: '#E24A90'
            },
            {
              targetImage: 'right',
              position: { x: 70, y: 40 },
              text: 'Processing time reduced from hours to minutes using AI automation',
              buttonColor: '#4AE290'
            }
          ]
        ),
      },
    ],
  },
  solution: {
    heading: h('Solution'),
    sections: [
      {
        heading: h('Pairing Natural Dialogue with Heavy Data Workflows', 'Conversational & Classic UI'),
        textBefore: 'Our hybrid approach seamlessly integrates AI-powered conversational interfaces with traditional UI components. Users can switch between chat-based interactions and classic forms based on their preference and task complexity, ensuring flexibility without sacrificing efficiency.',
        media: {
          type: 'tabbed-video', props: {
            mediaLabel: 'Two workflows, one unified experience. Users pick what fits best.',
            tabs: [{ title: 'AI-Based User Flow', videoSrc: '/videos/story1-ai-flow.mp4' }, { title: 'Classic User Flow', videoSrc: '/videos/story1-classic-flow.mp4' }],
          }
        },
      },
      {
        heading: h('Visual Design Iterations', 'UI Evolution Process'),
        textBefore: 'Through multiple design iterations, we refined the visual language to balance clarity with sophistication. Each iteration brought us closer to a design that feels both approachable and professional.',
        media: {
          type: 'tabbed-img',
          props: {
            mediaLabel: 'Four stages of visual refinement',
            defaultButtonColor: '#9B4AE2',
            tabs: [
              {
                title: 'Version 1',
                imageSrc: '/images/story1-data-1-1.png',
                alt: 'Initial design concept',
                markers: [
                  { position: { x: 40.21, y: 25.76 }, text: 'Initial navigation concept with basic structure' },
                  { position: { x: 57.98, y: 19.44 }, text: 'Early content layout experimentation' }
                ]
              },
              {
                title: 'Version 2',
                imageSrc: '/images/story1-data-1-2.png',
                alt: 'Refined layout',
                markers: [
                  { position: { x: 93.46, y: 40.81 }, text: 'Simplified color palette for better readability' }
                ]
              }
            ],
          }
        },
      },
      {
        heading: h('Consistent Experience Across Variable Inputs', 'Product Vision & Design System'),
        textBefore: 'We developed a comprehensive AI framework that combines conversational design with intelligent automation. The system uses natural language processing to understand user intent and provides contextual assistance throughout the reconciliation workflow, reducing the learning curve by 70%.',
        media: { type: 'parallax', props: { image1: '/images/story1-framework-1.png', image2: '/images/story1-framework-2.png', image3: '/images/story1-framework-3.png', mediaLabel: 'Input & Output Elements for Chat and Classic UI' } },
      },
      {
        heading: h("Building Users' Trust Through Transparency", 'AI Output Interpretation'),
        textBefore: 'The transition between AI-assisted and traditional workflows is seamless and intuitive. Users can effortlessly move between interaction modes without losing context or progress, ensuring a consistent experience regardless of their chosen approach.',
        media: img('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop', 'LLM responses are unified and passed through a reliability check.'),
      },
      {
        heading: h('Helping Users See What Truly Matters in the Data', 'Data Visualization'),
        textBefore: 'We built adaptive display tools that intelligently render information in either conversational or traditional formats. The system analyzes data complexity and user context to determine the optimal presentation method, improving comprehension and reducing cognitive load.',
        media: img('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&h=900&fit=crop', "Results tailored to users' specific task context."),
      },
    ],
  },
}
