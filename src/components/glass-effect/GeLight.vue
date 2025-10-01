<template>
  <div v-if="props.intensity > 0" class="glass-light" :style="lightStyle" />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  options: { type: Object, required: true },
  intensity: { type: Number, default: 1 },
});

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const lightStyle = computed(() => {
  const li = props.options.lightIntensity;
  const baseI = li * 0.6;
  const h = props.options.lightHue;
  const spread = Math.min(100, 48 + props.options.lightSpread * 34);
  const inner = Math.max(12, props.options.lightSpread * 14);

  const idleOp = clamp(baseI + 0.12, 0.18, 0.95);
  const hoverOp = clamp(li + 0.12, 0.18, 0.95);
  const idleStart = clamp(0.45 + baseI * 0.55, 0.35, 0.92);
  const hoverStart = clamp(0.45 + li * 0.55, 0.35, 0.92);
  const idleMid = clamp(0.12 + baseI * 0.35, 0.14, 0.6);
  const hoverMid = clamp(0.12 + li * 0.35, 0.14, 0.6);

  const pi = props.intensity;
  return {
    opacity: `calc(${(idleOp * pi).toFixed(3)} + var(--distortion-hovered, 0) * ${((hoverOp - idleOp) * pi).toFixed(3)})`,
    background: `radial-gradient(circle at calc(50% + var(--distortion-light-x, 0%)) calc(30% + var(--distortion-light-y, 0%)), hsla(${h}, 96%, 82%, calc(${idleStart.toFixed(3)} + var(--distortion-hovered, 0) * ${(hoverStart - idleStart).toFixed(3)})) 0%, hsla(${h}, 98%, 74%, calc(${idleMid.toFixed(3)} + var(--distortion-hovered, 0) * ${(hoverMid - idleMid).toFixed(3)})) ${inner}%, rgba(255, 255, 255, 0) ${spread}%)`,
  };
});
</script>

<style scoped>
.glass-light {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-radius: inherit;
  z-index: 3;
  mix-blend-mode: screen;
  transform: translateY(-30%);
}
</style>
