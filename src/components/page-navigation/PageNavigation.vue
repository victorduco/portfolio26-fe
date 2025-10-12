<template>
  <!-- Desktop версия (текущая) -->
  <nav
    v-if="!isMobile"
    class="page-navigation"
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
      @navigate="handleNavigate"
    />
  </nav>

  <!-- Mobile версия -->
  <div v-else class="page-navigation-mobile">
    <!-- Кнопка-иконка -->
    <button
      class="menu-toggle"
      @click="toggleMenu"
      aria-label="Navigation menu"
      :aria-expanded="isMenuOpen"
    >
      <img src="@/assets/icons/menu.svg" alt="" />
    </button>

    <!-- Dropdown overlay -->
    <Transition name="dropdown">
      <div
        v-if="isMenuOpen"
        class="menu-overlay"
        @click.self="toggleMenu"
        @keydown.escape="toggleMenu"
      >
        <nav class="menu-dropdown">
          <NavigationItem
            v-for="(section, index) in sections"
            :key="section.id"
            :label="section.label"
            :section-id="section.id"
            :is-active="activeSection === section.id"
            :icon="section.icon"
            :mobile-mode="true"
            @navigate="handleMobileNavigate"
          />
        </nav>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import NavigationItem from "./NavigationItem.vue";
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
  enableIntroAnimation: {
    type: Boolean,
    default: false,
  },
});

const activeSection = ref(""); // Не активируем ничего до завершения intro анимации
const introFinished = ref(!props.enableIntroAnimation);
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

const emit = defineEmits(["animationComplete"]);

function startIntroAnimation() {
  const totalSections = props.sections.length;
  let currentIndex = totalSections - 1;
  let previousIndex = -1;

  function animateNext() {
    if (currentIndex < 0) {
      // Финализируем последний элемент (index 0)
      if (previousIndex === 0) {
        introFadeOutIndex.value = 0;

        setTimeout(() => {
          introFadeOutIndex.value = -1;

          setTimeout(() => {
            introHighlightIndex.value = -1;
            introGreenIndex.value = -1;

            // Активируем первую секцию (intro) после завершения анимации
            activeSection.value = props.sections[0]?.id || "";

            // Уведомляем родителя что анимация завершена
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

    // Одновременно: делаем зеленым текущий И начинаем затухание предыдущего
    introGreenIndex.value = currentIndex;

    // Вычисляем задержку: начинаем с 88ms (медленно), заканчиваем на 24ms (быстро) — в 2 раза быстрее исходного темпа
    const progress = (totalSections - 1 - currentIndex) / (totalSections - 1);
    const easeIn = Math.pow(progress, 2); // ease-in кривая для ускорения
    const baseDelay = (176 - easeIn * 128) * 0.5; // ускоряем в 2 раза: 88ms до 24ms
    const greenDuration = baseDelay * 3; // длительность пропорционально новой задержке

    if (previousIndex !== -1) {
      introFadeOutIndex.value = previousIndex;

      // Через 75ms (время затухания) убираем fadeOut и меняем цвет на белый (пока opacity = 0)
      setTimeout(() => {
        introFadeOutIndex.value = -1;

        // Сразу после смены цвета показываем белым
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

onMounted(() => {
  setupIntersectionObserver();

  const shouldRunIntro = props.enableIntroAnimation && !isMobile.value;

  if (shouldRunIntro) {
    // Задержка перед началом анимации меню
    setTimeout(() => {
      startIntroAnimation();
    }, 250);
  } else {
    // Без анимации сразу сообщаем о завершении
    introHighlightIndex.value = -1;
    introGreenIndex.value = -1;
    introFadeOutIndex.value = -1;
    activeSection.value = props.sections[0]?.id || "";
    introFinished.value = true;

    setTimeout(() => {
      emit("animationComplete");
    }, 0);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.page-navigation {
  position: fixed;
  right: 48px;
  top: 50%;
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
  top: var(--space-lg, 24px);
  right: var(--space-lg, 24px);
  z-index: 100;
}

.menu-toggle {
  width: var(--tap-min, 44px);
  height: var(--tap-min, 44px);
  border-radius: 8px;
  background: rgba(20, 20, 20, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-toggle:hover {
  background: rgba(20, 20, 20, 1);
  border-color: rgba(255, 255, 255, 0.2);
}

.menu-toggle:focus-visible {
  outline: 2px solid rgba(39, 169, 255, 0.8);
  outline-offset: 4px;
}

.menu-toggle img {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
}

.menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
  padding: 80px var(--space-lg, 24px) var(--space-lg, 24px);
  padding-bottom: max(var(--space-lg, 24px), env(safe-area-inset-bottom));
}

.menu-dropdown {
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: var(--space-sm, 8px) 0;
  max-width: 280px;
  width: 100%;
  max-height: 100dvh;
  max-height: calc(100dvh - 120px);
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
}

.dropdown-enter-active .menu-dropdown,
.dropdown-leave-active .menu-dropdown {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.dropdown-enter-from .menu-dropdown {
  transform: translateY(-16px);
  opacity: 0;
}

.dropdown-leave-to .menu-dropdown {
  transform: translateY(-16px);
  opacity: 0;
}

/* Поддержка prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .dropdown-enter-active,
  .dropdown-leave-active,
  .dropdown-enter-active .menu-dropdown,
  .dropdown-leave-active .menu-dropdown {
    transition-duration: 0.01ms;
  }

  .dropdown-enter-from .menu-dropdown,
  .dropdown-leave-to .menu-dropdown {
    transform: none;
  }
}

@media (max-width: 768px) {
  .page-navigation {
    right: 24px;
  }
}
</style>
