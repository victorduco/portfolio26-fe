<script setup>
import { provide, ref } from "vue";
import Intro from "./components/intro/Intro.vue";
import BgToSvg from "./components/bg-to-svg/BgToSvg.vue";

const sourceSelector = ref("intro-text-export-node");
</script>

<template>
  <BgToSvg :source-selector="sourceSelector" />
  <Intro />
</template>
