<template>
  <button
    class="nav-item-wrapper"
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
      {{ label }}
    </motion.div>
    <motion.div
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
});

const emit = defineEmits(["navigate"]);

const isHovered = ref(false);
const isPressed = ref(false);

function getAnimationState() {
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
watch(() => props.introHighlight, (newVal) => {
  if (newVal) {
    hasAppeared.value = true;
    hasBeenIntroHighlighted.value = true;
  }
}, { flush: 'sync' });

// Также отслеживаем зеленое состояние
watch(() => props.introGreen, (newVal) => {
  if (newVal) {
    hasAppeared.value = true;
    hasBeenIntroHighlighted.value = true;
  }
}, { flush: 'sync' });

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
  console.log("NavigationItem clicked:", props.sectionId);
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
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 4px;
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
</style>
