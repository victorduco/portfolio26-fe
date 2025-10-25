<template>
  <section
    id="case1"
    class="case-section item"
    style="background-color: #ffffff"
    ref="sectionRef"
  >
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
      <span class="button-text">
        <svg
          class="play-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M8 5v14l11-7L8 5z" fill="#007AFF" />
        </svg>
        Play Reel
      </span>

      <!-- VideoPlayer will be added here later -->
    </div>

    <!-- Open Story Button (z-index: 4) -->
    <a
      href="/story/one"
      class="open-story-button"
      @click.prevent="handleStoryLinkClick"
    >
      <span class="open-story-text">Open Story</span>
    </a>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { initAnimations } from "./case1-gsap-animations.js";
import { cleanupAnimations } from "./gsap-utils.js";

const sectionRef = ref(null);
let animationInstance = null;

onMounted(() => {
  // Initialize GSAP animations with ScrollTrigger
  if (sectionRef.value) {
    animationInstance = initAnimations(sectionRef.value);
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
.case-section.item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  height: 100vh;
}

#case1.case-section.item {
  width: 100%;
  height: 100vh;
  z-index: 100; /* Higher than other sections */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  overflow: hidden;
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
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 600;
  font-size: clamp(24px, 3vw, 48px);
  line-height: 1.2;
  color: #000000;
}

.sub-text {
  margin: 12px 0 0 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
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
  height: 50vh;
  background-color: #ffffff;
  z-index: 2;
  opacity: 1;
  /* GSAP overrides */
  translate: 0 0 !important;
  rotate: 0deg !important;
  scale: 1 !important;
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
  border-radius: 40px;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
}

/* Line Element (z-index: 3) */
.line-element {
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  z-index: 3;
  background-color: #007aff;
}

.play-icon {
  flex-shrink: 0;
}

.button-text {
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 400;
  font-size: clamp(16px, 2vw, 28px);
  line-height: 1.4;
  color: #007aff;
  white-space: nowrap;
}

/* Open Story Button (z-index: 4) */
.open-story-button {
  transform: translate(-50%, -50%);
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
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4;
  color: #007aff;
  white-space: nowrap;
}
</style>
