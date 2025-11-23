<template>
  <div class="next-story-plaque">
    <p class="next-story-text">
      <span class="next-label">Next:</span> Story {{ storyNumber }}
    </p>
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
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: none;
  border-bottom: 1px solid #dddddd;
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
  color: #666666;
  text-align: center;
}

.next-label {
  opacity: 0.7;
}
</style>
