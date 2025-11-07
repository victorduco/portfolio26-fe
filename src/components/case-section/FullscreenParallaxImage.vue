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
import { initializeParallaxImage } from '@/composables/useParallaxImage';

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
  initializeParallaxImage(containerRef.value, imageRef.value, {
    speed: 1.3,
    scrub: 0.5,
    markers: false
  });
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
