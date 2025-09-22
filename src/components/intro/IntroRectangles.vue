<template>
  <ExportBgImg
    dom-id="intro-text-export-node"
    v-model="capturedImageUrl"
    background-color="#000"
  />
  <motion.ul class="intro-list" layout :transition="{ spring }">
    <IntroRectangle
      v-for="(rect, rect_id) in rects"
      :key="rect.slug"
      :block="rect"
      :index="rect_id"
      :is-hovered="rect.isHovered"
      :layout-spring="getLayoutSpring(rect_id)"
      :spring="spring"
      :box-variants="boxVariants"
      :square-bg-variants="squareBgVariants"
      :square-content-variants="squareContentVariants"
      :square-highlight-variants="squareHighlightVariants"
      :square-content-num-variants="squareContentNumVariants"
      :square-content-bullet-variants="squareContentBulletVariants"
      @mouseenter="rect.isHovered = true"
      @mouseleave="rect.isHovered = false"
      @click="toggleState(rect_id)"
    />
  </motion.ul>
</template>

<script setup>
import { reactive, ref } from "vue";
import { motion } from "motion-v";
import IntroRectangle from "./IntroRectangle.vue";
import ExportBgImg from "../bg-img/ExportBgImg.vue";
import {
  spring,
  boxVariants,
  squareBgVariants,
  squareContentVariants,
  squareHighlightVariants,
  squareContentNumVariants,
  squareContentBulletVariants,
} from "./variants.js";

// Recangle list
const rects = reactive([
  { slug: "one", number: "1", isActive: false, isHovered: false },
  { slug: "two", number: "2", isActive: false, isHovered: false },
  { slug: "three", number: "3", isActive: false, isHovered: false },
  { slug: "four", number: "4", isActive: false, isHovered: false },
]);

// Initital variables
const lastToggledRect = ref(-1);
const capturedImageUrl = ref("");
const hovered = reactive(Array.from({ length: rects.length }, () => false));

function toggleState(rect_id) {
  rects[rect_id].isActive = !rects[rect_id].isActive;
  lastToggledRect.value = rect_id;
}

function getLayoutSpring(rect_id) {
  const d =
    lastToggledRect.value === -1
      ? 0
      : Math.abs(rect_id - lastToggledRect.value);
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
