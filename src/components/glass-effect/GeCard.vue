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
    glassBlur,
    glassSaturation,
  } = o;
  const brightness = glassBrightness / 100;
  const contrast = glassContrast / 100;

  const finalBrightness = 1 + (brightness - 1) * i;
  const finalContrast = 1 + (contrast - 1) * i;

  const shadowOpacity = clamp(0.4 * i, 0, 1);

  const backdropFilterValue = `blur(${glassBlur * i}px) saturate(${
    100 + (glassSaturation - 100) * i
  }%) brightness(${finalBrightness}) contrast(${finalContrast})`;

  return {
    boxShadow: `0 24px 70px rgba(6, 10, 24, ${shadowOpacity})`,
    backdropFilter: backdropFilterValue,
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

  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
