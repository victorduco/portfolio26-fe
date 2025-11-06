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
    }"
  >
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
      <CaseSummary :case-id="caseId" :case-config="caseConfig" />
    </section>
    <section
      v-for="section in caseConfig.sections"
      :key="section.type"
      :id="`case${caseId}-${section.type}`"
    >
      <MarkdownSection
        :case-id="caseId"
        :section-type="section.type"
        :case-config="caseConfig"
      />
    </section>
    <section v-if="caseConfig.results" :id="`case${caseId}-results`">
      <CaseResults2
        v-if="caseId === '2'"
        :results="caseConfig.results"
        :intro-text="caseConfig.resultsIntro"
        :conclusion-text="caseConfig.resultsConclusion"
        :card-background="caseConfig.videoBackground"
      />
      <CaseResults
        v-else
        :results="caseConfig.results"
        :results-note="caseConfig.resultsNote"
      />
    </section>
    <CaseNextProject
      v-if="caseConfig.nextProject"
      :case-id="caseConfig.nextProject.caseId"
      :title="caseConfig.nextProject.title"
    />
    <AppFooter :dark-mode="true" />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, nextTick } from "vue";
import NavigationChevron from "@/components/common/NavigationChevron.vue";
import PageNavigation from "@/components/page-navigation/PageNavigation.vue";
import AppFooter from "@/components/app-footer/AppFooter.vue";
import MarkdownSection from "@/components/case-section/MarkdownSection.vue";
import CaseSummary from "@/components/case-section/CaseSummary.vue";
import CaseResults from "@/components/case-section/CaseResults.vue";
import CaseResults2 from "@/components/case-section/CaseResults2.vue";
import CaseNextProject from "@/components/case-section/CaseNextProject.vue";
import { useMeta } from "@/composables/useMeta.js";
// import { getSnapInstance } from "@/composables/useLenis.js";

const props = defineProps({
  caseId: {
    type: String,
    required: true,
    validator: (value) => ["1", "2", "3"].includes(value),
  },
});

useMeta(`case${props.caseId}`);

// Always scroll to top when case page is mounted
onMounted(() => {
  console.log('📄 CasePage mounted, scroll:', window.scrollY);

  // Immediate scroll
  window.scrollTo(0, 0);
  console.log('✅ Scrolled immediately, now:', window.scrollY);

  // Also scroll after Vue updates DOM
  nextTick(() => {
    console.log('🔄 nextTick, scroll:', window.scrollY);
    window.scrollTo(0, 0);
  });

  // And once more after delays
  setTimeout(() => {
    console.log('⏰ setTimeout 0ms, scroll:', window.scrollY);
    window.scrollTo(0, 0);
  }, 0);

  setTimeout(() => {
    console.log('⏰ setTimeout 500ms, scroll:', window.scrollY);
    window.scrollTo(0, 0);
  }, 500);
});

