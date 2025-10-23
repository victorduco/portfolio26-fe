<template>
  <section
    id="case2"
    class="case-section item"
    style="background-color: #ffffff"
  >
    <div class="case2-split-layout" ref="containerRef">
      <div
        ref="contentWrapperRef"
        :class="['content-wrapper', { pinned: pinned, unpinned: unpinned }]"
        :style="{
          ...(unpinned ? { top: `${unpinTopOffset}px` } : {}),
          ...(pinned
            ? { transform: `translate(-50%, -50%) scale(${currentScale})` }
            : { transform: `scale(${currentScale})` }),
        }"
      >
        <div
          class="case2-content"
          :style="{ transform: `translateY(${contentParallaxY}vh)` }"
        >
          <div class="case2-content-wrapper">
            <div
              class="case2-card-background"
              :style="{ opacity: getCardOpacity() }"
            ></div>

            <div class="case2-content-inner">
              <h2 class="case2-title">
                <motion.span
                  v-for="(word, index) in titlePart1Words"
                  :key="'title1-' + index"
                  :style="{ opacity: getTitlePart1WordOpacity(index) }"
                  class="word"
                >
                  {{ word }}
                </motion.span>
                <motion.span
                  v-for="(word, index) in titlePart2Words"
                  :key="'title2-' + index"
                  :style="{ opacity: getTitlePart2WordOpacity(index) }"
                  class="word"
                >
                  {{ word }}
                </motion.span>
              </h2>
              <p class="case2-description">
                <motion.span
                  v-for="(word, index) in descriptionWords"
                  :key="'desc-' + index"
                  :style="{ opacity: getDescriptionWordOpacity(index) }"
                  class="word"
                >
                  {{ word }}
                </motion.span>
              </p>

              <button
                class="case2-open-story"
                @click="handleStoryLinkClick"
                :style="{ opacity: getButtonOpacity() }"
              >
                <img src="@/assets/icons/case2.svg" alt="" class="case2-icon" />
                Open Story
              </button>
            </div>
          </div>
        </div>

        <div class="case2-image-container" ref="imageContainer">
          <div
            class="case2-image-wrapper"
            ref="imageWrapper"
            :style="{ transform: `translateY(${parallaxY}%)` }"
          >
            <img
              :src="imageSrc"
              :alt="title"
              class="case2-image case2-background"
              ref="imageElement"
            />

            <motion.video
              v-if="showVideo"
              ref="videoElement"
              class="case2-video"
              :src="videoSrc"
              :animate="videoState"
              :variants="videoVariants"
              :transition="videoTransition"
              :initial="'visible'"
              muted
              playsinline
              preload="auto"
            >
              <source :src="videoSrc" type="video/mp4" />
            </motion.video>
          </div>
        </div>
      </div>

      <div class="final-spacer"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { motion, useScroll } from "motion-v";

const description =
  "Communication platform for teams. Streamlining internal communications with intuitive design and powerful features. Empowering organizations to connect, collaborate, and share knowledge effectively across all departments and locations.";
const title = "Redesigning the Communications App";
const videoSrc = new URL("@/assets/case-videos/case2-2.mp4", import.meta.url)
  .href;
const imageSrc = new URL("@/assets/images/p2-3@2x.png", import.meta.url).href;

const containerRef = ref(null);
const contentWrapperRef = ref(null);
const scrollContainerRef = ref(null);
const videoElement = ref(null);

const { scrollYProgress } = useScroll({
  target: containerRef,
  container: scrollContainerRef,
  offset: ["start end", "end end"],
});

const pinned = ref(false);
const unpinned = ref(false);
const unpinTopOffset = ref(0);

const showVideo = computed(() => !!videoSrc);
const titlePart1Words = computed(() => ["Redesigning", "the"]);
const titlePart2Words = computed(() => ["Communications", "App"]);
const descriptionWords = computed(() => description.split(" "));
const currentScrollProgress = ref(0);

const videoVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const videoTransition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1],
  duration: 0.5,
};
const videoState = ref("hidden");

const getOpacity = (startProgress, endProgress) => {
  if (currentScrollProgress.value < startProgress) return 0;
  if (currentScrollProgress.value > endProgress) return 1;
  return (
    (currentScrollProgress.value - startProgress) /
    (endProgress - startProgress)
  );
};

