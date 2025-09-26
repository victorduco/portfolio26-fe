<!--
TODO: Шумовая текстура для реалистичности стекла
- Получает { noiseStrength, noiseRefractionDepth } из options + intensity
- Использует layer-noise.js
- Маппинг: noiseRefractionDepth → refractionDepth
-->
<template>
  <div class="glass-noise" :style="noiseStyle" />
</template>

<script setup>
import { computed } from "vue";
import { createNoiseStyle } from "../layer-noise.js";

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

const noiseStyle = computed(() =>
  createNoiseStyle(
    {
      noiseStrength: props.options.noiseStrength,
      refractionDepth: props.options.noiseRefractionDepth,
    },
    props.intensity
  )
);
</script>

<style scoped>
.glass-noise {
  position: absolute;
  inset: 0;
  mix-blend-mode: soft-light;
  pointer-events: none;
  border-radius: inherit;
  z-index: 2;
}
</style>