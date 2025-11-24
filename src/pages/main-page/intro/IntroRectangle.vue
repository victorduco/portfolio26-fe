<template>
  <motion.li
    class="intro-square-wrapper"
    :class="{ 'intro-square-wrapper--mobile': isMobileLayout, 'intro-square-wrapper--smallest': isSmallestBreakpoints }"
    :variants="wrapperVariants"
    :animate="shouldAnimate ? 'visible' : 'hidden'"
    :transition="wrapperTransition"
    initial="hidden"
  >
    <motion.div
      @hoverStart="isHovered = true"
      @hoverEnd="isHovered = false"
      @click="toggleState"
      :custom="{ index, additionalMargin, isMobileLayout, isSmallestBreakpoints }"
      :variants="boxVariants"
      :animate="animationState"
      :transition="isActive ? spring : inactiveTransition"
      initial="default"
      class="intro-square"
      :class="squareClasses"
      :data-state="isActive"
      v-backdrop-filter="backdropFilter"
    >
      <motion.div class="intro-square-content-wrap" :variants="contentWrapVariants" :animate="animationState" :transition="spring">
        <motion.i
          class="intro-content-icon"
          :class="ICON_CLASSES[index]"
          :variants="squareContentVariants.icon"
          initial="default"
          :animate="animationState"
          :custom="index"
          :transition="spring"
        />
      </motion.div>
      <IntroRectangleActive
        :index="index"
        :is-active="isActive"
        :is-mobile-layout="isMobileLayout"
        :is-smallest-breakpoints="isSmallestBreakpoints"
        @close="handleMobileCloseRequest"
      />
    </motion.div>
  </motion.li>
</template>

<script setup>
import { motion } from "motion-v";
import { computed, ref, watch } from "vue";
import IntroRectangleActive from "./IntroRectangleActive.vue";
import { backdropFilter as vBackdropFilter } from "@/directives/backdrop-filter";
import {
  spring, contentWrapVariants, squareContentVariants, useBoxVariants,
  wrapperVariants, wrapperTransition, inactiveTransition, ICON_CLASSES
} from "./variants.js";

const boxVariants = useBoxVariants();

const props = defineProps({
  index: { type: Number, required: true },
  activeCount: { type: Number, default: 0 },
  introVisible: { type: Boolean, default: false },
  forceClose: { type: Boolean, default: false },
  shouldAnimate: { type: Boolean, default: false },
  isMobileLayout: { type: Boolean, default: false },
  isSmallestBreakpoints: { type: Boolean, default: false },
  activeMobileIndex: { type: Number, default: -1 },
  backdropFilter: { type: Object, default: () => ({ blur: "15px", saturate: "100%", brightness: "100%" }) },
});

const emit = defineEmits(["activeChange", "mobileOpen", "mobileClose"]);

const localActive = ref(false);
const isHovered = ref(false);

const isMobile = computed(() => props.isMobileLayout || props.isSmallestBreakpoints);

const isActive = computed(() => isMobile.value ? props.activeMobileIndex === props.index : localActive.value);

const animationState = computed(() => {
  if (isActive.value) return "active";
  if (!isMobile.value && isHovered.value && props.introVisible && props.shouldAnimate) return "hover";
  return "default";
});

const squareClasses = computed(() => ({
  'is-intro-visible': props.introVisible,
  'should-animate': props.shouldAnimate,
  'intro-square--mobile': props.isMobileLayout,
  'intro-square--mobile-active': props.isMobileLayout && isActive.value,
  'intro-square--smallest': props.isSmallestBreakpoints,
  'intro-square--smallest-active': props.isSmallestBreakpoints && isActive.value,
}));

const additionalMargin = computed(() => {
  if (isMobile.value) return 0;
  return props.activeCount * Math.max(-40, Math.min(-28, -40 + (window.innerWidth - 1200) * 0.01));
});

function toggleState() {
  isHovered.value = false;
  if (isMobile.value) {
    isActive.value ? handleMobileCloseRequest() : (emit("mobileOpen", props.index), emit("activeChange", true));
    return;
  }
  localActive.value = !localActive.value;
  emit("activeChange", localActive.value);
}

function handleMobileCloseRequest() {
  if (!isMobile.value) return;
  emit("mobileClose", props.index);
  emit("activeChange", false);
}

watch(() => props.forceClose, (v) => {
  if (!isMobile.value && v && isActive.value) {
    localActive.value = false;
    emit("activeChange", false);
  }
});

watch([() => props.isMobileLayout, () => props.isSmallestBreakpoints], () => { localActive.value = false; });
</script>

<style scoped>
.intro-square-wrapper { place-self: start; list-style: none; }

.intro-square {
  --element-side-size: clamp(80px, 20vw, 120px);
  --border-color: #222;
  --glow-color: transparent;
  --border-radius: 26px;
  position: relative;
  display: grid;
  place-items: center;
  width: var(--element-side-size);
  height: var(--element-side-size);
  box-sizing: border-box;
  cursor: pointer;
  z-index: 5;
  border-radius: var(--border-radius);
  border: 3px solid var(--border-color);
  user-select: none;
  overflow: hidden;
}

@media (min-width: 900px) {
  .intro-square-wrapper:nth-child(1) { grid-column: 1; grid-row: 1; }
  .intro-square-wrapper:nth-child(2) { grid-column: 3; grid-row: 2; }
  .intro-square-wrapper:nth-child(3) { grid-column: 5; grid-row: 1; }
  .intro-square-wrapper:nth-child(4) { grid-column: 7; grid-row: 2; }
}

@media (max-width: 899px) {
  .intro-square-wrapper { grid-column: auto; grid-row: auto; }
}

.intro-square::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(-25deg, color-mix(in srgb, var(--glow-color) 50%, transparent), transparent 50%);
  pointer-events: none;
  z-index: 1;
}

.intro-square:is([data-state="true"], .is-intro-visible:hover) { z-index: 10000; }

.intro-square:focus-visible { outline: 2px solid rgba(39, 169, 255, 0.8); outline-offset: 4px; z-index: 10; }

.intro-square-content-wrap {
  display: grid;
  place-items: center;
  pointer-events: none;
  z-index: 1;
  position: absolute;
  inset: 0;
}

.intro-content-icon {
  --text-shadow-offset: 70px;
  --text-shadow-blur: 100px;
  --text-glow-color: transparent;
  position: absolute;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  user-select: none;
  text-shadow:
    calc(-1 * var(--text-shadow-offset)) var(--text-shadow-offset) var(--text-shadow-blur) var(--text-glow-color),
    var(--text-shadow-offset) var(--text-shadow-offset) var(--text-shadow-blur) var(--text-glow-color),
    0 0 var(--text-shadow-blur) var(--text-glow-color);
}

.intro-content-icon::before { margin: 0; width: auto; }

@media (min-width: 1920px) { .intro-content-icon { font-size: 28px; } }

@media (max-width: 600px) {
  .intro-square--smallest.is-intro-visible:hover { z-index: 5; }
  .intro-square--smallest-active { position: relative; }
}
</style>
