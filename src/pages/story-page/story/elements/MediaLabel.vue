<template>
  <div v-if="label || sources.length" class="media-label-wrapper">
    <component :is="tag" v-if="label" class="media-label">
      {{ label }}
      <span v-if="sources.length" class="inline">({{ sources.length > 1 ? 'Sources' : 'Source' }}:
        <template v-for="(s, i) in sources" :key="i">
          <a :href="s.url" target="_blank" rel="noopener noreferrer" class="source-link">{{ s.name }}</a><template v-if="i < sources.length - 1">, </template>
        </template>)
      </span>
    </component>
    <div v-else class="media-label">
      {{ sources.length > 1 ? 'Sources' : 'Source' }}:
      <template v-for="(s, i) in sources" :key="i">
        <a :href="s.url" target="_blank" rel="noopener noreferrer" class="source-link">{{ s.name }}</a><template v-if="i < sources.length - 1">, </template>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, default: '' },
  sources: { type: Array, default: () => [] },
  tag: { type: String, default: 'h3' },
});
</script>

<style scoped>
.media-label-wrapper {
  width: 100%;
  max-width: var(--story-content-max);
  margin: 0 0 4px 0;
  padding: 0 16px;
  box-sizing: border-box;
}
.media-label {
  margin: 0;
  padding: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  line-height: 1.2;
  color: inherit;
  opacity: 0.5;
}
.media-label .inline { opacity: 1; }
.source-link {
  color: inherit;
  text-decoration: underline;
  transition: opacity 0.2s ease;
}
.source-link:hover { opacity: 0.7; }
@media (max-width: 767px) {
  .media-label-wrapper { padding: 0 24px; }
}
</style>
