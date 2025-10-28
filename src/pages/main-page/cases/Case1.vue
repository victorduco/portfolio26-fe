<template>
  <!-- scroll-container: внешний контейнер для скролла -->
  <div id="case1" class="scroll-container" ref="scrollContainerRef">
    <!-- pin-container: pinned элемент на 200vh -->
    <div class="pin-container" ref="pinContainerRef">
      <!-- section-1: animation trigger -->
      <div class="section-1">
        <!-- circle: animated elements container -->
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

          <!-- Line Element (z-index: 3) - transforms into button -->
          <a
            href="/story/one"
            class="line-element"
            @click.prevent="handleStoryLinkClick"
          >
            <span class="open-story-text">Open Story</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { initAnimations } from "./case1-gsap-animations.js";
import { cleanupAnimations } from "./gsap-utils.js";

const scrollContainerRef = ref(null);
const pinContainerRef = ref(null);

let animationInstance = null;

onMounted(() => {
  // Initialize GSAP animations with ScrollTrigger
  if (pinContainerRef.value) {
    animationInstance = initAnimations(pinContainerRef.value);
  }
});

onUnmounted(() => {
  cleanupAnimations(animationInstance);
  animationInstance = null;
});

// Handle story link click
const handleStoryLinkClick = (event) => {
  if (event && event.currentTarget && event.currentTarget.href) {
    window.location.href = event.currentTarget.href;
  }
};

defineExpose({
  handleStoryLinkClick,
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
   section-1: animation trigger
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

/* Line Element (z-index: 3) - transforms into button */
.line-element {
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
  width: 40px;
  height: 40px;
  z-index: 3;
  background-color: #007aff;
}

.line-element:hover {
  border-color: #007bffde;
}

.open-story-text {
  font-family: var(--font-family-base);
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4;
  color: #007aff;
  white-space: nowrap;
  opacity: 0;
}
</style>
