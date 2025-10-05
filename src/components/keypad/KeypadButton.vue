<template>
  <div
    v-hover-distortion="4"
    class="keypad-button-hover-wrapper"
    @mousedown="currentState = 'pressed'"
    @mouseup="currentState = isHovered ? 'hover' : 'default'"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
    @click="emit('click', value)"
  >
    <div class="keypad-button-wrapper" v-mask-element="'#171717'">
      <GlassEffect
        class="keypad-button-glass"
        :user-options="glassEffectConfig"
        :static-displacement-map="staticDisplacementMap"
      >
      </GlassEffect>

      <motion.div
        class="keypad-number"
        :variants="numberVariants"
        :animate="currentState"
        :transition="isMounted ? spring : { duration: 0 }"
      >
        {{ value }}
      </motion.div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
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
const isMounted = ref(false);

onMounted(() => {
  requestAnimationFrame(() => {
    isMounted.value = true;
  });
});

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
.keypad-button-hover-wrapper {
  cursor: pointer;
}

.keypad-button-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 28px;
  display: grid;
  place-items: center;
  overflow: hidden;
  transform: rotate(45deg);
}

.keypad-button-glass {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.keypad-number {
  position: absolute;
  inset: 0;
  font-size: 30px;
  font-weight: 600;
  line-height: 1;
  user-select: none;
  pointer-events: none;
  color: #eeeeee;
  display: grid;
  place-items: center;
  z-index: 1;
}
</style>
