<template>
  <section class="intro-hero">
    <div id="intro-text-export-node" class="intro-hero__title">
      <h1 class="h1">Rectangles That Rules Numbers</h1>
      <p class="body1">
        This is story of me and how UX can change things around us. Something
        else to write here.
      </p>
    </div>

    <motion.ul class="intro-list" layout :transition="{ spring }">
      <IntroRectangle
        v-for="(_, index) in rects"
        :key="index"
        :index="index"
        :source-element-id="'intro-house-clone'"
      />
    </motion.ul>
  </section>
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
.intro-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: center;
  justify-items: start;
  width: 100vw;
  height: 100vh;
  padding-block: clamp(48px, 12vh, 96px);
  padding-inline-start: clamp(32px, 12vw, 120px);
  box-sizing: border-box;
  overflow: visible;
}

.intro-hero__title {
  max-width: 1000px;
  display: grid;
  gap: 24px;
  position: relative;
  z-index: 3;
  margin-bottom: 20vh;
  anchor-name: --title;
}

.intro-list {
  position: absolute;
  position-anchor: --title;
  top: anchor(bottom);
  left: clamp(32px, 12vw, 120px);
  margin-top: 64px;
  display: flex;
  gap: 80px;
  align-items: top;
  justify-content: flex-start;
  padding: 0;
  list-style: none;
  pointer-events: auto;
}

@media (max-width: 768px) {
  .intro-hero {
    min-height: auto;
    padding-block: clamp(40px, 12vh, 72px);
    padding-inline-start: clamp(24px, 16vw, 72px);
    padding-inline-end: clamp(16px, 8vw, 48px);
  }
}
</style>
