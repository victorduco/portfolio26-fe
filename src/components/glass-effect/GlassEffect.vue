<template>
  <div class="glass-effect">
    <GeDisplacement :options="opts" :intensity="debuggerIntensity?.value ?? intensity" :static-displacement-map="opts.displacementMap" />
    <GeHighlight :options="{ highlightReflection: opts.highlightReflection }" :intensity="debuggerIntensity?.value ?? intensity" />
  </div>
</template>

<script setup>
import { inject } from "vue";
import { createEffectOptions } from "./GlassEffectDefaults.js";
import GeDisplacement from "./GeDisplacement.vue";
import GeHighlight from "./GeHighlight.vue";

const props = defineProps({
  userOptions: { type: Object, default: () => ({}) },
  intensity: { type: Number, default: 1, validator: (v) => v >= 0 && v <= 1 },
});
const debuggerIntensity = inject("glassDebuggerIntensity", null);
const opts = inject("glassDebuggerOptions", null) || createEffectOptions(props.userOptions);
</script>

<style scoped>
.glass-effect { position: relative; width: 100%; height: 100%; border-radius: inherit; }
</style>
