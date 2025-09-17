<template>
  <section class="hero">
    <div class="hero__text">
      <p class="eyebrow">UX Designer's Notebook</p>
      <h1 class="display">Rectangles That Rule Numbers</h1>
      <p class="body-large">
        I translate metrics into motion. Four tiny diamonds reveal the rituals I use to
        turn data points into tactile product moments. Hover to preview the energy,
        tap to open each practice.
      </p>
    </div>

    <div class="hero__stage" aria-hidden="false">
      <svg class="hero__filters" width="0" height="0" focusable="false">
        <defs>
          <filter
            id="liquid-glow"
            x="-60%"
            y="-60%"
            width="220%"
            height="220%"
            color-interpolation-filters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="shape" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feFlood flood-color="var(--card-glow)" flood-opacity="1" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="shape" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <ul
        class="motion-list"
        layout
        :transition="{
          layout: { type: 'spring', stiffness: 30, damping: 7, mass: 0.35 },
        }"
      >
        <motion.li
          v-for="(card, idx) in cards"
          :key="card.title"
          layout
          :custom="idx"
          :variants="boxVariants"
          :animate="card.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'"
          :transition="getLayoutSpring(idx)"
          initial="default"
          class="motion-square"
          role="button"
          tabindex="0"
          :data-state="card.isActive"
          :data-hover="hovered[idx]"
          :style="getCardStyle(idx)"
          @mouseenter="hovered[idx] = true"
          @mouseleave="hovered[idx] = false"
          @focus="hovered[idx] = true"
          @blur="hovered[idx] = false"
          @click="toggleState(idx)"
          @keyup.enter.prevent="toggleState(idx)"
          @keyup.space.prevent="toggleState(idx)"
        >
          <div class="square-visual">
            <motion.svg
              class="square-shape"
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              :variants="svgVariants"
              :animate="card.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'"
              :transition="spring"
              style="transform-origin: 50% 50%"
            >
              <rect
                x="0"
                y="0"
                width="100"
                height="100"
                :rx="cornerRadius"
                :ry="cornerRadius"
                fill="var(--card-accent)"
                filter="url(#liquid-glow)"
              />
              <rect
                x="0"
                y="0"
                width="100"
                height="100"
                :rx="cornerRadius"
                :ry="cornerRadius"
                fill="var(--card-accent-soft)"
                opacity="0.75"
              />
            </motion.svg>
            <div class="square-glass"></div>
            <div class="square-highlight"></div>
          </div>

          <Transition name="fade-scale">
            <div v-if="hovered[idx] && !card.isActive" class="square-index">
              {{ idx + 1 }}
            </div>
          </Transition>

          <Transition name="fade">
            <article v-if="card.isActive" class="square-panel">
              <div class="square-panel__surface">
                <p class="square-panel__kicker">{{ card.kicker }}</p>
                <h2 class="card-title">{{ card.title }}</h2>
                <p class="card-body">{{ card.description }}</p>
              </div>
            </article>
          </Transition>

          <div v-if="!card.isActive && !hovered[idx]" class="square-dot"></div>
        </motion.li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { motion } from "motion-v";
import { reactive, ref } from "vue";

const palettes = [
  {
    accent: "var(--color-card-1)",
    soft: "var(--color-card-1-soft)",
    glow: "var(--color-card-1-glow)",
    ink: "var(--color-card-1-ink)",
  },
  {
    accent: "var(--color-card-2)",
    soft: "var(--color-card-2-soft)",
    glow: "var(--color-card-2-glow)",
    ink: "var(--color-card-2-ink)",
  },
  {
    accent: "var(--color-card-3)",
    soft: "var(--color-card-3-soft)",
    glow: "var(--color-card-3-glow)",
    ink: "var(--color-card-3-ink)",
  },
  {
    accent: "var(--color-card-4)",
    soft: "var(--color-card-4-soft)",
    glow: "var(--color-card-4-glow)",
    ink: "var(--color-card-4-ink)",
  },
];

const cards = reactive([
  {
    kicker: "Research Ritual",
    title: "Insights Before Interfaces",
    description:
      "Every sprint starts with mapping the journeys hidden in raw analytics. I pin the numbers onto sticky walls, then watch patterns appear before a single component is drawn.",
    isActive: false,
  },
  {
    kicker: "Workshop Geometry",
    title: "Co-Designing Without Ego",
    description:
      "Product owners, engineers, marketing—I choreograph workshops so each voice snaps into place. The best wireframe is the one we sketch together in the same room.",
    isActive: false,
  },
  {
    kicker: "Prototype Tempo",
    title: "Faster Than the Feedback Loop",
    description:
      "Clickable stories ship within 48 hours. Micro-interactions, haptic hints, and sound cues let stakeholders feel the future experience, not just imagine it.",
    isActive: false,
  },
  {
    kicker: "Ethical Metrics",
    title: "Numbers With Empathy",
    description:
      "Dashboards get rewired to highlight the humans behind conversion curves. Success is framed around clarity, accessibility, and the calm confidence of every user.",
    isActive: false,
  },
]);

const hovered = reactive(Array.from({ length: cards.length }, () => false));
const lastToggledIdx = ref(-1);

const spring = { type: "spring", stiffness: 30, damping: 7, mass: 0.35 };

const boxVariants = {
  default: {
    width: 120,
    height: 120,
    marginLeft: 0,
    marginRight: 0,
    y: 0,
    transition: spring,
  },
  hover: {
    width: 176,
    height: 176,
    marginLeft: 12,
    marginRight: 12,
    transition: spring,
  },
  active: (i) => ({
    width: 560,
    height: 560,
    marginLeft: 16,
    marginRight: 16,
    y: i % 2 === 0 ? "-14%" : "14%",
    transition: spring,
  }),
};

