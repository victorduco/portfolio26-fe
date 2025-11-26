const h = (main: string, sectionTag?: string) => ({ main, sectionTag })
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
        textBefore: "Smarp was a recognized leader in employee communications with a strong portfolio of enterprise clients. The company had recently been acquired and rebranded.",
        media: cards('/images/story2-about-1.png', '/images/story2-about-3.png', '/images/story2-about-2.png', 'Key Highlights from Smarp (now Haiilo) with major clients, core features, and results'),
      },
      {
        heading: h('Desktop-First Mobile Experience', 'Challenge'),
        textBefore: 'The mobile app had received limited attention and resources for years, which affected its overall relevance. My goal was to rebuild it into a product employees actually wanted to use.',
        media: cards('/images/story2-challenge-1.png', '/images/story2-challenge-3.png', '/images/story2-challenge-2.png', 'Overview of Issues in the Previous Mobile App', [
          { targetImage: 'right', position: { x: 50, y: 0 }, text: 'Previous mobile experience mirrored the desktop layout.', buttonColor: '#E17E7A' }
        ]),
      },
    ],
  },
  process: {
    heading: h('Process'),
    sections: [
      {
        heading: h('Best Practices & User Interviews', 'Discovery'),
        textBefore: 'I explored industry best practices and interviewed employees and community managers who installed the app but rarely used it to understand why the experience was not meeting their needs.',
        media: cards('/images/story2-discovery-2.png', '/images/story2-discovery-1.png', '/images/story2-discovery-3.png', 'Sample Documents From the Initial Discovery Stage', []),
      },
      {
        heading: h('Defining What Matters Most for Employee Comms', 'Ideation & Prioritization'),
        textBefore: 'Using insights from research, I mapped user goals and business priorities, defined must-have improvements, and aligned cross-functional teams around a clear direction for meaningful communication.',
        media: img('/images/story2-wireframes.png', 'Wireframes Exploring Different Solution Concepts', [
          { position: { x: 59.03, y: 48.59 }, text: 'Wireframes built for multiple client types using real platform content.', buttonColor: '#E17E7A' }
        ]),
      },
      {
        heading: h('Polishing the UX of the New Flows', 'Prototype Testing'),
        textBefore: 'I validated new navigation, content flows, and interaction patterns through iterative prototype testing to ensure the new experience supported the full range of communication scenarios.',
        media: cards('/images/story2-prototype-1.png', '/images/story2-prototype-3.png', '/images/story2-prototype-2.png', 'Improvements from the testing, showing both pre-test and updated screen versions.', [
          { targetImage: 'center', position: { x: 25.83, y: 16.29 }, text: 'Intermediate design version used for prototype testing.', buttonColor: '#E17E7A' }
        ]),
      },
    ],
  },
  design: {
    heading: h('Final Design'),
    sections: [
      {
        heading: h('Enhanced Content Options for Employees and Community Managers', 'Home Screen'),
        textBefore: 'The redesigned home screen offers clearer content hierarchy, richer post types, and easier actions for employees while giving community managers better ways to publish, highlight, and manage communications.',
        media: img('/images/story2-final-1.png', 'Home screen featuring a slider, an interactive widget, articles, company events, channels, personal recommendations, and curated content for key moments.', [
          { position: { x: 9.14, y: 62.91 }, text: 'Interactive widget and intranet links unlocked new discovery paths for Smarp.', buttonColor: '#E17E7A' },
          { position: { x: 60.16, y: 20.23 }, text: 'New sections: channel, article, and topic recommendations.', buttonColor: '#E17E7A' },
          { position: { x: 70.08, y: 62.91 }, text: 'New contextual modules: upcoming events and time-sensitive highlights.', buttonColor: '#E17E7A' }
        ]),
      },
      {
        heading: h('Supporting New Content Types and Improving UX', 'Internal Screens'),
        textBefore: 'Internal screens were reworked to support expanded content formats, streamline reading and engagement, and reduce effort for employees navigating company updates on mobile.',
        media: img('/images/story2-final-2.png', 'Channel and search result screens updated to support the new features.', [
          { position: { x: 44.83, y: 60.35 }, text: 'Channel page updated to match the new home experience.', buttonColor: '#E17E7A' },
          { position: { x: 54.93, y: 29.45 }, text: 'Search page refreshed to support expanded content types.', buttonColor: '#E17E7A' }
        ]),
      },
    ],
  },
}
