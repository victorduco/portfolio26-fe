<template>
  <section
    ref="sectionRef"
    class="case-next-project"
    :style="{ backgroundColor: backgroundColor }"
  >
    <div class="next-project-wrapper">
      <div ref="contentRef" class="next-project-content">
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

const sectionRef = ref(null);
const contentRef = ref(null);
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
  if (!sectionRef.value || !contentRef.value) return;

  // Get the full height of the content
  const fullHeight = sectionRef.value.scrollHeight;

  // Set initial state - height 0 with overflow hidden
  gsap.set(sectionRef.value, {
    height: 0,
    overflow: 'hidden',
  });

  // Create animation - expand height from 0 to full
  scrollTriggerInstance = gsap.to(sectionRef.value, {
    height: fullHeight,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top bottom',
      end: 'top center',
      scrub: 0.5,
      markers: false,
      invalidateOnRefresh: true,
      onRefresh: (self) => {
        // Update height on refresh (e.g., window resize)
        self.vars.height = sectionRef.value.scrollHeight;
      },
    },
  });
});

onUnmounted(() => {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.scrollTrigger?.kill();
    scrollTriggerInstance.kill();
    scrollTriggerInstance = null;
  }
});
</script>

<style scoped>
.case-next-project {
  width: 100%;
  padding: 75px 0;
  box-sizing: border-box;
  color: #ffffff;
}

.next-project-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  .case-next-project {
    padding: 40px 24px;
  }

  .next-project-content {
    flex-direction: column;
    gap: 24px;
  }

  .next-project-button {
    align-self: stretch;
    justify-content: center;
  }
}

@media (min-width: 768px) and (max-width: 900px) {
  .case-next-project {
    padding: 50px 24px;
  }
}
</style>
