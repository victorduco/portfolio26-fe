<template>
  <section
    id="case1"
    class="case-section item"
    style="background-color: #ffffff"
  >
    <div
      class="case1-scroll-layout"
      ref="containerRef"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <div ref="contentWrapperRef" class="text-frame-wrapper">
        <div class="text-content">
          <div class="text-only" :style="{ opacity: textOpacity }">
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
          </div>
          <div class="video-constraint-wrapper">
            <motion.div
              class="video-container-wrapper"
              :style="{
                opacity: videoOpacity,
                transform: `translate(-50%, -50%) translateY(${videoYValue}%) scale(${videoScaleValue})`,
              }"
            >
              <div class="video-and-link-wrapper">
                <VideoPlayer
                  ref="videoPlayerRef"
                  :video-src="videoSrc"
                  :video-expanded="videoExpanded"
                />
                <motion.a
                  :href="routeTo"
                  class="case-open-story-link"
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: showStoryLink && videoExpanded ? 1 : 0 }"
                  :transition="{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }"
                  :style="{
                    pointerEvents:
                      showStoryLink && videoExpanded ? 'auto' : 'none',
                  }"
                  @click.prevent="handleStoryLinkClick"
                >
                  Open Story
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { motion, useScroll, useTransform } from "motion-v";
import VideoPlayer from "@/components/VideoPlayer.vue";

const title = "Cross-Domain AI Solution for Account Reconcilers";
const company = "Apple";
const videoSrc = new URL("@/assets/case-videos/case1.mp4", import.meta.url)
  .href;
const routeTo = "/story/one";

const containerRef = ref(null);
const contentWrapperRef = ref(null);
const scrollContainerRef = ref(null);
const videoPlayerRef = ref(null);

const showStoryLink = ref(false);
const isHovering = ref(false);

let storyLinkTimeout = null;

// Initialize motion-v hooks first (they must be called during setup)
const { scrollYProgress } = useScroll({
  target: containerRef,
  container: scrollContainerRef,
  offset: ["start end", "end end"],
});

const titleWords = computed(() => title.split(" "));

const subtitleOpacity = useTransform(scrollYProgress, [0.7, 0.75], [0.2, 1]);

const appearStart = 0.6;
const appearEnd = 0.7;

// Create word opacities outside of computed to avoid lifecycle issues
const words = title.split(" ");
const totalWords = words.length;
const wordOpacities = words.map((_, wordIndex) => {
  const wordAppearDuration = (appearEnd - appearStart) / totalWords;
  const wordStart = appearStart + wordIndex * wordAppearDuration;
  const wordEnd = wordStart + wordAppearDuration;

  return useTransform(scrollYProgress, [wordStart, wordEnd], [0.2, 1]);
});

const getWordOpacity = (wordIndex) => {
  return wordOpacities[wordIndex];
};

const videoOpacity = useTransform(scrollYProgress, [0.75, 0.8], [0.2, 1]);

const videoExpanded = ref(false);
const videoScaleValue = ref(0.1875);
const videoYValue = ref(0);
const slowScrollY = ref(0);
const textOpacity = ref(1);
const showText = ref(true);

// Register lifecycle hooks after motion-v hooks
let scrollUnsubscribe = null;
let observer = null;

onMounted(() => {
  // Setup scroll container
  const scrollContainer = document.querySelector(".scroll-snap-container");
  if (scrollContainer) {
    scrollContainerRef.value = scrollContainer;
  }

  // Setup scroll progress listener
  scrollUnsubscribe = scrollYProgress.on?.("change", (progress) => {
    if (progress < 0.8) {
      textOpacity.value = 1;
    } else if (progress < 0.9) {
      const fadeProgress = (progress - 0.8) / (0.9 - 0.8);
      textOpacity.value = 1 - fadeProgress;
    } else {
      textOpacity.value = 0;
    }

    const shouldExpand = progress >= 0.8;

    if (shouldExpand !== videoExpanded.value) {
      videoExpanded.value = shouldExpand;
      videoScaleValue.value = shouldExpand ? 1 : 0.1875;
      videoYValue.value = shouldExpand ? 10 : 0;

      if (shouldExpand) {
        if (!showStoryLink.value && !storyLinkTimeout) {
          storyLinkTimeout = setTimeout(() => {
            showStoryLink.value = true;
            storyLinkTimeout = null;
          }, 800);
        }
      } else {
        if (storyLinkTimeout) {
          clearTimeout(storyLinkTimeout);
          storyLinkTimeout = null;
        }
        showStoryLink.value = false;
      }

      if (videoPlayerRef.value) {
        if (shouldExpand) {
          videoPlayerRef.value.attemptPlay();
        } else {
          videoPlayerRef.value.pauseVideo();
        }
      }
    }
  });

  // Setup intersection observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        showText.value = entry.isIntersecting;
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
  if (scrollUnsubscribe) {
    scrollUnsubscribe();
    scrollUnsubscribe = null;
  }

  if (observer && containerRef.value) {
    observer.unobserve(containerRef.value);
  }
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});

function handleStoryLinkClick(event) {
  if (videoPlayerRef.value) {
    videoPlayerRef.value.saveState();
  }
  if (event && event.currentTarget && event.currentTarget.href) {
    window.location.href = event.currentTarget.href;
  }
}

defineExpose({
  handleStoryLinkClick,
});
</script>

<style scoped>
.case1-scroll-layout {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
}
.text-frame-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 200;
  pointer-events: none;
  padding-top: 15vh;
  transform: translateY(0);
}

.text-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  text-align: center;
  padding: 0 5vw;
  max-width: 1400px;
}

.text-only {
  transition: opacity 0.3s ease-out;
}

.case-title {
  margin: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: clamp(32px, 4.5vw, 63px);
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
  font-size: clamp(20px, 2.8vw, 38px);
  line-height: 1.3;
  color: #000000;
  width: 100%;
}

.case-subtitle span {
  opacity: 1;
}

.video-constraint-wrapper {
  width: clamp(120px, 20vw, calc(1662px / 6));
  margin-top: 24px;
  position: relative;
  aspect-ratio: 1662 / 1080;
  overflow: visible;
}

.video-container-wrapper {
  width: 800%;
  max-width: min(1200px, 85vw);
  pointer-events: none;
  transform-origin: center center;
  transition: transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: transform;
  backface-visibility: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
}

.video-and-link-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
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

.case-open-story-link {
  display: block;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: clamp(20px, 2.2vw, 36px);
  line-height: 1.2;
  color: #000000;
  text-decoration: underline;
  text-align: center;
  transition: text-decoration 0.2s ease;
  cursor: pointer;
  white-space: nowrap;
}

.case-open-story-link:hover {
  text-decoration: none;
}

/* Mobile Responsive */
@media (max-width: 899px) {
  .case-title {
    font-size: 32px;
  }

  .case-subtitle {
    font-size: 24px;
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

/* Section wrapper styles from MainPage */
.case-section.item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  height: 100dvh;
}

/* Case1 needs extra height for scroll animation */
#case1.case-section.item {
  height: 200vh;
  min-height: 200vh;
  max-height: 200vh;
}
</style>
