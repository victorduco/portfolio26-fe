<template>
  <div v-if="props.intensity > 0" class="glass-noise" :style="noiseStyle" />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  options: { type: Object, required: true },
  intensity: { type: Number, default: 1 },
});

const noiseStyle = computed(() => {
  const s = props.options.noiseStrength > 1 ? props.options.noiseStrength / 1000 : props.options.noiseStrength;
  const d = props.options.noiseRefractionDepth > 1 ? props.options.noiseRefractionDepth / 1000 : props.options.noiseRefractionDepth;
  return {
    backgroundImage: "url(data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.3' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E)",
    backgroundSize: "180px",
    mixBlendMode: "soft-light",
    opacity: Math.min(1, Math.max(0, s * d * props.intensity)),
  };
});
</script>

<style scoped>
.glass-noise {
  position: absolute;
  inset: 0;
  mix-blend-mode: soft-light;
  pointer-events: none;
  border-radius: inherit;
  z-index: 2;
}
</style>
