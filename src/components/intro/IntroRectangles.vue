<template>
  <ExportBgImg
    dom-id="intro-text-export-node"
    v-model="capturedImageUrl"
    background-color="#000"
  />
  <motion.ul class="intro-list" layout :transition="{ spring }">
    <IntroRectangle v-for="(rect, index) in rects" :key="index" :index="index" />
  </motion.ul>
</template>

<script setup>
import { ref, reactive } from "vue";
import { motion } from "motion-v";
import { spring } from "./variants";
import IntroRectangle from "./IntroRectangle.vue";
import ExportBgImg from "../bg-img/ExportBgImg.vue";

const rects = reactive(
  Array.from("1234", (item) => ({
    number: item,
  }))
);
const capturedImageUrl = ref("");
</script>

<style scoped>
.intro-list {
  position: absolute;
  top: 100%;
  display: flex;
  gap: 80px;
  align-items: top;
  margin: 58px 0 0 0;
  justify-content: center;
  padding: 0;
  list-style: none;
  pointer-events: auto;
}
</style>
