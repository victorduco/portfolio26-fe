<template>
  <div ref="triggerRef" class="next-project-trigger">
    <section
      ref="sectionRef"
      class="case-next-project"
    >
      <div class="next-project-wrapper">
        <component :is="contentComponent" />
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
  contentComponent: {
    type: Object,
    required: true,
  },
});

const triggerRef = ref(null);
const sectionRef = ref(null);
let scrollTriggerInstance = null;

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
</style>
