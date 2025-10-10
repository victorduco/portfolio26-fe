<template>
  <div class="keypad-container">
    <!-- GeBackground disabled on mobile for performance -->
    <GeBackground
      v-if="!isMobile"
      source-selector="keypad-bg-export"
      :watch-data="enteredDigits"
      :render-delay="0"
      :background-styles="{
        filter: 'blur(10px) saturate(90%) brightness(0.9) contrast(1)',
      }"
    />

    <Motion
      tag="div"
      class="background-numbers"
      id="keypad-bg-export"
      :variants="backgroundNumbersVariants"
      :animate="bgNumbersState"
      :transition="backgroundNumbersTransition"
    >
      <div
        v-for="(digit, index) in enteredDigits"
        :key="index"
        class="background-digit"
        :style="{ color: getDigitColor(index) }"
      >
        {{ digit }}
      </div>
    </Motion>

    <Motion
      tag="div"
      class="keypad-grid"
      :variants="keypadGridVariants"
      :animate="keypadGridState"
      :transition="keypadGridTransition"
    >
      <KeypadButton
        v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
        :key="num"
        :value="num"
        @click="handleButtonClick(num)"
      />
      <KeypadButton
        :value="0"
        @click="handleButtonClick(0)"
        class="keypad-zero"
      />
    </Motion>

    <Motion
      v-show="showClearButton"
      tag="button"
      type="button"
      class="keypad-clear-button"
      :variants="keypadGridVariants"
      :animate="keypadGridState"
      :transition="keypadGridTransition"
      :initial="false"
      @click="handleClear"
    >
      Clear
    </Motion>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Motion } from "motion-v";
import KeypadButton from "./KeypadButton.vue";
import GeBackground from "../glass-effect/GeBackground.vue";
import { useMeta } from "../../composables/useMeta.js";
import { useIsMobile } from "../../composables/useMediaQuery.js";
import {
  keypadGridVariants,
  keypadGridTransition,
  backgroundNumbersVariants,
  backgroundNumbersTransition,
} from "./variants.js";

const isMobile = useIsMobile();

useMeta("keypad");

const emit = defineEmits(["unlock"]);

const enteredDigits = ref([]);
const colors = ["#27A9FF", "#FF83A2", "#00FFBC", "#FFFF78"];

const animationState = ref("initial");
const keypadGridState = ref("initial");
const bgNumbersState = ref("initial");
const isAnimating = ref(false);

const showClearButton = computed(() => enteredDigits.value.length > 0);

const getDigitColor = (index) => {
  if (animationState.value === "success") return "#00FFBC";
  if (animationState.value === "fail") return "#FF83A2";
  return colors[index % colors.length];
};

const isEditableTarget = (target) => {
  if (!target) return false;
  const editable = target.closest?.("input, textarea, select, [contenteditable='true']");
  return Boolean(editable || target.isContentEditable);
};

const animateFadeSequence = async (colorState, shouldUnlock) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  keypadGridState.value = "fadeOut";
  await new Promise((resolve) => setTimeout(resolve, 1000));

  animationState.value = colorState;
  await new Promise((resolve) => setTimeout(resolve, colorState === "success" ? 500 : 1000));

  bgNumbersState.value = "fadeOut";
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (shouldUnlock) {
    emit("unlock");
  } else {
    enteredDigits.value = [];
    animationState.value = "initial";
    bgNumbersState.value = "initial";
    keypadGridState.value = "initial";
    await new Promise((resolve) => setTimeout(resolve, 500));
    isAnimating.value = false;
  }
};

async function handleButtonClick(value) {
  if (isAnimating.value || enteredDigits.value.length >= 4) return;

  enteredDigits.value.push(value);

  if (enteredDigits.value.length === 4) {
    isAnimating.value = true;
    const code = enteredDigits.value.join("");
    const isCorrect = code === "8651";
    await animateFadeSequence(isCorrect ? "success" : "fail", isCorrect);
  }
}

function handleClear() {
  if (isAnimating.value) return;
  enteredDigits.value = [];
  animationState.value = "initial";
  bgNumbersState.value = "initial";
}

function handleBackspace() {
  if (isAnimating.value || enteredDigits.value.length === 0) return;
  enteredDigits.value = enteredDigits.value.slice(0, -1);
  animationState.value = "initial";
  bgNumbersState.value = "initial";
}

function handleKeyDown(event) {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey ||
      event.altKey || event.shiftKey || event.repeat) return;

  if (isEditableTarget(event.target)) return;

  if (event.key === "Backspace") {
    if (enteredDigits.value.length > 0) {
      event.preventDefault();
      handleBackspace();
    }
    return;
  }

  if (/^\d$/.test(event.key)) {
    event.preventDefault();
    handleButtonClick(Number(event.key));
  }
}

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeyDown);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", handleKeyDown);
  }
});
</script>

<style scoped>
.keypad-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #171717;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.background-numbers {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  row-gap: 0px;
  column-gap: 0px;
  pointer-events: none;
  z-index: 1;
  width: 100%;
  height: 100%;
}

@media (min-width: 768px) {
  .background-numbers {
    display: flex;
    grid-template-columns: unset;
    grid-template-rows: unset;
    align-items: center;
    justify-content: center;
  }
}

.background-digit {
  width: 100%;
  height: 100%;
  font-size: clamp(150px, 40vmax, 500px);
  font-weight: 400;
  line-height: 0.9;
  opacity: 1;
  user-select: none;
  margin: 0;
  padding: 0;
  transition: color 0.5s ease;
  display: grid;
  place-items: center;
}

/* Первые две цифры (верхняя строка) - place-items: end center */
.background-digit:nth-child(1),
.background-digit:nth-child(2) {
  place-items: end center;
}

/* Последние две цифры (нижняя строка) - place-items: start center */
.background-digit:nth-child(3),
.background-digit:nth-child(4) {
  place-items: start center;
}

@media (min-width: 768px) {
  .background-digit {
    width: auto;
    height: auto;
    font-size: clamp(280px, 50vw, 700px);
    line-height: 1;
    margin: 0 clamp(-10px, -2vw, -30px);
    display: block;
  }
}

.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: clamp(32px, 8vw, 80px);
  padding: clamp(24px, 4vw, 40px);
  position: relative;
  z-index: 10;
  max-width: 100%;
  max-height: 100%;
}

.keypad-zero {
  grid-column: 2 / 3;
}

.keypad-clear-button {
  position: absolute;
  bottom: max(32px, calc(env(safe-area-inset-bottom) + 16px));
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.02em;
  padding: 8px 12px;
  cursor: pointer;
  text-decoration: none;
}

.keypad-clear-button:hover {
  color: #ffffff;
}
</style>
