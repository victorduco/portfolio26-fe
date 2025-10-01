<script setup>
import { ref, provide } from "vue";
import Intro from "./components/intro/Intro.vue";
// import Keypad from "./components/keypad/Keypad.vue";
import BgToSvg from "./components/bg-to-svg/BgToSvg.vue";
import GlassEffectDebugger from "./components/glass-effect/GlassEffectDebugger.vue";
import { createEffectOptions } from "./components/glass-effect/GlassEffectDefaults.js";
// import { glassEffectConfig } from "./components/keypad/glassEffectConfig.js";
import { INTRO_GLASS_CONFIG } from "./components/intro/glassConfig.js";

const sourceSelector = ref("intro-text-export-node");

// Create global glass options from user config and provide to all descendants
const globalGlassOptions = createEffectOptions(INTRO_GLASS_CONFIG);
provide('glassDebuggerOptions', globalGlassOptions);

// Global intensity control (separate from options)
const globalIntensity = ref(1);
provide('glassDebuggerIntensity', globalIntensity);

// Global static displacement map control
const globalStaticMap = ref("/src/assets/distmaps/mp1.png");
provide('glassDebuggerStaticMap', globalStaticMap);

// Displacement mode: 'static' or 'dynamic'
const displacementMode = ref('static');
provide('glassDebuggerMode', displacementMode);
</script>

<template>
  <BgToSvg :source-selector="sourceSelector" :render-delay="100" />
  <Intro />
  <!-- <Keypad /> -->

  <!-- Global debugger panel - controls all GlassEffect components -->
  <GlassEffectDebugger
    :options="globalGlassOptions"
    :intensity="globalIntensity"
    :static-map="globalStaticMap"
    :mode="displacementMode"
  />
</template>
