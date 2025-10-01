<script setup>
import { provide, ref } from "vue";
import Intro from "./components/intro/Intro.vue";
// import Keypad from "./components/keypad/Keypad.vue";
import BgToSvg from "./components/bg-to-svg/BgToSvg.vue";

const sourceSelector = ref("intro-text-export-node");
</script>

<template>
  <BgToSvg :source-selector="sourceSelector" :render-delay="100" />
  <Intro />
  <!-- <Keypad /> -->
</template>
