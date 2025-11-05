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
    <AppFooter :dark-mode="caseConfig.darkMode" />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, nextTick } from "vue";
import NavigationChevron from "@/components/common/NavigationChevron.vue";
import PageNavigation from "@/components/page-navigation/PageNavigation.vue";
import AppFooter from "@/components/app-footer/AppFooter.vue";
import MarkdownSection from "@/components/case-section/MarkdownSection.vue";
import CaseSummary from "@/components/case-section/CaseSummary.vue";
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
      { type: "process", label: "Process" },
      { type: "results", label: "Results" },
    ],
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
    sections: [
      { type: "background", label: "Background" },
      { type: "process", label: "Process" },
      { type: "results", label: "Results" },
    ],
  },
  3: {
    title: "Terminal Shift Redesign",
    background: "#B9E2F7",
    primary: "#ca4034",
    secondary: null,
    font: "'Neue Haas Grotesk Display Pro', sans-serif",
    theme: "light",
    summaryImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop",
    sections: [
      { type: "background", label: "Background" },
      { type: "process", label: "Process" },
      { type: "results", label: "Results" },
    ],
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
  return [
    { id: `case${props.caseId}-summary`, label: "Summary" },
    ...sections.map(section => ({
      id: `case${props.caseId}-${section.type}`,
      label: section.label
    }))
  ];
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

@media (max-width: 899px) {
  .case-page-back {
    top: 24px;
    left: 24px;
  }
}
</style>
