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
import PageNavigation from "./page-navigation/PageNavigation.vue";
import { useRoute } from "vue-router";
import { useMeta } from "../../composables/useMeta.js";

// Устанавливаем мета-теги для главной страницы
useMeta("home");

const route = useRoute();

const introVisible = ref(false);

const shouldPlayNavIntro = computed(() => {
  return !route.meta?.skipNavIntro;
});

watch(
  shouldPlayNavIntro,
  (play) => {
    if (play) {
      introVisible.value = false;
    } else {
      introVisible.value = true;
    }
  },
  { immediate: true }
);

const restoreScrollTop = computed(() => {
  return typeof route.meta?.restoreScrollTop === "number"
    ? route.meta.restoreScrollTop
    : null;
});

watch(
  restoreScrollTop,
  async (value) => {
    if (value === null) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    await nextTick();
    requestAnimationFrame(() => {
      const container = document.querySelector(
        ".scroll-snap-container.fullscreen"
      );

      if (container) {
        const previousBehavior = container.style.scrollBehavior;
        container.style.scrollBehavior = "auto";
        container.scrollTop = value;
        requestAnimationFrame(() => {
          container.style.scrollBehavior = previousBehavior;
        });
      } else {
        window.scrollTo({ top: value, behavior: "auto" });
      }
    });
  },
  { immediate: true }
);

function handleNavAnimationComplete() {
  introVisible.value = true;
}

const navigationSections = [
  { id: "intro", label: "Intro" },
  { id: "case1", label: "Story One" },
  { id: "case2", label: "Story Two" },
  { id: "case3", label: "Story Three" },
  { id: "ai-play", label: "AI Play" },
  { id: "contacts", label: "Contact" },
];
</script>

<style scoped>
.main-page {
  width: 100vw;
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
}

.ai-play-placeholder {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: rgba(255, 255, 255, 0.3);
}
</style>
