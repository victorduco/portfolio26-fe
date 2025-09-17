<template>
  <section class="hero">
    <div class="hero__container">
      <header class="hero__copy">
        <p class="hero__eyebrow">intro</p>
        <h1 class="hero__title">Rectangles That Rules Numbers</h1>
        <p class="hero__lead">
          This is story of me and how UX can change things around us. Something
          else to write here.
        </p>
      </header>

      <div class="hero__grid">
        <ul class="square-list" role="list">
          <li
            v-for="(block, idx) in blocks"
            :key="block.id"
            class="square"
            :class="{ 'is-active': activeIndex === idx }"
            :style="{
              '--hover-gradient': block.hoverGradient,
              '--hover-glow': block.hoverGlow,
              '--active-background': block.activeBackground,
              '--active-glow': block.activeGlow,
              '--detail-background': block.detailBackground,
              '--detail-color': block.detailText,
              '--detail-accent': block.detailAccent,
            }"
            role="button"
            tabindex="0"
            @click="toggleBlock(idx)"
            @keyup.enter.prevent="toggleBlock(idx)"
            @keyup.space.prevent="toggleBlock(idx)"
          >
            <div class="square__surface">
              <span class="square__glow" aria-hidden="true"></span>
              <span class="square__circle" aria-hidden="true"></span>
              <span class="square__number">{{ block.id }}</span>
            </div>
            <span class="sr-only">Open fact {{ block.id }}</span>
          </li>
        </ul>

        <transition name="details">
          <article
            v-if="activeBlock"
            class="details"
            :style="{
              '--card-background': activeBlock.detailBackground,
              '--card-text': activeBlock.detailText,
              '--card-accent': activeBlock.detailAccent,
            }"
          >
            <div class="details__badge">{{ activeBlock.id }}</div>
            <h2 class="details__title">{{ activeBlock.title }}</h2>
            <p class="details__subtitle">{{ activeBlock.subtitle }}</p>
            <p v-for="(paragraph, index) in activeBlock.body" :key="index">
              {{ paragraph }}
            </p>
          </article>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const blocks = [
  {
    id: 1,
    title: "Four Facts about Victor",
    subtitle: "Gute Websites sehen nicht nur gut aus – sie fühlen sich auch gut an.",
    body: [
      "Meine Lieblingsprojekte beginnen immer mit Empathie. Ich lerne das Publikum kennen und entwickle daraus Interfaces, die emotional ansprechen und gleichzeitig funktionieren.",
      "Mikrointeraktionen wie diese Formen sorgen für eine spielerische Note und geben Nutzerinnen dennoch Orientierung.",
    ],
    hoverGradient: "linear-gradient(135deg, #1d4ed8 0%, #60a5fa 100%)",
    hoverGlow: "rgba(96, 165, 250, 0.6)",
    activeBackground: "linear-gradient(135deg, #172554 0%, #1d4ed8 65%, #60a5fa 100%)",
    activeGlow: "rgba(59, 130, 246, 0.75)",
    detailBackground: "linear-gradient(135deg, rgba(29, 78, 216, 0.18), rgba(37, 99, 235, 0.08))",
    detailText: "#f5f9ff",
    detailAccent: "rgba(96, 165, 250, 0.45)",
  },
  {
    id: 2,
    title: "Four Facts about Victor",
    subtitle: "Gute Websites sehen nicht nur gut aus – sie fühlen sich auch gut an.",
    body: [
      "Design bedeutet Verantwortung. Jede Entscheidung beeinflusst, wie verständlich und inklusiv ein Produkt wird.",
      "Farben, Typografie und Animationen sind für mich Mittel, um Vertrauen zu schaffen und Geschichten zu erzählen.",
    ],
    hoverGradient: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
    hoverGlow: "rgba(244, 114, 182, 0.6)",
    activeBackground: "linear-gradient(135deg, #831843 0%, #be185d 65%, #f472b6 100%)",
    activeGlow: "rgba(236, 72, 153, 0.75)",
    detailBackground: "linear-gradient(135deg, rgba(236, 72, 153, 0.18), rgba(244, 114, 182, 0.08))",
    detailText: "#fff5f9",
    detailAccent: "rgba(244, 114, 182, 0.45)",
  },
  {
    id: 3,
    title: "Four Facts about Victor",
    subtitle: "Gute Websites sehen nicht nur gut aus – sie fühlen sich auch gut an.",
    body: [
      "Ich liebe es, komplizierte Abläufe in leicht verständliche Schritte zu zerlegen.",
      "Teamarbeit ist für mich zentral: gute Produkte entstehen, wenn Design, Produkt und Entwicklung Hand in Hand arbeiten.",
    ],
    hoverGradient: "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)",
    hoverGlow: "rgba(34, 197, 94, 0.6)",
    activeBackground: "linear-gradient(135deg, #064e3b 0%, #0f9f6e 65%, #4ade80 100%)",
    activeGlow: "rgba(34, 197, 94, 0.75)",
    detailBackground: "linear-gradient(135deg, rgba(34, 197, 94, 0.18), rgba(74, 222, 128, 0.08))",
    detailText: "#f4fff7",
    detailAccent: "rgba(74, 222, 128, 0.45)",
  },
  {
    id: 4,
    title: "Four Facts about Victor",
    subtitle: "Gute Websites sehen nicht nur gut aus – sie fühlen sich auch gut an.",
    body: [
      "Ich setze auf klare Informationsarchitektur, damit Menschen schnell finden, was sie suchen.",
      "Iteratives Arbeiten hilft mir, Hypothesen zu testen und Ideen kontinuierlich zu verbessern.",
    ],
    hoverGradient: "linear-gradient(135deg, #facc15 0%, #fbbf24 100%)",
    hoverGlow: "rgba(250, 204, 21, 0.6)",
    activeBackground: "linear-gradient(135deg, #713f12 0%, #b45309 65%, #facc15 100%)",
    activeGlow: "rgba(251, 191, 36, 0.75)",
    detailBackground: "linear-gradient(135deg, rgba(250, 204, 21, 0.18), rgba(251, 191, 36, 0.08))",
    detailText: "#fffdf5",
    detailAccent: "rgba(251, 191, 36, 0.42)",
  },
];

