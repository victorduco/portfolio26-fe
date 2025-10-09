<template>
  <div class="glass-effect">
    <GeDisplacement
      :options="opts"
      :intensity="finalIntensity"
      :static-displacement-map="opts.displacementMap"
    />
    <GeHighlight
      :options="{ highlightReflection: opts.highlightReflection }"
      :intensity="finalIntensity"
    />
  </div>
</template>

<script setup>
import { inject, computed } from "vue";
import { createEffectOptions } from "./GlassEffectDefaults.js";
import GeDisplacement from "./GeDisplacement.vue";
import GeHighlight from "./GeHighlight.vue";

const props = defineProps({
  userOptions: { type: Object, default: () => ({}) },
  intensity: { type: Number, default: 1, validator: (v) => v >= 0 && v <= 1 },
});

const debuggerOptions = inject("glassDebuggerOptions", null);
const debuggerIntensity = inject("glassDebuggerIntensity", null);

const opts = debuggerOptions || createEffectOptions(props.userOptions);
const finalIntensity = computed(() => debuggerIntensity?.value ?? props.intensity);
</script>

<style scoped>
.glass-effect {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: inherit;
}
</style>
