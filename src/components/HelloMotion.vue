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
        layout: { type: 'spring', stiffness: 24, damping: 6, mass: 0.3 },
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
        :style="getSquareStyle(block)"
        @mouseenter="hovered[idx] = true"
        @mouseleave="hovered[idx] = false"
        @click="toggleState(idx)"
      >
        <motion.div
          class="square-surface"
          layout
          :variants="surfaceVariants"
          :animate="
            block.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'
          "
          :transition="spring"
          style="transform-origin: 50% 50%"
        >
          <span class="square-circle" />
          <div class="square-inner">
            <transition name="fade" mode="out-in">
              <div
                v-if="block.isActive"
                :key="`active-${block.id}`"
                class="square-details"
              >
                <span class="square-details__number">{{ block.id }}</span>
                <h3 class="square-details__title">{{ block.title }}</h3>
                <p class="square-details__lead">{{ block.lead }}</p>
                <p
                  v-for="(paragraph, paragraphIdx) in block.body"
                  :key="`p-${block.id}-${paragraphIdx}`"
                  class="square-details__text"
                >
                  {{ paragraph }}
                </p>
              </div>
              <div
                v-else-if="hovered[idx]"
                :key="`hover-${block.id}`"
                class="square-number"
              >
                {{ block.id }}
              </div>
              <div :key="`default-${block.id}`" class="square-placeholder"></div>
            </transition>
          </div>
        </motion.div>
      </motion.li>
    </ul>
  </section>
</template>

<script setup>
import { motion } from "motion-v";
import { reactive, ref } from "vue";

const spring = { type: "spring", stiffness: 24, damping: 6, mass: 0.3 };

const blocks = reactive([
  {
    id: 1,
    title: "Four Facts about Victor",
    lead: "Gute Websites sehen nicht nur gut aus – sie fühlen sich auch gut an.",
    body: [
      "Kleine Bewegungen, durchdachte Übergänge und spürbare Logik hinter jedem Klick.",
      "Ich verbinde Motion Design mit nutzerzentrierter Strategie, damit digitale Produkte lebendig wirken.",
    ],
    colors: {
      hover: {
        background: "linear-gradient(135deg, #1b3cff 0%, #4ad2ff 100%)",
        shadow:
          "inset 0 0 40px rgba(93, 200, 255, 0.45), 0 25px 45px rgba(27, 60, 255, 0.38)",
        number: "#08112c",
      },
      active: {
        background: "linear-gradient(135deg, #0d1c82 0%, #3770ff 100%)",
        shadow:
          "inset 0 0 48px rgba(98, 188, 255, 0.65), 0 32px 70px rgba(13, 28, 90, 0.6)",
        number: "#071131",
        text: "#eaf6ff",
      },
    },
    isActive: false,
  },
  {
    id: 2,
    title: "Motion loves Clarity",
    lead: "Bewegung ist nur dann stark, wenn sie eine Richtung vorgibt.",
    body: [
      "Ich nutze Animationen, um Entscheidungen zu erklären und Nutzer:innen ohne Worte zu führen.",
      "Damit Komplexes leicht verständlich bleibt und der Fokus immer auf dem Ziel liegt.",
    ],
    colors: {
      hover: {
        background: "linear-gradient(135deg, #0fcf98 0%, #76ffbe 100%)",
        shadow:
          "inset 0 0 40px rgba(118, 255, 190, 0.5), 0 25px 45px rgba(15, 207, 152, 0.35)",
        number: "#063d2c",
      },
      active: {
        background: "linear-gradient(135deg, #0a996c 0%, #4ef3a5 100%)",
        shadow:
          "inset 0 0 48px rgba(118, 255, 190, 0.65), 0 32px 70px rgba(6, 100, 70, 0.55)",
        number: "#042116",
        text: "#062c1c",
      },
    },
    isActive: false,
  },
  {
    id: 3,
    title: "Human Details Matter",
    lead: "Gute Interfaces erzählen Geschichten, statt nur Daten anzuzeigen.",
    body: [
      "Ich achte auf Mikrointeraktionen, die Empathie wecken und Vertrauen schaffen.",
      "So fühlt sich Technik wie ein Gespräch an – nicht wie ein Formular.",
    ],
    colors: {
      hover: {
        background: "linear-gradient(135deg, #ff3d6a 0%, #ffc0d0 100%)",
        shadow:
          "inset 0 0 40px rgba(255, 164, 194, 0.55), 0 25px 45px rgba(255, 61, 106, 0.35)",
        number: "#4a0b1b",
      },
      active: {
        background: "linear-gradient(135deg, #d72660 0%, #ff7aa6 100%)",
        shadow:
          "inset 0 0 48px rgba(255, 166, 196, 0.68), 0 32px 70px rgba(154, 22, 60, 0.5)",
        number: "#3b0618",
        text: "#360511",
      },
    },
    isActive: false,
  },
  {
    id: 4,
    title: "Playful yet Precise",
    lead: "Jedes Konzept braucht einen Funken, damit es im Gedächtnis bleibt.",
    body: [
      "Ich kombiniere klare Typografie mit mutigen Farben und Bewegungen.",
      "So entsteht ein Erlebnis, das Freude macht und trotzdem absolut fokussiert bleibt.",
    ],
    colors: {
      hover: {
        background: "linear-gradient(135deg, #ffd447 0%, #fff8b0 100%)",
        shadow:
          "inset 0 0 40px rgba(255, 243, 173, 0.6), 0 25px 45px rgba(255, 212, 71, 0.4)",
        number: "#5c4200",
      },
      active: {
        background: "linear-gradient(135deg, #f1b211 0%, #ffe98a 100%)",
        shadow:
          "inset 0 0 48px rgba(255, 239, 170, 0.7), 0 32px 70px rgba(161, 115, 0, 0.45)",
        number: "#4a3200",
        text: "#332000",
      },
    },
    isActive: false,
  },
]);