const svgVariants = {
  default: { rotate: 0, scale: 1 },
  hover: { rotate: 45, scale: 1 },
  active: { rotate: 45, scale: 1 },
};

const cornerRadius = 18;

function toggleState(idx) {
  cards[idx].isActive = !cards[idx].isActive;
  lastToggledIdx.value = idx;
}

function getLayoutSpring(idx) {
  const distance = lastToggledIdx.value === -1 ? 0 : Math.abs(idx - lastToggledIdx.value);
  return { ...spring, delay: distance * 0.35 };
}

function getCardStyle(idx) {
  const palette = palettes[idx % palettes.length];
  return {
    "--card-accent": palette.accent,
    "--card-accent-soft": palette.soft,
    "--card-glow": palette.glow,
    "--card-ink": palette.ink,
  };
}
</script>

<style scoped>
.hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(280px, 460px) minmax(320px, 1fr);
  align-items: center;
  gap: clamp(32px, 8vw, 88px);
  min-height: 100vh;
  padding-inline: clamp(24px, 8vw, 112px);
  padding-block: clamp(48px, 10vh, 120px);
  box-sizing: border-box;
}

.hero__text {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 520px;
}

.hero__stage {
  position: relative;
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  pointer-events: none;
}

.hero__stage::before {
  content: "UX PATTERN INDEX • UX PATTERN INDEX";
  position: absolute;
  inset: auto;
  top: 4%;
  right: -18%;
  font-family: var(--font-family-display);
  font-weight: 600;
  font-size: clamp(96px, 16vw, 180px);
  letter-spacing: -0.04em;
  color: var(--color-stage-text);
  white-space: nowrap;
  pointer-events: none;
  transform: rotate(-90deg);
}

.hero__filters {
  position: absolute;
}

.motion-list {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: clamp(16px, 3vw, 32px);
  flex-wrap: wrap;
  max-width: 720px;
  margin: 0;
  padding: 0;
  list-style: none;
  pointer-events: auto;
}

.motion-square {
  position: relative;
  width: 120px;
  height: 120px;
  list-style: none;
  cursor: pointer;
  perspective: 1200px;
  transition: filter 200ms ease;
  outline: none;
}

.motion-square:focus-visible {
  box-shadow: 0 0 0 2px rgba(244, 244, 245, 0.65);
  border-radius: 24px;
}

.square-visual {
  position: absolute;
  inset: 0;
  filter: drop-shadow(0 18px 52px rgba(7, 9, 14, 0.35));
}

.square-shape {
  display: block;
}

.square-glass {
  position: absolute;
  inset: 10%;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.02));
  backdrop-filter: blur(22px) saturate(160%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
  opacity: 0;
  transition: opacity 260ms ease;
  pointer-events: none;
}

.square-highlight {
  position: absolute;
  inset: 0;
  border-radius: 36px;
  background: radial-gradient(circle at 50% 32%, var(--card-glow) 0%, transparent 68%);
  filter: blur(0);
  opacity: 0;
  mix-blend-mode: screen;
  transition: opacity 240ms ease;
  pointer-events: none;
}

.motion-square[data-hover="true"] .square-highlight,
.motion-square[data-state="true"] .square-highlight {
  opacity: 1;
}

.motion-square[data-hover="true"] .square-glass,
.motion-square[data-state="true"] .square-glass {
  opacity: 1;
}

.square-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.24);
  box-shadow: 0 0 0 1px rgba(5, 6, 7, 0.25) inset, 0 12px 24px rgba(7, 9, 14, 0.25);
  transform: translate(-50%, -50%);
  transition: opacity 200ms ease, transform 200ms ease;
  pointer-events: none;
}

.motion-square[data-hover="true"] .square-dot,
.motion-square[data-state="true"] .square-dot {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.6);
}

.square-index {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-family-display);
  font-weight: 700;
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1;
  color: var(--card-ink);
  text-shadow: 0 18px 38px rgba(8, 11, 19, 0.35);
  pointer-events: none;
}

.square-panel {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.square-panel__surface {
  width: clamp(260px, 64%, 360px);
  padding: clamp(32px, 8vw, 48px);
  border-radius: 32px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.74));
  color: var(--card-ink);
  box-shadow: 0 28px 80px rgba(15, 17, 26, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(26px) saturate(140%);
  display: flex;
  flex-direction: column;
  gap: 18px;
  pointer-events: auto;
}

.square-panel__kicker {
  font-family: var(--font-family-display);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.52);
  margin: 0;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.65);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 260ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1180px) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
    padding-block: clamp(40px, 12vh, 96px);
  }

  .hero__text {
    max-width: none;
  }

  .hero__stage {
    justify-content: center;
    min-height: 480px;
  }

  .hero__stage::before {
    top: 12%;
    right: auto;
    left: 50%;
    transform: translateX(-50%) rotate(-90deg);
    font-size: clamp(84px, 18vw, 160px);
  }

  .motion-list {
    justify-content: center;
    max-width: none;
  }
}

@media (max-width: 720px) {
  .hero {
    padding-inline: clamp(16px, 6vw, 48px);
  }

  .hero__stage {
    min-height: 420px;
  }

  .motion-square {
    width: 104px;
    height: 104px;
  }

  .square-panel__surface {
    width: clamp(220px, 78%, 320px);
    padding: clamp(28px, 10vw, 40px);
  }

  .square-index {
    font-size: clamp(32px, 12vw, 48px);
  }
}

@media (max-width: 560px) {
  .hero__stage::before {
    font-size: clamp(64px, 24vw, 120px);
  }

  .square-panel__surface {
    width: clamp(200px, 86%, 280px);
  }
}
</style>
