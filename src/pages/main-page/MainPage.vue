<template>
  <div class="main-page">
    <PageNavigation
      :sections="navigationSections"
      :enable-intro-animation="shouldPlayNavIntro"
      @animation-complete="handleNavAnimationComplete"
    />
    <VueScrollSnap :fullscreen="true">
      <section id="intro" class="item" :class="{ 'intro-visible': introVisible }">
        <Intro :intro-visible="introVisible" />
      </section>
      <section id="case1" class="item">
        <Case1 />
      </section>
      <section id="case2" class="item">
        <Case2 />
      </section>
      <section id="case3" class="item">
        <Case3 />
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
import { computed, nextTick, ref, watch } from "vue";
import VueScrollSnap from "vue-scroll-snap";
import Intro from "./intro/Intro.vue";
import Case1 from "./cases/Case1.vue";
import Case2 from "./cases/Case2.vue";
import Case3 from "./cases/Case3.vue";
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
          scrollContainerRef.value = document.querySelector(".scroll-snap-container.fullscreen");
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

#case1.item {
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
