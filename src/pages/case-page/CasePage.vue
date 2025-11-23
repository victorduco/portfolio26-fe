<template>
  <div
    :class="`case${caseId}-page`"
    :style="{
      backgroundColor: caseConfig.background,
      color: caseConfig.textColor,
      transition: 'background-color 0.5s ease, color 0.5s ease',
      '--case-title-font': caseConfig.font || 'var(--font-family-base)',
      '--case-primary-color': caseConfig.primary,
      '--case-secondary-color': caseConfig.secondary || caseConfig.primary,
      '--case-subtitle-color': caseConfig.subtitleColor || '#007aff',
    }"
  >
    <div class="case-main-content">
      <NavigationChevron
        class="case-page-back"
        type="route"
        to="/"
        direction="back"
        aria-label="Back to home"
        :dark-mode="caseConfig.darkMode"
      />
      <PageNavigation
        :sections="navigationSections"
        :enable-intro-animation="false"
        :dark-mode="caseConfig.darkMode"
      />
      <section :id="`case${caseId}-summary`">
        <SummarySection :case-id="caseId" :case-config="caseConfig" />
      </section>
      <section
        v-for="(contentSection, sectionKey) in caseContent"
        :key="sectionKey"
        :id="`case${caseId}-${sectionKey}`"
        class="content-section"
      >
        <div v-if="contentSection.heading" class="section-title">
          <h3 v-if="!contentSection.heading.subtitle" class="case-heading-single">
            {{ contentSection.heading.main }}
          </h3>
          <h3 v-else class="case-heading-two-level">
            <span class="case-heading-subtitle">{{ contentSection.heading.subtitle }}</span>
            <span class="case-heading-main">{{ contentSection.heading.main }}</span>
          </h3>
        </div>
        <ContentSection
          v-for="(section, index) in contentSection.sections"
          :key="`${sectionKey}-${index}`"
          :heading="section.heading"
          :text-before="section.textBefore"
          :media="section.media"
          :text-after="section.textAfter"
          :background-color="caseConfig.videoBackground"
        />
      </section>
      <section v-if="caseConfig.results" :id="`case${caseId}-results`">
        <ResultsCardsSection
          v-if="caseId === '2'"
          :results="caseConfig.results"
          :intro-text="caseConfig.resultsIntro"
          :conclusion-text="caseConfig.resultsConclusion"
          :card-background="caseConfig.videoBackground"
        />
        <ResultsGridSection
          v-else
          :results="caseConfig.results"
          :results-note="caseConfig.resultsNote"
        />
      </section>
    </div>
    <NextStoryPlaque v-if="caseConfig.nextProject" :story-number="nextStoryNumber" />
    <NextProjectSection
      v-if="caseConfig.nextProject"
      :content-component="nextProjectContentComponent"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, nextTick } from "vue";
import NavigationChevron from "@/components/navigation-chevron/NavigationChevron.vue";
import PageNavigation from "@/components/page-navigation/PageNavigation.vue";
import ContentSection from "./case/sections/ContentSection.vue";
import SummarySection from "./case/sections/SummarySection.vue";
import ResultsGridSection from "./case/sections/ResultsGridSection.vue";
import ResultsCardsSection from "./case/sections/ResultsCardsSection.vue";
import NextStoryPlaque from "./case/sections/NextStoryPlaque.vue";
import NextProjectSection from "./case/sections/next-project/NextProjectSection.vue";
import Case1NextProject from "./case/sections/next-project/Case1NextProject.vue";
import Case2NextProject from "./case/sections/next-project/Case2NextProject.vue";
import Case3NextProject from "./case/sections/next-project/Case3NextProject.vue";
import { useMeta } from "@/composables/useMeta.js";
import { casesContent } from "@/content/cases";
import { getImagePath, getVideoPath } from "@/utils/mediaResolver.js";

const props = defineProps({
  caseId: {
    type: String,
    required: true,
    validator: (value) => ["1", "2", "3"].includes(value),
  },
});

useMeta(`case${props.caseId}`);

// Get case content
const caseContent = computed(() => casesContent[props.caseId] || {});

// Always scroll to top when case page is mounted
onMounted(() => {
  window.scrollTo(0, 0);
  nextTick(() => window.scrollTo(0, 0));
});

