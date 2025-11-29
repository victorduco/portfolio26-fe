<template>
  <section id="ai-play" class="item">
    <section class="ai-play-hero" :class="{ 'dark-mode': darkMode, 'light-mode': !darkMode }">
      <div class="floating-images">
        <motion.div
          v-for="(item, index) in floatingItems"
          :key="index"
          :class="['float-img', `float-img-${index + 1}`]"
          :style="item.positioning"
          :variants="diamondVariants"
          :animate="hoveredIndex === index ? 'groupHover' : 'default'"
          initial="default"
          :transition="createSpring(item.hoverSpringMultiplier)"
          @mouseenter="hoveredIndex = index"
          @mouseleave="hoveredIndex = -1"
        >
          <div class="diamond-shape">
            <motion.div
              class="diamond-shape-color"
              :style="{ backgroundColor: item.color }"
              :variants="diamondShapeVariants"
              :animate="hoveredIndex === index ? 'groupHover' : 'default'"
              initial="default"
              :transition="createSpring(item.hoverSpringMultiplier)"
            />
            <motion.div
              class="plant-icon-wrapper"
              :initial="{ rotate: -45 + item.rotation }"
              :animate="{ rotate: -45 + item.rotation }"
              :transition="spring"
            >
              <motion.div
                class="icon-rotation-compensator"
                :initial="{ rotate: item.animateRotation ? 0 : -item.rotation }"
                :animate="{ rotate: hoveredIndex === index ? -item.rotation : item.animateRotation ? 0 : -item.rotation }"
                :transition="item.animateRotation ? spring : { duration: 0 }"
              >
                <component
                  :is="hoveredIndex === index ? item.icon : item.defaultIcon"
                  :size="item.iconSize"
                  :color="hoveredIndex === index ? '#000000' : '#999999'"
                  class="plant-icon"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div class="ai-play__title">
        <h1 class="h1">AI Playground</h1>
        <p class="body1">
          I'm passionate about home gardening and working on an AI agent that
          manages my plants using data and controls from my Home Assistant
          system.
        </p>
        <a
          href="https://github.com/victorduco/agent-ha"
          target="_blank"
          rel="noopener noreferrer"
          class="body1 ai-play__link"
          aria-label="View GitHub Repository"
        >
          View Repository
        </a>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { motion } from "motion-v";
import { Leaf, Flower2, Palmtree, Flower } from "lucide-vue-next";
import HaIcon from "./HaIcon.vue";
import DropIcon from "./DropIcon.vue";
import SproutIcon from "./SproutIcon.vue";
import { spring, createSpring, diamondVariants, diamondShapeVariants } from "./aiPlayVariants.js";

defineProps({ darkMode: { type: Boolean, default: true } });

const floatingItems = [
  { icon: HaIcon, defaultIcon: Leaf, color: "#27A9FF", iconSize: 40, rotation: 0, animateRotation: false, hoverSpringMultiplier: 1.1, positioning: { width: 'clamp(100px,13vw,170px)', height: 'clamp(100px,13vw,170px)', top: '10%', left: '14%' } },
  { icon: Flower2, defaultIcon: Leaf, color: "#FF83A2", iconSize: 32, rotation: 45, animateRotation: true, hoverSpringMultiplier: 1.0, positioning: { width: 'clamp(85px,10vw,135px)', height: 'clamp(85px,10vw,135px)', top: '18%', right: '15%' } },
  { icon: SproutIcon, defaultIcon: Leaf, color: "#00FFBC", iconSize: 36, rotation: 90, animateRotation: false, hoverSpringMultiplier: 1.3, positioning: { width: 'clamp(95px,11vw,155px)', height: 'clamp(95px,11vw,155px)', top: '12%', left: '42%' } },
  { icon: Palmtree, defaultIcon: Leaf, color: "#FFFF78", iconSize: 45, rotation: 135, animateRotation: false, hoverSpringMultiplier: 1.4, positioning: { width: 'clamp(120px,15vw,190px)', height: 'clamp(120px,15vw,190px)', bottom: '15%', left: '10%' } },
  { icon: DropIcon, defaultIcon: Leaf, color: "#27A9FF", iconSize: 42, rotation: 180, animateRotation: false, hoverSpringMultiplier: 1.2, positioning: { width: 'clamp(110px,14vw,180px)', height: 'clamp(110px,14vw,180px)', bottom: '12%', right: '10%' } },
  { icon: Flower, defaultIcon: Leaf, color: "#FF83A2", iconSize: 30, rotation: 225, animateRotation: true, hoverSpringMultiplier: 1.0, positioning: { width: 'clamp(75px,9vw,130px)', height: 'clamp(75px,9vw,130px)', bottom: '18%', right: '38%' } },
];

