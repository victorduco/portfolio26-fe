<template>
  <div class="case3-page">
    <RouterLink to="/" class="back-button">← Back to Home</RouterLink>
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
import { RouterLink } from "vue-router";
import PageNavigation from "../main-page/page-navigation/PageNavigation.vue";
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
