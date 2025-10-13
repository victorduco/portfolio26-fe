<template>
  <Keypad @unlock="handleUnlock" />
</template>

<script setup>
import Keypad from "./components/keypad/Keypad.vue";

const handleUnlock = () => {
  // Успешная авторизация - редирект выполнится внутри Keypad
  console.log("Authentication successful");
};
</script>

<style scoped>
/* Стили переехали в Keypad.vue */
</style>
