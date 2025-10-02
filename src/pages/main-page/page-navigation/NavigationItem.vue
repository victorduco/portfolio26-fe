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
      :transition="spring"
    >
      {{ label }}
    </motion.div>
    <motion.div
      class="nav-item"
      :variants="navItemVariants"
      :animate="getAnimationState()"
      :transition="smoothTransition"
      :initial="false"
    />
  </button>
</template>

<script setup>
import { ref, computed } from "vue";
import { motion } from "motion-v";
import { spring, smoothTransition, navItemVariants, labelVariants } from "./variants.js";

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
});

const emit = defineEmits(["navigate"]);

const isHovered = ref(false);
const isPressed = ref(false);

function getAnimationState() {
  if (isPressed.value) return "pressed";
  if (props.isActive) return "active";
  if (isHovered.value) return "hover";
  return "default";
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
  padding: 0;
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
