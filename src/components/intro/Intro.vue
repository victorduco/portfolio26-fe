<template>
  <button
    class="house-toggle"
    @click="toggleHouse"
    :class="{ active: showHouse || showDistortion }"
  >
    {{ showHouse ? "Switch to Distortion" : (showDistortion ? "Turn Off" : "Show House") }}
  </button>

  <button
    class="content-toggle"
    @click="hideOriginalContent = !hideOriginalContent"
    :class="{ active: hideOriginalContent }"
  >
    {{ hideOriginalContent ? "Show Original" : "Hide Original" }}
  </button>

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
      :exclude-selectors="['.intro-distortion', '.intro-list', 'ul', 'motion-ul', 'li', '.intro-square']"
      :show-filter-preview="showHouse"
      :blur-intensity="8"
    />
    <IntroDistortion
      v-if="showDistortion"
      :source-element-id="'intro-house-clone'"
      :enabled="showDistortion"
    />
  </section>
</template>

<script setup>
import { ref } from "vue";
import IntroRectangles from "./IntroRectangles.vue";
import IntroHouse from "./IntroHouse.vue";
import IntroDistortion from "./IntroDistortion.vue";

const showHouse = ref(false);
const showDistortion = ref(false);
const hideOriginalContent = ref(false);

function toggleHouse() {
  if (showHouse.value) {
    showHouse.value = false;
    showDistortion.value = true;
  } else if (showDistortion.value) {
    showDistortion.value = false;
  } else {
    showHouse.value = true;
  }
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

.house-toggle {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;

  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.house-toggle:hover {
  background: rgba(0, 0, 0, 0.8);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.house-toggle.active {
  background: rgba(34, 197, 94, 0.8);
  border-color: rgba(34, 197, 94, 0.6);
}

.house-toggle.active:hover {
  background: rgba(34, 197, 94, 0.9);
}

.content-toggle {
  position: fixed;
  top: 24px;
  right: 180px;
  z-index: 1000;

  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.content-toggle:hover {
  background: rgba(0, 0, 0, 0.8);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.content-toggle.active {
  background: rgba(239, 68, 68, 0.8);
  border-color: rgba(239, 68, 68, 0.6);
}

.content-toggle.active:hover {
  background: rgba(239, 68, 68, 0.9);
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

  .house-toggle {
    top: 16px;
    right: 16px;
    padding: 10px 14px;
    font-size: 13px;
  }

  .content-toggle {
    top: 16px;
    right: 140px;
    padding: 10px 14px;
    font-size: 13px;
  }
}
</style>
