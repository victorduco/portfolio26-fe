<template>
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
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { motion, useScroll } from "motion-v";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageSrc: {
    type: String,
    required: true,
  },
  routeTo: {
    type: String,
    required: true,
  },
  videoSrc: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["navigation-click"]);

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
const showVideo = computed(() => !!props.videoSrc);

// Split text into words for animation
const titlePart1Words = computed(() => ['Redesigning', 'the']);
const titlePart2Words = computed(() => ['Communications', 'App']);
const descriptionWords = computed(() => props.description.split(' '));

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




// useScroll tracks scroll progress of entire case2 container
// offset: ["start start", "end end"] means:
// progress = 0 when start of case2-split-layout reaches start of viewport (top of screen)
// progress = 1 when end of case2-split-layout reaches end of viewport (bottom of screen)
const { scrollYProgress } = useScroll({
  target: containerRef,
  container: scrollContainerRef,
  offset: ["start start", "end end"],
});

// Separate scroll tracker for scale animation (from "start end" to "start start")
// This triggers before the section reaches the top
const { scrollYProgress: scaleProgress } = useScroll({
  target: containerRef,
  container: scrollContainerRef,
  offset: ["start end", "start start"],
});

// Store current scale value
const currentScale = ref(0.5);

// Store parallax transform value
const parallaxY = ref(0);

// Store content parallax value for text
const contentParallaxY = ref(0);

// Store unsubscribe functions for cleanup
let scrollUnsubscribe = null;
let scaleUnsubscribe = null;


onMounted(() => {
  // Find the scroll container for vue-scroll-snap
  const scrollContainer = document.querySelector(".scroll-snap-container");
  if (scrollContainer) {
    scrollContainerRef.value = scrollContainer;
  }

  // Subscribe to scale progress changes
  scaleUnsubscribe = scaleProgress.on?.('change', (progress) => {
    // Scale from 0.5 to 1 as section enters viewport
    currentScale.value = 0.5 + (progress * 0.5);
  });

  // Subscribe to scroll progress changes for pinning/unpinning
  scrollUnsubscribe = scrollYProgress.on?.('change', (progress) => {
    // Update current scroll progress for word animations
    currentScrollProgress.value = progress;

    // Update parallax effect (image moves slower than scroll)
    // Parallax range: +10% to -10% over the entire scroll progress (opposite direction)
    parallaxY.value = (0.5 - progress) * 20;

    // Content parallax effect (text moves slower upward)
    // Similar to Case1, but with different range for Case2
    if (progress < 0.92) {
      // Slow parallax while text appears and stays (0 to 0.92)
      // Move from 0 to -3vh (upward) - very slow movement, keep content readable for longer
      const adjustedProgress = progress / 0.92;
      contentParallaxY.value = -(adjustedProgress * 3);
    } else {
      // After progress 0.92, continue with dynamic scroll
      const laterProgress = (progress - 0.92) / (1 - 0.92); // 0 to 1 over remaining range

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
    if (videoElement.value && props.videoSrc) {
      const video = videoElement.value.$el || videoElement.value;

      if (video && video.duration && !isNaN(video.duration)) {
        // Map progress (0-0.75) to video duration, video completes at 0.75 progress
        const videoProgress = Math.min(progress / 0.75, 1);
        const targetTime = videoProgress * video.duration;

        // Only update if difference is significant to avoid jitter
        if (Math.abs(video.currentTime - targetTime) > 0.05) {
          video.currentTime = targetTime;
        }
      }
    }

    // Debug: log progress and position
    console.log(
      `[Case2] Progress: ${progress.toFixed(3)} | ` +
      `Wrapper position: (${wrapperLeft}, ${wrapperTop}) | ` +
      `Pinned: ${pinned.value} | Unpinned: ${unpinned.value}`
    );

    // With offset ["start start", "end end"] tracking entire case2 container (250vh):
    // - containerRef includes: content-wrapper (100vh) + final-spacer (150vh)
    //
    // progress <= 0: case2 at or below viewport (scrolling up from case1) → NOT PINNED
    // progress > 0 and < 1: case2 in viewport → PINNED
    // progress >= 1: case2 is above viewport (scrolled past) → UNPINNED
    //
    // Pin when in range (0 < progress < 1)
    // Unpin when outside range (progress >= 1 OR progress <= 0)

    const shouldPin = progress > 0 && progress < 1;
    const shouldUnpin = progress >= 1 || progress <= 0;

    // Update pin state
    if (shouldPin !== pinned.value) {
      console.log('[Case2] Pin state changed:', shouldPin);

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

        console.log(`[Case2] Before pinning - calculating offset: currentTop=${Math.round(currentTop)}, containerTop=${Math.round(containerTop)}, offset=${Math.round(offset)}`);

        unpinTopOffset.value = offset;
      }

      // If we're going from unpinned back to pinned, clear unpinned state first
      if (shouldPin && unpinned.value) {
        unpinned.value = false;
      }

      pinned.value = shouldPin;

      // Log position after state change
      setTimeout(() => {
        const rect = contentWrapperRef.value?.getBoundingClientRect();
        if (rect) {
          console.log(`[Case2] After pin change - Position: (${Math.round(rect.left)}, ${Math.round(rect.top)})`);
        }
      }, 0);
    }

    // Update unpin state
    if (shouldUnpin !== unpinned.value) {
      console.log('[Case2] Unpin state changed:', shouldUnpin);

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

        console.log(`[Case2] Before unpinning - calculating offset: currentTop=${Math.round(currentTop)}, containerTop=${Math.round(containerTop)}, offset=${Math.round(offset)}`);

        unpinTopOffset.value = offset;
      }

      unpinned.value = shouldUnpin;

      // Log position after state change
      setTimeout(() => {
        const rect = contentWrapperRef.value?.getBoundingClientRect();
        if (rect) {
          console.log(`[Case2] After unpin change - Position: (${Math.round(rect.left)}, ${Math.round(rect.top)})`);
        }
      }, 0);
    }
  });
});

onUnmounted(() => {
  // Clean up scroll listeners
  if (scrollUnsubscribe) {
    scrollUnsubscribe();
    scrollUnsubscribe = null;
  }
  if (scaleUnsubscribe) {
    scaleUnsubscribe();
    scaleUnsubscribe = null;
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
</style>
