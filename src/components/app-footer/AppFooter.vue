<template>
  <footer class="app-footer" :class="{ 'dark-mode': darkMode }">
    <div class="app-footer__inner">
      <h2 class="app-footer__name">Victor Diukov</h2>
      <div class="app-footer__links">
        <a
          href="mailto:mail@victorduco.com"
          target="_blank"
          rel="noopener noreferrer"
          class="app-footer__link"
        >
          mail@victorduco.com
          <span class="app-footer__icon"></span>
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          class="app-footer__link"
        >
          Resume
          <span class="app-footer__icon"></span>
        </a>
        <a
          href="https://www.linkedin.com/in/victordiukov/"
          target="_blank"
          rel="noopener noreferrer"
          class="app-footer__link"
        >
          LinkedIn
          <span class="app-footer__icon"></span>
        </a>
        <a
          href="https://github.com/viktordiukov"
          target="_blank"
          rel="noopener noreferrer"
          class="app-footer__link"
        >
          GitHub
          <span class="app-footer__icon"></span>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  darkMode: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.app-footer {
  width: 100%;
  padding: 48px 0;
}

.app-footer__inner {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
}

.app-footer__name {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: clamp(14px, 1.5vw, 16px);
  line-height: 1.5;
  letter-spacing: -0.01em;
  color: currentColor;
  opacity: 0.65;
  margin: 0;
  flex-shrink: 0;
}

.app-footer__links {
  display: flex;
  align-items: center;
  gap: clamp(24px, 3vw, 40px);
  flex-wrap: wrap;
  justify-content: flex-end;
}

.app-footer__link {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: clamp(14px, 1.5vw, 16px);
  line-height: 1.5;
  color: currentColor;
  opacity: 1;
  text-decoration: none;
  transition: opacity 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  position: relative;
}

.app-footer__link:hover {
  opacity: 0.65;
}

.app-footer__icon {
  width: 14px;
  height: 14px;
  background-image: url("@/assets/icons/link.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  flex-shrink: 0;
}

.app-footer__link:hover .app-footer__icon {
  opacity: 0.65;
}

/* Light theme by default */
.app-footer {
  color: #000000;
}

.app-footer__icon {
  filter: brightness(0);
}

/* Dark theme */
.app-footer.dark-mode {
  color: #ffffff;
}

.app-footer.dark-mode .app-footer__icon {
  filter: brightness(1);
}

@media (max-width: 768px) {
  .app-footer {
    padding: 40px 0;
  }

  .app-footer__inner {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 24px;
    gap: 24px;
  }

  .app-footer__links {
    width: 100%;
    justify-content: flex-start;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .app-footer__links {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
