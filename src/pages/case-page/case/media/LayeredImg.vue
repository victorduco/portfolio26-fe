<template>
  <MediaContainer
    type="fullwidth"
    :background-color="backgroundColor"
    :label="label"
    :overflow="'visible'"
    wrapper-class="layered-cards-wrapper"
    container-class="layered-cards"
  >
    <div class="cards-container" ref="containerRef" :style="{ '--bg-color': backgroundColor, ...shadowVars }">
      <!-- Left card -->
      <div class="card card-left" ref="cardLeftRef">
        <div class="card-inner">
          <img
            :src="imageLeft"
            :alt="altLeft || 'Left card'"
            loading="lazy"
          />
        </div>
      </div>

      <!-- Center card (main) -->
      <div class="card card-center" ref="cardCenterRef">
        <div class="card-inner">
          <img
            :src="imageCenter"
            :alt="altCenter || 'Center card'"
            loading="lazy"
          />
        </div>
      </div>

      <!-- Right card -->
      <div class="card card-right" ref="cardRightRef">
        <div class="card-inner">
          <img
            :src="imageRight"
            :alt="altRight || 'Right card'"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </MediaContainer>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { parallaxSpeeds } from './layeredCardsVariants.js';
import { useAdaptiveShadow } from '@/composables/useAdaptiveShadow.js';
import MediaContainer from './MediaContainer.vue';

const props = defineProps({
  imageLeft: {
    type: String,
    required: true,
  },
  imageCenter: {
    type: String,
    required: true,
  },
  imageRight: {
    type: String,
    required: true,
  },
  altLeft: {
    type: String,
    default: '',
  },
  altCenter: {
    type: String,
    default: '',
  },
  altRight: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  backgroundColor: {
    type: String,
    default: 'transparent',
  },
  speedLeft: {
    type: Number,
    default: null,
  },
  speedCenter: {
    type: Number,
    default: null,
  },
  speedRight: {
    type: Number,
    default: null,
  },
});

const containerRef = ref(null);
const cardLeftRef = ref(null);
const cardCenterRef = ref(null);
const cardRightRef = ref(null);

const shadowVars = computed(() => useAdaptiveShadow());

// Используем кастомные скорости если они переданы, иначе дефолтные из variants
const speeds = computed(() => [
  props.speedLeft ?? parallaxSpeeds[0],
  props.speedCenter ?? parallaxSpeeds[1],
  props.speedRight ?? parallaxSpeeds[2],
]);

let animationFrameId = null;

const updateParallax = () => {
  if (!containerRef.value) return;

  const cards = [
    cardLeftRef.value,
    cardCenterRef.value,
    cardRightRef.value,
  ];

  const rect = containerRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Вычисляем прогресс скролла контейнера
  // -1 когда контейнер внизу экрана, 0 в центре, 1 вверху экрана
  const scrollProgress = (viewportHeight / 2 - rect.top - rect.height / 2) / (viewportHeight / 2 + rect.height / 2);

  cards.forEach((card, index) => {
    if (!card) return;

    const speed = speeds.value[index];
    const offset = scrollProgress * 100 * speed;

    card.style.transform = `translateY(${offset}px)`;
  });

  animationFrameId = requestAnimationFrame(updateParallax);
};

onMounted(() => {
  updateParallax();
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>

.cards-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  transform-style: preserve-3d;
}

.card {
  position: absolute;
  width: 40vw;
  aspect-ratio: 2 / 1.1;
  will-change: transform, opacity;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0px 3px 12px color-mix(in srgb, var(--shadow-saturated) var(--shadow-opacity), transparent);
  transform-origin: center center;
  box-sizing: border-box;
  transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-inner:hover {
  box-shadow: 0px 3px 12px color-mix(in srgb, var(--shadow-saturated) var(--shadow-opacity), transparent);
}

.card-inner img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border-radius: 14px;
}

/* Card 1 - top left */
.card-left {
  left: calc(50% - 45vw);
  top: calc(50% - 35vh);
  z-index: 3;
}

/* Card 2 - middle right */
.card-center {
  left: calc(50% + 5vw);
  top: calc(50% - 25vh);
  z-index: 2;
}

/* Card 3 - bottom center-left */
.card-right {
  left: calc(50% - 25vw);
  top: calc(50% - 10vh);
  z-index: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .card {
    width: 60vw;
  }

  .card-left {
    left: calc(50% - 50vw);
    top: calc(50% - 40vh);
  }

  .card-center {
    left: calc(50% - 5vw);
    top: calc(50% - 27vh);
  }

  .card-right {
    left: calc(50% - 30vw);
    top: calc(50% - 12vh);
  }
}

@media (max-width: 480px) {
  .card {
    width: 70vw;
  }

  .card-left {
    left: calc(50% - 55vw);
    top: calc(50% - 43vh);
  }

  .card-center {
    left: calc(50% - 10vw);
    top: calc(50% - 29vh);
  }

  .card-right {
    left: calc(50% - 35vw);
    top: calc(50% - 13vh);
  }
}
</style>