const getTitlePart1WordOpacity = (wordIndex) => {
  const totalWords = titlePart1Words.value.length;
  const wordProgress = wordIndex / totalWords;
  const startProgress = wordProgress * 0.15;
  const endProgress = startProgress + 0.15 / totalWords;
  return getOpacity(startProgress, endProgress);
};

const getTitlePart2WordOpacity = (wordIndex) => {
  const totalWords = titlePart2Words.value.length;
  const wordProgress = wordIndex / totalWords;
  const startProgress = 0.15 + wordProgress * 0.15;
  const endProgress = startProgress + 0.15 / totalWords;
  return getOpacity(startProgress, endProgress);
};

const getDescriptionWordOpacity = (wordIndex) => {
  const totalWords = descriptionWords.value.length;
  const wordProgress = wordIndex / totalWords;
  const startProgress = 0.5 + wordProgress * 0.15;
  const endProgress = startProgress + 0.15 / totalWords;
  return getOpacity(startProgress, endProgress);
};

const getCardOpacity = () => getOpacity(0.45, 0.5);
const getButtonOpacity = () => getOpacity(0.65, 0.75);

const currentScale = ref(0.5);

const parallaxY = ref(0);

const contentParallaxY = ref(0);

let scrollUnsubscribe = null;

onMounted(() => {
  const scrollContainer = document.querySelector(".scroll-snap-container");
  if (scrollContainer) scrollContainerRef.value = scrollContainer;

  scrollUnsubscribe = scrollYProgress.on?.("change", (rawProgress) => {
    const progress = rawProgress;
    const scaleEndThreshold = 0.4;

    currentScale.value =
      progress <= scaleEndThreshold
        ? 0.5 + (progress / scaleEndThreshold) * 0.5
        : 1;

    const textProgress =
      progress <= scaleEndThreshold
        ? 0
        : (progress - scaleEndThreshold) / (1 - scaleEndThreshold);
    currentScrollProgress.value = textProgress;

    parallaxY.value = (0.5 - textProgress) * 20;

    if (textProgress < 0.7) {
      contentParallaxY.value = -(textProgress / 0.7) * 3;
    } else {
      const laterProgress = (textProgress - 0.7) / 0.3;
      const easeInCubic = laterProgress * laterProgress * laterProgress;
      contentParallaxY.value = -3 + easeInCubic * (-120 + 3);
    }

    if (videoElement.value && videoSrc) {
      const video = videoElement.value.$el || videoElement.value;
      if (video?.duration && !isNaN(video.duration)) {
        const targetTime = progress * video.duration;
        if (Math.abs(video.currentTime - targetTime) > 0.05) {
          video.currentTime = targetTime;
        }
      }
    }

    videoState.value = progress > 0.1 ? "visible" : "hidden";

    const pinStartThreshold = 0.4;
    const shouldPin = progress >= pinStartThreshold && progress < 1;
    const shouldUnpin = progress >= 1 || progress < pinStartThreshold;

    if (shouldPin !== pinned.value) {
      if (
        shouldPin &&
        unpinned.value &&
        containerRef.value &&
        contentWrapperRef.value
      ) {
        const containerRect = containerRef.value.getBoundingClientRect();
        const wrapperRect = contentWrapperRef.value.getBoundingClientRect();
        unpinTopOffset.value = wrapperRect.top - containerRect.top;
      }
      if (shouldPin && unpinned.value) unpinned.value = false;
      pinned.value = shouldPin;
    }

    if (shouldUnpin !== unpinned.value) {
      if (shouldUnpin && containerRef.value && contentWrapperRef.value) {
        const containerRect = containerRef.value.getBoundingClientRect();
        const wrapperRect = contentWrapperRef.value.getBoundingClientRect();
        unpinTopOffset.value = wrapperRect.top - containerRect.top;
      }
      unpinned.value = shouldUnpin;
    }
  });
});

onUnmounted(() => {
  if (scrollUnsubscribe) {
    scrollUnsubscribe();
    scrollUnsubscribe = null;
  }
});

const handleEnter = () => {};
const handleLeave = () => {};
const handleStoryLinkClick = () => {};

