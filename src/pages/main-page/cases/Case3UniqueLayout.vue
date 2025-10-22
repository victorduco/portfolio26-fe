<template>
  <div class="case3-unique-layout" ref="layoutElement">
    <!-- Container with 80% width -->
    <div class="case3-container">
      <!-- Text Section: 30% height -->
      <div class="case3-text-section" ref="textSection">
        <motion.div
          class="case3-title-wrapper"
          ref="titleElement"
          :variants="textVariants"
          :animate="titleState"
          :transition="textTransition"
          initial="hidden"
        >
          <h2 class="case3-title case3-title-shadow">
            {{ title }}
          </h2>
          <h2 class="case3-title case3-title-main" aria-hidden="true">
            {{ title }}
          </h2>
        </motion.div>
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
        <motion.button
          class="case3-button-wrapper"
          ref="buttonElement"
          :variants="textVariants"
          :animate="buttonState"
          :transition="textTransition"
          initial="hidden"
          @click="handleButtonClick"
        >
          <div class="case3-button case3-button-shadow"></div>
          <div class="case3-button case3-button-main">
            <svg class="case3-button-icon" width="24" height="29" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.04785C11.0513 2.04785 10.2734 2.81756 10.2734 3.75977C10.2737 4.70179 11.0515 5.4707 12 5.4707C12.9485 5.47061 13.7254 4.70173 13.7256 3.75977C13.7256 2.81762 12.9486 2.04795 12 2.04785ZM9.93164 6.79004L9.88867 6.75977C8.907 6.07995 8.30577 4.95598 8.30566 3.75977C8.30566 1.7427 9.96197 0.0996094 12 0.0996094C14.0379 0.0997302 15.6943 1.74298 15.6943 3.75977C15.6942 4.95593 15.0928 6.07997 14.1113 6.75977L14.0684 6.79004V7.61914H15.4854L15.5137 7.59375C15.8855 7.2664 16.3711 7.08208 16.8779 7.08203C18.0214 7.08203 18.9463 7.99913 18.9463 9.12988C18.9463 10.2606 18.0214 11.1777 16.8779 11.1777C16.3711 11.1777 15.8855 10.9934 15.5137 10.666L15.4854 10.6406H14.0684V21.6641C14.0684 21.8623 14.1591 22.0418 14.3125 22.1621C14.4664 22.2827 14.6596 22.3272 14.8564 22.2832L14.8574 22.2822C17.1427 21.7431 18.5901 20.8739 19.2119 19.6084L19.2529 19.5234L19.1709 19.4775L18.165 18.9092C18.0389 18.8331 17.9556 18.7051 17.9424 18.5674C17.9292 18.4234 17.9861 18.2883 18.0967 18.1963L22.417 14.582L22.416 14.5811C22.541 14.4801 22.7143 14.4513 22.8623 14.5117L22.8643 14.5127C23.0134 14.5692 23.1191 14.7041 23.1367 14.8652V14.8672L23.8955 20.9893L23.8965 20.9902C23.9183 21.1509 23.8483 21.3069 23.7119 21.3984L23.709 21.4004C23.5952 21.4831 23.4458 21.5012 23.3115 21.4541L23.2549 21.4297L22.1055 20.8389L22.0283 20.7998L21.9785 20.8711C21.3415 21.7804 19.6621 23.9276 17.2842 25.0977C14.1213 26.6494 12.9137 27.7855 12.4717 28.5225L12.3955 28.6602C12.3757 28.6945 12.3595 28.7178 12.3418 28.7354L12.333 28.7441L12.3262 28.7549C12.3185 28.7676 12.3089 28.7774 12.2959 28.7852L12.2852 28.791L12.2764 28.7998C12.2587 28.8174 12.2348 28.8329 12.2002 28.8525C12.1771 28.8635 12.1527 28.8723 12.1191 28.8818L12.1152 28.8838C12.0793 28.8957 12.0414 28.9004 12 28.9004C11.9586 28.9004 11.9207 28.8957 11.8848 28.8838C11.8516 28.8728 11.8259 28.864 11.8008 28.8516L11.7871 28.8447C11.7594 28.8283 11.739 28.8151 11.7236 28.7998L11.7148 28.791L11.7041 28.7852C11.6911 28.7774 11.6815 28.7675 11.6738 28.7549L11.667 28.7441L11.6582 28.7354C11.6413 28.7185 11.625 28.6959 11.6064 28.6592C11.2381 27.9356 10.0898 26.753 6.71582 25.0977C4.33777 23.9274 2.6584 21.7802 2.02148 20.8711L1.97168 20.7998L1.89453 20.8389L0.745117 21.4297C0.597547 21.505 0.421166 21.495 0.291016 21.4004L0.288086 21.3984L0.240234 21.3613C0.135756 21.2679 0.0843928 21.1308 0.103516 20.9902L0.104492 20.9893L0.863281 14.8672V14.8652C0.880913 14.7042 0.985755 14.5693 1.13477 14.5127H1.13672C1.29138 14.4514 1.45915 14.4814 1.58398 14.583L5.90332 18.1963C6.01387 18.2883 6.07083 18.4234 6.05762 18.5674C6.04443 18.7053 5.96039 18.8331 5.83398 18.9092L4.82812 19.4775L4.74609 19.5234L4.78809 19.6084C5.40976 20.8739 6.8564 21.7431 9.1416 22.2822L9.14258 22.2832C9.33955 22.3273 9.53355 22.2829 9.6875 22.1621C9.84091 22.0417 9.93164 21.8623 9.93164 21.6641V10.6406H8.51465L8.48633 10.666C8.11445 10.9935 7.62807 11.1777 7.12109 11.1777C5.97775 11.1776 5.05371 10.2605 5.05371 9.12988C5.05371 7.99924 5.97775 7.08221 7.12109 7.08203C7.62807 7.08203 8.11445 7.26622 8.48633 7.59375L8.51465 7.61914H9.93164V6.79004Z" fill="white" stroke="#C33D33" stroke-width="0.2"/>
            </svg>
            <span class="case3-button-text">Open Story</span>
          </div>
        </motion.button>
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
          <!-- <video
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
          ></video> -->
        </motion.div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { motion } from "motion-v";
