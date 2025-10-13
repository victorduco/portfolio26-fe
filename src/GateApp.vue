<template>
  <div v-if="!checking">
    <Keypad @unlock="handleUnlock" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Keypad from "./components/keypad/Keypad.vue";

// API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const checking = ref(true);

const checkAuth = async () => {
  try {
    const response = await fetch(`${API_URL}/api/whoami`, {
      method: "GET",
      credentials: "include", // Отправляем куки
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      // Уже авторизован - редиректим сразу
      handleUnlock();
    }
  } catch (err) {
    console.error("Auth check error:", err);
    // Если ошибка - показываем keypad
  } finally {
    checking.value = false;
  }
};

const handleUnlock = () => {
  // Успешная авторизация - редирект на главную страницу
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next") || "/";
  window.location.replace(next);
};

onMounted(() => {
  checkAuth();
});
</script>

<style scoped>
/* Стили переехали в Keypad.vue */
</style>
