<template>
  <div class="main-page">
    <PageNavigation
      :sections="navigationSections"
      :enable-intro-animation="shouldPlayNavIntro"
      @animation-complete="handleNavAnimationComplete"
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
        />
      </section>
      <section id="ai-play" class="item">
        <div class="ai-play-placeholder">AI Play - Coming Soon</div>
      </section>
      <section id="contacts" class="item">
        <Contacts />
      </section>
    </VueScrollSnap>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import VueScrollSnap from "vue-scroll-snap";
import Intro from "./intro/Intro.vue";
import CaseItem from "./cases/CaseItem.vue";
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
  },
  {
    id: "case2",
    title: "Story Two Title",
    subtitle: "Client Two",
    videoSrc: new URL("@/assets/case-videos/case2.mp4", import.meta.url).href,
    routeTo: "/story/two",
  },
  {
    id: "case3",
    title: "Story Three Title",
    subtitle: "Client Three",
    videoSrc: new URL("@/assets/case-videos/case3.mp4", import.meta.url).href,
    routeTo: "/story/three",
  },
];

const navigationSections = [
  { id: "intro", label: "Intro" },
  { id: "case1", label: "Story One", icon: storyNavIcon },
  { id: "case2", label: "Story Two", icon: storyNavIcon },
  { id: "case3", label: "Story Three", icon: storyNavIcon },
  { id: "ai-play", label: "AI Play" },
  { id: "contacts", label: "Contact" },
];

useMeta("home");

const route = useRoute();
const introVisible = ref(false);
const scrollContainerRef = ref(null);

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
  background: #171717;
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

.ai-play-placeholder {
  width: 100%;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: rgba(255, 255, 255, 0.3);
}
</style>
