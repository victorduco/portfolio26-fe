<!--
Композитинг RGB каналов и blur
-->
<template>
  <!-- Blend RGB channels -->
  <feBlend
    in="GREEN_CHANNEL"
    in2="BLUE_CHANNEL"
    mode="screen"
    result="GB_COMBINED"
  />
  <feBlend
    in="RED_CHANNEL"
    in2="GB_COMBINED"
    mode="screen"
    result="RGB_COMBINED"
  />

  <!-- Blur -->
  <feGaussianBlur
    :stdDeviation="liquidGlassBlur"
    in="RGB_COMBINED"
    result="ABERRATED_BLURRED"
  />

  <!-- Edge aberration -->
  <feComposite
    in="ABERRATED_BLURRED"
    in2="EDGE_MASK"
    operator="in"
    result="EDGE_ABERRATION"
  />

  <!-- Inverted mask and center clean -->
  <feComponentTransfer in="EDGE_MASK" result="INVERTED_MASK">
    <feFuncA type="table" tableValues="1 0" />
  </feComponentTransfer>
  <feComposite
    in="CENTER_ORIGINAL"
    in2="INVERTED_MASK"
    operator="in"
    result="CENTER_CLEAN"
  />

  <!-- Final composite -->
  <feComposite
    in="EDGE_ABERRATION"
    in2="CENTER_CLEAN"
    operator="over"
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
