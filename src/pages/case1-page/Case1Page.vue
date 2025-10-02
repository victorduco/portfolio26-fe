<template>
  <div class="case1-page">
    <PageNavigation :sections="navigationSections" />
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
  </div>
</template>

<script setup>
import PageNavigation from "../main-page/page-navigation/PageNavigation.vue";
import Summary from "./case1/Summary.vue";
import Task from "./case1/Task.vue";
import Process from "./case1/Process.vue";
import Results from "./case1/Results.vue";

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
  background: #0d1117;
}
</style>
