<template>
  <div class="case3-unique-layout" ref="layoutElement">
    <!-- Container with 80% width -->
    <div class="case3-container">
      <!-- Text Section: 30% height -->
      <div class="case3-text-section" ref="textSection">
        <motion.h2
          class="case3-title"
          ref="titleElement"
          :variants="textVariants"
          :animate="titleState"
          :transition="textTransition"
          initial="hidden"
        >
          {{ title }}
        </motion.h2>
        <motion.p
          class="case3-company"
          ref="companyElement"
          :variants="textVariants"
          :animate="companyState"
          :transition="textTransition"
          initial="hidden"
        >
          {{ company }}
        </motion.p>
      </div>

      <!-- Image Section: 70% height -->
      <div class="case3-image-section" ref="imageContainer">
        <!-- Media container with background image and video overlay -->
        <motion.div
          class="case3-media-container"
          :style="{ backgroundImage: `url(${imageSrc})` }"
          ref="mediaContainer"
          :variants="mediaVariants"
          :initial="'initial'"
          :animate="animationState"
          :transition="smoothTransition"
        >
          <!-- Video overlay positioned absolutely -->
          <video
            v-if="videoSrc"
            :src="videoSrc"
            class="case3-video"
            :style="{
              left: videoPositionX,
              top: videoPositionY,
              '--video-scale': videoScale,
            }"
            muted
            playsinline
            ref="videoElement"
          ></video>
        </motion.div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { motion } from "motion-v";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  imageSrc: {
    type: String,
    required: true,
  },
  videoSrc: {
    type: String,
    default: "",
  },
  videoPositionX: {
    type: String,
    default: "62.5%",
  },
  videoPositionY: {
    type: String,
    default: "23%",
  },
  videoScale: {
    type: Number,
    default: 0.33,
  },
  backgroundColor: {
    type: String,
    default: "#EAF5FF",
  },
});

const emit = defineEmits(["background-change", "navigation-click"]);

const layoutElement = ref(null);
const textSection = ref(null);
const titleElement = ref(null);
const companyElement = ref(null);
const imageContainer = ref(null);
const mediaContainer = ref(null);
const videoElement = ref(null);
let scrollListener = null;
let intersectionObserver = null;
let hasVideoPlayed = ref(false);
let videoTimeUpdateHandler = null;

// Animation states
const animationState = ref("initial");
const titleState = ref("hidden");
const companyState = ref("hidden");

// Motion variants for zoom-out animation
const mediaVariants = {
  initial: {
    scale: 5.5,
    x: "-160%",
    y: "30%",
  },
  animate: {
    scale: 1,
    x: "0%",
    y: "0%",
  },
};

// Smooth transition with delay
const smoothTransition = {
  duration: 1,
  ease: "easeInOut",
  delay: 0.5,
};

// Text animation variants
const textVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Text transition config
const textTransition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1],
  duration: 0.8,
};

function triggerTextAnimation() {
  // After zoom completes (0.5s delay + 1s duration = 1.5s), show title
  setTimeout(() => {
    titleState.value = "visible";

    // Show company 0.25s after title
    setTimeout(() => {
      companyState.value = "visible";
    }, 250);
  }, 1500); // After zoom animation completes
}

function triggerFadeIn() {
  // Play zoom and video only once
  if (!hasVideoPlayed.value) {
    // Trigger zoom-out animation
    animationState.value = "animate";

    // Trigger text animation after zoom completes
    triggerTextAnimation();

    // Play video from 2.2 seconds with ease-out effect
    if (videoElement.value) {
      videoElement.value.currentTime = 3.5;

      // Add timeupdate listener for ease-out effect
      videoTimeUpdateHandler = () => {
        if (!videoElement.value) return;

        const video = videoElement.value;
        const duration = video.duration - 2.2; // Duration from start point
        const currentTime = video.currentTime - 2.2; // Time from start point
        const progress = currentTime / duration; // 0 to 1

        // Ease-out formula: playbackRate goes from 1.5 to 0.45 as progress approaches 1
        // Using quadratic ease-out: 1 - (1-progress)^2
        const easeOutProgress = 1 - Math.pow(1 - progress, 2);
        const minRate = 1; // 0.3 * 1.5
        const maxRate = 2;
        video.playbackRate = maxRate - easeOutProgress * (maxRate - minRate);
      };

      videoElement.value.addEventListener("timeupdate", videoTimeUpdateHandler);

      videoElement.value.play().catch((err) => {
        console.error("[Case3UniqueLayout] Video play error:", err);
      });
    }

    hasVideoPlayed.value = true;
  }
}

