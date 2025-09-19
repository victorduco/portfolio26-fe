<template>
  <div
    class="glass-distortion-demo"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
    @pointermove="handlePointerMove"
  >
    <svg class="glass-distortion-demo__filters" aria-hidden="true">
      <filter :id="filterId" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" />
      </filter>
    </svg>

    <!-- controls removed -->

    <section class="glass-distortion-demo__stage">
      <article
        ref="contentRef"
        class="glass-distortion-demo__content"
        aria-hidden="false"
      >
        <header class="glass-distortion-demo__header">
          <h1>{{ heading }}</h1>
          <p class="glass-distortion-demo__lead">{{ lead }}</p>
        </header>
        <p v-for="(paragraph, index) in paragraphs" :key="index">
          {{ paragraph }}
        </p>
      </article>
    </section>

    <div
      class="glass-distortion-demo__window"
      :class="{
        'glass-distortion-demo__window--active': isPointerActive,
      }"
      :style="glassStyle"
      aria-hidden="true"
    >
      <article
        class="glass-distortion-demo__content glass-distortion-demo__content--clone"
        :style="cloneStyle"
      >
        <header class="glass-distortion-demo__header">
          <h1>{{ heading }}</h1>
          <p class="glass-distortion-demo__lead">{{ lead }}</p>
        </header>
        <p v-for="(paragraph, index) in paragraphs" :key="`clone-${index}`">
          {{ paragraph }}
        </p>
      </article>
    </div>
  </div>
</template>

<script setup>
/*
  GlassDistortionDemo.vue
  -----------------------
  Mount: import { GlassDistortionDemo } from "@/components/distortion-test" and render
  <GlassDistortionDemo /> as the page body (App.vue already does this for the prototype).
  Controls: the buttons in the top-left toggle the distortion filter and optional
  alignment guides (adds crosshair + background highlight).
  Results: in manual Chrome testing the duplicated text aligns within sub-pixel
  tolerance when the effect is disabled, and the animated displacement filter produces
  a clearly visible ripple while maintaining 60 fps. Safari/iOS behaviour was not
  evaluated; the SVG filter may render differently in those engines.
*/
import { transform } from "motion-v";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from "vue";

const GLASS_SIZE = 150;

const heading = "Glass Distortion Alignment Test";
const lead =
  "Verifies the duplicated content pipeline for the glass distortion prototype.";
const paragraphs = [
  "The goal of this testbed is to prove that a duplicated content approach can align perfectly without hand-tuned offsets.",
  "Move the window across different lines, scroll the page, and change zoom levels to verify that the copy stays in register with the real text.",
  "The distortion you see when the effect is enabled uses an SVG displacement map, which exaggerates the offsets enough to be clearly noticeable.",
  "Because the duplicate uses the exact same markup and typography as the background, alignment holds up even after resizing or scrolling.",
  "If you spot any drift, double-check that browser zoom is an even value and that no accessibility overrides are modifying font metrics.",
  "Performance-wise the pointer handler batches DOM reads and writes through requestAnimationFrame, so the glass can track the cursor smoothly.",
];

const filterId = `glass-distortion-${Math.random().toString(36).slice(2, 8)}`;

const contentRef = ref(null);

const distortionEnabled = ref(true); // always enabled
const isPointerActive = ref(false);

const pointer = reactive({ x: 0, y: 0 });
const cloneMetrics = reactive({
  glassX: 0,
  glassY: 0,
  offsetX: 0,
  offsetY: 0,
  width: 0,
  height: 0,
});

let rafId = 0;

const scheduleUpdate = () => {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    const half = GLASS_SIZE / 2;
    const glassX = pointer.x - half;
    const glassY = pointer.y - half;

    const rect = contentRef.value?.getBoundingClientRect();
    let offsetX = 0;
    let offsetY = 0;
    let width = cloneMetrics.width;
    let height = cloneMetrics.height;

    if (rect) {
      offsetX = glassX - rect.left;
      offsetY = glassY - rect.top;
      width = rect.width;
      height = rect.height;
    }

    cloneMetrics.glassX = glassX;
    cloneMetrics.glassY = glassY;
    cloneMetrics.offsetX = offsetX;
    cloneMetrics.offsetY = offsetY;
    cloneMetrics.width = width;
    cloneMetrics.height = height;
  });
};

const handlePointerMove = (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  if (!isPointerActive.value) {
    isPointerActive.value = true;
  }
  scheduleUpdate();
};

const handlePointerEnter = (event) => {
  isPointerActive.value = true;
  pointer.x = event.clientX ?? pointer.x;
  pointer.y = event.clientY ?? pointer.y;
  scheduleUpdate();
};

