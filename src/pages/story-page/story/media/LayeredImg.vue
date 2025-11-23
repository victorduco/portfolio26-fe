<template>
  <!-- Desktop: Layered cards view -->
  <div
    v-if="!isMobile"
    class="cards-container"
    ref="containerRef"
    :style="{ ...shadowVars, ...cardSizeStyles }"
  >
    <!-- Left card (визуально слева) -->
    <div class="card card-left" ref="cardLeftRef" :style="{ zIndex: zIndexLeft }">
      <div class="card-inner">
        <img
          :src="imageLeft"
          :alt="altLeft || 'Left card'"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Center card (визуально в центре) -->
    <div class="card card-center" ref="cardCenterRef" :style="{ zIndex: zIndexRight }">
      <div class="card-inner">
        <img
          :src="imageRight"
          :alt="altRight || 'Center card'"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Right card (визуально справа) -->
    <div class="card card-right" ref="cardRightRef" :style="{ zIndex: zIndexCenter }">
      <div class="card-inner">
        <img
          :src="imageCenter"
          :alt="altCenter || 'Right card'"
          loading="lazy"
        />
      </div>
    </div>
  </div>

  <!-- Mobile: Slider view -->
  <div
    v-else
    class="slider-container"
    :style="cardSizeStyles"
  >
    <div
      class="slider-track"
      ref="sliderTrackRef"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      :class="{ dragging: isDragging }"
      :style="{ transform: `translateX(${sliderOffset}px)` }"
    >
      <div class="slider-slide">
        <div class="slide-inner" :style="shadowVars">
          <img
            :src="imageLeft"
            :alt="altLeft || 'Image 1'"
            loading="lazy"
          />
        </div>
      </div>
      <div class="slider-slide">
        <div class="slide-inner" :style="shadowVars">
          <img
            :src="imageRight"
            :alt="altRight || 'Image 2'"
            loading="lazy"
          />
        </div>
      </div>
      <div class="slider-slide">
        <div class="slide-inner" :style="shadowVars">
          <img
            :src="imageCenter"
            :alt="altCenter || 'Image 3'"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <!-- Dots indicator -->
    <div class="slider-dots">
      <button
        v-for="(_, index) in 3"
        :key="index"
        class="slider-dot"
        :class="{ active: currentSlide === index }"
        @click="goToSlide(index)"
        :aria-label="`Go to slide ${index + 1}`"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { parallaxSpeeds } from './layeredCardsVariants.js';
import { useAdaptiveShadow } from '@/composables/useAdaptiveShadow.js';

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
  zIndexLeft: {
    type: Number,
    default: 3,
  },
  zIndexCenter: {
    type: Number,
    default: 2,
  },
  zIndexRight: {
    type: Number,
    default: 1,
  },
  containRatioWidth: {
    type: Number,
    default: null,
  },
  containRatioHeight: {
    type: Number,
    default: null,
  },
  borderRadius: {
    type: Number,
    default: 24,
  },
});

// Mobile detection
const isMobile = ref(false);
const MOBILE_BREAKPOINT = 767;

const checkMobile = () => {
  isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT;
};

// Watch for mobile mode changes to recalculate slide width
watch(isMobile, (newValue) => {
  if (newValue) {
    nextTick(() => {
      updateSlideWidth();
    });
  }
});

// Desktop parallax refs
const containerRef = ref(null);
const cardLeftRef = ref(null);
const cardCenterRef = ref(null);
const cardRightRef = ref(null);

// Mobile slider state
const sliderTrackRef = ref(null);
const currentSlide = ref(0);
const dragOffset = ref(0);
const touchStartX = ref(0);
const touchCurrentX = ref(0);
const isDragging = ref(false);
const slideWidth = ref(0);
const GAP = 16; // gap between slides in px

// Computed slider offset
const sliderOffset = computed(() => {
  const baseOffset = -(currentSlide.value * (slideWidth.value + GAP));
  return baseOffset + dragOffset.value;
});

// Update slide width on resize
const updateSlideWidth = () => {
  if (sliderTrackRef.value) {
    const firstSlide = sliderTrackRef.value.querySelector('.slider-slide');
    if (firstSlide) {
      slideWidth.value = firstSlide.offsetWidth;
    }
  }
};

const shadowVars = computed(() => useAdaptiveShadow());

