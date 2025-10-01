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

const cardStyle = computed(() => {
  if (i === 0) {
    return {
      boxShadow: "none",
      backgroundColor: "transparent",
      border: "none",
      backdropFilter: "none",
      backgroundImage: "none",
    };
  }

  const brightness = o.glassBrightness / 100;
  const contrast = o.glassContrast / 100;
  const h = o.glassTintHue;
  const opacity = o.glassTintOpacity;

  return {
    boxShadow: `0 24px 70px rgba(6, 10, 24, ${o.shadowDepth * i})`,
    backgroundColor: `hsla(${h}, 50%, 14%, ${clamp(1 - (1 - opacity * 0.8) * i, 0, 1)})`,
    border: `1px solid hsla(${h}, 92%, 86%, ${0.42 * i})`,
    backdropFilter: `blur(${o.glassBlur * i}px) saturate(${100 + (o.glassSaturation - 100) * i}%) brightness(${1 + (brightness - 1) * i}) contrast(${1 + (contrast - 1) * i})`,
    backgroundImage: `linear-gradient(145deg, hsla(${h}, 70%, ${Math.min(82, 60 + opacity * 35)}%, ${clamp(opacity * 1.25 * i, 0, 0.55)}) 0%, hsla(${h}, 50%, ${Math.max(32, 46 + opacity * 18)}%, ${clamp(opacity * 0.9 * i, 0, 0.42)}) 100%)`,
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
  transform: var(--distortion-transform, scaleX(1) scaleY(1) translate(0px, 0px));
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
