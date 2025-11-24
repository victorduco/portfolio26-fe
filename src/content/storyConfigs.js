import { getImagePath, getVideoPath } from "@/utils/mediaResolver.js";

const icon = (name) => new URL(`@/assets/icons/${name}.svg`, import.meta.url).href;

export const storyConfigs = {
  1: {
    background: "#ffffff",
    primary: "#007aff",
    subtitleColor: "#007aff",
    summaryVideo: getVideoPath("story1-summary.mp4"),
    videoBackground: "#f5f5f7",
    results: [
      { title: "Noticeable Time Reduction", description: "Task completion times improved significantly, with reductions in time required depending on task complexity." },
      { title: "Lower SLA Violations", description: "AI has enhanced the system's ability to identify incidents and perform predictive analysis, improving decision-making." },
      { title: "Peak Load Support", description: "Workload management during peak financial periods has improved, resulting in smoother operations and reduced stress for users." }
    ],
    nextStory: { storyId: "2", title: "Relaunching the Employee Comms App" },
  },
  2: {
    background: "#ffffff",
    primary: "#000000",
    subtitleColor: "#B14127",
    font: "'Hanken Grotesk', sans-serif",
    summaryImage: getImagePath("story2-summary.png"),
    videoBackground: "#F7E7E7",
    mediaLabel: "Side-by-Side Comparison of the Old and New Home Screens",
    results: [
      { label: "App Rating", iconSrc: icon("results-star"), title: "3.2 → 4.6", description: "Average rating in the App Store and Google Play Store." },
      { label: "Installation Rate", iconSrc: icon("results-download"), title: "4.5% → 32%", description: "Percentage of users who installed the app out of the total user base." },
      { label: "Active Users", iconSrc: icon("results-user"), title: "0.5% → 14%", description: "Percentage of users who became regular mobile app users out of the total user base." }
    ],
    resultsIntro: "The results show impact 11 months post-launch. Metrics were measured and validated by the marketing team through comprehensive analytics tracking across App Store, Google Play, and internal user engagement platforms.",
    resultsMediaLabel: "Redesign results showing impact 11 months post-launch",
    resultsConclusion: "These improvements demonstrate the significant impact of the redesign on user engagement and satisfaction. The mobile experience transformation led to measurable business outcomes and validated our design decisions through real-world usage data.",
    nextStory: { storyId: "3", title: "A Full Redesign of an Oil Terminal Operations App" },
  },
  3: {
    background: "#ffffff",
    primary: "#ca4034",
    subtitleColor: "#ca4034",
    font: "'Neue Haas Grotesk Display Pro', sans-serif",
    summaryImage: getImagePath("story3-summary.png"),
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
