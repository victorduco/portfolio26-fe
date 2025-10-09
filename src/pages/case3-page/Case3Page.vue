<template>
  <div class="case3-page">
    <NavigationChevron
      class="case-page-back"
      type="route"
      to="/"
      direction="back"
      aria-label="Back to home"
    />
    <PageNavigation :sections="navigationSections" :enable-intro-animation="false" />
    <section id="case3-summary">
      <Summary />
    </section>
    <section id="case3-task">
      <Task />
    </section>
    <section id="case3-process">
      <Process />
    </section>
    <section id="case3-results">
      <Results />
    </section>
    <NextCaseFooter to="/story/one" label="story/one" />
  </div>
</template>

<script setup>
import NavigationChevron from "@/components/common/NavigationChevron.vue";
import PageNavigation from "../main-page/page-navigation/PageNavigation.vue";
import NextCaseFooter from "../../components/NextCaseFooter.vue";
import Summary from "./case3/Summary.vue";
import Task from "./case3/Task.vue";
import Process from "./case3/Process.vue";
import Results from "./case3/Results.vue";
import { useMeta } from "../../composables/useMeta.js";

// Устанавливаем мета-теги для Case 3
useMeta("case3");

const navigationSections = [
  { id: "case3-summary", label: "Summary" },
  { id: "case3-task", label: "Task" },
  { id: "case3-process", label: "Process" },
  { id: "case3-results", label: "Results" },
];
</script>

<style scoped>
.case3-page {
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
