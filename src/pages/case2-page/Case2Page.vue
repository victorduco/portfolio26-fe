<template>
  <div class="case2-page">
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
    />
    <section id="case2-summary">
      <Summary />
    </section>
    <section id="case2-task">
      <Task />
    </section>
    <section id="case2-process">
      <Process />
    </section>
    <section id="case2-results">
      <Results />
    </section>
    <AppFooter />
  </div>
</template>

<script setup>
import NavigationChevron from "@/components/common/NavigationChevron.vue";
import PageNavigation from "@/components/page-navigation/PageNavigation.vue";
import Summary from "./case2/Summary.vue";
import Task from "./case2/Task.vue";
import Process from "./case2/Process.vue";
import Results from "./case2/Results.vue";
import { useMeta } from "../../composables/useMeta.js";
import AppFooter from "../../components/app-footer/AppFooter.vue";

// Устанавливаем мета-теги для Case 2
useMeta("case2");

const navigationSections = [
  { id: "case2-summary", label: "Summary" },
  { id: "case2-task", label: "Task" },
  { id: "case2-process", label: "Process" },
  { id: "case2-results", label: "Results" },
];
</script>

<style scoped>
.case2-page {
  width: 100vw;
  background: #171717;
  position: relative;
}

.case-page-back {
  position: fixed;
  top: 48px;
  left: 48px;
  z-index: 1001;
}

@media (max-width: 768px) {
  .case-page-back {
    top: 24px;
    left: 24px;
  }
}
</style>
