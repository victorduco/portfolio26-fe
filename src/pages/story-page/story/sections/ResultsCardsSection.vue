<template>
  <section class="story-results-2">
    <div class="results-content">
      <h3 class="story-results-title">Results</h3>
      <p class="results-intro">
        {{ introText }}
      </p>
      <div class="results-wrapper" ref="containerRef">
        <div
          class="results-container"
          :style="{ '--bg-color': cardBackground, ...shadowVars }"
        >
          <div class="results-grid">
            <div
              v-for="(result, index) in results"
              :key="index"
              :ref="(el) => (cardRefs[index] = el)"
              class="result-card"
            >
              <div class="result-card-header">
                <div class="result-label">{{ result.label }}</div>
                <img v-if="result.iconSrc" :src="result.iconSrc" alt="" class="result-icon" />
              </div>
              <div class="result-card-inner">
                <div
                  class="result-value"
                  v-html="formatTitle(result.title)"
                ></div>
                <div class="result-description">{{ result.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-if="conclusionText" class="results-conclusion">
        {{ conclusionText }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useAdaptiveShadow } from "@/composables/useAdaptiveShadow.js";

// Скорости параллакса для каждой карточки (разные направления и скорости)
const parallaxSpeeds = [-0.4, 0.8, -0.6];

// Мобильный брейкпоинт
const MOBILE_BREAKPOINT = 768;
const isMobile = ref(window.innerWidth <= MOBILE_BREAKPOINT);

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT;
};

const props = defineProps({
  results: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(
        (result) =>
          typeof result === "object" &&
          "title" in result &&
          "description" in result
      );
    },
  },
  introText: {
    type: String,
    required: true,
  },
  conclusionText: {
    type: String,
    default: null,
  },
  cardBackground: {
    type: String,
    default: "#F7E7E7",
  },
});

const formatTitle = (title) => {
  const rocketSvg = `<svg class="rocket-icon" width="50" height="23" viewBox="0 0 50 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.4834 0.396425L18.2979 4.7085C17.0952 5.22036 15.9368 5.82775 14.8336 6.52491L14.1982 6.92796L14.2697 15.6396L14.9095 16.0562C16.0248 16.7722 17.1937 17.3994 18.4052 17.9318L16.6638 22.2136C16.6464 22.2559 16.6399 22.3021 16.6448 22.3479C16.6497 22.3937 16.6659 22.4378 16.6919 22.4762C16.7179 22.5146 16.753 22.5461 16.7939 22.5678C16.8348 22.5895 16.8803 22.6009 16.9263 22.6008L20.7336 22.6332C21.3549 22.6385 21.9682 22.5135 22.5339 22.2662C23.0996 22.0189 23.6051 21.6548 24.0178 21.1975L25.1616 19.9164C31.2967 20.8903 39.4186 19.9618 48.296 13.0439C48.5218 12.8737 48.7043 12.6529 48.8294 12.3989C48.9545 12.1448 49.0187 11.8643 49.017 11.5792C49.0153 11.2941 48.9478 11.0121 48.8198 10.7552C48.6917 10.4983 48.5066 10.2734 48.2788 10.0982C39.2772 3.03854 31.1331 1.97165 25.024 2.83082L23.8557 1.53791C23.4378 1.07275 22.9286 0.698564 22.361 0.439406C21.7933 0.180248 21.1797 0.041858 20.5596 0.0331367L16.7523 0.000732367C16.7035 -0.0036357 16.6546 0.00496426 16.6106 0.0256609C16.5665 0.0463575 16.529 0.0784154 16.5017 0.118586C16.4744 0.158756 16.4583 0.205611 16.4551 0.254403C16.4519 0.303196 16.4616 0.352191 16.4834 0.396425ZM33.4004 8.11253C34.0591 8.11928 34.7043 8.32105 35.2546 8.69236C35.8049 9.06367 36.2356 9.58786 36.4924 10.1988C36.7491 10.8096 36.8203 11.4798 36.697 12.1247C36.5737 12.7696 36.2615 13.3602 35.7997 13.822C35.3379 14.2838 34.7473 14.596 34.1024 14.7193C33.4576 14.8426 32.7874 14.7714 32.1765 14.5146C31.5656 14.2579 31.0414 13.8272 30.6701 13.2769C30.2988 12.7266 30.097 12.0814 30.0903 11.4227C30.0858 10.984 30.1679 10.5503 30.332 10.1463C30.496 9.74235 30.7388 9.3761 31.0463 9.06857C31.3538 8.76104 31.7201 8.51829 32.124 8.35423C32.528 8.19017 32.9618 8.10804 33.4004 8.11253ZM6.83659 8.8971C6.50363 8.21338 6.00068 7.62456 5.37674 7.18802C5.31959 7.15092 5.27254 7.10009 5.23998 7.04029C5.20742 6.98048 5.19041 6.91366 5.19055 6.84606C5.18968 6.76329 5.21428 6.68269 5.261 6.61518C5.30773 6.54766 5.37433 6.4965 5.45178 6.46863C7.20333 5.84205 11.0865 4.94299 11.8564 9.57608C11.8581 9.60261 11.8542 9.6291 11.8449 9.65383C11.8356 9.67856 11.8212 9.70096 11.8026 9.71958C11.784 9.73821 11.7616 9.75262 11.7369 9.76189C11.7121 9.77116 11.6856 9.77508 11.6591 9.77339C11.0174 9.69173 10.3681 9.76193 9.76358 9.9783C9.1591 10.1947 8.61645 10.5511 8.1795 11.0189C8.12838 11.0739 8.10032 11.1467 8.10096 11.2224C8.10161 11.2982 8.13091 11.3714 8.18298 11.4274C8.62303 11.9036 9.16693 12.2719 9.77096 12.5026C10.375 12.7333 11.0223 12.82 11.6609 12.7556C11.6888 12.7531 11.7169 12.7567 11.7434 12.7664C11.7698 12.776 11.7939 12.7913 11.8139 12.8113C11.8338 12.8313 11.8492 12.8554 11.8588 12.8818C11.8685 12.9083 11.8721 12.9364 11.8695 12.9643C11.8058 13.778 11.4052 16.2437 8.87798 16.484C7.78892 16.5746 6.70063 16.2324 5.84835 15.5313C4.6224 14.539 2.21747 12.8455 0.440522 12.9482C0.367774 12.9537 0.29455 12.9394 0.22866 12.9067C0.162769 12.874 0.106684 12.8242 0.0663829 12.7626C0.026082 12.7009 0.00307887 12.6298 -0.000175321 12.5568C-0.00342951 12.4837 0.0131871 12.4115 0.0479047 12.3478C0.743887 11.0603 2.50155 8.38368 6.83659 8.8971Z" fill="#AE1408"/>
</svg>`;
  return title.replace(/→/g, rocketSvg);
};

