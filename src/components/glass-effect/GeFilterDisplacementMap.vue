<!--
feDisplacementMap - single pass displacement
-->
<template>
  <feDisplacementMap
    in="SourceGraphic"
    in2="DISPLACEMENT_MAP"
    xChannelSelector="R"
    yChannelSelector="B"
    :scale="scale"
    result="DISPLACED"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  displacementScale: { type: Number, required: true },
  displacementCurvature: { type: Number, required: true },
  intensity: { type: Number, required: true },
});

const scale = computed(() =>
  props.displacementScale * props.displacementCurvature * props.intensity
);
</script>
