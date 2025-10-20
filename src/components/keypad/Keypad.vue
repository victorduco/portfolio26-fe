<template>
  <div :class="['keypad-container', { 'is-resizing': isResizing }]">
    <!-- Base layer with normal colors -->
    <div
      :class="[
        'background-numbers',
        'background-numbers-base',
        { 'no-background': enteredDigits.length === 0 },
        { 'is-fading-out': bgNumbersState === 'fadeOut' },
      ]"
      id="keypad-bg-export"
    >
    </div>

    <!-- Overlay layer with success/fail colors -->
    <div
      :class="[
        'background-numbers',
        'background-numbers-overlay',
        { 'is-visible': animationState !== 'initial' },
        { 'is-fading-out': bgNumbersState === 'fadeOut' },
      ]"
    ></div>

    <Motion
      v-if="!isResetting"
      tag="div"
      class="keypad-grid"
      :variants="keypadGridVariants"
      :animate="keypadGridState"
      :transition="keypadGridTransition"
    >
      <KeypadButton
        v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
        :key="num"
        :value="num"
        @click="handleButtonClick(num)"
      />
      <KeypadButton
        :value="0"
        @click="handleButtonClick(0)"
        class="keypad-zero"
      />
    </Motion>

    <Motion
      v-show="showClearButton"
      tag="button"
      type="button"
      class="keypad-clear-button"
      :variants="keypadGridVariants"
      :animate="keypadGridState"
      :transition="keypadGridTransition"
      :initial="false"
      @click="handleClear"
    >
      Clear
    </Motion>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { Motion } from "motion-v";
import KeypadButton from "./KeypadButton.vue";
import {
  keypadGridVariants,
  keypadGridTransition,
} from "./variants.js";
import {
  getBackgroundPath,
  preloadInitialBackgrounds,
  prefetchNextDigits,
} from "../../utils/keypadBackgroundLoader.js";

const emit = defineEmits(["unlock"]);

// API URL from environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Animation timing logger (only in development)
let animationStartTime = 0;
const logTiming = (message) => {
  if (!import.meta.env.DEV) return;

  if (animationStartTime === 0) {
    animationStartTime = performance.now();
    console.log(`[Keypad 0.000s] ${message}`);
  } else {
    const elapsed = (performance.now() - animationStartTime) / 1000;
    console.log(`[Keypad ${elapsed.toFixed(3)}s] ${message}`);
  }
};

const enteredDigits = ref([]);

const animationState = ref("initial");
const keypadGridState = ref("initial");
const bgNumbersState = ref("initial");
const isAnimating = ref(false);
const isResetting = ref(false);
const isResizing = ref(false);

let resizeTimer = null;
let resizeStartTimer = null;
let lastResizeTime = 0;
const RESIZE_THROTTLE_MS = 16; // ~60fps

// No longer using SVG generation - using pre-generated PNG backgrounds

// Update CSS variables with PNG backgrounds
watch(
  () => enteredDigits.value,
  (digits) => {
    if (digits.length === 0) {
      // Reset glass filter to force Safari to clear cached background
      document.documentElement.style.setProperty("--glass-filter", "none");
      void document.documentElement.offsetHeight;

      // Use empty string instead of 'none' for Safari compatibility
      document.documentElement.style.setProperty("--global-keypad-bg", "");
      document.documentElement.style.setProperty("--global-keypad-mask", "");
      // Add class to force hide background on all elements
      document.documentElement.classList.add("keypad-no-bg");

      // Force Safari to apply changes immediately
      void document.documentElement.offsetHeight;

      // Restore glass filter after a small delay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.documentElement.style.removeProperty("--glass-filter");
        });
      });

      return;
    }

    // Remove no-background class when we have digits
    document.documentElement.classList.remove("keypad-no-bg");

    // Sharp background for both main display and buttons (CSS blur applied to buttons)
    const sharpPath = getBackgroundPath(digits);
    document.documentElement.style.setProperty(
      "--global-keypad-bg",
      `url("${sharpPath}")`
    );
    document.documentElement.style.setProperty(
      "--global-keypad-mask",
      `url("${sharpPath}")`
    );
  },
  { immediate: true, deep: true }
);

// Update overlay color based on animation state
watch(
  () => animationState.value,
  (state) => {
    const color =
      state === "success"
        ? "#00FFBC"
        : state === "fail"
        ? "#FF83A2"
        : "transparent";
    document.documentElement.style.setProperty("--overlay-color", color);
  },
  { immediate: true }
);

// Backend integration
const loading = ref(false);
const errorMessage = ref("");
const rateLimited = ref(false);
const remainingTime = ref(0);
let rateLimitTimer = null;

const showClearButton = computed(() => enteredDigits.value.length > 0);

