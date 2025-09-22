<template>
  <div
    class="intro-distortion"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
    @pointermove="handlePointerMove"
  >
    <svg class="intro-distortion__filters" aria-hidden="true">
      <filter :id="filterId" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur :stdDeviation="blurIntensity" />
      </filter>
    </svg>

    <div
      v-if="enabled"
      class="intro-distortion__window"
      :class="{
        'intro-distortion__window--active': isPointerActive,
      }"
      :style="glassStyle"
      aria-hidden="true"
    >
      <div
        class="intro-distortion__content"
        :style="cloneStyle"
        v-html="clonedContent"
      ></div>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";

const props = defineProps({
  sourceElementId: {
    type: String,
    required: true,
  },
  glassSize: {
    type: Number,
    default: 150,
  },
  blurIntensity: {
    type: Number,
    default: 8,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

const filterId = `intro-distortion-${Math.random().toString(36).slice(2, 8)}`;

const isPointerActive = ref(false);
const clonedContent = ref("");

const pointer = reactive({ x: 0, y: 0 });
const cloneMetrics = reactive({
  glassX: 0,
  glassY: 0,
  offsetX: 0,
  offsetY: 0,
  width: 0,
  height: 0,
});

let rafId = 0;
let mutationObserver = null;

const sourceElement = computed(() => document.getElementById(props.sourceElementId));

const scheduleUpdate = () => {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    const half = props.glassSize / 2;
    const glassX = pointer.x - half;
    const glassY = pointer.y - half;

    const rect = sourceElement.value?.getBoundingClientRect?.();
    let offsetX = 0;
    let offsetY = 0;
    let width = cloneMetrics.width;
    let height = cloneMetrics.height;

    if (rect) {
      offsetX = glassX - rect.left;
      offsetY = glassY - rect.top;
      width = rect.width;
      height = rect.height;
    }

    cloneMetrics.glassX = glassX;
    cloneMetrics.glassY = glassY;
    cloneMetrics.offsetX = offsetX;
    cloneMetrics.offsetY = offsetY;
    cloneMetrics.width = width;
    cloneMetrics.height = height;
  });
};

const handlePointerMove = (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  if (!isPointerActive.value) {
    isPointerActive.value = true;
  }
  scheduleUpdate();
};

const handlePointerEnter = (event) => {
  isPointerActive.value = true;
  pointer.x = event.clientX ?? pointer.x;
  pointer.y = event.clientY ?? pointer.y;
  scheduleUpdate();
};

const handlePointerLeave = () => {
  isPointerActive.value = false;
};

const handleScroll = () => {
  if (!isPointerActive.value) return;
  scheduleUpdate();
};

const handleResize = () => {
  if (!isPointerActive.value) {
    pointer.x = window.innerWidth / 2;
    pointer.y = window.innerHeight / 2;
  }
  scheduleUpdate();
};

const updateClonedContent = () => {
  const element = sourceElement.value;
  if (!element) return;

  clonedContent.value = element.outerHTML;
};

const glassStyle = computed(() => ({
  width: `${props.glassSize}px`,
  height: `${props.glassSize}px`,
  transform: `translate3d(${cloneMetrics.glassX}px, ${cloneMetrics.glassY}px, 0) rotate(45deg)`,
  opacity: isPointerActive.value ? 1 : 0,
  transformOrigin: "0 0",
}));

const cloneStyle = computed(() => {
  const filterValue = props.enabled
    ? `url(#${filterId}) saturate(160%) contrast(120%)`
    : "none";

  const styles = {
    transform: `rotate(-45deg) translate3d(${-cloneMetrics.offsetX}px, ${-cloneMetrics.offsetY}px, 0)`,
    transformOrigin: "0 0",
    filter: filterValue,
  };

  if (cloneMetrics.width) {
    styles.width = `${cloneMetrics.width}px`;
  }
  if (cloneMetrics.height) {
    styles.minHeight = `${cloneMetrics.height}px`;
  }

  return styles;
});

const setupMutationObserver = (element) => {
  if (mutationObserver) {
    mutationObserver.disconnect();
  }

  if (!element) return;

  mutationObserver = new MutationObserver(() => {
    updateClonedContent();
    scheduleUpdate();
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

watch(sourceElement, (element) => {
  if (!element) return;

  setTimeout(() => {
    updateClonedContent();
    scheduleUpdate();
    setupMutationObserver(element);
  }, 50);
}, { immediate: true });

onMounted(() => {
  pointer.x = window.innerWidth / 2;
  pointer.y = window.innerHeight / 2;
  nextTick(() => {
    setTimeout(() => {
      updateClonedContent();
      scheduleUpdate();
    }, 100);
  });
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
  }
});
</script>

<style scoped>
.intro-distortion {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: auto;
  z-index: 5;
}

.intro-distortion__filters {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.intro-distortion__window {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(15, 15, 25, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: #171717;
  transition: opacity 0.18s ease;
  will-change: transform;
  mix-blend-mode: normal;
  opacity: 0;
  z-index: 10;
}

.intro-distortion__window--active {
  opacity: 1;
}

.intro-distortion__content {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  pointer-events: none;
  will-change: transform;
}

.intro-distortion__content * {
  pointer-events: none !important;
  user-select: none !important;
}
</style>
