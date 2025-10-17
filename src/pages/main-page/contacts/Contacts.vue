<template>
  <section
    class="contacts"
    :class="{ 'dark-mode': darkMode, 'light-mode': !darkMode }"
  >
    <div class="contacts__content">
      <div class="contacts__container">
        <!-- Email as main contact link -->
        <div class="contacts__email-section">
          <a href="mailto:diukov@me.com" class="contacts__email-link">
            <span class="contacts__email-text">diukov@me.com</span>
          </a>
        </div>

        <!-- Social links -->
        <nav class="contacts__social-links" aria-label="Social links">
          <a
            href="https://github.com/viktordiukov"
            target="_blank"
            rel="noopener noreferrer"
            class="contacts__social-link"
          >
            <span class="contacts__social-link-icon">
              <svg
                width="18"
                height="18"
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
            <span class="contacts__social-link-text">GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/victordiukov/"
            target="_blank"
            rel="noopener noreferrer"
            class="contacts__social-link"
          >
            <span class="contacts__social-link-icon">
              <svg
                width="18"
                height="18"
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
            <span class="contacts__social-link-text">LinkedIn</span>
          </a>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            class="contacts__social-link"
          >
            <span class="contacts__social-link-icon">
              <svg
                width="18"
                height="18"
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
            <span class="contacts__social-link-text">Resume</span>
          </a>
        </nav>
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

/* Email section */
.contacts__email-section {
  margin: clamp(20px, 4vh, 40px) 0;
}

.contacts__email-link {
  display: inline-block;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
}

/* Email link styles */
/* Dark mode email link */
.contacts.dark-mode .contacts__email-link {
  color: rgba(255, 255, 255, 1);
}

/* Light mode email link */
.contacts.light-mode .contacts__email-link {
  color: rgba(255, 255, 255, 1);
}

/* Dark mode email hover */
.contacts.dark-mode .contacts__email-link:hover {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

/* Light mode email hover */
.contacts.light-mode .contacts__email-link:hover {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

.contacts__email-link:active {
  transform: scale(0.98);
}

/* Email text styles */
.contacts__email-text {
  font-size: clamp(48px, 8vw, 96px);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

/* Social links section */
.contacts__social-links {
  display: flex;
  flex-direction: row;
  gap: clamp(16px, 3vw, 24px);
  flex-wrap: wrap;
  justify-content: center;
  margin-top: clamp(20px, 4vh, 40px);
}

.contacts__social-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: clamp(8px, 1.5vh, 12px) clamp(12px, 2vw, 16px);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
}

/* Social link styles */
/* Dark mode social links */
.contacts.dark-mode .contacts__social-link {
  color: rgba(255, 255, 255, 1);
}

/* Light mode social links */
.contacts.light-mode .contacts__social-link {
  color: rgba(255, 255, 255, 1);
}

/* Dark mode social hover */
.contacts.dark-mode .contacts__social-link:hover {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

/* Light mode social hover */
.contacts.light-mode .contacts__social-link:hover {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.contacts__social-link:active {
  transform: scale(0.98);
}

/* Social link icon */
.contacts__social-link-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  transition: color 0.3s ease;
}

/* Dark mode social icon */
.contacts.dark-mode .contacts__social-link-icon {
  color: rgba(255, 255, 255, 0.8);
}

.contacts.dark-mode .contacts__social-link:hover .contacts__social-link-icon {
  color: rgba(255, 255, 255, 1);
}

/* Light mode social icon */
.contacts.light-mode .contacts__social-link-icon {
  color: rgba(255, 255, 255, 0.8);
}

.contacts.light-mode .contacts__social-link:hover .contacts__social-link-icon {
  color: rgba(255, 255, 255, 1);
}

/* Social link text */
.contacts__social-link-text {
  font-size: clamp(14px, 2vw, 16px);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

/* Tablet */
@media (max-width: 900px) {
  .contacts__content {
    padding: clamp(40px, 8vh, 80px) clamp(20px, 5vw, 48px);
  }

  .contacts__container {
    gap: clamp(32px, 5vh, 60px);
  }

  .contacts__email-text {
    font-size: clamp(36px, 10vw, 64px);
  }

  .contacts__social-links {
    gap: clamp(12px, 2vw, 20px);
  }

  .contacts__social-link {
    gap: 10px;
    padding: clamp(6px, 1vh, 10px) clamp(10px, 2vw, 14px);
  }

  .contacts__social-link-text {
    font-size: clamp(13px, 2.5vw, 15px);
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

  .contacts__email-text {
    font-size: clamp(32px, 12vw, 48px);
  }

  .contacts__social-links {
    gap: 12px;
    flex-direction: column;
    align-items: center;
  }

  .contacts__social-link {
    gap: 12px;
    padding: 12px 16px;
    min-width: 120px;
    justify-content: center;
  }

  .contacts__social-link-icon {
    width: 16px;
    height: 16px;
  }

  .contacts__social-link-text {
    font-size: 14px;
  }
}

/* Small mobile */
@media (max-width: 400px) {
  .contacts__email-text {
    font-size: 24px;
  }

  .contacts__social-link {
    padding: 10px 14px;
  }

  .contacts__social-link-text {
    font-size: 13px;
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

  .contacts__email-text {
    font-size: clamp(24px, 6vh, 40px);
  }

  .contacts__social-links {
    gap: 8px;
    flex-direction: row;
    justify-content: center;
  }

  .contacts__social-link {
    padding: 8px 12px;
  }

  .contacts__social-link-text {
    font-size: clamp(12px, 2vh, 14px);
  }
}
</style>
