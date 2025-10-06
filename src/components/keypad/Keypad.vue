<template>
  <div class="keypad-container">
    <GeBackground
      source-selector="keypad-bg-export"
      :watch-data="enteredDigits"
      :render-delay="0"
      :background-styles="{
        filter: 'blur(10px) saturate(90%) brightness(0.9) contrast(1)',
      }"
    />

    <!-- Фоновый слой с введенными цифрами -->
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
        :style="{
          color: animationState === 'success'
            ? '#00FFBC'
            : animationState === 'fail'
              ? '#FF83A2'
              : colors[index % colors.length]
        }"
      >
        {{ digit }}
      </div>
    </Motion>

    <!-- Сетка кнопок -->
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Motion } from "motion-v";
import KeypadButton from "./KeypadButton.vue";
import GeBackground from "../glass-effect/GeBackground.vue";
import { useMeta } from "../../composables/useMeta.js";
import {
  createDigitVariants,
  digitTransition,
  keypadGridVariants,
  keypadGridTransition,
  backgroundNumbersVariants,
  backgroundNumbersTransition,
} from "./variants.js";

// Устанавливаем мета-теги для Keypad
useMeta("keypad");

const emit = defineEmits(["unlock"]);

// Массив введенных цифр
const enteredDigits = ref([]);

// Массив цветов для каждой последующей цифры
const colors = ["#27A9FF", "#FF83A2", "#00FFBC", "#FFFF78"];

// Состояния анимации
const animationState = ref("initial");
const keypadGridState = ref("initial");
const bgNumbersState = ref("initial");

const isAnimating = ref(false);

async function handleButtonClick(value) {
  // Блокируем ввод если идет анимация или уже введено 4 цифры
  if (isAnimating.value || enteredDigits.value.length >= 4) {
    return;
  }

  enteredDigits.value.push(value);

  // После ввода 4 цифр запускаем анимацию
  if (enteredDigits.value.length === 4) {
    isAnimating.value = true;

    // Проверка кода (пока хардкод, потом бекенд)
    const code = enteredDigits.value.join("");
    const isCorrectCode = code === "8651";

    if (isCorrectCode) {
      await handleSuccessAnimation();
    } else {
      await handleFailAnimation();
    }
  }
}

async function handleSuccessAnimation() {
  // 1. Ждем 0.5 сек
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 2. Fade out клавиатуры (0.5 сек) + ждем завершения
  keypadGridState.value = "fadeOut";
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 3. Цвета становятся зелеными (0.5 сек)
  animationState.value = "success";
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 4. Fade out цифр (0.5 сек)
  bgNumbersState.value = "fadeOut";
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 5. Открываем главную
  emit("unlock");
}

async function handleFailAnimation() {
  // 1. Ждем 0.5 сек
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 2. Fade out клавиатуры (0.5 сек) + ждем завершения
  keypadGridState.value = "fadeOut";
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 3. Цвета становятся розовыми (0.5 сек)
  animationState.value = "fail";
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 4. Fade out цифр (0.5 сек)
  bgNumbersState.value = "fadeOut";
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 5. Сброс - убираем цифры, возвращаем состояния
  enteredDigits.value = [];
  animationState.value = "initial";
  bgNumbersState.value = "initial";

  // 6. Клавиатура появляется обратно (0.5 сек)
  keypadGridState.value = "initial";
  await new Promise((resolve) => setTimeout(resolve, 500));

  isAnimating.value = false;
}
</script>

<style scoped>
.keypad-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #171717;
  position: relative;
}

.background-numbers {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  display: flex;
  gap: 0px;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
}

.background-digit {
  font-size: 700px;
  font-weight: 400;
  line-height: 1;
  opacity: 1;
  user-select: none;
  margin: 0 -30px;
  transition: color 0.5s ease;
}

.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 80px;
  padding: 40px;
  position: relative;
  z-index: 10;
}

.keypad-zero {
  grid-column: 2 / 3;
}
</style>
