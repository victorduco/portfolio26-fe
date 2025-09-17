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
        :key="idx"
        layout
        :custom="idx"
        :variants="boxVariants"
        :animate="
          block.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'
        "
        :transition="getLayoutSpring(idx)"
        initial="default"
        class="motion-square"
        @mouseenter="hovered[idx] = true"
        @mouseleave="hovered[idx] = false"
        @click="toggleState(idx)"
        :data-state="block.isActive"
      >
        <motion.div
          class="motion-square__background"
          :variants="shapeVariants"
          :animate="
            block.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'
          "
          :transition="spring"
          :style="getBackgroundStyle(idx)"
        />

        <div
          v-if="!hovered[idx] && !block.isActive"
          class="motion-circle"
        ></div>

        <transition name="fade">
          <div
            v-if="hovered[idx] && !block.isActive"
            class="motion-number"
            :style="getNumberStyle(idx)"
          >
            {{ idx + 1 }}
          </div>
        </transition>

        <transition name="fade">
          <article
            v-if="block.isActive"
            class="motion-panel"
            :style="getPanelStyle(idx)"
          >
            <span class="motion-panel__index">{{ idx + 1 }}</span>
            <h3 class="motion-panel__title">{{ block.title }}</h3>
            <p class="motion-panel__lead">{{ block.lead }}</p>
            <p class="motion-panel__details">{{ block.details }}</p>
          </article>
        </transition>
      </motion.li>
    </ul>
  </section>
</template>

<script setup>
import { motion } from "motion-v";
import { reactive, ref } from "vue";

const baseBlocks = [
  {
    title: "Four Facts about Victor",
    lead:
      "Gute Websites sehen nicht nur gut aus – sie fühlen sich auch gut an.",
    details:
      "Ich verbinde Forschung, Strategie und starke Visuals, um digitale Produkte lebendig zu machen.",
    hoverGradient: "linear-gradient(135deg, #4b7bff 0%, #29e2ff 100%)",
    activeGradient: "linear-gradient(135deg, #2b4dff 0%, #68f3ff 100%)",
    hoverShadow:
      "inset 0 0 60px rgba(255, 255, 255, 0.35), 0 28px 52px rgba(71, 162, 255, 0.35)",
    activeShadow:
      "inset 0 0 80px rgba(255, 255, 255, 0.32), 0 36px 72px rgba(71, 162, 255, 0.45)",
    numberColor: "#061932",
    panelTextColor: "#05080f",
  },
  {
    title: "Four Facts about Victor",
    lead: "Research first, pixels second.",
    details:
      "Jedes Interface beginnt mit echten Insights der Nutzer:innen, damit das Design nicht nur schön, sondern sinnvoll ist.",
    hoverGradient: "linear-gradient(135deg, #ff9b07 0%, #ffe760 100%)",
    activeGradient: "linear-gradient(135deg, #ffb40f 0%, #fff38f 100%)",
    hoverShadow:
      "inset 0 0 60px rgba(255, 255, 255, 0.35), 0 28px 52px rgba(255, 207, 86, 0.35)",
    activeShadow:
      "inset 0 0 80px rgba(255, 255, 255, 0.32), 0 36px 72px rgba(255, 207, 86, 0.45)",
    numberColor: "#211200",
    panelTextColor: "#1d1300",
  },
  {
    title: "Four Facts about Victor",
    lead: "Motion erklärt komplexe Dinge ohne Worte.",
    details:
      "Durchdachte Animationen führen den Blick, erklären Abläufe und lassen komplexe Systeme leicht erscheinen.",
    hoverGradient: "linear-gradient(135deg, #00b76b 0%, #8bfd7e 100%)",
    activeGradient: "linear-gradient(135deg, #00cb76 0%, #b7ff95 100%)",
    hoverShadow:
      "inset 0 0 60px rgba(255, 255, 255, 0.35), 0 28px 52px rgba(0, 197, 120, 0.35)",
    activeShadow:
      "inset 0 0 80px rgba(255, 255, 255, 0.32), 0 36px 72px rgba(0, 197, 120, 0.45)",
    numberColor: "#012416",
    panelTextColor: "#062013",
  },
  {
    title: "Four Facts about Victor",
    lead: "Kollaboration macht Ideen schnell erlebbar.",
    details:
      "Ich arbeite nah am Team, teste früh und liefere stetig, sodass Konzepte rasch zu erlebbaren Prototypen werden.",
    hoverGradient: "linear-gradient(135deg, #ff3e6e 0%, #ffa6ff 100%)",
    activeGradient: "linear-gradient(135deg, #ff5b86 0%, #ffd0ff 100%)",
    hoverShadow:
      "inset 0 0 60px rgba(255, 255, 255, 0.35), 0 28px 52px rgba(255, 133, 191, 0.35)",
    activeShadow:
      "inset 0 0 80px rgba(255, 255, 255, 0.32), 0 36px 72px rgba(255, 133, 191, 0.45)",
    numberColor: "#2e0617",
    panelTextColor: "#240612",
  },
];

