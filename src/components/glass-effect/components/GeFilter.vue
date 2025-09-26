<!--
TODO: SVG фильтр + DOM source (объединяет SvgFilter + DOM logic)
- Должен получать готовые вычисленные значения для SVG фильтра
- Должен клонировать DOM элемент по sourceElementId
- Должен применять displacement mapping и хроматическую аберрацию
- Объединяет логику из SvgFilter.vue и DOM source из GlassEffect.vue
-->
<template>
  <!-- SVG фильтр + DOM source -->
  <div class="glass-filter">
    <!-- TODO: Добавить SVG фильтр из SvgFilter.vue -->
    <!-- TODO: Добавить DOM source логику из GlassEffect.vue -->
  </div>
</template>

<script setup>
const props = defineProps({
  sourceElementId: String,
  filterReady: Boolean,
  filterId: String,
  currentMap: String,
  edgeIntensityMatrix: String,
  redScale: Number,
  greenScale: Number,
  liquidGlassBlur: Number,
  surfaceEnhancementMatrix: String,
})

// TODO: Объединить логику из SvgFilter.vue и DOM source из GlassEffect.vue
</script>

<style scoped>
.glass-filter {
  position: absolute;
  inset: 0;
  z-index: 0;
}
</style>