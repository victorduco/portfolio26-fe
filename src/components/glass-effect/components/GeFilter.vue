<!--
SVG фильтр для стеклянного эффекта
Упрощенная архитектура без DOM клонирования - используем готовый ::before псевдоэлемент
-->
<template>
  <div ref="glassFilterEl" class="glass-filter">
    <!-- SVG фильтр для displacement эффекта -->
    <svg
      v-if="filterProps.filterReady"
      class="glass-filter__svg"
      aria-hidden="true"
    >
      <defs>
        <filter
          :id="filterProps.filterId"
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
            :href="filterProps.currentMap"
          />

          <feColorMatrix
            in="DISPLACEMENT_MAP"
            type="matrix"
            :values="filterProps.edgeIntensityMatrix"
            result="EDGE_INTENSITY"
          />
          <feComponentTransfer in="EDGE_INTENSITY" result="EDGE_MASK">
            <feFuncA type="discrete" :tableValues="filterProps.edgeMaskTable" />
          </feComponentTransfer>

          <feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER_ORIGINAL" />

          <feDisplacementMap
            in="SourceGraphic"
            in2="DISPLACEMENT_MAP"
            xChannelSelector="R"
            yChannelSelector="B"
            :scale="filterProps.redScale"
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
            :scale="filterProps.greenScale"
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
            :scale="filterProps.blueScale"
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
            :stdDeviation="filterProps.liquidGlassBlur"
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
            :values="filterProps.surfaceEnhancementMatrix"
          />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script setup>
import { computed, onMounted, watch, nextTick, ref } from "vue";

const props = defineProps({
  filterProps: {
    type: Object,
    required: true,
  },
});

const glassFilterEl = ref(null);
const glassFilterCss = computed(() => `url(#${props.filterProps.filterId})`);

const applyFilterToMaskElement = () => {
  console.log("🔍 GeFilter: Trying to apply filter");
  console.log("filterReady:", props.filterProps.filterReady);
  console.log("filterId:", props.filterProps.filterId);
  console.log("glassFilterCss:", glassFilterCss.value);
  console.log("glassFilterEl.value:", glassFilterEl.value);

  // Start from the GeFilter element and traverse up to find mask-element
  let currentEl = glassFilterEl.value?.parentElement;
  let maskElement = null;

  console.log("Starting traversal from:", currentEl?.className);

  // Traverse up the DOM tree to find the mask-element
  while (currentEl && currentEl !== document.body) {
    console.log(
      "Checking element:",
      currentEl.className,
      "has mask-element:",
      currentEl.classList?.contains("mask-element")
    );
    if (currentEl.classList && currentEl.classList.contains("mask-element")) {
      maskElement = currentEl;
      break;
    }
    currentEl = currentEl.parentElement;
  }

  console.log("maskElement found:", !!maskElement);

  if (maskElement && props.filterProps.filterReady) {
    // Применяем SVG фильтр к :before псевдоэлементу через CSS переменную
    maskElement.style.setProperty("--glass-filter", glassFilterCss.value);
    console.log(
      "✅ CSS variable --glass-filter applied to :before element:",
      glassFilterCss.value
    );

    // Log SVG filter details
    console.log("🔍 SVG Filter Debug:", {
      filterId: props.filterProps.filterId,
      redScale: props.filterProps.redScale,
      greenScale: props.filterProps.greenScale,
      blueScale: props.filterProps.blueScale,
      edgeMaskTable: props.filterProps.edgeMaskTable,
      currentMapLength: props.filterProps.currentMap?.length,
    });
  } else {
    console.log(
      "❌ Filter not applied. maskElement:",
      !!maskElement,
      "filterReady:",
      props.filterProps.filterReady
    );
  }
};

onMounted(async () => {
  await nextTick();
  applyFilterToMaskElement();
});

watch(
  () => props.filterProps.filterId,
  (newFilterId) => {
    if (newFilterId) {
      applyFilterToMaskElement();
    }
  }
);

watch(
  () => props.filterProps.filterReady,
  (ready) => {
    if (ready) {
      applyFilterToMaskElement();
    }
  }
);
</script>

<style scoped>
.glass-filter {
  position: absolute;
  inset: 0;
  z-index: 0;
}
</style>
