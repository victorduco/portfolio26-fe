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
          :description="caseData.description"
          :video-src="caseData.videoSrc"
          :image-src="caseData.imageSrc"
          :route-to="caseData.routeTo"
          :primary-color="caseData.primaryColor"
          :background-color="caseData.backgroundColor"
          :dark-mode="isDarkMode"
          :final-overlay-time="caseData.finalOverlayTime"
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

    <!-- Open Story Button for Cases 1-3 -->
    <OpenStoryButton
      :visible="storyButtonVisible"
      :case-number="currentCaseNumber"
      :fade-opacity="storyButtonOpacity"
      :route-to="currentCaseRoute"
      @click="handleStoryButtonClick"
    />
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
import OpenStoryButton from "@/components/OpenStoryButton.vue";
import storyNavIcon from "@/assets/icons/headphones.svg";
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
  },
  {
    id: "case2",
    title: "Redesigning the Internal Communications App",
    subtitle: "Smarp",
    description: "Communication platform for teams",
    imageSrc: new URL("@/assets/images/p2-3@2x.png", import.meta.url).href,
    routeTo: "/story/two",
    backgroundColor: "#E9D3D2",
    useSplitLayout: true,
  },
  {
    id: "case3",
    title: "From Chaos to Clarity: Terminal Shift Redesign",
    subtitle: "Mirai",
    imageSrc: new URL("@/assets/images/cs3-ipad.png", import.meta.url).href,
    routeTo: "/story/three",
    backgroundColor: "#EAF5FF",
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

// Story button state
const storyButtonVisible = ref(false);
const storyButtonOpacity = ref(0);
const currentCaseNumber = ref(1);
const currentCaseRoute = ref("/story/one");

// Color transition system
const currentBackgroundColor = ref("#171717"); // Default background
const textColor = ref("#ffffff"); // Dynamic text color based on background
const isDarkMode = ref(true); // Navigation mode based on background

// Define section colors including intro and other sections
const sectionColors = {
  intro: "#171717", // Default dark
  case1: "#ffffff", // White
  case2: "#E9D3D2", // Smarp background
  case3: "#EAF5FF", // Mirai background
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

  // Update story button visibility and style based on section
  updateStoryButton(sectionId);
}

function updateStoryButton(sectionId) {
  const caseMap = {
    case1: { number: 1, route: "/story/one" },
    case2: { number: 2, route: "/story/two" },
    case3: { number: 3, route: "/story/three" },
  };

  if (caseMap[sectionId]) {
    const caseInfo = caseMap[sectionId];
    storyButtonVisible.value = true;
    currentCaseNumber.value = caseInfo.number;
    currentCaseRoute.value = caseInfo.route;
    storyButtonOpacity.value = 1;
  } else if (sectionId === "intro") {
    // Before case1 - button not visible yet
    storyButtonVisible.value = false;
    storyButtonOpacity.value = 0;
  } else {
    // After case3 - fade out
    storyButtonOpacity.value = 0;
    // Delay hiding to allow fade out animation
    setTimeout(() => {
      if (storyButtonOpacity.value === 0) {
        storyButtonVisible.value = false;
      }
    }, 500);
  }
}

function handleStoryButtonClick() {
  // Save scroll position before navigation
  if (!scrollContainerRef.value) {
    scrollContainerRef.value = document.querySelector(
      ".scroll-snap-container.fullscreen"
    );
  }

  const container = scrollContainerRef.value;
  const scrollTop = container ? container.scrollTop : window.scrollY;

  // Navigate to story page
  router.push({
    path: currentCaseRoute.value,
    state: { fromMainPage: true, scrollTop },
  });
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
