<template>
  
  <nav
    v-if="!isMobile"
    class="page-navigation"
    :class="{ 'page-navigation--light': !props.darkMode, 'page-navigation--dark': props.darkMode }"
    aria-label="Page sections navigation"
  >
    <NavigationItem
      v-for="(section, index) in sections"
      :key="section.id"
      :label="section.label"
      :section-id="section.id"
      :is-active="activeSection === section.id"
      :intro-highlight="introHighlightIndex === index"
      :intro-green="introGreenIndex === index"
      :intro-fade-out="introFadeOutIndex === index"
      :intro-complete="introFinished"
      :icon="section.icon"
      :dark-mode="props.darkMode"
      @navigate="handleNavigate"
    />
  </nav>

  
  <div v-else class="page-navigation-mobile">
    
    <NavigationChevron
      v-if="!isMenuOpen"
      type="button"
      direction="menu"
      aria-label="Open menu"
      :dark-mode="props.darkMode"
      @click="toggleMenu"
    />

    
    <Transition name="menu-fade">
      <div
        v-if="isMenuOpen"
        class="menu-overlay"
        :class="{ 'menu-overlay--dark': props.darkMode, 'menu-overlay--light': !props.darkMode }"
        @click.self="toggleMenu"
        @keydown.escape="toggleMenu"
      >
        
        <NavigationChevron
          class="menu-close-button"
          type="button"
          direction="close"
          aria-label="Close menu"
          :dark-mode="props.darkMode"
          @click="toggleMenu"
        />

        
        <nav class="menu-content">
          <NavigationItem
            v-for="(section, index) in sections"
            :key="section.id"
            :label="section.label"
            :section-id="section.id"
            :is-active="activeSection === section.id"
            :icon="section.icon"
            :mobile-mode="true"
            :dark-mode="props.darkMode"
            @navigate="handleMobileNavigate"
          />
        </nav>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import NavigationItem from "./NavigationItem.vue";
import NavigationChevron from "@/components/navigation-chevron/NavigationChevron.vue";
import {
  useMediaQuery,
  NAVIGATION_MOBILE,
} from "@/composables/useMediaQuery.js";

const isMobile = useMediaQuery(NAVIGATION_MOBILE);
const isMenuOpen = ref(false);

const props = defineProps({
  sections: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(
        (section) =>
          typeof section.id === "string" && typeof section.label === "string"
      );
    },
  },
  scrollBehavior: {
    type: String,
    default: "smooth",
    validator: (value) => ["smooth", "auto", "instant"].includes(value),
  },
  observerRootMargin: {
    type: String,
    default: "-50% 0px -50% 0px",
  },
  darkMode: {
    type: Boolean,
    default: true, // Default to dark mode (safer for most sections)
  },
});


const route = useRoute();
const shouldPlayIntroAnimation = computed(() => !route.meta?.skipNavIntro);

const activeSection = ref(""); // Не активируем ничего до завершения intro анимации
const introFinished = ref(!shouldPlayIntroAnimation.value);
const introHighlightIndex = ref(-1);
const introGreenIndex = ref(-1);
const introFadeOutIndex = ref(-1);
let observer = null;

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function handleNavigate(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: props.scrollBehavior,
      block: "start",
    });
  }
}

function handleMobileNavigate(sectionId) {
  isMenuOpen.value = false; // закрываем меню
  handleNavigate(sectionId); // существующая логика скролла
}

function setupIntersectionObserver() {
  const options = {
    root: null,
    rootMargin: props.observerRootMargin,
    threshold: 0,
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id;
        emit("activeSectionChange", entry.target.id);
      }
    });
  }, options);

  props.sections.forEach((section) => {
    const element = document.getElementById(section.id);
    if (element) {
      observer.observe(element);
    }
  });
}

const emit = defineEmits(["animationComplete", "activeSectionChange"]);

