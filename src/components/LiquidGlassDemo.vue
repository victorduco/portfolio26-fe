<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import LiquidGlass from "./LiquidGlass.vue"

type Mode = "standard" | "polar" | "prominent" | "shader"

const modes: Array<{ label: string; value: Mode; description: string }> = [
  {
    label: "Standard",
    value: "standard",
    description: "Smooth organic refraction with soft chromatic edges.",
  },
  {
    label: "Polar",
    value: "polar",
    description: "Stronger radial distortion for a whirlpool-like shimmer.",
  },
  {
    label: "Prominent",
    value: "prominent",
    description: "High contrast displacement with pronounced highlights.",
  },
  {
    label: "Shader",
    value: "shader",
    description: "Runtime-generated shader map for ultra-fluid warping.",
  },
]

const selectedMode = ref<Mode>("standard")
const displacementScale = ref(70)
const aberrationIntensity = ref(2)
const blurAmount = ref(0.0625)
const saturation = ref(140)
const cornerRadius = ref(999)
const overLight = ref(false)
const clickMessage = ref("")
let resetTimeout: number | undefined

const activeModeDescription = computed(() => modes.find((mode) => mode.value === selectedMode.value)?.description ?? "")

function handleClick() {
  clickMessage.value = "Стекло нажато!"
  if (resetTimeout) {
    clearTimeout(resetTimeout)
  }
  resetTimeout = window.setTimeout(() => {
    clickMessage.value = ""
    resetTimeout = undefined
  }, 2000)
}

onMounted(() => {
  window.addEventListener("keyup", handleKeyNavigation)
})

onBeforeUnmount(() => {
  window.removeEventListener("keyup", handleKeyNavigation)
  if (resetTimeout) {
    clearTimeout(resetTimeout)
  }
})

function handleKeyNavigation(event: KeyboardEvent) {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
    return
  }

  const currentIndex = modes.findIndex((mode) => mode.value === selectedMode.value)
  if (currentIndex === -1) {
    return
  }

  if (event.key === "ArrowRight") {
    selectedMode.value = modes[(currentIndex + 1) % modes.length].value
  } else {
    selectedMode.value = modes[(currentIndex - 1 + modes.length) % modes.length].value
  }
}
</script>

<template>
  <section class="liquid-demo">
    <div class="liquid-demo__background" aria-hidden="true" />

    <div class="liquid-demo__content">
      <header class="liquid-demo__header">
        <h1>Liquid Glass Playground</h1>
        <p>Переключайте режимы фильтра и настраивайте параметры эффекта прямо на лету.</p>
      </header>

      <div class="liquid-demo__controls">
        <div class="liquid-demo__modes" role="tablist" aria-label="Displacement modes">
          <button
            v-for="mode in modes"
            :key="mode.value"
            type="button"
            role="tab"
            :aria-selected="selectedMode === mode.value"
            :class="['liquid-demo__mode', { 'liquid-demo__mode--active': selectedMode === mode.value }]"
            @click="selectedMode = mode.value"
          >
            {{ mode.label }}
          </button>
        </div>

        <p class="liquid-demo__description">
          {{ activeModeDescription }}
        </p>

        <div class="liquid-demo__sliders">
          <label class="liquid-demo__slider">
            <span>Сила искажения: {{ displacementScale }}</span>
            <input v-model.number="displacementScale" type="range" min="20" max="120" step="1" />
          </label>
          <label class="liquid-demo__slider">
            <span>Хроматическая аберрация: {{ aberrationIntensity.toFixed(1) }}</span>
            <input v-model.number="aberrationIntensity" type="range" min="0" max="6" step="0.1" />
          </label>
          <label class="liquid-demo__slider">
            <span>Размытие: {{ blurAmount.toFixed(3) }}</span>
            <input v-model.number="blurAmount" type="range" min="0" max="0.25" step="0.0025" />
          </label>
          <label class="liquid-demo__slider">
            <span>Насыщенность: {{ saturation }}</span>
            <input v-model.number="saturation" type="range" min="80" max="220" step="5" />
          </label>
          <label class="liquid-demo__slider">
            <span>Скругление: {{ cornerRadius }}</span>
            <input v-model.number="cornerRadius" type="range" min="64" max="999" step="5" />
          </label>
          <label class="liquid-demo__toggle">
            <input v-model="overLight" type="checkbox" />
            <span>Переключить режим «Over Light»</span>
          </label>
        </div>
      </div>

      <div class="liquid-demo__stage">
        <LiquidGlass
          class="liquid-demo__glass"
          :mode="selectedMode"
          :displacement-scale="displacementScale"
          :aberration-intensity="aberrationIntensity"
          :blur-amount="blurAmount"
          :saturation="saturation"
          :corner-radius="cornerRadius"
          :over-light="overLight"
          :clickable="true"
          :style="{ position: 'absolute', top: '50%', left: '50%' }"
          @click="handleClick"
        >
          <div class="liquid-demo__cta">
            <span class="liquid-demo__label">Попробовать</span>
            <span class="liquid-demo__arrow" aria-hidden="true">→</span>
          </div>
        </LiquidGlass>
        <transition name="liquid-demo__toast">
          <p v-if="clickMessage" class="liquid-demo__toast">{{ clickMessage }}</p>
        </transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.liquid-demo {
  position: relative;
  min-height: 100vh;
  padding: 64px clamp(24px, 5vw, 72px);
  color: #f3f6ff;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  overflow: hidden;
}

