<template>
  <div class="glass-light" :style="lightStyle" />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  options: { type: Object, required: true },
  intensity: { type: Number, default: 1 },
});

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const i = props.options.lightIntensity;
const baseI = i * 0.6;
const spread = Math.min(100, 48 + props.options.lightSpread * 34);
const inner = Math.max(12, props.options.lightSpread * 14);
const h = props.options.lightHue;

const idleOp = clamp(baseI + 0.12, 0.18, 0.95);
const hoverOp = clamp(i + 0.12, 0.18, 0.95);
const opDelta = hoverOp - idleOp;

const idleStart = clamp(0.45 + baseI * 0.55, 0.35, 0.92);
const hoverStart = clamp(0.45 + i * 0.55, 0.35, 0.92);
const startDelta = hoverStart - idleStart;

const idleMid = clamp(0.12 + baseI * 0.35, 0.14, 0.6);
const hoverMid = clamp(0.12 + i * 0.35, 0.14, 0.6);
const midDelta = hoverMid - idleMid;

const lightStyle = computed(() => ({
  opacity: `calc(${(idleOp * props.intensity).toFixed(3)} + var(--distortion-hovered, 0) * ${(opDelta * props.intensity).toFixed(3)})`,
  background: `radial-gradient(circle at calc(50% + var(--distortion-light-x, 0%)) calc(30% + var(--distortion-light-y, 0%)),
    hsla(${h}, 96%, 82%, calc(${idleStart.toFixed(3)} + var(--distortion-hovered, 0) * ${startDelta.toFixed(3)})) 0%,
    hsla(${h}, 98%, 74%, calc(${idleMid.toFixed(3)} + var(--distortion-hovered, 0) * ${midDelta.toFixed(3)})) ${inner}%,
    rgba(255, 255, 255, 0) ${spread}%)`,
}));
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
