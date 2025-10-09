<script setup>
/**
 * GeBackground Component
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
import { onMounted, watch, nextTick } from "vue";
import { toPng } from "html-to-image";

const props = defineProps({
  sourceSelector: { type: String, required: true },
  watchData: { type: [Array, Object, String, Number], default: null },
  renderDelay: { type: Number, default: 100 },
  backgroundStyles: { type: Object },
});

let isGenerating = false;

const sanitizeStyles = (styles) => {
  if (!styles) return undefined;
  const entries = Object.entries(styles).filter(([, value]) => value != null);
  return entries.length ? Object.fromEntries(entries) : undefined;
};

async function generateBackground() {
  if (isGenerating) return;
  isGenerating = true;

  const src = document.getElementById(props.sourceSelector);
  if (!src) {
    isGenerating = false;
    return;
  }

  const bodyBg = getComputedStyle(document.body).backgroundColor || "#000";
  const sanitizedStyles = sanitizeStyles(props.backgroundStyles);

  await new Promise((resolve) => setTimeout(resolve, props.renderDelay));
  await document.fonts.ready;

  const img = await toPng(src, {
    width: src.offsetWidth,
    height: src.offsetHeight,
    backgroundColor: bodyBg,
    pixelRatio: 1,
    style: sanitizedStyles,
  });

  document.documentElement.style.setProperty(
    "--global-keypad-bg",
    `url("${img}")`
  );

  isGenerating = false;
}

watch(
  () => [props.watchData, props.backgroundStyles],
  async () => {
    await nextTick();
    requestAnimationFrame(generateBackground);
  },
  { deep: true }
);

onMounted(() => {
  requestAnimationFrame(generateBackground);
});
</script>
