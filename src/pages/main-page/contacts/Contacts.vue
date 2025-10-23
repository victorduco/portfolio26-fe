<template>
  <section id="contacts" class="item">
    <section
      class="contacts"
      :class="{ 'dark-mode': darkMode, 'light-mode': !darkMode }"
    >
    <div class="contacts__content">
      <div class="contacts__container">
        <h1 class="contacts__name">Victor Diukov</h1>
        <div class="contacts__links">
          <a
            href="mailto:mail@victorduco.com"
            target="_blank"
            rel="noopener noreferrer"
            class="contacts__email"
          >
            mail@victorduco.com
          </a>
          <div class="contacts__social">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              class="contacts__link"
            >
              Resume
            </a>
            <a
              href="https://www.linkedin.com/in/victordiukov/"
              target="_blank"
              rel="noopener noreferrer"
              class="contacts__link"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/viktordiukov"
              target="_blank"
              rel="noopener noreferrer"
              class="contacts__link"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
    </section>
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
.contacts {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background removed - using dynamic page background */
}

.contacts__content {
  flex: 1 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(48px, 10vh, 120px) clamp(16px, 4vw, 48px);
  width: 100%;
}

.contacts__container {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  gap: clamp(24px, 4vw, 48px);
}

.contacts__name {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-h1);
  line-height: var(--line-height-tight);
  letter-spacing: -0.01em;
  color: var(--color-text-secondary);
  margin: 0;
  text-align: left;
  justify-self: start;
  align-self: start;
}

.contacts__links {
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 3vh, 40px);
  justify-self: start;
  align-self: start;
}

.contacts__email {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-h1);
  line-height: var(--line-height-tight);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color 0.2s ease;
  margin: 0;
}

.contacts__email:hover {
  text-decoration: underline;
  text-decoration-color: rgba(255, 255, 255, 1);
}

.contacts__social {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2vh, 24px);
}

.contacts__link {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-h1);
  line-height: var(--line-height-tight);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color 0.2s ease;
  margin: 0;
}

.contacts__link:hover {
  text-decoration: underline;
  text-decoration-color: rgba(255, 255, 255, 1);
}

/* Tablet */
@media (max-width: 900px) {
  .contacts__content {
    padding: clamp(40px, 8vh, 80px) clamp(20px, 5vw, 48px);
  }

  .contacts__container {
    grid-template-columns: 1fr;
    gap: clamp(24px, 4vh, 40px);
  }

  .contacts__name {
    text-align: center;
  }

  .contacts__email {
    justify-self: center;
    text-align: center;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .contacts__content {
    padding: 48px 20px;
    min-height: calc(100dvh - 64px);
  }

  .contacts__container {
    gap: 24px;
  }

  .contacts__email {
    font-size: clamp(16px, 4vw, 20px);
  }
}
</style>
