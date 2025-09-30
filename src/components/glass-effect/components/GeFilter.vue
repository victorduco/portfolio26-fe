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
          <!-- ТЕСТ: простой blur для проверки -->
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
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
      "✅ CSS variable --glass-filter applied to mask-element:",
      glassFilterCss.value
    );

    // Find .mask-element-inner and check if filter is applied
    const innerElement = maskElement.querySelector('.mask-element-inner');
    if (innerElement) {
      const computedStyle = getComputedStyle(innerElement);
      console.log("🔍 .mask-element-inner found! Computed filter:", computedStyle.filter);
      console.log("🔍 .mask-element-inner visibility:", {
        display: computedStyle.display,
        opacity: computedStyle.opacity,
        zIndex: computedStyle.zIndex,
        position: computedStyle.position,
        width: computedStyle.width,
        height: computedStyle.height,
      });
    } else {
      console.log("❌ .mask-element-inner NOT FOUND in", maskElement);
    }

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
