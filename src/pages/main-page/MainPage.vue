<template>
  <div class="main-page">
    <PageNavigation
      :sections="navigationSections"
      :enable-intro-animation="shouldPlayNavIntro"
      :dark-mode="isDarkMode"
      @animation-complete="handleNavAnimationComplete"
      @active-section-change="handleActiveSectionChange"
    />
    <VueScrollSnap :fullscreen="true">
      <section
        id="intro"
        class="item"
        :class="{ 'intro-visible': introVisible }"
      >
        <Intro :intro-visible="introVisible" />
      </section>
      <section
        v-for="caseData in casesData"
        :key="caseData.id"
        :id="caseData.id"
        class="item case-section"
        :style="{ backgroundColor: caseData.backgroundColor }"
      >
        <CaseItem
          :title="caseData.title"
          :subtitle="caseData.subtitle"
          :description="caseData.description"
          :video-src="caseData.videoSrc"
          :image-src="caseData.imageSrc"
          :route-to="caseData.routeTo"
          :primary-color="caseData.primaryColor"
          :background-color="caseData.backgroundColor"
          :dark-mode="isDarkMode"
          :final-overlay-time="caseData.finalOverlayTime"
          :use-scroll-layout="caseData.useScrollLayout"
          :use-split-layout="caseData.useSplitLayout"
          :use-unique-layout="caseData.useUniqueLayout"
        />
      </section>
      <section id="ai-play" class="item">
        <AiPlay :dark-mode="isDarkMode" />
      </section>
      <section id="contacts" class="item">
        <Contacts :dark-mode="isDarkMode" />
      </section>
    </VueScrollSnap>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import VueScrollSnap from "vue-scroll-snap";
import Intro from "./intro/Intro.vue";
import CaseItem from "./cases/CaseItem.vue";
import AiPlay from "./ai-play/AiPlay.vue";
import Contacts from "./contacts/Contacts.vue";
import PageNavigation from "@/components/page-navigation/PageNavigation.vue";
import { useRoute, useRouter } from "vue-router";
import { useMeta } from "../../composables/useMeta.js";

const casesData = [
  {
    id: "case1",
    title: "Cross-Domain AI Solution for Account Reconcilers",
    subtitle: "Apple",
    videoSrc: new URL("@/assets/case-videos/case1.mp4", import.meta.url).href,
    routeTo: "/story/one",
    primaryColor: "#319BF8",
    backgroundColor: "#ffffff", // White for case 1
    finalOverlayTime: 39.5, // Show final overlay at 39.5 seconds
    useScrollLayout: true,
  },
  {
    id: "case2",
    title: "Redesigning the Communications App",
    subtitle: "Smarp",
    description: "Communication platform for teams. Streamlining internal communications with intuitive design and powerful features. Empowering organizations to connect, collaborate, and share knowledge effectively across all departments and locations.",
    videoSrc: new URL("@/assets/case-videos/case2-2.mp4", import.meta.url).href,
    imageSrc: new URL("@/assets/images/p2-3@2x.png", import.meta.url).href,
    routeTo: "/story/two",
    backgroundColor: "#ffffff", // White for case 2
    useSplitLayout: true,
  },
  {
    id: "case3",
    title: "Terminal Shift Redesign",
    subtitle: "Mirai",
    imageSrc: new URL("@/assets/images/cs3-ipad.png", import.meta.url).href,
    videoSrc: new URL(
      "@/assets/case-videos/case3-reversed-flipped.mp4",
      import.meta.url
    ).href,
    routeTo: "/story/three",
    backgroundColor: "#B9E2F7", // Blue for case 3
    useUniqueLayout: true,
  },
];

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
const router = useRouter();
const introVisible = ref(false);
const scrollContainerRef = ref(null);

// Navigation dark mode (static for now)
const isDarkMode = ref(true);

const shouldPlayNavIntro = computed(() => !route.meta?.skipNavIntro);

watch(
  () => [shouldPlayNavIntro.value, route.meta?.restoreScrollTop],
  async ([play, scrollTop]) => {
    introVisible.value = !play;

    if (scrollTop != null && typeof window !== "undefined") {
      await nextTick();
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
    }
  },
  { immediate: true }
);

function handleNavAnimationComplete() {
  introVisible.value = true;
}

function handleActiveSectionChange(sectionId) {
  // Update navigation mode based on section
  // Dark mode = true means white menu elements
  // Light mode = false means black menu elements
  if (sectionId === 'case2') {
    isDarkMode.value = true; // White menu for case2
  } else if (sectionId === 'case1' || sectionId === 'case3') {
    isDarkMode.value = false; // Black menu for case1 and case3
  } else {
    isDarkMode.value = true; // White menu for intro, ai-play, contacts (dark backgrounds)
  }
}

onMounted(() => {
  const cameFromStory = route.meta?.skipNavIntro;
  if (!cameFromStory) {
    casesData.forEach((caseData) => {
      const key = `video-state-${caseData.videoSrc}`;
      sessionStorage.removeItem(key);
    });
  }
});
</script>

<style scoped>
.main-page {
  width: 100%;
  min-height: 100vh;
  background-color: #171717; /* Default dark background */
}

#intro {
  opacity: 0;
  transition: opacity 0.5s ease-out;
}

#intro.intro-visible {
  opacity: 1;
}

.case-section.item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  height: 100dvh;
}

/* Case1 needs extra height for scroll animation */
#case1.case-section.item {
  height: 400vh;
  min-height: 400vh;
  max-height: 400vh;
  /* overflow: hidden убран - мешает sticky */
}

/* Case2 needs extra height for scroll animation */
#case2.case-section.item {
  height: 250vh;
  min-height: 250vh;
  max-height: 250vh;
}

/* Case3 standard height */
#case3.case-section.item {
  height: 100dvh;
  min-height: 100dvh;
  max-height: 100dvh;
}
</style>
