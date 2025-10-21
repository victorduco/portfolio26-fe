<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <h2 class="app-footer__name">Victor Diukov</h2>
      <a href="mailto:mail@victorduco.com" class="app-footer__email">
        mail@victorduco.com
      </a>
    </div>
  </footer>
</template>

<script setup>
// Footer component
</script>

<style scoped>
.app-footer {
  width: 100%;
  padding: clamp(40px, 8vh, 96px) 0;
}

.app-footer__inner {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 clamp(24px, 8vw, 120px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: clamp(24px, 4vw, 48px);
}

.app-footer__name {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-h1);
  line-height: var(--line-height-tight);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  margin: 0;
  text-align: center;
}

.app-footer__email {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-regular);
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  transition: color 0.2s ease;
}

.app-footer__email:hover {
  color: rgba(255, 255, 255, 0.95);
}

@media (max-width: 768px) {
  .app-footer {
    padding: clamp(32px, 6vh, 64px) 0;
  }

  .app-footer__inner {
    grid-template-columns: 1fr;
    gap: clamp(16px, 3vw, 24px);
    padding: 0 clamp(16px, 4vw, 32px);
  }

  .app-footer__name {
    text-align: center;
  }

  .app-footer__email {
    text-align: center;
  }
}
</style>
