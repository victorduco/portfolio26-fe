<template>
  <IntroControls
    :source-element-id="'intro-house-clone'"
    @update:showHouse="handleShowHouseUpdate"
    @update:hideOriginalContent="handleHideContentUpdate"
    @update:showDistortion="handleShowDistortionUpdate"
    ref="controlsRef"
  />

  <section class="intro-hero" id="intro-text-export-node">
    <div class="intro-hero__text">
      <div
        class="intro-hero__original-content"
        :class="{ 'intro-hero__original-content--hidden': hideOriginalContent }"
      >
        <h1 class="h1">Rectangles That Rules Numbers</h1>
        <p class="body1">
          This is story of me and how UX can change things around us. Something
          else to write here.
        </p>
      </div>

      <IntroRectangles />
    </div>

    <IntroHouse
      v-if="showHouse || showDistortion"
      :source-selector="'#intro-text-export-node'"
      :is-visible="showHouse"
      :exclude-selectors="[
        '.intro-distortion',
        '.intro-list',
        'ul',
        'motion-ul',
        'li',
        '.intro-square',
      ]"
      :show-filter-preview="showHouse"
      :blur-intensity="8"
    />
  </section>
</template>

<script setup>
import { ref } from "vue";
import IntroRectangles from "./IntroRectangles.vue";
import IntroHouse from "./IntroHouse.vue";
import IntroControls from "./IntroControls.vue";

const controlsRef = ref(null);
const showHouse = ref(false);
const showDistortion = ref(false);
const hideOriginalContent = ref(false);

function handleShowHouseUpdate(value) {
  showHouse.value = value;
}

function handleHideContentUpdate(value) {
  hideOriginalContent.value = value;
}

function handleShowDistortionUpdate(value) {
  showDistortion.value = value;
}
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

.intro-hero__original-content--hidden {
  opacity: 0;
  pointer-events: none;
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
