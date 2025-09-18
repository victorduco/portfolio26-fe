<script setup>
import LiquidGlassCard from "./LiquidGlassCard.vue"

const cards = [
  {
    id: "standard",
    title: "Standard displacement",
    mode: "standard",
    copy:
      "This version uses the baked displacement map from the demos folder for a classic liquid glass feel.",
  },
  {
    id: "polar",
    title: "Polar swirl",
    mode: "polar",
    copy:
      "A polar coordinate map stretches light in circular patterns to create a lens-like look around the card.",
  },
  {
    id: "shader",
    title: "Shader generated",
    mode: "shader",
    copy:
      "The displacement texture is generated on the fly with a small fragment shader so the pill adapts to its size.",
  },
]
</script>

<template>
  <main class="glass-demo">
    <div class="glass-demo__halo" aria-hidden="true"></div>
    <div class="glass-demo__halo glass-demo__halo--right" aria-hidden="true"></div>

    <section class="glass-demo__content">
      <header class="glass-demo__header">
        <p class="glass-demo__eyebrow">Liquid glass playground</p>
        <h1 class="glass-demo__title">Three takes on the same background filter</h1>
        <p class="glass-demo__subtitle">
          Move the cursor across each card to see how the SVG displacement filter warps the gradient backdrop.
          All three use the utilities that live in the <code>demos</code> directory, just wired up for Vue.
        </p>
      </header>

      <div class="glass-demo__grid">
        <LiquidGlassCard
          v-for="card in cards"
          :key="card.id"
          class="glass-demo__card"
          :mode="card.mode"
          :overLight="card.id === 'shader'"
          :displacement-scale="card.id === 'polar' ? 80 : 60"
          :aberration-intensity="card.id === 'polar' ? 3 : 2"
        >
          <strong class="glass-demo__card-title">{{ card.title }}</strong>
          <span class="glass-demo__card-copy">{{ card.copy }}</span>
        </LiquidGlassCard>
      </div>
    </section>
  </main>
</template>

<style scoped>
.glass-demo {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: radial-gradient(circle at top, rgba(28, 28, 53, 0.45), transparent 60%),
    radial-gradient(circle at bottom, rgba(18, 45, 67, 0.65), rgba(5, 7, 16, 1) 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
}

.glass-demo__halo {
  position: absolute;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(84, 146, 255, 0.4), rgba(84, 146, 255, 0));
  filter: blur(32px);
  top: 10%;
  left: -120px;
  opacity: 0.7;
  transform: rotate(-12deg);
}

.glass-demo__halo--right {
  left: auto;
  right: -140px;
  top: auto;
  bottom: 8%;
  background: radial-gradient(circle, rgba(255, 97, 186, 0.45), rgba(255, 97, 186, 0));
  transform: rotate(18deg);
}

.glass-demo__content {
  position: relative;
  z-index: 1;
  max-width: 960px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.glass-demo__header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #f7fbff;
}

.glass-demo__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.7;
}

.glass-demo__title {
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.05;
  font-weight: 700;
  max-width: 14ch;
}

.glass-demo__subtitle {
  max-width: 60ch;
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.82;
}

.glass-demo__grid {
  display: grid;
  gap: 28px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  justify-items: center;
}

.glass-demo__card {
  width: min(100%, 320px);
}

.glass-demo__card-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.glass-demo__card-copy {
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.9;
}

@media (max-width: 600px) {
  .glass-demo {
    padding: 48px 16px;
  }

  .glass-demo__grid {
    gap: 20px;
  }

  .glass-demo__card {
    width: 100%;
  }
}
</style>
