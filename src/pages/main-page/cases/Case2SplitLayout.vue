<template>
  <div class="case2-split-layout">
    <!-- Left Side: Content -->
    <div class="case2-content">
      <div class="case2-content-inner">
        <h2 class="case2-title">{{ title }}</h2>
        <p class="case2-description">{{ description }}</p>
      </div>
    </div>

    <!-- Right Side: Image with Parallax -->
    <div class="case2-image-container" ref="imageContainer">
      <div class="case2-image-wrapper" ref="imageWrapper">
        <img
          :src="imageSrc"
          :alt="title"
          class="case2-image"
          ref="imageElement"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink } from "vue-router";

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
});

const emit = defineEmits(["navigation-click"]);

const imageContainer = ref(null);
const imageWrapper = ref(null);
const imageElement = ref(null);
let scrollListener = null;

function handleNavigationClick() {
  emit("navigation-click");
}

function updateParallax() {
  if (!imageContainer.value || !imageElement.value) return;

  const rect = imageContainer.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Calculate parallax offset based on scroll position
  // When section is at bottom of viewport: offset = 0
  // When section is at top of viewport: offset = max
  const scrollProgress = 1 - (rect.top + rect.height / 2) / viewportHeight;
  const parallaxOffset = Math.max(-50, Math.min(50, scrollProgress * 100 - 50));

  imageElement.value.style.transform = `translateY(${parallaxOffset}px)`;
}

onMounted(() => {
  scrollListener = () => {
    requestAnimationFrame(updateParallax);
  };

  window.addEventListener("scroll", scrollListener, { passive: true });

  // Find the scroll container for vue-scroll-snap
  const scrollContainer = document.querySelector(".scroll-snap-container");
  if (scrollContainer) {
    scrollContainer.addEventListener("scroll", scrollListener, { passive: true });
  }

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

.case2-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  will-change: transform;
  transition: transform 0.1s ease-out;
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

  .case2-image {
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
