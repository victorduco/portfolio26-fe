<template>
  <section
    id="case2"
    class="case-section item"
    style="background-color: #ffffff"
  >
    <div class="case2-split-layout" ref="containerRef">
    <!-- Content wrapper - will be pinned during scroll -->
    <div
      ref="contentWrapperRef"
      :class="['content-wrapper', { 'pinned': pinned, 'unpinned': unpinned }]"
      :style="{
        ...(unpinned ? { top: `${unpinTopOffset}px` } : {}),
        ...(pinned ? { transform: `translate(-50%, -50%) scale(${currentScale})` } : { transform: `scale(${currentScale})` })
      }"
    >
      <!-- Left Side: Content -->
      <div
        class="case2-content"
        :style="{ transform: `translateY(${contentParallaxY}vh)` }"
      >
        <div class="case2-content-wrapper">
          <!-- Glass card background (appears separately) -->
          <div class="case2-card-background" :style="{ opacity: getCardOpacity() }"></div>

          <!-- Content inner -->
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

      <!-- Right Side: Image with Parallax -->
      <div class="case2-image-container" ref="imageContainer">
        <div
          class="case2-image-wrapper"
          ref="imageWrapper"
          :style="{ transform: `translateY(${parallaxY}%)` }"
        >
          <!-- Static Image (always visible on background) -->
          <img
            :src="imageSrc"
            :alt="title"
            class="case2-image case2-background"
            ref="imageElement"
          />

          <!-- Video Animation (scroll-controlled, on top of image) -->
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

    <!-- Final spacer for scroll exit -->
    <div class="final-spacer"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { motion, useScroll } from "motion-v";

// Case 2 Data - Smarp
const title = "Redesigning the Communications App";
const subtitle = "Smarp";
const description = "Communication platform for teams. Streamlining internal communications with intuitive design and powerful features. Empowering organizations to connect, collaborate, and share knowledge effectively across all departments and locations.";
const videoSrc = new URL("@/assets/case-videos/case2-2.mp4", import.meta.url).href;
const imageSrc = new URL("@/assets/images/p2-3@2x.png", import.meta.url).href;
const routeTo = "/story/two";
const primaryColor = "#979797";
const backgroundColor = "#ffffff";

const containerRef = ref(null);
const contentWrapperRef = ref(null);
const scrollContainerRef = ref(null);
const imageContainer = ref(null);
const imageWrapper = ref(null);
const imageElement = ref(null);
const videoElement = ref(null);

// Pinning states
const pinned = ref(false);
const unpinned = ref(false);
const unpinTopOffset = ref(0);

// Animation states
const videoState = ref("visible");

// Always show video when videoSrc is provided (it will reset each time)
const showVideo = computed(() => !!videoSrc);

// Split text into words for animation
const titlePart1Words = computed(() => ['Redesigning', 'the']);
const titlePart2Words = computed(() => ['Communications', 'App']);
const descriptionWords = computed(() => description.split(' '));

// Store current scroll progress for word animations
const currentScrollProgress = ref(0);

// Video animation variants
const videoVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Video transition config
const videoTransition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1],
  duration: 0.5,
};

// Functions to calculate word opacity based on scroll progress
// Title part 1 appears first (0 - 0.15)
function getTitlePart1WordOpacity(wordIndex) {
  const totalWords = titlePart1Words.value.length;
  const wordProgress = wordIndex / totalWords;
  const startProgress = wordProgress * 0.15;
  const endProgress = startProgress + (0.15 / totalWords);

  if (currentScrollProgress.value < startProgress) return 0;
  if (currentScrollProgress.value > endProgress) return 1;

  return (currentScrollProgress.value - startProgress) / (endProgress - startProgress);
}

// Title part 2 appears second (0.15 - 0.3)
function getTitlePart2WordOpacity(wordIndex) {
  const totalWords = titlePart2Words.value.length;
  const wordProgress = wordIndex / totalWords;
  const startProgress = 0.15 + (wordProgress * 0.15);
  const endProgress = startProgress + (0.15 / totalWords);

  if (currentScrollProgress.value < startProgress) return 0;
  if (currentScrollProgress.value > endProgress) return 1;

  return (currentScrollProgress.value - startProgress) / (endProgress - startProgress);
}

function getDescriptionWordOpacity(wordIndex) {
  const totalWords = descriptionWords.value.length;
  // Description appears after card (0.5 - 0.65)
  const wordProgress = wordIndex / totalWords;
  const startProgress = 0.5 + (wordProgress * 0.15);
  const endProgress = startProgress + (0.15 / totalWords);

  if (currentScrollProgress.value < startProgress) return 0;
  if (currentScrollProgress.value > endProgress) return 1;

  return (currentScrollProgress.value - startProgress) / (endProgress - startProgress);
}

