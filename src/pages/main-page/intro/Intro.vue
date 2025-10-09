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
        Rectangles That Rules Numbers
      </Motion>
      <Motion
        tag="p"
        class="body1"
        :variants="subtitleVariants"
        :animate="subtitleState"
        :transition="subtitleTransition"
        :initial="'hidden'"
      >
        This is story of me and how UX can change things around us. Something
        else to write here.
      </Motion>
    </div>
  </section>

  <Motion
    tag="ul"
    class="intro-list"
    :variants="rectanglesVariants"
    :animate="rectanglesState"
    :transition="rectanglesTransition"
    :initial="'hidden'"
  >
    <IntroRectangle
      v-for="(_, index) in rects"
      :key="index"
      :index="index"
      :active-count="activeCount"
      :intro-visible="showRectangles"
      :force-close="forceCloseAll"
      @active-change="handleActiveChange"
    />
  </Motion>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { Motion } from "motion-v";
import IntroRectangle from "./IntroRectangle.vue";

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
const rectanglesState = ref("hidden");
const showRectangles = ref(false);

// Shared animation variants
const sharedVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const titleVariants = sharedVariants;
const subtitleVariants = sharedVariants;
const rectanglesVariants = sharedVariants;

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

const rectanglesTransition = {
  ...baseTransition,
  duration: 0.4,
};

// Последовательная анимация при появлении intro
watch(
  () => props.introVisible,
  async (newVal) => {
    if (!newVal) {
      // Reset animations when intro becomes invisible
      titleState.value = "hidden";
      subtitleState.value = "hidden";
      rectanglesState.value = "hidden";
      showRectangles.value = false;
      return;
    }

    // 1. Заголовок
    titleState.value = "visible";
    await new Promise((resolve) => setTimeout(resolve, 200));

    // 2. Подзаголовок
    subtitleState.value = "visible";
    await new Promise((resolve) => setTimeout(resolve, 200));

    // 3. Квадратики
    rectanglesState.value = "visible";
    showRectangles.value = true;
  },
  { immediate: true }
);

function handleActiveChange(isActive) {
  activeCount.value += isActive ? 1 : -1;
}

// Отслеживаем скролл и сбрасываем квадраты при уходе из viewport
let observer = null;

onMounted(() => {
  const introSection = document.getElementById('intro-text-export-node');
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
  width: 100vw;
  height: 100vh;
  padding-block: clamp(48px, 12vh, 96px);
  padding-inline-start: clamp(32px, 12vw, 120px);
  box-sizing: border-box;
  overflow: visible;
  grid-template-columns: repeat(auto-fill, min-content);
}

.intro-hero__title {
  max-width: 1000px;
  display: grid;
  gap: 24px;
  position: relative;
  z-index: 1;
  margin-bottom: 20vh;
  anchor-name: --title;
  place-items: start start;
}

.intro-list {
  position: absolute;
  /* Fallback for browsers without anchor support */
  top: calc(50vh + 50px + clamp(48px, 12vh, 96px));
  left: clamp(32px, 12vw, 120px);

  /* Anchor positioning for supported browsers */
  position-anchor: --title;
  top: anchor(bottom);
  margin-top: 64px;

  display: grid;
  grid-template-columns:
    fit-content(100px) fit-content(100px) fit-content(100px)
    fit-content(100px);
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;

  max-width: 110vw;
  max-height: 110vh;
  gap: 80px;
  place-items: start start;

  padding: 0;
  list-style: none;
  pointer-events: auto;
  z-index: 5;
}

@media (max-width: 768px) {
  .intro-hero {
    min-height: auto;
    padding-block: clamp(40px, 12vh, 72px);
    padding-inline-start: clamp(24px, 16vw, 72px);
    padding-inline-end: clamp(16px, 8vw, 48px);
  }

  .intro-list {
    /* Adjust fallback calculation for mobile padding */
    top: calc(50vh + 50px + clamp(40px, 12vh, 72px));
    left: clamp(24px, 16vw, 72px);

    /* Adaptive grid for mobile */
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    column-gap: 50px;
  }

  .intro-list > * {
    margin-top: -100px;
  }

  .intro-list > *:nth-child(-n + 5) {
    margin-top: 0;
  }
}
</style>
