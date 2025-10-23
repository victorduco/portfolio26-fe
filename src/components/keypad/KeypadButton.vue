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

    
    <div
      v-else
      class="keypad-button-wrapper"
    >
      <div class="keypad-button-backdrop"></div>
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
  border-radius: clamp(18px, 4.5vw, 23px);
  display: grid;
  place-items: center;
  overflow: hidden;
  transform: rotate(45deg);
  border: 1px solid #ffffff09;
  contain: layout style paint;
}

.keypad-button-glass {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.keypad-button-backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

/* Tablet landscape: enable backdrop-filter */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .keypad-button-backdrop {
    backdrop-filter: blur(15px) saturate(100%) brightness(100%);
    -webkit-backdrop-filter: blur(15px) saturate(100%) brightness(100%);
  }
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

/* Mobile portrait: optimize button size */
@media (max-width: 767px) and (orientation: portrait) {
  .keypad-button-hover-wrapper {
    width: clamp(70px, 20vw, 100px);
    height: clamp(70px, 20vw, 100px);
  }

  .keypad-button-wrapper {
    width: clamp(70px, 20vw, 100px);
    height: clamp(70px, 20vw, 100px);
    border-radius: clamp(18px, 5vw, 25px);
    border: 1px solid #222222;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .keypad-number {
    font-size: clamp(22px, 6.5vw, 28px);
  }
}

/* Mobile landscape: scale buttons based on width */
@media (max-width: 767px) and (orientation: landscape) {
  .keypad-button-hover-wrapper {
    width: clamp(60px, 14vw, 95px);
    height: clamp(60px, 14vw, 95px);
  }

  .keypad-button-wrapper {
    width: clamp(60px, 14vw, 95px);
    height: clamp(60px, 14vw, 95px);
    border-radius: clamp(15px, 3.5vw, 24px);
    border: 1px solid #444444;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .keypad-number {
    font-size: clamp(20px, 5vw, 26px);
  }
}
</style>
