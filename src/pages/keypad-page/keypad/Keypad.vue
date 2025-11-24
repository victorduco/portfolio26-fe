<template>
  <div :class="['keypad-container', { 'is-resizing': isResizing }]">
    <div v-for="layer in ['base', 'overlay']" :key="layer" :class="['background-numbers', `background-numbers-${layer}`, {'no-background': layer === 'base' && !enteredDigits.length, 'is-visible': layer === 'overlay' && animationState !== 'initial', 'is-fading-out': bgNumbersState === 'fadeOut'}]" :id="layer === 'base' ? 'keypad-bg-export' : undefined"></div>
    <Motion v-if="!isResetting" tag="div" class="keypad-grid" :variants="keypadGridVariants" :animate="keypadGridState" :transition="gridTransition">
      <KeypadButton v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9]" :key="num" :value="num" @click="handleButtonClick(num)" />
      <KeypadButton :value="0" @click="handleButtonClick(0)" class="keypad-zero" />
    </Motion>
    <Motion tag="button" type="button" :class="['keypad-clear-button', { 'is-label': !showClearButton }]" :variants="keypadGridVariants" :animate="keypadGridState" :transition="gridTransition" :initial="false" @click="showClearButton ? handleClear() : null">
      {{ showClearButton ? 'Clear' : 'Enter Access Code' }}
    </Motion>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { Motion } from "motion-v";