const shadowVars = computed(() => useAdaptiveShadow());

const containerRef = ref(null);
const cardRefs = ref([]);

// Parallax animation with IntersectionObserver optimization
let animationFrameId = null;
let isInViewport = false;
let observer = null;

const updateParallax = () => {
  // Stop RAF loop when not in viewport
  if (!containerRef.value || !isInViewport) {
    animationFrameId = null;
    return;
  }

  // На мобильных отключаем параллакс
  if (isMobile.value) {
    cardRefs.value.forEach((card) => {
      if (card) card.style.transform = "translateY(0)";
    });
    // Don't continue RAF loop on mobile
    animationFrameId = null;
    return;
  }

  const rect = containerRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Вычисляем прогресс скролла контейнера
  const scrollProgress =
    (viewportHeight / 2 - rect.top - rect.height / 2) /
    (viewportHeight / 2 + rect.height / 2);

  cardRefs.value.forEach((card, index) => {
    if (!card) return;

    const speed = parallaxSpeeds[index] || 0.5;
    const offset = scrollProgress * 100 * speed;

    card.style.transform = `translateY(${offset}px)`;
  });

  animationFrameId = requestAnimationFrame(updateParallax);
};

const startParallax = () => {
  if (!animationFrameId && isInViewport) {
    animationFrameId = requestAnimationFrame(updateParallax);
  }
};

const stopParallax = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

onMounted(() => {
  window.addEventListener("resize", updateIsMobile);

  if (containerRef.value) {
    // Setup IntersectionObserver to only run RAF when in viewport
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInViewport = entry.isIntersecting;
          if (isInViewport) {
            startParallax();
          } else {
            stopParallax();
          }
        });
      },
      {
        rootMargin: "100px 0px", // Start slightly before entering viewport
        threshold: 0,
      }
    );
    observer.observe(containerRef.value);
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", updateIsMobile);
  stopParallax();
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>

