<template>
  <div class="fullscreen-parallax-wrapper">
    <h3 v-if="imageLabel" class="image-label">{{ imageLabel }}</h3>
    <div class="fullscreen-parallax" ref="containerRef">
      <div class="background-container" :style="{ backgroundColor: backgroundColor }">
        <div class="image-container">
          <img
            ref="imageRef"
            :src="imageSrc"
            :alt="alt"
            class="parallax-image"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const props = defineProps({
  imageSrc: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: 'Parallax image',
  },
  backgroundColor: {
    type: String,
    default: 'transparent',
  },
  imageLabel: {
    type: String,
    default: '',
  },
});

const containerRef = ref(null);
const imageRef = ref(null);

onMounted(() => {
  const img = imageRef.value;
  if (!img) return;

  const setupAnimation = () => {
    // Fast parallax movement: show top of image at start, bottom at end
    // Image starts at top (0%) and moves down to show bottom (-60%)
    // 60% movement matches 160% image height to show full content
    gsap.fromTo(
      img,
      {
        yPercent: 0,
      },
      {
        yPercent: -60,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.value,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
          markers: false,
          invalidateOnRefresh: true,
        },
      }
    );
  };

  // Wait for image to load before setting up animation
  if (img.complete) {
    setupAnimation();
  } else {
    img.addEventListener('load', () => {
      setupAnimation();
      // Refresh ScrollTrigger after image loads
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    });
  }
});
</script>

<style scoped>
.fullscreen-parallax-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
}

.image-label {
  width: 100%;
  max-width: 1200px;
  margin: 0 0 -8px 0;
  padding: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  line-height: 1.2;
  color: inherit;
  opacity: 0.5;
}

.fullscreen-parallax {
  width: 100%;
  height: 100vh;
  padding: 16px;
  box-sizing: border-box;
}

.background-container {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.parallax-image {
  width: 100%;
  height: 160%;
  min-height: 160%;
  max-width: none;
  max-height: none;
  object-fit: cover;
  object-position: center top;
  display: block;
}
</style>
