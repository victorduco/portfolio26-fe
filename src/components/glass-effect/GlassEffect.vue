<template>
  <section class="liquid-glass">
    <SvgFilter v-bind="filterProps" />

    <div
      ref="glassElementRef"
      class="liquid-glass__card"
      :style="combinedCardStyle"
    >
      <!-- DOM источник для фона для sourceElementId -->
      <div
        class="liquid-glass__layer liquid-glass__layer--dom-source"
        v-html="domSourceContent"
        :style="domSourceStyle"
      />

      <div class="liquid-glass__layer liquid-glass__layer--highlight" />
      <div class="liquid-glass__layer liquid-glass__layer--noise" />
      <div class="liquid-glass__content">
        <slot />
      </div>
      <div class="liquid-glass__layer liquid-glass__layer--light" />
      <div class="liquid-glass__outline" />
    </div>
  </section>
</template>

<script setup>
import { computed, toRef, ref, onMounted, onBeforeUnmount, watch } from "vue";
import getGlassEffects from "./index.js";
import SvgFilter from "./SvgFilter.vue";

const props = defineProps({
  sourceElementId: {
    type: String,
    default: "",
  },
  glassConfig: {
    type: Object,
    default: () => ({}),
  },
  intensity: {
    type: Number,
    default: 1,
    validator: (value) => value >= 0 && value <= 1,
  },
});

const sourceElementId = toRef(props, "sourceElementId");

const {
  filterProps,
  glassElementRef,
  cardStyle,
  liquidStyle,
  noiseStyle,
  surfaceHighlightStyle,
  lightStyle,
  outlineStyle,
} = getGlassEffects({
  ...props.glassConfig,
  sourceElementId,
  intensity: toRef(props, "intensity"),
});

// DOM источник контента
const domSourceContent = ref("");
let rafId = 0;

const getDomSourceContent = () => {
  const sourceElement = document.getElementById(props.sourceElementId);
  domSourceContent.value = sourceElement.outerHTML;
};

// Обновление позиции с RAF для плавности (как в IntroDistortion)
const scheduleUpdate = () => {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    // Принудительное обновление computed
    if (glassElementRef.value) {
      glassElementRef.value.getBoundingClientRect();
    }
  });
};

// Стили для DOM источника с логикой из IntroDistortion
const domSourceStyle = computed(() => {
  const sourceElement = document.getElementById(props.sourceElementId);

  if (!glassElementRef.value || !sourceElement) {
    return {};
  }

  const glassRect = glassElementRef.value.getBoundingClientRect();
  const sourceRect = sourceElement.getBoundingClientRect();

  const offsetX = Math.round(glassRect.left - sourceRect.left);
  const offsetY = Math.round(glassRect.top - sourceRect.top);

  return {
    position: "absolute",
    top: 0,
    left: 0,
    width: `${Math.round(sourceRect.width)}px`,
    height: `${Math.round(sourceRect.height)}px`,
    transform: `translate3d(${-offsetX}px, ${-offsetY}px, 0)`,
    filter: liquidStyle.value.filter,
    opacity: liquidStyle.value.opacity,
    overflow: "hidden",
    pointerEvents: "none",
    userSelect: "none",
    willChange: "transform",
  };
});

onMounted(() => {
  getDomSourceContent();

  // Добавляем обработчики событий для обновления позиции (как в IntroDistortion)
  if (props.sourceElementId) {
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
  }
});

onBeforeUnmount(() => {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
  window.removeEventListener("scroll", scheduleUpdate);
  window.removeEventListener("resize", scheduleUpdate);
});

watch(
  () => props.sourceElementId,
  () => {
    getDomSourceContent();
  }
);

const combinedCardStyle = computed(() => {
  const liquid = liquidStyle.value;
  const highlight = surfaceHighlightStyle.value;
  const noise = noiseStyle.value;
  const light = lightStyle.value;
  const outline = outlineStyle.value;

  return {
    ...cardStyle.value,
    "--liquid-bg-image": liquid.backgroundImage,
    "--liquid-bg-size": liquid.backgroundSize,
    "--liquid-bg-position": liquid.backgroundPosition,
    "--liquid-filter": liquid.filter,
    "--liquid-opacity": liquid.opacity,
    "--highlight-gradient": highlight.background,
    "--highlight-opacity": highlight.opacity,
    "--noise-texture": noise.backgroundImage,
    "--noise-opacity": noise.opacity,
    "--light-gradient": light.background,
    "--light-opacity": light.opacity,
    "--outline-width": outline.width,
    "--outline-height": outline.height,
    "--outline-gradient": outline.background,
    "--outline-opacity": outline.opacity,
  };
});
</script>

<style scoped src="./index.css"></style>
