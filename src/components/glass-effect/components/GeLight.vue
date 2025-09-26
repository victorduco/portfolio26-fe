<!--
TODO: Внутренний источник света в стекле
- Получает { lightIntensity, lightSpread, lightHue } из options + intensity
- Использует  layer-light.js

-->
<template>
  <div class="glass-light" :style="lightStyle" />
</template>

<script setup>
import { computed } from "vue";
import { createLightStyle } from "../layer-light.js";

const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
  intensity: {
    type: Number,
    default: 1,
  },
});

const lightStyle = computed(() =>
  createLightStyle(
    {
      highlightIntensity: props.options.lightIntensity,
      highlightSpread: props.options.lightSpread,
      highlightHue: props.options.lightHue,
    },
    props.intensity
  )
);
</script>

<style scoped>
.glass-light {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-radius: inherit;
  z-index: 3;
  mix-blend-mode: screen;
  transform: translateY(-30%);
}
</style>
