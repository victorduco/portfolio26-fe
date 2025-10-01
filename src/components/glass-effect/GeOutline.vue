<template>
  <div class="glass-outline" :style="outlineStyle" />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  options: { type: Object, required: true },
  intensity: { type: Number, default: 1 },
});

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const outlineStyle = computed(() => {
  const h = props.options.outlineGlassTintHue;
  const hi = props.options.outlineIntensity;
  const sr = props.options.surfaceReflection;
  const baseOp = clamp(0.18 + hi * 0.28, 0.22, 0.6) * sr;
  const hoverOpTotal = clamp(0.28 + hi * 0.38, 0.3, 0.75) * sr;

  return {
    width: "100%",
    height: "100%",
    transform: "var(--distortion-transform, scaleX(1) scaleY(1) translate(0px, 0px))",
    transition: "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
    opacity: `calc(${(baseOp * props.intensity).toFixed(3)} + var(--distortion-hovered, 0) * ${((hoverOpTotal - baseOp) * props.intensity).toFixed(3)})`,
    background: `linear-gradient(calc(135deg + var(--distortion-outline-rotation, 0deg)), hsla(${h}, 95%, 86%, 0.08) 0%, hsla(${h}, 96%, 78%, ${0.52 * sr}) 50%, hsla(${h}, 92%, 68%, 0.16) 100%)`,
  };
});
</script>

<style scoped>
.glass-outline {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  z-index: 4;
}
</style>
