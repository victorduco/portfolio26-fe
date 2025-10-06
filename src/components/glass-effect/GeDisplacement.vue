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
import {
  onMounted,
  onBeforeUnmount,
  nextTick,
  ref,
} from "vue";
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
const logPrefix = `[GeDisplacement:${filterId}]`;

let maskElement = null;
let resizeObserver = null;

const updateMaskRect = (source) => {
  const reason = typeof source === "string" ? source : source?.type || "manual";

  if (!maskElement) {
    console.log(`${logPrefix} updateMaskRect skipped (no maskElement)`, {
      reason,
    });
    return;
  }

  console.log(`${logPrefix} updateMaskRect scheduled`, { reason });

  layoutBatcher.scheduleTask(
    // READ фаза
    () => {
      console.log(`${logPrefix} layoutBatcher READ start`, { reason });
      const rect = maskElement.getBoundingClientRect();
      console.log(`${logPrefix} layoutBatcher READ end`, rect);
      return rect;
    },
    // WRITE фаза
    (rect) => {
      if (!rect) {
        console.log(`${logPrefix} layoutBatcher WRITE skipped (rect null)`, {
          reason,
        });
        return;
      }
      const nextRect = {
        left: Math.round(rect.left + window.scrollX),
        top: Math.round(rect.top + window.scrollY),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
      console.log(`${logPrefix} layoutBatcher WRITE apply`, nextRect);
      maskRect.value = nextRect;
    }
  );
};

const toggleListeners = (attach) => {
  const method = attach ? "addEventListener" : "removeEventListener";
  console.log(`${logPrefix} ${attach ? "attach" : "detach"} window listeners`);
  window[method]("scroll", updateMaskRect, { passive: true });
  window[method]("resize", updateMaskRect);
};

const cleanup = () => {
  console.log(`${logPrefix} cleanup start`);
  resizeObserver?.disconnect();
  resizeObserver = null;
  toggleListeners(false);
  console.log(`${logPrefix} cleanup end`);
};

const applyFilterToMaskElement = () => {
  console.log(`${logPrefix} applyFilterToMaskElement start`);
  // Try to find .mask-element - it can be a parent or the wrapper itself
  let el = glassFilterEl.value?.parentElement;
  while (el) {
    if (el.classList?.contains("mask-element")) {
      maskElement = el;
      break;
    }
    el = el.parentElement;
  }

  if (!maskElement) {
    console.log(`${logPrefix} mask-element not found`);
    return;
  }

  console.log(`${logPrefix} mask-element found`, maskElement);
  maskElement.style.setProperty("--glass-filter", `url(#${filterId})`);
  console.log(`${logPrefix} CSS variables set`);

  updateMaskRect("initial");
  resizeObserver?.disconnect();
  resizeObserver = new ResizeObserver((entries) => {
    console.log(`${logPrefix} ResizeObserver callback`, entries);
    updateMaskRect("resize-observer");
  });
  resizeObserver.observe(maskElement);
  console.log(`${logPrefix} resizeObserver attached`);
  toggleListeners(true);
};

onMounted(async () => {
  console.log(`${logPrefix} onMounted start`);
  await nextTick();
  console.log(`${logPrefix} nextTick resolved`);
  applyFilterToMaskElement();
  console.log(`${logPrefix} onMounted end`);
});

onBeforeUnmount(() => {
  console.log(`${logPrefix} onBeforeUnmount`);
  cleanup();
});

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
