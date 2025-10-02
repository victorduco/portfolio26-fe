<template>
  <div class="case3-page">
    <PageNavigation :sections="navigationSections" />
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
  </div>
</template>

<script setup>
import PageNavigation from "../main-page/page-navigation/PageNavigation.vue";
import Summary from "./case3/Summary.vue";
import Task from "./case3/Task.vue";
import Process from "./case3/Process.vue";
import Results from "./case3/Results.vue";

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
  background: #16213e;
}
</style>
