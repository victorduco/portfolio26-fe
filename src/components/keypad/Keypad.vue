<template>
  <div class="keypad-container">
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
import KeypadButton from "./KeypadButton.vue";

function handleButtonClick(value) {
  console.log("Clicked:", value);
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
}

.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 32px;
  padding: 40px;
}

.keypad-zero {
  grid-column: 2 / 3;
}
</style>
