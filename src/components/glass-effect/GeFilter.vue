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
      v-if="shaderMapUrl && props.intensity >= 0.01"
      class="glass-filter__svg"
      aria-hidden="true"
    >
      <defs>
        <!-- вернуть если надо 
         filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"           x="-35%"
          y="-35%"
          width="170%"
          height="170%"-->
        <filter :id="filterId" color-interpolation-filters="sRGB">
          <feImage
            :x="maskRect.left"
            :y="maskRect.top"
            :width="maskRect.width"
            :height="maskRect.height"
            result="DISPLACEMENT_MAP"
            preserveAspectRatio="xMidYMid slice"
            :href="mp3TstImage"
          />

          <GeFilterEdgeProcessing
            :surface-reflection="o.surfaceReflection"
            :intensity="props.intensity"
          />

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
import mp1Image from "@/assets/mp1.png";
import mp2Image from "@/assets/mp2.png";
import mp3TstImage from "@/assets/mp3-34-thin.png";
const props = defineProps({
  options: { type: Object, required: true },
  intensity: { type: Number, required: true },
});

const { options: o } = props;
const filterId = `apple-liquid-glass-${Math.random().toString(36).slice(2)}`;
const glassFilterEl = ref(null);
const displacementMapImg = ref(null);
const maskRect = ref({ left: 0, top: 0, width: 0, height: 0 });
const shaderMapUrl = computed(
  () => displacementMapImg.value?.shaderMapUrl || ""
);

let maskElement = null;
let resizeObserver = null;
let rafId = 0;

const updateMaskRect = () => {
  if (!maskElement || rafId) return;
  rafId = requestAnimationFrame(() => {
    const { left, top, width, height } = maskElement.getBoundingClientRect();
    maskRect.value = {
      left: Math.round(left + window.scrollX),
      top: Math.round(top + window.scrollY),
      width: Math.round(width),
      height: Math.round(height),
    };
    rafId = 0;
  });
};

const toggleListeners = (attach) => {
  const method = attach ? "addEventListener" : "removeEventListener";
  window[method]("scroll", updateMaskRect, { passive: true });
  window[method]("resize", updateMaskRect);
};

const cleanup = () => {
  resizeObserver?.disconnect();
  toggleListeners(false);
  rafId && cancelAnimationFrame(rafId);
};

const applyFilterToMaskElement = () => {
  // Try to find .mask-element - it can be a parent or the wrapper itself
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
  maskElement.style.setProperty(
    "--displacement-map-url",
    `url(${shaderMapUrl.value})`
  );

  updateMaskRect();
  resizeObserver?.disconnect();
  resizeObserver = new ResizeObserver(updateMaskRect);
  resizeObserver.observe(maskElement);
  toggleListeners(true);
};

onMounted(async () => {
  await nextTick();
  applyFilterToMaskElement();
});

watch(shaderMapUrl, (url) => url && applyFilterToMaskElement());

onBeforeUnmount(cleanup);

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
