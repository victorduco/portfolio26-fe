<template>
  <GlassEffect
    class="keypad-button-wrapper"
    v-hover-distortion="1.2"
    v-mask-element="'#171717'"
    :user-options="glassEffectConfig"
    @mousedown="currentState = 'pressed'"
    @mouseup="currentState = isHovered ? 'hover' : 'default'"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
    @click="emit('click', value)"
  >
    <motion.div
      class="keypad-number"
      :variants="numberVariants"
      :animate="currentState"
      :transition="spring"
    >
      {{ value }}
    </motion.div>
  </GlassEffect>
</template>

<script setup>
import { ref } from "vue";
import { motion } from "motion-v";
import GlassEffect from "../glass-effect/GlassEffect.vue";
import {
  spring,
  numberVariants,
} from "./keypadVariants.js";
import { glassEffectConfig } from "./glassEffectConfig.js";

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
  width: 130px !important;
  height: 130px !important;
  border-radius: 28px !important;
  cursor: pointer;
}

.keypad-number {
  font-size: 42px;
  font-weight: 800;
  line-height: 1;
  user-select: none;
  pointer-events: none;
  color: #ffffff;
}
</style>
