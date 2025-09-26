<!--
TODO: Внешний контур + тень стекла
- Получает { outlineIntensity, outlineGlassTintHue, surfaceReflection, shadowDepth } из options + intensity
- Использует layer-outline.js
- Маппинг: outlineIntensity → highlightIntensity, outlineGlassTintHue → glassTintHue
-->
<template>
  <div class="glass-outline" :style="outlineStyle" />
</template>

<script setup>
import { computed } from "vue";
import { createOutlineStyle } from "../layer-outline.js";

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

const outlineStyle = computed(() =>
  createOutlineStyle(
    {
      glassTintHue: props.options.outlineGlassTintHue,
      highlightIntensity: props.options.outlineIntensity,
      surfaceReflection: props.options.surfaceReflection,
      shadowDepth: props.options.shadowDepth,
    },
    props.intensity
  )
);
</script>

<style scoped>
.glass-outline {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  z-index: 4;
}
</style>