<template>
  <div
    :class="`story${storyId}-page`"
    :style="{
      backgroundColor: storyConfig.background,
      color: storyConfig.textColor,
      transition: 'background-color 0.5s ease, color 0.5s ease',
      '--story-title-font': storyConfig.font || 'var(--font-family-base)',
      '--story-primary-color': storyConfig.primary,
      '--story-secondary-color': storyConfig.secondary || storyConfig.primary,
      '--story-subtitle-color': storyConfig.subtitleColor || '#007aff',
    }"
  >
    <div class="story-main-content">
      <NavigationChevron
        class="story-page-back"
        type="route"
        to="/"
        direction="back"
        aria-label="Back to home"
        :dark-mode="storyConfig.darkMode"
      />
      <PageNavigation
        :sections="navigationSections"
        :enable-intro-animation="false"
        :dark-mode="storyConfig.darkMode"
      />
      <section :id="`story${storyId}-summary`">
        <SummarySection :story-id="storyId" :story-config="storyConfig" />
      </section>
      <section
        v-for="(contentSection, sectionKey) in storyContent"
        :key="sectionKey"
        :id="`story${storyId}-${sectionKey}`"
        class="content-section"
      >
        <div v-if="contentSection.heading" class="section-title">
          <h3 v-if="!contentSection.heading.subtitle" class="story-heading-single">
            {{ contentSection.heading.main }}
          </h3>
          <h3 v-else class="story-heading-two-level">
            <span class="story-heading-subtitle">{{ contentSection.heading.subtitle }}</span>
            <span class="story-heading-main">{{ contentSection.heading.main }}</span>
          </h3>
        </div>
        <ContentSection
          v-for="(section, index) in contentSection.sections"
          :key="`${sectionKey}-${index}`"
          :heading="section.heading"
          :text-before="section.textBefore"
          :media="section.media"
          :text-after="section.textAfter"
          :background-color="storyConfig.videoBackground"
        />
      </section>
      <section v-if="storyConfig.results" :id="`story${storyId}-results`">
        <ResultsCardsSection
          v-if="storyId === '2'"
          :results="storyConfig.results"
          :intro-text="storyConfig.resultsIntro"
          :conclusion-text="storyConfig.resultsConclusion"
          :card-background="storyConfig.videoBackground"
        />
        <ResultsGridSection
          v-else
          :results="storyConfig.results"
          :results-note="storyConfig.resultsNote"
        />
      </section>
      <section v-if="storyConfig.simpleResults" :id="`story${storyId}-results`">
        <SimpleResultsSection
          :title="storyConfig.simpleResults.title"
          :text="storyConfig.simpleResults.text"
        />
      </section>
      <AppFooter :dark-mode="false" />
    </div>
    <NextStoryPlaque v-if="storyConfig.nextStory" :story-number="nextStoryNumber" />
    <NextStorySection
      v-if="storyConfig.nextStory"
      :content-component="nextStoryContentComponent"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, nextTick } from "vue";
import NavigationChevron from "@/components/navigation-chevron/NavigationChevron.vue";
import PageNavigation from "@/components/page-navigation/PageNavigation.vue";
import ContentSection from "./story/sections/ContentSection.vue";
import SummarySection from "./story/sections/SummarySection.vue";
import ResultsGridSection from "./story/sections/ResultsGridSection.vue";
import ResultsCardsSection from "./story/sections/ResultsCardsSection.vue";
import SimpleResultsSection from "./story/sections/SimpleResultsSection.vue";
import AppFooter from "@/components/app-footer/AppFooter.vue";
import NextStoryPlaque from "./story/sections/NextStoryPlaque.vue";
import NextStorySection from "./story/sections/next-story/NextStorySection.vue";
import Story1NextStory from "./story/sections/next-story/Story1NextStory.vue";
import Story2NextStory from "./story/sections/next-story/Story2NextStory.vue";
import Story3NextStory from "./story/sections/next-story/Story3NextStory.vue";
import { useMeta } from "@/composables/useMeta.js";
import { storiesContent } from "@/content/stories";
import { getImagePath, getVideoPath } from "@/utils/mediaResolver.js";