.liquid-demo__background {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 15% 20%, rgba(255, 201, 71, 0.35), transparent 45%),
    radial-gradient(circle at 80% 0%, rgba(86, 182, 255, 0.45), transparent 52%),
    radial-gradient(circle at 50% 70%, rgba(145, 101, 255, 0.4), transparent 60%),
    linear-gradient(135deg, #060922 0%, #10133a 45%, #1d0f3d 100%);
  filter: saturate(120%) contrast(105%);
  z-index: 0;
}

.liquid-demo__content {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 48px;
}

.liquid-demo__header h1 {
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 700;
  margin-bottom: 16px;
}

.liquid-demo__header p {
  max-width: 600px;
  font-size: clamp(18px, 2.4vw, 20px);
  line-height: 1.6;
  color: rgba(226, 236, 255, 0.82);
}

.liquid-demo__controls {
  display: grid;
  gap: 24px;
  background: rgba(9, 13, 38, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 24px clamp(24px, 4vw, 40px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(16px);
}

.liquid-demo__modes {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.liquid-demo__mode {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(12, 18, 54, 0.65);
  color: inherit;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 12px 20px;
  border-radius: 999px;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
}

.liquid-demo__mode:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.35);
}

.liquid-demo__mode--active {
  background: linear-gradient(120deg, rgba(108, 156, 255, 0.85), rgba(196, 129, 255, 0.85));
  border-color: transparent;
  box-shadow: 0 12px 32px rgba(101, 113, 255, 0.35);
}

.liquid-demo__description {
  margin: 0;
  color: rgba(230, 238, 255, 0.8);
  font-size: 16px;
}

.liquid-demo__sliders {
  display: grid;
  gap: 20px;
}

.liquid-demo__slider,
.liquid-demo__toggle {
  display: grid;
  gap: 8px;
  font-size: 15px;
  color: rgba(235, 240, 255, 0.85);
}

.liquid-demo__slider input[type="range"] {
  width: 100%;
  accent-color: #8a9aff;
}

.liquid-demo__toggle {
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 12px;
}

.liquid-demo__stage {
  position: relative;
  min-height: clamp(280px, 50vw, 420px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.liquid-demo__glass {
  user-select: none;
}

.liquid-demo__cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.liquid-demo__label {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.liquid-demo__arrow {
  font-size: 24px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.liquid-demo__toast-enter-active,
.liquid-demo__toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.liquid-demo__toast-enter-from,
.liquid-demo__toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.liquid-demo__toast {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 12px 20px;
  border-radius: 999px;
  background: rgba(13, 18, 48, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 18px 40px rgba(6, 9, 33, 0.65);
  font-size: 15px;
  letter-spacing: 0.03em;
}

@media (max-width: 900px) {
  .liquid-demo {
    padding: 48px 20px;
  }

  .liquid-demo__stage {
    min-height: 360px;
  }
}
</style>
