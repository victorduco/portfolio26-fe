<template>
  <div
    ref="houseRef"
    class="intro-house"
    :class="{ 'intro-house--visible': isVisible }"
  >
    <svg v-if="showFilterPreview" class="intro-house__filters" aria-hidden="true">
      <filter :id="filterId" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur :stdDeviation="blurIntensity" />
      </filter>
    </svg>

    <div
      id="intro-house-clone"
      class="intro-house__content"
      :style="contentStyle"
      v-html="clonedContent"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";

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
    default: () => [
      '.intro-list',
      '.house-toggle',
      'motion-ul',
      'ul',
      '.intro-square',
      '.intro-distortion'
    ]
  },
  showFilterPreview: {
    type: Boolean,
    default: false,
  },
  blurIntensity: {
    type: Number,
    default: 8,
  },
  realTimeUpdates: {
    type: Boolean,
    default: true,
  }
});

const houseRef = ref(null);
const clonedContent = ref("");
const filterId = `intro-house-filter-${Math.random().toString(36).slice(2, 8)}`;
let mutationObserver = null;

const contentStyle = computed(() => {
  if (!props.showFilterPreview) return {};

  return {
    filter: `url(#${filterId}) saturate(160%) contrast(120%)`,
  };
});

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

const setupMutationObserver = (element) => {
  if (mutationObserver) {
    mutationObserver.disconnect();
  }

  if (!element || !props.realTimeUpdates) return;

  mutationObserver = new MutationObserver(() => {
    cloneSourceElement();
  });

  mutationObserver.observe(element, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    characterData: true,
    characterDataOldValue: true
  });
};

onMounted(() => {
  cloneSourceElement();

  if (props.realTimeUpdates) {
    const sourceElement = document.querySelector(props.sourceSelector);
    setupMutationObserver(sourceElement);
  }
});

watch(() => props.sourceSelector, () => {
  cloneSourceElement();

  if (props.realTimeUpdates) {
    const sourceElement = document.querySelector(props.sourceSelector);
    setupMutationObserver(sourceElement);
  }
});

onBeforeUnmount(() => {
  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
  }
});

defineExpose({ houseRef, clonedContent, cloneSourceElement });
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
