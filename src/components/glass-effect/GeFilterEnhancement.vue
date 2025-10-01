<!--
Финальный surface enhancement
-->
<template>
  <feColorMatrix
    in="FINAL_EFFECT"
    type="matrix"
    :values="surfaceEnhancementMatrix"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  glassSaturation: { type: Number, required: true },
  surfaceReflection: { type: Number, required: true },
  intensity: { type: Number, required: true },
});

const surfaceEnhancementMatrix = computed(() => {
  const contrastEffect = (props.glassSaturation - 180) / 300;
  const contrast = 1 - contrastEffect * props.intensity;
  const bv = props.surfaceReflection * 0.02 * props.intensity;
  return `${contrast} 0 0 0 ${bv} 0 ${contrast} 0 0 ${bv} 0 0 ${contrast} 0 ${bv} 0 0 0 1 0`;
});
</script>
