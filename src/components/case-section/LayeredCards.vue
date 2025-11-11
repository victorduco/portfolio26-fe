<template>
  <div class="layered-cards-wrapper">
    <h3 v-if="label" class="cards-label">{{ label }}</h3>
    <div class="layered-cards" ref="containerRef">
      <div class="cards-container" :style="{ backgroundColor: backgroundColor }">
        <!-- Left card -->
        <div
          class="card card-left"
          ref="cardLeftRef"
          :style="{ zIndex: 3 }"
        >
          <img
            :src="imageLeft"
            :alt="altLeft || 'Left card'"
            loading="lazy"
          />
        </div>

        <!-- Center card (main) -->
        <div
          class="card card-center"
          ref="cardCenterRef"
          :style="{ zIndex: 1 }"
        >
          <img
            :src="imageCenter"
            :alt="altCenter || 'Center card'"
            loading="lazy"
          />
        </div>

        <!-- Right card -->
        <div
          class="card card-right"
          ref="cardRightRef"
          :style="{ zIndex: 2 }"
        >
          <img
            :src="imageRight"
            :alt="altRight || 'Right card'"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const props = defineProps({
  imageLeft: {
    type: String,
    required: true,
  },
  imageCenter: {
    type: String,
    required: true,
  },
  imageRight: {
    type: String,
    required: true,
  },
  altLeft: {
    type: String,
    default: '',
  },
  altCenter: {
    type: String,
    default: '',
  },
  altRight: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  backgroundColor: {
    type: String,
    default: 'transparent',
  },
  // Скорости параллакса для каждой карточки
  speedLeft: {
    type: Number,
    default: 1.5,
  },
  speedCenter: {
    type: Number,
    default: 1.0,
  },
  speedRight: {
    type: Number,
    default: 1.8,
  },
});

const containerRef = ref(null);
const cardLeftRef = ref(null);
const cardCenterRef = ref(null);
const cardRightRef = ref(null);

onMounted(() => {
  if (!containerRef.value) return;

  // Parallax effect for each card
  const cards = [
    { ref: cardLeftRef.value, speed: props.speedLeft },
    { ref: cardCenterRef.value, speed: props.speedCenter },
    { ref: cardRightRef.value, speed: props.speedRight },
  ];

  cards.forEach(({ ref, speed }) => {
    if (ref) {
      gsap.fromTo(
        ref,
        { y: -50 * speed },
        {
          y: 50 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
            markers: false,
          },
        }
      );
    }
  });
});
</script>

<style scoped>
.layered-cards-wrapper {
  width: 100vw;
  position: relative;
  left: 50%;
  margin-left: -50vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 48px;
  margin-bottom: 0;
}

.cards-label {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto -8px;
  padding: 0 16px;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  line-height: 1.2;
  color: inherit;
  opacity: 0.5;
}

.layered-cards {
  width: 100%;
  height: 100vh;
  padding: 16px;
  box-sizing: border-box;
}

.cards-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card {
  position: absolute;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  will-change: transform;
  width: 40vw;
  aspect-ratio: 2 / 1.1;
}

.card:hover {
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.2),
    0 12px 30px rgba(0, 0, 0, 0.15);
}

.card img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

/* Card 1 - top left */
.card-left {
  left: calc(50% - 45vw);
  top: calc(50% - 35vh);
  transform: translateZ(0);
}

/* Card 2 - middle right */
.card-center {
  left: calc(50% + 5vw);
  top: calc(50% - 25vh);
  transform: translateZ(0);
}

/* Card 3 - bottom center-left */
.card-right {
  left: calc(50% - 25vw);
  top: calc(50% - 10vh);
  transform: translateZ(0);
}

/* Responsive */
@media (max-width: 768px) {
  .card {
    width: 60vw;
  }

  .card-left {
    left: calc(50% - 50vw);
    top: calc(50% - 40vh);
  }

  .card-center {
    left: calc(50% - 5vw);
    top: calc(50% - 27vh);
  }

  .card-right {
    left: calc(50% - 30vw);
    top: calc(50% - 12vh);
  }
}

@media (max-width: 480px) {
  .card {
    width: 70vw;
  }

  .card-left {
    left: calc(50% - 55vw);
    top: calc(50% - 43vh);
  }

  .card-center {
    left: calc(50% - 10vw);
    top: calc(50% - 29vh);
  }

  .card-right {
    left: calc(50% - 35vw);
    top: calc(50% - 13vh);
  }
}
</style>
