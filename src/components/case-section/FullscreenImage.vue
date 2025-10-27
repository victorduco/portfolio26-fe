<template>
  <div class="fullscreen-image">
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
  object-fit: cover;
  border-radius: 12px;
  display: block;
}
</style>
