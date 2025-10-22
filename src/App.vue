<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import Keypad from "./components/keypad/Keypad.vue";
import { useAuth } from "./composables/useAuth.js";
import { useMixpanel } from "./composables/useMixpanel.js";

const { isAuthenticated, checkAuth, setAuthenticated } = useAuth();
const mixpanel = useMixpanel();

onMounted(async () => {
  await checkAuth();
});

const handleUnlock = async () => {
  // Track successful unlock event
  mixpanel.track("Gate Unlocked");

  // Small buffer to ensure smooth transition
  await new Promise(resolve => setTimeout(resolve, 100));

  // Now mark as authenticated (this will unmount Keypad)
  setAuthenticated(true);
  await checkAuth();
};
</script>

<template>
  <Keypad v-if="!isAuthenticated" @unlock="handleUnlock" />

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
