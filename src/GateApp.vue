<template>
  <Keypad @unlock="handleUnlock" />
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { resetAuthCache } from "./router/index.js";
import { useMixpanel } from "./composables/useMixpanel.js";
import Keypad from "./components/keypad/Keypad.vue";

const router = useRouter();
const route = useRoute();
const mixpanel = useMixpanel();

const handleUnlock = () => {
  // Track successful unlock event
  mixpanel.track("Gate Unlocked", {
    destination: route.query.next || "/",
  });

  // Сбрасываем кэш аутентификации
  resetAuthCache();

  // Успешная авторизация - редирект на страницу из next параметра
  const next = route.query.next || "/";

  // Используем Vue Router для навигации
  router.push(next);
};
</script>

<style scoped>
/* Стили переехали в Keypad.vue */
</style>
