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
        <!-- Вращаем ТОЛЬКО SVG -->
        <motion.svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          :variants="svgVariants"
          :animate="
            block.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'
          "
          :transition="spring"
          style="transform-origin: 50% 50%; display: block"
        >
          <!-- rect вместо polygon; скругления пропорциональны (во viewBox ед.) -->
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            :rx="cornerRadius"
            :ry="cornerRadius"
            fill="var(--color-square-fill)"
          />
        </motion.svg>

        <!-- Контент поверх, НЕ вращается -->
        <div class="motion-content">{{ idx + 1 }}</div>
      </motion.li>
    </ul>
  </section>
</template>

<script setup>
import { motion } from "motion-v";
import { reactive, ref } from "vue";

/** Несколько активных можно одновременно */
const blocks = reactive(Array.from({ length: 4 }, () => ({ isActive: false })));
const hovered = reactive(Array.from({ length: 4 }, () => false));
const lastToggledIdx = ref(-1);

/** Пружина (как было) */
const spring = { type: "spring", stiffness: 20, damping: 4, mass: 0.1 };

/** ТВОИ ЖЕ boxVariants — без изменений */
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
    width: 150,
    height: 150,
    marginLeft: 10, // фиксированный отступ
    marginRight: 10, // фиксированный отступ
    transition: spring,
  },
  active: (i) => ({
    width: 600,
    height: 600,
    marginLeft: 10, // ещё больше отступ
    marginRight: 10, // ещё больше отступ
    y: i % 2 === 0 ? "33%" : "-33%",
    transition: spring,
  }),
};

/** Поворот ромбом */
const svgVariants = {
  default: { rotate: 0 },
  hover: { rotate: 45 },
  active: { rotate: 45 },
};

const cornerRadius = 10; // во viewBox-единицах (масштабируется пропорционально)

function toggleState(idx) {
  blocks[idx].isActive = !blocks[idx].isActive; // НЕ закрываем другие
  lastToggledIdx.value = idx;
}

function getLayoutSpring(idx) {
  const d =
    lastToggledIdx.value === -1 ? 0 : Math.abs(idx - lastToggledIdx.value);
  return { ...spring, delay: d * 0.5 };
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
  gap: clamp(12px, 2vw, 20px);
  align-items: center;
  margin: 8px 0 0 0;
  justify-content: center;
  padding: 0;
  list-style: none;
  pointer-events: auto;
  height: 600px; /* максимальная высота квадрата */
}

.motion-square {
  position: relative;
  flex-shrink: 0;
  width: 120px;
  height: 120px;
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

.motion-content {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--color-square-content);
  font-weight: 800;
  font-size: 18px;
  line-height: 1;
  user-select: none;
  pointer-events: none; /* клики идут в li */
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
}
</style>
