<template>
  <div ref="triggerRef" class="next-project-trigger">
    <section
      ref="sectionRef"
      class="case-next-project"
      :style="{ backgroundColor: backgroundColor }"
    >
      <div class="next-project-wrapper">
        <div class="next-project-content">
          <div class="next-project-text">
            <p class="next-project-label">Next Project</p>
            <h2 class="next-project-title">{{ title }}</h2>
          </div>
          <router-link :to="getCaseRoute(caseId)" class="next-project-button">
            Open Story
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const props = defineProps({
  caseId: {
    type: String,
    required: true,
    validator: (value) => ["1", "2", "3"].includes(value),
  },
  title: {
    type: String,
    required: true,
  },
  backgroundColor: {
    type: String,
    default: "#171717",
  },
});

const triggerRef = ref(null);
const sectionRef = ref(null);
let scrollTriggerInstance = null;

const getCaseRoute = (caseId) => {
  const routes = {
    "1": "/story/one",
    "2": "/story/two",
    "3": "/story/three",
  };
  return routes[caseId] || "/";
};

onMounted(() => {
  if (!triggerRef.value || !sectionRef.value) return;

  requestAnimationFrame(() => {
    const fullHeight = sectionRef.value.offsetHeight;
    const initialOffset = -fullHeight / 3;

    gsap.set(sectionRef.value, { y: initialOffset });

    scrollTriggerInstance = gsap.fromTo(
      sectionRef.value,
      { y: initialOffset },
      {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.value,
          start: 'top bottom',
          end: 'center center',
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            const newHeight = sectionRef.value.offsetHeight;
            const newInitialOffset = -newHeight / 3;
            self.vars.y = 0;
            gsap.set(sectionRef.value, { y: newInitialOffset });
          },
        },
      }
    );

    ScrollTrigger.refresh();
  });
});

onUnmounted(() => {
  scrollTriggerInstance?.scrollTrigger?.kill();
});
</script>

<style scoped>
.next-project-trigger {
  width: 100%;
  position: relative;
  z-index: 0;
}

.case-next-project {
  width: 100%;
  box-sizing: border-box;
  color: #ffffff;
  position: relative;
  z-index: 0;
}

.next-project-wrapper {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.next-project-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
}

.next-project-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.next-project-label {
  font-family: var(--font-family-base);
  font-size: clamp(12px, 2.4vw, 14px);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
  color: #000000;
  opacity: 0.8;
  text-align: left;
}

.next-project-title {
  font-family: var(--case-title-font, var(--font-family-base));
  font-size: clamp(22px, 2.8vw, 28px);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  color: #000000;
  opacity: 1;
  text-align: left;
}

.next-project-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px;
  font-family: var(--font-family-base);
  font-size: 16px;
  font-weight: var(--font-weight-medium);
  color: #ffffff;
  background-color: #000000;
  border: none;
  border-radius: 24px;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  flex-shrink: 0;
  align-self: flex-start;
}

.next-project-button:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

.next-project-button:active {
  transform: scale(0.98);
}

@media (max-width: 767px) {
  .next-project-content {
    padding: 0 24px;
    flex-direction: column;
    gap: 24px;
  }

  .next-project-button {
    align-self: stretch;
    justify-content: center;
  }
}
</style>
