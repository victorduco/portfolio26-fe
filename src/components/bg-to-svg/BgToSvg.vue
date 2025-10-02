<script setup>
import { onMounted, onUnmounted, watch, nextTick } from "vue";
import { toSvg } from "html-to-image";

const props = defineProps({
  sourceSelector: { type: String, required: true },
  watchData: { type: [Array, Object, String, Number], default: null },
  renderDelay: { type: Number, default: 100 },
});

let isGenerating = false;

async function generateBackground() {
  if (isGenerating) {
    return;
  }
  isGenerating = true;

  const src = document.getElementById(props.sourceSelector);
  if (!src) {
    isGenerating = false;
    return;
  }
  const bodyBg = getComputedStyle(document.body).backgroundColor || "#000";

  await new Promise((resolve) => setTimeout(resolve, props.renderDelay));
  await document.fonts.ready;

  const img = await toSvg(src, {
    width: src.offsetWidth,
    height: src.offsetHeight,
    backgroundColor: bodyBg,
    pixelRatio: 1,
  });
  document.documentElement.style.setProperty("--global-keypad-bg", `url("${img}")`);

  isGenerating = false;
}

const handleResize = () => requestAnimationFrame(generateBackground);

// Watch for data changes to trigger regeneration
watch(
  () => props.watchData,
  async () => {
    await nextTick();
    requestAnimationFrame(generateBackground);
  },
  { deep: true }
);

onMounted(() => {
  requestAnimationFrame(generateBackground);
  window.addEventListener("resize", handleResize, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template></template>
