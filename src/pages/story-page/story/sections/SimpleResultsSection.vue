<template>
  <section class="story-results-simple">
    <div class="results-content">
      <h3 class="story-results-title">{{ title }}</h3>
      <p class="results-text">{{ text }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({ title: { type: String, default: 'Results' }, text: { type: String, required: true } })
</script>

<style scoped>
.story-results-simple { width: 100%; padding: 40px 0 168px; display: flex; justify-content: center; }
.results-content { width: 100%; max-width: 1200px; padding: 0 16px; box-sizing: border-box; }
.results-text { font-size: 16px; line-height: 1.8; margin: 0; opacity: 0.8; }
@media (max-width: 768px) { .story-results-simple { padding: 60px 0 24px; } .results-content { padding: 0 24px; } }
</style>
