<template>
  <nav class="page-navigation" aria-label="Page sections navigation">
    <NavigationItem
      v-for="(section, index) in sections"
      :key="section.id"
      :label="section.label"
      :section-id="section.id"
      :is-active="activeSection === section.id"
      :intro-highlight="introHighlightIndex === index"
      @navigate="handleNavigate"
    />
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import NavigationItem from "./NavigationItem.vue";

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
});

const activeSection = ref(""); // Не активируем ничего до завершения intro анимации
const introHighlightIndex = ref(-1);
let observer = null;

function handleNavigate(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: props.scrollBehavior,
      block: "start",
    });
  }
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

const emit = defineEmits(['animationComplete']);

function startIntroAnimation() {
  const totalSections = props.sections.length;
  let currentIndex = totalSections - 1;

  function animateNext() {
    if (currentIndex < 0) {
      introHighlightIndex.value = -1;
      // Активируем первую секцию (intro) после завершения анимации
      activeSection.value = props.sections[0]?.id || "";
      // Уведомляем родителя что анимация завершена
      setTimeout(() => {
        emit('animationComplete');
      }, 500);
      return;
    }

    introHighlightIndex.value = currentIndex;

    // Вычисляем задержку: начинаем с 60ms, заканчиваем на 220ms
    // Используем ease-out кривую для плавного замедления
    const progress = (totalSections - 1 - currentIndex) / (totalSections - 1);
    const easeOut = 1 - Math.pow(1 - progress, 2);
    const delay = 60 + easeOut * 160; // от 60ms до 220ms

    currentIndex--;
    setTimeout(animateNext, delay);
  }

  animateNext();
}

onMounted(() => {
  setupIntersectionObserver();
  // Задержка перед началом анимации меню
  setTimeout(() => {
    startIntroAnimation();
  }, 500);
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

@media (max-width: 768px) {
  .page-navigation {
    right: 24px;
  }
}
</style>
