<template>
  <div class="case1-scroll-layout" ref="containerRef">
    <!-- Spacer для начального скролла -->
    <div class="initial-spacer"></div>

    <!-- Text frame - фиксируется в центре viewport -->
    <div class="text-frame-sticky" v-show="showText">
      <div class="text-content">
        <h2 class="case-title">
          <motion.span
            v-for="(word, index) in titleWords"
            :key="'title-' + index"
            :style="{ opacity: getWordOpacity(index) }"
            class="word"
            >{{ word }}</motion.span
          >
        </h2>
        <p class="case-subtitle">
          <motion.span :style="{ opacity: subtitleOpacity }">
            {{ company }}
          </motion.span>
        </p>

        <!-- Video под текстом -->
        <!-- Constraint wrapper to maintain layout -->
        <div class="video-constraint-wrapper">
          <motion.div
            class="video-container-wrapper"
            :style="{
              opacity: videoOpacity,
              transform: `translate(-50%, -50%) translateY(${videoYValue}%) scale(${videoScaleValue})`
            }"
          >
            <div class="video-wrapper" :class="{ 'video-playing': videoExpanded }">
              <svg
                class="play-icon"
                :class="{ 'play-icon-hidden': videoExpanded }"
                width="100"
                height="100"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 5v14l11-7L8 5z"
                  fill="white"
                  stroke="white"
                  stroke-width="1"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
              </svg>
              <video
                v-if="videoSrc"
                ref="videoElement"
                :src="videoSrc"
                class="case-video"
                :class="{ 'video-visible': videoExpanded }"
                muted
                loop
                playsinline
              ></video>
            </div>
          </motion.div>
        </div>
      </div>
    </div>

    <!-- Spacer после видео для завершения анимации -->
    <div class="final-spacer"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { motion, useScroll, useTransform } from "motion-v";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  videoSrc: {
    type: String,
    default: "",
  },
  routeTo: {
    type: String,
    required: true,
  },
  backgroundColor: {
    type: String,
    default: "#ffffff",
  },
});

const containerRef = ref(null);
const videoElement = ref(null);
const scrollContainerRef = ref(null);

// useScroll отслеживает скролл контейнера
// offset: ["start end", "end start"] означает:
// progress = 0 когда начало секции появляется внизу экрана
// progress = 1 когда конец секции уходит вверх экрана
const { scrollYProgress } = useScroll({
  target: containerRef,
  container: scrollContainerRef,
  offset: ["start end", "end start"],
});

// Трансформируем прогресс скролла в значения для анимации
// scrollYProgress от 0 (секция внизу экрана) до 1 (секция ушла вверх)

// Разбиваем title на слова
const titleWords = computed(() => props.title.split(" "));

// Общая анимация для subtitle (появляется после title)
const subtitleOpacity = useTransform(scrollYProgress, [0.32, 0.37], [0, 1]);

// Создаем opacity для каждого слова
const appearStart = 0.25;
const appearEnd = 0.35;

const wordOpacities = computed(() => {
  const words = titleWords.value;
  const totalWords = words.length;

  return words.map((_, wordIndex) => {
    const wordAppearDuration = (appearEnd - appearStart) / totalWords;
    const wordStart = appearStart + wordIndex * wordAppearDuration;
    const wordEnd = wordStart + wordAppearDuration;

    return useTransform(scrollYProgress, [wordStart, wordEnd], [0, 1]);
  });
});

// Функция для получения opacity слова по индексу
const getWordOpacity = (wordIndex) => {
  return wordOpacities.value[wordIndex];
};

// Видео wrapper появляется после слова "Apple" (subtitle)
// Subtitle появляется на 0.32-0.37, видео появляется сразу после с такой же задержкой
const videoOpacity = useTransform(scrollYProgress, [0.37, 0.42], [0, 1]);

// Видео увеличивается по триггеру при scrollYProgress >= 0.45
// Inverse scale: start at 0.125 (small), scale up to 1 (large)
const videoExpanded = ref(false);
const videoScaleValue = ref(0.125); // Start small (1/8)
const videoYValue = ref(0);

// watchEffect для отслеживания scrollYProgress через onChange
onMounted(() => {
  // Подписываемся на изменения scrollYProgress
  const unsubscribe = scrollYProgress.on?.('change', (progress) => {
    const shouldExpand = progress >= 0.45;

    if (shouldExpand !== videoExpanded.value) {
      videoExpanded.value = shouldExpand;
      videoScaleValue.value = shouldExpand ? 1 : 0.125; // Expand to scale(1)
      // Adjusted value to properly center when expanded
      videoYValue.value = shouldExpand ? -12 : 0;
    }
  });

  // Очистка при unmount
  onUnmounted(() => {
    if (unsubscribe) unsubscribe();
  });
});

