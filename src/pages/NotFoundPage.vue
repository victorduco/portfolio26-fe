<template>
  <div class="not-found-page">
    <div class="content">
      <h2 class="title">404 — Page Not Found</h2>
      <router-link to="/" class="home-link">
        Back to Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useMeta } from "../composables/useMeta.js";

useMeta("404");
</script>

<style scoped>
.not-found-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 24px;
  padding-left: clamp(24px, 5vw, 80px);
}

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
}

.title {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold);
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.2;
  color: #ffffff;
  margin: 0;
}

.home-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 16px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.home-link:hover {
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}

.home-link:active {
  transform: translateY(0);
}
</style>
