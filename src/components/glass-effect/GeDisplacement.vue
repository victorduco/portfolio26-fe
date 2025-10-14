<template>
  <div ref="glassFilterEl" class="glass-filter">
    <svg
      v-if="props.staticDisplacementMap && props.intensity >= 0.01"
      class="glass-filter__svg"
      aria-hidden="true"
    >
      <defs>
        <filter :id="filterId" color-interpolation-filters="sRGB">
          <feImage
            :x="maskRect.left"
            :y="maskRect.top"
            :width="maskRect.width"
            :height="maskRect.height"
            result="DISPLACEMENT_MAP"
            preserveAspectRatio="xMidYMid slice"
            :href="props.staticDisplacementMap"
          />
          <GeFilterDisplacementMap
            :displacement-scale="o.displacementScale"
            :intensity="props.intensity"
          />
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

const { options: o } = props;
const filterId = `apple-liquid-glass-${Math.random().toString(36).slice(2)}`;
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
      maskRect.value = {
        left: Math.round(rect.left + window.scrollX),
        top: Math.round(rect.top + window.scrollY),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    }
  );
};

const toggleListeners = (attach) => {
  const method = attach ? "addEventListener" : "removeEventListener";
  window[method]("scroll", updateMaskRect, { passive: true });
  window[method]("resize", updateMaskRect);
};

const cleanup = () => {
  resizeObserver?.disconnect();
  toggleListeners(false);
};

const applyFilterToMaskElement = () => {
  let el = glassFilterEl.value?.parentElement;
  while (el) {
    if (el.classList?.contains("mask-element")) {
      maskElement = el;
      break;
    }
    el = el.parentElement;
  }

  if (!maskElement) return;

  maskElement.style.setProperty("--glass-filter", `url(#${filterId})`);
  updateMaskRect();

  resizeObserver = new ResizeObserver(updateMaskRect);
  resizeObserver.observe(maskElement);
  toggleListeners(true);
};

onMounted(async () => {
  await nextTick();
  applyFilterToMaskElement();
});

onBeforeUnmount(cleanup);

defineExpose({ filterId });
</script>

<style scoped>
.glass-filter {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.glass-filter__displacement-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  opacity: 0;
}
</style>
