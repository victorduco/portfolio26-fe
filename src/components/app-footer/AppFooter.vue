<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <span class="app-footer__brand">P26</span>
      <nav class="app-footer__links" aria-label="Footer links">
        <a
          href="https://www.linkedin.com/in/victordiukov/"
          target="_blank"
          rel="noopener noreferrer"
          class="app-footer__link"
          aria-label="LinkedIn"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a
          href="https://github.com/viktordiukov"
          target="_blank"
          rel="noopener noreferrer"
          class="app-footer__link"
          aria-label="GitHub"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a
          href="mailto:diukov@me.com"
          class="app-footer__link"
          aria-label="Email"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          class="app-footer__link"
          aria-label="Resume"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
              fill="currentColor"
            />
          </svg>
        </a>
      </nav>
      <span class="app-footer__divider" aria-hidden="true"></span>
      <span class="app-footer__meta">© {{ currentYear }}</span>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.app-footer {
  width: 100%;
  padding: 24px 0;
}

.app-footer__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.72);
}

.app-footer__brand {
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.app-footer__links {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-footer__link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.app-footer__link:hover {
  color: rgba(255, 255, 255, 0.95);
  background: rgba(255, 255, 255, 0.08);
}

.app-footer__link:active {
  transform: scale(0.95);
}

.app-footer__divider {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
}

.app-footer__meta {
  white-space: nowrap;
}

@media (max-width: 768px) {
  .app-footer {
    padding: 20px 0;
  }

  .app-footer__inner {
    padding: 0 20px;
    gap: 12px;
    font-size: 13px;
  }

  .app-footer__links {
    gap: 8px;
  }

  .app-footer__link {
    width: 28px;
    height: 28px;
  }

  .app-footer__link svg {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 480px) {
  .app-footer__inner {
    gap: 8px;
    font-size: 12px;
  }

  .app-footer__links {
    gap: 6px;
  }

  .app-footer__link {
    width: 26px;
    height: 26px;
  }

  .app-footer__meta {
    font-size: 11px;
  }
}
</style>
