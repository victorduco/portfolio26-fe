<template>
  <motion.li
    @hoverStart="isHovered = true"
    @hoverEnd="isHovered = false"
    @click="toggleState"
    :custom="{ index, additionalMargin }"
    :variants="boxVariants"
    :animate="animationState"
    :transition="{
      default: spring,
      marginLeft: marginSpring,
      marginRight: marginSpring,
    }"
    initial="default"
    class="intro-square"
    :class="{ 'is-intro-visible': introVisible }"
    :data-state="isActive"
    v-backdrop-filter="backdropFilter"
  >
    <motion.div
      class="intro-square-content-wrap"
      :variants="contentWrapVariants"
      :animate="animationState"
      :transition="spring"
    >
      <motion.div
        class="intro-content-number"
        :variants="squareContentVariants.number"
        :animate="animationState"
        :custom="index"
        :transition="{
          default: spring,
          '--text-shadow-offset': textShadowSpring,
        }"
      >
        {{ index + 1 }}
      </motion.div>
      <motion.svg
        class="intro-content-bullet"
        :variants="squareContentVariants.bullet"
        :animate="animationState"
        viewBox="0 0 40 40"
        width="40"
        height="40"
      >
        <circle cx="20" cy="20" r="8" />
      </motion.svg>
    </motion.div>

    <IntroRectangleActive :index="index" :is-active="isActive" />
  </motion.li>
</template>

<script setup>
import { motion } from "motion-v";
import { computed, ref, watch } from "vue";
import IntroRectangleActive from "./IntroRectangleActive.vue";
import { backdropFilter as vBackdropFilter } from "@/directives/backdrop-filter";
import {
  spring,
  marginSpring,
  textShadowSpring,
  boxVariants,
  contentWrapVariants,
  squareContentVariants,
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
  forceClose: {
    type: Boolean,
    default: false,
  },
  backdropFilter: {
    type: Object,
    default: () => ({
      blur: "15px",
      saturate: "100%",
      brightness: "100%",
    }),
  },
});

const isActive = ref(false);
const isHovered = ref(false);

// Определение состояния анимации (computed для переиспользования)
const animationState = computed(() => {
  // Обычные интерактивные состояния
  if (isActive.value) return "active";
  // Не показываем hover пока Intro не появился
  if (isHovered.value && props.introVisible) return "hover";
  return "default";
});
const emit = defineEmits(["activeChange"]);

function toggleState() {
  isHovered.value = false;
  isActive.value = !isActive.value;

  emit("activeChange", isActive.value);
}

// Следим за forceClose и закрываем с анимацией
watch(() => props.forceClose, (newVal) => {
  if (newVal && isActive.value) {
    isActive.value = false;
    emit("activeChange", false);
  }
});

// Computed additional margin
const additionalMargin = computed(() => props.activeCount * -30);
</script>

<style scoped>
.intro-square {
  --element-side-size: 120px;
  --border-gradient: transparent;
  --glow-color: transparent;
  --border-color: #222;
  --text-glow-color: transparent;
  --text-shadow-offset: 0px;

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
  border: 2px solid var(--border-color);
}

.intro-square::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    -25deg,
    color-mix(in srgb, var(--glow-color) 50%, transparent),
    transparent 50%
  );
  pointer-events: none;
  z-index: 1;
}

.intro-square[data-state="true"] {
  z-index: 6;
}

.intro-square.is-intro-visible:hover {
  z-index: 6;
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
  font-size: 70px;
  line-height: 1;
  user-select: none;
  text-shadow: calc(-1 * var(--text-shadow-offset)) var(--text-shadow-offset)
      85px var(--text-glow-color),
    var(--text-shadow-offset) var(--text-shadow-offset) 85px
      var(--text-glow-color),
    calc(-1 * var(--text-shadow-offset)) var(--text-shadow-offset) 80px
      var(--text-glow-color),
    var(--text-shadow-offset) var(--text-shadow-offset) 80px
      var(--text-glow-color),
    0px 0px 50px var(--text-glow-color);
}

.intro-content-bullet {
  position: absolute;
  width: 40px;
  height: 40px;
  fill: #3d3d3d;
  user-select: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
