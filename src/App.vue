<script setup>
import { onMounted, watch } from "vue";
import { RouterView, useRoute } from "vue-router";
import Keypad from "./pages/keypad-page/keypad/Keypad.vue";
import { useAuth } from "./composables/useAuth.js";
import { useMixpanel } from "./composables/useMixpanel.js";

const { isAuthenticated, isLoading, checkAuth, setAuthenticated } = useAuth();
const mixpanel = useMixpanel();
const route = useRoute();

onMounted(checkAuth);

watch(() => route.path, (newPath) => {
  if (newPath.startsWith("/story")) {
    [0, 10, 50, 100, 200].forEach(delay =>
      setTimeout(() => window.scrollTo(0, 0), delay)
    );
  }
}, { immediate: true });

const handleUnlock = async () => {
  mixpanel.track("Gate Unlocked");
  await new Promise(resolve => setTimeout(resolve, 100));
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
  position: fixed;
  inset: 0;
  background: #171717;
  height: 100dvh;
}

.app-shell, .app-main { width: 100%; }
</style>