const props = defineProps({
  storyId: {
    type: String,
    required: true,
    validator: (value) => ["1", "2", "3"].includes(value),
  },
});

useMeta(`story${props.storyId}`);

// Get story content
const storyContent = computed(() => storiesContent[props.storyId] || {});

// Always scroll to top when story page is mounted
onMounted(() => {
  window.scrollTo(0, 0);
  nextTick(() => window.scrollTo(0, 0));
});

// Configuration for each story
const storyConfigs = {
  1: {
    background: "#ffffff",
    primary: "#007aff",
    secondary: null, // optional
    subtitleColor: "#007aff", // Color for subtitle in two-level headings
    font: null, // optional, uses global font if null
    theme: "light", // light or dark
    summaryVideo: getVideoPath("story1-summary.mp4"),
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
    nextStory: {
      storyId: "2",
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
    summaryImage: getImagePath("story2-summary.png"),
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
    nextStory: {
      storyId: "3",
      title: "A Full Redesign of an Oil Terminal Operations App",
      backgroundColor: "#ffffff", // White background
    },
  },
  3: {
    background: "#ffffff",
    primary: "#ca4034",
    secondary: null,
    subtitleColor: "#ca4034", // Red color matching story3 button
    font: "'Neue Haas Grotesk Display Pro', sans-serif",
    theme: "light",
    summaryImage: getImagePath("story3-summary.png"),
    videoBackground: "rgb(213, 241, 255)", // Light blue background matching Story3 on main page
    mediaLabel: "Side-by-Side Comparison of the Old and New Home Screens",
    simpleResults: {
      title: "Redesign Results",
      text: "The comprehensive redesign transformed the platform from a struggling e-commerce experience into a high-performing solution. Load times dropped 79%, cart abandonment fell from 73% to 34%, and revenue increased 142% in six months. Within 12 months, the user base grew from 2M to 4.2M users, the platform moved from #7 to #2 in market rankings, and won Awwwards Site of the Day while being featured in TechCrunch and Smashing Magazine.",
    },
    nextStory: {
      storyId: "1",
      title: "Transforming Account Reconciliation with AI-Driven User Experience",
      backgroundColor: "#ffffff", // White background
    },
  },
};

const storyConfig = computed(() => {
  const config = storyConfigs[props.storyId];
  const isLightTheme = config.theme === "light";
  return {
    ...config,
    textColor: isLightTheme ? "#000000" : "#ffffff",
    darkMode: !isLightTheme,
  };
});

const nextStoryContentComponent = computed(() => {
  const nextStoryId = storyConfig.value.nextStory?.storyId;
  const components = {
    "1": Story1NextStory,
    "2": Story2NextStory,
    "3": Story3NextStory,
  };
  return components[nextStoryId] || Story1NextStory;
});

const nextStoryNumber = computed(() => {
  const storyIdToName = {
    "1": "One",
    "2": "Two",
    "3": "Three",
  };
  const nextStoryId = storyConfig.value.nextStory?.storyId;
  return storyIdToName[nextStoryId] || "One";
});

const navigationSections = computed(() => {
  const content = storyContent.value;
  const navSections = [
    { id: `story${props.storyId}-summary`, label: "Summary" },
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
      id: `story${props.storyId}-${key}`,
      label: label
    });
  });

  // Add Results if it exists
  if (storyConfig.value.results || storyConfig.value.simpleResults) {
    navSections.push({ id: `story${props.storyId}-results`, label: "Results" });
  }

  return navSections;
});
</script>

<style scoped>
.story1-page,
.story2-page,
.story3-page {
  width: 100%;
  position: relative;
  overflow-x: hidden;
}

.story-main-content {
  position: relative;
  z-index: 10;
  background-color: inherit;
}

section {
  position: relative;
  background-color: inherit;
}

.story-page-back {
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
  margin-top: 12px;
  margin-bottom: 0;
  padding: 0 16px;
  box-sizing: border-box;
}

@media (max-width: 899px) {
  .story-page-back {
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

  section:has(+ .story-next-story) {
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