import { useRouter } from "vue-router";

const router = useRouter();

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
    default: "#B9E2F7",
  },
  routeTo: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["background-change", "navigation-click"]);

function handleButtonClick() {
  if (props.routeTo) {
    emit("navigation-click");
    handleStoryLinkClick();
    router.push(props.routeTo);
  }
}

const layoutElement = ref(null);
const textSection = ref(null);
const titleElement = ref(null);
const companyElement = ref(null);
const buttonElement = ref(null);
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
const buttonState = ref("hidden");

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

      // Show button 0.25s after company
      setTimeout(() => {
        buttonState.value = "visible";
      }, 250);
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
  justify-content: space-between;
  padding: 12vh 0 0;
}

/* Text Section: 60% height */
.case3-text-section {
  width: 100%;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(7px, 1vh, 15px);
  padding-bottom: 2vh;
}

/* Title wrapper with hard shadow effect */
.case3-title-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
}

/* Base title styling */
.case3-title {
  margin: 0;
  font-family: "Inter", "SF Pro", "SF Pro Display", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: clamp(36px, 3.8vw, 61px);
  line-height: 1.21;
  text-align: center;
  width: 100%;
  max-width: 100%;
  padding: 0 20px;
}

/* Shadow layer (back) */
.case3-title-shadow {
  position: absolute;
  top: 4px;
  left: 5px;
  color: rgba(10, 49, 74, 0.21);
  z-index: 0;
}

/* Main layer (front) */
.case3-title-main {
  position: relative;
  color: #143154;
  z-index: 1;
}

/* Company/Subtitle Styling from Figma */
.case3-company {
  margin: 0;
  font-family: "Inter", "SF Pro", "SF Pro Display", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: clamp(20px, 1.9vw, 31px);
  line-height: 1.23;
  text-align: center;
  color: #1E426D;
  width: 100%;
  max-width: 100%;
}

/* Button wrapper with hard shadow effect */
.case3-button-wrapper {
  position: relative;
  width: clamp(280px, 23vw, 370px);
  height: clamp(58px, 4.8vw, 77px);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  margin-top: clamp(4px, 0.5vh, 8px);
  transition: transform 0.2s ease;
}

.case3-button-wrapper:hover {
  transform: translateY(-2px);
}

.case3-button-wrapper:active {
  transform: translateY(0);
}

/* Base button styling */
.case3-button {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Inter", "SF Pro", "SF Pro Display", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: clamp(16px, 1.3vw, 21px);
  line-height: 1;
}

/* Shadow layer (back) */
.case3-button-shadow {
  top: 10px;
  left: 8px;
  background: #1E426D;
  z-index: 0;
}

/* Main layer (front) */
.case3-button-main {
  top: 0;
  left: 0;
  background: linear-gradient(91.24deg, #CA4034 1.06%, #992C28 74.69%);
  color: white;
  z-index: 1;
  position: relative;
}

/* Button icon */
.case3-button-icon {
  position: absolute;
  left: clamp(18px, 1.5vw, 24px);
  width: clamp(18px, 1.5vw, 24px);
  height: auto;
  flex-shrink: 0;
}

/* Button text */
.case3-button-text {
  flex-shrink: 0;
}

/* Image Section: 40% height */
.case3-image-section {
  width: 100%;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  position: relative;
  will-change: transform;
  transition: transform 0.1s ease-out;
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

/* Large Desktop - increase all element sizes */
@media (min-width: 1920px) {
  .case3-title {
    font-size: clamp(61px, 4vw, 70px);
    line-height: 1.19;
  }

  .case3-company {
    font-size: clamp(31px, 2vw, 36px);
  }

  .case3-button-wrapper {
    width: clamp(370px, 24vw, 425px);
    height: clamp(77px, 5vw, 88px);
  }

  .case3-button {
    font-size: clamp(21px, 1.4vw, 24px);
  }

  .case3-button-icon {
    width: clamp(24px, 1.6vw, 28px);
    left: clamp(24px, 1.6vw, 28px);
  }

  .case3-title-shadow {
    top: 5px;
    left: 6px;
  }

  .case3-button-shadow {
    top: 11px;
    left: 9px;
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

  .case3-button-wrapper {
    width: clamp(240px, 70vw, 320px);
    height: clamp(52px, 12vw, 68px);
  }

  .case3-button {
    font-size: clamp(14px, 3.5vw, 18px);
  }

  .case3-button-icon {
    width: clamp(16px, 4vw, 20px);
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

  .case3-button-wrapper {
    width: 90%;
    max-width: 280px;
    height: clamp(48px, 11vw, 60px);
  }

  .case3-button {
    font-size: clamp(13px, 3.2vw, 16px);
    gap: 8px;
  }

  .case3-button-icon {
    width: clamp(14px, 3.5vw, 18px);
  }

  .case3-button-shadow {
    top: 6px;
    left: 5px;
  }
}
</style>
