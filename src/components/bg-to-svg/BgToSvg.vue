<script setup>
import { onMounted, onUnmounted } from "vue";
import { toSvg } from "html-to-image";

const props = defineProps({
  sourceSelector: { type: String, required: true },
});

async function generateBackground() {
  const src = document.getElementById(props.sourceSelector);
  if (!src) return;
  const bodyBg = getComputedStyle(document.body).backgroundColor || "#000";
  const svg = await toSvg(src, {
    width: Math.max(src.offsetWidth, 1200),
    height: Math.max(src.offsetHeight, 800),
    backgroundColor: bodyBg,
    pixelRatio: 2,
  });
  document.documentElement.style.setProperty("--global-bg", `url("${svg}")`);
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
