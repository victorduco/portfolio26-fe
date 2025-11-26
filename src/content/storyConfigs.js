export const storyConfigs = {
  1: {
    background: "#ffffff",
    primary: "#007aff",
    subtitleColor: "#007aff",
    summaryVideo: "story1-summary.mp4",
    videoBackground: "#f5f5f7",
    results: [
      { title: "Noticeable Time Reduction", description: "The combined dashboard and AI workflows significantly reduced investigation time during the first year." },
      { title: "Lower SLA Violations", description: "Earlier visibility and automation reduced SLA violations across high-volume reconciliation tasks." },
      { title: "Peak Load Support", description: "The solution handled year-end and holiday peak loads more reliably, reducing operational bottlenecks." }
    ],
    nextStory: { storyId: "2", title: "Relaunching the Employee Comms App" },
  },
  2: {
    background: "#ffffff",
    primary: "#000000",
    subtitleColor: "#B14127",
    font: "'Hanken Grotesk', sans-serif",
    summaryImage: "story2-summary.png",
    videoBackground: "#F7E7E7",
    mediaLabel: "Side-by-Side Comparison of the Old and New Home Screens",
    results: [
      { label: "App Rating", iconSrc: new URL('@/assets/icons/results-star.svg', import.meta.url).href, title: "3.2 → 4.6", description: "A significantly improved experience led to a sharp increase in user satisfaction, reflected in higher store ratings sustained throughout the year after relaunch." },
      { label: "Installation Rate", iconSrc: new URL('@/assets/icons/results-download.svg', import.meta.url).href, title: "4.5% → 32%", description: "Clearer value, improved usability, and stronger internal advocacy increased installation rates, showing that the relaunch successfully repositioned the mobile app within the company." },
      { label: "Active Users", iconSrc: new URL('@/assets/icons/results-user.svg', import.meta.url).href, title: "0.5% → 14%", description: "Meaningful UX improvements translated into real behavior change as weekly active usage grew steadily in the months following launch." }
    ],
    resultsIntro: "The relaunch delivered measurable, sustained improvements across adoption, satisfaction, and engagement. Below are key outcomes gathered from the first eleven months post-launch.",
    resultsMediaLabel: "Redesign results showing impact 11 months post-launch",
    nextStory: { storyId: "3", title: "A Full Redesign of an Oil Terminal Operations App" },
  },
  3: {
    background: "#ffffff",
    primary: "#ca4034",
    subtitleColor: "#ca4034",
    font: "'Neue Haas Grotesk Display Pro', sans-serif",
    summaryImage: "story3-summary.png",
    videoBackground: "rgb(213, 241, 255)",
    mediaLabel: "Side-by-Side Comparison of the Old and New Home Screens",
    simpleResults: {
      title: "Redesign Results",
      text: "The comprehensive redesign transformed the platform from a struggling e-commerce experience into a high-performing solution. Load times dropped 79%, cart abandonment fell from 73% to 34%, and revenue increased 142% in six months. Within 12 months, the user base grew from 2M to 4.2M users, the platform moved from #7 to #2 in market rankings, and won Awwwards Site of the Day while being featured in TechCrunch and Smashing Magazine.",
    },
    nextStory: { storyId: "1", title: "Transforming Account Reconciliation with AI-Driven User Experience" },
  },
};

export const sectionLabels = {
  challenge: 'Challenge', scale: 'Scale', solution: 'Solution', background: 'Background',
  process: 'Process', design: 'Final Design', audit: 'UX Audit', redesign: 'App Redesign', conclusion: 'Results',
};

export const storyNames = ['One', 'Two', 'Three'];

export const introContent = [
  { title: "Vision", description: "Strong vision means understanding the real problem. I know how to guide teams toward aligned direction and keep the product focused on meaningful outcomes." },
  { title: "Connection", description: "Great projects are built by people. I love bringing different perspectives together and turning collaboration into real progress." },
  { title: "Technology", description: "Continuous learning and hands-on tech experience help me create solutions that are both innovative and practical, grounded in real engineering constraints." },
  { title: "Scale", description: "I shape and build large-scale enterprise experiences used internationally, ensuring the UX stays consistent, predictable, and easy to operate." },
];

export const summaryConfigs = {
  1: {
    title: 'Transforming Account Reconciliation with AI-Driven User Experience',
    timeline: 'Feb 2022 - Present',
    projectType: '0-1 Product',
    role: 'Senior Product Designer & Product Manager',
    contribution: ['User Research', 'Interface Design', 'Interaction Design', 'Product Strategy'],
    organizationType: 'Team',
    organizationName: 'Apple Financial Services'
  },
  2: {
    title: 'Relaunching the Employee Comms App',
    timeline: 'Jan 2021 - Dec 2021',
    projectType: 'Redesign',
    role: 'Senior Product Designer',
    contribution: ['User Research', 'Interface Design', 'Interaction Design', 'Design System'],
    organizationType: 'Company',
    organizationName: 'Smarp (now Haiilo)'
  },
  3: {
    title: 'A Full Redesign of an Oil Terminal Operations App',
    timeline: 'Feb 2025 - Jun 2025',
    projectType: 'UX Audit, Redesign, Mentorship',
    role: 'External UX Expert',
    contribution: ['UX Audit', 'User Research', 'Product Design', 'Team Support'],
    organizationType: 'Company',
    organizationName: 'Digineox (Houston, TX)'
  }
};
