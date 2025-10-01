<template>
  <div class="glass-card" :style="cardStyle" />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  options: { type: Object, required: true },
  intensity: { type: Number, default: 1 },
});

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const o = props.options;
const i = props.intensity;

const brightness = Math.max(0.5, o.glassBrightness / 100).toFixed(2);
const contrast = Math.max(0.5, o.glassContrast / 100).toFixed(2);
const tintHue = o.glassTintHue;
const tintOpacity = o.glassTintOpacity;
const shadowIntensity = o.shadowDepth;

const cardStyle = computed(() => ({
  boxShadow: `0 24px 70px rgba(6, 10, 24, ${shadowIntensity * i})`,

  backgroundColor: i > 0
    ? `hsla(${tintHue}, 50%, 14%, ${clamp(1 - (1 - tintOpacity * 0.8) * i, 0.4, 1)})`
    : `hsla(${tintHue}, 50%, 14%, 1)`,

  border: i > 0
    ? `1px solid hsla(${tintHue}, 92%, 86%, ${0.42 * i})`
    : "none",

  backdropFilter: i > 0
    ? `blur(${o.glassBlur * i}px) saturate(${100 + (o.glassSaturation - 100) * i}%) brightness(${1 + (brightness - 1) * i}) contrast(${1 + (contrast - 1) * i})`
    : "none",

  backgroundImage: i > 0
    ? `linear-gradient(145deg,
        hsla(${tintHue}, 70%, ${Math.min(82, 60 + tintOpacity * 35)}%, ${clamp(tintOpacity * 1.25 * i, 0.01, 0.55)}) 0%,
        hsla(${tintHue}, 50%, ${Math.max(32, 46 + tintOpacity * 18)}%, ${clamp(tintOpacity * 0.9 * i, 0.01, 0.42)}) 100%)`
    : "none",
}));
</script>

<style scoped>
.glass-card {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  z-index: 0;
  transform: var(--distortion-transform, scaleX(1) scaleY(1) translate(0px, 0px));
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