defineExpose({
  handleEnter,
  handleLeave,
  handleStoryLinkClick,
});
</script>

<style scoped>
.case2-split-layout {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  overflow: hidden;
}

.content-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  z-index: 1;
  overflow: visible;
  pointer-events: auto;
}

.content-wrapper.pinned {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100vh;
  z-index: 200;
  pointer-events: none;
}

.content-wrapper.unpinned {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  min-height: 100vh;
  pointer-events: auto;
}

.final-spacer {
  height: 150vh;
  width: 100%;
}

.case2-content {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: clamp(60px, 10vh, 120px) 20px 20px 20px;
  box-sizing: border-box;
  pointer-events: none;
  transition: transform 0.1s ease-out;
  will-change: transform;
}

.case2-content-wrapper {
  position: relative;
  display: inline-flex;
  max-width: min(30vw, 550px);
}

.case2-card-background {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  transition: opacity 0.1s ease-out;
  pointer-events: none;
}

.case2-content-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: clamp(16px, 2vh, 24px);
  max-width: 900px;
  width: 100%;
  pointer-events: auto;
  padding: clamp(24px, 3vw, 40px) clamp(28px, 3.5vw, 48px);
  z-index: 1;
}

.case2-title {
  margin: 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 600;
  font-size: clamp(20px, 3vw, 38px);
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #000000;
  text-align: left;
}

.case2-title .word {
  display: inline-block;
  margin-right: 0.25em;
  transition: opacity 0.1s ease-out;
}

.case2-description {
  margin: 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 400;
  font-size: clamp(12px, 1.3vw, 15px);
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.7);
  text-align: left;
  max-width: 500px;
}

.case2-description .word {
  display: inline-block;
  margin-right: 0.25em;
  transition: opacity 0.1s ease-out;
}

.case2-open-story {
  background: none;
  border: none;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 500;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  cursor: pointer;
  padding: 0;
  gap: 10px;
  transition: opacity 0.1s ease-out;
}

.case2-open-story:hover {
  opacity: 0.7;
}

.case2-icon {
  width: 24px;
  height: 24px;
  display: block;
}

.case2-image-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.case2-image-wrapper {
  width: 100%;
  height: 120%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  transition: transform 0.1s ease-out;
  will-change: transform;
}

.case2-image,
.case2-video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  will-change: transform;
  transition: transform 0.1s ease-out;
  position: absolute;
  top: 0;
  left: 0;
}

.case2-background {
  z-index: 1;
}

.case2-video {
  z-index: 2;
}

@media (max-width: 899px) {
  .case2-split-layout {
    flex-direction: column;
    height: auto;
    min-height: 100dvh;
  }

  .case2-content {
    flex: none;
    padding: clamp(32px, 8vh, 64px) clamp(24px, 6vw, 48px);
  }

  .case2-content-inner {
    padding: 0;
    max-width: 100%;
    align-items: center;
    text-align: center;
    gap: clamp(20px, 3vh, 32px);
  }

  .case2-title {
    text-align: center;
    font-size: clamp(28px, 6vw, 40px);
  }

  .case2-description {
    text-align: center;
    font-size: clamp(14px, 3.5vw, 16px);
  }

  .case2-content-wrapper {
    max-width: 100%;
    width: 100%;
  }

  .case2-open-story {
    font-size: 20px;
  }

  .case2-icon {
    width: 28px;
    height: 28px;
  }

  .case2-image-container {
    flex: 1;
    min-height: 50vh;
  }

  .case2-image,
  .case2-video {
    object-fit: contain;
  }
}

@media (max-width: 600px) {
  .case2-content {
    padding: clamp(24px, 6vh, 48px) 20px;
  }

  .case2-content-inner {
    gap: 16px;
    padding: 16px 20px;
  }

  .case2-title {
    font-size: clamp(24px, 5vw, 32px);
  }

  .case2-description {
    font-size: 14px;
  }

  .case2-open-story {
    font-size: 18px;
    gap: 10px;
  }

  .case2-icon {
    width: 24px;
    height: 24px;
  }
}

.case-section.item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  height: 100dvh;
}

#case2.case-section.item {
  height: 250vh;
  min-height: 250vh;
  max-height: 250vh;
}
</style>
