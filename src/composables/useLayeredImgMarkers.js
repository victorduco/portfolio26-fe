import { ref, reactive, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { useMarkerAnimations } from './useMarkerAnimations';

/**
 * Composable для управления метками в LayeredImg с синхронизацией parallax
 * Изолирует всю логику меток от основного компонента
 */
export function useLayeredImgMarkers(options = {}) {
  const {
    markers = [],
    cards = [],
    layeredContainerRef = null,
    isMobile = ref(false),
    sliderCurrent = ref(0),
  } = options;

  // Refs для overlay каждой карточки
  const overlayRefs = reactive({
    left: null,
    center: null,
    right: null,
  });

  const mobileOverlayRef = ref(null);

  // Animation
  const { animateMarkersEntry } = useMarkerAnimations();
  const allMarkerRefs = ref([]);
  const animatedMarkersCount = ref(0);

  // Глобальный state для открытого маркера (shared между всеми overlay)
  const openMarkerKey = ref(null);

  /**
   * Получить метки для конкретной карточки
   */
  const getMarkersForCard = (position) => {
    return markers
      .filter(marker => marker.targetImage === position)
      .map((marker, index) => ({
        ...marker,
        id: marker.id || `${position}-marker-${index}`,
      }));
  };

  /**
   * Получить метки для текущего слайда (mobile)
   */
  const currentSlideMarkers = computed(() => {
    const positions = ['left', 'center', 'right'];
    const currentPosition = positions[sliderCurrent.value];
    return getMarkersForCard(currentPosition);
  });

  /**
   * Установить ref для overlay
   */
  const setOverlayRef = (el, position) => {
    if (el) {
      overlayRefs[position] = el;
    }
  };

  /**
   * Обработчик готовности меток (desktop)
   */
  const handleMarkersReady = (refs, position) => {
    // Собираем все refs от всех overlay в один массив для последовательной анимации
    allMarkerRefs.value.push(...refs.map(ref => ({ ref, position })));
    animatedMarkersCount.value++;

    // Определяем сколько overlay ожидается
    const hasMarkersLeft = markers.some(m => m.targetImage === 'left');
    const hasMarkersCenter = markers.some(m => m.targetImage === 'center');
    const hasMarkersRight = markers.some(m => m.targetImage === 'right');

    let expectedOverlays = 0;
    if (hasMarkersLeft) expectedOverlays++;
    if (hasMarkersCenter) expectedOverlays++;
    if (hasMarkersRight) expectedOverlays++;

    // Если все overlay готовы, запускаем анимацию
    if (animatedMarkersCount.value === expectedOverlays) {
      // Сортируем метки по исходному порядку из props.markers
      const sortedRefs = [];
      markers.forEach(marker => {
        const found = allMarkerRefs.value.find(r =>
          r.ref.$el?.querySelector(`[aria-label*="${marker.text}"]`)
        );
        if (found) sortedRefs.push(found.ref);
      });

      // Запускаем анимацию появления
      nextTick(() => {
        animateMarkersEntry(sortedRefs, layeredContainerRef.value, {
          
          
          
          
          useScrollTrigger: true,
        });
      });
    }
  };

  /**
   * Обработчик готовности меток (mobile)
   */
  const handleMobileMarkersReady = (refs) => {
    nextTick(() => {
      animateMarkersEntry(refs, layeredContainerRef.value, {
        
        
        
        
        useScrollTrigger: false,
      });
    });
  };

  /**
   * Синхронизация overlay с parallax движением карточек
   * НЕ НУЖНА - overlay теперь внутри card и автоматически движется вместе с ним!
   * Функция оставлена для совместимости с updateParallax()
   */
  const syncOverlaysWithParallax = () => {
    // No-op - overlay уже внутри card-inner и движется автоматически
  };

  /**
   * Проверить есть ли метки вообще
   */
  const hasMarkers = computed(() => {
    return Array.isArray(markers) && markers.length > 0;
  });

  /**
   * Получить метки для каждой карточки (для template)
   */
  const markersByCard = computed(() => ({
    left: getMarkersForCard('left'),
    center: getMarkersForCard('center'),
    right: getMarkersForCard('right'),
  }));

  return {
    // Refs
    overlayRefs,
    mobileOverlayRef,

    // Data
    hasMarkers,
    markersByCard,
    currentSlideMarkers,
    openMarkerKey, // Глобальный state для открытого маркера

    // Methods
    getMarkersForCard,
    setOverlayRef,
    handleMarkersReady,
    handleMobileMarkersReady,
    syncOverlaysWithParallax,
  };
}
