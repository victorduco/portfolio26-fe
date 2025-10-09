<template>
  <footer class="next-case-footer">
    <div class="next-case-footer__content">
      <RouterLink :to="to" class="next-case-footer__text" :aria-label="`Open ${label}`">
        <span class="next-case-footer__label">Next case</span>
        <span class="next-case-footer__target">{{ label }}</span>
      </RouterLink>
      <NavigationChevron
        class="next-case-footer__chevron"
        type="route"
        :to="to"
        direction="forward"
        :aria-label="`Open ${label}`"
      />
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from "vue-router";
import NavigationChevron from "@/components/common/NavigationChevron.vue";

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

.next-case-footer__content {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  padding: 32px 40px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  transition: transform 0.3s ease, background 0.3s ease;
}

.next-case-footer__content:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.1);
}

.next-case-footer__content:hover .nav-chevron__inner {
  border-color: rgba(255, 255, 255, 0.6);
}

.next-case-footer__text {
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: inherit;
  text-decoration: none;
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

.next-case-footer__chevron {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .next-case-footer {
    margin-top: 64px;
    padding: 48px 0 72px;
  }

  .next-case-footer__content {
    width: 100%;
    padding: 24px;
    border-radius: 20px;
    justify-content: space-between;
    gap: 16px;
  }

  .next-case-footer__target {
    font-size: 24px;
  }
}
</style>
