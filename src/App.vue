<script setup>
import { onMounted, onUnmounted, watch } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import Keypad from "./components/keypad/Keypad.vue";
import FontSwitcher from "./components/__temp-font-switcher/FontSwitcher.vue"; // TEMP: Remove when done
import { useAuth } from "./composables/useAuth.js";
import { useMixpanel } from "./composables/useMixpanel.js";
import { useLenis } from "./composables/useLenis.js";

const { isAuthenticated, isLoading, checkAuth, setAuthenticated } = useAuth();
const mixpanel = useMixpanel();
const { setupLenis, destroy } = useLenis();
const route = useRoute();
const router = useRouter();

onMounted(() => {
  checkAuth();

  // Initialize Lenis smooth scroll with snap
  setupLenis();
});

onUnmounted(() => {
  // Cleanup Lenis on unmount
  destroy();
});

// Force scroll to top for story pages on route change
watch(() => route.path, (newPath, oldPath) => {
  if (newPath.startsWith("/story")) {
    console.log('🔄 Navigating to story page:', newPath, 'from:', oldPath);
    console.log('📍 Current scroll before:', window.scrollY);

    // Stop Lenis temporarily to force scroll position
    const { stop, start } = useLenis();
    stop();

    // Immediate scroll
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Delayed scroll to override any other scroll behavior
    const delays = [10, 50, 100, 200];
    delays.forEach(delay => {
      setTimeout(() => {
        console.log(`⏰ Scrolling at ${delay}ms, current: ${window.scrollY}`);
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, delay);
    });

    // Re-enable Lenis after scroll is set (story pages don't use it, but we enable it anyway)
    setTimeout(() => {
      start();
      console.log('▶️ Lenis re-enabled');
    }, 300);
  }
}, { immediate: true });

const handleUnlock = async () => {
  mixpanel.track("Gate Unlocked");

  await new Promise((resolve) => setTimeout(resolve, 100));

  setAuthenticated(true);
  await checkAuth();
};
</script>

<template>
  <!-- TEMP: Font Switcher Tool (Remove when done) -->
  <FontSwitcher />

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