// Card appears after title parts (0.45 - 0.5)
function getCardOpacity() {
  const startProgress = 0.45;
  const endProgress = 0.5;

  if (currentScrollProgress.value < startProgress) return 0;
  if (currentScrollProgress.value > endProgress) return 1;

  return (currentScrollProgress.value - startProgress) / (endProgress - startProgress);
}

// Button appears at the end (0.65 - 0.75)
function getButtonOpacity() {
  const startProgress = 0.65;
  const endProgress = 0.75;

  if (currentScrollProgress.value < startProgress) return 0;
  if (currentScrollProgress.value > endProgress) return 1;

  return (currentScrollProgress.value - startProgress) / (endProgress - startProgress);
}




// Single unified scroll tracker covering entire animation range
// offset: ["start end", "end end"] means:
// progress = 0 when start of case2-split-layout reaches end of viewport (bottom of screen)
// progress = 1 when end of case2-split-layout reaches end of viewport (bottom of screen)
// This allows scale animation to happen first, then all other animations
const { scrollYProgress } = useScroll({
  target: containerRef,
  container: scrollContainerRef,
  offset: ["start end", "end end"],
});

// Store current scale value
const currentScale = ref(0.5);

// Store parallax transform value
const parallaxY = ref(0);

// Store content parallax value for text
const contentParallaxY = ref(0);

// Store unsubscribe function for cleanup
let scrollUnsubscribe = null;


onMounted(() => {
  // Find the scroll container for vue-scroll-snap
  const scrollContainer = document.querySelector(".scroll-snap-container");
  if (scrollContainer) {
    scrollContainerRef.value = scrollContainer;
  }

  // Subscribe to unified scroll progress
  scrollUnsubscribe = scrollYProgress.on?.('change', (rawProgress) => {
    // With unified scroll tracker ["start end", "end end"]:
    // rawProgress = 0: section start touches viewport bottom (scale starts)
    // rawProgress = ~0.15: section start touches viewport top (scale completes, pinning begins)
    // rawProgress = 1: section end exits viewport

    const progress = rawProgress;

    // SCALE ANIMATION (0 - 0.4): happens as section enters viewport and scrolls up
    const scaleEndThreshold = 0.4;

    if (progress <= scaleEndThreshold) {
      const scaleProgress = progress / scaleEndThreshold;
      currentScale.value = 0.5 + (scaleProgress * 0.5);
    } else {
      currentScale.value = 1;
    }

    // TEXT ANIMATIONS (0.4 - 1): remapped to 0-1 range for existing text animations
    // Text starts appearing only after scale completes
    let textProgress;
    if (progress <= scaleEndThreshold) {
      textProgress = 0;
    } else {
      // Remap 0.4-1 to 0-1
      textProgress = (progress - scaleEndThreshold) / (1 - scaleEndThreshold);
    }

    // VIDEO ANIMATION (0 - 1): plays throughout entire scroll, including scale phase
    const videoProgress = progress;

    // Update current scroll progress for word animations (using text progress)
    currentScrollProgress.value = textProgress;

    // Update parallax effect (image moves slower than scroll)
    // Parallax range: +10% to -10% over the entire scroll progress (opposite direction)
    parallaxY.value = (0.5 - textProgress) * 20;

    // Content parallax effect (text moves slower upward)
    // Similar to Case1, but with different range for Case2
    if (textProgress < 0.7) {
      // Slow parallax while text appears and stays (0 to 0.7)
      // Move from 0 to -3vh (upward) - very slow movement, keep content readable for longer
      const adjustedProgress = textProgress / 0.7;
      contentParallaxY.value = -(adjustedProgress * 3);
    } else {
      // After progress 0.7, continue with dynamic scroll (starts earlier now)
      const laterProgress = (textProgress - 0.7) / (1 - 0.7); // 0 to 1 over remaining range

      // Use easing function: start slow, accelerate towards the end
      const easeInCubic = laterProgress * laterProgress * laterProgress;

      // Move from -3vh and keep going as user scrolls
      const startOffset = -3;
      const endOffset = -120; // Continue moving throughout scroll
      contentParallaxY.value = startOffset + (easeInCubic * (endOffset - startOffset));
    }

    // Get content-wrapper position for debugging
    const wrapperRect = contentWrapperRef.value?.getBoundingClientRect();
    const wrapperTop = wrapperRect ? Math.round(wrapperRect.top) : 'N/A';
    const wrapperLeft = wrapperRect ? Math.round(wrapperRect.left) : 'N/A';

    // Update video currentTime based on scroll progress
    // Video plays throughout the entire animation (0-1), starting from the very beginning
    if (videoElement.value && videoSrc) {
      const video = videoElement.value.$el || videoElement.value;

      if (video && video.duration && !isNaN(video.duration)) {
        // Map videoProgress (0-1) to full video duration, plays during entire scroll
        const targetTime = videoProgress * video.duration;

        // Only update if difference is significant to avoid jitter
        if (Math.abs(video.currentTime - targetTime) > 0.05) {
          video.currentTime = targetTime;
        }
      }
    }


    // With unified offset ["start end", "end end"] tracking entire case2 container:
    // - progress starts when section enters viewport bottom (0)
    // - Let section scroll naturally until it reaches top
    // - Pin when section is at top and content needs to stay visible
    // - progress = 1: section exits viewport
    //
    // Pin when section has scrolled to top (progress > 0.4 and < 1)
    // This gives more natural scroll before pinning
    const pinStartThreshold = 0.4;

    const shouldPin = progress >= pinStartThreshold && progress < 1;
    const shouldUnpin = progress >= 1 || progress < pinStartThreshold;

    // Update pin state
    if (shouldPin !== pinned.value) {
      // Before pinning (when scrolling up from unpinned state), calculate offset
      if (shouldPin && unpinned.value && containerRef.value && contentWrapperRef.value) {
        const containerRect = containerRef.value.getBoundingClientRect();
        const wrapperRect = contentWrapperRef.value.getBoundingClientRect();

        // Current wrapper top position relative to viewport
        const currentTop = wrapperRect.top;

        // Container top position relative to viewport
        const containerTop = containerRect.top;

        // Calculate offset before we change to pinned
        const offset = currentTop - containerTop;

        unpinTopOffset.value = offset;
      }

      // If we're going from unpinned back to pinned, clear unpinned state first
      if (shouldPin && unpinned.value) {
        unpinned.value = false;
      }

      pinned.value = shouldPin;
    }

    // Update unpin state
    if (shouldUnpin !== unpinned.value) {

      // Before unpinning (scrolling down), calculate where wrapper should be positioned
      // Wrapper is currently fixed at center (top: 50%, transform: translate(-50%, -50%))
      // When it becomes absolute, we need to offset it so it stays in the same visual position
      if (shouldUnpin && containerRef.value && contentWrapperRef.value) {
        const containerRect = containerRef.value.getBoundingClientRect();
        const wrapperRect = contentWrapperRef.value.getBoundingClientRect();

        // Current wrapper top position relative to viewport
        const currentTop = wrapperRect.top;

        // Container top position relative to viewport
        const containerTop = containerRect.top;

        // Calculate offset: where wrapper is now minus where container starts
        const offset = currentTop - containerTop;

        unpinTopOffset.value = offset;
      }

      unpinned.value = shouldUnpin;
    }
  });
});

