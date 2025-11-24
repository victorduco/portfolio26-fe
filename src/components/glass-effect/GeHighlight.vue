<template>
  <div v-if="intensity > 0" class="glass-highlight" :style="{ background: `linear-gradient(135deg, rgba(255,255,255,${options.highlightReflection * 0.4 * intensity}) 0%, rgba(255,255,255,${options.highlightReflection * 0.1 * intensity}) 50%, rgba(255,255,255,${0.02 * intensity}) 100%)` }" />
</template>

<script setup>
defineProps({ options: { type: Object, required: true }, intensity: { type: Number, default: 1 } });
</script>

<style scoped>
.glass-highlight { position: absolute; inset: 0; pointer-events: none; border-radius: inherit; z-index: 1; opacity: calc(0.7 + var(--distortion-hovered, 0) * 0.3); transition: opacity 0.3s ease; }
</style>
