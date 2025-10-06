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

// Check if global debugger options are available
const debuggerOptions = inject("glassDebuggerOptions", null);
const debuggerIntensity = inject("glassDebuggerIntensity", null);

// Use debugger options if available, otherwise use user options
// debuggerOptions is already reactive, so we can use it directly
const opts = debuggerOptions
  ? debuggerOptions
  : createEffectOptions(props.userOptions);

// Use global intensity if debugger is active, otherwise use props
// When debugger is active (not null), always use debugger values
const finalIntensity = computed(() => {
  return debuggerIntensity !== null ? debuggerIntensity.value : props.intensity;
});
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
