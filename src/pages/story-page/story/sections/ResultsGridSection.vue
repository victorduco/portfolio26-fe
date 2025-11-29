<template>
  <section class="story-results">
    <div class="results-content">
      <div class="heading-divider"></div>
      <h3 class="story-results-title">Results</h3>
      <div class="results-grid">
        <div v-for="(result, i) in results" :key="i" class="result-item">
          <h3 class="result-heading">{{ result.title }}</h3>
          <p class="result-description">{{ result.description }}</p>
        </div>
      </div>
      <p v-if="resultsNote" class="results-note">{{ resultsNote }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({ results: { type: Array, required: true }, resultsNote: { type: String, default: null } })
</script>

<style scoped>
.story-results { width: 100%; padding: 40px 0 168px; display: flex; justify-content: center; }
.results-content { width: 100%; max-width: 1200px; padding: 0 16px; box-sizing: border-box; }
.heading-divider { width: 100%; height: 1px; background: rgba(0, 0, 0, 0.1); margin-bottom: 40px; }
.results-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px; }
.result-item { display: flex; flex-direction: column; gap: 12px; }
.result-heading { font-size: 18px; font-weight: var(--font-weight-semibold); line-height: 1.3; margin: 0; color: inherit; }
.result-description { font-size: 16px; line-height: 1.6; margin: 0; opacity: 0.8; }
.results-note { font-size: 14px; line-height: 1.6; margin: 48px 0 0; opacity: 0.6; text-align: center; }
@media (max-width: 900px) { .results-grid { grid-template-columns: 1fr; gap: 32px; } }
@media (max-width: 768px) { .story-results { padding: 60px 0 24px; } .story-results-title { margin-bottom: 16px; } }
</style>
