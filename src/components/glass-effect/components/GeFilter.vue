<!--
SVG фильтр для стеклянного эффекта
Упрощенная архитектура без DOM клонирования - используем готовый ::before псевдоэлемент
-->
<template>
  <div ref="glassFilterEl" class="glass-filter">
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
        >
          <feImage
            x="0"
            y="0"
            width="100%"
            height="100%"
            result="DISPLACEMENT_MAP"
            preserveAspectRatio="xMidYMid slice"
            :href="shaderMapUrl"
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

    <!-- <div
      v-if="shaderMapUrl"
      class="glass-filter__shader-map"
      :style="{ backgroundImage: `url(${shaderMapUrl})` }"
    /> -->
  </div>
</template>

<script setup>
import { computed, onMounted, watch, nextTick, ref } from "vue";
import { ShaderDisplacementGenerator } from "../filter-displacement-generator.ts";
import { createFilterProps } from "../layer-filter-props.js";

const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
  intensity: {
    type: Number,
    required: true,
  },
});

// Filter state
const filterId = `apple-liquid-glass-${Math.random().toString(36).slice(2)}`;
const filterReady = ref(false);
const shaderMapUrl = ref("");

const glassFilterEl = ref(null);
const glassFilterCss = computed(() => `url(#${filterId})`);

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

// Create filter props
const filterProps = computed(() =>
  createFilterProps(props.options, props.intensity, {
    filterReady: filterReady.value,
    filterId,
    shaderMapUrl: shaderMapUrl.value,
  })
);

// Extract computed filter properties
const edgeIntensityMatrix = computed(
  () => filterProps.value.edgeIntensityMatrix
);
const edgeMaskTable = computed(() => filterProps.value.edgeMaskTable);
const redScale = computed(() => filterProps.value.redScale);
const greenScale = computed(() => filterProps.value.greenScale);
const blueScale = computed(() => filterProps.value.blueScale);
const liquidGlassBlur = computed(() => filterProps.value.liquidGlassBlur);
const surfaceEnhancementMatrix = computed(
  () => filterProps.value.surfaceEnhancementMatrix
);

const applyFilterToMaskElement = () => {
  // Start from the GeFilter element and traverse up to find mask-element
  let currentEl = glassFilterEl.value?.parentElement;
  let maskElement = null;

  // Traverse up the DOM tree to find the mask-element
  while (currentEl && currentEl !== document.body) {
    if (currentEl.classList && currentEl.classList.contains("mask-element")) {
      maskElement = currentEl;
      break;
    }
    currentEl = currentEl.parentElement;
  }

  if (maskElement && filterReady.value) {
    // Применяем SVG фильтр к mask-element-inner через CSS переменную
    maskElement.style.setProperty("--glass-filter", glassFilterCss.value);
  }
};

// Initialize shader on mount
onMounted(async () => {
  generateShaderDisplacementMap();
  await nextTick();
  applyFilterToMaskElement();
});

watch(
  () => filterId,
  (newFilterId) => {
    if (newFilterId) {
      applyFilterToMaskElement();
    }
  }
);

watch(
  () => filterReady.value,
  (ready) => {
    if (ready) {
      applyFilterToMaskElement();
    }
  }
);

// Expose filterId and shaderMapUrl to parent component
defineExpose({
  filterId,
  shaderMapUrl,
});
</script>

<style scoped>
.glass-filter {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.glass-filter__shader-map {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 9999;
}
</style>
