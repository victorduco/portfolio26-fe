<template>
  <div ref="triggerRef" class="next-story-trigger">
    <section ref="sectionRef" class="story-next-story">
      <div class="next-story-wrapper">
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

defineProps({ contentComponent: { type: Object, required: true } });

const triggerRef = ref(null);
const sectionRef = ref(null);
let scrollTriggerInstance = null;

onMounted(() => {
  if (!triggerRef.value || !sectionRef.value) return;

  const setOffset = () => gsap.set(sectionRef.value, { y: -sectionRef.value.offsetHeight / 3 });
  setOffset();

  scrollTriggerInstance = gsap.to(sectionRef.value, {
    y: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: triggerRef.value,
      start: 'top bottom',
      end: 'center center',
      scrub: true,
      invalidateOnRefresh: true,
      onRefresh: setOffset,
    },
  });
});

onUnmounted(() => scrollTriggerInstance?.scrollTrigger?.kill());
</script>

<style scoped>
.next-story-trigger, .story-next-story { width: 100%; position: relative; z-index: 0; }
.story-next-story { color: #fff; }
.next-story-wrapper { width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
</style>
