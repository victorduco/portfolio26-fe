<template>
  <motion.li
    @hoverStart="isHovered = true"
    @hoverEnd="isHovered = false"
    @click="toggleState"
    :custom="{ index, additionalMargin }"
    :variants="boxVariants"
    :animate="animationState"
    :transition="boxTransition"
    initial="default"
    class="intro-square"
    :class="{
      'is-intro-visible': introVisible,
      'should-animate': shouldAnimate,
    }"
    :data-state="isActive"
    :style="{ opacity: shouldAnimate ? 1 : 0 }"
    v-backdrop-filter="backdropFilter"
  >
    <motion.div
      class="intro-square-content-wrap"
      :variants="contentWrapVariants"
      :animate="animationState"
      :transition="spring"
    >
      <motion.i
        class="intro-content-icon"
        :class="getIconClass(index)"
        :variants="squareContentVariants.icon"
        :animate="animationState"
        :custom="index"
        :transition="{
          default: spring,
          '--text-shadow-offset': textShadowSpring,
        }"
      ></motion.i>
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
  shouldAnimate: {
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

// Мягкая пружина для обратной анимации (active -> default)
const boxTransition = computed(() => {
  if (isActive.value) {
    // При открытии - обычная пружина
    return spring;
  } else {
    // При закрытии - более мягкая пружина (меньше колебаний)
    return {
      type: "spring",
      stiffness: 70,
      damping: 18,
      mass: 1.2,
    };
  }
});

const emit = defineEmits(["activeChange"]);

function toggleState() {
  isHovered.value = false;
  isActive.value = !isActive.value;

  emit("activeChange", isActive.value);
}

// Следим за forceClose и закрываем с анимацией
watch(
  () => props.forceClose,
  (newVal) => {
    if (newVal && isActive.value) {
      isActive.value = false;
      emit("activeChange", false);
    }
  }
);

// Computed additional margin для сдвига влево при активации
const additionalMargin = computed(() => props.activeCount * -30);

// Получаем класс иконки в зависимости от индекса
// Маппинг: Vision→icon-d, Connection→icon-a, Technology→icon-c, Scale→icon-b
function getIconClass(index) {
  const iconNames = ["icon-d", "icon-a", "icon-c", "icon-b"];
  return iconNames[index] || "icon-a";
}
</script>

<style scoped>
.intro-square {
  --element-side-size: clamp(80px, 20vw, 120px);
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
  border-radius: 16px;
  transform-origin: 50% 50%;
  border: 2px solid var(--border-color);
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
  z-index: 100;
}

.intro-square.is-intro-visible:hover {
  z-index: 100;
}

.intro-square:focus-visible {
  outline: 2px solid rgba(39, 169, 255, 0.8);
  outline-offset: 4px;
  z-index: 10;
}

.intro-square-content-wrap {
  display: grid;
  place-items: center;
  pointer-events: none;
  z-index: 1;
  position: absolute;
  inset: 0;
}

.intro-content-icon {
  position: absolute;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  user-select: none;
  text-shadow: calc(-1 * var(--text-shadow-offset)) var(--text-shadow-offset)
      calc(var(--text-shadow-offset) - 5px) var(--text-glow-color),
    var(--text-shadow-offset) var(--text-shadow-offset)
      calc(var(--text-shadow-offset) - 5px) var(--text-glow-color),
    0px 0px calc(var(--text-shadow-offset) - 5px) var(--text-glow-color);
}

.intro-content-icon::before {
  margin: 0;
  width: auto;
}
</style>
