<template>
  <div ref="backgroundNumbers" class="background-numbers"></div>
</template>

<script setup>
import { watch, nextTick, ref } from "vue";
import { generateCompositeSVG } from "@/utils/svgBackgroundGenerator.js";

const props = defineProps({ watchData: { type: [Array, Object, String, Number], default: null } });
const backgroundNumbers = ref(null);
let isGenerating = false;

async function generateBackgroundSVG() {
  if (isGenerating || !Array.isArray(props.watchData) || !props.watchData.length) return;
  isGenerating = true;
  try {
    const svgMarkup = generateCompositeSVG(props.watchData);
    if (svgMarkup && backgroundNumbers.value) backgroundNumbers.value.innerHTML = svgMarkup;
  } finally {
    isGenerating = false;
  }
}

watch(() => props.watchData, () => nextTick().then(() => requestAnimationFrame(generateBackgroundSVG)), { deep: true, immediate: true });
</script>

<style scoped>
.background-numbers { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.background-numbers svg { width: 100%; height: 100%; }
</style>
