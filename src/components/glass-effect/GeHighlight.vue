<template>
  <div v-if="props.intensity > 0" class="glass-highlight" :style="highlightStyle" />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  options: { type: Object, required: true },
  intensity: { type: Number, default: 1 },
});

const highlightStyle = computed(() => {
  const r = props.options.highlightReflection;
  const i = props.intensity;
  return {
    background: `linear-gradient(135deg, rgba(255, 255, 255, ${r * 0.4 * i}) 0%, rgba(255, 255, 255, ${r * 0.1 * i}) 50%, rgba(255, 255, 255, ${0.02 * i}) 100%)`,
    opacity: "calc(0.7 + var(--distortion-hovered, 0) * 0.3)",
    transition: "opacity 0.3s ease",
  };
});
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
