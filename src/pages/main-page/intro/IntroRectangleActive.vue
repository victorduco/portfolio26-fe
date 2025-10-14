<template>
  <motion.div
    class="intro-active-diamond"
    :class="{
      'intro-active-diamond--mobile': isMobileLayout || isSmallestBreakpoints,
      'intro-active-diamond--mobile-active':
        (isMobileLayout || isSmallestBreakpoints) && isActive,
      'intro-active-diamond--smallest': isSmallestBreakpoints,
    }"
    :variants="activeDiamondVariants"
    :animate="isActive ? 'active' : 'hidden'"
    :transition="spring"
    :custom="index"
    @click.self="handleBackdropClick"
  >
    <motion.div
      class="intro-active-content"
      :class="{
        'intro-active-content--mobile': isMobileLayout || isSmallestBreakpoints,
        'intro-active-content--smallest': isSmallestBreakpoints,
      }"
      :variants="activeContentVariants"
      :animate="isActive ? 'active' : 'hidden'"
      :transition="spring"
      :custom="{ isMobileLayout: isMobileLayout || isSmallestBreakpoints }"
    >
      <i class="intro-active-number" :class="getIconClass(index)"></i>
      <h3 class="intro-active-title">{{ contentData[index]?.title }}</h3>
      <p class="intro-active-description">
        {{ contentData[index]?.description }}
      </p>
    </motion.div>
    <button
      v-if="isMobileLayout || isSmallestBreakpoints"
      class="intro-active-close"
      type="button"
      aria-label="Close"
      @click.stop="emitClose"
    >
      <span class="intro-active-close-icon" aria-hidden="true"></span>
    </button>
  </motion.div>
</template>

<script setup>
import { motion } from "motion-v";
import {
  spring,
  activeDiamondVariants,
  activeContentVariants,
} from "./variants.js";

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isMobileLayout: {
    type: Boolean,
    default: false,
  },
  isSmallestBreakpoints: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

// Уникальный контент для каждого блока
const contentData = [
  {
    title: "Vision",
    description:
      "Building consistent and scalable UI components that work seamlessly across all platforms and devices",
  },
  {
    title: "Connection",
    description:
      "Making digital content available and usable for everyone regardless of their abilities or disabilities",
  },
  {
    title: "Technology",
    description:
      "Creating intuitive and delightful interactions that help users achieve their goals with minimal friction",
  },
  {
    title: "Scale",
    description:
      "Maximizing speed and efficiency through careful code analysis and modern best practices for web",
  },
];

// Получаем класс иконки в зависимости от индекса
// Маппинг: Vision→icon-d, Connection→icon-a, Technology→icon-c, Scale→icon-b
function getIconClass(index) {
  const iconNames = ["icon-d", "icon-a", "icon-c", "icon-b"];
  return iconNames[index] || "icon-a";
}

function emitClose() {
  emit("close");
}

function handleBackdropClick() {
  // На маленьких брейкпоинтах и мобильных - закрываем при клике на backdrop
  if (!props.isMobileLayout && !props.isSmallestBreakpoints) return;
  emitClose();
}
</script>

<style scoped>
.intro-active-diamond {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 97%;
  height: 97%;
  border-radius: 26px;
  display: grid;
  place-items: center;
  z-index: 10;
  pointer-events: none;
}

.intro-active-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  padding: 32px;
  max-width: 400px;
}

.intro-active-number {
  font-size: clamp(48px, 3vw, 64px);
  font-weight: 800;
  line-height: 1;
  color: #000000;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-active-number::before {
  margin: 0;
  width: auto;
  display: block;
}

.intro-active-title {
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  color: #000000;
}

.intro-active-description {
  font-size: clamp(14px, 1.5vw, 18px);
  font-weight: 400;
  line-height: 1.4;
  margin: 0;
  color: #000000;
  opacity: 0.9;
}

@media (max-width: 899px) {
  .intro-active-diamond--mobile {
    position: fixed;
    inset: 0;
    margin: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
    pointer-events: none;
    z-index: 10010;
    overflow: hidden;
  }

  .intro-active-diamond--mobile.intro-active-diamond--mobile-active {
    pointer-events: auto;
  }

  .intro-active-content--mobile {
    max-width: min(520px, 100%);
    width: 100%;
    background: rgba(255, 255, 255, 0.85);
    border-radius: 26px;
    padding: 32px 24px 56px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
    color: #000000;
  }

  .intro-active-number {
    font-size: clamp(48px, 20vw, 72px);
  }

  .intro-active-number,
  .intro-active-title,
  .intro-active-description {
    color: #000000;
  }

  .intro-active-close {
    position: absolute;
    bottom: max(24px, env(safe-area-inset-bottom));
    left: 50%;
    transform: translateX(-50%);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .intro-active-close:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.8);
    outline-offset: 2px;
  }

  .intro-active-close:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  .intro-active-close-icon {
    position: relative;
    width: 18px;
    height: 18px;
  }

  .intro-active-close-icon::before,
  .intro-active-close-icon::after {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
    background: #ffffff;
    transform: translateX(-50%) rotate(45deg);
  }

  .intro-active-close-icon::after {
    transform: translateX(-50%) rotate(-45deg);
  }
}

/* Дополнительные стили для двух наименьших брейкпоинтов (xs + sm: 360-600px) */
@media (max-width: 600px) {
  .intro-active-diamond--smallest {
    /* Fullscreen поведение - ромб по центру экрана */
    position: fixed;
    inset: 0;
    margin: auto;
    width: min(90vw, 90vh);
    height: min(90vw, 90vh);
    border-radius: 26px;
    z-index: 10010;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .intro-active-content--smallest {
    /* Контент внутри ромба */
    padding: 32px 20px 64px;
    max-width: 100%;
    width: 100%;
  }

  .intro-active-close {
    /* Кнопка закрытия внизу экрана */
    position: fixed;
    width: 56px;
    height: 56px;
    bottom: max(32px, env(safe-area-inset-bottom));
  }
}
</style>
