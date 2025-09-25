<template>
  <div
    class="center-block"
    ref="draggable"
    :style="transformStyle"
    @mousedown="startDrag"
  >
    <div class="element-id">{{ id }}</div>
  </div>
</template>

<script setup>
import { useMaskElement } from './useMaskElement.js';

const props = defineProps(['config', 'backgroundImage']);
const maskInstance = useMaskElement(props.config);

// Деструктуризируем все необходимые данные и методы
const {
  id,
  element,
  transforms,
  background,
  pseudoBg,
  ui,
  rotateMode,
  isDragging,
  draggable,
  transformStyle,
  syncBackground,
  startDrag,
  onDrag,
  stopDrag,
} = maskInstance;
</script>

<style scoped>
.center-block::before {
  background-image: v-bind('`url(${props.backgroundImage})`');
}
</style>