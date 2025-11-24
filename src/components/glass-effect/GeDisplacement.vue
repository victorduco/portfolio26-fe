<template>
  <div ref="glassFilterEl" class="glass-filter">
    <svg v-if="props.staticDisplacementMap && props.intensity >= 0.01" class="glass-filter__svg" aria-hidden="true">
      <defs>
        <filter :id="filterId" color-interpolation-filters="sRGB">
          <feImage :x="maskRect.left" :y="maskRect.top" :width="maskRect.width" :height="maskRect.height" result="DISPLACEMENT_MAP" preserveAspectRatio="xMidYMid slice" :href="props.staticDisplacementMap" />
          <GeFilterDisplacementMap :displacement-scale="props.options.displacementScale" :intensity="props.intensity" />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, nextTick, ref } from "vue";
import GeFilterDisplacementMap from "./GeFilterDisplacementMap.vue";
import { layoutBatcher } from "@/directives/mask-element/layoutBatcher";

const props = defineProps({
  options: { type: Object, required: true },
  intensity: { type: Number, required: true },
  staticDisplacementMap: { type: String, required: true },
});

const filterId = `glass-effect-${Math.random().toString(36).slice(2)}`;
const glassFilterEl = ref(null);
const maskRect = ref({ left: 0, top: 0, width: 0, height: 0 });
let maskElement = null;
let resizeObserver = null;

const updateMaskRect = () => {
  if (!maskElement) return;
  layoutBatcher.scheduleTask(
    () => maskElement.getBoundingClientRect(),
    (rect) => {
      if (!rect) return;
      const r = (v) => Math.round(v / 4) * 4;
      maskRect.value = { left: r(rect.left + scrollX), top: r(rect.top + scrollY), width: r(rect.width), height: r(rect.height) };
    }
  );
};

onMounted(async () => {
  await nextTick();
  let el = glassFilterEl.value?.parentElement;
  while (el && !el.classList?.contains("mask-element")) el = el.parentElement;
  if (!el) return;
  maskElement = el;
  maskElement.style.setProperty("--glass-filter", `blur(10px) url(#${filterId})`);
  updateMaskRect();
  resizeObserver = new ResizeObserver(updateMaskRect);
  resizeObserver.observe(maskElement);
  window.addEventListener("scroll", updateMaskRect, { passive: true });
  window.addEventListener("resize", updateMaskRect);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener("scroll", updateMaskRect);
  window.removeEventListener("resize", updateMaskRect);
});

defineExpose({ filterId });
</script>

<style scoped>
.glass-filter { position: absolute; inset: 0; z-index: 0; }
</style>
