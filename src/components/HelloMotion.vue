<template>
  <section class="hero">
    <div class="hero__text">
      <p class="hero__eyebrow">Victor Ube · Senior UX Designer</p>
      <h1 class="h1">Rectangles that reshape decisions</h1>
      <p class="body1">
        I translate messy data into tactile stories. A mix of research, prototypes,
        and micro-interactions helps teams feel the numbers instead of just seeing
        them.
      </p>
    </div>

    <div class="hero__stage">
      <svg class="visually-hidden" aria-hidden="true">
        <defs>
          <filter
            v-for="(_, idx) in cards"
            :key="`liquid-${idx}`"
            :id="`liquid-${idx}`"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            color-interpolation-filters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves="3"
              seed="11"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="14" result="blur" />
            <feComposite in="blur" in2="SourceGraphic" operator="in" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 18 -8"
            />
            <feBlend mode="screen" in="SourceGraphic" result="glow" />
            <feComposite in="glow" in2="SourceGraphic" operator="over" />
          </filter>
        </defs>
      </svg>

      <ul
        class="motion-list"
        layout
        :transition="{
          layout: { type: 'spring', stiffness: 24, damping: 6, mass: 0.16 },
        }"
      >
        <motion.li
          v-for="(card, idx) in cards"
          :key="card.number"
          layout
          :custom="idx"
          :variants="boxVariants"
          :animate="
            card.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'
          "
          :transition="getLayoutSpring(idx)"
          initial="default"
          class="motion-square"
          :class="{ 'is-hovered': hovered[idx], 'is-active': card.isActive }"
          :style="getSquareVars(card, idx)"
          @mouseenter="hovered[idx] = true"
          @mouseleave="hovered[idx] = false"
          @click="toggleState(idx)"
        >
          <motion.div
            class="square-shape"
            :variants="shapeVariants"
            :animate="
              card.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'
            "
            :transition="spring"
          />

          <div
            class="square-liquid"
            :class="{ 'is-visible': hovered[idx] || card.isActive, 'is-active': card.isActive }"
          />

          <div class="square-rotator">
            <div class="square-number" :class="{ 'is-visible': hovered[idx] || card.isActive }">
              {{ card.number }}
            </div>

            <Transition name="panel" mode="out-in">
              <article v-if="card.isActive" class="square-panel">
                <header class="square-panel__header">
                  <p class="square-panel__eyebrow">{{ card.category }}</p>
                  <p class="square-panel__meta">{{ card.timeline }}</p>
                </header>
                <h2 class="square-panel__title">{{ card.title }}</h2>
                <p class="square-panel__body">{{ card.copy }}</p>
                <ul class="square-panel__list">
                  <li v-for="point in card.points" :key="point">{{ point }}</li>
                </ul>
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

const cards = reactive([
  {
    number: "01",
    title: "Empathy before pixels",
    copy:
      "Weekly field studies expose the frictions hidden in analytics. I map them into service blueprints that guide the first prototype.",
    category: "Discovery Sprint",
    timeline: "2 weeks · 14 interviews",
    points: [
      "Diary studies reveal workflow gaps",
      "Personas validated with quant layering",
      "Framing workshop that aligns KPIs",
    ],
    accentVar: "--color-card-1",
    glowVar: "--color-card-1-glow",
    isActive: false,
  },
  {
    number: "02",
    title: "Prototypes you can feel",
    copy:
      "Micro-interactions are coded early. Designers, PMs, and engineers test flows on real data, not just static decks.",
    category: "Interaction Lab",
    timeline: "5 days · 3 iterations",
    points: [
      "Motion principles document",
      "Live data hooked to Figma tokens",
      "Handoff kits with component logic",
    ],
    accentVar: "--color-card-2",
    glowVar: "--color-card-2-glow",
    isActive: false,
  },
  {
    number: "03",
    title: "Decisions shaped by evidence",
    copy:
      "I build mixed-method dashboards that merge lab results with product metrics so leaders see confidence and risk side by side.",
    category: "Insight Ops",
    timeline: "Monthly · cross-team",
    points: [
      "North star experience metrics",
      "Experiment library with playback",
      "UX debt stacked next to revenue",
    ],
    accentVar: "--color-card-3",
    glowVar: "--color-card-3-glow",
    isActive: false,
  },
  {
    number: "04",
    title: "Continuous listening loops",
    copy:
      "Automation keeps the voice of the customer alive. Every launch triggers surveys, transcripts, and a highlight reel for the team.",
    category: "Ecosystem",
    timeline: "Always on",
    points: [
      "Research repository with tags",
      "AI summaries in stakeholder Slack",
      "Playback rituals after releases",
    ],
    accentVar: "--color-card-4",
    glowVar: "--color-card-4-glow",
    isActive: false,
  },
]);

const hovered = reactive(Array.from({ length: cards.length }, () => false));
const lastToggledIdx = ref(-1);

const spring = { type: "spring", stiffness: 24, damping: 6, mass: 0.16 };

const boxVariants = {
  default: {
    width: 128,
    height: 128,
    marginLeft: 0,
    marginRight: 0,
    y: 0,
    transition: spring,
  },
  hover: {
    width: 168,
    height: 168,
    marginLeft: 12,
    marginRight: 12,
    y: 0,
    transition: spring,
  },
  active: (i) => ({
    width: 560,
    height: 560,
    marginLeft: 24,
    marginRight: 24,
    y: i % 2 === 0 ? "-34%" : "34%",
    transition: spring,
  }),
};

const shapeVariants = {
  default: { rotate: 0 },
  hover: { rotate: 45 },
  active: { rotate: 45 },
};

function toggleState(idx) {
  cards[idx].isActive = !cards[idx].isActive;
  lastToggledIdx.value = idx;
}

