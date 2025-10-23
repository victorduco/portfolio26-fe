<template>
  <div ref="backgroundNumbers" class="background-numbers"></div>
</template>

<script setup>
import { onMounted, watch, nextTick, ref } from "vue";
import { generateCompositeSVG } from "@/utils/svgBackgroundGenerator.js";

const props = defineProps({
  watchData: { type: [Array, Object, String, Number], default: null },
});

const backgroundNumbers = ref(null);
let isGenerating = false;

/**
 * Generate background from SVG composition
 */
async function generateBackgroundSVG() {
  if (isGenerating) return;
  isGenerating = true;

  if (!Array.isArray(props.watchData) || props.watchData.length === 0) {
    isGenerating = false;
    return;
  }

  try {
    const svgMarkup = generateCompositeSVG(props.watchData);

    if (!svgMarkup) {
      isGenerating = false;
      return;
    }

    if (backgroundNumbers.value) {
      backgroundNumbers.value.innerHTML = svgMarkup;
    }
  } catch (error) {
  } finally {
    isGenerating = false;
  }
}

watch(
  () => props.watchData,
  () => {
    nextTick().then(() => {
      requestAnimationFrame(generateBackgroundSVG);
    });
  },
  { deep: true }
);

onMounted(() => {
  requestAnimationFrame(generateBackgroundSVG);
});
</script>

<style scoped>
.background-numbers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.background-numbers svg {
  width: 100%;
  height: 100%;
}
</style>
