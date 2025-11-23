<template>
  <section class="case-results-simple">
    <div class="results-content">
      <h3 class="case-results-title">{{ title }}</h3>
      <p class="results-text">{{ text }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Results',
  },
  text: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.case-results-simple {
  width: 100%;
  padding: 80px 0 168px;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
}

.results-content {
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
  box-sizing: border-box;
}

.results-text {
  font-family: var(--font-family-base);
  font-size: 16px;
  font-weight: var(--font-weight-regular);
  line-height: 1.8;
  margin: 0;
  color: inherit;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .case-results-simple {
    padding: 60px 0 24px;
  }

  .results-content {
    padding: 0 24px;
  }
}
</style>
