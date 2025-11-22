<template>
  <div class="next-story-plaque">
    <p class="next-story-text">Next: Story {{ storyNumber }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  storyNumber: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.next-story-plaque {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px) brightness(0.7);
  -webkit-backdrop-filter: blur(10px) brightness(0.7);
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  position: relative;
  z-index: 100;
}

.next-story-text {
  margin: 0;
  font-family: var(--font-family-base);
  font-size: 18px;
  font-weight: var(--font-weight-medium);
  color: #ffffff;
  text-align: center;
}
</style>
