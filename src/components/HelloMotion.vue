<template>
  <section class="hero">
    <div class="hero__text">
      <p class="eyebrow">Product UX Designer</p>
      <h1 class="h1">Rectangles that Listen to Every User Signal</h1>
      <p class="body1">
        I design motion-rich interfaces where every micro-interaction is backed by
        research. These are the four rituals that keep my UX practice sharp and
        human.
      </p>
    </div>

    <div class="hero__stage">
      <svg class="hero__defs" aria-hidden="true">
        <defs>
          <filter
            v-for="(block, idx) in blocks"
            :key="`filter-${idx}`"
            :id="`liquid-glow-${idx}`"
            x="-60%"
            y="-60%"
            width="220%"
            height="220%"
            color-interpolation-filters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="2"
              :seed="idx * 12 + 5"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="6" result="softNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softNoise"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="B"
              result="distortion"
            />
            <feGaussianBlur in="distortion" stdDeviation="10" result="blurred" />
            <feFlood :flood-color="block.glow" flood-opacity="0.85" result="flood" />
            <feComposite in="flood" in2="blurred" operator="in" result="glow" />
            <feBlend in="distortion" in2="glow" mode="screen" />
          </filter>
        </defs>
      </svg>

      <ul class="motion-list" layout :transition="listTransition">
        <motion.li
          v-for="(block, idx) in blocks"
          :key="block.number"
          layout
          :custom="idx"
          :variants="boxVariants"
          :animate="getState(idx)"
          :transition="getLayoutSpring(idx)"
          initial="default"
          class="motion-square"
          :class="{ 'is-hovered': hovered[idx], 'is-active': block.isActive }"
          @mouseenter="onHover(idx, true)"
          @mouseleave="onHover(idx, false)"
          @click="toggleState(idx)"
          :style="getSquareStyle(block, idx)"
          :data-state="block.isActive"
        >
          <motion.svg
            class="motion-square__svg"
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            :variants="svgVariants"
            :animate="getState(idx)"
            :transition="spring"
            style="transform-origin: 50% 50%; display: block"
          >
            <motion.rect
              x="0"
              y="0"
              width="100"
              height="100"
              :rx="cornerRadius"
              :ry="cornerRadius"
              stroke-width="1.2"
              :style="{
                fill: block.isActive
                  ? block.active
                  : hovered[idx]
                  ? block.hover
                  : 'var(--color-square-default)',
                stroke: 'var(--color-square-outline)',
                filter: hovered[idx] ? `url(#liquid-glow-${idx})` : 'none',
              }"
            />
          </motion.svg>

          <div
            class="motion-liquid"
            :style="{
              filter: hovered[idx] ? `url(#liquid-glow-${idx})` : 'none',
              background: hovered[idx] ? block.glass : 'transparent',
            }"
          ></div>

          <div class="motion-content">
            <span class="motion-number">{{ block.number }}</span>
            <Transition name="fade">
              <article v-if="block.isActive" class="fact-card">
                <p class="caption fact-card__tag">{{ block.tag }}</p>
                <h2 class="h3 fact-card__title">{{ block.title }}</h2>
                <p class="body2 fact-card__text">{{ block.description }}</p>
              </article>
            </Transition>
          </div>
        </motion.li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { motion } from "motion-v";
import { reactive, ref } from "vue";

const baseBlocks = [
  {
    number: "01",
    tag: "User Research",
    title: "Empathy Maps Draw the First Wireframe",
    description:
      "Interviews, journey maps and diaries help me understand the emotional cadence of every task before I design a single pixel.",
    hover: "var(--color-accent-1)",
    active: "var(--color-accent-1-strong)",
    glow: "var(--color-accent-1-glow)",
    glass: "rgba(74, 169, 255, 0.18)",
  },
  {
    number: "02",
    tag: "Rapid Experimentation",
    title: "Prototypes Answer Questions in Days",
    description:
      "Clickable flows in Figma and code sandboxes let teams watch real people interact, so we ship the confident option—not the loudest opinion.",
    hover: "var(--color-accent-2)",
    active: "var(--color-accent-2-strong)",
    glow: "var(--color-accent-2-glow)",
    glass: "rgba(255, 126, 182, 0.18)",
  },
  {
    number: "03",
    tag: "Product Narrative",
    title: "Microcopy Coaches Without Speaking",
    description:
      "I craft interface language that celebrates success states and softens edge cases so guidance feels like a teammate, not a tooltip.",
    hover: "var(--color-accent-3)",
    active: "var(--color-accent-3-strong)",
    glow: "var(--color-accent-3-glow)",
    glass: "rgba(127, 246, 166, 0.18)",
  },
  {
    number: "04",
    tag: "Metrics & Iteration",
    title: "Dashboards Fuel Weekly Decisions",
    description:
      "North-star metrics sit next to qualitative notes so every iteration connects data, empathy and motion patterns the team can trust.",
    hover: "var(--color-accent-4)",
    active: "var(--color-accent-4-strong)",
    glow: "var(--color-accent-4-glow)",
    glass: "rgba(255, 215, 111, 0.18)",
  },
];

const blocks = reactive(baseBlocks.map((item) => ({ ...item, isActive: false })));
const hovered = reactive(Array.from({ length: blocks.length }, () => false));
const lastToggledIdx = ref(-1);

