<template>
  <div class="images-grid" ref="containerRef">
    <div v-for="(img, i) in images" :key="i" class="image-strip" :style="getStripStyle(i)">
      <img :ref="el => imageRefs[i] = el" :src="img.src" :alt="`${alt} ${i + 1}`" class="parallax-image" loading="lazy" @load="handleImageLoad(i, $event)" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
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
  maxWidth1: { type: String, default: null },
  maxWidth2: { type: String, default: null },
  maxWidth3: { type: String, default: null },
  alt: { type: String, default: 'Parallax image' },
});

const containerRef = ref(null);
const imageRefs = ref([]);
const imageSizes = reactive([
  { naturalWidth: null, aspectRatio: null },
  { naturalWidth: null, aspectRatio: null },
  { naturalWidth: null, aspectRatio: null },
]);

const images = [
  { src: props.image1, width: props.width1, maxWidth: props.maxWidth1, speed: props.speed1 },
  { src: props.image2, width: props.width2, maxWidth: props.maxWidth2, speed: props.speed2 },
  { src: props.image3, width: props.width3, maxWidth: props.maxWidth3, speed: props.speed3 },
];

const handleImageLoad = (index, event) => {
  const img = event.target;
  imageSizes[index].naturalWidth = img.naturalWidth;
  imageSizes[index].aspectRatio = img.naturalWidth / img.naturalHeight;
};

const getStripStyle = (index) => {
  const manualMaxWidth = images[index].maxWidth;

  const style = {
    width: images[index].width // Базовая ширина в процентах
  };

  // Если задан вручную maxWidth - используем его как максимальную ширину контейнера
  if (manualMaxWidth) {
    style.maxWidth = manualMaxWidth;
  }

  return style;
};

onMounted(() => {
  imageRefs.value.forEach((img, i) => {
    if (img && containerRef.value) {
      initializeParallaxImage(containerRef.value, img, { speed: images[i].speed, scrub: 0.5 });
    }
  });
});
</script>

<style scoped>
.images-grid { display: flex; gap: 0; width: 85%; height: 100%; margin: 0 auto; justify-content: center; }
.image-strip { height: 100%; overflow: hidden; display: flex; align-items: flex-start; justify-content: center; }
.parallax-image { width: 100%; min-height: 250%; object-fit: contain; object-position: center top; }
</style>