const hoveredIndex = ref(-1);
</script>

<style scoped>
.ai-play-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  padding: clamp(24px, 4vw, 48px);
  box-sizing: border-box;
  overflow: hidden;
}
.floating-images { position: absolute; inset: 0; z-index: 0; }
.float-img { position: absolute; will-change: transform; animation-play-state: running !important; }
.float-img-1 { animation: float1 8s ease-in-out infinite; }
.float-img-2 { animation: float2 10s ease-in-out infinite; }
.float-img-3 { animation: float3 9s ease-in-out infinite; }
.float-img-4 { animation: float4 11s ease-in-out infinite; }
.float-img-5 { animation: float5 7.5s ease-in-out infinite; }
.float-img-6 { animation: float6 9.5s ease-in-out infinite; }
.diamond-shape {
  width: 100%;
  height: 100%;
  border-radius: 26px;
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #171717;
  border: 2px solid #222;
  transition: border-color 0.3s, background-color 0.3s;
}
.diamond-shape-color { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; }
.plant-icon-wrapper, .icon-rotation-compensator { display: flex; align-items: center; justify-content: center; }
.plant-icon { flex-shrink: 0; }
@keyframes float1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(15px, -20px) rotate(5deg); }
  50% { transform: translate(-10px, -15px) rotate(-3deg); }
  75% { transform: translate(10px, -25px) rotate(4deg); }
}
@keyframes float2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(-20px, 15px) rotate(-6deg); }
  66% { transform: translate(-15px, -10px) rotate(4deg); }
}
@keyframes float3 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  30% { transform: translate(20px, 10px) rotate(7deg); }
  60% { transform: translate(-15px, 15px) rotate(-5deg); }
}
@keyframes float4 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  40% { transform: translate(-25px, -10px) rotate(-4deg); }
  80% { transform: translate(20px, -15px) rotate(6deg); }
}
@keyframes float5 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  35% { transform: translate(15px, 20px) rotate(5deg); }
  70% { transform: translate(-20px, 10px) rotate(-7deg); }
}
@keyframes float6 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(-10px, 15px) rotate(-3deg); }
  50% { transform: translate(15px, -20px) rotate(4deg); }
  75% { transform: translate(-15px, -10px) rotate(-5deg); }
}
.ai-play__title {
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(16px, 2vw, 24px);
  position: relative;
  z-index: 2;
  text-align: center;
  padding: clamp(24px, 4vw, 48px);
  pointer-events: none;
}
.ai-play__title > * { pointer-events: auto; }
.ai-play__link {
  text-decoration: none;
  transition: color 0.3s;
  margin: 0;
  color: white;
  font-weight: 400;
  position: relative;
  display: inline-block;
}
.ai-play__link:hover { color: var(--color-text-secondary); }
.ai-play__link::after {
  content: "";
  position: absolute;
  left: calc(100% + clamp(6px, 0.8vw, 10px));
  top: 50%;
  transform: translateY(calc(-50% + 1px));
  width: clamp(20px, 2vw, 28px);
  height: clamp(20px, 2vw, 28px);
  background: url("@/assets/icons/link.svg") no-repeat center/contain;
  opacity: 0;
  transition: opacity 0.3s;
  filter: brightness(1);
}
.ai-play__link:hover::after { opacity: 1; filter: brightness(0.7); }
@media (max-width: 899px) {
  .floating-images { opacity: 0.5; }
  .float-img:nth-child(3), .float-img:nth-child(6) { display: none; }
  .float-img:nth-child(1) { width: 70px; height: 70px; top: 8%; left: 5%; }
  .float-img:nth-child(2) { width: 65px; height: 65px; top: 12%; right: 5%; }
  .float-img:nth-child(4) { width: 75px; height: 75px; bottom: 8%; left: 5%; }
  .float-img:nth-child(5) { width: 70px; height: 70px; bottom: 12%; right: 5%; }
  .ai-play__title { padding: clamp(16px, 3vw, 24px) clamp(16px, 4vw, 32px); }
}
@media (max-width: 767px) and (orientation: landscape) { .floating-images { opacity: 0.3; } }
@media (prefers-reduced-motion: reduce) { .float-img { animation: none; } }
</style>
