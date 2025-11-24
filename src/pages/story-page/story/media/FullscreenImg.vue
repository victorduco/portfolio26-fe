<template>
  <div class="fullscreen-image__container">
    <img :src="imageSrc" :alt="alt" class="fullscreen-image__img" loading="lazy" />
  </div>
</template>

<script setup>
defineProps({
  imageSrc: { type: String, required: true },
  alt: { type: String, default: 'Case image' },
});
</script>

<style scoped>
.fullscreen-image__container {
  width: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-image__img {
  max-width: 100%;
  max-height: 100vh;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  margin: auto;
}
</style>
