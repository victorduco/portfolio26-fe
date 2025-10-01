<template>
  <section class="intro-hero" id="intro-text-export-node">
    <div class="intro-hero__title">
      <h1 class="h1">Rectangles That Rules Numbers</h1>
      <p class="body1">
        This is story of me and how UX can change things around us. Something
        else to write here.
      </p>
    </div>
  </section>

  <motion.ul class="intro-list" :transition="{ spring }">
    <IntroRectangle
      v-for="(_, index) in rects"
      :key="index"
      :index="index"
      :active-count="activeCount"
      @active-change="handleActiveChange"
    />
  </motion.ul>
</template>

<script setup>
import { ref } from "vue";
import { motion } from "motion-v";
import { spring } from "./variants";
import IntroRectangle from "./IntroRectangle.vue";

const rects = Array(4).fill(null);
const activeCount = ref(0);

function handleActiveChange(isActive) {
  activeCount.value += isActive ? 1 : -1;
}
</script>

<style scoped>
.intro-hero {
  position: relative;
  display: grid;

  align-content: center;
  justify-items: start;
  width: 100vw;
  height: 100vh;
  padding-block: clamp(48px, 12vh, 96px);
  padding-inline-start: clamp(32px, 12vw, 120px);
  box-sizing: border-box;
  overflow: visible;
  grid-template-columns: repeat(auto-fill, min-content);
}

.intro-hero__title {
  max-width: 1000px;
  display: grid;
  gap: 24px;
  position: relative;
  z-index: 1;
  margin-bottom: 20vh;
  anchor-name: --title;
  place-items: start start;
}

.intro-list {
  position: absolute;
  /* Fallback for browsers without anchor support */
  top: calc(50vh + 50px + clamp(48px, 12vh, 96px));
  left: clamp(32px, 12vw, 120px);

  /* Anchor positioning for supported browsers */
  position-anchor: --title;
  top: anchor(bottom);
  margin-top: 64px;

  display: grid;
  grid-template-columns:
    fit-content(100px) fit-content(100px) fit-content(100px)
    fit-content(100px);
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;

  max-width: 110vw;
  max-height: 110vh;
  gap: 80px;
  place-items: start start;

  padding: 0;
  list-style: none;
  pointer-events: auto;
  z-index: 5;
}

@media (max-width: 768px) {
  .intro-hero {
    min-height: auto;
    padding-block: clamp(40px, 12vh, 72px);
    padding-inline-start: clamp(24px, 16vw, 72px);
    padding-inline-end: clamp(16px, 8vw, 48px);
  }

  .intro-list {
    /* Adjust fallback calculation for mobile padding */
    top: calc(50vh + 50px + clamp(40px, 12vh, 72px));
    left: clamp(24px, 16vw, 72px);

    /* Adaptive grid for mobile */
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    column-gap: 50px;
    row-gap: -100px;
  }
}
</style>
