<script setup>
import { provide, ref } from "vue";
import Intro from "./components/intro/Intro.vue";
import BgToSvg from "./components/bg-to-svg/BgToSvg.vue";

const sourceSelector = ref("intro-text-export-node");
const resultSelector = ref("intro-house-clone");

provide("masterClone", resultSelector);
</script>

<template>
  <BgToSvg
    :source-selector="sourceSelector"
    :result-selector="resultSelector"
  />
  <Intro />
</template>