const blocks = reactive(
  baseBlocks.map((block) => ({
    ...block,
    isActive: false,
  }))
);

const hovered = reactive(Array.from({ length: blocks.length }, () => false));
const lastToggledIdx = ref(-1);

const spring = { type: "spring", stiffness: 20, damping: 5, mass: 0.15 };

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
    width: 192,
    height: 192,
    marginLeft: 14,
    marginRight: 14,
    transition: spring,
  },
  active: {
    width: 360,
    height: 360,
    marginLeft: 24,
    marginRight: 24,
    y: 0,
    transition: spring,
  },
};

const shapeVariants = {
  default: { rotate: 0 },
  hover: { rotate: 45 },
  active: { rotate: 45 },
};

const defaultBackground = "#2a2a2a";
const defaultShadow = "inset 0 0 28px rgba(0, 0, 0, 0.55)";

function toggleState(idx) {
  const nextState = !blocks[idx].isActive;
  blocks.forEach((block, blockIdx) => {
    block.isActive = blockIdx === idx ? nextState : false;
  });
  lastToggledIdx.value = nextState ? idx : -1;
}

function getLayoutSpring(idx) {
  if (lastToggledIdx.value === -1) {
    return spring;
  }

  const distance = Math.abs(idx - lastToggledIdx.value);
  return { ...spring, delay: distance * 0.06 };
}

function getBackgroundStyle(idx) {
  const block = blocks[idx];

  if (block.isActive) {
    return {
      background: block.activeGradient,
      boxShadow: block.activeShadow,
    };
  }

  if (hovered[idx]) {
    return {
      background: block.hoverGradient,
      boxShadow: block.hoverShadow,
    };
  }

  return {
    background: defaultBackground,
    boxShadow: defaultShadow,
  };
}

function getNumberStyle(idx) {
  return {
    color: blocks[idx].numberColor,
  };
}

function getPanelStyle(idx) {
  return {
    color: blocks[idx].panelTextColor,
  };
}
</script>

<style scoped>
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 1040px;
  min-height: 100vh;
  padding-block: clamp(48px, 12vh, 96px);
  padding-inline: clamp(32px, 12vw, 120px) clamp(24px, 6vw, 96px);
  box-sizing: border-box;
  gap: clamp(48px, 12vh, 80px);
}

.hero__text {
  display: grid;
  gap: 24px;
  max-width: 720px;
}

.motion-list {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: clamp(16px, 3vw, 32px);
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  list-style: none;
  min-height: 360px;
}

.motion-square {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: transparent;
  list-style: none;
  cursor: pointer;
  box-sizing: border-box;
  overflow: visible;
}

.motion-square[data-state="true"],
.motion-square:hover {
  z-index: 4;
}

.motion-square__background {
  position: absolute;
  inset: 0;
  border-radius: 36px;
  pointer-events: none;
  will-change: transform, background, box-shadow;
}

.motion-circle {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 30%, #3b3b3b 0%, #2a2a2a 65%, #222222 100%);
  box-shadow: inset 0 6px 12px rgba(0, 0, 0, 0.55),
    0 12px 24px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.04);
  z-index: 3;
}

.motion-number {
  position: relative;
  z-index: 3;
  font-weight: 700;
  font-size: 58px;
  line-height: 1;
  letter-spacing: -0.02em;
  text-shadow: 0 18px 36px rgba(0, 0, 0, 0.35);
}

.motion-panel {
  position: relative;
  z-index: 3;
  display: grid;
  gap: 14px;
  width: 70%;
  max-width: 240px;
  text-align: left;
  margin: 0;
}

.motion-panel__index {
  font-size: 16px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  font-weight: 600;
}

.motion-panel__title {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.15;
  margin: 0;
}

.motion-panel__lead,
.motion-panel__details {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: inherit;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media (max-width: 900px) {
  .hero {
    padding-inline: clamp(24px, 8vw, 72px);
    gap: 56px;
  }

  .motion-list {
    justify-content: center;
  }

  .motion-panel {
    max-width: 220px;
  }
}

@media (max-width: 600px) {
  .hero {
    min-height: auto;
    gap: 48px;
  }

  .motion-list {
    min-height: 260px;
    gap: 20px;
  }

  .motion-panel {
    width: 80%;
    max-width: 200px;
  }
}
</style>
