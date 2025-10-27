<template>
  <section class="case-summary">
    <div class="summary-content">
      <h1 class="summary-title">{{ caseConfig.title }}</h1>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  caseId: {
    type: String,
    required: true,
  },
  caseConfig: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style scoped>
.case-summary {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-content {
  max-width: 1200px;
  padding: 0 48px;
  text-align: center;
}

.summary-title {
  margin: 0;
  font-family: var(--font-family-base);
  font-weight: 600;
  font-size: clamp(32px, 6vw, 64px);
  line-height: 1.2;
  color: inherit;
}

@media (max-width: 768px) {
  .summary-content {
    padding: 0 24px;
  }

  .summary-title {
    font-size: clamp(28px, 8vw, 48px);
  }
}
</style>
