<template>
  <motion.ul class="intro-list" layout :transition="{ spring }">
    <IntroRectangle
      v-for="(block, idx) in blocks"
      :key="idx"
      :block="block"
      :index="idx"
      :is-hovered="hovered[idx]"
      :layout-spring="getLayoutSpring(idx)"
      :spring="spring"
      :box-variants="boxVariants"
      :square-bg-variants="squareBgVariants"
      :square-content-variants="squareContentVariants"
      :square-highlight-variants="squareHighlightVariants"
      :square-content-num-variants="squareContentNumVariants"
      :square-content-bullet-variants="squareContentBulletVariants"
      @mouseenter="hovered[idx] = true"
      @mouseleave="hovered[idx] = false"
      @click="toggleState(idx)"
    />
  </motion.ul>
</template>

<script setup>
import { reactive, ref } from "vue";
import { motion } from "motion-v";
import IntroRectangle from "./IntroRectangle.vue";
import {
  spring,
  boxVariants,
  squareBgVariants,
  squareContentVariants,
  squareHighlightVariants,
  squareContentNumVariants,
  squareContentBulletVariants,
} from "./variants.js";


const baseBlocks = [
  { slug: "one", number: "1" },
  { slug: "two", number: "2" },
  { slug: "three", number: "3" },
  { slug: "four", number: "4" },
];

const blocks = reactive(
  baseBlocks.map((block) => ({ ...block, isActive: false }))
);
const hovered = reactive(Array.from({ length: blocks.length }, () => false));
const lastToggledIdx = ref(-1);

function toggleState(idx) {
  blocks[idx].isActive = !blocks[idx].isActive;
  lastToggledIdx.value = idx;
}

function getLayoutSpring(idx) {
  const d =
    lastToggledIdx.value === -1 ? 0 : Math.abs(idx - lastToggledIdx.value);
  return { ...spring, delay: d * 0.5 };
}
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