const spring = { type: "spring", stiffness: 24, damping: 6, mass: 0.18 };
const listTransition = { layout: { type: "spring", stiffness: 28, damping: 6, mass: 0.18 } };

const boxVariants = {
  default: {
    width: 132,
    height: 132,
    marginLeft: 0,
    marginRight: 0,
    y: 0,
    transition: spring,
  },
  hover: {
    width: 168,
    height: 168,
    marginLeft: 16,
    marginRight: 16,
    transition: spring,
  },
  active: (i) => ({
    width: 480,
    height: 480,
    marginLeft: 18,
    marginRight: 18,
    y: i % 2 === 0 ? "-20%" : "20%",
    transition: spring,
  }),
};

const svgVariants = {
  default: { rotate: 0 },
  hover: { rotate: 45 },
  active: { rotate: 45 },
};

const cornerRadius = 18;

function toggleState(idx) {
  blocks[idx].isActive = !blocks[idx].isActive;
  lastToggledIdx.value = idx;
}

function onHover(idx, value) {
  hovered[idx] = value;
}

function getState(idx) {
  return blocks[idx].isActive ? "active" : hovered[idx] ? "hover" : "default";
}

function getLayoutSpring(idx) {
  const distance =
    lastToggledIdx.value === -1 ? 0 : Math.abs(idx - lastToggledIdx.value);
  return { ...spring, delay: distance * 0.45 };
}

function getSquareStyle(block, idx) {
  return {
    '--square-glow': block.glow,
    '--square-accent': block.active,
    zIndex: blocks[idx].isActive ? 30 : hovered[idx] ? 20 : 10,
  };
}
</script>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  max-width: 1280px;
  min-height: 100vh;
  margin: 0 auto;
  padding-block: clamp(72px, 14vh, 144px);
  padding-inline: clamp(24px, 6vw, 88px);
  display: grid;
  align-content: center;
}

.hero__text {
  max-width: 560px;
  display: grid;
  gap: 24px;
  position: relative;
  z-index: 1;
}

.hero__stage {
  position: absolute;
  top: 50%;
  right: clamp(32px, 10vw, 168px);
  transform: translateY(-50%);
  width: min(65vw, 640px);
  pointer-events: none;
  z-index: 2;
}

.hero__defs {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

.motion-list {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: clamp(14px, 2vw, 28px);
  margin: 0;
  padding: 0;
  list-style: none;
  pointer-events: auto;
}

.motion-square {
  position: relative;
  width: 132px;
  height: 132px;
  list-style: none;
  cursor: pointer;
  overflow: visible;
  user-select: none;
}

.motion-square__svg {
  position: absolute;
  inset: 0;
  overflow: visible;
}

.motion-square:is(.is-hovered, .is-active) .motion-square__svg {
  filter: drop-shadow(0 20px 60px rgba(0, 0, 0, 0.25));
}

.motion-liquid {
  position: absolute;
  inset: 12%;
  border-radius: 32px;
  transform: rotate(45deg);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.45s ease, backdrop-filter 0.45s ease;
  backdrop-filter: blur(0px);
  mix-blend-mode: screen;
}

.motion-square.is-hovered .motion-liquid {
  opacity: 1;
  backdrop-filter: blur(22px);
}

.motion-content {
  position: absolute;
  inset: 0;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 20px;
  padding: clamp(24px, 4vw, 60px);
  text-align: center;
  pointer-events: none;
}

.motion-number {
  font-family: var(--font-family-base);
  font-weight: 700;
  font-size: clamp(28px, 3.6vw, 44px);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-tertiary);
  text-shadow: 0 0 0 transparent;
  transition: color 0.3s ease, text-shadow 0.3s ease, opacity 0.3s ease,
    transform 0.3s ease;
}

.motion-square.is-hovered .motion-number {
  color: var(--square-accent);
  text-shadow: 0 0 34px var(--square-glow);
}

.motion-square.is-active .motion-number {
  opacity: 0;
  transform: translateY(-12px);
}

.fact-card {
  display: grid;
  gap: 16px;
  padding: clamp(24px, 4vw, 48px);
  background: rgba(15, 16, 20, 0.55);
  border-radius: 32px;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(244, 246, 248, 0.06);
  text-align: left;
}

.fact-card__tag {
  color: var(--color-text-tertiary);
}

.fact-card__title {
  color: var(--color-text-primary);
}

.fact-card__text {
  color: var(--color-text-secondary);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.32s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1200px) {
  .hero__stage {
    right: clamp(24px, 8vw, 120px);
    width: min(68vw, 560px);
  }

  .motion-list {
    gap: clamp(12px, 1.6vw, 20px);
  }
}

@media (max-width: 1024px) {
  .hero {
    padding-inline: clamp(24px, 8vw, 64px);
  }

  .hero__stage {
    position: relative;
    top: auto;
    right: auto;
    transform: none;
    margin-top: clamp(56px, 10vh, 96px);
    width: 100%;
  }

  .motion-list {
    justify-content: flex-start;
  }
}

@media (max-width: 720px) {
  .hero {
    padding-block: clamp(56px, 18vh, 104px);
  }

  .motion-content {
    padding: clamp(24px, 10vw, 40px);
  }

  .fact-card {
    padding: clamp(24px, 10vw, 40px);
  }
}

@media (max-width: 560px) {
  .motion-list {
    gap: 12px;
  }

  .motion-square {
    width: 112px;
    height: 112px;
  }
}
</style>