const activeIndex = ref(null);
const activeBlock = computed(() =>
  activeIndex.value === null ? null : blocks[activeIndex.value]
);

function toggleBlock(idx) {
  activeIndex.value = activeIndex.value === idx ? null : idx;
}
</script>

<style scoped>
.hero {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #171717;
  color: #f3f4f6;
  padding: clamp(48px, 10vh, 96px) clamp(24px, 12vw, 96px);
  box-sizing: border-box;
}

.hero__container {
  width: min(1080px, 100%);
  display: grid;
  gap: clamp(40px, 6vh, 64px);
}

.hero__copy {
  display: grid;
  gap: 16px;
  max-width: 640px;
}

.hero__eyebrow {
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.24em;
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
}

.hero__title {
  font-size: clamp(36px, 5vw, 56px);
  line-height: 1.08;
  margin: 0;
  color: #f9fafb;
}

.hero__lead {
  font-size: clamp(16px, 2.2vw, 20px);
  line-height: 1.6;
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
}

.hero__grid {
  display: grid;
  gap: clamp(32px, 6vh, 48px);
}

.square-list {
  list-style: none;
  display: flex;
  gap: clamp(16px, 4vw, 32px);
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
}

.square {
  width: clamp(92px, 12vw, 124px);
  aspect-ratio: 1 / 1;
  position: relative;
  display: grid;
  place-items: center;
  cursor: pointer;
  isolation: isolate;
}

.square:focus-visible .square__surface {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.35),
    inset 0 0 0 1px rgba(15, 15, 15, 0.6);
}

.square__surface {
  width: 100%;
  height: 100%;
  border-radius: clamp(22px, 4vw, 32px);
  background: #2a2a2a;
  position: relative;
  display: grid;
  place-items: center;
  transition: transform 0.6s cubic-bezier(0.21, 1, 0.33, 1),
    background 0.45s ease, box-shadow 0.6s cubic-bezier(0.21, 1, 0.33, 1);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05),
    0 20px 40px rgba(0, 0, 0, 0.4);
}

.square__glow {
  position: absolute;
  inset: 10%;
  border-radius: inherit;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.22),
    transparent 65%
  );
  opacity: 0;
  transition: opacity 0.45s ease;
  filter: blur(0.5px);
}

.square__circle {
  width: 34%;
  aspect-ratio: 1 / 1;
  border-radius: 999px;
  background: radial-gradient(circle, #3b3b3b 0%, #1f1f1f 68%);
  transition: transform 0.45s ease, opacity 0.45s ease;
}

.square__number {
  font-weight: 700;
  font-size: clamp(24px, 3vw, 36px);
  line-height: 1;
  color: rgba(255, 255, 255, 0.92);
  position: absolute;
  transform: translateY(12px);
  opacity: 0;
  transition: transform 0.45s ease, opacity 0.45s ease;
  text-shadow: 0 18px 30px rgba(0, 0, 0, 0.6);
}

.square:hover .square__surface,
.square.is-active .square__surface {
  transform: rotate(45deg) scale(1.12);
  background: var(--hover-gradient);
  box-shadow: inset 0 0 42px var(--hover-glow),
    0 32px 60px rgba(0, 0, 0, 0.55);
}

.square:hover .square__glow,
.square.is-active .square__glow {
  opacity: 1;
}

.square:hover .square__circle,
.square.is-active .square__circle {
  transform: scale(0.45);
  opacity: 0;
}

.square:hover .square__number,
.square.is-active .square__number {
  transform: translateY(0);
  opacity: 1;
}

.square.is-active .square__surface {
  background: var(--active-background);
  box-shadow: inset 0 0 54px var(--active-glow),
    0 40px 72px rgba(0, 0, 0, 0.6);
}

.details-enter-active,
.details-leave-active {
  transition: opacity 0.4s ease, transform 0.45s ease;
}

.details-enter-from,
.details-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.details {
  background: var(--card-background);
  color: var(--card-text);
  border-radius: clamp(20px, 4vw, 28px);
  padding: clamp(24px, 4vw, 36px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05),
    0 32px 60px rgba(0, 0, 0, 0.45);
  display: grid;
  gap: clamp(12px, 2vw, 16px);
  max-width: min(640px, 100%);
}

.details__badge {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--card-accent);
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 18px;
  color: var(--card-text);
}

.details__title {
  margin: 0;
  font-size: clamp(24px, 4vw, 32px);
  line-height: 1.2;
}

.details__subtitle {
  margin: 0;
  font-size: clamp(15px, 2.2vw, 18px);
  line-height: 1.6;
  color: rgba(243, 244, 246, 0.78);
}

.details p {
  margin: 0;
  font-size: clamp(15px, 2vw, 18px);
  line-height: 1.7;
  color: var(--card-text);
  opacity: 0.92;
}

@media (max-width: 768px) {
  .hero {
    padding-inline: clamp(20px, 8vw, 32px);
    padding-block: clamp(40px, 12vh, 80px);
  }

  .hero__container {
    gap: clamp(32px, 8vh, 48px);
  }

  .square-list {
    justify-content: center;
  }

  .details {
    justify-self: center;
  }
}

@media (max-width: 520px) {
  .square-list {
    gap: 20px;
    justify-content: center;
  }

  .square {
    width: clamp(88px, 26vw, 112px);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
