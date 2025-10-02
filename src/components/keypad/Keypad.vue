<template>
  <div class="keypad-container">
    <BgToSvg
      source-selector="keypad-bg-export"
      :watch-data="enteredDigits"
      :render-delay="0"
    />

    <!-- Фоновый слой с введенными цифрами -->
    <div class="background-numbers" id="keypad-bg-export">
      <div
        v-for="(digit, index) in enteredDigits"
        :key="index"
        class="background-digit"
        :style="{ color: colors[index % colors.length] }"
      >
        {{ digit }}
      </div>
    </div>

    <!-- Сетка кнопок -->
    <div class="keypad-grid">
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
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import KeypadButton from "./KeypadButton.vue";
import BgToSvg from "../bg-to-svg/BgToSvg.vue";

const emit = defineEmits(["unlock"]);

// Массив введенных цифр
const enteredDigits = ref([]);

// Массив цветов для каждой последующей цифры
const colors = ["#27A9FF", "#FF83A2", "#00FFBC", "#FFFF78"];

function handleButtonClick(value) {
  enteredDigits.value.push(value);
  console.log("Clicked:", value, "Total digits:", enteredDigits.value);

  // После ввода 4 цифр открываем главную страницу
  if (enteredDigits.value.length === 4) {
    emit("unlock");
  }
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