<style scoped>
.story-results-2 {
  width: 100%;
  /* Reduced top padding to account for margin from MediaContainer above (48px) */
  /* This creates consistent spacing: 48px (media margin) + 40px (this padding) = 88px total */
  padding: 40px 0 168px;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
}

.results-content {
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
  box-sizing: border-box;
}

.results-intro {
  font-family: var(--font-family-base);
  font-size: 16px;
  font-weight: var(--font-weight-regular);
  line-height: 1.8;
  margin: 0 0 48px 0;
  color: inherit;
  opacity: 0.8;
}

.results-conclusion {
  font-family: var(--font-family-base);
  font-size: 16px;
  font-weight: var(--font-weight-regular);
  line-height: 1.8;
  margin: 48px 0 0 0;
  color: inherit;
  opacity: 0.8;
}

/* Fullscreen wrapper like images */
.results-wrapper {
  width: 100vw;
  position: relative;
  left: 50%;
  margin-left: -50vw;
  padding: 16px;
  box-sizing: border-box;
}

.results-container {
  width: 100%;
  background-color: v-bind(cardBackground);
  border-radius: 12px;
  padding: 48px;
  box-sizing: border-box;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.results-grid {
  display: flex;
  flex-direction: row;
  gap: 128px;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.result-card {
  flex: 0 0 auto;
  width: 450px;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0px 3px 12px
    color-mix(
      in srgb,
      var(--shadow-saturated) var(--shadow-opacity),
      transparent
    );
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 700px;
  will-change: transform;
  transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.result-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px 24px;
  margin-bottom: 0;
  position: relative;
}

.result-card-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 24px;
  right: 24px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
}

.result-label {
  font-family: var(--font-family-base);
  font-size: clamp(12px, 2.4vw, 14px);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--story-subtitle-color, #b14127);
}

.result-icon {
  width: 22px;
  height: 22px;
}

.result-card-inner {
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex: 1;
}

.result-value {
  font-size: clamp(32px, 4vw, 48px);
  font-weight: var(--font-weight-semibold);
  line-height: 1.2;
  color: inherit;
}

.result-value :deep(.rocket-icon) {
  display: inline-block;
  vertical-align: middle;
  margin: 0 12px;
  width: 50px;
  height: 23px;
  transform: translateY(-5px) rotate(-45deg);
  opacity: 0.6;
}

.result-description {
  font-family: var(--font-family-base);
  font-size: 20px;
  font-weight: var(--font-weight-regular);
  line-height: 1.5;
  color: inherit;
  opacity: 0.8;
}

@media (max-width: 900px) {
  .results-grid {
    flex-direction: column;
    gap: 16px;
  }

  .results-container {
    padding: 24px 20px;
    aspect-ratio: auto;
  }

  .result-card {
    width: 100%;
    height: auto;
    min-height: 180px;
    border-radius: 16px;
  }

  .result-card-header {
    padding: 16px 20px 12px 20px;
  }

  .result-card-header::after {
    left: 20px;
    right: 20px;
  }

  .result-card-inner {
    padding: 24px 20px;
    gap: 12px;
  }

  .result-value {
    font-size: clamp(24px, 5vw, 32px);
  }

  .result-value :deep(.rocket-icon) {
    width: 36px;
    height: 16px;
    margin: 0 8px;
    transform: translateY(-5px) rotate(-45deg);
    opacity: 0.6;
  }

  .result-description {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .story-results-2 {
    padding: 60px 0 24px;
  }

  .story-results-title {
    margin-bottom: 16px;
  }

  .results-intro {
    margin-bottom: 32px;
  }

  .results-container {
    padding: 16px 12px;
  }

  .results-grid {
    gap: 12px;
  }

  .result-card {
    width: 100%;
    height: auto;
    min-height: 150px;
    border-radius: 12px;
  }

  .result-card-header {
    padding: 12px 16px 10px 16px;
  }

  .result-card-header::after {
    left: 16px;
    right: 16px;
  }

  .result-card-inner {
    padding: 16px;
    gap: 8px;
  }

  .result-value {
    font-size: clamp(20px, 5vw, 28px);
  }

  .result-value :deep(.rocket-icon) {
    width: 28px;
    height: 12px;
    margin: 0 6px;
    transform: translateY(-5px) rotate(-45deg);
    opacity: 0.6;
  }

  .result-description {
    font-size: 14px;
    line-height: 1.4;
  }
}
</style>
