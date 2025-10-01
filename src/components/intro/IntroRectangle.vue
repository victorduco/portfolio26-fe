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
        :variants="squareContentNumVariants"
        :animate="getAnimationState()"
        :custom="index"
      >
        {{ index + 1 }}
      </motion.div>
      <motion.div
        class="intro-content-bullet"
        :variants="squareContentBulletVariants"
        :animate="getAnimationState()"
        >•
      </motion.div>
    </motion.div>
  </motion.li>
</template>

<script setup>
import { motion } from "motion-v";
import { computed, ref } from "vue";
import GlassEffect from "../glass-effect/GlassEffect.vue";
import { INTRO_GLASS_CONFIG } from "./glassConfig.js";
import {
  spring,
  marginSpring,
  boxVariants,
  contentWrapVariants,
  squareContentNumVariants,
  squareContentBulletVariants,
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

// Динамическая интенсивность по состояниям
const glassIntensity = computed(() => {
  if (isActive.value) return glassIntensityVariants.active.intensity;
  if (isHovered.value) return glassIntensityVariants.hover.intensity;
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
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  color: var(--color-square-content);
  font-weight: 800;
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1;
  user-select: none;
  pointer-events: none;
}

.intro-content-bullet {
  display: grid;
  place-items: center;
  color: #3d3d3d;
  font-size: 60px;
  line-height: 1;
  user-select: none;
  pointer-events: none;
  position: absolute;
  text-align: center;
  transform: translateY(-25%) translateX(10%);
}
</style>
