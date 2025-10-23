<template>
  <div class="main-page">
    <PageNavigation
      :sections="navigationSections"
      :dark-mode="isDarkMode"
      @animation-complete="handleNavAnimationComplete"
      @active-section-change="handleActiveSectionChange"
    />
    <VueScrollSnap :fullscreen="true">
      <Intro ref="introRef" />
      <Case1 />
      <Case2 />
      <Case3 />
      <AiPlay :dark-mode="isDarkMode" />
      <Contacts :dark-mode="isDarkMode" />
    </VueScrollSnap>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
import VueScrollSnap from "vue-scroll-snap";
import Intro from "./intro/Intro.vue";
import Case1 from "./cases/Case1.vue";
import Case2 from "./cases/Case2.vue";
import Case3 from "./cases/Case3.vue";
import AiPlay from "./ai-play/AiPlay.vue";
import Contacts from "./contacts/Contacts.vue";
import PageNavigation from "@/components/page-navigation/PageNavigation.vue";
import { useRoute } from "vue-router";
import { useMeta } from "../../composables/useMeta.js";

const navigationSections = [
  { id: "intro", label: "Intro" },
  { id: "case1", label: "Story One" },
  { id: "case2", label: "Story Two" },
  { id: "case3", label: "Story Three" },
  { id: "ai-play", label: "AI Play" },
  { id: "contacts", label: "Contact" },
];

useMeta("home");

const route = useRoute();
const introRef = ref(null);
const scrollContainerRef = ref(null);

const isDarkMode = ref(true);

watch(
  () => route.meta?.restoreScrollTop,
  (scrollTop) => {
    if (scrollTop != null && typeof window !== "undefined") {
      nextTick().then(() => {
        requestAnimationFrame(() => {
          if (!scrollContainerRef.value) {
            scrollContainerRef.value = document.querySelector(
              ".scroll-snap-container.fullscreen"
            );
          }

          const container = scrollContainerRef.value;
          if (container) {
            const previousBehavior = container.style.scrollBehavior;
            container.style.scrollBehavior = "auto";
            container.scrollTop = scrollTop;
            requestAnimationFrame(() => {
              container.style.scrollBehavior = previousBehavior;
            });
          } else {
            window.scrollTo({ top: scrollTop, behavior: "auto" });
          }
        });
      });
    }
  },
  { immediate: true }
);

function handleNavAnimationComplete() {
  introRef.value?.handleNavAnimationComplete();
}

function handleActiveSectionChange(sectionId) {
  if (sectionId === "case2") {
    isDarkMode.value = true; // White menu for case2
  } else if (sectionId === "case1" || sectionId === "case3") {
    isDarkMode.value = false; // Black menu for case1 and case3
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
</style>