// Configuration for each case
const caseConfigs = {
  1: {
    title: "Cross-Domain AI Solution for Account Reconcilers",
    background: "#ffffff",
    primary: "#007aff",
    secondary: null, // optional
    font: null, // optional, uses global font if null
    theme: "light", // light or dark
    summaryVideo: "/videos/case1-summary.mp4",
    videoBackground: "#f5f5f7", // Apple gray background
    autoplayThreshold: 0.75, // 75% visibility to trigger autoplay
    videoLabel: "Video Overview", // Label above video
    sections: [
      { type: "challenge", label: "Challenge" },
      { type: "scale", label: "Scale" },
      { type: "solution", label: "Solution" },
    ],
    results: [
      {
        title: "Time Efficiency Improvement",
        description: "Task completion times improved significantly, with reductions in time required depending on task complexity."
      },
      {
        title: "AI and Predictive Analysis",
        description: "AI has enhanced the system's ability to identify incidents and perform predictive analysis, improving decision-making."
      },
      {
        title: "Peak Time Management",
        description: "Workload management during peak financial periods has improved, resulting in smoother operations and reduced stress for users."
      }
    ],
    nextProject: {
      caseId: "2",
      title: "Redesigning the Communications App",
    },
  },
  2: {
    title: "Redesigning the Communications App",
    background: "#ffffff",
    primary: "#000000",
    secondary: null,
    font: "'Hanken Grotesk', sans-serif",
    theme: "light",
    summaryImage: new URL("@/assets/images/case2_summary.png", import.meta.url).href,
    videoBackground: "#F7E7E7", // Same as button color on main page
    sections: [
      { type: "background", label: "Background" },
      { type: "process", label: "Process" },
      { type: "design", label: "Final Design" },
    ],
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
      title: "Terminal Shift Redesign",
    },
  },
  3: {
    title: "Terminal Shift Redesign",
    background: "#ffffff",
    primary: "#ca4034",
    secondary: null,
    font: "'Neue Haas Grotesk Display Pro', sans-serif",
    theme: "light",
    summaryImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop",
    videoBackground: "#B9E2F7", // Blue background for images (previously page background)
    sections: [
      { type: "audit", label: "UX Audit" },
      { type: "redesign", label: "App Redesign" },
      { type: "conclusion", label: "Conclusion" },
    ],
    nextProject: {
      caseId: "1",
      title: "Cross-Domain AI Solution for Account Reconcilers",
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

const navigationSections = computed(() => {
  const sections = caseConfig.value.sections || [];
  const navSections = [
    { id: `case${props.caseId}-summary`, label: "Summary" },
    ...sections.map(section => ({
      id: `case${props.caseId}-${section.type}`,
      label: section.label
    }))
  ];

  // Add Results if it exists
  if (caseConfig.value.results) {
    navSections.push({ id: `case${props.caseId}-results`, label: "Results" });
  }

  return navSections;
});

// Disable snap scrolling on case detail pages
// onMounted(() => {
//   const snapInstance = getSnapInstance();
//   if (snapInstance) {
//     snapInstance.stop();
//     console.log("🚫 Snap disabled on case detail page");
//   }
// });

// Re-enable snap when leaving the page
// onUnmounted(() => {
//   const snapInstance = getSnapInstance();
//   if (snapInstance) {
//     snapInstance.start();
//     console.log("✅ Snap re-enabled");
//   }
// });
</script>

<style scoped>
.case1-page,
.case2-page,
.case3-page {
  width: 100%;
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
}

.case-page-back {
  position: fixed;
  top: 48px;
  left: 48px;
  z-index: 1001;
}

/* Add extra padding to the last section before Next Project */
section:has(+ .case-next-project) :deep(.case-results),
section:has(+ .case-next-project) :deep(.case-results-2),
section:has(+ .case-next-project) :deep(.case-background),
section:has(+ .case-next-project) :deep(.case-challenge),
section:has(+ .case-next-project) :deep(.case-scale),
section:has(+ .case-next-project) :deep(.case-solution),
section:has(+ .case-next-project) :deep(.case-process),
section:has(+ .case-next-project) :deep(.case-design),
section:has(+ .case-next-project) :deep(.case-audit),
section:has(+ .case-next-project) :deep(.case-redesign),
section:has(+ .case-next-project) :deep(.case-conclusion) {
  padding-bottom: 180px;
}

@media (max-width: 899px) {
  .case-page-back {
    top: 24px;
    left: 24px;
  }
}

@media (max-width: 768px) {
  section:has(+ .case-next-project) :deep(.case-results),
  section:has(+ .case-next-project) :deep(.case-results-2),
  section:has(+ .case-next-project) :deep(.case-background),
  section:has(+ .case-next-project) :deep(.case-challenge),
  section:has(+ .case-next-project) :deep(.case-scale),
  section:has(+ .case-next-project) :deep(.case-solution),
  section:has(+ .case-next-project) :deep(.case-process),
  section:has(+ .case-next-project) :deep(.case-design),
  section:has(+ .case-next-project) :deep(.case-audit),
  section:has(+ .case-next-project) :deep(.case-redesign),
  section:has(+ .case-next-project) :deep(.case-conclusion) {
    padding-bottom: 120px;
  }
}
</style>
