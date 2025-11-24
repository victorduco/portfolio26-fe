<template>
  <div class="not-found-page">
    <h2 class="title">404 — Page Not Found</h2>
    <router-link to="/" class="home-link">Back to Home</router-link>
  </div>
</template>

<script setup>
import { useMeta } from "../composables/useMeta.js";
useMeta("404");
</script>

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
  min-height: 100vh;
  padding: 24px 24px 24px clamp(24px, 5vw, 80px);
  align-items: flex-start;
  justify-content: center;
}

.title {
  font: var(--font-weight-semibold) clamp(32px, 5vw, 48px)/1.2 var(--font-family-base);
  color: #fff;
  margin: 0;
}

.home-link {
  padding: 14px 28px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font: var(--font-weight-medium) 16px var(--font-family-base);
  color: #fff;
  text-decoration: none;
  transition: all 0.2s;
}

.home-link:hover { border-color: rgba(255, 255, 255, 0.4); transform: translateY(-1px); }
.home-link:active { transform: translateY(0); }
</style>
