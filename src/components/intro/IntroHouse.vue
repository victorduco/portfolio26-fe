<template>
  <div
    ref="houseRef"
    class="intro-house"
    :class="{ 'intro-house--visible': isVisible }"
  >
    <div
      class="intro-house__content"
      v-html="clonedContent"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  sourceSelector: {
    type: String,
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
  excludeSelectors: {
    type: Array,
    default: () => ['.intro-list', '.house-toggle', 'motion-ul', 'ul']
  }
});

const houseRef = ref(null);
const clonedContent = ref("");

const cloneSourceElement = () => {
  const sourceElement = document.querySelector(props.sourceSelector);
  if (sourceElement) {
    // Клонируем элемент
    const clonedElement = sourceElement.cloneNode(true);

    // Удаляем исключаемые элементы
    props.excludeSelectors.forEach(selector => {
      const elementsToRemove = clonedElement.querySelectorAll(selector);
      elementsToRemove.forEach(el => el.remove());
    });

    clonedContent.value = clonedElement.outerHTML;
  }
};

onMounted(() => {
  cloneSourceElement();
});

watch(() => props.sourceSelector, () => {
  cloneSourceElement();
});

defineExpose({ houseRef });
</script>

<style scoped>
.intro-house {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: -1;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.intro-house--visible {
  opacity: 1;
  visibility: visible;
  z-index: 1;
}

.intro-house__content {
  width: 100%;
  height: 100%;
  position: relative;
  will-change: transform;
}

/* Убираем интерактивность у клонированного контента */
.intro-house__content * {
  pointer-events: none !important;
  user-select: none !important;
}
</style>
