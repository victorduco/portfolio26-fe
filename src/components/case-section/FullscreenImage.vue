<template>
  <div class="fullscreen-image-wrapper">
    <div v-if="imageLabel || sources.length > 0" class="image-label-wrapper">
      <h3 v-if="imageLabel" class="image-label">
        {{ imageLabel }}
        <span v-if="sources.length > 0" class="image-sources-inline">
          ({{ sources.length > 1 ? 'Sources' : 'Source' }}:
          <template v-for="(source, index) in sources" :key="index">
            <a :href="source.url" target="_blank" rel="noopener noreferrer" class="source-link">{{ source.name }}</a><template v-if="index < sources.length - 1">, </template>
          </template>)
        </span>
      </h3>
      <div v-else-if="sources.length > 0" class="image-sources">
        {{ sources.length > 1 ? 'Sources' : 'Source' }}:
        <template v-for="(source, index) in sources" :key="index">
          <a :href="source.url" target="_blank" rel="noopener noreferrer" class="source-link">{{ source.name }}</a><template v-if="index < sources.length - 1">, </template>
        </template>
      </div>
    </div>
    <div class="fullscreen-image" :style="{ backgroundColor: backgroundColor }">
      <div
        class="fullscreen-image__container"
        @mousemove="handleMouseMove"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        ref="containerRef"
      >
        <img
          :src="imageSrc"
          :alt="alt"
          class="fullscreen-image__img"
          loading="lazy"
          ref="imageRef"
        />
        <div
          v-if="enableMagnifier && showMagnifier"
          class="magnifier"
          :style="magnifierStyle"
        >
          <div
            class="magnifier__image"
            :style="magnifierImageStyle"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  imageSrc: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: 'Case image',
  },
  backgroundColor: {
    type: String,
    default: 'transparent',
  },
  enableMagnifier: {
    type: Boolean,
    default: false,
  },
  magnifierSize: {
    type: Number,
    default: 250,
  },
  zoomLevel: {
    type: Number,
    default: 2.5,
  },
  imageLabel: {
    type: String,
    default: '',
  },
  sources: {
    type: Array,
    default: () => [],
    validator: (value) => {
      return value.every(source =>
        typeof source === 'object' &&
        'name' in source &&
        'url' in source
      );
    },
  },
});

const containerRef = ref(null);
const imageRef = ref(null);
const showMagnifier = ref(false);
const mouseX = ref(0);
const mouseY = ref(0);
const imgRect = ref(null);

const handleMouseEnter = () => {
  if (!props.enableMagnifier) return;
  showMagnifier.value = true;
  if (imageRef.value) {
    imgRect.value = imageRef.value.getBoundingClientRect();
  }
};

const handleMouseLeave = () => {
  showMagnifier.value = false;
};

const handleMouseMove = (e) => {
  if (!props.enableMagnifier || !imgRect.value) return;

  const rect = imgRect.value;
  mouseX.value = e.clientX - rect.left;
  mouseY.value = e.clientY - rect.top;
};

const magnifierStyle = computed(() => {
  const size = props.magnifierSize;
  const halfSize = size / 2;

  return {
    left: `${mouseX.value - halfSize}px`,
    top: `${mouseY.value - halfSize}px`,
    width: `${size}px`,
    height: `${size}px`,
  };
});

const magnifierImageStyle = computed(() => {
  if (!imgRect.value) return {};

  const size = props.magnifierSize;
  const zoom = props.zoomLevel;

  // Calculate actual image dimensions based on object-fit: contain
  const imgElement = imageRef.value;
  if (!imgElement) return {};

  const imgNaturalWidth = imgElement.naturalWidth;
  const imgNaturalHeight = imgElement.naturalHeight;
  const containerWidth = imgRect.value.width;
  const containerHeight = imgRect.value.height;

  // Calculate actual rendered size with object-fit: contain
  const containerRatio = containerWidth / containerHeight;
  const imageRatio = imgNaturalWidth / imgNaturalHeight;

  let renderedWidth, renderedHeight, offsetX, offsetY;
  if (imageRatio > containerRatio) {
    // Image is wider - width fills container
    renderedWidth = containerWidth;
    renderedHeight = containerWidth / imageRatio;
    offsetX = 0;
    offsetY = (containerHeight - renderedHeight) / 2;
  } else {
    // Image is taller - height fills container
    renderedHeight = containerHeight;
    renderedWidth = containerHeight * imageRatio;
    offsetX = (containerWidth - renderedWidth) / 2;
    offsetY = 0;
  }

  // Adjust mouse position to account for image offset
  const adjustedMouseX = mouseX.value - offsetX;
  const adjustedMouseY = mouseY.value - offsetY;

  return {
    backgroundColor: props.backgroundColor,
    backgroundImage: `url(${props.imageSrc})`,
    backgroundSize: `${renderedWidth * zoom}px ${renderedHeight * zoom}px`,
    backgroundPosition: `-${adjustedMouseX * zoom - size / 2}px -${adjustedMouseY * zoom - size / 2}px`,
  };
});
</script>

<style scoped>
.fullscreen-image-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
}

.image-label-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 0 -8px 0;
  padding: 0;
}

.image-label {
  margin: 0;
  padding: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  line-height: 1.2;
  color: inherit;
  opacity: 0.5;
}

.image-sources {
  margin: 0;
  padding: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  line-height: 1.2;
  color: inherit;
  opacity: 0.5;
}

.image-sources-inline {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  line-height: 1.2;
  color: inherit;
  opacity: 1;
}

.source-link {
  color: inherit;
  text-decoration: underline;
  transition: opacity 0.2s ease;
}

.source-link:hover {
  opacity: 0.7;
}

.fullscreen-image {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.fullscreen-image__container {
  width: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-image__img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  cursor: none;
  margin: auto;
}

.fullscreen-image__container:not(:hover) .fullscreen-image__img {
  cursor: default;
}

.magnifier {
  position: absolute;
  border: 3px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  pointer-events: none;
  z-index: 10;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(0px);
  overflow: hidden;
  transition: opacity 0.15s ease;
}

.magnifier__image {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  border-radius: 50%;
}

/* Hide magnifier when magnifier is not enabled */
.fullscreen-image__container:not(:hover) .magnifier {
  opacity: 0;
}
</style>