function startIntroAnimation() {
  const totalSections = props.sections.length;
  let currentIndex = totalSections - 1;
  let previousIndex = -1;

  function animateNext() {
    if (currentIndex < 0) {
      
      if (previousIndex === 0) {
        introFadeOutIndex.value = 0;

        setTimeout(() => {
          introFadeOutIndex.value = -1;

          setTimeout(() => {
            introHighlightIndex.value = -1;
            introGreenIndex.value = -1;

            
            activeSection.value = props.sections[0]?.id || "";

            
            setTimeout(() => {
              introFinished.value = true;
              emit("animationComplete");
            }, 50);
          }, 0);
        }, 75);
      } else {
        introHighlightIndex.value = -1;
        introGreenIndex.value = -1;
        introFadeOutIndex.value = -1;
        activeSection.value = props.sections[0]?.id || "";
        setTimeout(() => {
          introFinished.value = true;
          emit("animationComplete");
        }, 250);
      }
      return;
    }

    
    introGreenIndex.value = currentIndex;

    
    const progress = (totalSections - 1 - currentIndex) / (totalSections - 1);
    const easeIn = Math.pow(progress, 2); // ease-in кривая для ускорения
    const baseDelay = (176 - easeIn * 128) * 0.5; // ускоряем в 2 раза: 88ms до 24ms
    const greenDuration = baseDelay * 3; // длительность пропорционально новой задержке

    if (previousIndex !== -1) {
      introFadeOutIndex.value = previousIndex;

      
      setTimeout(() => {
        introFadeOutIndex.value = -1;

        
        setTimeout(() => {
          introHighlightIndex.value = previousIndex;
        }, 0);
      }, 75);
    }

    previousIndex = currentIndex;
    currentIndex--;
    setTimeout(animateNext, greenDuration);
  }

  animateNext();
}

// Listen for custom section events from ScrollTrigger-based sections
function handleStorySectionActive(event) {
  const { sectionId } = event.detail;
  if (sectionId && introFinished.value) {
    activeSection.value = sectionId;
    emit("activeSectionChange", sectionId);
  }
}

onMounted(() => {
  setupIntersectionObserver();

  // Listen for custom events from ScrollTrigger-controlled sections
  window.addEventListener('story-section-active', handleStorySectionActive);

  // Intro animation disabled - skip directly to finished state
  introHighlightIndex.value = -1;
  introGreenIndex.value = -1;
  introFadeOutIndex.value = -1;
  activeSection.value = props.sections[0]?.id || "";
  introFinished.value = true;

  setTimeout(() => {
    emit("animationComplete");
  }, 0);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
  // Remove custom event listener
  window.removeEventListener('story-section-active', handleStorySectionActive);
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
  gap: 0;
  z-index: 1000;
  padding: 24px 0;
}

/* Mobile версия */
.page-navigation-mobile {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1001;
}

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

/* Dark mode overlay - dark background */
.menu-overlay--dark {
  background: rgba(23, 23, 23, 0.98);
}

/* Light mode overlay - light background */
.menu-overlay--light {
  background: rgba(255, 255, 255, 0.98);
}

.menu-close-button {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 10001;
}

.menu-content {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* Mobile landscape: reduce spacing to fit all items */
@media (max-width: 767px) and (orientation: landscape) {
  .menu-content {
    gap: 8px;
    max-height: 90vh;
    overflow-y: auto;
  }
}

/* Transitions */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.25s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

.menu-fade-enter-active .menu-content,
.menu-fade-leave-active .menu-content {
  transition: transform 0.3s ease, opacity 0.25s ease;
}

.menu-fade-enter-from .menu-content {
  transform: scale(0.95);
  opacity: 0;
}

.menu-fade-leave-to .menu-content {
  transform: scale(0.95);
  opacity: 0;
}

/* Поддержка prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .menu-fade-enter-active,
  .menu-fade-leave-active,
  .menu-fade-enter-active .menu-content,
  .menu-fade-leave-active .menu-content {
    transition-duration: 0.01ms;
  }

  .menu-fade-enter-from .menu-content,
  .menu-fade-leave-to .menu-content {
    transform: none;
  }
}

@media (max-width: 899px) {
  .page-navigation {
    right: 24px;
  }
}
</style>
