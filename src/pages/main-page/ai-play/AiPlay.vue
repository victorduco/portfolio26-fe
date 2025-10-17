<template>
  <section
    class="ai-play-hero"
    :class="{ 'dark-mode': darkMode, 'light-mode': !darkMode }"
  >
    <div class="ai-play__title">
      <h1 class="h1">AI Playground</h1>
      <p class="body1">
        Building my own AI system for fun, exploring how agents think and act.
      </p>
      <a
        href="https://github.com/viktordiukov"
        target="_blank"
        rel="noopener noreferrer"
        class="ai-play__link"
        aria-label="Open Project"
      >
        Open Project
      </a>
    </div>
  </section>
</template>

<script setup>
defineProps({
  darkMode: {
    type: Boolean,
    default: true,
  },
});
</script>

<style scoped>
.ai-play-hero {
  position: relative;
  display: grid;
  align-content: center;
  justify-items: start;
  width: 100%;
  height: 100vh;
  padding-block: clamp(40px, 10vh, 96px);
  padding-inline-start: clamp(24px, 8vw, 120px);
  padding-inline-end: clamp(16px, 4vw, 48px);
  box-sizing: border-box;
  overflow: visible;
  grid-template-columns: repeat(auto-fill, min-content);
}

.ai-play__title {
  max-width: 900px;
  display: grid;
  gap: 24px;
  position: relative;
  z-index: 1;
  margin-bottom: 22vh;
  anchor-name: --title;
  place-items: start start;
}

.ai-play__link {
  font-size: clamp(20px, 3vw, 30px); /* Same size as body1 */
  line-height: 1.7;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
  display: inline-block;
  margin-top: 16px;
}

.ai-play__link:hover {
  color: var(--color-text-primary);
  text-decoration: underline;
}

/* Скрываем rectangles на мобильных устройствах */
@media (max-width: 899px) {
  /* Центрируем текст по вертикали, добавляем горизонтальные отступы */
  .ai-play__title {
    margin-bottom: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    padding-left: clamp(16px, 4vw, 32px);
    padding-right: clamp(16px, 4vw, 32px);
  }
}

/* Mobile landscape: adjust layout to prevent content shifting */
@media (max-width: 767px) and (orientation: landscape) {
  .ai-play-hero {
    padding-block: clamp(24px, 5vh, 48px);
    padding-inline-start: clamp(24px, 6vw, 64px);
    padding-inline-end: clamp(16px, 3vw, 32px);
  }

  .ai-play__title {
    position: relative;
    top: auto;
    transform: none;
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
