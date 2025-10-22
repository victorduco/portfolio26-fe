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
        <motion.div
          class="video-container-wrapper"
          :style="{
            opacity: videoOpacity,
            transform: `translateY(${videoYValue}%) scale(${videoScaleValue})`
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
              <path d="M8 5v14l11-7L8 5z" fill="white" rx="2" />
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

    <!-- Spacer после видео для завершения анимации -->
    <div class="final-spacer"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { RouterLink } from "vue-router";
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

// Создаем opacity для каждого слова напрямую (максимум 20 слов)
const words = props.title.split(" ");
const totalWords = words.length;
const appearStart = 0.25;
const appearEnd = 0.35;

const wordOpacities = words.map((_, wordIndex) => {
  const wordAppearDuration = (appearEnd - appearStart) / totalWords;
  const wordStart = appearStart + wordIndex * wordAppearDuration;
  const wordEnd = wordStart + wordAppearDuration;

  return useTransform(scrollYProgress, [wordStart, wordEnd], [0, 1]);
});

// Функция для получения opacity слова по индексу
const getWordOpacity = (wordIndex) => {
  return wordOpacities[wordIndex];
};

// Видео wrapper появляется после слова "Apple" (subtitle)
// Subtitle появляется на 0.32-0.37, видео появляется сразу после с такой же задержкой
const videoOpacity = useTransform(scrollYProgress, [0.37, 0.42], [0, 1]);

// Видео увеличивается по триггеру при scrollYProgress >= 0.45
const videoExpanded = ref(false);
const videoScaleValue = ref(1);
const videoYValue = ref(0);

// watchEffect для отслеживания scrollYProgress через onChange
onMounted(() => {
  // Подписываемся на изменения scrollYProgress
  const unsubscribe = scrollYProgress.on?.('change', (progress) => {
    const shouldExpand = progress >= 0.45;

    if (shouldExpand !== videoExpanded.value) {
      videoExpanded.value = shouldExpand;
      videoScaleValue.value = shouldExpand ? 8 : 1;
      videoYValue.value = shouldExpand ? -100 : 0;

      console.log(`🎬 Video trigger: ${shouldExpand ? 'EXPAND' : 'COLLAPSE'} at progress ${progress.toFixed(4)}`);

      // Автоплей отключен
      // if (shouldExpand && videoElement.value) {
      //   setTimeout(() => {
      //     videoElement.value.play().catch(err => {
      //       console.error("[Case1ScrollLayout] Video play error:", err);
      //     });
      //   }, 300);
      // } else if (!shouldExpand && videoElement.value) {
      //   videoElement.value.pause();
      // }
    }
  });

  // Очистка при unmount
  onUnmounted(() => {
    if (unsubscribe) unsubscribe();
  });
});

// Показываем текст всегда, когда секция в viewport
const showText = ref(true);

let isInViewport = false;

function handleEnter() {
  isInViewport = true;

  // Автоплей отключен
  // if (videoElement.value) {
  //   videoElement.value.play().catch((err) => {
  //     console.error("[Case1ScrollLayout] Video play error:", err);
  //   });
  // }
}

function handleLeave() {
  isInViewport = false;

  // Автоплей отключен
  // if (videoElement.value && typeof videoElement.value.pause === "function") {
  //   videoElement.value.pause();
  // }
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

    // Add scroll event listener to log scroll position
    let scrollTimeout = null;
    const handleScroll = () => {
      // Clear previous timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Throttle logging to avoid spam
      scrollTimeout = setTimeout(() => {
        // Get motion values
        const getMotionValue = (motionVal) => {
          if (typeof motionVal.get === "function") return motionVal.get();
          if (typeof motionVal.value === "function") return motionVal.value();
          return motionVal.value || motionVal;
        };

        const opacity = getMotionValue(videoOpacity);
        const progress = getMotionValue(scrollYProgress);
        const subtitleOp = getMotionValue(subtitleOpacity);

        // Проверяем триггер прямо в логе
        const shouldTrigger = progress >= 0.45;

        console.log(
          `%c[Case1ScrollLayout]%c scrollYProgress: ${progress.toFixed(
            4
          )} | shouldTrigger: ${shouldTrigger} | videoExpanded: ${videoExpanded.value} | videoScaleValue: ${videoScaleValue.value} | videoYValue: ${videoYValue.value}% | videoOpacity: ${opacity.toFixed(
            4
          )} | subtitleOpacity: ${subtitleOp.toFixed(4)}`,
          "color: #00d4ff; font-weight: bold;",
          "color: #ff69b4;"
        );
      }, 100);
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    // Store for cleanup
    scrollContainerRef.value._scrollHandler = handleScroll;
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
  // Remove scroll listener
  if (scrollContainerRef.value && scrollContainerRef.value._scrollHandler) {
    const scrollContainer = document.querySelector(".scroll-snap-container");
    if (scrollContainer) {
      scrollContainer.removeEventListener(
        "scroll",
        scrollContainerRef.value._scrollHandler
      );
    }
  }

  if (observer && containerRef.value) {
    observer.unobserve(containerRef.value);
  }
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // Автоплей отключен
  // if (videoElement.value && typeof videoElement.value.pause === "function") {
  //   videoElement.value.pause();
  // }
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

/* Final spacer - для скролла */
.final-spacer {
  height: 150vh;
  width: 100%;
}

.video-container-wrapper {
  width: 16.67%;
  max-width: calc(1662px / 6);
  margin-top: 24px;
  pointer-events: none;
  transform-origin: center center;
  transition: transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.video-wrapper {
  position: relative;
  width: 100%;
  background: #000000;
  aspect-ratio: 1662 / 1080;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
  transition: background-color 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.video-wrapper.video-playing {
  background: transparent;
}

.play-icon {
  width: 100px;
  height: 100px;
  opacity: 1;
  transition: opacity 0.3s ease-out;
  position: relative;
  z-index: 2;
}

.play-icon.play-icon-hidden {
  opacity: 0;
}

.play-icon path {
  rx: 3;
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
  border-radius: 3px;
  transition: opacity 0.4s ease-in;
  transition-delay: 0.2s;
}

.case-video.video-visible {
  opacity: 1;
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
    border: none;
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
