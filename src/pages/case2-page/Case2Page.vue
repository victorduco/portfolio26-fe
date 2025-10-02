<template>
  <div class="case2-page">
    <PageNavigation :sections="navigationSections" />
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
  </div>
</template>

<script setup>
import PageNavigation from "../main-page/page-navigation/PageNavigation.vue";
import Summary from "./case2/Summary.vue";
import Task from "./case2/Task.vue";
import Process from "./case2/Process.vue";
import Results from "./case2/Results.vue";

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
  background: #1a1a2e;
}
</style>
