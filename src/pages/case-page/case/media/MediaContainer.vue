<template>
  <div :class="['media-container-wrapper', wrapperClass, { 'fullwidth': type === 'fullwidth' }]">
    <!-- Media Label (если нужен) -->
    <MediaLabel
      v-if="label || sources.length > 0"
      :label="label"
      :sources="sources"
      :tag="labelTag"
      :class="{ 'fullwidth-label': type === 'fullwidth' }"
    />

    <!-- Main container -->
    <div :class="['media-container', containerClass, { 'fullheight': type === 'fullheight' || type === 'fullwidth' }]" :style="containerStyle">
      <div
        v-if="hasBackground"
        class="background-container"
        :style="backgroundStyle"
      >
        <slot />
      </div>
      <slot v-else />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import MediaLabel from '../elements/MediaLabel.vue';

const props = defineProps({
  // Тип медиа контейнера
  type: {
    type: String,
    default: 'default', // 'default' | 'fullheight' | 'inline' | 'fullwidth'
    validator: (value) => ['default', 'fullheight', 'inline', 'fullwidth'].includes(value),
  },

  // Background настройки
  backgroundColor: {
    type: String,
    default: 'transparent',
  },

  // Нужен ли серый фон контейнер с border-radius
  hasBackground: {
    type: Boolean,
    default: true,
  },

  // Overflow behavior для background container
  overflow: {
    type: String,
    default: 'hidden', // 'hidden' | 'visible'
    validator: (value) => ['hidden', 'visible'].includes(value),
  },

  // Label props
  label: {
    type: String,
    default: '',
  },

  sources: {
    type: Array,
    default: () => [],
  },

  labelTag: {
    type: String,
    default: 'h3',
  },

  // Кастомные классы
  wrapperClass: {
    type: String,
    default: '',
  },

  containerClass: {
    type: String,
    default: '',
  },

  // Максимальная ширина контента (для centering)
  maxWidth: {
    type: String,
    default: '1200px',
  },
});

const containerStyle = computed(() => {
  const style = {};

  if (props.type === 'fullheight' || props.type === 'fullwidth') {
    style.height = '100vh';
    style.padding = '16px';
  }

  if (props.type === 'fullwidth') {
    style.perspective = '1200px';
  }

  return style;
});

const backgroundStyle = computed(() => {
  return {
    backgroundColor: props.backgroundColor,
    maxWidth: props.maxWidth,
    overflow: props.overflow,
  };
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
}

/* Background container - серый фон с закругленными углами */
.background-container {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Тип: fullheight - для видео, parallax, layered cards */
.media-container.fullheight {
  height: 100vh;
  padding: 16px;
}

/* Тип: fullwidth - для LayeredCards с полноэкранной шириной */
.media-container-wrapper.fullwidth {
  width: 100vw;
  position: relative;
  left: 50%;
  margin-left: -50vw;
  margin-top: 48px;
  margin-bottom: 0;
  overflow: visible;
}

/* Label для fullwidth компонентов */
.media-container-wrapper.fullwidth :deep(.fullwidth-label) {
  max-width: 1200px;
  margin: 0 auto -8px;
  padding: 0 16px;
}
</style>
