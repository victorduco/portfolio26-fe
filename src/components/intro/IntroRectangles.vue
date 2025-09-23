<template>
  <motion.ul class="intro-list" layout :transition="{ spring }">
    <IntroRectangle
      v-for="(_, index) in rects"
      :key="index"
      :index="index"
      :source-element-id="'intro-house-clone'"
    />
  </motion.ul>
</template>

<script setup>
import { reactive } from "vue";
import { motion } from "motion-v";
import { spring } from "./variants";
import IntroRectangle from "./IntroRectangle.vue";

const rects = reactive(
  Array.from("1234", (item) => ({
    number: item,
  }))
);
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
