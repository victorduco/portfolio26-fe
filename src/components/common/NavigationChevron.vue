<template>
  <RouterLink
    v-if="type === 'route'"
    :to="linkTarget"
    class="nav-chevron"
    :class="directionClass"
    :aria-label="computedAriaLabel"
    v-hover-distortion="hoverValue"
  >
    <div class="nav-chevron__inner" aria-hidden="true">
      <svg
        class="nav-chevron__icon"
        width="18"
        height="16"
        viewBox="0 0 13 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.4242 0.421755C12.5482 0.545775 12.6413 0.688397 12.7033 0.849623C12.7653 1.00258 12.7942 1.18034 12.7901 1.38291L12.6909 10.8208C12.6867 11.1391 12.5689 11.4141 12.3374 11.6456C12.1886 11.7944 12.0129 11.8957 11.8103 11.9494C11.6078 12.0031 11.4052 12.0073 11.2026 11.9618C11.0042 11.9122 10.8264 11.8088 10.6693 11.6518C10.442 11.4244 10.3262 11.135 10.3221 10.7836L10.4399 2.40607L2.06235 2.52389C1.7151 2.52389 1.42572 2.40814 1.19421 2.17664C1.04126 2.02368 0.939974 1.84798 0.890366 1.64955C0.840758 1.44285 0.842825 1.23822 0.896567 1.03565C0.950309 0.833088 1.05159 0.657393 1.20042 0.508569C1.43192 0.277065 1.70683 0.159246 2.02515 0.155112L11.4631 0.0558963C11.6615 0.0558963 11.8393 0.0848341 11.9963 0.14271C12.1534 0.200586 12.2961 0.293601 12.4242 0.421755Z"
          fill="white"
        />
      </svg>
    </div>
  </RouterLink>
  <button
    v-else
    type="button"
    class="nav-chevron"
    :class="directionClass"
    :aria-label="computedAriaLabel"
    v-hover-distortion="hoverValue"
    @click="handleButtonClick"
  >
    <div class="nav-chevron__inner" aria-hidden="true">
      <!-- Arrow icon for back/forward -->
      <svg
        v-if="direction === 'back' || direction === 'forward'"
        class="nav-chevron__icon"
        width="18"
        height="16"
        viewBox="0 0 13 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.4242 0.421755C12.5482 0.545775 12.6413 0.688397 12.7033 0.849623C12.7653 1.00258 12.7942 1.18034 12.7901 1.38291L12.6909 10.8208C12.6867 11.1391 12.5689 11.4141 12.3374 11.6456C12.1886 11.7944 12.0129 11.8957 11.8103 11.9494C11.6078 12.0031 11.4052 12.0073 11.2026 11.9618C11.0042 11.9122 10.8264 11.8088 10.6693 11.6518C10.442 11.4244 10.3262 11.135 10.3221 10.7836L10.4399 2.40607L2.06235 2.52389C1.7151 2.52389 1.42572 2.40814 1.19421 2.17664C1.04126 2.02368 0.939974 1.84798 0.890366 1.64955C0.840758 1.44285 0.842825 1.23822 0.896567 1.03565C0.950309 0.833088 1.05159 0.657393 1.20042 0.508569C1.43192 0.277065 1.70683 0.159246 2.02515 0.155112L11.4631 0.0558963C11.6615 0.0558963 11.8393 0.0848341 11.9963 0.14271C12.1534 0.200586 12.2961 0.293601 12.4242 0.421755Z"
          fill="white"
        />
      </svg>
      <!-- Menu icon -->
      <svg
        v-else-if="direction === 'menu'"
        class="nav-chevron__icon nav-chevron__icon--menu"
        width="18"
        height="14"
        viewBox="0 0 18 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="18" height="2" rx="1" fill="white" />
        <rect y="6" width="18" height="2" rx="1" fill="white" />
        <rect y="12" width="18" height="2" rx="1" fill="white" />
      </svg>
      <!-- Close icon -->
      <svg
        v-else-if="direction === 'close'"
        class="nav-chevron__icon nav-chevron__icon--close"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.5 1.5L14.5 14.5"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
        />
        <path
          d="M14.5 1.5L1.5 14.5"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </div>
  </button>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink, useRouter } from "vue-router";

const props = defineProps({
  type: {
    type: String,
    default: "route",
    validator: (value) => ["route", "back", "button"].includes(value),
  },
  to: {
    type: [String, Object],
    default: null,
  },
  direction: {
    type: String,
    default: "forward",
    validator: (value) => ["forward", "back", "menu", "close"].includes(value),
  },
  ariaLabel: {
    type: String,
    default: null,
  },
  hoverIntensity: {
    type: [Number, String],
    default: 4,
  },
});

const router = useRouter();

const directionClass = computed(() => {
  if (props.direction === "back") return "nav-chevron--back";
  if (props.direction === "menu") return "nav-chevron--menu";
  if (props.direction === "close") return "nav-chevron--close";
  return "nav-chevron--forward";
});

const linkTarget = computed(() => props.to ?? "/");

const hoverValue = computed(() => {
  const parsed = Number(props.hoverIntensity);
  return Number.isFinite(parsed) ? parsed : 4;
});

const computedAriaLabel = computed(() => {
  if (props.ariaLabel) {
    return props.ariaLabel;
  }
  if (props.type === "back") return "Go back";
  if (props.direction === "menu") return "Open menu";
  if (props.direction === "close") return "Close menu";
  return "Open link";
});

if (import.meta.env?.DEV && props.type === "route" && !props.to) {
  console.warn(
    "[NavigationChevron] `to` prop is recommended when type is 'route'. Received:",
    props.to
  );
}

function handleButtonClick(event) {
  if (props.type === "back") {
    event.preventDefault();
    router.back();
  }
}
</script>

<style scoped>
.nav-chevron {
  width: 56px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  background: transparent;
  border: none;
  padding: 0;
  color: inherit;
}

.nav-chevron:focus-visible .nav-chevron__inner {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.25);
}

.nav-chevron__inner {
  box-sizing: border-box;
  width: 56px;
  height: 56px;
  background: #212121;
  border: 1px solid rgba(109, 109, 109, 0.52);
  border-radius: 11px;
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-chevron__icon {
  width: 18px;
  height: 16px;
  transition: transform 0.3s ease;
}

.nav-chevron--forward .nav-chevron__icon {
  transform: rotate(0deg) translateX(-2px);
}

.nav-chevron--back .nav-chevron__icon {
  transform: rotate(180deg) translateX(2px);
}

.nav-chevron--menu .nav-chevron__icon,
.nav-chevron--close .nav-chevron__icon {
  transform: rotate(-45deg);
}

.nav-chevron__icon--menu,
.nav-chevron__icon--close {
  width: 18px;
  height: 18px;
}

@media (max-width: 899px) {
  .nav-chevron {
    width: 40px;
    height: 40px;
  }

  .nav-chevron__inner {
    width: 40px;
    height: 40px;
    border-radius: 8px;
  }

  .nav-chevron__icon {
    width: 14px;
    height: 12px;
  }

  .nav-chevron__icon--menu,
  .nav-chevron__icon--close {
    width: 14px;
    height: 14px;
  }
}
</style>
