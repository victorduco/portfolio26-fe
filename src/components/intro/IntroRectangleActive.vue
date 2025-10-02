<template>
  <motion.div
    class="intro-active-diamond"
    :variants="activeDiamondVariants"
    :animate="isActive ? 'active' : 'hidden'"
    :transition="spring"
    :custom="index"
  >
    <motion.div
      class="intro-active-content"
      :variants="activeContentVariants"
      :animate="isActive ? 'active' : 'hidden'"
      :transition="spring"
    >
      <div class="intro-active-number">{{ index + 1 }}</div>
      <h3 class="intro-active-title">{{ contentData[index]?.title }}</h3>
      <p class="intro-active-description">
        {{ contentData[index]?.description }}
      </p>
    </motion.div>
  </motion.div>
</template>

<script setup>
import { motion } from "motion-v";
import {
  spring,
  activeDiamondVariants,
  activeContentVariants,
} from "./variants.js";

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

// Уникальный контент для каждого блока
const contentData = [
  {
    title: "Design System Architecture",
    description:
      "Building consistent and scalable UI components that work seamlessly across all platforms and devices",
  },
  {
    title: "User Experience Design",
    description:
      "Creating intuitive and delightful interactions that help users achieve their goals with minimal friction",
  },
  {
    title: "Performance Optimization Strategy",
    description:
      "Maximizing speed and efficiency through careful code analysis and modern best practices for web",
  },
  {
    title: "Accessibility Standards Compliance",
    description:
      "Making digital content available and usable for everyone regardless of their abilities or disabilities",
  },
];
</script>

<style scoped>
.intro-active-diamond {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 90%;
  height: 90%;
  border-radius: 28px;
  display: grid;
  place-items: center;
  z-index: 10;
  pointer-events: none;
}

.intro-active-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  padding: 32px;
  max-width: 400px;
}

.intro-active-number {
  font-size: clamp(48px, 3vw, 64px);
  font-weight: 800;
  line-height: 1;
  color: #000000;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-active-title {
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  color: #000000;
}

.intro-active-description {
  font-size: clamp(14px, 1.5vw, 18px);
  font-weight: 400;
  line-height: 1.4;
  margin: 0;
  color: #000000;
  opacity: 0.9;
}
</style>
