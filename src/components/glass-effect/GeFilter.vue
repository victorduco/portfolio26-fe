<template>
  <div ref="glassFilterEl" class="glass-filter">
    <GeFilterDisplacementMapImg
      ref="displacementMapImg"
      :filter-id="filterId"
      :intensity="props.intensity"
      :shader-corner-radius="o.shaderCornerRadius"
      :shader-distortion-start="o.shaderDistortionStart"
      :shader-distortion-end="o.shaderDistortionEnd"
      :shader-distortion-offset="o.shaderDistortionOffset"
      :shader-scaling-start="o.shaderScalingStart"
      :shader-scaling-end="o.shaderScalingEnd"
    />

    <svg
      v-if="filterReady && props.intensity >= 0.01"
      class="glass-filter__svg"
      aria-hidden="true"
    >
      <defs>
        <filter
          :id="filterId"
          x="-35%"
          y="-35%"
          width="170%"
          height="170%"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"
        >
          <feImage
            :x="maskRect.left"
            :y="maskRect.top"
            :width="maskRect.width"
            :height="maskRect.height"
            result="DISPLACEMENT_MAP"
            preserveAspectRatio="xMidYMid slice"
            :href="shaderMapUrl"
            :xlink:href="shaderMapUrl"
          />

          <GeFilterEdgeProcessing
            :surface-reflection="o.surfaceReflection"
            :intensity="props.intensity"
          />

          <feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER_ORIGINAL" />

          <GeFilterDisplacementMap
            :displacement-scale="o.displacementScale"
            :displacement-curvature="o.displacementCurvature"
            :aberration-intensity="o.aberrationIntensity"
            :intensity="props.intensity"
          />

          <GeFilterComposite
            :glass-blur="o.glassBlur"
            :refraction-depth="o.refractionDepth"
            :intensity="props.intensity"
          />

          <GeFilterEnhancement
            :glass-saturation="o.glassSaturation"
            :surface-reflection="o.surfaceReflection"
            :intensity="props.intensity"
          />
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
import GeFilterEdgeProcessing from "./GeFilterEdgeProcessing.vue";
import GeFilterDisplacementMap from "./GeFilterDisplacementMap.vue";
import GeFilterComposite from "./GeFilterComposite.vue";
import GeFilterEnhancement from "./GeFilterEnhancement.vue";

const props = defineProps({
  options: { type: Object, required: true },
  intensity: { type: Number, required: true },
});

const filterId = `apple-liquid-glass-${Math.random().toString(36).slice(2)}`;
const glassFilterEl = ref(null);
const displacementMapImg = ref(null);
const glassFilterCss = computed(() => `url(#${filterId})`);
const maskRect = ref({ left: 0, top: 0, width: 0, height: 0 });

const shaderMapUrl = computed(
  () => displacementMapImg.value?.shaderMapUrl || ""
);
const filterReady = computed(() => !!shaderMapUrl.value);

let maskElement = null;
let resizeObserver = null;
let listenersAttached = false;
let rafId = 0;

const o = props.options;

const updateMaskRect = () => {
  if (!maskElement || rafId) return;
  rafId = requestAnimationFrame(() => {
    const r = maskElement.getBoundingClientRect();
    maskRect.value = {
      left: Math.round(r.left + window.scrollX),
      top: Math.round(r.top + window.scrollY),
      width: Math.round(r.width),
      height: Math.round(r.height),
    };
    rafId = 0;
  });
};

const attachListeners = () => {
  if (listenersAttached) return;
  ["scroll", "resize"].forEach((e) =>
    window.addEventListener(
      e,
      updateMaskRect,
      e === "scroll" ? { passive: true } : undefined
    )
  );
  listenersAttached = true;
};

const detachListeners = () => {
  if (!listenersAttached) return;
  ["scroll", "resize"].forEach((e) =>
    window.removeEventListener(e, updateMaskRect)
  );
  listenersAttached = false;
};

const applyFilterToMaskElement = () => {
  let el = glassFilterEl.value?.parentElement;
  while (el && el !== document.body) {
    if (el.classList?.contains("mask-element")) {
      maskElement = el;
      maskElement.style.setProperty("--glass-filter", glassFilterCss.value);
      maskElement.style.setProperty(
        "--displacement-map-url",
        `url(${shaderMapUrl.value})`
      );
      updateMaskRect();
      resizeObserver?.disconnect();
      resizeObserver = new ResizeObserver(updateMaskRect);
      resizeObserver.observe(maskElement);
      attachListeners();
      break;
    }
    el = el.parentElement;
  }
};

onMounted(async () => {
  await nextTick();
  applyFilterToMaskElement();
});

watch(
  () => filterReady.value,
  (ready) => ready && applyFilterToMaskElement()
);

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  detachListeners();
  rafId && cancelAnimationFrame(rafId);
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
