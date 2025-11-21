<template>
  <div :class="['media-container-wrapper', 'fullwidth', wrapperClass]">
    <!-- Media Label (если нужен) -->
    <MediaLabel
      v-if="label || sources.length > 0"
      :label="label"
      :sources="sources"
      :tag="labelTag"
    />

    <!-- Main container -->
    <div
      :class="[
        'media-container',
        'fullheight',
        containerClass,
        { 'with-background': backgroundColor !== 'transparent' },
      ]"
      :style="containerStyle"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import MediaLabel from "../elements/MediaLabel.vue";

const props = defineProps({
  // Тип медиа контейнера
  type: {
    type: String,
    default: "fullheight", // 'fullheight' | 'fullwidth'
    validator: (value) => ["fullheight", "fullwidth"].includes(value),
  },

  // Background настройки
  backgroundColor: {
    type: String,
    default: "transparent",
  },

  // Overflow behavior для background container
  overflow: {
    type: String,
    default: "hidden", // 'hidden' | 'visible'
    validator: (value) => ["hidden", "visible"].includes(value),
  },

  // Label props
  label: {
    type: String,
    default: "",
  },

  sources: {
    type: Array,
    default: () => [],
  },

  labelTag: {
    type: String,
    default: "h3",
  },

  // Кастомные классы
  wrapperClass: {
    type: String,
    default: "",
  },

  containerClass: {
    type: String,
    default: "",
  },
});

const containerStyle = computed(() => {
  const style = {
    overflow: props.overflow,
    backgroundColor: props.backgroundColor,
    height: "95vh",
    width: "98vw",
  };

  if (props.type === "fullwidth") {
    style.perspective = "1200px";
  }

  return style;
});
</script>

<style scoped>
/* Wrapper - содержит label и сам контейнер */
.media-container-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

/* Основной контейнер */
.media-container {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 0;
}

/* Фон с закругленными углами */
.media-container.with-background {
  border-radius: 12px;
}

/* Класс fullheight применяется всегда, height задается в JS */
.media-container.fullheight {
  /* height задается через inline styles */
}

/* Тип: fullwidth - для LayeredCards с полноэкранной шириной */
.media-container-wrapper.fullwidth {
  width: 100%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 48px;
  margin-bottom: 0;
  overflow: visible;
}

/* Mobile: Remove fixed height to allow content to take natural height */
@media (max-width: 767px) {
  .media-container.fullheight {
    height: auto !important;
    min-height: auto;
  }
}
</style>
