<template>
  <ExportBgImg
    :dom-id="'glass-export-node'"
    v-model="imgUrl"
    background-color="#000"
  />
  <div id="glass-export-node">
    <div
      class="tmp-background"
      :style="{ '--bg-img': imgUrl ? `url(${imgUrl})` : 'none' }"
    />
    <div style="position: relative" class="card__wrapper">
      <LiquidGlass
        :background-image-url="imgUrl"
        :glass-config="glassConfig"
        v-hover-distortion="hoverDistortionOptions"
        :intensity="animatedIntensity"
      >
        <div class="card__content">
          <h2>Apple Liquid Glass</h2>
          <p>
            Experience the revolutionary liquid glass with real refraction
            physics. Notice how the background distorts through the glass while
            text stays crystal clear.
          </p>
          <button type="button" class="demo__button">Explore Magic</button>
        </div>
      </LiquidGlass>
      <!-- PNG preview removed: image is not inserted into DOM -->
    </div>

    <div class="card__wrapper">
      <LiquidGlass :background-image-url="imgUrl" :glass-config="glassConfig">
        <div class="card__content">
          <h2 v-hover-distortion="hoverDistortionOptions">
            Apple Liquid Glass
          </h2>
          <p>
            Experience the revolutionary liquid glass with real refraction
            physics. Notice how the background distorts through the glass while
            text stays crystal clear.
          </p>
          <button
            v-hover-distortion="hoverDistortionOptions"
            type="button"
            class="demo__button"
          >
            Explore Magic
          </button>
        </div>
      </LiquidGlass>
    </div>
  </div>
</template>

<script setup>
import LiquidGlass from "../lg-effect/GlassEffect.vue";
import ExportBgImg from "../bg-img/ExportBgImg.vue";
import { ref, computed, onMounted, onUnmounted } from "vue";
const imgUrl = ref("");
const animatedIntensity = ref(0);

let animationId = null;
let startTime = null;

const animate = (timestamp) => {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;
  const progress = (elapsed % 10000) / 10000; // 10 секунд цикл
  const intensity = Math.abs(Math.sin(progress * Math.PI)); // 0 -> 1 -> 0
  animatedIntensity.value = intensity;
  animationId = requestAnimationFrame(animate);
};

onMounted(() => {
  animationId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});
const hoverDistortionOptions = computed(() => ({
  curvature: 1.8,
  parallaxIntensity: 0.35,
}));

const glassConfig = {
  displacementScale: 65,
  aberrationIntensity: 2.8,
  surfaceCurvature: 1.8,
  glassBlur: 25,
  glassSaturation: 185,
  refractionDepth: 2.0,
  surfaceReflection: 0.45,
  shadowDepth: 0.4,
  shaderCornerRadius: 0.2,
  distortion: {
    start: 0.3,
    end: 0.2,
    offset: 0.15,
  },
  scaling: {
    start: 0,
    end: 1,
  },
};
</script>

<style scoped>
.card__wrapper {
  max-width: 600px;
  margin: 40px;
  position: relative;
  border-radius: 16px;
}
.card__content {
  width: 100%;
  padding: 32px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin: 40px auto;
}

h2 {
  margin: 0 0 16px;
  font-size: clamp(1.8rem, 2.6vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.85) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

p {
  margin: 0 0 24px;
  color: rgba(239, 243, 255, 0.9);
  line-height: 1.65;
  font-size: 1rem;
}

.demo__button {
  border: none;
  outline: none;
  font-size: 1rem;
  font-weight: 700;
  padding: 14px 24px;
  border-radius: 999px;
  background: linear-gradient(
    135deg,
    rgba(21, 110, 255, 0.9) 0%,
    rgba(21, 110, 255, 0.95) 100%
  );
  color: white;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(21, 110, 255, 0.4);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(21, 110, 255, 0.3);
}

.demo__button:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(21, 110, 255, 0.5);
  background: linear-gradient(
    135deg,
    rgba(21, 110, 255, 0.95) 0%,
    rgba(21, 110, 255, 1) 100%
  );
}

.tmp-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: var(--bg-img);
  background-position: top left;
  background-size: cover;
}
</style>
