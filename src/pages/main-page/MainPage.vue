<template>
  <div class="main-page">
    <BgToSvg :source-selector="sourceSelector" :render-delay="100" />
    <Intro />
    <Case1 />
    <Case2 />
    <Case3 />
    <Values />
    <Contacts />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Intro from "./intro/Intro.vue";
import BgToSvg from "../../components/bg-to-svg/BgToSvg.vue";
import Case1 from "./cases/Case1.vue";
import Case2 from "./cases/Case2.vue";
import Case3 from "./cases/Case3.vue";
import Values from "./values/Values.vue";
import Contacts from "./contacts/Contacts.vue";

const sourceSelector = ref("intro-text-export-node");
</script>

<style scoped>
.main-page {
  width: 100vw;
  background: #171717;
}
</style>
