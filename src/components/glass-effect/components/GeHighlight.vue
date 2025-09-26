<!--
TODO: Поверхностные блики стекла
- Получает { highlightReflection } из options + intensity
- Использует layer-highlight.js
- Маппинг: highlightReflection → surfaceReflection
-->
<template>
  <div class="glass-highlight" :style="highlightStyle" />
</template>

<script setup>
import { computed } from "vue";
import { createSurfaceHighlightStyle } from "../layer-highlight.js";

const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
  intensity: {
    type: Number,
    default: 1,
  },
});

const highlightStyle = computed(() =>
  createSurfaceHighlightStyle(
    {
      surfaceReflection: props.options.highlightReflection,
    },
    props.intensity
  )
);
</script>

<style scoped>
.glass-highlight {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  z-index: 1;
}
</style>
