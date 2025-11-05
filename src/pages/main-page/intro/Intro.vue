<template>
  <section
    id="intro"
    class="intro-section item"
    :class="{ 'intro-visible': introVisible }"
  >
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
          from&nbsp;large&#8209;scale B2B & FinTech with&nbsp;a&nbsp;product
          management&nbsp;background.
        </Motion>
      </div>
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
        :is-mobile-layout="isMobileLayout"
        :is-smallest-breakpoints="isSmallestBreakpoints"
        :active-mobile-index="activeMobileIndex"
        @active-change="handleActiveChange"
        @mobile-open="handleMobileOpen"
        @mobile-close="handleMobileClose"
      />
    </ul>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { Motion } from "motion-v";
import { useRoute } from "vue-router";
import IntroRectangle from "./IntroRectangle.vue";
import {
  NAVIGATION_MOBILE,
  INTRO_MOBILE_FULLSCREEN,
  useMediaQuery,
} from "@/composables/useMediaQuery.js";

const route = useRoute();
const introVisible = ref(false);
const shouldPlayNavIntro = computed(() => !route.meta?.skipNavIntro);

watch(
  () => shouldPlayNavIntro.value,
  (play) => {
    introVisible.value = !play; // If skip intro, show immediately
  },
  { immediate: true }
);

function handleNavAnimationComplete() {
  introVisible.value = true;
}

defineExpose({
  handleNavAnimationComplete,
  shouldPlayNavIntro,
});

const rects = Array(4).fill(null);
const activeCount = ref(0);
const forceCloseAll = ref(false); // Флаг для принудительного закрытия
const isMobileLayout = useMediaQuery(NAVIGATION_MOBILE);
const isSmallestBreakpoints = useMediaQuery(INTRO_MOBILE_FULLSCREEN);
const activeMobileIndex = ref(-1);

function handleClickOutside(event) {
  if (activeCount.value === 0) return;

  const clickedSquare = event.target.closest(".intro-square");

  if (isSmallestBreakpoints.value) {
    if (!clickedSquare && activeMobileIndex.value !== -1) {
      handleMobileClose();
    }
    return;
  }

  if (isMobileLayout.value) {
    if (!clickedSquare && activeMobileIndex.value !== -1) {
      handleMobileClose();
    }
    return;
  }

  if (!clickedSquare) {
    forceCloseAll.value = true;

    setTimeout(() => {
      forceCloseAll.value = false;
    }, 50);
  }
}

const titleState = ref("hidden");
const subtitleState = ref("hidden");
const rectangleStates = ref([false, false, false, false]); // Индивидуальные состояния для каждого rectangle
const showRectangles = ref(false);

const sharedVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const titleVariants = sharedVariants;
const subtitleVariants = sharedVariants;

const baseTransition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1],
};

const titleTransition = {
  ...baseTransition,
  duration: 0.6,
};

const subtitleTransition = {
  ...baseTransition,
  duration: 0.5,
};

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

watch(
  () => introVisible.value,
  (newVal) => {
    if (!newVal) {
      titleState.value = "hidden";
      subtitleState.value = "hidden";
      rectangleStates.value = [false, false, false, false];
      showRectangles.value = false;
      activeMobileIndex.value = -1;
      activeCount.value = 0;
      return;
    }

    const totalSteps = 7;

    const minDelay = 250;
    const maxDelay = 400;

    function getDelay(stepIndex) {
      const progress = stepIndex / (totalSteps - 1);
      const eased = easeInOutCubic(progress);

      return maxDelay - eased * (maxDelay - minDelay);
    }

    // Use setTimeout instead of async/await to avoid lifecycle hook issues
    const runAnimation = () => {
      titleState.value = "visible";
      setTimeout(() => {
        subtitleState.value = "visible";
        setTimeout(() => {
          showRectangles.value = true;
          let currentStep = 0;
          const animateRectangles = () => {
            if (currentStep < 4) {
              rectangleStates.value[currentStep] = true;
              currentStep++;
              setTimeout(animateRectangles, getDelay(2 + currentStep - 1));
            }
          };
          animateRectangles();
        }, getDelay(1));
      }, getDelay(0));
    };

    runAnimation();
  },
  { immediate: true }
);

function handleActiveChange(isActive) {
  if (isMobileLayout.value) {
    activeCount.value = isActive ? 1 : 0;
  } else {
    activeCount.value += isActive ? 1 : -1;
  }
}

let observer = null;

onMounted(() => {
  const introSection = document.getElementById("intro-text-export-node");
  if (introSection) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && activeCount.value > 0) {
            if (isMobileLayout.value || isSmallestBreakpoints.value) {
              handleMobileClose();
            } else {
              forceCloseAll.value = true;
            }
          } else if (entry.isIntersecting) {
            if (!isMobileLayout.value && !isSmallestBreakpoints.value) {
              forceCloseAll.value = false;
            }
          }
        });
      },
      {
        threshold: 0.1, // Триггерим когда меньше 10% видно
      }
    );

    observer.observe(introSection);
  }

  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  observer?.disconnect();

  document.removeEventListener("click", handleClickOutside);
});

function handleMobileOpen(index) {
  activeMobileIndex.value = index;
  activeCount.value = 1;
}

function handleMobileClose() {
  activeMobileIndex.value = -1;
  activeCount.value = 0;
}

watch(isMobileLayout, (isMobile) => {
  if (!isMobile) {
    handleMobileClose();
    forceCloseAll.value = false;
  }
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
  max-width: 900px;
  display: grid;
  gap: 24px;
  position: relative;
  z-index: 1;
  margin-bottom: 22vh;
  anchor-name: --title;
  place-items: start start;
}

/* Large desktops: increased spacing */
@media (min-width: 1920px) {
  .intro-hero__title {
    gap: 48px;
  }
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
  z-index: 10001;

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
  pointer-events: auto;
  white-space: nowrap;
  z-index: 2;
  cursor: pointer;
  transition: color 0.2s ease;
}

/* Mobile: increase safe-area to avoid browser toolbar overlap */
@media (max-width: 767px) {
  .intro-scroll-hint {
    bottom: max(48px, calc(env(safe-area-inset-bottom) + 32px));
  }
}

.intro-scroll-hint:hover {
  color: rgba(255, 255, 255, 0.9);
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

/* Скрываем rectangles на мобильных устройствах */
@media (max-width: 899px) {
  .intro-list {
    display: none;
  }

  /* Центрируем текст по вертикали, добавляем горизонтальные отступы */
  .intro-hero__title {
    margin-bottom: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    padding-left: clamp(16px, 4vw, 32px);
    padding-right: clamp(16px, 4vw, 32px);
  }
}

/* Mobile landscape: adjust layout to prevent content shifting */
@media (max-width: 767px) and (orientation: landscape) {
  .intro-hero {
    padding-block: clamp(24px, 5vh, 48px);
    padding-inline-start: clamp(24px, 6vw, 64px);
    padding-inline-end: clamp(16px, 3vw, 32px);
  }

  .intro-hero__title {
    position: relative;
    top: auto;
    transform: none;
    padding-left: 0;
    padding-right: 0;
  }

  .intro-scroll-hint {
    bottom: max(24px, calc(env(safe-area-inset-bottom) + 16px));
    font-size: 12px;
  }

  .intro-scroll-hint-icon {
    width: 12px;
    height: 12px;
  }
}

/* Section wrapper styles from MainPage */
.intro-section {
  opacity: 0;
  transition: opacity 0.5s ease-out;
  position: relative;
}

.intro-section.intro-visible {
  opacity: 1;
}
</style>
