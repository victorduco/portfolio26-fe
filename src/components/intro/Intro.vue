<template>
  <div ref="containerRef" class="w-full h-screen bg-image"></div>
  <section class="intro-hero">
    <div class="intro-hero__text">
      <h1 class="h1">Rectangles That Rules Numbers</h1>
      <p class="body1">
        This is story of me and how UX can change things around us. Something
        else to write here.
      </p>

      <ul class="intro-list" layout :transition="{ spring }">
        <motion.li
          v-for="(block, idx) in blocks"
          :key="idx"
          layout
          :custom="idx"
          :variants="boxVariants"
          :animate="
            block.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'
          "
          :transition="getLayoutSpring(idx)"
          initial="default"
          class="intro-square"
          :class="[
            `intro-square--${block.slug}`,
            { 'is-active': block.isActive },
          ]"
          @mouseenter="hovered[idx] = true"
          @mouseleave="hovered[idx] = false"
          @click="toggleState(idx)"
          :data-state="block.isActive"
        >
          <motion.div
            class="intro-square-bg"
            :custom="{ slug: block.slug }"
            :variants="squareBgVariants"
            :animate="
              block.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'
            "
            :transition="spring"
          >
            <motion.div
              class="intro-square-highlight"
              :variants="squareHighlightVariants"
              :animate="
                block.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'
              "
              :transition="spring"
            />
          </motion.div>

          <motion.div
            class="intro-square-overlay"
            :variants="squareContentVariants"
            :animate="
              block.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'
            "
            :transition="spring"
          >
            <motion.div
              class="intro-content-number"
              :variants="squareContentNumVariants"
              :custom="{ slug: block.slug }"
              :animate="
                block.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'
              "
              style="
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                z-index: 2;
              "
            >
              {{ block.number }}
            </motion.div>
            <motion.div
              class="intro-content-bullet"
              :variants="squareContentBulletVariants"
              :animate="
                block.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'
              "
            >
              •
            </motion.div>
          </motion.div>
        </motion.li>
      </ul>
    </div>

    <div class="intro-hero__stage"></div>
  </section>
</template>

<script setup>
import { motion } from "motion-v";
import { LiquidGlass } from "@wxperia/liquid-glass-vue";

const handleClick = () => {
  console.log("Button clicked!");
};
import { blocks, hovered, getLayoutSpring, toggleState } from "./index.js";

import {
  spring,
  boxVariants,
  squareBgVariants,
  squareContentVariants,
  squareHighlightVariants,
  squareContentNumVariants,
  squareContentBulletVariants,
} from "./variants.js";
</script>

<style src="./index.css"></style>