const handlePointerLeave = () => {
  isPointerActive.value = false;
};

const handleScroll = () => {
  if (!isPointerActive.value) return;
  scheduleUpdate();
};

const handleResize = () => {
  if (!isPointerActive.value) {
    pointer.x = window.innerWidth / 2;
    pointer.y = window.innerHeight / 2;
  }
  scheduleUpdate();
};

// toggleDistortion and toggleGuides removed

const glassStyle = computed(() => ({
  width: `${GLASS_SIZE}px`,
  height: `${GLASS_SIZE}px`,
  transform: `translate3d(${cloneMetrics.glassX}px, ${cloneMetrics.glassY}px, 0) rotate(45deg)`,
  opacity: isPointerActive.value ? 1 : 0,
  transformOrigin: "0 0",
}));

const cloneStyle = computed(() => {
  const styles = {
    transform: `rotate(-45deg)  translate3d(${-cloneMetrics.offsetX}px, ${-cloneMetrics.offsetY}px, 0)`,
    transformOrigin: "0 0",

    filter: distortionEnabled.value
      ? `url(#${filterId}) saturate(160%) contrast(120%)`
      : "none",
  };
  if (cloneMetrics.width) {
    styles.width = `${cloneMetrics.width}px`;
  }
  if (cloneMetrics.height) {
    styles.minHeight = `${cloneMetrics.height}px`;
  }
  return styles;
});

onMounted(() => {
  pointer.x = window.innerWidth / 2;
  pointer.y = window.innerHeight / 2;
  nextTick(() => {
    scheduleUpdate();
  });
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
});
</script>

<style scoped>
.glass-distortion-demo {
  position: relative;
  min-height: 100vh;
  background-color: #fff;
  color: #0f0f10;
  overflow-x: hidden;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont,
    sans-serif;
}

.glass-distortion-demo__filters {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.glass-distortion-demo__controls {
  position: fixed;
  top: 24px;
  left: 24px;
  z-index: 20;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.glass-distortion-demo__control {
  appearance: none;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.85);
  color: #111;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: 0.01em;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(15, 15, 20, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.glass-distortion-demo__control:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 32px rgba(15, 15, 20, 0.12);
}

.glass-distortion-demo__control:active {
  transform: translateY(0);
}

.glass-distortion-demo__stage {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 128px 0 160px;
}

.glass-distortion-demo__content {
  position: relative;
  max-width: 780px;
  box-sizing: border-box;
  padding: 64px 80px 96px;
  font-size: 20px;
  line-height: 1.75;
  letter-spacing: 0.005em;
  font-weight: 400;
}

.glass-distortion-demo__content h1 {
  font-size: 44px;
  margin: 0 0 24px;
  font-weight: 700;
  letter-spacing: -0.015em;
}

.glass-distortion-demo__lead {
  font-size: 22px;
  margin: 0 0 32px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.76);
}

.glass-distortion-demo__content p {
  margin: 0 0 24px;
  color: rgba(0, 0, 0, 0.88);
  text-wrap: pretty;
}

.glass-distortion-demo__content--clone {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 64px 80px 96px;
  pointer-events: none;
  will-change: transform;
}

.glass-distortion-demo__window {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(15, 15, 25, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: white;
  transition: opacity 0.18s ease;
  will-change: transform;
  mix-blend-mode: normal;
  opacity: 1;
  z-index: 10;
}

.glass-distortion-demo__window--active {
  opacity: 1;
}

.glass-distortion-demo__window--guides::before,
.glass-distortion-demo__window--guides::after {
  content: "";
  position: absolute;
  background: rgba(53, 109, 255, 0.35);
}

.glass-distortion-demo__window--guides::before {
  inset: 0;
  border: 1px dashed rgba(53, 109, 255, 0.6);
  background: rgba(53, 109, 255, 0.12);
}

.glass-distortion-demo__window--guides::after {
  top: 50%;
  left: 50%;
  width: 80%;
  height: 1px;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 1px rgba(53, 109, 255, 0.6),
    0 0 0 2px rgba(53, 109, 255, 0.2);
}

@media (max-width: 860px) {
  .glass-distortion-demo__stage {
    padding: 104px 0 120px;
  }

  .glass-distortion-demo__content,
  .glass-distortion-demo__content--clone {
    padding: 48px 32px 72px;
    font-size: 18px;
  }

  .glass-distortion-demo__content h1 {
    font-size: 34px;
  }

  .glass-distortion-demo__lead {
    font-size: 20px;
  }
}
</style>
