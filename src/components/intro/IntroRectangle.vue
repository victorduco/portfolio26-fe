<template>
  <ExportBgImg
    dom-id="intro-text-export-node"
    v-model="capturedImageUrl"
    background-color="#000"
  />
  <motion.li
    layout
    :custom="index"
    :variants="boxVariants"
    :animate="block.isActive ? 'active' : isHovered ? 'hover' : 'default'"
    :transition="layoutSpring"
    initial="default"
    class="intro-square"
    :class="[`intro-square--${block.slug}`, { 'is-active': block.isActive }]"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
    @click="$emit('click')"
    :data-state="block.isActive"
  >
    <motion.div
      class="intro-square-bg"
      :custom="{ slug: block.slug }"
      :variants="squareBgVariants"
      :animate="block.isActive ? 'active' : isHovered ? 'hover' : 'default'"
      :transition="spring"
    >
      <LiquidGlass
        :background-image-url="capturedImageUrl"
        :glass-config="rectangleGlassConfig"
        :intensity="glassIntensity"
        class="intro-square-glass"
        :id="captureId"
      >
      </LiquidGlass>

      <motion.div
        class="intro-square-highlight"
        :variants="squareHighlightVariants"
        :animate="block.isActive ? 'active' : isHovered ? 'hover' : 'default'"
        :transition="spring"
      />
    </motion.div>

    <motion.div
      class="intro-square-overlay"
      :variants="squareContentVariants"
      :animate="block.isActive ? 'active' : isHovered ? 'hover' : 'default'"
      :transition="spring"
    >
      <motion.div
        class="intro-content-number"
        :variants="squareContentNumVariants"
        :custom="{ slug: block.slug }"
        :animate="block.isActive ? 'active' : isHovered ? 'hover' : 'default'"
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
        :animate="block.isActive ? 'active' : isHovered ? 'hover' : 'default'"
      >
        •
      </motion.div>
    </motion.div>
  </motion.li>
</template>

<script setup>
import { motion } from "motion-v";
import { computed, ref } from "vue";
import LiquidGlass from "../glass-effect/GlassEffect.vue";
import ExportBgImg from "../bg-img/ExportBgImg.vue";
import { glassIntensityVariants } from "./variants.js";

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  isHovered: {
    type: Boolean,
    required: true,
  },
  layoutSpring: {
    type: Object,
    required: true,
  },
  spring: {
    type: Object,
    required: true,
  },
  boxVariants: {
    type: Object,
    required: true,
  },
  squareBgVariants: {
    type: Object,
    required: true,
  },
  squareContentVariants: {
    type: Object,
    required: true,
  },
  squareHighlightVariants: {
    type: Object,
    required: true,
  },
  squareContentNumVariants: {
    type: Object,
    required: true,
  },
  squareContentBulletVariants: {
    type: Object,
    required: true,
  },
});

const capturedImageUrl = ref("");
const captureId = `intro-rectangle-${props.index}`;

defineEmits(["mouseenter", "mouseleave", "click"]);

// Glass config для прямоугольника
const rectangleGlassConfig = {
  displacementScale: 45,
  aberrationIntensity: 2.0,
  surfaceCurvature: 1.5,
  glassBlur: 15,
  glassSaturation: 160,
  refractionDepth: 1.5,
  surfaceReflection: 0.3,
  shadowDepth: 0.3,
  shaderCornerRadius: 0.23,
  distortion: {
    start: 0.2,
    end: 0.15,
    offset: 0.1,
  },
  scaling: {
    start: 0,
    end: 1,
  },
};

// Динамическая интенсивность по состояниям с анимированными переходами
const glassIntensity = computed(() => {
  if (props.block.isActive) return glassIntensityVariants.active.intensity;
  if (props.isHovered) return glassIntensityVariants.hover.intensity;
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
  z-index: 1;
}

.intro-square[data-state="true"],
.intro-square:hover {
  z-index: 4;
}

.intro-square-bg,
.intro-square-overlay {
  position: absolute;
  inset: 0;
  border-radius: 28px;
  transform-origin: 50% 50%;
}

.intro-square-bg {
  display: grid;
  place-items: center;
  overflow: hidden;
  z-index: 0;
}

.intro-square-glass {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.intro-square-overlay {
  display: grid;
  place-items: center;
  pointer-events: none;
  z-index: 1;
}

.intro-square-highlight {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 34%;
  aspect-ratio: 1;
  border-radius: 50%;

  transform-origin: 50% 50%;
  pointer-events: none;
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
