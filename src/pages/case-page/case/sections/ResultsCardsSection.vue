<template>
  <section class="case-results-2">
    <div class="results-content">
      <h3 class="case-results-title">Results</h3>
      <p class="results-intro">
        {{ introText }}
      </p>
      <div class="results-wrapper" ref="containerRef">
        <div class="results-container" :style="{ '--bg-color': cardBackground, ...shadowVars }">
          <div class="results-grid">
            <div
              v-for="(result, index) in results"
              :key="index"
              :ref="el => cardRefs[index] = el"
              class="result-card"
            >
              <div class="result-card-header">
                <div class="result-label">{{ result.label }}</div>
                <div v-if="result.icon" class="result-icon">{{ result.icon }}</div>
              </div>
              <div class="result-card-inner">
                <div class="result-value" v-html="formatTitle(result.title)"></div>
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useAdaptiveShadow } from '@/composables/useAdaptiveShadow.js';

// Скорости параллакса для каждой карточки
const parallaxSpeeds = [0.5, 1.0];

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
      return value.every(result =>
        typeof result === 'object' &&
        'title' in result &&
        'description' in result
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
    default: '#F7E7E7',
  },
});

const formatTitle = (title) => {
  return title.replace(/→/g, '<span class="arrow">➔</span>');
};

const shadowVars = computed(() => useAdaptiveShadow());

const containerRef = ref(null);
const cardRefs = ref([]);

let animationFrameId = null;

const updateParallax = () => {
  if (!containerRef.value) return;

  // На мобильных отключаем параллакс
  if (isMobile.value) {
    cardRefs.value.forEach((card) => {
      if (card) card.style.transform = 'translateY(0)';
    });
    animationFrameId = requestAnimationFrame(updateParallax);
    return;
  }

  const rect = containerRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Вычисляем прогресс скролла контейнера
  const scrollProgress = (viewportHeight / 2 - rect.top - rect.height / 2) / (viewportHeight / 2 + rect.height / 2);

  cardRefs.value.forEach((card, index) => {
    if (!card) return;

    const speed = parallaxSpeeds[index] || 0.5;
    const offset = scrollProgress * 100 * speed;

    card.style.transform = `translateY(${offset}px)`;
  });

  animationFrameId = requestAnimationFrame(updateParallax);
};

onMounted(() => {
  window.addEventListener('resize', updateIsMobile);
  updateParallax();
});

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
.case-results-2 {
  width: 100%;
  padding: 80px 0 48px;
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
  box-shadow: 0px 3px 12px color-mix(in srgb, var(--shadow-saturated) var(--shadow-opacity), transparent);
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
  content: '';
  position: absolute;
  bottom: 0;
  left: 24px;
  right: 24px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
}

.result-label {
  font-family: var(--font-family-base);
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: inherit;
  opacity: 0.6;
}

.result-icon {
  font-size: 32px;
  line-height: 1;
  opacity: 0.5;
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
  font-family: var(--case-title-font, var(--font-family-base));
  font-size: clamp(32px, 4vw, 48px);
  font-weight: var(--font-weight-semibold);
  line-height: 1.2;
  color: inherit;
}

.result-value :deep(.arrow) {
  opacity: 0.3;
  font-weight: var(--font-weight-regular);
  margin: 0 6px;
  font-size: 1.1em;
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
    gap: 24px;
  }

  .results-container {
    padding: 32px 24px;
    aspect-ratio: auto;
  }
}


@media (max-width: 768px) {
  .case-results-2 {
    padding: 60px 0 24px;
  }

  .case-results-title {
    margin-bottom: 16px;
  }

  .results-intro {
    margin-bottom: 32px;
  }

  .results-container {
    padding: 24px 20px;
  }

  .result-card {
    width: 100%;
    height: auto;
    min-height: 200px;
  }

  .result-description {
    font-size: 18px;
  }
}
</style>
