<template>
  <section class="hero">
    <div class="hero__text">
      <h1 class="h1">Rectangles That Rules Numbers</h1>
      <p class="body1">
        This is story of me and how UX can change things around us. Something
        else to write here.
      </p>
    </div>

    <ul
      class="motion-list"
      layout
      :transition="{
        layout: { type: 'spring', stiffness: 20, damping: 4, mass: 0.1 },
      }"
    >
      <motion.li
        v-for="(block, idx) in blocks"
        :key="block.id"
        layout
        :custom="idx"
        :variants="boxVariants"
        :animate="
          block.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'
        "
        :transition="getLayoutSpring(idx)"
        initial="default"
        class="motion-square"
        :class="{
          'is-hovered': hovered[idx],
          'is-active': block.isActive,
        }"
        @mouseenter="hovered[idx] = true"
        @mouseleave="hovered[idx] = false"
        @click="toggleState(idx)"
        :style="getSquareStyle(block)"
      >
        <div class="square-visual">
          <div class="square-visual__inner" />
        </div>

        <div class="square-overlay">
          <span class="square-number">{{ idx + 1 }}</span>
          <div class="square-text">
            <h3>{{ block.title }}</h3>
            <p>{{ block.description }}</p>
          </div>
        </div>
      </motion.li>
    </ul>
  </section>
</template>

<script setup>
import { motion } from "motion-v";
import { reactive, ref } from "vue";

const blockConfigs = [
  {
    id: 1,
    title: "Four Facts about Victor",
    description:
      "Gute Websites sehen nicht nur gut aus – sie fühlen sich auch gut an. Kleine Bewegungen, durchdachte Übergänge und feine Details schaffen Vertrauen.",
    hoverGradient: "linear-gradient(135deg, #2ac6ff 0%, #324fff 100%)",
    hoverGlow: "rgba(72, 123, 255, 0.55)",
    activeGradient: "linear-gradient(135deg, #0018ff 0%, #1ed4ff 100%)",
    activeGlow: "rgba(45, 111, 255, 0.7)",
    numberColor: "#04162d",
    numberActiveColor: "#021129",
    textColor: "#031324",
  },
  {
    id: 2,
    title: "Four Facts about Victor",
    description:
      "Gute Websites sehen nicht nur gut aus – sie fühlen sich auch gut an. Kleine Bewegungen, durchdachte Übergänge und feine Details schaffen Vertrauen.",
    hoverGradient: "linear-gradient(135deg, #fff06a 0%, #7bff90 100%)",
    hoverGlow: "rgba(139, 225, 115, 0.6)",
    activeGradient: "linear-gradient(135deg, #ffe259 0%, #3aff84 100%)",
    activeGlow: "rgba(95, 230, 130, 0.72)",
    numberColor: "#102607",
    numberActiveColor: "#0d2205",
    textColor: "#092005",
  },
  {
    id: 3,
    title: "Four Facts about Victor",
    description:
      "Gute Websites sehen nicht nur gut aus – sie fühlen sich auch gut an. Kleine Bewegungen, durchdachte Übergänge und feine Details schaffen Vertrauen.",
    hoverGradient: "linear-gradient(135deg, #ff7ac4 0%, #6d50ff 100%)",
    hoverGlow: "rgba(217, 114, 255, 0.6)",
    activeGradient: "linear-gradient(135deg, #ff5ac8 0%, #4c39ff 100%)",
    activeGlow: "rgba(171, 80, 255, 0.75)",
    numberColor: "#270228",
    numberActiveColor: "#1a0020",
    textColor: "#1f0024",
  },
  {
    id: 4,
    title: "Four Facts about Victor",
    description:
      "Gute Websites sehen nicht nur gut aus – sie fühlen sich auch gut an. Kleine Bewegungen, durchdachte Übergänge und feine Details schaffen Vertrauen.",
    hoverGradient: "linear-gradient(135deg, #72f6ff 0%, #14f5c2 100%)",
    hoverGlow: "rgba(64, 238, 210, 0.6)",
    activeGradient: "linear-gradient(135deg, #54dfff 0%, #13f5b6 100%)",
    activeGlow: "rgba(46, 210, 187, 0.75)",
    numberColor: "#012a27",
    numberActiveColor: "#00211f",
    textColor: "#012322",
  },
];

const blocks = reactive(
  blockConfigs.map((config) => ({
    ...config,
    isActive: false,
  }))
);

const hovered = reactive(Array.from({ length: blocks.length }, () => false));
const lastToggledIdx = ref(-1);

const spring = { type: "spring", stiffness: 20, damping: 4, mass: 0.1 };

