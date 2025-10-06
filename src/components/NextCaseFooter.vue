<template>
  <footer class="next-case-footer">
    <RouterLink :to="to" class="next-case-footer__link">
      <span class="next-case-footer__label">Next case</span>
      <span class="next-case-footer__target">{{ label }}</span>
      <span aria-hidden="true" class="next-case-footer__arrow">→</span>
    </RouterLink>
  </footer>
</template>

<script setup>
import { RouterLink } from "vue-router";

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.next-case-footer {
  margin-top: 96px;
  padding: 64px 0 96px;
  display: flex;
  justify-content: center;
}

.next-case-footer__link {
  display: inline-flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  padding: 32px 40px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  text-decoration: none;
  transition: transform 0.3s ease, background 0.3s ease;
}

.next-case-footer__link:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.1);
}

.next-case-footer__label {
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
}

.next-case-footer__target {
  font-size: 28px;
  font-weight: 600;
}

.next-case-footer__arrow {
  font-size: 24px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .next-case-footer {
    margin-top: 64px;
    padding: 48px 0 72px;
  }

  .next-case-footer__link {
    width: 100%;
    padding: 24px;
    border-radius: 20px;
  }

  .next-case-footer__target {
    font-size: 24px;
  }
}
</style>
