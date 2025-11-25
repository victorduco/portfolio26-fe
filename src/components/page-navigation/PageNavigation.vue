<template>
  <nav v-if="!isMobile" class="page-navigation" :class="themeClass" aria-label="Page sections navigation">
    <NavigationItem
      v-for="section in sections" :key="section.id"
      :label="section.label" :section-id="section.id" :icon="section.icon"
      :is-active="activeSection === section.id" :dark-mode="darkMode" intro-complete
      @navigate="handleNavigate"
    />
  </nav>

  <div v-else class="page-navigation-mobile">
    <NavigationChevron v-if="!isMenuOpen" direction="menu" aria-label="Open menu" :dark-mode="darkMode" @click="toggleMenu" />

    <Transition name="menu-fade">
      <div v-if="isMenuOpen" class="menu-overlay" :class="themeClass" @click.self="toggleMenu" @keydown.escape="toggleMenu">
        <NavigationChevron class="menu-close-button" direction="close" aria-label="Close menu" :dark-mode="darkMode" @click="toggleMenu" />
        <nav class="menu-content">
          <NavigationItem
            v-for="section in sections" :key="section.id"
            :label="section.label" :section-id="section.id" :icon="section.icon"
            :is-active="activeSection === section.id" :dark-mode="darkMode" mobile-mode
            @navigate="handleNavigate(section.id, true)"
          />
        </nav>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import NavigationItem from "./NavigationItem.vue";
import NavigationChevron from "@/components/navigation-chevron/NavigationChevron.vue";
import { useMediaQuery, NAVIGATION_MOBILE } from "@/composables/useMediaQuery.js";

const props = defineProps({
  sections: { type: Array, required: true, validator: v => v.every(s => typeof s.id === "string" && typeof s.label === "string") },
  scrollBehavior: { type: String, default: "smooth", validator: v => ["smooth", "auto", "instant"].includes(v) },
  observerRootMargin: { type: String, default: "-50% 0px -50% 0px" },
  darkMode: { type: Boolean, default: true },
});

const emit = defineEmits(["animationComplete", "activeSectionChange"]);

const isMobile = useMediaQuery(NAVIGATION_MOBILE);
const isMenuOpen = ref(false);
const activeSection = ref("");
let observer = null;

const themeClass = computed(() => props.darkMode ? "theme--dark" : "theme--light");

const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value;

function handleNavigate(sectionId, closeMenu = false) {
  if (closeMenu) isMenuOpen.value = false;
  document.getElementById(sectionId)?.scrollIntoView({ behavior: props.scrollBehavior, block: "start" });
}

function setupIntersectionObserver() {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Skip only main page story sections (story1, story2, story3) - they use ScrollTrigger
      // Allow story page sections (story1-summary, story1-task, etc.)
      const isMainPageStory = entry.target.id === "story1" || entry.target.id === "story2" || entry.target.id === "story3";
      if (entry.isIntersecting && !isMainPageStory) {
        activeSection.value = entry.target.id;
        emit("activeSectionChange", entry.target.id);
      }
    });
  }, { root: null, rootMargin: props.observerRootMargin, threshold: 0 });

  props.sections.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

function handleStorySectionActive({ detail: { sectionId } }) {
  if (sectionId) {
    activeSection.value = sectionId;
    emit("activeSectionChange", sectionId);
  }
}

onMounted(() => {
  setupIntersectionObserver();
  window.addEventListener("story-section-active", handleStorySectionActive);
  nextTick(() => {
    activeSection.value = props.sections[0]?.id || "";
    emit("animationComplete");
  });
});

onUnmounted(() => {
  observer?.disconnect();
  window.removeEventListener("story-section-active", handleStorySectionActive);
});
</script>

<style scoped>
.page-navigation {
  position: fixed;
  right: 48px;
  top: 50svh;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  padding: 24px 0;
}

.page-navigation-mobile { position: fixed; top: 24px; right: 24px; z-index: 1001; }

.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}
.menu-overlay.theme--dark { background: rgba(23, 23, 23, 0.98); }
.menu-overlay.theme--light { background: rgba(255, 255, 255, 0.98); }

.menu-close-button { position: fixed; top: 24px; right: 24px; z-index: 10001; }

.menu-content { width: 100%; max-width: 400px; display: flex; flex-direction: column; align-items: center; gap: 16px; }

@media (max-width: 767px) and (orientation: landscape) {
  .menu-content { gap: 8px; max-height: 90vh; overflow-y: auto; }
}

.menu-fade-enter-active, .menu-fade-leave-active { transition: opacity 0.25s ease; }
.menu-fade-enter-from, .menu-fade-leave-to { opacity: 0; }
.menu-fade-enter-active .menu-content, .menu-fade-leave-active .menu-content { transition: transform 0.3s ease, opacity 0.25s ease; }
.menu-fade-enter-from .menu-content, .menu-fade-leave-to .menu-content { transform: scale(0.95); opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .menu-fade-enter-active, .menu-fade-leave-active,
  .menu-fade-enter-active .menu-content, .menu-fade-leave-active .menu-content { transition-duration: 0.01ms; }
  .menu-fade-enter-from .menu-content, .menu-fade-leave-to .menu-content { transform: none; }
}

@media (max-width: 899px) { .page-navigation { right: 24px; } }
</style>
