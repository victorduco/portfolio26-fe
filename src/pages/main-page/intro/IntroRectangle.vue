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
    v-mask-element="'#171717'"
  >
    <GlassEffect
      ref="glassEffectRef"
      :user-options="INTRO_GLASS_CONFIG"
      :intensity="glassIntensity"
      class="intro-square-glass"
    >
    </GlassEffect>

    <motion.div
      class="intro-square-content-wrap"
      :variants="contentWrapVariants"
      :animate="getAnimationState()"
      :transition="spring"
    >
      <motion.div
        class="intro-content-number"
        :variants="squareContentVariants.number"
        :animate="getAnimationState()"
        :custom="index"
      >
        {{ index + 1 }}
      </motion.div>
      <motion.div
        class="intro-content-bullet"
        :variants="squareContentVariants.bullet"
        :animate="getAnimationState()"
        >•</motion.div
      >
    </motion.div>

    <IntroRectangleActive :index="index" :is-active="isActive" />
  </motion.li>
</template>

<script setup>
import { motion } from "motion-v";
import { computed, ref } from "vue";
import GlassEffect from "../../../components/glass-effect/GlassEffect.vue";
import IntroRectangleActive from "./IntroRectangleActive.vue";
import { INTRO_GLASS_CONFIG } from "./glassConfig.js";
import {
  spring,
  marginSpring,
  boxVariants,
  contentWrapVariants,
  squareContentVariants,
  glassIntensityVariants,
} from "./variants.js";

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  activeCount: {
    type: Number,
    default: 0,
  },
  introVisible: {
    type: Boolean,
    default: false,
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
  // Не показываем hover пока Intro не появился
  if (isHovered.value && props.introVisible) return "hover";
  return "default";
}
const emit = defineEmits(["activeChange"]);

function toggleState() {
  isHovered.value = false;
  isActive.value = !isActive.value;

  emit("activeChange", isActive.value);
}

// Динамическая интенсивность по состояниям
const glassIntensity = computed(() => {
  if (isActive.value) return glassIntensityVariants.active.intensity;
  // Не показываем hover интенсивность пока Intro не появился
  if (isHovered.value && props.introVisible) return glassIntensityVariants.hover.intensity;
  return glassIntensityVariants.default.intensity;
});

// Computed additional margin
const additionalMargin = computed(() => props.activeCount * -30);
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
  place-items: center;
  pointer-events: none;
  z-index: 1;
  position: absolute;
  inset: 0;
}

.intro-content-number {
  position: absolute;
  color: var(--color-square-content);
  font-weight: 600;
  font-size: clamp(28px, 5vw, 56px);
  line-height: 1;
  user-select: none;
}

.intro-content-bullet {
  position: absolute;
  color: #3d3d3d;
  font-size: 60px;
  line-height: 1;
  user-select: none;
}
</style>
