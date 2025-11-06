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
      <CaseResults :results="caseConfig.results" />
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
    summaryImage:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&h=900&fit=crop",
    videoBackground: "#F7E7E7", // Same as button color on main page
    sections: [
      { type: "background", label: "Background" },
      { type: "process", label: "Process" },
      { type: "design", label: "Final Design" },
    ],
    results: [
      {
        title: "User Engagement Growth",
        description: "Onboarding completion jumped from 13% to 68%—5.2x more signups weekly. Time to first deposit dropped from 3.5 days to 8.4 hours."
      },
      {
        title: "Platform Performance",
        description: "Within six months, AUM grew from $45M to $387M (760%). Monthly revenue increased 456%, and LTV:CAC improved from 3.7:1 to 26.4:1."
      },
      {
        title: "Market Recognition",
        description: "Featured in TechCrunch and #1 on Product Hunt. The user base grew from 18K to 127K in six months, with ratings jumping to 4.7 stars."
      }
    ],
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
    ],
    results: [
      {
        title: "Performance Improvements",
        description: "Load times dropped 79%: desktop from 4.2s to 0.9s, mobile from 8.4s to 1.8s. Cart abandonment fell from 73% to 34%, mobile conversion rose 263%."
      },
      {
        title: "Business Growth",
        description: "Revenue increased 142% in six months ($28.4M additional annually). Recovered 4.2% market share, moving from #7 to #2 in rankings."
      },
      {
        title: "Long-term Impact",
        description: "Within 12 months: revenue up 187%, user base grew from 2M to 4.2M. Won Awwwards Site of the Day, featured in TechCrunch and Smashing Magazine."
      }
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
section:has(+ .case-next-project) :deep(.case-background),
section:has(+ .case-next-project) :deep(.case-challenge),
section:has(+ .case-next-project) :deep(.case-scale),
section:has(+ .case-next-project) :deep(.case-solution),
section:has(+ .case-next-project) :deep(.case-process),
section:has(+ .case-next-project) :deep(.case-design),
section:has(+ .case-next-project) :deep(.case-audit),
section:has(+ .case-next-project) :deep(.case-redesign) {
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
  section:has(+ .case-next-project) :deep(.case-background),
  section:has(+ .case-next-project) :deep(.case-challenge),
  section:has(+ .case-next-project) :deep(.case-scale),
  section:has(+ .case-next-project) :deep(.case-solution),
  section:has(+ .case-next-project) :deep(.case-process),
  section:has(+ .case-next-project) :deep(.case-design),
  section:has(+ .case-next-project) :deep(.case-audit),
  section:has(+ .case-next-project) :deep(.case-redesign) {
    padding-bottom: 120px;
  }
}
</style>
