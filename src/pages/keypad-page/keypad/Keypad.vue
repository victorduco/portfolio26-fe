<template>
  <div :class="['keypad-container', { 'is-resizing': isResizing }]">
    
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
      tag="button"
      type="button"
      :class="['keypad-clear-button', { 'is-label': !showClearButton }]"
      :variants="keypadGridVariants"
      :animate="keypadGridState"
      :transition="keypadGridTransition"
      :initial="false"
      @click="showClearButton ? handleClear() : null"
    >
      {{ showClearButton ? 'Clear' : 'Enter Access Code' }}
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
} from "@/utils/keypadBackgroundLoader.js";

const emit = defineEmits(["unlock"]);


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";



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




watch(
  () => enteredDigits.value,
  (digits) => {
    if (digits.length === 0) {
      
      document.documentElement.style.setProperty("--glass-filter", "none");
      void document.documentElement.offsetHeight;

      
      document.documentElement.style.setProperty("--global-keypad-bg", "");
      document.documentElement.style.setProperty("--global-keypad-mask", "");
      
      document.documentElement.classList.add("keypad-no-bg");

      
      void document.documentElement.offsetHeight;

      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.documentElement.style.removeProperty("--glass-filter");
        });
      });

      return;
    }

    
    document.documentElement.classList.remove("keypad-no-bg");

    
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
      
      return { success: true };
    } else if (response.status === 429) {
      
      rateLimited.value = true;
      remainingTime.value = 60;
      startRateLimitTimer();
      errorMessage.value = data.error || "Too many attempts";
      return { success: false, rateLimited: true };
    } else {
      
      errorMessage.value = data.error || "Invalid code";
      return { success: false };
    }
  } catch (err) {
    errorMessage.value = "Network error. Please try again.";
    return { success: false };
  } finally {
    loading.value = false;
  }
};

const animateFadeSequence = async (colorState, shouldUnlock) => {
  
  animationState.value = colorState;
  await new Promise((resolve) => setTimeout(resolve, 500));

  
  bgNumbersState.value = "fadeOut";
  await new Promise((resolve) => setTimeout(resolve, 250));

  if (shouldUnlock) {
    
    await new Promise((resolve) => setTimeout(resolve, 50));
    emit("unlock");
  } else {
    
    animationState.value = "initial";

    
    await new Promise((resolve) => setTimeout(resolve, 500));

    
    isResetting.value = true;

    
    enteredDigits.value = [];

    
    await new Promise((resolve) => setTimeout(resolve, 100));

    
    void document.documentElement.offsetHeight;

    
    await new Promise((resolve) => setTimeout(resolve, 50));

    
    bgNumbersState.value = "initial";
    keypadGridState.value = "initial";

    
    await new Promise((resolve) => setTimeout(resolve, 50));
    isResetting.value = false;

    await new Promise((resolve) => setTimeout(resolve, 50));
    isAnimating.value = false;
  }
};

async function handleButtonClick(value) {
  if (isAnimating.value || isResizing.value || enteredDigits.value.length >= 4)
    return;

  
  sessionStorage.setItem('user-has-interacted', 'true');

  enteredDigits.value.push(value);

  
  prefetchNextDigits(enteredDigits.value);

  if (enteredDigits.value.length === 4) {
    isAnimating.value = true;
    const code = enteredDigits.value.join("");

    
    keypadGridState.value = "fadeOut";
    await new Promise((resolve) => setTimeout(resolve, 500));

    
    const result = await checkCodeWithBackend(code);

    if (result.rateLimited) {
      
      enteredDigits.value = [];
      animationState.value = "initial";
      bgNumbersState.value = "initial";
      keypadGridState.value = "initial";
      isAnimating.value = false;
    } else {
      
      await animateFadeSequence(
        result.success ? "success" : "fail",
        result.success
      );
    }
  }
}

function handleClear() {
  if (isAnimating.value || isResizing.value) return;

  
  sessionStorage.setItem('user-has-interacted', 'true');

  
  document.documentElement.style.setProperty("--glass-filter", "none");
  void document.documentElement.offsetHeight;

  
  document.documentElement.style.setProperty("--global-keypad-bg", "");
  document.documentElement.style.setProperty("--global-keypad-mask", "");
  document.documentElement.classList.add("keypad-no-bg");
  void document.documentElement.offsetHeight; // Force Safari reflow

  
  enteredDigits.value = [];
  animationState.value = "initial";
  bgNumbersState.value = "initial";

  
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

  
  if (now - lastResizeTime < RESIZE_THROTTLE_MS) {
    return;
  }

  lastResizeTime = now;
  handleResize();
}

function handleResize() {
  
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  if (resizeStartTimer) {
    clearTimeout(resizeStartTimer);
  }

  
  if (!isResizing.value && enteredDigits.value.length > 0) {
    isResizing.value = true;

    
    document.documentElement.style.setProperty("--global-keypad-bg", "none");
    document.documentElement.style.setProperty("--global-keypad-mask", "none");

    
    void document.documentElement.offsetHeight;
  }

  
  resizeTimer = setTimeout(() => {
    if (enteredDigits.value.length === 0) {
      isResizing.value = false;
      return;
    }

    
    document.documentElement.style.setProperty("--glass-filter", "none");
    void document.documentElement.offsetHeight;

    const sharpPath = getBackgroundPath(enteredDigits.value);

    
    document.documentElement.style.setProperty("--global-keypad-bg", "");
    document.documentElement.style.setProperty("--global-keypad-mask", "");
    void document.documentElement.offsetHeight;

    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        
        document.documentElement.style.setProperty(
          "--global-keypad-bg",
          `url("${sharpPath}")`
        );
        document.documentElement.style.setProperty(
          "--global-keypad-mask",
          `url("${sharpPath}")`
        );

        
        void document.documentElement.offsetHeight;

        
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
    
    window.addEventListener("resize", handleResizeThrottled, { passive: true });
  }

  
  preloadInitialBackgrounds();
});

onBeforeUnmount(() => {
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

.keypad-clear-button.is-label {
  cursor: default;
  pointer-events: none;
}

.keypad-clear-button:not(.is-label):hover {
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
