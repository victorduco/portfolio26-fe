<template>
  <section class="liquid-glass">
    <LiquidGlassFilter v-bind="filterProps" />

    <div
      ref="glassElementRef"
      class="liquid-glass__card"
      :style="combinedCardStyle"
    >
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
  filterProps,
  glassElementRef,
  cardStyle,
  liquidStyle,
  noiseStyle,
  surfaceHighlightStyle,
  lightStyle,
  outlineStyle,
} = useGlassDemo({
  ...props.glassConfig,
  backgroundImageUrl,
});

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
