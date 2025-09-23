<script setup>
import GlassDemo from "./components/glass-demo/GlassDemo.vue";
import Intro from "./components/intro/Intro.vue";
import IntroHouse from "./components/intro/IntroHouse.vue";
</script>

<template>
  <IntroHouse
    source-selector="#intro-text-export-node"
    result-selector-id="intro-house-clone"
  />
  <Intro />
  <!-- <GlassDemo /> -->
</template>
