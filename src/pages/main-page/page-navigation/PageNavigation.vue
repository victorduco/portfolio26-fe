<template>
  <nav class="page-navigation" aria-label="Page sections navigation">
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
              emit('animationComplete');
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
          emit('animationComplete');
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

  if (props.enableIntroAnimation) {
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
      emit('animationComplete');
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

@media (max-width: 768px) {
  .page-navigation {
    right: 24px;
  }
}
</style>
