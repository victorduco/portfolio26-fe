<template>
  <section class="intro-hero" id="intro-text-export-node">
    <div class="intro-hero__title">
      <Motion
        tag="h1"
        class="h1"
        :variants="titleVariants"
        :animate="titleState"
        :transition="titleTransition"
        :initial="'hidden'"
      >
        Victor Diukov
      </Motion>
      <Motion
        tag="p"
        class="body1"
        :variants="subtitleVariants"
        :animate="subtitleState"
        :transition="subtitleTransition"
        :initial="'hidden'"
      >
        Currently designing for&nbsp;Apple. Bringing experience
        from&nbsp;large&#8209;scale B2B&nbsp;&&nbsp;FinTech products
        with&nbsp;a&nbsp;background in&nbsp;product&nbsp;management.
      </Motion>
    </div>
    <Motion
      tag="div"
      class="intro-scroll-hint"
      :variants="scrollHintVariants"
      :animate="scrollHintState"
      :transition="scrollHintTransition"
      :initial="'hidden'"
    >
      <span class="intro-scroll-hint-content">
        <img
          :src="storyNavIcon"
          alt=""
          aria-hidden="true"
          class="intro-scroll-hint-icon"
        />
        <span class="intro-scroll-hint-text">Scroll to Story One</span>
      </span>
    </Motion>
  </section>

  <ul class="intro-list">
    <IntroRectangle
      v-for="(_, index) in rects"
      :key="index"
      :index="index"
      :active-count="activeCount"
      :intro-visible="showRectangles"
      :force-close="forceCloseAll"
      :should-animate="rectangleStates[index]"
      @active-change="handleActiveChange"
    />
  </ul>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { Motion } from "motion-v";
import IntroRectangle from "./IntroRectangle.vue";
import storyNavIcon from "@/assets/icons/headphones.svg";

const props = defineProps({
  introVisible: {
    type: Boolean,
    default: false,
  },
});

const rects = Array(4).fill(null);
const activeCount = ref(0);
const forceCloseAll = ref(false); // Флаг для принудительного закрытия

// Состояния анимации
const titleState = ref("hidden");
const subtitleState = ref("hidden");
const rectangleStates = ref([false, false, false, false]); // Индивидуальные состояния для каждого rectangle
const showRectangles = ref(false);
const scrollHintState = ref("hidden");

// Shared animation variants
const sharedVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const titleVariants = sharedVariants;
const subtitleVariants = sharedVariants;
const scrollHintVariants = sharedVariants;

// Shared transition base config
const baseTransition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1],
};

// Transition конфиги
const titleTransition = {
  ...baseTransition,
  duration: 0.6,
};

const subtitleTransition = {
  ...baseTransition,
  duration: 0.5,
};

const scrollHintTransition = {
  ...baseTransition,
  duration: 0.4,
};

// Ease-in-out функция для плавного изменения скорости
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Последовательная анимация при появлении intro
watch(
  () => props.introVisible,
  async (newVal) => {
    if (!newVal) {
      // Reset animations when intro becomes invisible
      titleState.value = "hidden";
      subtitleState.value = "hidden";
      rectangleStates.value = [false, false, false, false];
      showRectangles.value = false;
      scrollHintState.value = "hidden";
      return;
    }

    // Общее количество шагов: Title, Subtitle, 4 Rectangle, ScrollHint = 7 шагов
    const totalSteps = 7;

    // Базовые задержки: медленный старт и конец (400ms), середина (250ms)
    const minDelay = 250;
    const maxDelay = 400;

    function getDelay(stepIndex) {
      const progress = stepIndex / (totalSteps - 1);
      const eased = easeInOutCubic(progress);
      // Инвертируем easing: в начале и конце медленно (большие задержки), в середине быстро (маленькие задержки)
      return maxDelay - eased * (maxDelay - minDelay);
    }

    // 1. Заголовок
    titleState.value = "visible";
    await new Promise((resolve) => setTimeout(resolve, getDelay(0)));

    // 2. Подзаголовок
    subtitleState.value = "visible";
    await new Promise((resolve) => setTimeout(resolve, getDelay(1)));

    // 3-6. Прямоугольники по одному
    showRectangles.value = true;
    for (let i = 0; i < 4; i++) {
      rectangleStates.value[i] = true;
      await new Promise((resolve) => setTimeout(resolve, getDelay(2 + i)));
    }

    // 7. Scroll hint
    scrollHintState.value = "visible";
  },
  { immediate: true }
);

function handleActiveChange(isActive) {
  activeCount.value += isActive ? 1 : -1;
}

// Отслеживаем скролл и сбрасываем квадраты при уходе из viewport
let observer = null;

onMounted(() => {
  const introSection = document.getElementById("intro-text-export-node");
  if (introSection) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Если секция полностью ушла из viewport
          if (!entry.isIntersecting && activeCount.value > 0) {
            // Принудительно закрываем все квадраты одновременно с анимацией
            forceCloseAll.value = true;
          } else if (entry.isIntersecting) {
            // Когда возвращаемся - снимаем блокировку
            forceCloseAll.value = false;
          }
        });
      },
      {
        threshold: 0.1, // Триггерим когда меньше 10% видно
      }
    );

    observer.observe(introSection);
  }
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<style scoped>
.intro-hero {
  position: relative;
  display: grid;

  align-content: center;
  justify-items: start;
  width: 100%;
  height: 100vh;
  padding-block: clamp(40px, 10vh, 96px);
  padding-inline-start: clamp(24px, 8vw, 120px);
  padding-inline-end: clamp(16px, 4vw, 48px);
  box-sizing: border-box;
  overflow: visible;
  grid-template-columns: repeat(auto-fill, min-content);
}

.intro-hero__title {
  max-width: 880px;
  display: grid;
  gap: 24px;
  position: relative;
  z-index: 1;
  margin-bottom: 22vh;
  anchor-name: --title;
  place-items: start start;
}

.intro-list {
  position: absolute;
  /* Fallback for browsers without anchor support */

  /* Anchor positioning for supported browsers */
  position-anchor: --title;
  top: anchor(bottom);

  display: grid;
  /* Base (mobile): 2x2 grid */

  max-width: 100%;
  max-height: 100%;
  place-items: center start;

  padding: 0;
  list-style: none;
  pointer-events: auto;
  z-index: 5;

  /* Desktop: 4 columns horizontal layout with gap columns */
  grid-template-columns:
    fit-content(100px) clamp(40px, 6vw, 80px)
    fit-content(100px) clamp(40px, 6vw, 80px)
    fit-content(100px) clamp(40px, 6vw, 80px)
    fit-content(100px);
  /* 2 rows: верх и низ */
  grid-template-rows:
    0px /* row 1: четные прибиты к верху */
    0px; /* row 2: нечетные прибиты к низу */
  row-gap: 0;
  column-gap: -500px;

  /* Центрирование для роста в обе стороны */
  left: clamp(32px, 12vw, 120px);
  top: 50%;
  transform: translateY(-50%);
  margin-top: 64px;
}

.intro-scroll-hint {
  position: absolute;
  bottom: max(32px, calc(env(safe-area-inset-bottom) + 16px));
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.02em;
  text-align: center;
  pointer-events: none;
  white-space: nowrap;
  z-index: 2;
}

.intro-scroll-hint-content {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.intro-scroll-hint-icon {
  width: 14px;
  height: 14px;
  display: block;
  pointer-events: none;
  opacity: 0.67;
}

@media (min-width: 900px) {
  .intro-list {
  }
}
</style>
