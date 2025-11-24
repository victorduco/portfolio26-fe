<template>
  <motion.div
    class="intro-active-diamond"
    :class="{ 'intro-active-diamond--mobile': isMobile, 'intro-active-diamond--active': isMobile && isActive, 'intro-active-diamond--smallest': isSmallestBreakpoints }"
    :variants="activeDiamondVariants"
    :animate="isActive ? 'active' : 'hidden'"
    :transition="spring"
    :custom="index"
    @click.self="isMobile && emit('close')"
  >
    <motion.div
      class="intro-active-content"
      :class="{ 'intro-active-content--mobile': isMobile, 'intro-active-content--smallest': isSmallestBreakpoints }"
      :variants="activeContentVariants"
      initial="hidden"
      :animate="isActive ? 'active' : 'hidden'"
      :transition="spring"
      :custom="{ isMobileLayout: isMobile }"
    >
      <i class="intro-active-number" :class="['icon-d', 'icon-a', 'icon-c', 'icon-b'][index]"></i>
      <h3 class="intro-active-title">{{ introContent[index]?.title }}</h3>
      <p class="intro-active-description">{{ introContent[index]?.description }}</p>
    </motion.div>
    <button v-if="isMobile" class="intro-active-close" type="button" aria-label="Close" @click.stop="emit('close')">
      <span class="intro-active-close-icon" aria-hidden="true"></span>
    </button>
  </motion.div>
</template>

<script setup>
import { computed } from "vue";
import { motion } from "motion-v";
import { spring, activeDiamondVariants, activeContentVariants } from "./variants.js";
import { introContent } from "@/content/storyConfigs.js";

const props = defineProps({
  index: { type: Number, required: true },
  isActive: { type: Boolean, default: false },
  isMobileLayout: { type: Boolean, default: false },
  isSmallestBreakpoints: { type: Boolean, default: false },
});

const emit = defineEmits(["close"]);
const isMobile = computed(() => props.isMobileLayout || props.isSmallestBreakpoints);
</script>

<style scoped>
.intro-active-diamond {
  --radius: 26px;
  position: absolute;
  inset: 0;
  margin: auto;
  width: 97%;
  height: 97%;
  border-radius: var(--radius);
  display: grid;
  place-items: center;
  z-index: 10;
  pointer-events: none;
  user-select: none;
}

.intro-active-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(12px, 2vh, 20px);
  text-align: center;
  padding: 32px;
  max-width: 480px;
  user-select: none;
}

.intro-active-number {
  font-size: clamp(48px, 3vw, 64px);
  font-weight: 800;
  line-height: 1;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-active-title {
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  color: #000;
}

.intro-active-description {
  font-size: clamp(14px, 1.5vw, 18px);
  line-height: 1.4;
  margin: 0;
  color: #000;
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
    z-index: 10010;
  }
  .intro-active-diamond--active { pointer-events: auto; }
  .intro-active-content--mobile {
    max-width: min(520px, 100%);
    width: 100%;
    background: rgba(255, 255, 255, 0.85);
    border-radius: var(--radius);
    padding: 40px 24px calc(72px + 100px);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
  }
  .intro-active-number { font-size: clamp(48px, 20vw, 72px); }
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
  .intro-active-close:focus-visible { outline: 2px solid rgba(255, 255, 255, 0.8); outline-offset: 2px; }
  .intro-active-close:hover { background: rgba(0, 0, 0, 0.7); }
  .intro-active-close-icon { position: relative; width: 18px; height: 18px; }
  .intro-active-close-icon::before,
  .intro-active-close-icon::after {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
    background: #fff;
    transform: translateX(-50%) rotate(45deg);
  }
  .intro-active-close-icon::after { transform: translateX(-50%) rotate(-45deg); }
}

@media (max-width: 600px) {
  .intro-active-diamond--smallest {
    position: fixed;
    inset: 0;
    margin: auto;
    width: min(90vw, 90vh);
    height: min(90vw, 90vh);
    border-radius: var(--radius);
    z-index: 10010;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .intro-active-content--smallest { padding: 40px 20px calc(80px + 100px); max-width: 100%; width: 100%; }
  .intro-active-close { position: fixed; width: 56px; height: 56px; bottom: max(32px, env(safe-area-inset-bottom)); }
}
</style>
