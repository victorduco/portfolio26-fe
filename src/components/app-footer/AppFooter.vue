<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <span class="app-footer__brand">P26</span>
      <span class="app-footer__divider" aria-hidden="true"></span>
      <span class="app-footer__meta">© {{ currentYear }} All rights reserved.</span>
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
  }
}
</style>
