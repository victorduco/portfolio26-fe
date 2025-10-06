<script setup>
import { ref, provide } from "vue";
import { RouterView } from "vue-router";
import Keypad from "./components/keypad/Keypad.vue";
import GlassEffectDebugger from "./components/glass-debugger/GlassEffectDebugger.vue";
import { createEffectOptions } from "./components/glass-effect/GlassEffectDefaults.js";
import { glassEffectConfig } from "./components/keypad/glassEffectConfig.js";

const isUnlocked = ref(false);

// Create global glass options from user config and provide to all descendants
const globalGlassOptions = createEffectOptions(glassEffectConfig);
provide("glassDebuggerOptions", globalGlassOptions);

// Global intensity control (separate from options)
const globalIntensity = ref(1);
provide("glassDebuggerIntensity", globalIntensity);

function handleUnlock() {
  isUnlocked.value = true;
}
</script>

<template>
  <Keypad v-if="!isUnlocked" @unlock="handleUnlock" />
  <RouterView v-else />

  <!-- Global debugger panel - controls all GlassEffect components -->
  <GlassEffectDebugger
    :options="globalGlassOptions"
    :intensity="globalIntensity"
  />
</template>
