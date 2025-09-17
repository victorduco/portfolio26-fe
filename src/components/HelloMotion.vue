<template>
  <section class="hero">
    <div class="hero__text">
      <h1 class="h1">Rectangles That Rules Numbers</h1>
      <p class="body1">
        This is story of me and how UX can change things around us. Something else
        to write here.
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
        :animate="block.isActive ? 'active' : hovered[idx] ? 'hover' : 'default'"
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
            fill="#111"
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
  max-width: 960px;
  margin: 0 auto;
  padding: 96px 64px;
  display: flex;
  flex-direction: column;
  gap: 56px;
}

.hero__text {
  max-width: 720px;
  display: grid;
  gap: 24px;
}

.motion-list {
  display: flex;
  gap: 20px;
  align-items: center;
  margin: 0;
  padding: 16px;
  border: #111 1px solid;
  list-style: none;
}

.motion-square {
  position: relative; /* для контента поверх */
  width: 120px; /* фолбэк до инициализации Motion */
  height: 120px;
  background: transparent;
  list-style: none;
  box-sizing: border-box;
  cursor: pointer;
}

.motion-content {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 800;
  font-size: 18px;
  line-height: 1;
  user-select: none;
  pointer-events: none; /* клики идут в li */
}
</style>
