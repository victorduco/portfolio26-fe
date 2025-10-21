<template>
  <section
    class="ai-play-hero"
    :class="{ 'dark-mode': darkMode, 'light-mode': !darkMode }"
  >
    <!-- Floating images -->
    <div class="floating-images">
      <motion.div
        v-for="(item, index) in floatingItems"
        :key="index"
        :class="['float-img', `float-img-${index + 1}`, { active: activeIndex === index, 'any-hovered': anyHovered }]"
        :variants="diamondVariants"
        :animate="getAnimationState(index)"
        initial="default"
        :transition="spring"
        @mouseenter="() => { console.log('[AiPlay] mouseenter event on item', index); handleHover(index, true); }"
        @mouseleave="() => { console.log('[AiPlay] mouseleave event on item', index); handleHover(index, false); }"
        @click="handleClick(index)"
      >
        <div class="diamond-shape">
          <motion.div
            class="diamond-shape-color"
            :style="{
              backgroundColor: item.color,
            }"
            :variants="diamondShapeVariants"
            :animate="getAnimationState(index)"
            initial="default"
            :transition="spring"
          />
          <motion.div
            class="plant-icon-wrapper"
            :initial="{ rotate: -45 + item.rotation }"
            :animate="{ rotate: -45 + item.rotation }"
            :transition="spring"
          >
            <component
              :is="getCurrentIcon(item, getAnimationState(index))"
              :size="item.iconSize"
              :color="getIconColor(getAnimationState(index))"
              class="plant-icon"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>

    <div class="ai-play__title">
      <h1 class="h1">AI Playground</h1>
      <p class="body1">
        Building my own AI system for fun, exploring how agents think and act. Experimenting with neural networks and machine learning patterns.
      </p>
      <a
        href="https://github.com/viktordiukov"
        target="_blank"
        rel="noopener noreferrer"
        class="body1 ai-play__link"
        aria-label="View GitHub Repository"
      >
        View Repository →
      </a>
    </div>
  </section>
</template>

<script setup>
import { ref, onUnmounted, watch, computed } from 'vue';
import { motion } from 'motion-v';
import { Leaf, Flower2, Sprout, TreePine, Palmtree, Flower } from 'lucide-vue-next';
import {
  spring,
  diamondVariants,
  diamondShapeVariants,
} from './aiPlayVariants.js';

defineProps({
  darkMode: {
    type: Boolean,
    default: true,
  },
});

// Random placeholder images (using picsum.photos)
const floatingItems = [
  {
    icon: Leaf,
    defaultIcon: Leaf, // все показывают Leaf по умолчанию
    color: '#27A9FF',
    image: 'https://picsum.photos/seed/ai1/400/400',
    iconSize: 40, // базовый размер (100-170px)
    rotation: 0, // 0 градусов
  },
  {
    icon: Flower2,
    defaultIcon: Leaf,
    color: '#FF83A2',
    image: 'https://picsum.photos/seed/ai2/400/400',
    iconSize: 32, // 85-135px (~80% от базового)
    rotation: 45, // 45 градусов
  },
  {
    icon: Sprout,
    defaultIcon: Leaf,
    color: '#00FFBC',
    image: 'https://picsum.photos/seed/ai3/400/400',
    iconSize: 36, // 95-155px (~91% от базового)
    rotation: 90, // 90 градусов
  },
  {
    icon: Palmtree,
    defaultIcon: Leaf,
    color: '#FFFF78',
    image: 'https://picsum.photos/seed/ai4/400/400',
    iconSize: 45, // 120-190px (~112% от базового)
    rotation: 135, // 135 градусов
  },
  {
    icon: TreePine,
    defaultIcon: Leaf,
    color: '#27A9FF',
    image: 'https://picsum.photos/seed/ai5/400/400',
    iconSize: 42, // 110-180px (~106% от базового)
    rotation: 180, // 180 градусов
  },
  {
    icon: Flower,
    defaultIcon: Leaf,
    color: '#FF83A2',
    image: 'https://picsum.photos/seed/ai6/400/400',
    iconSize: 30, // 75-130px (~76% от базового)
    rotation: 225, // 225 градусов
  },
];

