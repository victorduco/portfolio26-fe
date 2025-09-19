<template>
  <ExportBgImg
    :dom-id="'glass-export-node'"
    v-model="imgUrl"
    background-color="#000"
  />
  <div
    class="tmp-background"
    :style="{ '--bg-img': imgUrl ? `url(${imgUrl})` : 'none' }"
  />
  <div style="position: relative" id="glass-export-node">
    <LiquidGlass>
      <div ref="glassRef">
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

  <LiquidGlass>
    <h2>Apple Liquid Glass</h2>
    <p>
      Experience the revolutionary liquid glass with real refraction physics.
      Notice how the background distorts through the glass while text stays
      crystal clear.
    </p>
    <button type="button" class="demo__button">Explore Magic</button>
  </LiquidGlass>
</template>

<script setup>
import LiquidGlass from "../lg-effect/GlassEffect.vue";
import ExportBgImg from "../bg-img/ExportBgImg.vue";
import { ref } from "vue";
const glassRef = ref(null);
const imgUrl = ref("");
</script>

<style scoped>
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
