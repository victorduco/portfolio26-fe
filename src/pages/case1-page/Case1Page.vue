<template>
  <div class="case1-page">
    <NavigationChevron
      class="case-page-back"
      type="route"
      to="/"
      direction="back"
      aria-label="Back to home"
    />
    <PageNavigation :sections="navigationSections" :enable-intro-animation="false" />
    <section id="case1-summary">
      <Summary />
    </section>
    <section id="case1-task">
      <Task />
    </section>
    <section id="case1-process">
      <Process />
    </section>
    <section id="case1-results">
      <Results />
    </section>
    <NextCaseFooter to="/story/two" label="story/two" />
  </div>
</template>

<script setup>
import NavigationChevron from "@/components/common/NavigationChevron.vue";
import PageNavigation from "../main-page/page-navigation/PageNavigation.vue";
import NextCaseFooter from "../../components/NextCaseFooter.vue";
import Summary from "./case1/Summary.vue";
import Task from "./case1/Task.vue";
import Process from "./case1/Process.vue";
import Results from "./case1/Results.vue";
import { useMeta } from "../../composables/useMeta.js";

// Устанавливаем мета-теги для Case 1
useMeta("case1");

const navigationSections = [
  { id: "case1-summary", label: "Summary" },
  { id: "case1-task", label: "Task" },
  { id: "case1-process", label: "Process" },
  { id: "case1-results", label: "Results" },
];
</script>

<style scoped>
.case1-page {
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
