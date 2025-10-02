<template>
  <div class="case1-page">
    <RouterLink to="/" class="back-button">← Back to Home</RouterLink>
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
import { RouterLink } from "vue-router";
import PageNavigation from "../main-page/page-navigation/PageNavigation.vue";
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
  background: #0d1117;
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
