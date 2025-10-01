<!--
SVG фильтр для стеклянного эффекта
Упрощенная архитектура без DOM клонирования - используем готовый ::before псевдоэлемент
-->
<template>
  <div ref="glassFilterEl" class="glass-filter">
    <!-- SVG с displacement картой как отдельный элемент (источник пикселей тот же, что и в feImage) -->
    <svg
      v-if="filterReady"
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
    <svg v-if="filterReady" class="glass-filter__svg" aria-hidden="true">
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

// Filter state
const filterId = `apple-liquid-glass-${Math.random().toString(36).slice(2)}`;
const filterReady = ref(false);
const shaderMapUrl = ref("");

const glassFilterEl = ref(null);
const glassFilterCss = computed(() => `url(#${filterId})`);

// Mask element rect tracking
const maskRect = ref({ left: 0, top: 0, width: 0, height: 0 });
let maskElement = null;
let resizeObserver = null;
let listenersAttached = false;
let rafId = 0;

// Generate shader displacement map
const generateShaderDisplacementMap = () => {
  const generator = new ShaderDisplacementGenerator({
    width: 400,
    height: 400,
    cornerRadius: props.options.shaderCornerRadius,
    distortionStart: props.options.shaderDistortionStart,
    distortionEnd: props.options.shaderDistortionEnd,
    distortionOffset: props.options.shaderDistortionOffset,
    scalingStart: props.options.shaderScalingStart,
    scalingEnd: props.options.shaderScalingEnd,
  });
  const url = generator.updateShader();
  filterReady.value = true;
  shaderMapUrl.value = url;
  generator.destroy();
};

// Inline filter props calculation
const o = props.options;
const i = props.intensity;
const baseScale = o.displacementScale * o.displacementCurvature * i;
const redScale = computed(() => baseScale * (1 + o.aberrationIntensity * 0.01));
const greenScale = computed(() => baseScale);
const blueScale = computed(() => baseScale * (1 - o.aberrationIntensity * 0.01));
const liquidGlassBlur = computed(() => Math.max(0.12, o.glassBlur * 0.02 * o.refractionDepth * i));
const edgeMaskTable = computed(() => "0 0.1 1");

const si = o.surfaceReflection;
const edgeIntensityMatrix = computed(() =>
  `${0.3 * si} ${0.3 * si} ${0.3 * si} 0 0
   ${0.3 * si} ${0.3 * si} ${0.3 * si} 0 0
   ${0.3 * si} ${0.3 * si} ${0.3 * si} 0 0
   0 0 0 1 0`
);

const contrast = 1 + (o.glassSaturation - 180) / 300;
const brightness = 1 + si * 0.2;
const surfaceEnhancementMatrix = computed(() =>
  `${contrast} 0 0 0 ${brightness * 0.1}
   0 ${contrast} 0 0 ${brightness * 0.1}
   0 0 ${contrast} 0 ${brightness * 0.1}
   0 0 0 1 0`
);

// rAF-throttle rect read with change detection
let lastRect = null;
const updateMaskRect = () => {
  if (!maskElement) return;
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    const r = maskElement.getBoundingClientRect();
    const newRect = {
      left: Math.round(r.left + window.scrollX),
      top: Math.round(r.top + window.scrollY),
      width: Math.round(r.width),
      height: Math.round(r.height),
    };

    // Only update if values actually changed
    if (!lastRect ||
        lastRect.left !== newRect.left ||
        lastRect.top !== newRect.top ||
        lastRect.width !== newRect.width ||
        lastRect.height !== newRect.height) {
      maskRect.value = newRect;
      lastRect = newRect;
    }
    rafId = 0;
  });
};

function attachListeners() {
  if (listenersAttached) return;
  window.addEventListener("scroll", updateMaskRect, { passive: true });
  window.addEventListener("resize", updateMaskRect);
  listenersAttached = true;
}
function detachListeners() {
  if (!listenersAttached) return;
  window.removeEventListener("scroll", updateMaskRect);
  window.removeEventListener("resize", updateMaskRect);
  listenersAttached = false;
}

const applyFilterToMaskElement = () => {
  // Идём вверх от glassFilterEl и ищем .mask-element
  let currentEl = glassFilterEl.value?.parentElement;
  maskElement = null;
  while (currentEl && currentEl !== document.body) {
    if (currentEl.classList?.contains("mask-element")) {
      maskElement = currentEl;
      break;
    }
    currentEl = currentEl.parentElement;
  }

  if (maskElement) {
    // Применяем SVG фильтр к целевому слою через CSS-переменную
    maskElement.style.setProperty("--glass-filter", glassFilterCss.value);
    // И URL карты для ::before
    maskElement.style.setProperty(
      "--displacement-map-url",
      `url(${shaderMapUrl.value})`
    );

    updateMaskRect();

    // Обновление по изменениям размера
    resizeObserver?.disconnect();
    resizeObserver = new ResizeObserver(updateMaskRect);
    resizeObserver.observe(maskElement);

    attachListeners();
  }
};

// Initialize
onMounted(async () => {
  await nextTick();
  // 1) Сначала найдём цель и измерим rect (чтобы первый кадр был ровный)
  applyFilterToMaskElement();
  // 2) Потом генерим карту (источник пикселей единый для ::before и feImage)
  generateShaderDisplacementMap();
});

watch(
  () => filterReady.value,
  (ready) => {
    if (ready) applyFilterToMaskElement();
  }
);

// Cleanup
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  detachListeners();
  if (rafId) cancelAnimationFrame(rafId);
});

// Expose to parent
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
