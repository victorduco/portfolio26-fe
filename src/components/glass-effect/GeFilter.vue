<!--
SVG фильтр для стеклянного эффекта
Упрощенная архитектура без DOM клонирования - используем готовый ::before псевдоэлемент
-->
<template>
  <div ref="glassFilterEl" class="glass-filter">
    <!-- SVG с displacement картой как отдельный элемент (источник пикселей тот же, что и в feImage) -->
    <svg
      v-if="filterReady && props.intensity >= 0.01"
      class="glass-filter__displacement-svg"
      aria-hidden="true"
    >
      <image
        :id="`${filterId}-displacement-image`"
        x="0"
        y="0"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        :href="shaderMapUrl"
        :xlink:href="shaderMapUrl"
      />
    </svg>

    <!-- SVG фильтр для displacement эффекта -->
    <svg v-if="filterReady && props.intensity >= 0.01" class="glass-filter__svg" aria-hidden="true">
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
          <!-- ВАЖНО: кормим тем же URL, что и ::before; позиционируем в координатах страницы -->
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

          <feColorMatrix
            in="DISPLACEMENT_MAP"
            type="matrix"
            :values="edgeIntensityMatrix"
            result="EDGE_INTENSITY"
          />
          <feComponentTransfer in="EDGE_INTENSITY" result="EDGE_MASK">
            <feFuncA type="discrete" :tableValues="edgeMaskTable" />
          </feComponentTransfer>

          <feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER_ORIGINAL" />

          <feDisplacementMap
            in="SourceGraphic"
            in2="DISPLACEMENT_MAP"
            xChannelSelector="R"
            yChannelSelector="B"
            :scale="redScale"
            result="RED_DISPLACED"
          />
          <feColorMatrix
            in="RED_DISPLACED"
            type="matrix"
            values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
            result="RED_CHANNEL"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="DISPLACEMENT_MAP"
            xChannelSelector="R"
            yChannelSelector="B"
            :scale="greenScale"
            result="GREEN_DISPLACED"
          />
          <feColorMatrix
            in="GREEN_DISPLACED"
            type="matrix"
            values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
            result="GREEN_CHANNEL"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="DISPLACEMENT_MAP"
            xChannelSelector="R"
            yChannelSelector="B"
            :scale="blueScale"
            result="BLUE_DISPLACED"
          />
          <feColorMatrix
            in="BLUE_DISPLACED"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0"
            result="BLUE_CHANNEL"
          />

          <feBlend
            in="GREEN_CHANNEL"
            in2="BLUE_CHANNEL"
            mode="screen"
            result="GB_COMBINED"
          />
          <feBlend
            in="RED_CHANNEL"
            in2="GB_COMBINED"
            mode="screen"
            result="RGB_COMBINED"
          />

          <feGaussianBlur
            :stdDeviation="liquidGlassBlur"
            in="RGB_COMBINED"
            result="ABERRATED_BLURRED"
          />

          <feComposite
            in="ABERRATED_BLURRED"
            in2="EDGE_MASK"
            operator="in"
            result="EDGE_ABERRATION"
          />

          <feComponentTransfer in="EDGE_MASK" result="INVERTED_MASK">
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feComposite
            in="CENTER_ORIGINAL"
            in2="INVERTED_MASK"
            operator="in"
            result="CENTER_CLEAN"
          />

          <feComposite
            in="EDGE_ABERRATION"
            in2="CENTER_CLEAN"
            operator="over"
            result="FINAL_EFFECT"
          />

          <feColorMatrix
            in="FINAL_EFFECT"
            type="matrix"
            :values="surfaceEnhancementMatrix"
          />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, watch, nextTick, ref } from "vue";
import { ShaderDisplacementGenerator } from "./ShaderDisplacementGenerator.ts";

const props = defineProps({
  options: { type: Object, required: true },
  intensity: { type: Number, required: true },
});

const filterId = `apple-liquid-glass-${Math.random().toString(36).slice(2)}`;
const filterReady = ref(false);
const shaderMapUrl = ref("");
const glassFilterEl = ref(null);
const glassFilterCss = computed(() => `url(#${filterId})`);
const maskRect = ref({ left: 0, top: 0, width: 0, height: 0 });

let maskElement = null;
let resizeObserver = null;
let listenersAttached = false;
let rafId = 0;

const generateShaderDisplacementMap = () => {
  const o = props.options;
  const generator = new ShaderDisplacementGenerator({
    width: 400,
    height: 400,
    cornerRadius: o.shaderCornerRadius,
    distortionStart: o.shaderDistortionStart,
    distortionEnd: o.shaderDistortionEnd,
    distortionOffset: o.shaderDistortionOffset,
    scalingStart: o.shaderScalingStart,
    scalingEnd: o.shaderScalingEnd,
  });
  shaderMapUrl.value = generator.updateShader();
  filterReady.value = true;
  generator.destroy();
};

const o = props.options;

const baseScale = computed(() => o.displacementScale * o.displacementCurvature * props.intensity);

const redScale = computed(() => baseScale.value * (1 + o.aberrationIntensity * 0.01));
const greenScale = computed(() => baseScale.value);
const blueScale = computed(() => baseScale.value * (1 - o.aberrationIntensity * 0.01));
const liquidGlassBlur = computed(() => {
  const minBlur = 0.12 * props.intensity;
  return Math.max(minBlur, o.glassBlur * 0.02 * o.refractionDepth * props.intensity);
});
const edgeMaskTable = "0 0.1 1";

const edgeIntensityMatrix = computed(() => {
  const si = o.surfaceReflection * props.intensity;
  const sv = 0.3 * si;
  return `${sv} ${sv} ${sv} 0 0 ${sv} ${sv} ${sv} 0 0 ${sv} ${sv} ${sv} 0 0 0 0 0 1 0`;
});

const surfaceEnhancementMatrix = computed(() => {
  const si = o.surfaceReflection * props.intensity;
  const contrastEffect = (o.glassSaturation - 180) / 300;
  const contrast = 1 + contrastEffect * props.intensity;
  const brightness = 1 + si * 0.2;
  const bv = brightness * 0.1;
  return `${contrast} 0 0 0 ${bv} 0 ${contrast} 0 0 ${bv} 0 0 ${contrast} 0 ${bv} 0 0 0 1 0`;
});

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
  ["scroll", "resize"].forEach(e => window.addEventListener(e, updateMaskRect, e === "scroll" ? { passive: true } : undefined));
  listenersAttached = true;
};

const detachListeners = () => {
  if (!listenersAttached) return;
  ["scroll", "resize"].forEach(e => window.removeEventListener(e, updateMaskRect));
  listenersAttached = false;
};

const applyFilterToMaskElement = () => {
  let el = glassFilterEl.value?.parentElement;
  while (el && el !== document.body) {
    if (el.classList?.contains("mask-element")) {
      maskElement = el;
      maskElement.style.setProperty("--glass-filter", glassFilterCss.value);
      maskElement.style.setProperty("--displacement-map-url", `url(${shaderMapUrl.value})`);
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
  generateShaderDisplacementMap();
});

watch(() => filterReady.value, (ready) => ready && applyFilterToMaskElement());

watch(
  () => [
    props.options.shaderCornerRadius,
    props.options.shaderDistortionStart,
    props.options.shaderDistortionEnd,
    props.options.shaderDistortionOffset,
    props.options.shaderScalingStart,
    props.options.shaderScalingEnd,
  ],
  () => generateShaderDisplacementMap(),
  { deep: true }
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
