<template>
  <div class="case2-split-layout">
    <!-- Left Side: Content -->
    <div class="case2-content">
      <div class="case2-content-inner">
        <motion.h2
          class="case2-title"
          :variants="textVariants"
          :animate="titleState"
          :transition="textTransition"
          initial="hidden"
        >
          {{ title }}
        </motion.h2>
        <motion.p
          class="case2-description"
          :variants="textVariants"
          :animate="descriptionState"
          :transition="textTransition"
          initial="hidden"
        >
          {{ description }}
        </motion.p>
      </div>
    </div>

    <!-- Right Side: Image with Parallax -->
    <div class="case2-image-container" ref="imageContainer">
      <div class="case2-image-wrapper" ref="imageWrapper">
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
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { motion } from "motion-v";

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

const imageContainer = ref(null);
const imageWrapper = ref(null);
const imageElement = ref(null);
const videoElement = ref(null);
let scrollListener = null;
let wasInViewport = ref(false);

// Animation states
const titleState = ref("hidden");
const descriptionState = ref("hidden");
const videoState = ref("visible");
const videoProgress = ref(0); // 0 to 1, represents scroll progress

// Always show video when videoSrc is provided (it will reset each time)
const showVideo = computed(() => !!props.videoSrc);

// Text animation variants
const textVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Video animation variants
const videoVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};


// Text transition config
const textTransition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1],
  duration: 0.8,
};

// Video transition config
const videoTransition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1],
  duration: 0.5,
};


function getVideoElement() {
  if (!videoElement.value) return null;
  // motion.video returns a Vue component, get the actual DOM element
  return videoElement.value.$el || videoElement.value;
}

function getImageElement() {
  // Now it's a regular img element
  return imageElement.value;
}

function updateVideoProgress() {
  if (!imageContainer.value) return;

  const rect = imageContainer.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Calculate progress based on how much of the section is visible
  // When section starts entering from bottom: progress = 0
  // When section is fully visible/centered: progress = 1
  const sectionTop = rect.top;
  const sectionHeight = rect.height;

  // Progress calculation:
  // Start: when bottom of section enters viewport (top = viewportHeight)
  // End: when section is at center or above (top = 0)
  let progress = 0;

  if (sectionTop <= viewportHeight && sectionTop + sectionHeight >= 0) {
    // Section is visible
    if (sectionTop <= 0) {
      // Section is at top or scrolled past - full progress
      progress = 1;
    } else {
      // Section is entering - calculate progress
      progress = 1 - (sectionTop / viewportHeight);
    }
  }

  // Clamp progress between 0 and 1
  progress = Math.max(0, Math.min(1, progress));
  videoProgress.value = progress;

  // Update video currentTime based on progress
  const video = getVideoElement();
  if (video && video.duration && !isNaN(video.duration)) {
    const targetTime = progress * video.duration;
    // Only update if difference is significant to avoid jitter
    if (Math.abs(video.currentTime - targetTime) > 0.05) {
      video.currentTime = targetTime;
    }

    // When video reaches the end (99% progress), hide it to show the static image
    if (progress >= 0.99) {
      videoState.value = "hidden";
    } else {
      videoState.value = "visible";
    }
  }
}

function triggerTextAnimation() {
  // Show title after 0.25s
  setTimeout(() => {
    titleState.value = "visible";

    // Show description 0.25s after title
    setTimeout(() => {
      descriptionState.value = "visible";
    }, 250);
  }, 250);
}

function hideText() {
  // Animate text back to hidden when leaving viewport
  titleState.value = "hidden";
  descriptionState.value = "hidden";
}

function checkIfInView() {
  if (!imageContainer.value) return;

  const rect = imageContainer.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  const inViewport = rect.top < viewportHeight * 0.5 && rect.bottom > 0;

  // When entering viewport - trigger text animation
  if (inViewport && !wasInViewport.value) {
    wasInViewport.value = true;
    triggerTextAnimation();
  }
  // When leaving viewport - hide text
  else if (!inViewport && wasInViewport.value) {
    wasInViewport.value = false;
    hideText();
  }
}

function updateParallax() {
  if (!imageContainer.value) return;

  const rect = imageContainer.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Calculate parallax offset based on scroll position
  // When section is at bottom of viewport: offset = 0
  // When section is at top of viewport: offset = max
  const scrollProgress = 1 - (rect.top + rect.height / 2) / viewportHeight;
  const parallaxOffset = Math.max(-50, Math.min(50, scrollProgress * 100 - 50));

  // Apply parallax to video if it's showing, otherwise to image
  if (showVideo.value) {
    const video = getVideoElement();
    if (video && video.style) {
      video.style.transform = `translateY(${parallaxOffset}px)`;
    }
  } else {
    const image = getImageElement();
    if (image && image.style) {
      image.style.transform = `translateY(${parallaxOffset}px)`;
    }
  }
}

onMounted(() => {
  scrollListener = () => {
    requestAnimationFrame(() => {
      updateParallax();
      checkIfInView();
      updateVideoProgress(); // Update video progress on scroll
    });
  };

  window.addEventListener("scroll", scrollListener, { passive: true });

  // Find the scroll container for vue-scroll-snap
  const scrollContainer = document.querySelector(".scroll-snap-container");
  if (scrollContainer) {
    scrollContainer.addEventListener("scroll", scrollListener, { passive: true });
  }

  updateParallax();
  checkIfInView();
  updateVideoProgress(); // Initial video progress update
});

onUnmounted(() => {
  if (scrollListener) {
    window.removeEventListener("scroll", scrollListener);
    const scrollContainer = document.querySelector(".scroll-snap-container");
    if (scrollContainer) {
      scrollContainer.removeEventListener("scroll", scrollListener);
    }
  }
});

function handleEnter() {
  // Called when section enters viewport
  updateParallax();
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
  height: 100dvh;
  overflow: hidden;
}

/* Left Side: Content - positioned over the image */
.case2-content {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: clamp(60px, 10vh, 120px) 20px 20px 20px;
  box-sizing: border-box;
  pointer-events: none;
}

.case2-content-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: clamp(16px, 2vh, 24px);
  padding: 0 clamp(40px, 2.5vw, 60px);
  max-width: 900px;
  width: 100%;
  pointer-events: auto;
}

.case2-title {
  margin: 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 600;
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #000000;
  text-align: left;
}

.case2-description {
  margin: 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 400;
  font-size: clamp(14px, 1.5vw, 18px);
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.7);
  text-align: left;
  max-width: 600px;
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
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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
}
</style>
