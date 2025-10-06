<!--
Blur after displacement
-->
<template>
  <!-- Blur - применяется к displaced изображению -->
  <feGaussianBlur
    :stdDeviation="liquidGlassBlur"
    in="DISPLACED"
    result="FINAL_EFFECT"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  glassBlur: { type: Number, required: true },
  refractionDepth: { type: Number, required: true },
  intensity: { type: Number, required: true },
});

const liquidGlassBlur = computed(() => {
  return props.glassBlur * 0.02 * props.refractionDepth * props.intensity;
});
</script>
