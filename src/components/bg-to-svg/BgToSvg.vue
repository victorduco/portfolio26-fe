<script setup>
import { onMounted, onUnmounted } from "vue";
import { toSvg, toPng } from "html-to-image";

const props = defineProps({
  sourceSelector: { type: String, required: true },
});

async function generateBackground() {
  const src = document.getElementById(props.sourceSelector);
  if (!src) return;
  const bodyBg = getComputedStyle(document.body).backgroundColor || "#000";
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await delay(500);

  await document.fonts.ready;
  const img = await toSvg(src, {
    width: Math.max(src.offsetWidth),
    height: Math.max(src.offsetHeight),
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
