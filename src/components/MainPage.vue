<template>
  <div class="main-page">
    <BgToSvg :source-selector="sourceSelector" :render-delay="100" />
    <Intro />
    <Case1 />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Intro from "./intro/Intro.vue";
import BgToSvg from "./bg-to-svg/BgToSvg.vue";
import Case1 from "./cases/Case1.vue";

const sourceSelector = ref("intro-text-export-node");
</script>

<style scoped>
.main-page {
  width: 100vw;
  background: #171717;
}
</style>