const hovered = reactive(Array.from({ length: blocks.length }, () => false));
const lastToggledIdx = ref(-1);

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
    width: 192,
    height: 192,
    marginLeft: 12,
    marginRight: 12,
    y: 0,
    transition: spring,
  },
  active: {
    width: 420,
    height: 420,
    marginLeft: 16,
    marginRight: 16,
    y: 0,
    transition: spring,
  },
};

const surfaceVariants = {
  default: { rotate: 0, scale: 1 },
  hover: { rotate: 45, scale: 1.08 },
  active: { rotate: 45, scale: 1.5 },
};

function toggleState(idx) {
  const nextState = !blocks[idx].isActive;
  blocks.forEach((block, blockIdx) => {
    block.isActive = blockIdx === idx ? nextState : false;
  });
  lastToggledIdx.value = idx;
}

function getLayoutSpring(idx) {
  const d =
    lastToggledIdx.value === -1 ? 0 : Math.abs(idx - lastToggledIdx.value);
  return { ...spring, delay: d * 0.12 };
}

function getSquareStyle(block) {
  return {
    "--square-default-bg": "#2a2a2a",
    "--square-default-circle": "#3a3a3a",
    "--square-hover-bg": block.colors.hover.background,
    "--square-hover-shadow": block.colors.hover.shadow,
    "--square-hover-number": block.colors.hover.number,
    "--square-active-bg": block.colors.active.background,
    "--square-active-shadow": block.colors.active.shadow,
    "--square-active-number": block.colors.active.number,
    "--square-active-text": block.colors.active.text ?? "#ffffff",
  };
}
</script>

<style scoped>
.hero {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  padding: clamp(48px, 10vh, 104px) clamp(24px, 8vw, 120px);
  display: grid;
  gap: clamp(40px, 8vh, 72px);
  box-sizing: border-box;
}

.hero__text {
  display: grid;
  gap: 24px;
  max-width: 720px;
}

.motion-list {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(16px, 3vw, 32px);
  align-items: flex-start;
  margin: 0;
  padding: 0;
  list-style: none;
}

.motion-square {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-square-content);
  transition: z-index 0.2s ease;
  --square-default-bg: #2a2a2a;
  --square-default-circle: #3a3a3a;
  --square-hover-bg: var(--square-default-bg);
  --square-hover-shadow: none;
  --square-hover-number: #ffffff;
  --square-active-bg: var(--square-hover-bg);
  --square-active-shadow: var(--square-hover-shadow);
  --square-active-number: var(--square-hover-number);
  --square-active-text: #ffffff;
}

.motion-square.is-hovered,
.motion-square.is-active {
  z-index: 5;
}

.square-surface {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 32px;
  background: var(--square-default-bg);
  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0);
  transition: background 0.35s ease, box-shadow 0.35s ease;
  overflow: hidden;
}

.square-circle {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 36%;
  height: 36%;
  border-radius: 50%;
  background: var(--square-default-circle);
  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.35);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.square-inner {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  transform: rotate(0deg);
  transition: transform 0.35s ease;
  padding: 32px;
  box-sizing: border-box;
}

.square-number {
  font-weight: 700;
  font-size: 64px;
  line-height: 1;
  color: var(--square-hover-number);
  text-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
}

.square-details {
  display: grid;
  gap: 12px;
  text-align: left;
  color: var(--square-active-text);
}

.square-details__number {
  font-size: 54px;
  font-weight: 700;
  line-height: 1;
  color: var(--square-active-number);
  text-shadow: 0 16px 32px rgba(0, 0, 0, 0.35);
}

.square-details__title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.square-details__lead {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  opacity: 0.95;
}

.square-details__text {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  opacity: 0.9;
}

.square-placeholder {
  width: 1px;
  height: 1px;
}

.motion-square.is-hovered .square-surface,
.motion-square.is-active .square-surface {
  background: var(--square-hover-bg);
  box-shadow: var(--square-hover-shadow);
}

.motion-square.is-active .square-surface {
  background: var(--square-active-bg);
  box-shadow: var(--square-active-shadow);
}

.motion-square.is-hovered .square-inner,
.motion-square.is-active .square-inner {
  transform: rotate(-45deg);
}

.motion-square.is-hovered .square-circle,
.motion-square.is-active .square-circle {
  opacity: 0;
  transform: scale(0.6);
}

.motion-square.is-active .square-number {
  color: var(--square-active-number);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 960px) {
  .hero {
    padding: clamp(40px, 8vh, 80px) clamp(20px, 6vw, 64px);
  }

  .motion-list {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .square-inner {
    padding: 24px;
  }

  .square-details__title {
    font-size: 24px;
  }

  .square-details__lead {
    font-size: 16px;
  }

  .square-details__text {
    font-size: 15px;
  }
}
</style>
