<!-- 
 TODO
Я выпилил присваивание сетки каждому квадрату - сейчас работает с помощью транзишенов - нужно или вернуть или убрать функции 
 -->

<template>
  <motion.li
    ref="motionElement"
    @hoverStart="isHovered = true"
    @hoverEnd="isHovered = false"
    @click="toggleState"
    :custom="{ index, additionalMargin }"
    :variants="boxVariants"
    :animate="getAnimationState()"
    :transition="{
      default: spring,
      marginLeft: marginSpring,
      marginRight: marginSpring,
    }"
    initial="default"
    class="mask-element intro-square"
    :data-state="isActive"
    v-mask-element
  >
    <!-- <GlassEffect
      ref="glassEffectRef"
      :user-options="glassConfig"
      :intensity="glassIntensity"
      class="intro-square-glass"
    >
    </GlassEffect> -->

    <motion.div
      class="intro-square-content-wrap"
      :variants="contentWrapVariants"
      :animate="getAnimationState()"
      :transition="spring"
    >
      <motion.div
        class="intro-content-number"
        :variants="squareContentNumVariants"
        :animate="getAnimationState()"
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
        :animate="getAnimationState()"
      >
        •
      </motion.div>
    </motion.div>
  </motion.li>
</template>

<script setup>
import { motion } from "motion-v";
import { computed, ref } from "vue";
import GlassEffect from "../glass-effect/components/GlassEffect.vue";
import { glassIntensityVariants } from "./variants.js";

import {
  spring,
  marginSpring,
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
  activeCount: {
    type: Number,
    default: 0,
  },
});

const isActive = ref(false);
const isHovered = ref(false);
const glassEffectRef = ref(null);
const motionElement = ref(null);

// Определение состояния анимации
function getAnimationState() {
  // Обычные интерактивные состояния
  if (isActive.value) return "active";
  if (isHovered.value) return "hover";
  return "default";
}
const emit = defineEmits(["activeChange"]);

function toggleState() {
  isHovered.value = false;
  isActive.value = !isActive.value;

  emit("activeChange", isActive.value);
}

// Glass config для прямоугольника
const glassConfig = {
  // Core displacement parameters - REQUIRED for distortion map
  displacementScale: 65,
  aberrationIntensity: 2.8,
  displacementCurvature: 1.8,

  // Glass material properties
  glassBlur: 25,
  glassSaturation: 185,
  refractionDepth: 2.0,
  surfaceReflection: 0.45,

  // GeLight
  lightIntensity: 0.2,
  lightSpread: 4,
  lightHue: 250,

  // GeHighlight
  highlightReflection: 0.3,

  // GeNoise
  noiseStrength: 0.15,
  noiseRefractionDepth: 1.5,

  // GeOutline
  outlineIntensity: 1,
  outlineGlassTintHue: 250,

  // Shadow and advanced effects
  shadowDepth: 0.4,

  // Shader distortion parameters
  shaderCornerRadius: 0.2,
  shaderDistortionStart: 0.3,
  shaderDistortionEnd: 0.2,
  shaderDistortionOffset: 0.15,
  shaderScalingStart: 0,
  shaderScalingEnd: 1,
};

// Динамическая интенсивность по состояниям
const glassIntensity = computed(() => {
  if (isActive.value) return glassIntensityVariants.active.intensity;
  if (isHovered.value) return glassIntensityVariants.hover.intensity;
  return glassIntensityVariants.default.intensity;
});

// Computed additional margin
const additionalMargin = computed(() => props.activeCount * -30);

// // Grid positioning functions
// function getGridColumn(index) {
//   const positions = [
//     "1 / 4", // Элемент 1: колонки 1-3
//     "3 / 6", // Элемент 2: колонки 3-5
//     "5 / 8", // Элемент 3: колонки 5-7
//     "7 / 10", // Элемент 4: колонки 7-9
//   ];
//   return positions[index] || "auto";
// }

// function getGridRow(index) {
//   const positions = [
//     "1 / 4", // Элемент 1: ряды 1-3
//     "3 / 6", // Элемент 2: ряды 3-5
//     "1 / 4", // Элемент 3: ряды 1-3
//     "3 / 6", // Элемент 4: ряды 3-5
//   ];
//   return positions[index] || "auto";
// }
</script>

<style scoped>
.intro-square {
  --element-side-size: 120px;

  position: relative;
  display: grid;
  place-items: center;
  place-self: start start;
  width: var(--element-side-size);
  height: var(--element-side-size);
  list-style: none;
  box-sizing: border-box;
  cursor: pointer;
  z-index: 5;
  inset: 0;
  border-radius: 28px;
  transform-origin: 50% 50%;
  overflow: hidden;
}

.intro-square[data-state="true"],
.intro-square:hover {
  z-index: 6;
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
