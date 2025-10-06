<template>
  <div ref="glassFilterEl" class="glass-filter">
    <GeFilterDisplacementMapImg
      v-if="props.displacementMode === 'dynamic'"
      ref="displacementMapImg"
      :filter-id="filterId"
      :intensity="props.intensity"
      :shader-corner-radius="o.shaderCornerRadius"
      :shader-rect-width="o.shaderRectWidth"
      :shader-rect-height="o.shaderRectHeight"
      :shader-center-offset-x="o.shaderCenterOffsetX"
      :shader-center-offset-y="o.shaderCenterOffsetY"
      :shader-edge-softness="o.shaderEdgeSoftness"
      :shader-distortion-start="o.shaderDistortionStart"
      :shader-distortion-end="o.shaderDistortionEnd"
      :shader-distortion-offset="o.shaderDistortionOffset"
      :shader-scaling-start="o.shaderScalingStart"
      :shader-scaling-end="o.shaderScalingEnd"
    />

    <svg
      v-if="(shaderMapUrl || staticDisplacementMap) && props.intensity >= 0.01"
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
            :href="displacementMapUrl"
          />

          <GeFilterDisplacementMap
            :displacement-scale="o.displacementScale"
            :displacement-curvature="o.displacementCurvature"
            :intensity="props.intensity"
          />

          <!-- <GeFilterComposite
            :glass-blur="o.glassBlur"
            :refraction-depth="o.refractionDepth"
            :intensity="props.intensity"
          />

          <GeFilterEnhancement
            :glass-saturation="o.glassSaturation"
            :surface-reflection="o.surfaceReflection"
            :intensity="props.intensity"
          /> -->
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
  ref,
} from "vue";
import GeFilterDisplacementMapImg from "./GeFilterDisplacementMapImg.vue";
import GeFilterDisplacementMap from "./GeFilterDisplacementMap.vue";
import GeFilterComposite from "./GeFilterComposite.vue";
import GeFilterEnhancement from "./GeFilterEnhancement.vue";
import mp3TstImage from "@/assets/distmaps/mp3-34-thin.png";
import { layoutBatcher } from "@/directives/mask-element/layoutBatcher";
const props = defineProps({
  options: { type: Object, required: true },
  intensity: { type: Number, required: true },
  staticDisplacementMap: { type: String, default: null },
  displacementMode: { type: String, default: "static" },
});

const { options: o } = props;
const filterId = `apple-liquid-glass-${Math.random().toString(36).slice(2)}`;
const glassFilterEl = ref(null);
const displacementMapImg = ref(null);
const maskRect = ref({ left: 0, top: 0, width: 0, height: 0 });
const logPrefix = `[GeFilter:${filterId}]`;
const shaderMapUrl = computed(
  () => displacementMapImg.value?.shaderMapUrl || ""
);

const displacementMapUrl = computed(() => {
  if (props.displacementMode === "static" && props.staticDisplacementMap) {
    return props.staticDisplacementMap;
  }
  if (props.displacementMode === "dynamic") {
    return shaderMapUrl.value || mp3TstImage;
  }
  return props.staticDisplacementMap || mp3TstImage;
});

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
  maskElement.style.setProperty(
    "--displacement-map-url",
    `url(${shaderMapUrl.value})`
  );
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

// watch(shaderMapUrl, (url) => url && applyFilterToMaskElement());

onBeforeUnmount(() => {
  console.log(`${logPrefix} onBeforeUnmount`);
  cleanup();
});

defineExpose({ filterId, shaderMapUrl });
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