import KeypadButton from "./KeypadButton.vue";
import { keypadGridVariants, keypadGridTransition } from "./variants.js";
import { getBackgroundPath, getBackgroundPathAsync, preloadInitialBackgrounds, prefetchNextDigits, initKeypadBackgrounds } from "@/utils/keypadBackgroundLoader.js";
import { setBackgroundImage, hideBackgroundImage, hideBackgroundWithGlassEffect, showBackgroundWithGlassEffect } from "@/composables/useKeypadBackground.js";
import { resetAnimationState, animateFadeSequence, delay } from "@/composables/useKeypadAnimation.js";
import { ANIMATION_DELAYS, RESIZE_THROTTLE_MS } from "@/constants/keypadConstants.js";
const emit = defineEmits(["unlock"]);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const enteredDigits = ref([]);
const animationState = ref("initial");
const keypadGridState = ref("initial");
const bgNumbersState = ref("initial");
const isAnimating = ref(false);
const isResetting = ref(false);
const isResizing = ref(false);
const rateLimited = ref(false);
const remainingTime = ref(0);
const timers = { rateLimit: null, resize: null };
let lastResizeTime = 0;
const showClearButton = computed(() => enteredDigits.value.length > 0);
watch(() => enteredDigits.value, async (digits) => {
  if (!digits.length) return hideBackgroundWithGlassEffect();
  document.documentElement.classList.remove("keypad-no-bg");
  const path = await getBackgroundPathAsync(digits);
  if (path) setBackgroundImage(path);
}, { immediate: true, deep: true });
watch(() => animationState.value, (state) => {
  const color = state === "success" ? "#00FFBC" : state === "fail" ? "#FF83A2" : "transparent";
  document.documentElement.style.setProperty("--overlay-color", color);
}, { immediate: true });
const isEditableTarget = (t) => Boolean(t?.closest?.("input, textarea, select, [contenteditable='true']") || t?.isContentEditable);
const startRateLimitTimer = () => {
  if (timers.rateLimit) clearInterval(timers.rateLimit);
  timers.rateLimit = setInterval(() => {
    if (--remainingTime.value <= 0) {
      rateLimited.value = false;
      clearInterval(timers.rateLimit);
      timers.rateLimit = null;
    }
  }, 1000);
};
const checkCodeWithBackend = async (code) => {
  try {
    const res = await fetch(`${API_URL}/api/check-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (res.ok && data.ok) return { success: true };
    if (res.status === 429) {
      rateLimited.value = true;
      remainingTime.value = 60;
      startRateLimitTimer();
      return { success: false, rateLimited: true };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
};
async function handleButtonClick(value) {
  if (isAnimating.value || isResizing.value || enteredDigits.value.length >= 4) return;
  sessionStorage.setItem('user-has-interacted', 'true');
  enteredDigits.value.push(value);
  prefetchNextDigits(enteredDigits.value);
  if (enteredDigits.value.length === 4) {
    isAnimating.value = true;
    keypadGridState.value = "fadeOut";
    await delay(ANIMATION_DELAYS.GRID_FADEOUT);
    const result = await checkCodeWithBackend(enteredDigits.value.join(""));
    if (result.rateLimited) {
      enteredDigits.value = [];
      resetAnimationState(animationState, bgNumbersState, keypadGridState);
      isAnimating.value = false;
    } else {
      await animateFadeSequence({
        animationState, bgNumbersState, keypadGridState, isResetting, enteredDigits,
        colorState: result.success ? "success" : "fail",
        shouldUnlock: result.success,
        onUnlock: () => emit("unlock"),
      });
      if (!result.success) isAnimating.value = false;
    }
  }
}
function handleClear() {
  if (isAnimating.value || isResizing.value) return;
  sessionStorage.setItem('user-has-interacted', 'true');
  hideBackgroundWithGlassEffect();
  enteredDigits.value = [];
  resetAnimationState(animationState, bgNumbersState);
}
function handleBackspace() {
  if (isAnimating.value || isResizing.value || !enteredDigits.value.length) return;
  enteredDigits.value = enteredDigits.value.slice(0, -1);
  resetAnimationState(animationState, bgNumbersState);
}
function handleKeyDown(e) {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.repeat || isEditableTarget(e.target)) return;
  if (e.key === "Backspace" && enteredDigits.value.length) {
    e.preventDefault();
    handleBackspace();
  } else if (/^\d$/.test(e.key)) {
    e.preventDefault();
    handleButtonClick(Number(e.key));
  }
}
function handleResize() {
  if (timers.resize) clearTimeout(timers.resize);
  if (!isResizing.value && enteredDigits.value.length) {
    isResizing.value = true;
    hideBackgroundImage();
  }
  timers.resize = setTimeout(() => {
    if (!enteredDigits.value.length) return isResizing.value = false;
    const path = getBackgroundPath(enteredDigits.value);
    if (!path) return isResizing.value = false;
    showBackgroundWithGlassEffect(path);
    isResizing.value = false;
  }, ANIMATION_DELAYS.RESIZE_DEBOUNCE);
}
const handleResizeThrottled = () => {
  const now = Date.now();
  if (now - lastResizeTime < RESIZE_THROTTLE_MS) return;
  lastResizeTime = now;
  handleResize();
};
onMounted(async () => {
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResizeThrottled, { passive: true });
  }
  await initKeypadBackgrounds();
  preloadInitialBackgrounds();
});
onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("resize", handleResizeThrottled);
  }
  Object.values(timers).forEach(t => t && clearTimeout(t));
});
</script>

<style scoped>
.keypad-container { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; height: 100dvh; background: #171717; overflow: hidden; touch-action: none; }
.keypad-container.is-resizing .keypad-grid { pointer-events: none; }
.background-numbers { position: absolute; inset: 0; pointer-events: none; display: flex; align-items: center; justify-content: center; background: center / 150% no-repeat; }
.background-numbers-base { z-index: 1; background-image: var(--global-keypad-bg); transition: opacity 0.25s ease-out; }
.background-numbers-base.is-fading-out { opacity: 0; }
.background-numbers-base.no-background, :global(.keypad-no-bg) .background-numbers-base { background-image: none !important; }
.background-numbers-overlay { z-index: 2; -webkit-mask: var(--global-keypad-mask) center / 150% no-repeat; mask: var(--global-keypad-mask) center / 150% no-repeat; background-color: var(--overlay-color, transparent); opacity: 0; transition: opacity 0.5s ease, background-color 0.5s ease; }
.background-numbers-overlay.is-visible { opacity: 1; }
.background-numbers-overlay.is-fading-out { opacity: 0 !important; transition: opacity 0.25s ease-out !important; }
.keypad-grid { display: grid; grid-template: repeat(4, 1fr) / repeat(3, 1fr); gap: clamp(32px, 8vw, 80px); padding: clamp(24px, 4vw, 40px); position: relative; z-index: 10; }
.keypad-zero { grid-column: 2 / 3; }
.keypad-clear-button { position: absolute; bottom: max(32px, calc(env(safe-area-inset-bottom) + 16px)); left: 50%; transform: translateX(-50%); background: transparent; border: none; color: rgba(255, 255, 255, 0.7); font: 500 14px / 1 system-ui; letter-spacing: 0.02em; padding: 8px 12px; cursor: pointer; z-index: 20; }
.keypad-clear-button.is-label { cursor: default; pointer-events: none; }
.keypad-clear-button:not(.is-label):hover { color: #fff; }
@media (max-width: 767px) {
  .background-numbers { background-size: 50%; aspect-ratio: 4/1; height: auto; left: 50%; top: 15%; transform: translate(-50%, -50%); }
  .background-numbers-overlay { -webkit-mask-size: 50%; mask-size: 50%; }
  .keypad-grid { position: absolute; top: 50%; left: 50%; transform: translate(-50%, calc(-50% + 30px)); width: fit-content; padding: clamp(16px, 4vw, 24px); }
  .keypad-clear-button { bottom: max(60px, calc(env(safe-area-inset-bottom) + 48px)); }
}
@media (min-width: 768px) {
  .background-numbers { height: clamp(350px, 60vw, 950px); width: 100vw; left: 50%; top: 50%; transform: translate(-50%, -50%); }
}
@media (min-width: 768px) and (max-width: 1024px) {
  .keypad-grid { max-height: 100dvh; }
  .keypad-clear-button { left: auto; right: max(32px, calc(env(safe-area-inset-right) + 16px)); transform: none; }
}
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .keypad-grid { gap: clamp(16px, 4vw, 32px); padding: clamp(16px, 2vw, 24px); }
  .keypad-grid :deep(.keypad-button-hover-wrapper), .keypad-grid :deep(.keypad-button-wrapper) { width: clamp(55px, 12vw, 85px) !important; height: clamp(55px, 12vw, 85px) !important; }
  .keypad-grid :deep(.keypad-button-wrapper) { border-radius: clamp(14px, 3vw, 21px) !important; }
  .keypad-grid :deep(.keypad-number) { font-size: clamp(18px, 4.5vw, 24px) !important; }
}
</style>
