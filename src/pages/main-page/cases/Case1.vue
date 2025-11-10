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
            <p class="company-text">Apple</p>
            <h2 class="main-text">
              Simplifying Finance Workflows with AI-Driven UX
            </h2>
            <div class="tags-container">
              <span class="tag">Global User Research</span>
              <span class="tag-separator">•</span>
              <span class="tag">Concept-to-Launch Design</span>
              <span class="tag-separator">•</span>
              <span class="tag">Cross-Domain UX Alignment</span>
            </div>
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
import { useRouter } from "vue-router";
import { initAnimations } from "./case1-gsap-animations.js";
import { cleanupAnimations } from "./gsap-utils.js";

const router = useRouter();

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
  event.preventDefault();
  router.push("/story/one");
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
  /* Positioned lower so all text is initially hidden under the mask */
  transform: translate(-50%, 0);
  text-align: center;
  z-index: 1;
}

.company-text {
  margin: 0 0 12px 0;
  font-family: 'Noto Sans', sans-serif;
  font-weight: 700;
  font-size: clamp(16px, 2vw, 28px);
  line-height: 1.4;
  color: #007aff;
}

.main-text {
  margin: 0;
  font-family: 'Noto Sans', sans-serif;
  font-weight: 600;
  font-size: clamp(24px, 3vw, 48px);
  line-height: 1.2;
  color: #000000;
}

.tags-container {
  margin: 16px 0 0 0;
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
}

.tag {
  font-family: 'Noto Sans', sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.4;
  color: #666666;
}

.tag-separator {
  font-family: 'Noto Sans', sans-serif;
  font-size: 18px;
  line-height: 1.4;
  color: #666666;
  opacity: 0.5;
}

/* Mask Element (z-index: 2) */
.mask-element {
  position: absolute;
  top: 50%;
  left: 50%;
  /* Top edge of mask aligns with the line (center) */
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
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  z-index: 3;
  background-color: #007aff;
  pointer-events: none; /* Initially not clickable */
  /* transform will be handled by GSAP */
}

.line-element:hover {
  background-color: rgba(255, 255, 255, 0.8);
  border-color: rgba(0, 122, 255, 0.8);
}

.line-element:hover .open-story-text {
  color: rgba(0, 122, 255, 0.8);
}

.open-story-text {
  font-family: 'Noto Sans', sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.4;
  color: #007aff;
  white-space: nowrap;
  opacity: 0;
}
</style>