// Показываем текст всегда, когда секция в viewport
const showText = ref(true);

function handleEnter() {
  // Called when section enters viewport
}

function handleLeave() {
  // Called when section leaves viewport
}

function handleStoryLinkClick() {
  // Called before navigation to story page
}

let observer = null;

onMounted(() => {
  // Найти скролл-контейнер от vue-scroll-snap
  const scrollContainer = document.querySelector(".scroll-snap-container");
  if (scrollContainer) {
    scrollContainerRef.value = scrollContainer;
  }

  // IntersectionObserver для определения видимости секции
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        showText.value = entry.isIntersecting;

        if (entry.isIntersecting) {
          handleEnter();
        } else {
          handleLeave();
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  if (containerRef.value) {
    observer.observe(containerRef.value);
  }
});

onUnmounted(() => {
  if (observer && containerRef.value) {
    observer.unobserve(containerRef.value);
  }
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});

defineExpose({
  handleEnter,
  handleLeave,
  handleStoryLinkClick,
});
</script>

<style scoped>
.case1-scroll-layout {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  /* overflow: hidden убран - блокирует sticky */
}

/* Spacer - половина экрана */
.initial-spacer {
  height: 50vh;
  width: 100%;
}

/* Text frame sticky - прибито к центру экрана */
.text-frame-sticky {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
}

.text-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  padding: 0 5vw;
  max-width: 1400px;
}

.case-title {
  margin: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 63px;
  line-height: 1.2;
  color: #000000;
  width: 100%;
}

.case-title .word {
  display: inline-block;
  margin-right: 0.25em;
}

.case-subtitle {
  margin: 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 400;
  font-size: 48px;
  line-height: 1.3;
  color: #000000;
  width: 100%;
}

.case-subtitle span {
  opacity: 1;
}

/* Final spacer - для скrolла */
.final-spacer {
  height: 150vh;
  width: 100%;
}

/* Constraint wrapper - maintains layout space */
.video-constraint-wrapper {
  width: 16.67%; /* Visual space in layout */
  max-width: calc(1662px / 6);
  margin-top: 24px;
  position: relative;
  /* Height matches the aspect ratio at small scale */
  aspect-ratio: 1662 / 1080;
  overflow: visible;
  /* This container defines the layout space */
}

.video-container-wrapper {
  /* Inverse scale approach: start large, scale down, then scale up to 1 */
  width: 800%; /* 133.33% relative to constraint wrapper = 16.67% of text-content */
  max-width: 1662px; /* Full width at scale(1) */
  pointer-events: none;
  transform-origin: center center;
  transition: transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: transform;
  backface-visibility: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  /* Base transform is set via inline style to include reactive values */
}

.video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1662 / 1080;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
  background: #000000;
  /* Larger radius at scale(0.125) = 80px × 0.125 = 10px visual */
  border-radius: 80px;
  /* Use padding instead of border for proper inner radius */
  padding: 10px;
  transition: border-radius 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.video-wrapper.video-playing {
  background: transparent;
  /* Keep black background/frame when playing */
  background: #000000;
  /* Smaller radius at scale(1) for expanded state */
  border-radius: 10px;
}

.play-icon {
  width: 800px; /* 100px × 8 to compensate for scale(0.125) */
  height: 800px;
  opacity: 1;
  transition: opacity 0.3s ease-out;
  position: absolute;
  z-index: 2;
}

.play-icon.play-icon-hidden {
  opacity: 0;
}

.case-video {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  object-fit: cover;
  opacity: 0;
  border-radius: 70px; /* Inner radius matches outer - padding (80px - 10px) */
  transition: opacity 0.4s ease-in, border-radius 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
  transition-delay: 0.2s;
  z-index: 1;
}

.case-video.video-visible {
  opacity: 1;
  border-radius: 3px; /* Smaller radius when video is visible/expanded */
}

.case-open-story {
  align-self: flex-end;
  margin: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 21px;
  line-height: var(--line-height-snug);
  text-align: right;
  text-decoration: none;
  color: #000000;
  transition: opacity 0.2s ease;
}

.case-open-story:hover {
  opacity: 0.7;
}

/* Mobile Responsive */
@media (max-width: 899px) {
  .case-title {
    font-size: 32px;
  }

  .case-subtitle {
    font-size: 24px;
  }

  .video-wrapper {
    background: transparent;
    border-radius: 0;
    padding: 0;
  }

  .case-open-story {
    display: none;
  }
}

@media (max-width: 600px) {
  .case-title {
    font-size: 24px;
  }

  .case-subtitle {
    font-size: 18px;
  }
}
</style>
