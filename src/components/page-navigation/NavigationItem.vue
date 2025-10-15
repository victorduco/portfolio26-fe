<template>
  <button
    class="nav-item-wrapper"
    :class="{ mobile: mobileMode }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="handleClick"
    @mousedown="isPressed = true"
    @mouseup="isPressed = false"
    :aria-label="`Navigate to ${label}`"
  >
    <motion.div
      class="nav-item-label"
      :variants="labelVariants"
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
      :variants="navItemVariants"
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
});

const emit = defineEmits(["navigate"]);

const isHovered = ref(false);
const isPressed = ref(false);

function getAnimationState() {
  // Упрощенная логика для mobile
  if (props.mobileMode) {
    if (isPressed.value) return "pressed";
    if (props.isActive) return "active";
    return "default";
  }

  // Приоритет: fadeOut > зеленый > highlight > остальное
  if (props.introFadeOut) return "introFadeOut";
  if (props.introGreen) return "introGreen";
  if (props.introHighlight) return "introHighlight";
  if (isPressed.value) return "pressed";
  // Показываем active только после того как элемент прошел intro анимацию
  if (props.isActive && hasBeenIntroHighlighted.value) return "active";
  if (isHovered.value) return "hover";
  return "default";
}

const hasAppeared = ref(false);
const hasBeenIntroHighlighted = ref(false);

// Отслеживаем когда квадрат и текст должны появиться
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

// Также отслеживаем зеленое состояние
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
  // Приоритет: зеленый > highlight > остальное
  if (props.introGreen) {
    return "introGreen";
  }

  // Во время introHighlight показываем квадрат
  if (props.introHighlight) {
    return "introHighlight";
  }

  // Пока квадрат не появился - скрываем
  if (!hasAppeared.value) return "hidden";

  // После появления работаем как обычно
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
  // Используем плавный transition без пружины для opacity
  return {
    type: "tween",
    duration: 0.25,
    ease: "easeInOut",
  };
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

.nav-item-label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
}

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
