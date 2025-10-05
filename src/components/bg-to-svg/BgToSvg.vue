<script setup>
/**
 * BgToSvg Component
 *
 * Converts DOM element to PNG and sets it as CSS variable background.
 *
 * PERFORMANCE WARNING:
 * - Uses `toPng` from html-to-image (slow operation ~50-200ms)
 * - Resize listener is DISABLED to prevent performance degradation
 * - With resize listener: 10.85s total, 467ms avg resize, +468% degradation
 * - Without resize listener: 2.61s total, 74ms avg resize, no degradation
 *
 * Only regenerates on:
 * - Component mount
 * - watchData changes (e.g., entered digits in Keypad)
 *
 * If you need resize support, add debounce (300-500ms minimum)
 */
import { onMounted, onUnmounted, watch, nextTick } from "vue";
import { toPng } from "html-to-image";

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

  const img = await toPng(src, {
    width: src.offsetWidth,
    height: src.offsetHeight,
    backgroundColor: bodyBg,
    pixelRatio: 1,
  });
  document.documentElement.style.setProperty(
    "--global-keypad-bg",
    `url("${img}")`
  );

  isGenerating = false;
}

// todo: вернуть если ресайз не будет правильно показывать фон
// const handleResize = () => requestAnimationFrame(generateBackground);

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

  // PERFORMANCE: resize listener DISABLED
  // Causes 4x slowdown and +468% performance degradation
  // Only enable if absolutely necessary with debounce (300-500ms)
  // window.addEventListener("resize", handleResize, { passive: true });
});

onUnmounted(() => {
  // PERFORMANCE: cleanup disabled resize listener
  // window.removeEventListener("resize", handleResize);
});
</script>

<template></template>
