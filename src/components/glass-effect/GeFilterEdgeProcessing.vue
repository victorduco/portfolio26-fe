<!--
Edge intensity и edge mask обработка
-->
<template>
  <feColorMatrix
    in="DISPLACEMENT_MAP"
    type="matrix"
    :values="edgeIntensityMatrix"
    result="EDGE_INTENSITY"
  />
  <feComponentTransfer in="EDGE_INTENSITY" result="EDGE_MASK">
    <feFuncA type="discrete" :tableValues="edgeMaskTable" />
  </feComponentTransfer>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  surfaceReflection: { type: Number, required: true },
  intensity: { type: Number, required: true },
});

const edgeMaskTable = "0 0.1 1";

const edgeIntensityMatrix = computed(() => {
  const sv = props.surfaceReflection * props.intensity * 0.3;
  return `${sv} ${sv} ${sv} 0 0 ${sv} ${sv} ${sv} 0 0 ${sv} ${sv} ${sv} 0 0 0 0 0 1 0`;
});
</script>
