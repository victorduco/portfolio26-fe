<template>
  <div class="case2-page">
    <RouterLink to="/" class="back-button">← Back to Home</RouterLink>
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
import { RouterLink } from "vue-router";
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
  position: relative;
}

.back-button {
  position: fixed;
  top: 48px;
  left: 48px;
  z-index: 1001;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-4px);
}

@media (max-width: 768px) {
  .back-button {
    top: 24px;
    left: 24px;
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
