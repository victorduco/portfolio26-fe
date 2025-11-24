<template>
  <Teleport to="#page-navigation-mount">
    <PageNavigation
      :sections="navigationSections"
      :dark-mode="isDarkMode"
      @animation-complete="introRef?.handleNavAnimationComplete()"
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
import { nextTick, ref, watch } from "vue";
import Intro from "./intro/Intro.vue";
import Story1 from "./stories/Story1.vue";
import Story2 from "./stories/Story2.vue";
import Story3 from "./stories/Story3.vue";
import AiPlay from "./ai-play/AiPlay.vue";
import Contacts from "./contacts/Contacts.vue";
import PageNavigation from "@/components/page-navigation/PageNavigation.vue";
import { useRoute } from "vue-router";
import { useMeta } from "../../composables/useMeta.js";

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
const isDarkMode = ref(true);
const shouldFadeIn = ref(false);

const lightSections = new Set(["story1", "story3"]);

watch(
  () => route.meta?.restoreScrollTop,
  (scrollTop) => {
    if (scrollTop != null) {
      nextTick(() => requestAnimationFrame(() =>
        window.scrollTo({ top: scrollTop, behavior: "auto" })
      ));
    }
  },
  { immediate: true }
);

watch(
  () => route.meta?.skipNavIntro,
  (shouldSkip) => {
    if (shouldSkip) {
      shouldFadeIn.value = true;
      setTimeout(() => shouldFadeIn.value = false, 600);
    }
  },
  { immediate: true }
);

function handleActiveSectionChange(sectionId) {
  isDarkMode.value = !lightSections.has(sectionId);
}
</script>

<style scoped>
.main-page {
  width: 100%;
  min-height: 100vh;
  background-color: #171717;
}

.main-page.fade-in::before {
  content: '';
  position: fixed;
  inset: 0;
  background-color: #ffffff;
  z-index: 9999;
  pointer-events: none;
  animation: fadeOutDelayed 0.6s ease-in forwards;
}

@keyframes fadeOutDelayed {
  0%, 50% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
