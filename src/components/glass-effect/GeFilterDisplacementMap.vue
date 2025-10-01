<!--
feDisplacementMap слои для RGB каналов с хроматической аберрацией
-->
<template>
  <!-- RED channel -->
  <feDisplacementMap
    in="SourceGraphic"
    in2="DISPLACEMENT_MAP"
    xChannelSelector="R"
    yChannelSelector="B"
    :scale="redScale"
    result="RED_DISPLACED"
  />
  <feColorMatrix
    in="RED_DISPLACED"
    type="matrix"
    values="1 0 0 0 0
            0 0 0 0 0
            0 0 0 0 0
            0 0 0 1 0"
    result="RED_CHANNEL"
  />

  <!-- GREEN channel -->
  <feDisplacementMap
    in="SourceGraphic"
    in2="DISPLACEMENT_MAP"
    xChannelSelector="R"
    yChannelSelector="B"
    :scale="greenScale"
    result="GREEN_DISPLACED"
  />
  <feColorMatrix
    in="GREEN_DISPLACED"
    type="matrix"
    values="0 0 0 0 0
            0 1 0 0 0
            0 0 0 0 0
            0 0 0 1 0"
    result="GREEN_CHANNEL"
  />

  <!-- BLUE channel -->
  <feDisplacementMap
    in="SourceGraphic"
    in2="DISPLACEMENT_MAP"
    xChannelSelector="R"
    yChannelSelector="B"
    :scale="blueScale"
    result="BLUE_DISPLACED"
  />
  <feColorMatrix
    in="BLUE_DISPLACED"
    type="matrix"
    values="0 0 0 0 0
            0 0 0 0 0
            0 0 1 0 0
            0 0 0 1 0"
    result="BLUE_CHANNEL"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  displacementScale: { type: Number, required: true },
  displacementCurvature: { type: Number, required: true },
  aberrationIntensity: { type: Number, required: true },
  intensity: { type: Number, required: true },
});

const baseScale = computed(() =>
  props.displacementScale * props.displacementCurvature * props.intensity
);

const redScale = computed(() =>
  baseScale.value * (1 + props.aberrationIntensity * 0.01)
);

const greenScale = computed(() => baseScale.value);

const blueScale = computed(() =>
  baseScale.value * (1 - props.aberrationIntensity * 0.01)
);
</script>
