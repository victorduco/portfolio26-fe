<!--
TODO: Внешний контур + тень (объединяет outline + cardStyle)
- Получает { glassTintHue, outlineIntensity, surfaceReflection, shadowDepth } из options + intensity
- Использует createOutlineStyle() из layer-outline.js
- Генерирует градиентную рамку + box-shadow + inset тени
-->
<template>
  <div class="glass-outline" :style="outlineStyle" />
</template>

<script setup>
import { computed } from "vue"
import { createOutlineStyle } from "../layer-outline.js"

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

const outlineStyle = computed(() =>
  createOutlineStyle({
    glassTintHue: props.options.glassTintHue,
    highlightIntensity: props.options.outlineIntensity,
    surfaceReflection: props.options.surfaceReflection,
    shadowDepth: props.options.shadowDepth
  }, props.intensity)
)
</script>

<style scoped>
.glass-outline {
  position: absolute;
  inset: -1.5px;
  border-radius: inherit;
  mix-blend-mode: screen;
  pointer-events: none;
  transform-origin: center center;
  box-sizing: border-box;
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4) inset,
    0 1px 4px rgba(0, 0, 0, 0.45) inset;
}
</style>