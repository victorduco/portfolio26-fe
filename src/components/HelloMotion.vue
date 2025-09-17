<template>
  <section class="hero">
    <div class="hero__text">
      <h1 class="h1">Rectangles That Rules Numbers</h1>
      <p class="body1">
        This is story of me and how UX can change things around us. Something
        else to write here.
      </p>
    </div>

    <div class="hero__stage"></div>
    <ul
      class="motion-list"
      layout
      :transition="{
        layout: { type: 'spring', stiffness: 28, damping: 10, mass: 0.2 },
      }"
    >
      <motion.li
        v-for="(block, idx) in blocks"
        :key="idx"
        layout
        :variants="boxVariants"
        :animate="
          block.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'
        "
        :transition="getLayoutSpring(idx)"
        initial="default"
        class="motion-square"
        :class="[`motion-square--${block.slug}`, { 'is-active': block.isActive }]"
        @mouseenter="hovered[idx] = true"
        @mouseleave="hovered[idx] = false"
        @click="toggleState(idx)"
        :data-state="block.isActive"
        :style="getBlockVars(block)"
      >
        <motion.div
          class="square-bg"
          :variants="squareBgVariants"
          :animate="
            block.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'
          "
          :transition="spring"
        />

        <motion.div
          class="square-overlay"
          :variants="squareContentVariants"
          :animate="
            block.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'
          "
          :transition="spring"
        >
          <transition name="fade">
            <span
              v-if="hovered[idx] || block.isActive"
              class="square-number"
            >
              {{ block.number }}
            </span>
          </transition>

          <transition name="rise">
            <div v-if="block.isActive" class="square-panel">
              <h3 class="square-title">{{ block.title }}</h3>
              <p class="square-copy">{{ block.copy }}</p>
            </div>
          </transition>
        </motion.div>
      </motion.li>
    </ul>
  </section>
</template>

<script setup>
import { motion } from "motion-v";
import { reactive, ref } from "vue";

const baseBlocks = [
  {
    slug: "one",
    number: "1",
    title: "Four Facts about Victor",
    copy:
      "Gute Websites sehen nicht nur gut aus – sie fühlen sich auch gut an. Kleine Bewegungen, durchdachte Übergänge und Fokus auf Details.",
    colors: {
      hoverStart: "#0F4CFF",
      hoverEnd: "#30A3FF",
      hoverGlow: "rgba(31, 116, 255, 0.45)",
      activeStart: "#1C64FF",
      activeEnd: "#2AB6FF",
      activeGlow: "rgba(33, 142, 255, 0.6)",
    },
  },
  {
    slug: "two",
    number: "2",
    title: "Craft over Chaos",
    copy:
      "Prozesse sind nicht trocken – sie gestalten Momente. Jedes Interface erzählt eine kurze, klare Geschichte ohne Reibung.",
    colors: {
      hoverStart: "#F2668B",
      hoverEnd: "#FF9CBD",
      hoverGlow: "rgba(255, 120, 165, 0.45)",
      activeStart: "#FF6F9F",
      activeEnd: "#FFBED7",
      activeGlow: "rgba(255, 146, 187, 0.6)",
    },
  },
  {
    slug: "three",
    number: "3",
    title: "Motion as Language",
    copy:
      "Übergänge lenken den Blick und stärken Vertrauen. Bewegung ist hier kein Effekt, sondern Bauplan und Orientierung.",
    colors: {
      hoverStart: "#00DBB6",
      hoverEnd: "#34FFDC",
      hoverGlow: "rgba(0, 206, 176, 0.45)",
      activeStart: "#16F2C7",
      activeEnd: "#5CFFE3",
      activeGlow: "rgba(45, 255, 210, 0.6)",
    },
  },
  {
    slug: "four",
    number: "4",
    title: "Always Human",
    copy:
      "Design fühlt sich gut an, wenn Menschen sich gesehen fühlen. Jedes Detail führt zu mehr Nähe, weniger Friktion.",
    colors: {
      hoverStart: "#FFE066",
      hoverEnd: "#FFF199",
      hoverGlow: "rgba(255, 224, 102, 0.45)",
      activeStart: "#FFE676",
      activeEnd: "#FFF7B8",
      activeGlow: "rgba(255, 234, 135, 0.6)",
    },
  },
];

const blocks = reactive(baseBlocks.map((block) => ({ ...block, isActive: false })));
const hovered = reactive(Array.from({ length: blocks.length }, () => false));
const lastToggledIdx = ref(-1);

/** Пружина (как было) */
const spring = { type: "spring", stiffness: 20, damping: 4, mass: 0.1 };

/** ТВОИ ЖЕ boxVariants — без изменений */
const boxVariants = {
  default: {
    width: 136,
    height: 136,
    marginLeft: 0,
    marginRight: 0,
    y: 0,
    transition: spring,
  },
  hover: {
    width: 200,
    height: 200,
    marginLeft: 12,
    marginRight: 12,
    transition: spring,
  },
  active: () => ({
    width: 320,
    height: 320,
    marginLeft: 16,
    marginRight: 16,
    transition: spring,
  }),
};

const squareBgVariants = {
  default: {
    rotate: 0,
    scale: 1,
  },
  hover: {
    rotate: 45,
    scale: 1.04,
  },
  active: {
    rotate: 45,
    scale: 1.08,
  },
};

const squareContentVariants = {
  default: {
    rotate: 0,
  },
  hover: {
    rotate: -45,
  },
  active: {
    rotate: -45,
  },
};