function getLayoutSpring(idx) {
  const d =
    lastToggledIdx.value === -1 ? 0 : Math.abs(idx - lastToggledIdx.value);
  return { ...spring, delay: d * 0.4 };
}

function getSquareVars(card, idx) {
  const isLoud = hovered[idx] || card.isActive;
  return {
    "--square-accent": `var(${card.accentVar})`,
    "--square-glow": `var(${card.glowVar})`,
    "--square-filter": isLoud ? `url(#liquid-${idx})` : "none",
    "--square-alpha": isLoud ? 1 : 0,
  };
}
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(320px, 1fr);
  justify-items: start;
  padding: clamp(40px, 8vh, 96px) clamp(48px, 12vw, 160px) clamp(56px, 12vh, 120px)
    clamp(48px, 10vw, 144px);
  box-sizing: border-box;
  overflow: hidden;
}

.hero__text {
  max-width: 640px;
  display: grid;
  gap: 28px;
  z-index: 1;
}

.hero__eyebrow {
  font-family: var(--font-family-base);
  font-size: 18px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  margin: 0;
}

.hero__stage {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-inline: clamp(32px, 14vw, 200px);
  padding-block: clamp(160px, 24vh, 320px);
}

.visually-hidden {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

.motion-list {
  display: flex;
  gap: clamp(12px, 2vw, 24px);
  list-style: none;
  margin: 0;
  padding: 0;
  pointer-events: auto;
}

.motion-square {
  position: relative;
  width: 128px;
  height: 128px;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  pointer-events: auto;
  isolation: isolate;
}

.square-shape {
  position: absolute;
  inset: 0;
  border-radius: 34px;
  background: var(--color-square-surface);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
}

.motion-square.is-hovered .square-shape,
.motion-square.is-active .square-shape {
  background: var(--square-accent);
  box-shadow: 0 40px 90px color-mix(in srgb, var(--square-accent) 36%, transparent);
}

.square-liquid {
  position: absolute;
  inset: 10%;
  border-radius: 26px;
  background: color-mix(in srgb, var(--square-accent) 40%, transparent);
  mix-blend-mode: screen;
  backdrop-filter: blur(22px) saturate(180%);
  filter: var(--square-filter);
  opacity: var(--square-alpha, 0);
  transition: opacity 220ms ease, transform 220ms ease;
  transform: scale(0.82);
}

.motion-square.is-hovered .square-liquid {
  transform: scale(0.9);
}

.motion-square.is-active .square-liquid {
  inset: 8%;
  border-radius: 36px;
  transform: scale(1);
}

.square-rotator {
  position: absolute;
  inset: 0;
  display: grid;
  align-content: center;
  justify-items: center;
  transform: rotate(-45deg);
  pointer-events: none;
  padding: clamp(18px, 6vw, 64px);
  box-sizing: border-box;
  z-index: 2;
}

.square-number {
  font-family: var(--font-family-display);
  font-size: clamp(36px, 5vw, 72px);
  font-weight: 700;
  letter-spacing: -0.04em;
  color: var(--square-glow);
  text-shadow: 0 14px 38px color-mix(in srgb, var(--square-glow) 60%, transparent);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 220ms ease, transform 260ms ease;
}

.square-number.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.panel-enter-active,
.panel-leave-active {
  transition: opacity 260ms ease, transform 320ms ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(24px);
}

.square-panel {
  width: 100%;
  max-width: 380px;
  display: grid;
  gap: 18px;
  text-align: left;
  color: var(--color-text-primary);
  background: color-mix(in srgb, var(--square-accent) 22%, rgba(12, 12, 16, 0.65));
  border-radius: 28px;
  padding: clamp(20px, 4vw, 40px);
  box-shadow: 0 24px 80px color-mix(in srgb, var(--square-accent) 32%, transparent);
  backdrop-filter: blur(22px);
}

.square-panel__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--color-text-soft);
}

.square-panel__eyebrow,
.square-panel__meta {
  margin: 0;
}

.square-panel__title {
  font-family: var(--font-family-display);
  font-size: clamp(24px, 3vw, 40px);
  line-height: 1.1;
  margin: 0;
}

.square-panel__body {
  margin: 0;
  font-size: 18px;
  line-height: 1.55;
  color: var(--color-text-secondary);
}

.square-panel__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
  font-size: 16px;
  color: var(--color-text-primary);
}

.square-panel__list li {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.square-panel__list li::before {
  content: "•";
  color: var(--square-glow);
  font-size: 20px;
}

.motion-square::after {
  content: "";
  position: absolute;
  inset: -16px;
  border-radius: 40px;
  background: radial-gradient(
    circle at center,
    color-mix(in srgb, var(--square-glow) 16%, transparent),
    transparent 72%
  );
  opacity: 0;
  transition: opacity 260ms ease;
  pointer-events: none;
  z-index: -1;
}

.motion-square.is-active::after {
  opacity: 1;
}

@media (max-width: 1024px) {
  .hero {
    padding-inline: clamp(32px, 8vw, 96px);
  }

  .hero__stage {
    padding-inline: clamp(24px, 12vw, 120px);
  }

  .square-panel {
    max-width: 320px;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: clamp(32px, 12vw, 64px);
    grid-template-columns: minmax(0, 1fr);
  }

  .hero__stage {
    position: static;
    padding: 40px 0 0;
    justify-content: flex-start;
  }

  .motion-list {
    flex-wrap: wrap;
    gap: 18px;
  }

  .motion-square {
    flex: 1 1 calc(50% - 18px);
    min-width: 160px;
  }

  .motion-square.is-active {
    width: 100% !important;
    height: auto !important;
  }

  .square-panel {
    max-width: none;
  }
}
</style>
