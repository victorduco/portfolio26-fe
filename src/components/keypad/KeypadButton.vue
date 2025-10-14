<template>
  <div
    v-hover-distortion="!isMobile && !isLandscapeMobile ? 4 : null"
    class="keypad-button-hover-wrapper"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
    @click="handleClick"
  >
    <!-- Desktop portrait: mask-element + GlassEffect -->
    <div
      v-if="!isMobile && !isLandscapeMobile"
      class="keypad-button-wrapper"
      v-mask-element="'#171717'"
    >
      <GlassEffect
        class="keypad-button-glass"
        :user-options="glassEffectConfig"
      />

      <motion.div
        class="keypad-number"
        :variants="numberVariants"
        :animate="currentState"
        :initial="false"
        :transition="isMounted ? spring : { duration: 0 }"
      >
        {{ value }}
      </motion.div>
    </div>

    <!-- Mobile or landscape: backdrop-filter only -->
    <div
      v-else
      class="keypad-button-wrapper"
      v-backdrop-filter="backdropFilterOptions"
    >
      <motion.div
        class="keypad-number"
        :variants="numberVariants"
        :animate="currentState"
        :initial="false"
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
import {
  useIsMobile,
  useIsLandscapeMobile,
} from "../../composables/useMediaQuery.js";

const props = defineProps({
  value: {
    type: [Number, String],
    required: true,
  },
});

const emit = defineEmits(["click"]);

const isMobile = useIsMobile();
const isLandscapeMobile = useIsLandscapeMobile();

// Backdrop filter options for mobile (same as IntroRectangle)
const backdropFilterOptions = {
  blur: "15px",
  saturate: "100%",
  brightness: "100%",
};

const currentState = ref("default");
const isHovered = ref(false);
const isMounted = ref(false);

onMounted(() => {
  requestAnimationFrame(() => {
    isMounted.value = true;
    if (typeof window !== "undefined" && window.__profile) {
      window.__profile.mark("keypad-button-mounted");
    }
  });
});

function handleMouseDown() {
  if (typeof window !== "undefined" && window.__profile) {
    window.__profile.mark("button-mousedown");
  }
  currentState.value = "pressed";
}

function handleMouseUp() {
  if (typeof window !== "undefined" && window.__profile) {
    window.__profile.mark("button-mouseup");
  }
  currentState.value = isHovered.value ? "hover" : "default";
}

function handleMouseEnter() {
  if (typeof window !== "undefined" && window.__profile) {
    window.__profile.start("button-hover-animation");
  }
  isHovered.value = true;
  if (currentState.value !== "pressed") currentState.value = "hover";
  requestAnimationFrame(() => {
    if (typeof window !== "undefined" && window.__profile) {
      window.__profile.end("button-hover-animation");
      window.__profile.mark("button-hover-complete");
    }
  });
}

function handleMouseLeave() {
  isHovered.value = false;
  currentState.value = "default";
  if (typeof window !== "undefined" && window.__profile) {
    window.__profile.mark("button-hover-end");
  }
}

function handleClick() {
  if (typeof window !== "undefined" && window.__profile) {
    window.__profile.mark(`button-${props.value}-clicked`);
  }
  emit("click", props.value);
}
</script>

<style scoped>
.keypad-button-hover-wrapper {
  cursor: pointer;
}

.keypad-button-wrapper {
  position: relative;
  width: clamp(72px, 18vw, 110px);
  height: clamp(72px, 18vw, 110px);
  border-radius: clamp(18px, 4.5vw, 28px);
  display: grid;
  place-items: center;
  overflow: hidden;
  transform: rotate(45deg);
  border: 1px solid #ffffff09;
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
  font-size: clamp(24px, 6vw, 30px);
  font-weight: 600;
  line-height: 1;
  user-select: none;
  pointer-events: none;
  color: #eeeeee;
  display: grid;
  place-items: center;
  z-index: 1;
}

/* Landscape mode: smaller buttons and text */
@media (orientation: landscape) and (max-height: 700px) {
  .keypad-button-wrapper {
    width: clamp(50px, 11vh, 90px);
    height: clamp(50px, 11vh, 90px);
    border-radius: clamp(12px, 2.75vh, 22px);
  }

  .keypad-number {
    font-size: clamp(18px, 4.5vh, 26px);
  }
}
</style>
