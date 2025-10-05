<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";
import Keypad from "./components/keypad/Keypad.vue";

const isUnlocked = ref(false);

function handleUnlock() {
  isUnlocked.value = true;
}
</script>

<template>
  <!-- <Keypad v-if="!isUnlocked" @unlock="handleUnlock" /> -->
  <!-- <RouterView v-else /> -->
</template>
