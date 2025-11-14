<template>
  <motion.li
    v-if="shouldAnimate"
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
        :style="{
          '--text-shadow-offset': '70px',
          '--text-shadow-blur': '100px',
        }"
        :variants="squareContentVariants.icon"
        :initial="'default'"
        :animate="animationState"
        :custom="index"
        :transition="spring"
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
  contentWrapVariants,
  squareContentVariants,
  useBoxVariants,
} from "./variants.js";

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
  if (props.isSmallestBreakpoints || props.isMobileLayout) {
    return props.activeMobileIndex === props.index;
  }
  return localActive.value;
});

const animationState = computed(() => {
  if (props.isSmallestBreakpoints || props.isMobileLayout) {
    if (isActive.value) return "active";
    return "default";
  }

  if (isActive.value) return "active";

  if (isHovered.value && props.introVisible && props.shouldAnimate)
    return "hover";
  return "default";
});

const boxTransition = computed(() => {
  if (isActive.value) {
    return spring;
  } else {
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

const additionalMargin = computed(() => {
  if (props.isMobileLayout || props.isSmallestBreakpoints) {
    return 0;
  }
  // Adaptive margin based on viewport: scales from -28px to -40px
  const baseValue = Math.max(-40, Math.min(-28, -40 + (window.innerWidth - 1200) * 0.01));
  return props.activeCount * baseValue;
});

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
  --text-shadow-offset: 70px;
  --text-shadow-blur: 100px;
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
  border: 3px solid var(--border-color);
  opacity: 1;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  overflow: hidden;
}

/* Grid positioning for desktop (non-mobile layouts) */
@media (min-width: 900px) {
  /* index 0: gridColumn 1, gridRow 1 */
  .intro-square:nth-child(1) {
    grid-column: 1;
    grid-row: 1;
  }

  /* index 1: gridColumn 3, gridRow 2 */
  .intro-square:nth-child(2) {
    grid-column: 3;
    grid-row: 2;
  }

  /* index 2: gridColumn 5, gridRow 1 */
  .intro-square:nth-child(3) {
    grid-column: 5;
    grid-row: 1;
  }

  /* index 3: gridColumn 7, gridRow 2 */
  .intro-square:nth-child(4) {
    grid-column: 7;
    grid-row: 2;
  }
}

/* Mobile: auto positioning */
@media (max-width: 899px) {
  .intro-square {
    grid-column: auto;
    grid-row: auto;
  }
}

.intro-square::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 0;
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
      var(--text-shadow-blur) var(--text-glow-color),
    var(--text-shadow-offset) var(--text-shadow-offset) var(--text-shadow-blur)
      var(--text-glow-color),
    0px 0px var(--text-shadow-blur) var(--text-glow-color);
}

.intro-content-icon::before {
  margin: 0;
  width: auto;
}

/* Large desktops: larger icon size */
@media (min-width: 1920px) {
  .intro-content-icon {
    font-size: 28px;
  }
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
