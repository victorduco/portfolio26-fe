<template>
  <div v-if="shouldRender" class="media-label-wrapper">
    <!-- Label with sources inline -->
    <component
      :is="tag"
      v-if="label"
      class="media-label"
    >
      {{ label }}
      <span v-if="sources.length > 0" class="image-sources-inline">
        ({{ sourcesText }}:
        <template v-for="(source, index) in sources" :key="index">
          <a
            :href="source.url"
            target="_blank"
            rel="noopener noreferrer"
            class="source-link"
          >
            {{ source.name }}
          </a>
          <template v-if="index < sources.length - 1">, </template>
        </template>)
      </span>
    </component>

    <!-- Sources only (no label) -->
    <div v-else-if="sources.length > 0" class="image-sources">
      {{ sourcesText }}:
      <template v-for="(source, index) in sources" :key="index">
        <a
          :href="source.url"
          target="_blank"
          rel="noopener noreferrer"
          class="source-link"
        >
          {{ source.name }}
        </a>
        <template v-if="index < sources.length - 1">, </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  sources: {
    type: Array,
    default: () => [],
    validator: (value) => {
      return value.every(source =>
        typeof source === 'object' &&
        'name' in source &&
        'url' in source
      );
    },
  },
  tag: {
    type: String,
    default: 'h3',
    validator: (value) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'p'].includes(value),
  },
});

const shouldRender = computed(() => {
  return props.label || props.sources.length > 0;
});

const sourcesText = computed(() => {
  return props.sources.length > 1 ? 'Sources' : 'Source';
});
</script>

<style scoped>
.media-label-wrapper {
  width: 100%;
  max-width: var(--case-content-max);
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

.image-sources {
  margin: 0;
  padding: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  line-height: 1.2;
  color: inherit;
  opacity: 0.5;
}

.image-sources-inline {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  line-height: 1.2;
  color: inherit;
  opacity: 1;
}

.source-link {
  color: inherit;
  text-decoration: underline;
  transition: opacity 0.2s ease;
}

.source-link:hover {
  opacity: 0.7;
}

/* Mobile: Add horizontal padding to match text content */
@media (max-width: 767px) {
  .media-label-wrapper {
    padding: 0 24px;
  }
}
</style>
