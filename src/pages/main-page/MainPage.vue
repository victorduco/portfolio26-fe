<template>
  <div
    class="main-page"
    :style="{
      backgroundColor: currentBackgroundColor,
      color: textColor,
      transition: 'background-color 0.5s ease, color 0.5s ease',
    }"
  >
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
      >
        <CaseItem
          :title="caseData.title"
          :subtitle="caseData.subtitle"
          :video-src="caseData.videoSrc"
          :route-to="caseData.routeTo"
          :primary-color="caseData.primaryColor"
          :background-color="caseData.backgroundColor"
          :dark-mode="isDarkMode"
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
import storyNavIcon from "@/assets/icons/headphones.svg";
import { useRoute } from "vue-router";
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
  },
  {
    id: "case2",
    title: "Story Two Title",
    subtitle: "Client Two",
    videoSrc: new URL("@/assets/case-videos/case2.mp4", import.meta.url).href,
    routeTo: "/story/two",
    backgroundColor: "#f2668b", // Pink from design system
  },
  {
    id: "case3",
    title: "Story Three Title",
    subtitle: "Client Three",
    videoSrc: new URL("@/assets/case-videos/case3.mp4", import.meta.url).href,
    routeTo: "/story/three",
    backgroundColor: "#171717", // Default dark background
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
const introVisible = ref(false);
const scrollContainerRef = ref(null);

// Color transition system
const currentBackgroundColor = ref("#171717"); // Default background
const textColor = ref("#ffffff"); // Dynamic text color based on background
const isDarkMode = ref(true); // Navigation mode based on background

// Define section colors including intro and other sections
const sectionColors = {
  intro: "#171717", // Default dark
  case1: "#ffffff", // White
  case2: "#f2668b", // Pink
  case3: "#171717", // Default dark
  "ai-play": "#171717", // Default dark
  contacts: "#171717", // Default dark
};

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
  const color = sectionColors[sectionId];
  if (color) {
    currentBackgroundColor.value = color;
    textColor.value = getContrastTextColor(color);

    // Update navigation mode based on background color
    // Dark mode = true when background is dark (text should be white)
    // Light mode = false when background is light (text should be black)
    isDarkMode.value = getContrastTextColor(color) === "#ffffff";

    // Also update CSS custom properties for global styling
    document.documentElement.style.setProperty("--page-background", color);
    document.documentElement.style.setProperty(
      "--page-text",
      getContrastTextColor(color)
    );
  }
}

// Function to determine text color based on background brightness
function getContrastTextColor(backgroundColor) {
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate relative luminance using WCAG formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return dark text for light backgrounds, light text for dark backgrounds
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

onMounted(() => {
  // Initialize theme for intro section immediately
  handleActiveSectionChange("intro");

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
  /* Background color is now dynamic via :style binding */
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
</style>
