<template>
  <div
    class="keypad-button-wrapper"
    v-hover-distortion="1.2"
    @mousedown="currentState = 'pressed'"
    @mouseup="currentState = isHovered ? 'hover' : 'default'"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
  >
    <motion.svg
      class="keypad-diamond"
      viewBox="0 0 160 160"
      :variants="keypadButtonVariants"
      :animate="currentState"
      :transition="spring"
    >
      <rect
        x="15"
        y="15"
        width="130"
        height="130"
        rx="20"
        transform="rotate(45 80 80)"
      />
    </motion.svg>

    <motion.div
      class="keypad-number"
      :variants="numberVariants"
      :animate="currentState"
      :transition="spring"
    >
      {{ value }}
    </motion.div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { motion } from "motion-v";
import { spring, keypadButtonVariants, numberVariants } from "./keypadVariants.js";

const props = defineProps({
  value: {
    type: [Number, String],
    required: true,
  },
});

const emit = defineEmits(["click"]);

const currentState = ref("default");
const isHovered = ref(false);

function handleMouseEnter() {
  isHovered.value = true;
  if (currentState.value !== "pressed") {
    currentState.value = "hover";
  }
}

function handleMouseLeave() {
  isHovered.value = false;
  currentState.value = "default";
}
</script>

<style scoped>
.keypad-button-wrapper {
  width: 130px;
  height: 130px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.keypad-diamond {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.keypad-diamond rect {
  fill: rgba(255, 255, 255, 0.05);
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 1;
}

.keypad-number {
  position: relative;
  z-index: 1;
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  user-select: none;
  pointer-events: none;
}
</style>
