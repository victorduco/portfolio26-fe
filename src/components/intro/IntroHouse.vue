<template>
  <div
    :id="resultSelectorId"
    class="intro-house__content"
    v-html="clonedContent"
  ></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";

const props = defineProps({
  sourceSelector: {
    type: String,
    required: true,
  },

  resultSelectorId: {
    type: String,
    required: true,
  },

  excludeSelectors: {
    type: Array,
    default: () => [".intro-list", ".intro-square", ".intro-distortion"],
  },
});

const clonedContent = ref("");
const filterId = `intro-house-filter-${Math.random().toString(36).slice(2, 8)}`;
let mutationObserver = null;

const cloneSourceElement = () => {
  const sourceElement = document.querySelector(props.sourceSelector);
  if (sourceElement) {
    // Клонируем элемент
    const clonedElement = sourceElement.cloneNode(true);

    // Удаляем исключаемые элементы
    props.excludeSelectors.forEach((selector) => {
      const elementsToRemove = clonedElement.querySelectorAll(selector);
      elementsToRemove.forEach((el) => el.remove());
    });

    clonedContent.value = clonedElement.outerHTML;
  }
};

// TODO: remove it

// const setupMutationObserver = (element) => {
//   if (mutationObserver) {
//     mutationObserver.disconnect();
//   }

//   if (!element || !props.realTimeUpdates) return;

//   mutationObserver = new MutationObserver(() => {
//     cloneSourceElement();
//   });

//   mutationObserver.observe(element, {
//     childList: true,
//     subtree: true,
//     attributes: true,
//     attributeOldValue: true,
//     characterData: true,
//     characterDataOldValue: true,
//   });
// };

onMounted(() => {
  cloneSourceElement();

  // if (props.realTimeUpdates) {
  //   const sourceElement = document.querySelector(props.sourceSelector);
  //   setupMutationObserver(sourceElement);
  // }
});

// watch(
//   () => props.sourceSelector,
//   () => {
//     cloneSourceElement();

//     if (props.realTimeUpdates) {
//       const sourceElement = document.querySelector(props.sourceSelector);
//       setupMutationObserver(sourceElement);
//     }
//   }
// );

// onBeforeUnmount(() => {
//   if (mutationObserver) {
//     mutationObserver.disconnect();
//     mutationObserver = null;
//   }
// });

// defineExpose({ houseRef, clonedContent, cloneSourceElement });
</script>

<style scoped>
.intro-house {
}

.intro-house__content {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  visibility: hidden;
}

.intro-house__filters {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* Убираем интерактивность у клонированного контента */
.intro-house__content * {
  pointer-events: none !important;
  user-select: none !important;
}
</style>
