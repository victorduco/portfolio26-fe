<template>
  <button
    class="nav-item-wrapper"
    :class="{ mobile: mobileMode, [themeClass]: true }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="handleClick"
    @mousedown="isPressed = true"
    @mouseup="isPressed = false"
    :aria-label="`Navigate to ${label}`"
  >
    <motion.div
      class="nav-item-label"
      :variants="computedLabelVariants"
      :animate="getAnimationState()"
      :transition="getLabelTransition()"
      :initial="'default'"
    >
      <span class="nav-item-label-content">
        <img
          v-if="icon && !mobileMode"
          :src="icon"
          alt=""
          aria-hidden="true"
          class="nav-item-icon"
        />
        <span class="nav-item-label-text">{{ label }}</span>
      </span>
    </motion.div>
    <motion.div
      v-if="!mobileMode"
      class="nav-item"
      :class="{ 'is-intro': isIntroAnimation }"
      :variants="computedNavItemVariants"
      :animate="getSquareAnimationState()"
      :transition="{
        rotate: smoothTransition,
        opacity: opacityTween,
        backgroundColor: backgroundTween,
      }"
      :initial="'hidden'"
    />
  </button>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { motion } from "motion-v";
import {
  spring,
  smoothTransition,
  opacityTween,
  backgroundTween,
  navItemVariants,
  labelVariants,
} from "./variants.js";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "",
  },
  sectionId: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  introHighlight: {
    type: Boolean,
    default: false,
  },
  introGreen: {
    type: Boolean,
    default: false,
  },
  introFadeOut: {
    type: Boolean,
    default: false,
  },
  introComplete: {
    type: Boolean,
    default: false,
  },
  mobileMode: {
    type: Boolean,
    default: false,
  },
  darkMode: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["navigate"]);

const isHovered = ref(false);
const isPressed = ref(false);

const themeClass = computed(() => {
  const mode = props.darkMode ? "dark-mode" : "light-mode";
  return mode;
});

const isIntroAnimation = computed(() => {
  return props.introGreen || props.introHighlight;
});


const computedLabelVariants = computed(() => {
  const textColor = props.darkMode ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)";

  return {
    default: {
      opacity: 0,
      color: textColor,
    },
    hover: {
      opacity: 1,
      color: textColor,
    },
    active: {
      opacity: 1,
      color: textColor,
    },
    pressed: {
      opacity: 1,
      color: textColor,
    },
    introGreen: {
      opacity: 1,
      color: "#00FFBC",
    },
    introFadeOut: {
      opacity: 0,
      color: "#00FFBC",
    },
    introHighlight: {
      opacity: 1,
      color: textColor,
    },
  };
});


const computedNavItemVariants = computed(() => {
  const bgDefault = props.darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const bgHover = props.darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)";
  const bgActive = props.darkMode ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)";

  return {
    default: {
      rotate: 0,
      backgroundColor: bgDefault,
      opacity: 1,
    },
    hover: {
      rotate: 45,
      backgroundColor: bgHover,
      opacity: 1,
    },
    pressed: {
      rotate: 45,
      backgroundColor: bgHover,
      opacity: 1,
    },
    active: {
      rotate: 45,
      backgroundColor: bgActive,
      opacity: 1,
    },
    introGreen: {
      rotate: 0,
      backgroundColor: "#00FFBC",
      opacity: 1,
    },
    introHighlight: {
      rotate: 0,
      backgroundColor: bgDefault,
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  };
});

function getAnimationState() {
  
  if (props.mobileMode) {
    if (isPressed.value) return "pressed";
    if (props.isActive) return "active";
    return "default";
  }

  
  if (props.introFadeOut) return "introFadeOut";
  if (props.introGreen) return "introGreen";
  if (props.introHighlight) return "introHighlight";
  if (isPressed.value) return "pressed";
  
  if (props.isActive && hasBeenIntroHighlighted.value) return "active";
  if (isHovered.value) return "hover";
  return "default";
}

