<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";
import Keypad from "./components/keypad/Keypad.vue";

const isUnlocked = ref(false);
</script>

<template>
  <Keypad v-if="!isUnlocked" @unlock="isUnlocked = true" />

  <div v-else class="app-shell">
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell,
.app-main {
  width: 100%;
}
</style>