onUnmounted(() => {
  // Clean up scroll listener
  if (scrollUnsubscribe) {
    scrollUnsubscribe();
    scrollUnsubscribe = null;
  }
});

function handleEnter() {
  // Called when section enters viewport
}

function handleLeave() {
  // Called when section leaves viewport
}

function handleStoryLinkClick() {
  // Called before navigation to story page
}

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


/* Content wrapper - normal flow by default */
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

/* Pinned - fixed in center of viewport */
.content-wrapper.pinned {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100vh;
  z-index: 200;
  pointer-events: none;
}

/* Unpinned - back to normal flow after being pinned, but stay in center visually */
.content-wrapper.unpinned {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  min-height: 100vh;
  pointer-events: auto;
}

/* Final spacer - for scroll exit */
.final-spacer {
  height: 150vh;
  width: 100%;
}

/* Left Side: Content - overlays the image */
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

/* Wrapper for card and content */
.case2-content-wrapper {
  position: relative;
  display: inline-flex;
  max-width: min(30vw, 550px);
}

/* Glass card background */
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

/* Open Story button */
.case2-open-story {
  background: none;
  border: none;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
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

/* Right Side: Image with Parallax - now full screen */
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

/* Background image stays behind video */
.case2-background {
  z-index: 1;
}

/* Video is on top of image */
.case2-video {
  z-index: 2;
}

/* Mobile Responsive */
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

  .case2-content-inner {
    align-items: center;
    text-align: center;
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

  .case2-content-inner {
    padding: 16px 20px;
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

/* Case2 needs extra height for scroll animation */
#case2.case-section.item {
  height: 250vh;
  min-height: 250vh;
  max-height: 250vh;
}
</style>
