<script setup>
import Intro from "./components/intro/Intro.vue";
import BgToSvg from "./components/bg-to-svg/BgToSvg.vue";
</script>

<template>
  <BgToSvg
    source-selector="intro-text-export-node"
    result-selector-id="intro-house-clone"
  />
  <Intro />
</template>
