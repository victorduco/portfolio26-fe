<template>
  <div class="keypad-container">
    <!-- Base layer with normal colors -->
    <Motion
      tag="div"
      class="background-numbers background-numbers-base"
      id="keypad-bg-export"
      :variants="backgroundNumbersVariants"
      :animate="bgNumbersState"
      :transition="backgroundNumbersTransition"
    >
    </Motion>

    <!-- Overlay layer with success/fail colors -->
    <div
      :class="[
        'background-numbers',
        'background-numbers-overlay',
        { 'is-visible': animationState !== 'initial' },
      ]"
    ></div>

    <Motion
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
import { useMeta } from "../../composables/useMeta.js";
import {
  keypadGridVariants,
  keypadGridTransition,
  backgroundNumbersVariants,
  backgroundNumbersTransition,
} from "./variants.js";
import {
  getBackgroundPath,
  preloadInitialBackgrounds,
} from "../../utils/keypadBackgroundLoader.js";

useMeta("keypad");

const emit = defineEmits(["unlock"]);

// API URL from environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const enteredDigits = ref([]);

const animationState = ref("initial");
const keypadGridState = ref("initial");
const bgNumbersState = ref("initial");
const isAnimating = ref(false);

let resizeTimer = null;

// No longer using SVG generation - using pre-generated PNG backgrounds

// Update CSS variables with PNG backgrounds
watch(
  () => enteredDigits.value,
  (digits) => {
    window.__profile?.start?.("background-update");
    console.log(
      "🔄 Watch triggered, digits:",
      digits,
      "length:",
      digits.length
    );

    if (digits.length === 0) {
      console.log("⚠️ No digits, setting to none");
      document.documentElement.style.setProperty("--global-keypad-bg", "none");
      document.documentElement.style.setProperty(
        "--global-keypad-mask",
        "none"
      );
      window.__profile?.end?.("background-update");
      window.__profile?.mark?.("background-cleared");
      return;
    }

    console.log("📝 Digits:", digits);

    // Sharp background for both main display and buttons (CSS blur applied to buttons)
    window.__profile?.start?.("sharp-background-set");
    const sharpPath = getBackgroundPath(digits);
    document.documentElement.style.setProperty(
      "--global-keypad-bg",
      `url("${sharpPath}")`
    );
    document.documentElement.style.setProperty(
      "--global-keypad-mask",
      `url("${sharpPath}")`
    );
    console.log("✅ Set --global-keypad-bg:", sharpPath);
    window.__profile?.end?.("sharp-background-set");

    window.__profile?.end?.("background-update");
    window.__profile?.mark?.(`background-updated-${digits.join("")}`);

    // Mark when background is actually rendered
    requestAnimationFrame(() => {
      window.__profile?.mark?.(`background-rendered-${digits.join("")}`);
    });
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
  await new Promise((resolve) => setTimeout(resolve, 500));

  keypadGridState.value = "fadeOut";
  await new Promise((resolve) => setTimeout(resolve, 1000));

  animationState.value = colorState;
  await new Promise((resolve) =>
    setTimeout(resolve, colorState === "success" ? 500 : 1000)
  );

  bgNumbersState.value = "fadeOut";
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (shouldUnlock) {
    emit("unlock");
  } else {
    // Hide overlay first (opacity 1 -> 0)
    animationState.value = "initial";
    // Wait for overlay transition to complete
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Now clear digits (removes mask when overlay is already hidden)
    enteredDigits.value = [];
    bgNumbersState.value = "initial";
    keypadGridState.value = "initial";
    await new Promise((resolve) => setTimeout(resolve, 100));
    isAnimating.value = false;
  }
};

async function handleButtonClick(value) {
  if (isAnimating.value || enteredDigits.value.length >= 4) return;

  // 🔍 PROFILING: Start timing
  window.__keypadProfile = { clickTime: performance.now() };

  enteredDigits.value.push(value);

  if (enteredDigits.value.length === 4) {
    isAnimating.value = true;
    const code = enteredDigits.value.join("");

    // Check code with backend
    const result = await checkCodeWithBackend(code);

    if (result.rateLimited) {
      // Rate limited - reset immediately
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
  if (isAnimating.value) return;
  enteredDigits.value = [];
  animationState.value = "initial";
  bgNumbersState.value = "initial";
}

function handleBackspace() {
  if (isAnimating.value || enteredDigits.value.length === 0) return;
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

function handleResize() {
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }

  resizeTimer = setTimeout(() => {
    // Force update mask and background on resize
    if (enteredDigits.value.length > 0) {
      const code = enteredDigits.value.join("");
      const sharpPath = `/keypad-backgrounds/sharp/${code}.png`;

      // Re-apply CSS variables to ensure proper rendering after resize
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          "--global-keypad-bg",
          `url("${sharpPath}")`
        );
        document.documentElement.style.setProperty(
          "--global-keypad-mask",
          `url("${sharpPath}")`
        );
      });
    }
  }, 150);
}

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
  }

  // Preload manifest and initial backgrounds
  preloadInitialBackgrounds();
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("resize", handleResize);
  }
  if (rateLimitTimer) {
    clearInterval(rateLimitTimer);
  }
  if (resizeTimer) {
    clearTimeout(resizeTimer);
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

/* Landscape mode: reduce spacing to fit all buttons */
@media (orientation: landscape) and (max-height: 700px) {
  .keypad-grid {
    gap: clamp(8px, 2vh, 20px);
    padding: clamp(12px, 2vh, 24px);
    max-height: 90dvh;
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
</style>