const activeIndex = ref(-1);
const anyHovered = ref(false);
let autoCloseTimer = null;

// Создаем computed массив состояний анимации для всех элементов
const animationStates = computed(() => {
  return floatingItems.map((_, index) => {
    const state = activeIndex.value === index
      ? 'active'
      : anyHovered.value
        ? 'groupHover'
        : 'default';

    console.log(`[AiPlay] computed animationStates[${index}]:`, {
      activeIndex: activeIndex.value,
      anyHovered: anyHovered.value,
      resultState: state
    });

    return state;
  });
});

function getAnimationState(index) {
  return animationStates.value[index];
}

// Функция для получения иконки в зависимости от состояния
function getCurrentIcon(item, state) {
  return state === 'groupHover' || state === 'active' ? item.icon : item.defaultIcon;
}

// Функция для получения цвета иконки в зависимости от состояния
function getIconColor(state) {
  return state === 'groupHover' || state === 'active' ? '#000000' : '#999999';
}

function handleHover(index, isHovering) {
  console.log('[AiPlay] handleHover called:', {
    index,
    isHovering,
    currentActiveIndex: activeIndex.value,
    currentAnyHovered: anyHovered.value
  });

  // Don't show hover if item is active
  if (activeIndex.value === index) {
    console.log('[AiPlay] Ignoring hover - item is active');
    return;
  }

  anyHovered.value = isHovering;
  console.log('[AiPlay] State updated - anyHovered:', anyHovered.value);
}

function handleClick(index) {
  console.log('[AiPlay] Click:', index);
  // Clear any existing timer
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }

  // If clicking the same item, close it
  if (activeIndex.value === index) {
    activeIndex.value = -1;
    return;
  }

  // Close previous, open new
  activeIndex.value = index;

  // Auto-close after 3 seconds
  autoCloseTimer = setTimeout(() => {
    activeIndex.value = -1;
    autoCloseTimer = null;
  }, 3000);
}

// Watchers for debugging
watch(anyHovered, (newVal, oldVal) => {
  console.log('[AiPlay] anyHovered changed:', oldVal, '->', newVal);
});

watch(activeIndex, (newVal, oldVal) => {
  console.log('[AiPlay] activeIndex changed:', oldVal, '->', newVal);
});

onUnmounted(() => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
  }
});
</script>

<style scoped>
.ai-play-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  padding: clamp(24px, 4vw, 48px);
  box-sizing: border-box;
  overflow: hidden;
}

/* Floating images container */
.floating-images {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.float-img {
  position: absolute;
  will-change: transform;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.15));
  cursor: pointer;
}

.diamond-shape {
  width: 100%;
  height: 100%;
  border-radius: 26px;
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #171717;
  border: 2px solid #222;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.diamond-shape-color {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
}

.plant-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.plant-icon {
  flex-shrink: 0;
}

.diamond-image-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 26px;
  transform: rotate(45deg);
  overflow: hidden;
  pointer-events: none;
}

.diamond-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: rotate(-45deg) scale(1.42);
}

/* Individual positioning and animation for each image */
/* Semi-random positioning - balanced between grid and chaos */
.float-img-1 {
  width: clamp(100px, 13vw, 170px);
  height: clamp(100px, 13vw, 170px);
  top: 10%;
  left: 14%;
}

.float-img-1:not(:hover):not(.active):not(.any-hovered) {
  animation: float1 8s ease-in-out infinite;
}

.float-img-2 {
  width: clamp(85px, 10vw, 135px);
  height: clamp(85px, 10vw, 135px);
  top: 18%;
  right: 15%;
}

.float-img-2:not(:hover):not(.active):not(.any-hovered) {
  animation: float2 10s ease-in-out infinite;
}

