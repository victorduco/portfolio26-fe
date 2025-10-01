<template>
  <div class="glass-card" :style="combinedStyle" />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  options: { type: Object, required: true },
  intensity: { type: Number, default: 1 },
});

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const { options: o, intensity: i } = props;

const combinedStyle = computed(() => {
  if (!i)
    return {
      boxShadow: "none",
      backgroundColor: "#000",
      border: "none",
      backdropFilter: "none",
      backgroundImage: "none",
    };

  const {
    glassBrightness,
    glassContrast,
    glassTintHue: h,
    glassTintOpacity: op,
    shadowDepth,
    glassBlur,
    glassSaturation,
    outlineGlassTintHue: oh,
    outlineIntensity: oi,
    surfaceReflection: sr,
  } = o;
  const brightness = glassBrightness / 100;
  const contrast = glassContrast / 100;
  const base = clamp(0.18 + oi * 0.28, 0.22, 0.6) * sr;
  const hover = clamp(0.28 + oi * 0.38, 0.3, 0.75) * sr;

  const finalBrightness = 1 + (brightness - 1) * i;
  const finalContrast = 1 + (contrast - 1) * i;

  const backdropFilterValue = `blur(${glassBlur * i}px) saturate(${
    100 + (glassSaturation - 100) * i
  }%) brightness(${finalBrightness}) contrast(${finalContrast})`;

  console.log('GeCard backdrop-filter:', backdropFilterValue);

  return {
    boxShadow: `0 24px 70px rgba(6, 10, 24, ${shadowDepth * i})`,
    backdropFilter: backdropFilterValue,
    "--outline-opacity": `calc(${(base * i).toFixed(
      3
    )} + var(--distortion-hovered, 0) * ${((hover - base) * i).toFixed(3)})`,
  };
});
</script>

<style scoped>
.glass-card {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  z-index: 0;
  transform: var(
    --distortion-transform,
    scaleX(1) scaleY(1) translate(0px, 0px)
  );
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
