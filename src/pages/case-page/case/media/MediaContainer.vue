<template>
  <div :class="['media-container-wrapper', wrapperClass, { 'fullwidth': type === 'fullwidth' || type === 'fullheight' }]">
    <!-- Media Label (если нужен) -->
    <MediaLabel
      v-if="label || sources.length > 0"
      :label="label"
      :sources="sources"
      :tag="labelTag"
      :class="{ 'fullwidth-label': type === 'fullwidth' }"
    />

    <!-- Main container -->
    <div :class="['media-container', containerClass, { 'fullheight': type === 'fullheight' || type === 'fullwidth', 'with-background': backgroundColor !== 'transparent' }]" :style="containerStyle">
      <slot />
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
  const style = {
    overflow: props.overflow,
    backgroundColor: props.backgroundColor,
  };

  if (props.type === 'fullheight' || props.type === 'fullwidth') {
    style.height = '100vh';
    style.padding = '0 32px';
  } else {
    // Для остальных типов применяем maxWidth
    style.maxWidth = props.maxWidth;
  }

  if (props.type === 'fullwidth') {
    style.perspective = '1200px';
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
}

/* Фон с закругленными углами */
.media-container.with-background {
  border-radius: 12px;
}

/* Тип: fullheight - для видео, parallax, layered cards */
.media-container.fullheight {
  height: 100vh;
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