// Desktop parallax speeds
const speeds = computed(() => [
  props.speedLeft ?? parallaxSpeeds[0],
  props.speedCenter ?? parallaxSpeeds[1],
  props.speedRight ?? parallaxSpeeds[2],
]);

// Border-radius styles
const cardSizeStyles = computed(() => {
  return {
    '--card-border-radius': `${props.borderRadius}px`,
  };
});

// Mobile slider methods
const goToSlide = (index) => {
  currentSlide.value = index;
};

const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX;
  touchCurrentX.value = e.touches[0].clientX;
  isDragging.value = true;
};

const handleTouchMove = (e) => {
  if (!isDragging.value) return;
  touchCurrentX.value = e.touches[0].clientX;
  dragOffset.value = touchCurrentX.value - touchStartX.value;
};

const handleTouchEnd = () => {
  if (!isDragging.value) return;
  isDragging.value = false;

  const threshold = 50;
  const diff = touchCurrentX.value - touchStartX.value;

  if (diff < -threshold && currentSlide.value < 2) {
    currentSlide.value++;
  } else if (diff > threshold && currentSlide.value > 0) {
    currentSlide.value--;
  }

  dragOffset.value = 0;
};

// Desktop parallax animation
let animationFrameId = null;

const updateParallax = () => {
  if (!containerRef.value || isMobile.value) return;

  // Массив карточек в порядке слева-направо (визуально)
  const cards = [
    cardLeftRef.value,    // Левая карточка - speeds[0] = 0.2
    cardCenterRef.value,  // Центральная карточка - speeds[1] = 1.0
    cardRightRef.value,   // Правая карточка - speeds[2] = 2.5
  ];

  const rect = containerRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const containerTop = rect.top;
  const scrollProgress = (viewportHeight - containerTop) / (viewportHeight + rect.height);
  const centeredProgress = scrollProgress - 0.5;

  cards.forEach((card, index) => {
    if (!card) return;

    const speed = speeds.value[index];
    const maxMovement = 60;
    const offset = centeredProgress * maxMovement * speed;

    card.style.transform = `translateY(${offset}px)`;
  });

  animationFrameId = requestAnimationFrame(updateParallax);
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  window.addEventListener('resize', updateSlideWidth);

  if (!isMobile.value) {
    updateParallax();
  } else {
    // Wait for DOM to render, then calculate slide width
    requestAnimationFrame(() => {
      updateSlideWidth();
    });
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  window.removeEventListener('resize', updateSlideWidth);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
/* Desktop: Layered cards */
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
  will-change: transform, opacity;
}

.card-inner {
  position: relative;
  width: 100%;
  border-radius: var(--card-border-radius, 24px);
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
  height: auto;
  display: block;
  border-radius: var(--card-border-radius, 24px);
}

/* Card positions */
.card-left {
  left: calc(50% - 45vw);
  top: calc(50% - 35vh);
}

.card-center {
  left: calc(50% - 25vw);
  top: calc(50% - 10vh);
}

.card-right {
  left: calc(50% + 5vw);
  top: calc(50% - 25vh);
}

/* Tablet adjustments */
@media (min-width: 768px) and (max-width: 1024px) {
  .card {
    width: 50vw;
  }

  .card-left {
    left: calc(50% - 50vw);
    top: calc(50% - 38vh);
  }

  .card-center {
    left: calc(50% - 30vw);
    top: calc(50% - 12vh);
  }

  .card-right {
    left: calc(50% - 0vw);
    top: calc(50% - 26vh);
  }
}

/* Mobile: Slider */
.slider-container {
  width: 100%;
  overflow: hidden;
  padding: 16px 24px 32px;
}

.slider-track {
  display: flex;
  gap: 16px;
  transition: transform 0.3s ease-out;
  touch-action: pan-x;
  user-select: none;
}

.slider-track.dragging {
  transition: none;
}

.slider-slide {
  flex: 0 0 100%;
  min-width: 100%;
}

.slide-inner {
  width: 100%;
  border-radius: var(--card-border-radius, 16px);
  overflow: hidden;
  box-shadow: 0px 3px 12px color-mix(in srgb, var(--shadow-saturated) var(--shadow-opacity), transparent);
}

.slide-inner img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: var(--card-border-radius, 16px);
}

/* Dots indicator */
.slider-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.slider-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background-color: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  padding: 0;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.slider-dot.active {
  background-color: #000000;
}

.slider-dot:hover {
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