function updateParallax() {
  // Update parallax for entire image container
  if (imageContainer.value) {
    const rect = imageContainer.value.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate parallax offset based on scroll position
    const scrollProgress = 1 - (rect.top + rect.height / 2) / viewportHeight;
    const parallaxOffset = Math.max(
      -50,
      Math.min(50, scrollProgress * 100 - 50)
    );

    imageContainer.value.style.transform = `translateY(${parallaxOffset}px)`;
  }
}

onMounted(() => {
  // Setup IntersectionObserver to trigger animation when scrolling into view
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          triggerFadeIn();
        }
        // Don't reset animation when leaving viewport - play only once
      });
    },
    {
      threshold: 0.3, // Trigger when 30% of element is visible
    }
  );

  if (layoutElement.value) {
    intersectionObserver.observe(layoutElement.value);
  }

  scrollListener = () => {
    requestAnimationFrame(updateParallax);
  };

  window.addEventListener("scroll", scrollListener, { passive: true });

  // Find the scroll container for vue-scroll-snap
  const scrollContainer = document.querySelector(".scroll-snap-container");
  if (scrollContainer) {
    scrollContainer.addEventListener("scroll", scrollListener, {
      passive: true,
    });
  }

  // Don't trigger animations immediately - wait for scroll
  updateParallax();
});

onUnmounted(() => {
  if (scrollListener) {
    window.removeEventListener("scroll", scrollListener);
    const scrollContainer = document.querySelector(".scroll-snap-container");
    if (scrollContainer) {
      scrollContainer.removeEventListener("scroll", scrollListener);
    }
  }

  if (videoTimeUpdateHandler && videoElement.value) {
    videoElement.value.removeEventListener("timeupdate", videoTimeUpdateHandler);
    videoTimeUpdateHandler = null;
  }

  if (intersectionObserver && layoutElement.value) {
    intersectionObserver.unobserve(layoutElement.value);
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }
});

function handleEnter() {
  // Called when section enters viewport
  emit("background-change", props.backgroundColor);
  // Don't call triggerFadeIn here - it's handled by IntersectionObserver
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
.case3-unique-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
}

/* Container with 80% width */
.case3-container {
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 0;
}

/* Text Section: 60% height */
.case3-text-section {
  min-height: 50%;
  height: 50%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(12px, 1.5vh, 20px);
  flex-shrink: 0;
}

/* Title Styling from Figma */
.case3-title {
  margin: 0;
  font-family: "Inter", "SF Pro", "SF Pro Display", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: clamp(36px, 3.8vw, 61px);
  line-height: 1.21;
  text-align: center;
  color: #1b5791;
  width: 100%;
  max-width: 100%;
  padding: 0 20px;
}

/* Company/Subtitle Styling from Figma */
.case3-company {
  margin: 0;
  font-family: "Inter", "SF Pro", "SF Pro Display", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: clamp(20px, 1.9vw, 31px);
  line-height: 1.23;
  text-align: center;
  color: #235e98;
  width: 100%;
  max-width: 100%;
}

/* Image Section: 40% height */
.case3-image-section {
  height: 50%;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: visible;
  position: relative;
  flex-shrink: 0;
  will-change: transform;
  transition: transform 0.1s ease-out;
  margin-bottom: 0;
}

/* Media container - holds both image and video */
.case3-media-container {
  position: relative;
  width: 100%;
  aspect-ratio: 2550 / 1912; /* Match image dimensions */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  opacity: 1;
  transform-origin: center center;
  will-change: transform;
}

/* Video overlay */
.case3-video {
  position: absolute;
  object-fit: contain;
  pointer-events: none;
  z-index: 1;
  aspect-ratio: 1974 / 1080;
  border-radius: 10px;
  /* Use percentage of parent container */
  /* Since parent has fixed aspect-ratio matching the image, */
  /* the video will scale proportionally with the image */
  width: calc(var(--video-scale, 0.25) * 100%);
  height: auto;
}

/* Fade-in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Responsive */
@media (max-width: 899px) {
  .case3-container {
    width: 90%;
  }

  .case3-text-section {
    height: 25%;
    gap: clamp(10px, 1.2vh, 16px);
  }

  .case3-image-section {
    height: 75%;
  }

  .case3-title {
    font-size: clamp(28px, 5vw, 40px);
    padding: 0 16px;
  }

  .case3-company {
    font-size: clamp(18px, 3.5vw, 24px);
  }
}

@media (max-width: 600px) {
  .case3-container {
    width: 95%;
  }

  .case3-text-section {
    height: 20%;
  }

  .case3-image-section {
    height: 80%;
  }

  .case3-title {
    font-size: clamp(24px, 4.5vw, 32px);
    padding: 0 12px;
  }

  .case3-company {
    font-size: clamp(16px, 3vw, 20px);
  }
}
</style>