.float-img-3 {
  width: clamp(95px, 11vw, 155px);
  height: clamp(95px, 11vw, 155px);
  top: 12%;
  left: 42%;
}

.float-img-3:not(:hover):not(.active):not(.any-hovered) {
  animation: float3 9s ease-in-out infinite;
}

.float-img-4 {
  width: clamp(120px, 15vw, 190px);
  height: clamp(120px, 15vw, 190px);
  bottom: 15%;
  left: 10%;
}

.float-img-4:not(:hover):not(.active):not(.any-hovered) {
  animation: float4 11s ease-in-out infinite;
}

.float-img-5 {
  width: clamp(110px, 14vw, 180px);
  height: clamp(110px, 14vw, 180px);
  bottom: 12%;
  right: 10%;
}

.float-img-5:not(:hover):not(.active):not(.any-hovered) {
  animation: float5 7.5s ease-in-out infinite;
}

.float-img-6 {
  width: clamp(75px, 9vw, 130px);
  height: clamp(75px, 9vw, 130px);
  bottom: 18%;
  right: 38%;
}

.float-img-6:not(:hover):not(.active):not(.any-hovered) {
  animation: float6 9.5s ease-in-out infinite;
}

/* Floating animations with different patterns */
@keyframes float1 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(15px, -20px) rotate(5deg);
  }
  50% {
    transform: translate(-10px, -15px) rotate(-3deg);
  }
  75% {
    transform: translate(10px, -25px) rotate(4deg);
  }
}

@keyframes float2 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(-20px, 15px) rotate(-6deg);
  }
  66% {
    transform: translate(-15px, -10px) rotate(4deg);
  }
}

@keyframes float3 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  30% {
    transform: translate(20px, 10px) rotate(7deg);
  }
  60% {
    transform: translate(-15px, 15px) rotate(-5deg);
  }
}

@keyframes float4 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  40% {
    transform: translate(-25px, -10px) rotate(-4deg);
  }
  80% {
    transform: translate(20px, -15px) rotate(6deg);
  }
}

@keyframes float5 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  35% {
    transform: translate(15px, 20px) rotate(5deg);
  }
  70% {
    transform: translate(-20px, 10px) rotate(-7deg);
  }
}

@keyframes float6 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(-10px, 15px) rotate(-3deg);
  }
  50% {
    transform: translate(15px, -20px) rotate(4deg);
  }
  75% {
    transform: translate(-15px, -10px) rotate(-5deg);
  }
}

.ai-play__title {
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  position: relative;
  z-index: 2;
  text-align: center;
  padding: clamp(24px, 4vw, 48px);
  pointer-events: none;
}

.ai-play__title > * {
  pointer-events: auto;
}

.ai-play__link {
  text-decoration: none;
  transition: color 0.2s ease;
  margin: 0;
}

.ai-play__link:hover {
  color: var(--color-text-primary);
}

/* Hide or reduce floating images on mobile */
@media (max-width: 899px) {
  .floating-images {
    opacity: 0.5;
  }

  .float-img-3,
  .float-img-6 {
    display: none;
  }

  .float-img-1 {
    width: 70px;
    height: 70px;
    top: 8%;
    left: 5%;
  }

  .float-img-2 {
    width: 65px;
    height: 65px;
    top: 12%;
    right: 5%;
  }

  .float-img-4 {
    width: 75px;
    height: 75px;
    bottom: 8%;
    left: 5%;
  }

  .float-img-5 {
    width: 70px;
    height: 70px;
    bottom: 12%;
    right: 5%;
  }

  .ai-play__title {
    gap: 16px;
    padding: clamp(16px, 3vw, 24px);
  }
}

/* Mobile landscape: minimal floating images */
@media (max-width: 767px) and (orientation: landscape) {
  .floating-images {
    opacity: 0.3;
  }

  .ai-play__title {
    gap: 12px;
  }
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .float-img {
    animation: none;
  }
}
</style>
