<template>
  <section
    class="ai-play"
    :class="{ 'dark-mode': darkMode, 'light-mode': !darkMode }"
  >
    <div class="ai-play__container">
      <div class="ai-play__content">
        <h2 class="ai-play__title">AI Playground</h2>
        <p class="ai-play__text">
          Building my own AI system for fun, exploring how agents think and act.
          Working with LangGraph for orchestration and integrating MSP Home
          Assistant to bring intelligence into everyday routines. Driven by
          curiosity to see what's possible when you mix structure with
          experimentation.
        </p>
        <a
          href="https://github.com/viktordiukov"
          target="_blank"
          rel="noopener noreferrer"
          class="ai-play__button"
          aria-label="Visit GitHub profile"
        >
          <svg
            class="ai-play__button-icon"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10 0C4.475 0 0 4.475 0 10c0 4.425 2.865 8.18 6.84 9.49.5.09.68-.22.68-.485 0-.24-.01-1.02-.015-1.845-2.78.6-3.37-1.17-3.37-1.17-.455-1.155-1.11-1.465-1.11-1.465-.905-.62.07-.605.07-.605 1.005.07 1.535 1.03 1.535 1.03.89 1.525 2.335 1.085 2.905.83.09-.645.35-1.085.635-1.335-2.22-.25-4.555-1.11-4.555-4.94 0-1.09.39-1.98 1.03-2.68-.105-.25-.445-1.27.095-2.645 0 0 .84-.27 2.75 1.025A9.578 9.578 0 0110 4.845c.85.004 1.705.115 2.505.34 1.91-1.295 2.745-1.025 2.745-1.025.545 1.375.205 2.395.1 2.645.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.685-4.565 4.93.36.31.675.915.675 1.845 0 1.335-.015 2.415-.015 2.745 0 .27.18.58.685.48C17.14 18.175 20 14.42 20 10c0-5.525-4.475-10-10-10z"
              fill="currentColor"
            />
          </svg>
          <span class="ai-play__button-text">View on GitHub</span>
          <svg
            class="ai-play__button-arrow"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      </div>
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
.ai-play {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background removed - using dynamic page background */
  padding: clamp(48px, 10vh, 120px) 0;
}

.ai-play__container {
  width: 100%;
  max-width: 1000px;
  padding: 0 clamp(24px, 6vw, 80px);
}

.ai-play__content {
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 4vh, 40px);
  max-width: 800px;
}

.ai-play__title {
  font-size: clamp(48px, 8vw, 96px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin: 0;
}

/* Dark mode - white text for dark backgrounds */
.ai-play.dark-mode .ai-play__title {
  color: #ffffff;
}

/* Light mode - dark text for light backgrounds */
.ai-play.light-mode .ai-play__title {
  color: #000000;
}

.ai-play__text {
  font-size: clamp(18px, 2.5vw, 24px);
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: -0.01em;
  margin: 0;
  max-width: 700px;
}

/* Dark mode - white text for dark backgrounds */
.ai-play.dark-mode .ai-play__text {
  color: rgba(255, 255, 255, 0.85);
}

/* Light mode - dark text for light backgrounds */
.ai-play.light-mode .ai-play__text {
  color: rgba(0, 0, 0, 0.85);
}

.ai-play__button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  align-self: flex-start;
  padding: 16px 32px;
  /* background removed - using dynamic page background */
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.01em;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

/* Dark mode - white text for dark backgrounds */
.ai-play.dark-mode .ai-play__button {
  color: #ffffff;
}

/* Light mode - dark text for light backgrounds */
.ai-play.light-mode .ai-play__button {
  color: #000000;
}

.ai-play__button:hover {
  background: rgba(0, 0, 0, 0.85);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.ai-play__button:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.ai-play__button-icon {
  flex-shrink: 0;
}

.ai-play__button-text {
  white-space: nowrap;
}

.ai-play__button-arrow {
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ai-play__button:hover .ai-play__button-arrow {
  transform: translateX(4px);
}

/* Tablet */
@media (max-width: 900px) {
  .ai-play {
    padding: clamp(40px, 8vh, 80px) 0;
  }

  .ai-play__container {
    padding: 0 clamp(20px, 5vw, 48px);
  }

  .ai-play__content {
    gap: clamp(20px, 3vh, 32px);
  }

  .ai-play__title {
    font-size: clamp(40px, 10vw, 72px);
  }

  .ai-play__text {
    font-size: clamp(16px, 3vw, 20px);
  }

  .ai-play__button {
    padding: 14px 28px;
    font-size: 15px;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .ai-play {
    padding: clamp(32px, 6vh, 64px) 0;
    min-height: 100dvh;
  }

  .ai-play__container {
    padding: 0 20px;
  }

  .ai-play__content {
    gap: 24px;
  }

  .ai-play__title {
    font-size: clamp(36px, 12vw, 56px);
    letter-spacing: -0.02em;
  }

  .ai-play__text {
    font-size: 16px;
    line-height: 1.65;
  }

  .ai-play__button {
    padding: 14px 24px;
    font-size: 15px;
    gap: 10px;
    width: 100%;
    justify-content: center;
  }

  .ai-play__button-icon {
    width: 18px;
    height: 18px;
  }

  .ai-play__button-arrow {
    width: 14px;
    height: 14px;
  }
}

/* Small mobile / landscape */
@media (max-width: 400px) {
  .ai-play__title {
    font-size: 32px;
  }

  .ai-play__text {
    font-size: 15px;
  }
}

/* Mobile landscape optimization */
@media (max-width: 900px) and (orientation: landscape) {
  .ai-play {
    padding: 32px 0;
    min-height: 100vh;
  }

  .ai-play__content {
    gap: 20px;
  }

  .ai-play__title {
    font-size: clamp(32px, 8vh, 48px);
  }

  .ai-play__text {
    font-size: clamp(14px, 2.5vh, 18px);
    line-height: 1.5;
  }
}
</style>
