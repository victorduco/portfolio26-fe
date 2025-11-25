const h = (main: string, subtitle?: string) => ({ main, subtitle })
const cards = (l: string, c: string, r: string, label: string, markers: any[] = []) => ({
  type: 'layered-cards', props: { imageLeft: l, imageCenter: c, imageRight: r, zIndexLeft: 2, zIndexCenter: 3, zIndexRight: 1, mediaLabel: label, markers }
})
const img = (src: string, label: string, markers: any[] = []) => ({ type: 'image', props: { imageSrc: src, mediaLabel: label, markers } })

export const story2Content = {
  background: {
    heading: h('Background'),
    sections: [
      {
        heading: h('Leader in Employee Communications', 'About Smarp / Haiilo'),
        textBefore: "Smarp is the leading employee communication platform trusted by global enterprises including Google, Coca-Cola, and L'Oréal. With over 50,000 active users across Fortune 500 companies, Smarp empowers organizations to connect teams, share knowledge, and build stronger company culture.",
        media: cards('/images/story2-about-1.png', '/images/story2-about-3.png', '/images/story2-about-2.png', 'Key Highlights from Smarp (now Haiilo) with major clients, core features, and results'),
      },
      {
        heading: h('Desktop-First Mobile Experience', 'Challenge'),
        textBefore: 'The previous design was built on legacy patterns that no longer served modern workplace needs. Cluttered interfaces, inconsistent components, and outdated visual language created friction across the entire user experience. Navigation was confusing, key features were buried, and the mobile experience was an afterthought.',
        media: cards('/images/story2-challenge-1.png', '/images/story2-challenge-3.png', '/images/story2-challenge-2.png', 'Overview of Issues in the Previous Mobile App'),
      },
    ],
  },
  process: {
    heading: h('Process'),
    sections: [
      {
        heading: h('Best Practices & User Interviews', 'Discovery'),
        textBefore: 'Through extensive user research with employees across different departments and seniority levels, we identified key pain points in the existing communication flow. Conducted stakeholder interviews, competitive analysis, and analyzed usage analytics to understand how teams were actually using the platform versus how we intended them to use it.',
        media: cards('/images/story2-discovery-2.png', '/images/story2-discovery-1.png', '/images/story2-discovery-3.png', 'Sample Documents From the Initial Discovery Stage'),
      },
      {
        heading: h('Defining What Matters Most for Employee Comms', 'Ideation & Prioritization'),
        textBefore: 'Created low-fidelity wireframes to explore new navigation patterns and information architecture. Iterated rapidly through multiple concepts, testing different approaches to content organization, feature discoverability, and user flows. Collaborated closely with product managers and engineers to ensure technical feasibility while pushing for better UX.',
        media: img('/images/story2-wireframes.png', 'Wireframes Exploring Different Solution Concepts', [
          { position: { x: 30, y: 40 }, text: 'Explored new navigation patterns and IA structures', buttonColor: '#E17E7A' }
        ]),
      },
      {
        heading: h('Polishing the UX of the New Flows', 'Prototype Testing'),
        textBefore: 'Built high-fidelity interactive prototypes and conducted usability testing sessions with 25+ users across different personas. Gathered feedback on key workflows, refined interaction patterns, and validated design decisions through A/B testing. Iteratively improved the design based on real user behavior and feedback before final implementation.',
        media: cards('/images/story2-prototype-1.png', '/images/story2-prototype-3.png', '/images/story2-prototype-2.png', 'Improvements from the testing, showing both pre-test and updated screen versions.'),
      },
    ],
  },
  design: {
    heading: h('Final Design'),
    sections: [
      {
        heading: h('Enhanced Content Options for Employees and Community Managers', 'Home Screen'),
        textBefore: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        media: img('/images/story2-final-1.png', 'Home screen featuring a slider, an interactive widget, articles, company events, channels, personal recommendations, and curated content for key moments.', [
          { position: { x: 25, y: 50 }, text: 'Interactive widget and personalized content', buttonColor: '#E17E7A' },
          { position: { x: 75, y: 50 }, text: 'Company events and curated key moments', buttonColor: '#E17E7A' }
        ]),
      },
      {
        heading: h('Supporting New Content Types and Improving UX', 'Internal Screens'),
        textBefore: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        media: img('/images/story2-final-2.png', 'Channel and search result screens updated to support the new features.', [
          { position: { x: 50, y: 50 }, text: 'Updated channel and search screens', buttonColor: '#E17E7A' }
        ]),
      },
    ],
  },
}
