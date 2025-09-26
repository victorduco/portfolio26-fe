<!--
TODO: Шумовая текстура для реалистичности стекла
- Получает { noiseStrength, refractionDepth } из options + intensity
- Использует createNoiseStyle() из layer-noise.js
- Генерирует SVG шумовую текстуру с mix-blend-mode: soft-light (z-index: 2)
-->
<template>
  <div class="glass-noise" :style="noiseStyle" />
</template>

<script setup>
import { computed } from "vue"
import { createNoiseStyle } from "../layer-noise.js"

const props = defineProps({
  options: {
    type: Object,
    required: true
  },
  intensity: {
    type: Number,
    default: 1
  }
})

const noiseStyle = computed(() =>
  createNoiseStyle({
    noiseStrength: props.options.noiseStrength,
    refractionDepth: props.options.refractionDepth
  }, props.intensity)
)
</script>

<style scoped>
.glass-noise {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-radius: inherit;
  z-index: 2;
}
</style>