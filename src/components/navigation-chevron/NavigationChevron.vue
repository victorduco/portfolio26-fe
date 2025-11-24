<template>
  <component
    :is="type === 'route' ? RouterLink : 'button'"
    :to="type === 'route' ? (to ?? '/') : undefined"
    :type="type !== 'route' ? 'button' : undefined"
    class="nav-chevron"
    :class="[`nav-chevron--${direction}`, darkMode ? 'nav-chevron--dark' : 'nav-chevron--light']"
    :aria-label="ariaLabel ?? ariaLabels[direction] ?? 'Open link'"
    v-hover-distortion="+hoverIntensity || 4"
    @click="type === 'back' && $router.back()"
  >
    <div class="nav-chevron__inner" aria-hidden="true">
      <svg v-if="direction === 'menu'" class="nav-chevron__icon nav-chevron__icon--alt" width="18" height="14" viewBox="0 0 18 14" fill="none">
        <rect width="18" height="2" rx="1" fill="currentColor"/>
        <rect y="6" width="18" height="2" rx="1" fill="currentColor"/>
        <rect y="12" width="18" height="2" rx="1" fill="currentColor"/>
      </svg>
      <svg v-else-if="direction === 'close'" class="nav-chevron__icon nav-chevron__icon--alt" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1.5 1.5L14.5 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M14.5 1.5L1.5 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <svg v-else class="nav-chevron__icon" width="18" height="16" viewBox="0 0 13 12" fill="none">
        <path d="M12.4242 0.421755C12.5482 0.545775 12.6413 0.688397 12.7033 0.849623C12.7653 1.00258 12.7942 1.18034 12.7901 1.38291L12.6909 10.8208C12.6867 11.1391 12.5689 11.4141 12.3374 11.6456C12.1886 11.7944 12.0129 11.8957 11.8103 11.9494C11.6078 12.0031 11.4052 12.0073 11.2026 11.9618C11.0042 11.9122 10.8264 11.8088 10.6693 11.6518C10.442 11.4244 10.3262 11.135 10.3221 10.7836L10.4399 2.40607L2.06235 2.52389C1.7151 2.52389 1.42572 2.40814 1.19421 2.17664C1.04126 2.02368 0.939974 1.84798 0.890366 1.64955C0.840758 1.44285 0.842825 1.23822 0.896567 1.03565C0.950309 0.833088 1.05159 0.657393 1.20042 0.508569C1.43192 0.277065 1.70683 0.159246 2.02515 0.155112L11.4631 0.0558963C11.6615 0.0558963 11.8393 0.0848341 11.9963 0.14271C12.1534 0.200586 12.2961 0.293601 12.4242 0.421755Z" fill="currentColor"/>
      </svg>
    </div>
  </component>
</template>

<script setup>
import { RouterLink } from "vue-router";

const ariaLabels = { menu: "Open menu", close: "Close menu", back: "Go back" };

defineProps({
  type: { type: String, default: "route", validator: v => ["route", "back", "button"].includes(v) },
  to: { type: [String, Object], default: null },
  direction: { type: String, default: "forward", validator: v => ["forward", "back", "menu", "close"].includes(v) },
  ariaLabel: { type: String, default: null },
  hoverIntensity: { type: [Number, String], default: 4 },
  darkMode: { type: Boolean, default: true },
});
</script>

<style scoped>
.nav-chevron {
  --size: 56px; --radius: 11px; --icon: 18px;
  width: var(--size); height: var(--size);
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: var(--radius); cursor: pointer; outline: none;
  background: transparent; border: none; padding: 0; color: inherit; text-decoration: none;
}
.nav-chevron:focus-visible .nav-chevron__inner { box-shadow: 0 0 0 2px rgba(255,255,255,0.25); }
.nav-chevron__inner {
  box-sizing: border-box; width: var(--size); height: var(--size);
  border-radius: var(--radius); transform: rotate(45deg);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
}
.nav-chevron--dark .nav-chevron__inner { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); }
.nav-chevron--light .nav-chevron__inner { background: rgba(255,255,255,0.3); border: 1px solid rgba(0,0,0,0.1); }
.nav-chevron__icon { width: var(--icon); height: calc(var(--icon) - 2px); transition: transform 0.3s ease; }
.nav-chevron--dark .nav-chevron__icon { color: #fff; }
.nav-chevron--light .nav-chevron__icon { color: #000; }
.nav-chevron--forward .nav-chevron__icon { transform: rotate(0deg) translateX(-2px); }
.nav-chevron--back .nav-chevron__icon { transform: rotate(180deg) translate(-2px, 2px); }
.nav-chevron--menu .nav-chevron__icon, .nav-chevron--close .nav-chevron__icon { transform: rotate(-45deg); }
.nav-chevron__icon--alt { width: var(--icon); height: var(--icon); }
@media (max-width: 899px) {
  .nav-chevron { --size: 40px; --radius: 8px; --icon: 14px; }
}
</style>
