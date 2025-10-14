<template>
  <motion.li
    @hoverStart="isHovered = true"
    @hoverEnd="isHovered = false"
    @click="toggleState"
    :custom="{ index, additionalMargin, isMobileLayout, isSmallestBreakpoints }"
    :variants="boxVariants"
    :animate="animationState"
    :transition="boxTransition"
    initial="default"
    class="intro-square"
    :class="{
      'is-intro-visible': introVisible,
      'should-animate': shouldAnimate,
      'intro-square--mobile': isMobileLayout,
      'intro-square--mobile-active': isMobileLayout && isActive,
      'intro-square--smallest': isSmallestBreakpoints,
      'intro-square--smallest-active': isSmallestBreakpoints && isActive,
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

    <IntroRectangleActive
      :index="index"
      :is-active="isActive"
      :is-mobile-layout="isMobileLayout"
      :is-smallest-breakpoints="isSmallestBreakpoints"
      @close="handleMobileCloseRequest"
    />
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
  contentWrapVariants,
  squareContentVariants,
  useBoxVariants,
} from "./variants.js";

// Используем реактивные варианты с обработкой resize
const boxVariants = useBoxVariants();

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
  isMobileLayout: {
    type: Boolean,
    default: false,
  },
  isSmallestBreakpoints: {
    type: Boolean,
    default: false,
  },
  activeMobileIndex: {
    type: Number,
    default: -1,
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

const localActive = ref(false);
const isHovered = ref(false);

const isActive = computed(() => {
  // На двух наименьших брейкпоинтах используем fullscreen модальный режим
  if (props.isSmallestBreakpoints || props.isMobileLayout) {
    return props.activeMobileIndex === props.index;
  }
  return localActive.value;
});

// Определение состояния анимации (computed для переиспользования)
const animationState = computed(() => {
  // На двух наименьших брейкпоинтах: только default или active (без hover)
  if (props.isSmallestBreakpoints || props.isMobileLayout) {
    if (isActive.value) return "active";
    return "default";
  }
  // Обычные интерактивные состояния
  if (isActive.value) return "active";
  // Не показываем hover пока Intro не появился И пока этот конкретный прямоугольник не анимировался
  if (isHovered.value && props.introVisible && props.shouldAnimate)
    return "hover";
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

const emit = defineEmits(["activeChange", "mobileOpen", "mobileClose"]);

function toggleState() {
  isHovered.value = false;
  // На двух наименьших брейкпоинтах используем fullscreen модальный режим
  if (props.isSmallestBreakpoints || props.isMobileLayout) {
    if (isActive.value) {
      handleMobileCloseRequest();
    } else {
      emit("mobileOpen", props.index);
      emit("activeChange", true);
    }
    return;
  }

  localActive.value = !localActive.value;
  emit("activeChange", localActive.value);
}

// Следим за forceClose и закрываем с анимацией
watch(
  () => props.forceClose,
  (newVal) => {
    if (
      !props.isMobileLayout &&
      !props.isSmallestBreakpoints &&
      newVal &&
      isActive.value
    ) {
      localActive.value = false;
      emit("activeChange", false);
    }
  }
);

// Computed additional margin для сдвига влево при активации
// На маленьких брейкпоинтах не сдвигаем
const additionalMargin = computed(() =>
  props.isMobileLayout || props.isSmallestBreakpoints
    ? 0
    : props.activeCount * -40
);

// Получаем класс иконки в зависимости от индекса
// Маппинг: Vision→icon-d, Connection→icon-a, Technology→icon-c, Scale→icon-b
function getIconClass(index) {
  const iconNames = ["icon-d", "icon-a", "icon-c", "icon-b"];
  return iconNames[index] || "icon-a";
}

watch(
  () => props.isMobileLayout,
  (isMobile) => {
    if (isMobile) {
      localActive.value = false;
    }
  }
);

watch(
  () => props.isSmallestBreakpoints,
  (isSmallest) => {
    if (isSmallest) {
      localActive.value = false;
    }
  }
);

function handleMobileCloseRequest() {
  if (!props.isMobileLayout && !props.isSmallestBreakpoints) return;
  emit("mobileClose", props.index);
  emit("activeChange", false);
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
  --border-radius: 26px;

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
  border-radius: var(--border-radius);
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
  z-index: 10000;
}

.intro-square.is-intro-visible:hover {
  z-index: 10000;
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

/* Стили для двух наименьших брейкпоинтов (xs + sm: 360-600px) */
@media (max-width: 600px) {
  /* На маленьких экранах отключаем hover эффект */
  .intro-square--smallest.is-intro-visible:hover {
    z-index: 5;
  }

  /* Активный квадрат не сдвигает другие */
  .intro-square--smallest-active {
    position: relative;
  }
}
</style>
