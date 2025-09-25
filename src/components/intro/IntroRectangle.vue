<template>
  <div
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="toggleState"
  >
    <motion.li
      ref="motionElement"
      layout
      :custom="index"
      :variants="boxVariants"
      :animate="getAnimationState()"
      :transition="spring"
      initial="default"
      class="intro-square"
      :class="[`mask-element intro-square-`, { 'is-active': isActive }]"
      :data-state="isActive"
      v-mask-element="{
        sourceElementId: masterClone,
      }"
    >
      <!-- <LiquidGlass
        :source-element-id="masterClone"
        :glass-config="glassConfig"
        :intensity="glassIntensity"
        class="intro-square-glass"
      >
      </LiquidGlass> -->

      <motion.div
        class="intro-square-content-wrap"
        :variants="contentWrapVariants"
        :animate="isActive ? 'active' : isHovered ? 'hover' : 'default'"
        :transition="spring"
      >
        <motion.div
          class="intro-content-number"
          :variants="squareContentNumVariants"
          :animate="isActive ? 'active' : isHovered ? 'hover' : 'default'"
          :custom="index"
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
          {{ index + 1 }}
        </motion.div>
        <motion.div
          class="intro-content-bullet"
          :variants="squareContentBulletVariants"
          :animate="isActive ? 'active' : isHovered ? 'hover' : 'default'"
        >
          •
        </motion.div>
      </motion.div>
    </motion.li>
  </div>
</template>

<script setup>
import { motion } from "motion-v";
import { computed, ref, inject } from "vue";
import LiquidGlass from "../glass-effect/GlassEffect.vue";
import { glassIntensityVariants } from "./variants.js";

import {
  spring,
  boxVariants,
  contentWrapVariants,
  squareContentNumVariants,
  squareContentBulletVariants,
} from "./variants.js";

// Initial variables

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
});

const masterClone = inject("masterClone", "intro-house-clone");
const isActive = ref(false);
const isHovered = ref(false);

// Определение состояния анимации
function getAnimationState() {
  // Обычные интерактивные состояния
  if (isActive.value) return "active";
  if (isHovered.value) return "hover";
  return "default";
}
function toggleState() {
  isActive.value = !isActive.value;
}

// Glass config для прямоугольника
const glassConfig = {
  displacementScale: 65,
  glassTintHue: 250,
  aberrationIntensity: 90,
  surfaceCurvature: 1.8,
  glassBlur: 2,
  glassSaturation: 185,
  refractionDepth: 2.0,
  surfaceReflection: 0.45,
  shadowDepth: 3,
  shaderCornerRadius: 2,
  distortion: {
    start: 0.3,
    end: 0.2,
    offset: 0.15,
  },
  scaling: {
    start: 0,
    end: 1,
  },
};

// Динамическая интенсивность по состояниям
const glassIntensity = computed(() => {
  if (isActive.value) return glassIntensityVariants.active.intensity;
  if (isHovered.value) return glassIntensityVariants.hover.intensity;
  return glassIntensityVariants.default.intensity;
});
</script>

<style scoped>
.intro-square {
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  list-style: none;
  box-sizing: border-box;
  cursor: pointer;
  z-index: 0;
  inset: 0;
  border-radius: 28px;
  transform-origin: 50% 50%;
  overflow: hidden;
}

.intro-square[data-state="true"],
.intro-square:hover {
  z-index: 4;
}

.intro-square-glass {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.intro-square-content-wrap {
  display: grid;
  place-items: center;
  pointer-events: none;
  z-index: 1;
  position: absolute;
  inset: 0;
  border-radius: 28px;
  transform-origin: 50% 50%;
  top: 50%;
  left: 50%;
  width: 34%;
  aspect-ratio: 1;
  border-radius: 50%;
}

.intro-content-number {
  display: grid;
  place-items: center;
  color: var(--color-square-content);
  font-weight: 800;
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1;
  user-select: none;
  pointer-events: none;
  position: absolute;
  text-shadow: 0 0 6px var(--glow-color), 0 0 14px var(--glow-color),
    0 0 28px var(--glow-color);
}

.intro-content-bullet {
  display: grid;
  place-items: center;
  color: #5f5f5f;
  font-size: 60px;
  line-height: 1;
  user-select: none;
  pointer-events: none;
  position: absolute;
  transform: translateY(-5%);
}
</style>
