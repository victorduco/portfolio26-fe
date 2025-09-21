<template>
  <div ref="containerRef" class="w-full h-screen bg-image"></div>
  <section class="intro-hero">
    <IntroText />
    <div class="intro-hero__stage"></div>
  </section>
</template>

<script setup>
import IntroText from "./IntroText.vue";
</script>

<style scoped>
.intro-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: center;
  justify-items: start;
  width: 100%;
  max-width: 1440px;
  min-height: 100vh;
  padding-block: clamp(48px, 12vh, 96px);
  padding-inline-start: clamp(32px, 12vw, 120px);
  box-sizing: border-box;
  overflow: visible;
}

.intro-hero__stage {
  grid-area: 1 / 1;
  align-self: stretch;
  justify-self: stretch;
  padding-top: clamp(120px, 22vh, 260px);
  position: relative;
  z-index: 1;
  pointer-events: none;
}

@media (max-width: 768px) {
  .intro-hero {
    min-height: auto;
    padding-block: clamp(40px, 12vh, 72px);
    padding-inline-start: clamp(24px, 16vw, 72px);
    padding-inline-end: clamp(16px, 8vw, 48px);
  }

  .intro-hero__stage {
    padding-top: clamp(96px, 24vh, 200px);
  }
}
</style>
