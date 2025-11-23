<template>
  <Teleport to="#page-navigation-mount">
    <PageNavigation
      :sections="navigationSections"
      :dark-mode="isDarkMode"
      @animation-complete="handleNavAnimationComplete"
      @active-section-change="handleActiveSectionChange"
    />
  </Teleport>
  <div class="main-page" :class="{ 'fade-in': shouldFadeIn }">
    <Intro ref="introRef" />
    <Story1 />
    <Story2 />
    <Story3 />
    <AiPlay :dark-mode="isDarkMode" />
    <Contacts :dark-mode="isDarkMode" />
  </div>
</template>

<script setup>
import { nextTick, ref, watch, onMounted } from "vue";
import Intro from "./intro/Intro.vue";
import Story1 from "./stories/Story1.vue";
import Story2 from "./stories/Story2.vue";
import Story3 from "./stories/Story3.vue";
import AiPlay from "./ai-play/AiPlay.vue";
import Contacts from "./contacts/Contacts.vue";
import PageNavigation from "@/components/page-navigation/PageNavigation.vue";
import { useRoute } from "vue-router";
import { useMeta } from "../../composables/useMeta.js";
import { useLenis } from "../../composables/useLenis.js";

const navigationSections = [
  { id: "intro", label: "Intro" },
  { id: "story1", label: "Story One" },
  { id: "story2", label: "Story Two" },
  { id: "story3", label: "Story Three" },
  { id: "ai-play", label: "AI Play" },
  { id: "contacts", label: "Contact" },
];

useMeta("home");
const route = useRoute();
const introRef = ref(null);
// const { registerSnapPoints, registerMandatoryTriggerSnaps } = useLenis();

const isDarkMode = ref(true);
const shouldFadeIn = ref(false);

// Register snap points after all sections are mounted
// onMounted(() => {
//   nextTick(() => {
//     registerSnapPoints();

//     // Register trigger-based mandatory snaps after a short delay
//     // to ensure all GSAP ScrollTriggers are initialized
//     setTimeout(() => {
//       registerMandatoryTriggerSnaps();
//     }, 100);
//   });
// });

watch(
  () => route.meta?.restoreScrollTop,
  (scrollTop) => {
    if (scrollTop != null && typeof window !== "undefined") {
      nextTick().then(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollTop, behavior: "auto" });
        });
      });
    }
  },
  { immediate: true }
);

// Trigger fade-in when returning from story page
watch(
  () => route.meta?.skipNavIntro,
  (shouldSkip) => {
    if (shouldSkip) {
      shouldFadeIn.value = true;

      // Remove the class after animation completes (0.3s delay + 0.3s fade = 600ms)
      setTimeout(() => {
        shouldFadeIn.value = false;
      }, 600);
    }
  },
  { immediate: true }
);

function handleNavAnimationComplete() {
  introRef.value?.handleNavAnimationComplete();
}

function handleActiveSectionChange(sectionId) {
  if (sectionId === "story2") {
    isDarkMode.value = true; // White menu for story2
  } else if (sectionId === "story1" || sectionId === "story3") {
    isDarkMode.value = false; // Black menu for story1 and story3
  } else {
    isDarkMode.value = true; // White menu for intro, ai-play, contacts (dark backgrounds)
  }
}
</script>

<style scoped>
.main-page {
  width: 100%;
  min-height: 100vh;
  background-color: #171717; /* Default dark background */
}

/* Fade-in animation when returning from story page */
.main-page.fade-in {
  position: relative;
}

.main-page.fade-in::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  z-index: 9999;
  pointer-events: none;
  animation: fadeOutDelayed 0.6s ease-in forwards;
}

@keyframes fadeOutDelayed {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 1; /* Hold white screen for 0.3 seconds */
  }
  100% {
    opacity: 0; /* Fade out in last 0.3 seconds */
  }
}

.scroll-container {
  width: 100%;
}
</style>
