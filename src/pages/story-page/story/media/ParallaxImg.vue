<template>
  <div class="images-grid" ref="containerRef">
    <div v-for="(img, i) in images" :key="i" class="image-strip" :style="{ width: img.width }">
      <img :ref="el => imageRefs[i] = el" :src="img.src" :alt="`${alt} ${i + 1}`" class="parallax-image" loading="lazy" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { initializeParallaxImage } from '@/composables/useParallaxImage';

const props = defineProps({
  image1: { type: String, required: true },
  image2: { type: String, required: true },
  image3: { type: String, required: true },
  speed1: { type: Number, default: 1.3 },
  speed2: { type: Number, default: 1.0 },
  speed3: { type: Number, default: 1.8 },
  width1: { type: String, default: '20%' },
  width2: { type: String, default: '50%' },
  width3: { type: String, default: '30%' },
  alt: { type: String, default: 'Parallax image' },
});

const containerRef = ref(null);
const imageRefs = ref([]);
const images = [
  { src: props.image1, width: props.width1, speed: props.speed1 },
  { src: props.image2, width: props.width2, speed: props.speed2 },
  { src: props.image3, width: props.width3, speed: props.speed3 },
];

onMounted(() => {
  imageRefs.value.forEach((img, i) => {
    if (img && containerRef.value) {
      initializeParallaxImage(containerRef.value, img, { speed: images[i].speed, scrub: 0.5 });
    }
  });
});
</script>

<style scoped>
.images-grid { display: flex; width: 85%; height: 100%; margin: 0 auto; }
.image-strip { height: 100%; overflow: hidden; display: flex; align-items: flex-start; justify-content: center; }
.parallax-image { width: 100%; height: 250%; min-height: 250%; object-fit: cover; object-position: center top; }
</style>
