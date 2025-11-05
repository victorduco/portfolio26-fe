<template>
  <div class="fullscreen-image" :style="{ backgroundColor: backgroundColor }">
    <img
      :src="imageSrc"
      :alt="alt"
      class="fullscreen-image__img"
      loading="lazy"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  imageSrc: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: 'Case image',
  },
  backgroundColor: {
    type: String,
    default: 'transparent',
  },
});
</script>

<style scoped>
.fullscreen-image {
  width: 100%;
  height: 100vh;
  padding: 16px;
  box-sizing: border-box;
}

.fullscreen-image__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
  display: block;
}
</style>
