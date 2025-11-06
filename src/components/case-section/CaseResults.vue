<template>
  <section class="case-results">
    <div class="results-content">
      <h1 class="results-title">Results</h1>
      <div class="results-grid">
        <div
          v-for="(result, index) in results"
          :key="index"
          class="result-item"
        >
          <h3 class="result-heading">{{ result.title }}</h3>
          <p class="result-description">{{ result.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  results: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(result =>
        typeof result === 'object' &&
        'title' in result &&
        'description' in result
      );
    },
  },
});
</script>

<style scoped>
.case-results {
  width: 100%;
  padding: 80px 16px 48px;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
}

.results-content {
  width: 100%;
  max-width: 1200px;
}

.results-title {
  font-family: var(--case-title-font, var(--font-family-base));
  font-size: clamp(32px, 5vw, 48px);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 24px 0;
  color: inherit;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-heading {
  font-family: var(--font-family-base);
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
  line-height: 1.3;
  margin: 0;
  color: inherit;
}

.result-description {
  font-family: var(--font-family-base);
  font-size: 16px;
  font-weight: var(--font-weight-regular);
  line-height: 1.6;
  margin: 0;
  color: inherit;
  opacity: 0.8;
}

@media (max-width: 900px) {
  .results-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 768px) {
  .case-results {
    padding: 60px 16px 24px;
  }

  .results-title {
    margin-bottom: 16px;
  }
}
</style>
