<template>
  <div class="images-stack" ref="containerRef">
    <div v-for="(img, i) in images" :key="i" class="image-row" :style="{ height: img.height }">
      <img :ref="el => imageRefs[i] = el" :src="img.src" :alt="`${alt} ${i + 1}`" class="horizontal-parallax-image" loading="lazy" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { initializeHorizontalParallaxImage } from '@/composables/useHorizontalParallaxImage';

const props = defineProps({
  image1: { type: String, required: true },
  image2: { type: String, required: true },
  image3: { type: String, required: true },
  speed1: { type: Number, default: 1.3 },
  speed2: { type: Number, default: 1.0 },
  speed3: { type: Number, default: 1.8 },
  height1: { type: String, default: '33.33%' },
  height2: { type: String, default: '33.33%' },
  height3: { type: String, default: '33.33%' },
  alt: { type: String, default: 'Horizontal parallax image' },
});

const containerRef = ref(null);
const imageRefs = ref([]);
const images = [
  { src: props.image1, height: props.height1, speed: props.speed1 },
  { src: props.image2, height: props.height2, speed: props.speed2 },
  { src: props.image3, height: props.height3, speed: props.speed3 },
];

onMounted(() => {
  imageRefs.value.forEach((img, i) => {
    if (img && containerRef.value) {
      initializeHorizontalParallaxImage(containerRef.value, img, { speed: images[i].speed, scrub: 0.5 });
    }
  });
});
</script>

<style scoped>
.images-stack { display: flex; flex-direction: column; width: 100%; height: 100%; }
.image-row { width: 100%; overflow: hidden; display: flex; align-items: center; justify-content: flex-start; }
.horizontal-parallax-image { width: auto; min-width: 250%; height: 100%; object-fit: contain; object-position: left center; }
</style>
