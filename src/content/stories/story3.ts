const h = (main: string, subtitle?: string) => ({ main, subtitle })
const cards = (l: string, c: string, r: string, label: string, opts = {}, markers: any[] = []) => ({
  type: 'layered-cards', props: { imageLeft: l, imageCenter: c, imageRight: r, zIndexLeft: 2, zIndexCenter: 3, zIndexRight: 1, mediaLabel: label, markers, ...opts }
})
const img = (src: string, label: string, markers: any[] = []) => ({ type: 'image', props: { imageSrc: src, mediaLabel: label, markers } })

export const story3Content = {
  background: {
    heading: h('Background'),
    sections: [
      {
        heading: h('Harsh Conditions, Critical Actions', 'User Challenge'),
        textBefore: 'The platform faced critical challenges across multiple dimensions. Users struggled with fragmented workflows, inconsistent interfaces, and a steep learning curve that resulted in low feature adoption. The mobile experience was particularly problematic, with conversion rates significantly lagging behind desktop. These issues compounded into a broader problem of user retention and engagement.',
        media: cards('/images/story3-challenge-1.png', '/images/story3-challenge-3.png', '/images/story3-challenge-2.png', 'Typical field conditions: rain, safety equipment, and a tablet with a protective screen.', {}, [
          { targetImage: 'left', position: { x: 50, y: 40 }, text: 'Fragmented workflows caused confusion', buttonColor: '#E24A4A' },
          { targetImage: 'center', position: { x: 50, y: 50 }, text: 'Harsh field conditions require robust UX', buttonColor: '#4A90E2' },
          { targetImage: 'right', position: { x: 50, y: 45 }, text: 'Protective equipment limits interaction', buttonColor: '#4AE290' }
        ]),
      },
      {
        heading: h('Previous Design'),
        textBefore: 'The e-commerce platform suffered from severe usability issues that were driving customers away. Complex navigation made product discovery frustrating, the checkout flow had 7+ steps causing massive cart abandonment, and mobile experience was broken with tiny buttons and unresponsive layouts. Performance was abysmal with 8+ second load times on mobile, causing users to leave before pages even loaded.',
        media: img('/images/story3-task.png', 'Previous version: Home screen, My Tasks (two views), and user profile.', [
          { position: { x: 25, y: 35 }, text: 'Complex navigation patterns', buttonColor: '#E24A4A' },
          { position: { x: 50, y: 50 }, text: 'Cluttered task management interface', buttonColor: '#6B4AE2' },
          { position: { x: 75, y: 40 }, text: 'Inconsistent user profile design', buttonColor: '#4A90E2' }
        ]),
      },
    ],
  },
  audit: {
    heading: h('UX Audit'),
    sections: [
      {
        heading: h('Building a Fact-Based Case for Change', 'User & Competitor Research'),
        textBefore: 'Conducted extensive usability testing with 30+ participants and analyzed top 10 competitors to identify industry best practices. Heat maps revealed friction points, scroll depth analytics showed content discovery issues, and competitor analysis identified key opportunities for differentiation in navigation, checkout flows, and mobile experience.',
        media: cards('/images/story3-ground-1.png', '/images/story3-ground-3.png', '/images/story3-ground-2.png', 'Internal documentation samples: personas, best practices, and user testing of the previous design.'),
      },
      {
        heading: h('Prioritized and Actionable Summary of UX Problems', 'UX Audit Report'),
        textBefore: 'Delivered comprehensive UX audit report with prioritized recommendations across 5 key areas: navigation & IA, product discovery, checkout optimization, mobile experience, and performance. Each recommendation included severity rating, estimated impact, implementation effort, and supporting data from user testing. Created detailed roadmap for phased implementation aligned with business priorities.',
        media: cards('/images/story3-audit-1.png', '/images/story3-audit-3.png', '/images/story3-audit-2.png', 'Sample slides from the final report showing issues and solutions.'),
        textAfter: 'The audit findings provided a clear foundation for the redesign phase. Armed with data-driven insights and validated recommendations, the team was ready to transform the platform from a frustrating experience into an intuitive, high-performing e-commerce solution.',
      },
    ],
  },
  redesign: {
    heading: h('App Redesign'),
    sections: [
      {
        heading: h('Keeping Only What Matters, Without Losing the Experience', 'Home Page'),
        textBefore: 'A design system with 142 components provided consistency. Navigation restructured through user testing reduced clicks-to-product from 4.2 to 2.1. Mobile got touch-optimized interactions and streamlined checkout. A/B tests validated every decision.',
        media: cards('/images/story3-home-1-1.png', '/images/story3-home-1-3.png', '/images/story3-home-1-2.png', "The home screen adapts to the user's current situation, showing only what matters most.", { borderRadius: 25 }),
      },
      {
        textBefore: 'The new interface introduced streamlined workflows that significantly reduced cognitive load. By consolidating related actions and providing contextual information at the right moment, users could accomplish tasks with fewer clicks and less mental effort. Progressive disclosure techniques ensured that advanced features remained accessible without overwhelming new users.',
        media: {
          type: 'horizontalParallax', props: {
            image1: '/images/story3-illustr-1.png', image2: '/images/story3-illustr-2.png', image3: '/images/story3-illustr-3.png',
            speed1: 1, speed2: 0.7, speed3: 1.3, height1: '33.33%', height2: '33.33%', height3: '33.33%',
            backgroundColor: '#f5f5f7', mediaLabel: 'Illustration samples for different order types, statuses, and conditions.', alt: 'Platform migration process',
          }
        },
      },
      {
        heading: h('Attention Goes to What Truly Matters', 'App Navigation'),
        textBefore: 'Gradual migration allowed business continuity while rebuilding. We audited 47 page templates, prioritized revenue-driving pages, and set targets: 75% faster loads, 100% mobile conversion increase, Lighthouse scores above 95.',
        media: cards('/images/story3-nav-1-1.png', '/images/story3-nav-1-3.png', '/images/story3-nav-1-2.png', 'Examples of visual hierarchy: (1) the menu stays low-priority; (2) notifications gain prominence only when something critical happens.', { borderRadius: 25 }),
      },
      {
        heading: h("Flatter Navigation With 50% Fewer Transitions", 'Order View'),
        textBefore: 'Redesigned the homepage with a clean, modern aesthetic that prioritizes product discovery and creates clear visual hierarchy. Implemented large hero imagery, featured product carousels, and category navigation that guides users naturally through the experience. Reduced clutter by 60%, improved above-the-fold conversion triggers, and created a mobile-first responsive layout that adapts beautifully across all screen sizes.',
        media: cards('/images/story3-order-1-1.png', '/images/story3-order-1-3.png', '/images/story3-order-1-2.png', 'Examples of order screens: main view, steps panel, and order overview.', { borderRadius: 25 }),
      },
      {
        textBefore: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        media: cards('/images/story3-nav-2-1.png', '/images/story3-nav-2-3.png', '/images/story3-nav-2-2.png', 'Multiple other improvements driven by insights from the research phase.'),
      },
    ],
  },
}
