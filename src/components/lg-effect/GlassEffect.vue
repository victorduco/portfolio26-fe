<template>
  <section class="liquid-glass">
    <LiquidGlassFilter v-bind="filterProps" />

    <div ref="glassRef" class="liquid-glass__card" :style="combinedCardStyle">
      <div class="liquid-glass__layer liquid-glass__layer--liquid" />
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
import { computed, toRef } from "vue";
import useGlassDemo from "./index.js";
import LiquidGlassFilter from "./LiquidGlassFilter.vue";

const props = defineProps({
  backgroundImageUrl: {
    type: String,
    default: "",
  },
  glassConfig: {
    type: Object,
    default: () => ({}),
  },
});

const backgroundImageUrl = toRef(props, "backgroundImageUrl");

const {
  filterReady,
  filterId,
  currentMap,
  edgeIntensityMatrix,
  redScale,
  greenScale,
  liquidGlassBlur,
  surfaceEnhancementMatrix,
  glassRef,
  cardStyle,
  liquidStyle,
  noiseStyle,
  surfaceHighlightStyle,
  lightStyle,
  outlineStyle,
} = useGlassDemo({
  displacementScale: 65,
  aberrationIntensity: 2.8,
  surfaceCurvature: 1.8,
  glassBlur: 25,
  glassSaturation: 185,
  refractionDepth: 2.0,
  surfaceReflection: 0.45,
  shadowDepth: 0.4,
  shaderCornerRadius: 0.2,
  distortion: {
    start: 0.3,
    end: 0.2,
    offset: 0.15,
  },
  scaling: {
    start: 0,
    end: 1,
  },
  ...props.glassConfig,
  backgroundImageUrl,
});

const filterProps = computed(() => ({
  filterReady,
  filterId,
  currentMap,
  edgeIntensityMatrix,
  redScale,
  greenScale,
  liquidGlassBlur,
  surfaceEnhancementMatrix,
}));

const combinedCardStyle = computed(() => {
  const liquid = liquidStyle.value;
  const highlight = surfaceHighlightStyle.value;
  const noise = noiseStyle.value;
  const light = lightStyle.value;
  const outline = outlineStyle.value;

  return {
    ...cardStyle.value,
    '--liquid-bg-image': liquid.backgroundImage,
    '--liquid-bg-size': liquid.backgroundSize,
    '--liquid-bg-position': liquid.backgroundPosition,
    '--liquid-filter': liquid.filter,
    '--liquid-opacity': liquid.opacity,
    '--highlight-gradient': highlight.background,
    '--highlight-opacity': highlight.opacity,
    '--noise-texture': noise.backgroundImage,
    '--noise-opacity': noise.opacity,
    '--light-gradient': light.background,
    '--light-opacity': light.opacity,
    '--outline-width': outline.width,
    '--outline-height': outline.height,
    '--outline-gradient': outline.background,
    '--outline-opacity': outline.opacity,
    '--outline-transform': outline.transform,
  };
});
</script>

<style scoped src="./index.css"></style>
