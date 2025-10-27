<template>
  <div
    :class="`case${caseId}-page`"
    :style="{
      backgroundColor: caseConfig.background,
      color: caseConfig.textColor,
      transition: 'background-color 0.5s ease, color 0.5s ease',
      fontFamily: caseConfig.font || 'var(--font-family-base)',
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
    />
    <PageNavigation
      :sections="navigationSections"
      :enable-intro-animation="false"
      :dark-mode="caseConfig.darkMode"
    />
    <section :id="`case${caseId}-summary`">
      <CaseSummary :case-id="caseId" :case-config="caseConfig" />
    </section>
    <section :id="`case${caseId}-task`">
      <MarkdownSection
        :case-id="caseId"
        section-type="task"
        :case-config="caseConfig"
      />
    </section>
    <section :id="`case${caseId}-process`">
      <MarkdownSection
        :case-id="caseId"
        section-type="process"
        :case-config="caseConfig"
      />
    </section>
    <section :id="`case${caseId}-results`">
      <MarkdownSection
        :case-id="caseId"
        section-type="results"
        :case-config="caseConfig"
      />
    </section>
    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from "vue";
import NavigationChevron from "@/components/common/NavigationChevron.vue";
import PageNavigation from "@/components/page-navigation/PageNavigation.vue";
import AppFooter from "@/components/app-footer/AppFooter.vue";
import MarkdownSection from "@/components/case-section/MarkdownSection.vue";
import CaseSummary from "@/components/case-section/CaseSummary.vue";
import { useMeta } from "@/composables/useMeta.js";

const props = defineProps({
  caseId: {
    type: String,
    required: true,
    validator: (value) => ["1", "2", "3"].includes(value),
  },
});

useMeta(`case${props.caseId}`);

// Configuration for each case
const caseConfigs = {
  1: {
    title: "Cross-Domain AI Solution for Account Reconcilers",
    background: "#ffffff",
    primary: "#007aff",
    secondary: null, // optional
    font: null, // optional, uses global font if null
    theme: "light", // light or dark
  },
  2: {
    title: "Redesigning the Communications App",
    background: "#ffffff",
    primary: "#000000",
    secondary: null,
    font: null,
    theme: "light",
  },
  3: {
    title: "Terminal Shift Redesign",
    background: "#B9E2F7",
    primary: "#ca4034",
    secondary: null,
    font: null,
    theme: "light",
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

const navigationSections = computed(() => [
  { id: `case${props.caseId}-summary`, label: "Summary" },
  { id: `case${props.caseId}-task`, label: "Task" },
  { id: `case${props.caseId}-process`, label: "Process" },
  { id: `case${props.caseId}-results`, label: "Results" },
]);
</script>

<style scoped>
.case1-page,
.case2-page,
.case3-page {
  width: 100vw;
  position: relative;
  min-height: 100vh;
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
