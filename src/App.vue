<script setup>
import { onMounted, onUnmounted } from "vue";
import { RouterView } from "vue-router";
import Keypad from "./components/keypad/Keypad.vue";
import { useAuth } from "./composables/useAuth.js";
import { useMixpanel } from "./composables/useMixpanel.js";
import { useLenis } from "./composables/useLenis.js";

const { isAuthenticated, isLoading, checkAuth, setAuthenticated } = useAuth();
const mixpanel = useMixpanel();
const { setupLenis, destroy } = useLenis();

onMounted(() => {
  checkAuth();

  // Initialize Lenis smooth scroll with snap
  setupLenis();
});

onUnmounted(() => {
  // Cleanup Lenis on unmount
  destroy();
});

const handleUnlock = async () => {
  mixpanel.track("Gate Unlocked");

  await new Promise((resolve) => setTimeout(resolve, 100));

  setAuthenticated(true);
  await checkAuth();
};
</script>

<template>
  <div v-if="isLoading" class="auth-loading"></div>

  <Keypad v-else-if="!isAuthenticated" @unlock="handleUnlock" />

  <div v-else class="app-shell">
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.auth-loading {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  background: #171717;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.app-shell,
.app-main {
  width: 100%;
}
</style>