function toggleState(idx) {
  blocks[idx].isActive = !blocks[idx].isActive; // НЕ закрываем другие
  lastToggledIdx.value = idx;
}

function getLayoutSpring(idx) {
  const d =
    lastToggledIdx.value === -1 ? 0 : Math.abs(idx - lastToggledIdx.value);
  return { ...spring, delay: d * 0.5 };
}

function getBlockVars(block) {
  return {
    "--square-hover-start": block.colors.hoverStart,
    "--square-hover-end": block.colors.hoverEnd,
    "--square-hover-glow": block.colors.hoverGlow,
    "--square-active-start": block.colors.activeStart,
    "--square-active-end": block.colors.activeEnd,
    "--square-active-glow": block.colors.activeGlow,
  };
}
</script>

<style scoped>
.hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: center;
  justify-items: start;
  width: 100%;
  max-width: 1040px;
  min-height: 100vh;
  padding-block: clamp(48px, 12vh, 96px);
  padding-inline-start: clamp(32px, 12vw, 120px);
  padding-inline-end: clamp(24px, 6vw, 96px);
  box-sizing: border-box;
  overflow: visible;
}

.hero__text {
  grid-area: 1 / 1;
  max-width: 720px;
  display: grid;
  gap: 24px;
  position: relative;
  z-index: 3;
}

.hero__stage {
  grid-area: 1 / 1;
  align-self: stretch;
  justify-self: stretch;
  padding-top: clamp(120px, 22vh, 260px);
  position: relative;
  z-index: 1;
  pointer-events: none;
}

.motion-list {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(16px, 3vw, 36px);
  align-items: flex-start;
  margin: clamp(40px, 12vh, 96px) 0 0 0;
  justify-content: flex-start;
  padding: 0;
  list-style: none;
  pointer-events: auto;
}

.motion-square {
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 136px;
  height: 136px;
  background: transparent;
  list-style: none;
  box-sizing: border-box;
  cursor: pointer;
  z-index: 1;
}
/* SVG поверх при hover/active */
.motion-square[data-state="true"],
.motion-square:hover {
  z-index: 4;
}

.square-bg,
.square-overlay {
  position: absolute;
  inset: 0;
  border-radius: 28px;
}

.square-bg {
  background: linear-gradient(145deg, #2a2a2a, #202020);
  box-shadow:
    inset 0 0 0 0 rgba(255, 255, 255, 0),
    0 10px 24px rgba(0, 0, 0, 0.6);
  transition: background 260ms ease, box-shadow 260ms ease;
}

.square-bg::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 34%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.3), transparent 70%);
  transform: translate(-50%, -50%);
  transition: background 260ms ease, transform 260ms ease, box-shadow 260ms ease;
  box-shadow: inset 0 0 0 rgba(255, 255, 255, 0);
}

.square-overlay {
  display: grid;
  place-items: center;
  pointer-events: none;
}

.square-number {
  font-size: clamp(28px, 4vw, 54px);
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 26px rgba(255, 255, 255, 0.45);
  letter-spacing: -0.02em;
}

.square-panel {
  display: grid;
  gap: 16px;
  text-align: center;
  max-width: 220px;
}

.square-title {
  margin: 0;
  font-size: clamp(18px, 2.4vw, 28px);
  font-weight: 700;
  color: #0b0b0b;
}

.square-copy {
  margin: 0;
  font-size: clamp(13px, 1.6vw, 18px);
  line-height: 1.35;
  color: rgba(12, 12, 12, 0.85);
}

.motion-square.is-active .square-title,
.motion-square.is-active .square-copy {
  color: #0b0b0b;
}

.motion-square:hover .square-title,
.motion-square:hover .square-copy {
  color: #0b0b0b;
}

.motion-square:is(.motion-square--one, .motion-square--two, .motion-square--three, .motion-square--four) .square-panel {
  filter: drop-shadow(0 18px 36px rgba(0, 0, 0, 0.4));
}

.motion-square:hover .square-bg,
.motion-square.is-active .square-bg {
  box-shadow:
    inset 0 0 90px rgba(255, 255, 255, 0.18),
    0 30px 70px var(--square-hover-glow);
}

.motion-square.is-active .square-bg {
  box-shadow:
    inset 0 0 120px rgba(255, 255, 255, 0.22),
    0 36px 90px var(--square-active-glow);
}

.motion-square:hover .square-bg::after,
.motion-square.is-active .square-bg::after {
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.2) 55%, transparent 70%);
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 0 45px rgba(255, 255, 255, 0.35);
}

.motion-square:hover .square-bg {
  background: linear-gradient(135deg, var(--square-hover-start), var(--square-hover-end));
}

.motion-square.is-active .square-bg {
  background: linear-gradient(135deg, var(--square-active-start), var(--square-active-end));
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.rise-enter-active,
.rise-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.rise-enter-from,
.rise-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 768px) {
  .hero {
    min-height: auto;
    padding-block: clamp(40px, 12vh, 72px);
    padding-inline-start: clamp(24px, 16vw, 72px);
    padding-inline-end: clamp(16px, 8vw, 48px);
  }

  .hero__stage {
    padding-top: clamp(96px, 24vh, 200px);
  }

  .motion-list {
    justify-content: center;
    gap: 24px;
    margin-top: clamp(32px, 10vh, 60px);
  }
}
</style>
