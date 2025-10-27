<template>
  <!-- scroll-container: внешний контейнер для скролла -->
  <div id="case1" class="scroll-container" ref="scrollContainerRef">
    <!-- pin-container: pinned элемент на 200vh -->
    <div class="pin-container" ref="pinContainerRef">
      <!-- section-1: триггер для timeline #1 (scrub) -->
      <div class="section-1">
        <!-- circle: все анимируемые объекты -->
        <div class="circle">
          <!-- Text Container (z-index: 1) -->
          <div class="text-container">
            <h2 class="main-text">
              Cross-Domain AI Solution for Account Reconcilers
            </h2>
            <p class="sub-text">Apple</p>
          </div>

          <!-- Mask Element (z-index: 2) -->
          <div class="mask-element"></div>

          <!-- Line Element (z-index: 3) -->
          <div class="line-element">
            <!-- Video Player -->
            <VideoPlayer
              ref="videoPlayerRef"
              :video-src="videoSrc"
              :video-expanded="videoExpanded"
              class="case1-video-player"
            />
          </div>

          <!-- Open Story Button (z-index: 4) -->
          <a
            href="/story/one"
            class="open-story-button"
            @click.prevent="handleStoryLinkClick"
          >
            <span class="open-story-text">Open Story</span>
          </a>
        </div>
      </div>

      <!-- section-2: триггер для timeline #2 (auto-play) -->
      <div class="section-2"></div>

      <!-- section-3: буфер для дополнительного пространства после анимации -->
      <div class="section-3"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { initAnimations } from "./case1-gsap-animations.js";
import { cleanupAnimations } from "./gsap-utils.js";
import VideoPlayer from "@/components/VideoPlayer.vue";

const scrollContainerRef = ref(null);
const pinContainerRef = ref(null);
const videoPlayerRef = ref(null);
const videoExpanded = ref(false);

let animationInstance = null;

// Video constants
const videoSrc = new URL("@/assets/case-videos/case1.mp4", import.meta.url)
  .href;

onMounted(() => {
  // Initialize GSAP animations with ScrollTrigger
  if (pinContainerRef.value) {
    animationInstance = initAnimations(
      pinContainerRef.value,
      videoPlayerRef,
      videoExpanded
    );
  }
});

onUnmounted(() => {
  // Pause video when component is unmounted
  if (videoPlayerRef.value) {
    videoPlayerRef.value.pauseVideo();
  }

  cleanupAnimations(animationInstance);
  animationInstance = null;
});

// Handle story link click
const handleStoryLinkClick = (event) => {
  // Save video state before navigating
  if (videoPlayerRef.value) {
    videoPlayerRef.value.saveState();
  }

  if (event && event.currentTarget && event.currentTarget.href) {
    window.location.href = event.currentTarget.href;
  }
};

defineExpose({
  handleStoryLinkClick,
  videoPlayerRef,
});
</script>

<style scoped>
/* ========================================
   scroll-container: внешний контейнер
   ======================================== */
.scroll-container {
  width: 100%;
  background-color: #ffffff;
  position: relative;
}

/* ========================================
   pin-container: контейнер для всех секций
   ======================================== */
.pin-container {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* ========================================
   section-1, section-2, section-3: триггеры
   ======================================== */
.section-1 {
  width: 100%;
  height: 300vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.section-2 {
  width: 100%;
  height: 200vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
}

.section-3 {
  width: 100%;
  height: 50vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
}

/* Debug labels для секций */
.label {
  position: absolute;
  top: 20px;
  left: 20px;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-size: 14px;
  color: #999;
  pointer-events: none;
  opacity: 0.5;
}

/* ========================================
   circle: контейнер для всех анимируемых объектов
   ======================================== */
.circle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
}

.circle > * {
  pointer-events: auto;
}

/* Text Container (z-index: 1) */
.text-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50px);
  text-align: center;
  z-index: 1;
}

.main-text {
  margin: 0;
  font-family: var(--font-family-base);
  font-weight: 600;
  font-size: clamp(24px, 3vw, 48px);
  line-height: 1.2;
  color: #000000;
}

.sub-text {
  margin: 12px 0 0 0;
  font-family: var(--font-family-base);
  font-weight: 400;
  font-size: clamp(16px, 2vw, 28px);
  line-height: 1.4;
  color: #000000;
}

/* Mask Element (z-index: 2) */
.mask-element {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100vw;
  height: 25vh;
  background-color: #ffffff;
  z-index: 2;
  opacity: 1;
}

/* Common button styles */
.line-element,
.open-story-button {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #007aff;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
}

/* Line Element (z-index: 3) */
.line-element {
  width: 40px;
  height: 40px;
  z-index: 3;
  background-color: transparent;
  border: 50px solid #007aff;
}

/* Video Player */
.case1-video-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 1;
  pointer-events: auto;
  z-index: 1;
}

/* Open Story Button (z-index: 4) */
.open-story-button {
  width: 300px;
  height: 0px;
  z-index: 4;
  background-color: #ffffff;
  opacity: 0;
}

.open-story-button:hover {
  border-color: #007bffde;
}

.open-story-text {
  font-family: var(--font-family-base);
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4;
  color: #007aff;
  white-space: nowrap;
}
</style>