const boxVariants = {
  default: {
    width: 140,
    height: 140,
    marginLeft: 0,
    marginRight: 0,
    y: 0,
    transition: spring,
  },
  hover: {
    width: 180,
    height: 180,
    marginLeft: 12,
    marginRight: 12,
    transition: spring,
  },
  active: () => ({
    width: 360,
    height: 360,
    marginLeft: 16,
    marginRight: 16,
    y: 0,
    transition: spring,
  }),
};

function toggleState(idx) {
  const shouldActivate = !blocks[idx].isActive;

  blocks.forEach((block, blockIdx) => {
    block.isActive = blockIdx === idx ? shouldActivate : false;
  });

  lastToggledIdx.value = idx;
}

function getLayoutSpring(idx) {
  const distance =
    lastToggledIdx.value === -1 ? 0 : Math.abs(idx - lastToggledIdx.value);
  return { ...spring, delay: distance * 0.2 };
}

function getSquareStyle(block) {
  return {
    "--hover-gradient": block.hoverGradient,
    "--hover-glow": block.hoverGlow,
    "--active-gradient": block.activeGradient,
    "--active-glow": block.activeGlow,
    "--number-color": block.numberColor,
    "--number-active-color": block.numberActiveColor,
    "--text-active-color": block.textColor,
  };
}
</script>

<style scoped>
.hero {
  position: relative;
  width: min(1080px, 100%);
  margin: 0 auto;
  min-height: 100vh;
  padding: clamp(56px, 10vw, 112px) clamp(32px, 8vw, 96px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(48px, 12vh, 88px);
}

.hero__text {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 640px;
  position: relative;
  z-index: 2;
}

.motion-list {
  display: flex;
  align-items: flex-end;
  gap: clamp(16px, 3vw, 32px);
  margin: 0;
  padding: 0;
  list-style: none;
  flex-wrap: wrap;
}

.motion-square {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  cursor: pointer;
  overflow: visible;
  z-index: 1;
}

.motion-square.is-hovered,
.motion-square.is-active {
  z-index: 5;
}

.square-visual {
  position: absolute;
  inset: 0;
  border-radius: 36px;
  background: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.45s ease, box-shadow 0.45s ease;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05),
    0 20px 45px rgba(0, 0, 0, 0.45);
}

.square-visual__inner {
  width: 32%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: #3a3a3a;
  transition: transform 0.35s ease, opacity 0.35s ease;
}

.motion-square.is-hovered .square-visual,
.motion-square.is-active .square-visual {
  transform: rotate(45deg) scale(1.05);
}

.motion-square.is-hovered .square-visual {
  background: var(--hover-gradient);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.55),
    inset 0 0 90px var(--hover-glow);
}

.motion-square.is-active .square-visual {
  background: var(--active-gradient);
  box-shadow: 0 34px 85px rgba(0, 0, 0, 0.6),
    inset 0 0 140px var(--active-glow);
}

.motion-square.is-hovered .square-visual__inner,
.motion-square.is-active .square-visual__inner {
  opacity: 0;
  transform: scale(0.4);
}

.square-overlay {
  position: relative;
  z-index: 2;
  width: 70%;
  max-width: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  text-align: center;
  transition: transform 0.45s ease;
}

.square-number {
  display: block;
  font-family: var(--font-family-base);
  font-weight: 600;
  letter-spacing: 0.12em;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.56);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.35s ease, transform 0.35s ease,
    color 0.35s ease, font-size 0.45s ease;
}

.motion-square.is-hovered .square-number {
  opacity: 1;
  transform: translateY(0);
  color: var(--number-color);
}

.motion-square.is-active .square-number {
  opacity: 1;
  transform: translateY(0);
  color: var(--number-active-color);
  font-size: 48px;
  letter-spacing: 0.02em;
}

.square-text {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s ease 0.05s;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--text-active-color, var(--color-text-primary));
}

.square-text h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
}

.square-text p {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  color: color-mix(in srgb, var(--text-active-color) 85%, #ffffff 15%);
}

.motion-square.is-active .square-overlay {
  width: 80%;
  max-width: 280px;
  gap: 20px;
}

.motion-square.is-active .square-text {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1024px) {
  .motion-list {
    justify-content: center;
  }

  .hero {
    align-items: center;
  }

  .hero__text {
    text-align: center;
    align-items: center;
  }
}

@media (max-width: 768px) {
  .hero {
    gap: clamp(32px, 10vh, 56px);
    padding: clamp(40px, 10vw, 72px) clamp(24px, 8vw, 48px);
  }

  .motion-list {
    justify-content: center;
    gap: clamp(12px, 6vw, 20px);
  }

  .square-text h3 {
    font-size: 20px;
  }

  .square-text p {
    font-size: 15px;
  }

  .motion-square.is-active .square-number {
    font-size: 40px;
  }
}
</style>
