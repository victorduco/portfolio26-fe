<template>
  <div v-hover-distortion="4">
    <GlassEffect
      class="keypad-button-wrapper"
      v-mask-element="'#171717'"
      :user-options="glassEffectConfig"
      @mousedown="currentState = 'pressed'"
      @mouseup="currentState = isHovered ? 'hover' : 'default'"
      @mouseleave="handleMouseLeave"
      @mouseenter="handleMouseEnter"
      @click="emit('click', value)"
      :static-displacement-map="staticDisplacementMap"
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import { motion } from "motion-v";
import GlassEffect from "../glass-effect/GlassEffect.vue";
import { spring, numberVariants } from "./keypadVariants.js";
import { glassEffectConfig } from "./glassEffectConfig.js";
import staticDisplacementMap from "../../assets/distmaps/nummp1.png";

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
  width: 110px;
  height: 110px;
  border-radius: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(45deg);
}

.keypad-number {
  font-size: 42px;
  font-weight: 800;
  line-height: 1;
  user-select: none;
  pointer-events: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transform: rotate(-45deg);
}
</style>
