<template>
  <!-- Desktop: Layered cards view -->
  <div v-if="!isMobile" class="cards-container" ref="containerRef" :style="{ ...shadowVars, ...cardSizeStyles }">
    <div v-for="card in cards" :key="card.position" class="card" :class="`card-${card.position}`" :ref="el => card.ref.value = el" :style="{ zIndex: card.zIndex }">
      <div class="card-inner">
        <img :src="card.image" :alt="card.alt || `${card.position} card`" loading="lazy" />
      </div>
    </div>
  </div>

  <!-- Mobile: Slider view -->
  <div v-else class="slider-container" :style="cardSizeStyles">
    <div class="slider-track" ref="sliderTrackRef" @touchstart="touch.start" @touchmove="touch.move" @touchend="touch.end" :class="{ dragging: slider.isDragging }" :style="{ transform: `translateX(${-(slider.current * (slider.width + GAP)) + slider.dragOffset}px)` }">
      <div v-for="card in cards" :key="card.position" class="slider-slide">
        <div class="slide-inner" :style="shadowVars">
          <img :src="card.image" :alt="card.alt || `Image ${card.position}`" loading="lazy" />
        </div>
      </div>
    </div>
    <div class="slider-dots">
      <button v-for="(_, i) in 3" :key="i" class="slider-dot" :class="{ active: slider.current === i }" @click="slider.current = i" :aria-label="`Go to slide ${i + 1}`" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick, reactive } from 'vue';
import { parallaxSpeeds } from './layeredCardsVariants.js';
import { useAdaptiveShadow } from '@/composables/useAdaptiveShadow.js';

const props = defineProps({
  imageLeft: { type: String, required: true },
  imageCenter: { type: String, required: true },
  imageRight: { type: String, required: true },
  altLeft: { type: String, default: '' },
  altCenter: { type: String, default: '' },
  altRight: { type: String, default: '' },
  speedLeft: { type: Number, default: null },
  speedCenter: { type: Number, default: null },
  speedRight: { type: Number, default: null },
  zIndexLeft: { type: Number, default: 3 },
  zIndexCenter: { type: Number, default: 2 },
  zIndexRight: { type: Number, default: 1 },
  borderRadius: { type: Number, default: 24 },
});

const isMobile = ref(false);
const MOBILE_BREAKPOINT = 767;
const GAP = 16;

const checkMobile = () => { isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT; };

// Desktop refs
const containerRef = ref(null);
const cardLeftRef = ref(null);
const cardCenterRef = ref(null);
const cardRightRef = ref(null);

// Cards data array (reused for both desktop and mobile)
const cards = computed(() => [
  { position: 'left', ref: cardLeftRef, image: props.imageLeft, alt: props.altLeft, zIndex: props.zIndexLeft, speed: props.speedLeft ?? parallaxSpeeds[0] },
  { position: 'center', ref: cardCenterRef, image: props.imageCenter, alt: props.altCenter, zIndex: props.zIndexCenter, speed: props.speedCenter ?? parallaxSpeeds[1] },
  { position: 'right', ref: cardRightRef, image: props.imageRight, alt: props.altRight, zIndex: props.zIndexRight, speed: props.speedRight ?? parallaxSpeeds[2] },
]);

// Mobile slider state
const sliderTrackRef = ref(null);
const slider = reactive({ current: 0, dragOffset: 0, isDragging: false, width: 0 });
const touchState = reactive({ startX: 0, currentX: 0 });

const updateSlideWidth = () => {
  if (sliderTrackRef.value) {
    const firstSlide = sliderTrackRef.value.querySelector('.slider-slide');
    if (firstSlide) slider.width = firstSlide.offsetWidth;
  }
};

const shadowVars = computed(() => useAdaptiveShadow());
const cardSizeStyles = computed(() => ({ '--card-border-radius': `${props.borderRadius}px` }));

// Touch handlers
const touch = {
  start: (e) => {
    touchState.startX = touchState.currentX = e.touches[0].clientX;
    slider.isDragging = true;
  },
  move: (e) => {
    if (!slider.isDragging) return;
    touchState.currentX = e.touches[0].clientX;
    slider.dragOffset = touchState.currentX - touchState.startX;
  },
  end: () => {
    if (!slider.isDragging) return;
    slider.isDragging = false;
    const diff = touchState.currentX - touchState.startX;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      slider.current = Math.max(0, Math.min(2, slider.current + (diff < 0 ? 1 : -1)));
    }
    slider.dragOffset = 0;
  }
};

// Desktop parallax with IntersectionObserver
let animationFrameId = null;
let isInViewport = false;
let observer = null;

const updateParallax = () => {
  if (!containerRef.value || isMobile.value || !isInViewport) {
    animationFrameId = null;
    return;
  }

  const rect = containerRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const scrollProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
  const centeredProgress = scrollProgress - 0.5;

  cards.value.forEach((card) => {
    if (!card.ref.value) return;
    const offset = centeredProgress * 60 * card.speed;
    card.ref.value.style.transform = `translateY(${offset}px)`;
  });

  animationFrameId = requestAnimationFrame(updateParallax);
};

const startParallax = () => {
  if (!animationFrameId && !isMobile.value && isInViewport) {
    animationFrameId = requestAnimationFrame(updateParallax);
  }
};

const stopParallax = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

watch(isMobile, (newValue) => {
  if (newValue) nextTick(updateSlideWidth);
});

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  window.addEventListener('resize', updateSlideWidth);

  if (!isMobile.value && containerRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInViewport = entry.isIntersecting;
          if (isInViewport) startParallax();
          else stopParallax();
        });
      },
      { rootMargin: '100px 0px', threshold: 0 }
    );
    observer.observe(containerRef.value);
  } else if (isMobile.value) {
    requestAnimationFrame(updateSlideWidth);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  window.removeEventListener('resize', updateSlideWidth);
  stopParallax();
  if (observer) {
    observer.disconnect();
    observer = null;
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
  will-change: transform, opacity;
}

.card-inner, .slide-inner {
  position: relative;
  width: 100%;
  border-radius: var(--card-border-radius, 24px);
  overflow: hidden;
  box-shadow: 0px 3px 12px color-mix(in srgb, var(--shadow-saturated) var(--shadow-opacity), transparent);
  transform-origin: center center;
  box-sizing: border-box;
  transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-inner img, .slide-inner img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: var(--card-border-radius, 24px);
}

.card-left { left: calc(50% - 45vw); top: calc(50% - 35vh); }
.card-center { left: calc(50% - 25vw); top: calc(50% - 10vh); }
.card-right { left: calc(50% + 5vw); top: calc(50% - 25vh); }

@media (min-width: 768px) and (max-width: 1024px) {
  .card { width: 50vw; }
  .card-left { left: calc(50% - 50vw); top: calc(50% - 38vh); }
  .card-center { left: calc(50% - 30vw); top: calc(50% - 12vh); }
  .card-right { left: calc(50% - 0vw); top: calc(50% - 26vh); }
}

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

.slider-track.dragging { transition: none; }

.slider-slide {
  flex: 0 0 100%;
  min-width: 100%;
}

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

.slider-dot.active { background-color: #000000; }
.slider-dot:hover { background-color: rgba(0, 0, 0, 0.4); }
</style>
