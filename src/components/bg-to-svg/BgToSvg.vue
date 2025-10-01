<script setup>
import { onMounted, onUnmounted } from "vue";
import { toSvg } from "html-to-image";

const props = defineProps({
  sourceSelector: { type: String, required: true },
});

// Wait for layout and fonts to be ready before generating
const RENDER_DELAY = 500;

async function generateBackground() {
  const src = document.getElementById(props.sourceSelector);
  if (!src) return;
  const bodyBg = getComputedStyle(document.body).backgroundColor || "#000";

  await new Promise((resolve) => setTimeout(resolve, RENDER_DELAY));
  await document.fonts.ready;

  const img = await toSvg(src, {
    width: src.offsetWidth,
    height: src.offsetHeight,
    backgroundColor: bodyBg,
    pixelRatio: 1,
  });
  document.documentElement.style.setProperty("--global-bg", `url("${img}")`);
}

const handleResize = () => requestAnimationFrame(generateBackground);

onMounted(() => {
  requestAnimationFrame(generateBackground);
  window.addEventListener("resize", handleResize, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template></template>
