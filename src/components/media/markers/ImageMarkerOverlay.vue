<template>
  <div
    ref="overlayRef"
    class="image-marker-overlay"
    :style="overlayStyle"
    @click="handleOverlayClick"
  >
    <ImageMarker
      v-for="(marker, index) in markers"
      :key="marker.id"
      :ref="el => setMarkerRef(el, index)"
      :position="marker.position"
      :text="marker.text"
      :button-color="marker.buttonColor || defaultButtonColor"
      :icon-color="marker.iconColor || defaultIconColor"
      :icon-type="marker.iconType || defaultIconType"
      :index="index"
      :is-open="openMarkerIndex === index"
      @open="handleMarkerOpen"
      @close="handleMarkerClose"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import ImageMarker from './ImageMarker.vue';

const props = defineProps({
  markers: {
    type: Array,
    default: () => []
  },
  defaultButtonColor: {
    type: String,
    default: '#4A90E2'
  },
  defaultIconColor: {
    type: String,
    default: '#ffffff'
  },
  defaultIconType: {
    type: String,
    default: 'plus',
    validator: (val) => ['plus', 'rocket', 'anchor'].includes(val)
  },
  syncTransform: {
    type: String,
    default: ''
  },
  visible: {
    type: Boolean,
    default: true
  },
  closeScope: {
    type: Object, // Ref элемента для scope закрытия
    default: null
  },
  sharedOpenMarker: {
    type: String, // Глобальный ключ открытого маркера (для синхронизации между overlay)
    default: null
  }
});

const emit = defineEmits(['markers-ready', 'marker-opened', 'marker-closed']);

const overlayRef = ref(null);
const markerRefs = ref([]);
const openMarkerIndex = ref(null);

// Генерируем уникальный ID для этого overlay
const overlayId = ref(`overlay-${Math.random().toString(36).substr(2, 9)}`);

const overlayStyle = computed(() => {
  const styles = {
    pointerEvents: props.visible ? 'all' : 'none',
    opacity: props.visible ? 1 : 0,
  };

  // Синхронизация трансформации с родительским элементом (для parallax)
  if (props.syncTransform) {
    styles.transform = props.syncTransform;
  }

  return styles;
});

const setMarkerRef = (el, index) => {
  if (el) {
    markerRefs.value[index] = el;
  }
};

const handleMarkerOpen = (index) => {
  openMarkerIndex.value = index;
  // Уведомляем родителя для синхронизации с другими overlay
  const markerKey = `${overlayId.value}-${index}`;
  emit('marker-opened', markerKey);
};

const handleMarkerClose = () => {
  openMarkerIndex.value = null;
  emit('marker-closed');
};

// Watch sharedOpenMarker чтобы закрывать свои маркеры когда открывается маркер в другом overlay
watch(() => props.sharedOpenMarker, (newKey) => {
  if (!newKey) return;

  // Если открыт маркер из другого overlay - закрыть свои
  const currentKey = openMarkerIndex.value !== null ? `${overlayId.value}-${openMarkerIndex.value}` : null;
  if (currentKey && currentKey !== newKey) {
    openMarkerIndex.value = null;
  }
});

const handleOverlayClick = (event) => {
  // Закрыть открытую метку при клике вне меток
  if (event.target === overlayRef.value) {
    openMarkerIndex.value = null;
  }
};

// Закрытие при клике вне overlay
const handleDocumentClick = (event) => {
  if (openMarkerIndex.value === null) return;
  if (!overlayRef.value) return;

  // Если есть closeScope, проверяем клик внутри scope но вне overlay
  if (props.closeScope && props.closeScope.value) {
    const scopeEl = props.closeScope.value;
    const clickedInScope = scopeEl.contains(event.target);
    const clickedInOverlay = overlayRef.value.contains(event.target);

    if (clickedInScope && !clickedInOverlay) {
      openMarkerIndex.value = null;
    }
  } else {
    // Стандартное поведение - закрыть если клик вне overlay
    if (!overlayRef.value.contains(event.target)) {
      openMarkerIndex.value = null;
    }
  }
};

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);

  // Сообщить родителю что метки готовы для анимации
  nextTick(() => {
    emit('markers-ready', markerRefs.value);
  });
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
});

// Экспортировать методы для внешнего управления
defineExpose({
  markerRefs,
  closeAllMarkers: () => {
    openMarkerIndex.value = null;
  }
});
</script>

<style scoped>
.image-marker-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  transition: opacity 0.3s ease;
  will-change: transform;
}

/* На мобильных устройствах можно скрыть оверлей если нужно */
@media (max-width: 767px) {
  .image-marker-overlay {
    /* Можно добавить специфичные стили для мобильных */
  }
}
</style>
