<template>
  <div class="glass-effect">
    <GeCard :options="opts" :intensity="finalIntensity" />

    <GeFilter
      :options="opts"
      :intensity="finalIntensity"
      :static-displacement-map="finalStaticMap"
      :displacement-mode="finalMode"
    />

    <GeHighlight
      :options="{ highlightReflection: opts.highlightReflection }"
      :intensity="finalIntensity"
    />

    <GeNoise
      :options="{
        noiseStrength: opts.noiseStrength,
        noiseRefractionDepth: opts.noiseRefractionDepth,
      }"
      :intensity="finalIntensity"
    />

    <GeLight
      :options="{
        lightIntensity: opts.lightIntensity,
        lightSpread: opts.lightSpread,
        lightHue: opts.lightHue,
      }"
      :intensity="finalIntensity"
    />
  </div>
</template>

<script setup>
import { inject, computed } from "vue";
import { createEffectOptions } from "./GlassEffectDefaults.js";
import GeCard from "./GeCard.vue";
import GeFilter from "./GeFilter.vue";
import GeHighlight from "./GeHighlight.vue";
import GeNoise from "./GeNoise.vue";
import GeLight from "./GeLight.vue";

const props = defineProps({
  userOptions: { type: Object, default: () => ({}) },
  intensity: { type: Number, default: 1, validator: (v) => v >= 0 && v <= 1 },
  staticDisplacementMap: { type: String, default: null },
  "static-displacement-map": { type: String, default: null },
});

// Check if global debugger options are available
const debuggerOptions = inject("glassDebuggerOptions", null);
const debuggerIntensity = inject("glassDebuggerIntensity", null);
const debuggerStaticMap = inject("glassDebuggerStaticMap", null);
const debuggerMode = inject("glassDebuggerMode", null);

// Use debugger options if available, otherwise use user options
// debuggerOptions is already reactive, so we can use it directly
const opts = debuggerOptions
  ? debuggerOptions
  : createEffectOptions(props.userOptions);

// Use global intensity and staticMap if debugger is active, otherwise use props
// When debugger is active (not null), always use debugger values
const finalIntensity = computed(() => {
  const value =
    debuggerIntensity !== null ? debuggerIntensity.value : props.intensity;
  console.log(
    "GlassEffect finalIntensity:",
    value,
    "debugger:",
    debuggerIntensity?.value,
    "props:",
    props.intensity
  );
  return value;
});

const finalStaticMap = computed(() => {
  const propValue =
    props["static-displacement-map"] || props.staticDisplacementMap;
  const value =
    debuggerStaticMap !== null ? debuggerStaticMap.value : propValue;
  console.log("GlassEffect finalStaticMap:", value);
  return value;
});

const finalMode = computed(() => {
  const value = debuggerMode !== null ? debuggerMode.value : "static";
  console.log("GlassEffect finalMode:", value);
  return value;
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
