<script setup>
import { ref } from "vue";
import Keypad from "./components/keypad/Keypad.vue";
import MainPage from "./pages/main-page/MainPage.vue";

const isUnlocked = ref(false);

function handleUnlock() {
  isUnlocked.value = true;
}
</script>

<template>
  <Keypad v-if="!isUnlocked" @unlock="handleUnlock" />
  <MainPage v-else />
</template>