// Configuration for each case
const caseConfigs = {
  1: {
    background: "#ffffff",
    primary: "#007aff",
    secondary: null, // optional
    subtitleColor: "#007aff", // Color for subtitle in two-level headings
    font: null, // optional, uses global font if null
    theme: "light", // light or dark
    summaryVideo: getVideoPath("case1-summary.mp4"),
    videoBackground: "#f5f5f7", // Apple gray background
    autoplayThreshold: 0.75, // 75% visibility to trigger autoplay
    mediaLabel: "Product Overview Video", // Label above video
    results: [
      {
        title: "Noticeable Time Reduction",
        description: "Task completion times improved significantly, with reductions in time required depending on task complexity."
      },
      {
        title: "Lower SLA Violations",
        description: "AI has enhanced the system's ability to identify incidents and perform predictive analysis, improving decision-making."
      },
      {
        title: "Peak Load Support",
        description: "Workload management during peak financial periods has improved, resulting in smoother operations and reduced stress for users."
      }
    ],
    nextProject: {
      caseId: "2",
      title: "Relaunching the Employee Comms App",
      backgroundColor: "#ffffff", // White background
    },
  },
  2: {
    background: "#ffffff",
    primary: "#000000",
    secondary: null,
    subtitleColor: "#B14127", // Coral red color for two-level headings
    font: "'Hanken Grotesk', sans-serif",
    theme: "light",
    summaryImage: getImagePath("case2-summary.png"),
    videoBackground: "#F7E7E7", // Same as button color on main page
    mediaLabel: "Side-by-Side Comparison of the Old and New Home Screens",
    results: [
      {
        label: "App Rating",
        icon: "★",
        title: "3.2 → 4.6",
        description: "Average rating in the App Store and Google Play Store."
      },
      {
        label: "Installation Rate",
        icon: "↗",
        title: "4.5% → 32%",
        description: "Percentage of users who installed the app out of the total user base."
      },
      {
        label: "Active Users",
        icon: "◆",
        title: "0.5% → 14%",
        description: "Percentage of users who became regular mobile app users out of the total user base."
      }
    ],
    resultsIntro: "The results show impact 11 months post-launch. Metrics were measured and validated by the marketing team through comprehensive analytics tracking across App Store, Google Play, and internal user engagement platforms.",
    resultsConclusion: "These improvements demonstrate the significant impact of the redesign on user engagement and satisfaction. The mobile experience transformation led to measurable business outcomes and validated our design decisions through real-world usage data.",
    nextProject: {
      caseId: "3",
      title: "A Full Redesign of an Oil Terminal Operations App",
      backgroundColor: "#ffffff", // White background
    },
  },
  3: {
    background: "#ffffff",
    primary: "#ca4034",
    secondary: null,
    subtitleColor: "#ca4034", // Red color matching case3 button
    font: "'Neue Haas Grotesk Display Pro', sans-serif",
    theme: "light",
    summaryImage: getImagePath("case3-summary.png"),
    videoBackground: "#f5f5f7", // Light gray background for all media elements
    mediaLabel: "Side-by-Side Comparison of the Old and New Home Screens",
    nextProject: {
      caseId: "1",
      title: "Transforming Account Reconciliation with AI-Driven User Experience",
      backgroundColor: "#ffffff", // White background
    },
  },
};

const caseConfig = computed(() => {
  const config = caseConfigs[props.caseId];
  const isLightTheme = config.theme === "light";
  return {
    ...config,
    textColor: isLightTheme ? "#000000" : "#ffffff",
    darkMode: !isLightTheme,
  };
});

const nextProjectContentComponent = computed(() => {
  const nextProjectCaseId = caseConfig.value.nextProject?.caseId;
  const components = {
    "1": Case1NextProject,
    "2": Case2NextProject,
    "3": Case3NextProject,
  };
  return components[nextProjectCaseId] || Case1NextProject;
});

const nextStoryNumber = computed(() => {
  const caseIdToStory = {
    "1": "One",
    "2": "Two",
    "3": "Three",
  };
  const nextProjectCaseId = caseConfig.value.nextProject?.caseId;
  return caseIdToStory[nextProjectCaseId] || "One";
});

const navigationSections = computed(() => {
  const content = caseContent.value;
  const navSections = [
    { id: `case${props.caseId}-summary`, label: "Summary" },
  ];

  // Add sections from content
  const sectionLabels = {
    challenge: 'Challenge',
    scale: 'Scale',
    solution: 'Solution',
    background: 'Background',
    process: 'Process',
    design: 'Final Design',
    audit: 'UX Audit',
    redesign: 'App Redesign',
    conclusion: 'Results',
  };

  Object.keys(content).forEach(key => {
    const label = sectionLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
    navSections.push({
      id: `case${props.caseId}-${key}`,
      label: label
    });
  });

  // Add Results if it exists
  if (caseConfig.value.results) {
    navSections.push({ id: `case${props.caseId}-results`, label: "Results" });
  }

  return navSections;
});
</script>

<style scoped>
.case1-page,
.case2-page,
.case3-page {
  width: 100%;
  position: relative;
  overflow-x: hidden;
}

.case-main-content {
  position: relative;
  z-index: 10;
  background-color: inherit;
}

section {
  position: relative;
  background-color: inherit;
}

.case-page-back {
  position: fixed;
  top: 48px;
  left: 48px;
  z-index: 1001;
}

.content-section {
  width: 100%;
  padding: 40px 0;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-title {
  width: 100%;
  max-width: 1200px;
  margin-top: 24px;
  margin-bottom: 24px;
  padding: 0 16px;
  box-sizing: border-box;
}

/* Add extra padding to the last section before Next Project */
section:has(+ .case-next-project) {
  padding-bottom: 180px;
}

@media (max-width: 899px) {
  .case-page-back {
    top: 24px;
    left: 24px;
  }
}

@media (max-width: 767px) {
  .content-section {
    padding: 40px 0;
  }

  .section-title {
    padding: 0 24px;
  }

  section:has(+ .case-next-project) {
    padding-bottom: 120px;
  }
}

@media (min-width: 768px) and (max-width: 899px) {
  .content-section {
    padding: 40px 24px;
  }

  .section-title {
    padding: 0 24px;
  }
}
</style>
