<template>
  <div class="intro-hero__text">
    <h1 class="h1">Rectangles That Rules Numbers</h1>
    <p class="body1">
      This is story of me and how UX can change things around us. Something
      else to write here.
    </p>

    <IntroRectangles />
  </div>
</template>

<script setup>
import IntroRectangles from "./IntroRectangles.vue";
</script>

<style scoped>
.intro-hero__text {
  grid-area: 1 / 1;
  max-width: 1000px;
  display: grid;
  gap: 24px;
  position: relative;
  z-index: 3;
  margin-bottom: 160px;
}
</style>