const hasAppeared = ref(false);
const hasBeenIntroHighlighted = ref(false);


watch(
  () => props.introHighlight,
  (newVal) => {
    if (newVal) {
      hasAppeared.value = true;
      hasBeenIntroHighlighted.value = true;
    }
  },
  { flush: "sync" }
);


watch(
  () => props.introGreen,
  (newVal) => {
    if (newVal) {
      hasAppeared.value = true;
      hasBeenIntroHighlighted.value = true;
    }
  },
  { flush: "sync" }
);

watch(
  () => props.introComplete,
  (newVal) => {
    if (newVal) {
      hasAppeared.value = true;
      hasBeenIntroHighlighted.value = true;
    }
  },
  { immediate: true }
);

function getSquareAnimationState() {
  
  if (props.introGreen) {
    return "introGreen";
  }

  
  if (props.introHighlight) {
    return "introHighlight";
  }

  
  if (!hasAppeared.value) return "hidden";

  
  if (isPressed.value) return "pressed";
  if (props.isActive) return "active";
  if (isHovered.value) return "hover";
  return "default";
}

function getLabelTransition() {
  if (props.introFadeOut) {
    return {
      type: "tween",
      duration: 0.15,
      ease: "easeOut",
    };
  }
  if (props.introHighlight) {
    return {
      type: "tween",
      duration: 0.4,
      ease: [0.4, 0, 0.6, 1], // ease-out curve (начинает быстро, заканчивает медленно)
    };
  }
  
  return {
    type: "tween",
    duration: 0.25,
    ease: "easeInOut",
  };
}

function getSquareBackgroundColor() {
  
  if (props.introGreen) return "#00FFBC";

  
  const state = getSquareAnimationState();

  if (state === 'active') {
    return props.darkMode ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)";
  } else if (state === 'hover' || state === 'pressed') {
    return props.darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)";
  } else {
    return props.darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  }
}

function handleClick(event) {
  emit("navigate", props.sectionId);
}
</script>

<style scoped>
.nav-item-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  cursor: pointer;
  border: none;
  background: transparent;
  padding: 12px 0;
  outline: none;
}

.nav-item-wrapper:focus-visible {
  outline: 2px solid rgba(39, 169, 255, 0.8);
  outline-offset: 4px;
  border-radius: 4px;
}

/* Mobile версия */
.nav-item-wrapper.mobile {
  width: 100%;
  justify-content: center;
  padding: 20px 32px;
  min-height: 56px;
  gap: 12px;
  border-radius: 12px;
  transition: background-color 0.2s ease;
}

.mobile .nav-item-label {
  opacity: 1 !important;
  position: static;
  font-size: 24px;
  font-weight: 500;
  text-align: center;
}

.mobile.nav-item-wrapper:active {
  background: rgba(255, 255, 255, 0.08);
}

/* Mobile dark mode */
.nav-item-wrapper.mobile.dark-mode .nav-item-label {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Mobile light mode */
.nav-item-wrapper.mobile.light-mode .nav-item-label {
  color: rgba(0, 0, 0, 0.9) !important;
}

.mobile .nav-item-label-text {
  line-height: 1.2;
}

/* Mobile landscape: reduce font size and padding to fit all items */
@media (max-width: 767px) and (orientation: landscape) {
  .nav-item-wrapper.mobile {
    padding: 12px 24px;
    min-height: 44px;
  }

  .mobile .nav-item-label {
    font-size: 18px;
  }
}

.nav-item {
  position: relative;
  pointer-events: none;
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

/* Removed filter: invert(1) - colors are now handled by variants.js */

.nav-item-label {
  font-family: var(--font-family-base);
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
}

/* Theme colors are now handled by computed variants in JavaScript */

.nav-item-label-content {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.nav-item-label-text {
  line-height: 1;
}

.nav-item-icon {
  width: 14px;
  height: 14px;
  display: block;
  pointer-events: none;
}
</style>
