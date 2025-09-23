<template>
  <section class="intro-hero" id="intro-text-export-node">
    <div class="intro-hero__text">
      <div class="intro-hero__original-content">
        <h1 class="h1">Rectangles That Rules Numbers</h1>
        <p class="body1">
          This is story of me and how UX can change things around us. Something
          else to write here.
        </p>
      </div>

      <IntroRectangles />
    </div>
  </section>
</template>

<script setup>
import IntroRectangles from "./IntroRectangles.vue";
</script>

<style scoped>
.intro-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: center;
  justify-items: start;
  width: 100vw;
  height: 100vh;
  padding-block: clamp(48px, 12vh, 96px);
  padding-inline-start: clamp(32px, 12vw, 120px);
  box-sizing: border-box;
  overflow: visible;
}

.intro-hero__text {
  grid-area: 1 / 1;
  max-width: 1000px;
  display: grid;
  gap: 24px;
  position: relative;
  z-index: 3;
  margin-bottom: 160px;
}

@media (max-width: 768px) {
  .intro-hero {
    min-height: auto;
    padding-block: clamp(40px, 12vh, 72px);
    padding-inline-start: clamp(24px, 16vw, 72px);
    padding-inline-end: clamp(16px, 8vw, 48px);
  }
}
</style>
