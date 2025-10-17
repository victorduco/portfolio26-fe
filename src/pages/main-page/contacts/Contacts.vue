<template>
  <section class="contacts">
    <div class="contacts__content">
      <div class="contacts__container">
        <h2 class="contacts__title">Let's Connect</h2>
        <nav class="contacts__links" aria-label="Contact links">
          <a
            href="https://www.linkedin.com/in/victordiukov/"
            target="_blank"
            rel="noopener noreferrer"
            class="contacts__link"
          >
            <span class="contacts__link-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span class="contacts__link-text">LinkedIn</span>
            <span class="contacts__link-arrow" aria-hidden="true">→</span>
          </a>

          <a
            href="https://github.com/viktordiukov"
            target="_blank"
            rel="noopener noreferrer"
            class="contacts__link"
          >
            <span class="contacts__link-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span class="contacts__link-text">GitHub</span>
            <span class="contacts__link-arrow" aria-hidden="true">→</span>
          </a>

          <a href="mailto:diukov@me.com" class="contacts__link">
            <span class="contacts__link-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span class="contacts__link-text">diukov@me.com</span>
            <span class="contacts__link-arrow" aria-hidden="true">→</span>
          </a>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            class="contacts__link"
          >
            <span class="contacts__link-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span class="contacts__link-text">Resume</span>
            <span class="contacts__link-arrow" aria-hidden="true">→</span>
          </a>
        </nav>
      </div>
    </div>
  </section>
</template>

<script setup>
// Contacts section
</script>

<style scoped>
.contacts {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* background removed - using dynamic page background */
}

.contacts__content {
  flex: 1 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(48px, 10vh, 120px) clamp(24px, 6vw, 80px);
}

.contacts__container {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: clamp(40px, 6vh, 80px);
}

.contacts__title {
  font-size: clamp(48px, 8vw, 96px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
}

.contacts__links {
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vh, 20px);
}

.contacts__link {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: clamp(20px, 3vh, 32px) clamp(24px, 4vw, 40px);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.contacts__link::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.contacts__link:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.16);
  transform: translateX(8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.contacts__link:hover::before {
  opacity: 1;
}

.contacts__link:active {
  transform: translateX(4px) scale(0.98);
}

.contacts__link-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.3s ease;
}

.contacts__link:hover .contacts__link-icon {
  color: rgba(255, 255, 255, 0.95);
}

.contacts__link-text {
  flex: 1;
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.contacts__link-arrow {
  flex-shrink: 0;
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.contacts__link:hover .contacts__link-arrow {
  color: rgba(255, 255, 255, 0.9);
  transform: translateX(4px);
}

/* Tablet */
@media (max-width: 900px) {
  .contacts__content {
    padding: clamp(40px, 8vh, 80px) clamp(20px, 5vw, 48px);
  }

  .contacts__container {
    gap: clamp(32px, 5vh, 60px);
  }

  .contacts__title {
    font-size: clamp(40px, 10vw, 72px);
  }

  .contacts__link {
    gap: 16px;
    padding: clamp(18px, 2.5vh, 28px) clamp(20px, 3.5vw, 32px);
  }

  .contacts__link-text {
    font-size: clamp(18px, 3.5vw, 24px);
  }
}

/* Mobile */
@media (max-width: 600px) {
  .contacts__content {
    padding: 48px 20px;
    min-height: calc(100dvh - 64px);
  }

  .contacts__container {
    gap: 32px;
  }

  .contacts__title {
    font-size: clamp(36px, 12vw, 56px);
    letter-spacing: -0.02em;
  }

  .contacts__links {
    gap: 12px;
  }

  .contacts__link {
    gap: 16px;
    padding: 20px;
    border-radius: 12px;
  }

  .contacts__link:hover {
    transform: translateX(4px);
  }

  .contacts__link-icon {
    width: 20px;
    height: 20px;
  }

  .contacts__link-text {
    font-size: 18px;
  }

  .contacts__link-arrow {
    font-size: 24px;
  }
}

/* Small mobile */
@media (max-width: 400px) {
  .contacts__title {
    font-size: 32px;
  }

  .contacts__link {
    padding: 18px;
  }

  .contacts__link-text {
    font-size: 16px;
  }

  .contacts__link-arrow {
    font-size: 20px;
  }
}

/* Mobile landscape */
@media (max-width: 900px) and (orientation: landscape) {
  .contacts__content {
    padding: 32px 24px;
    min-height: 100vh;
  }

  .contacts__container {
    gap: 24px;
  }

  .contacts__title {
    font-size: clamp(32px, 8vh, 48px);
  }

  .contacts__links {
    gap: 8px;
  }

  .contacts__link {
    padding: 16px 20px;
  }

  .contacts__link-text {
    font-size: clamp(16px, 2.5vh, 20px);
  }
}
</style>