const getCodeFromDigits = () => {
  return enteredDigits.value
    .map((d) => String(d))
    .join("")
    .padStart(4, "0");
};

const isEditableTarget = (target) => {
  if (!target) return false;
  const editable = target.closest?.(
    "input, textarea, select, [contenteditable='true']"
  );
  return Boolean(editable || target.isContentEditable);
};

const startRateLimitTimer = () => {
  if (rateLimitTimer) {
    clearInterval(rateLimitTimer);
  }

  rateLimitTimer = setInterval(() => {
    remainingTime.value--;
    if (remainingTime.value <= 0) {
      rateLimited.value = false;
      clearInterval(rateLimitTimer);
      rateLimitTimer = null;
    }
  }, 1000);
};

const checkCodeWithBackend = async (code) => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await fetch(`${API_URL}/api/check-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // IMPORTANT for cookies!
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      // Success
      return { success: true };
    } else if (response.status === 429) {
      // Rate limited
      rateLimited.value = true;
      remainingTime.value = 60;
      startRateLimitTimer();
      errorMessage.value = data.error || "Too many attempts";
      return { success: false, rateLimited: true };
    } else {
      // Invalid code
      errorMessage.value = data.error || "Invalid code";
      return { success: false };
    }
  } catch (err) {
    console.error("Error checking code:", err);
    errorMessage.value = "Network error. Please try again.";
    return { success: false };
  } finally {
    loading.value = false;
  }
};

const animateFadeSequence = async (colorState, shouldUnlock) => {
  logTiming(`🎨 Overlay animation START - color: ${colorState === 'success' ? 'GREEN 🟢' : 'RED 🔴'} (500ms)`);

  // Show success/fail color overlay on digits
  animationState.value = colorState;
  await new Promise((resolve) => setTimeout(resolve, 500));
  logTiming('🎨 Overlay animation COMPLETE');

  logTiming('🔢 Digits fade-out START (250ms animation, waiting 250ms)');
  // Fade out background numbers (digits) with 0.25s animation
  bgNumbersState.value = "fadeOut";
  await new Promise((resolve) => setTimeout(resolve, 250));
  logTiming('🔢 Digits fade-out COMPLETE');

  if (shouldUnlock) {
    logTiming('✅ SUCCESS path - small buffer (50ms)');
    // Small buffer before emitting unlock
    await new Promise((resolve) => setTimeout(resolve, 50));
    logTiming('📤 Emitting unlock event to parent');
    emit("unlock");
    logTiming('🏁 Emit complete - waiting for component unmount...');
  } else {
    logTiming('❌ FAIL path - hiding overlay');
    // Hide overlay - watch will set color to transparent
    animationState.value = "initial";

    logTiming('⏳ Waiting for overlay fade (500ms)');
    // Wait for overlay to fully fade
    await new Promise((resolve) => setTimeout(resolve, 500));

    logTiming('🔄 Unmounting keypad buttons');
    // Unmount keypad buttons to clear all cached state
    isResetting.value = true;

    logTiming('🗑️  Clearing digits and backgrounds');
    // Now clear digits and backgrounds
    enteredDigits.value = [];

    // Wait for watch to clear backgrounds
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Force Safari to reflow
    void document.documentElement.offsetHeight;

    // Extra delay to ensure everything is cleared
    await new Promise((resolve) => setTimeout(resolve, 50));

    logTiming('🔄 Resetting states');
    // Reset states
    bgNumbersState.value = "initial";
    keypadGridState.value = "initial";

    logTiming('🔄 Remounting keypad buttons');
    // Remount keypad buttons - everything is clean
    await new Promise((resolve) => setTimeout(resolve, 50));
    isResetting.value = false;

    await new Promise((resolve) => setTimeout(resolve, 50));
    isAnimating.value = false;
    logTiming('🔄 Reset complete - ready for new input');
  }
};

async function handleButtonClick(value) {
  if (isAnimating.value || isResizing.value || enteredDigits.value.length >= 4)
    return;

  // Mark user interaction for video autoplay
  sessionStorage.setItem('user-has-interacted', 'true');

  enteredDigits.value.push(value);

  // Preload next possible backgrounds based on current input
  prefetchNextDigits(enteredDigits.value);

  if (enteredDigits.value.length === 4) {
    isAnimating.value = true;
    const code = enteredDigits.value.join("");

    // Reset timing for new animation sequence
    animationStartTime = 0;
    logTiming('✨ 4th digit entered - starting animation sequence');

    logTiming('⌨️  Keypad fade-out START (500ms)');
    // Fade out keypad grid immediately after entering 4th digit
    keypadGridState.value = "fadeOut";
    await new Promise((resolve) => setTimeout(resolve, 500));
    logTiming('⌨️  Keypad fade-out COMPLETE');

    logTiming('🔍 Backend code check START');
    // Check code with backend
    const result = await checkCodeWithBackend(code);
    logTiming(`🔍 Backend code check COMPLETE - result: ${result.success ? 'SUCCESS ✅' : 'FAIL ❌'}`);

    if (result.rateLimited) {
      // Rate limited - reset immediately
      logTiming('⏱️  Rate limited - resetting immediately');
      enteredDigits.value = [];
      animationState.value = "initial";
      bgNumbersState.value = "initial";
      keypadGridState.value = "initial";
      isAnimating.value = false;
    } else {
      // Animate success or failure
      await animateFadeSequence(
        result.success ? "success" : "fail",
        result.success
      );
    }
  }
}

function handleClear() {
  if (isAnimating.value || isResizing.value) return;

  // Mark user interaction for video autoplay
  sessionStorage.setItem('user-has-interacted', 'true');

  // Reset glass filter to force Safari to clear cached background
  document.documentElement.style.setProperty("--glass-filter", "none");
  void document.documentElement.offsetHeight;

  // Explicitly clear backgrounds for Safari
  document.documentElement.style.setProperty("--global-keypad-bg", "");
  document.documentElement.style.setProperty("--global-keypad-mask", "");
  document.documentElement.classList.add("keypad-no-bg");
  void document.documentElement.offsetHeight; // Force Safari reflow

  // Then clear state
  enteredDigits.value = [];
  animationState.value = "initial";
  bgNumbersState.value = "initial";

  // Restore glass filter after a small delay
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.style.removeProperty("--glass-filter");
    });
  });
}

function handleBackspace() {
  if (isAnimating.value || isResizing.value || enteredDigits.value.length === 0)
    return;
  enteredDigits.value = enteredDigits.value.slice(0, -1);
  animationState.value = "initial";
  bgNumbersState.value = "initial";
}

function handleKeyDown(event) {
  if (
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey ||
    event.repeat
  )
    return;

  if (isEditableTarget(event.target)) return;

  if (event.key === "Backspace") {
    if (enteredDigits.value.length > 0) {
      event.preventDefault();
      handleBackspace();
    }
    return;
  }

  if (/^\d$/.test(event.key)) {
    event.preventDefault();
    handleButtonClick(Number(event.key));
  }
}

function handleResizeThrottled() {
  const now = Date.now();

  // Throttle the actual resize handling
  if (now - lastResizeTime < RESIZE_THROTTLE_MS) {
    return;
  }

  lastResizeTime = now;
  handleResize();
}

function handleResize() {
  // Clear existing timers
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  if (resizeStartTimer) {
    clearTimeout(resizeStartTimer);
  }

  // Mark as resizing immediately (prevents interactions)
  if (!isResizing.value && enteredDigits.value.length > 0) {
    isResizing.value = true;

    // Hide backgrounds immediately during resize to prevent artifacts
    document.documentElement.style.setProperty("--global-keypad-bg", "none");
    document.documentElement.style.setProperty("--global-keypad-mask", "none");

    // Force immediate reflow
    void document.documentElement.offsetHeight;
  }

  // Debounce: wait for resize to stop
  resizeTimer = setTimeout(() => {
    if (enteredDigits.value.length === 0) {
      isResizing.value = false;
      return;
    }

    // Force Safari to clear any cached backgrounds
    document.documentElement.style.setProperty("--glass-filter", "none");
    void document.documentElement.offsetHeight;

    const sharpPath = getBackgroundPath(enteredDigits.value);

    // Clear CSS variables completely
    document.documentElement.style.setProperty("--global-keypad-bg", "");
    document.documentElement.style.setProperty("--global-keypad-mask", "");
    void document.documentElement.offsetHeight;

    // Use double rAF for reliable re-render
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Re-apply backgrounds
        document.documentElement.style.setProperty(
          "--global-keypad-bg",
          `url("${sharpPath}")`
        );
        document.documentElement.style.setProperty(
          "--global-keypad-mask",
          `url("${sharpPath}")`
        );

        // Force reflow
        void document.documentElement.offsetHeight;

        // Restore glass filter and unlock interactions
        requestAnimationFrame(() => {
          document.documentElement.style.removeProperty("--glass-filter");
          isResizing.value = false;
        });
      });
    });
  }, 250);
}

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeyDown);
    // Use throttled version and passive listener for better performance
    window.addEventListener("resize", handleResizeThrottled, { passive: true });
  }

  // Preload manifest and initial backgrounds
  preloadInitialBackgrounds();
});

onBeforeUnmount(() => {
  logTiming('💀 Component onBeforeUnmount - starting cleanup');

  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("resize", handleResizeThrottled);
  }
  if (rateLimitTimer) {
    clearInterval(rateLimitTimer);
  }
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  if (resizeStartTimer) {
    clearTimeout(resizeStartTimer);
  }

  logTiming('💀 Component cleanup COMPLETE - about to unmount from DOM');
});
</script>

<style scoped>
.keypad-container {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;
  max-height: 100vh;
  max-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #171717;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  touch-action: none;
}

.keypad-container.is-resizing .keypad-grid {
  pointer-events: none;
}

.background-preview-png {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 0;
  opacity: 1;
  border: 2px solid red;
}

.background-numbers {
  position: absolute;
  inset: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-position: center center;
  background-size: 150%;
  background-repeat: no-repeat;
}


.background-numbers-base {
  z-index: 1;
  background-image: var(--global-keypad-bg);
  opacity: 1;
  transition: opacity 0.25s ease-out;
}

.background-numbers-base.is-fading-out {
  opacity: 0;
}

.background-numbers-base.no-background,
.keypad-no-bg .background-numbers-base {
  background-image: none !important;
}

.background-numbers-overlay {
  z-index: 2;
  mask-image: var(--global-keypad-mask);
  -webkit-mask-image: var(--global-keypad-mask);
  mask-size: 150%;
  -webkit-mask-size: 150%;
  mask-position: center center;
  -webkit-mask-position: center center;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  background-color: var(--overlay-color, transparent);
  opacity: 0;
  transition: opacity 0.5s ease, background-color 0.5s ease;
}

.background-numbers-overlay.is-visible {
  opacity: 1;
}

/* Fade-out animation for overlay - override transition to be faster */
.background-numbers-overlay.is-fading-out {
  opacity: 0 !important;
  transition: opacity 0.25s ease-out !important;
}

/* Mobile: digits above keyboard */
@media (max-width: 767px) {
  .background-numbers {
    background-size: 50%;
    position: absolute;
    left: 50%;
    top: 15%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: auto;
    aspect-ratio: 4/1;
  }

  .background-numbers-overlay {
    mask-size: 50%;
    -webkit-mask-size: 50%;
  }
}

/* Desktop: centered background */
@media (min-width: 768px) {
  .background-numbers {
    height: clamp(350px, 60vw, 950px);
    width: 100vw;
    left: 50%;
    right: auto;
    top: 50%;
    bottom: auto;
    transform: translate(-50%, -50%);
  }
}

.background-digit {
  width: auto;
  height: 100%;
  opacity: 1;
  user-select: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: color 0.5s ease;
}

.background-digit :deep(.keypad-digit-svg) {
  height: 100%;
  width: auto;
}

.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: clamp(32px, 8vw, 80px);
  padding: clamp(24px, 4vw, 40px);
  position: relative;
  z-index: 10;
  max-width: 100%;
  max-height: 100%;
}

/* Mobile: position keyboard with top/bottom margins */
@media (max-width: 767px) {
  .keypad-grid {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% + 30px));
    width: fit-content;
    padding: clamp(16px, 4vw, 24px);
  }
}

/* Tablet only: limit keyboard height to screen size */
@media (min-width: 768px) and (max-width: 1024px) {
  .keypad-grid {
    max-height: 100vh;
    max-height: 100dvh;
    box-sizing: border-box;
  }
}

/* Tablet landscape: reduce spacing to fit on screen */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .keypad-grid {
    gap: clamp(16px, 4vw, 32px);
    padding: clamp(16px, 2vw, 24px);
  }

  /* Scale down buttons to fit screen height */
  .keypad-grid :deep(.keypad-button-hover-wrapper) {
    width: clamp(55px, 12vw, 85px) !important;
    height: clamp(55px, 12vw, 85px) !important;
  }

  .keypad-grid :deep(.keypad-button-wrapper) {
    width: clamp(55px, 12vw, 85px) !important;
    height: clamp(55px, 12vw, 85px) !important;
    border-radius: clamp(14px, 3vw, 21px) !important;
  }

  .keypad-grid :deep(.keypad-number) {
    font-size: clamp(18px, 4.5vw, 24px) !important;
  }
}

.keypad-zero {
  grid-column: 2 / 3;
}

.keypad-clear-button {
  position: absolute;
  bottom: max(32px, calc(env(safe-area-inset-bottom) + 16px));
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.02em;
  padding: 8px 12px;
  cursor: pointer;
  text-decoration: none;
  z-index: 20;
}

.keypad-clear-button:hover {
  color: #ffffff;
}

/* Mobile: adjust Clear button positioning */
@media (max-width: 767px) {
  .keypad-clear-button {
    bottom: max(60px, calc(env(safe-area-inset-bottom) + 48px));
  }
}

/* Tablet only: position Clear button in bottom-right corner */
@media (min-width: 768px) and (max-width: 1024px) {
  .keypad-clear-button {
    left: auto;
    right: max(32px, calc(env(safe-area-inset-right) + 16px));
    transform: none;
  }
}
</style>
