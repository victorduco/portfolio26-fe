import { ref, computed, watch, nextTick } from 'vue';
import { useMarkerAnimations } from './useMarkerAnimations';

/**
 * Composable для управления состоянием и анимациями меток на изображениях
 * @param {Object} options - Опции
 * @returns {Object} - API для работы с метками
 */
export function useImageMarkers(options = {}) {
  const {
    markers = [],
    containerRef = null,
    triggerElement = null,
    enableScrollTrigger = true,
  } = options;

  const overlayRef = ref(null);
  const markerRefs = ref([]);
  const isAnimated = ref(false);

  const {
    animateMarkersEntry,
    animatePopupOpen,
    animatePopupClose,
    cleanup: cleanupAnimations,
  } = useMarkerAnimations();

  /**
   * Инициализация анимации появления меток
   */
  const initializeMarkerAnimations = (refs, trigger) => {
    if (isAnimated.value) return;

    nextTick(() => {
      animateMarkersEntry(refs, trigger || triggerElement, {
        
        
        
        
        useScrollTrigger: enableScrollTrigger,
      });

      isAnimated.value = true;
    });
  };

  /**
   * Обработчик готовности меток
   */
  const handleMarkersReady = (refs) => {
    markerRefs.value = refs;
    initializeMarkerAnimations(refs, triggerElement);
  };

  /**
   * Получить стиль трансформации для синхронизации с параллаксом
   * @param {HTMLElement} element - Элемент для отслеживания
   * @returns {String} - CSS transform строка
   */
  const getElementTransform = (element) => {
    if (!element) return '';

    const transform = window.getComputedStyle(element).transform;
    if (transform === 'none') return '';

    return transform;
  };

  /**
   * Синхронизация позиции оверлея с трансформацией элемента
   * Используется для LayeredImg с параллаксом
   */
  const syncOverlayTransform = (sourceElement) => {
    if (!overlayRef.value || !sourceElement) return;

    const updateTransform = () => {
      const transform = getElementTransform(sourceElement);
      if (overlayRef.value && overlayRef.value.$el) {
        overlayRef.value.$el.style.transform = transform;
      }
    };

    // Обновляем в каждом кадре для плавного параллакса
    let rafId = null;
    const animate = () => {
      updateTransform();
      rafId = requestAnimationFrame(animate);
    };

    animate();

    // Возвращаем функцию для остановки синхронизации
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  };

  /**
   * Валидация данных меток
   */
  const validateMarkers = (markersList) => {
    if (!Array.isArray(markersList)) {
      console.warn('useImageMarkers: markers должен быть массивом');
      return [];
    }

    return markersList.filter(marker => {
      if (!marker.position || typeof marker.position.x !== 'number' || typeof marker.position.y !== 'number') {
        console.warn('useImageMarkers: некорректная позиция метки', marker);
        return false;
      }

      if (!marker.text || typeof marker.text !== 'string') {
        console.warn('useImageMarkers: метка должна содержать текст', marker);
        return false;
      }

      return true;
    });
  };

  /**
   * Нормализация позиции метки
   * Убедиться что метка видна даже если позиция на краю или за пределами
   */
  const normalizeMarkerPosition = (position) => {
    const { x, y } = position;
    const margin = 5; // 5% отступ от края

    return {
      x: Math.max(margin, Math.min(100 - margin, x)),
      y: Math.max(margin, Math.min(100 - margin, y)),
    };
  };

  /**
   * Подготовка меток с нормализацией позиций
   */
  const preparedMarkers = computed(() => {
    const validated = validateMarkers(markers);

    return validated.map((marker, index) => ({
      ...marker,
      id: marker.id || `marker-${index}`,
      position: normalizeMarkerPosition(marker.position),
    }));
  });

  /**
   * Cleanup
   */
  const cleanup = () => {
    cleanupAnimations();
    markerRefs.value = [];
    isAnimated.value = false;
  };

  return {
    overlayRef,
    markerRefs,
    preparedMarkers,
    handleMarkersReady,
    syncOverlayTransform,
    getElementTransform,
    initializeMarkerAnimations,
    cleanup,
  };
}
