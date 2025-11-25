import { ref, computed, watch, nextTick } from 'vue';
import { useMarkerAnimations } from './useMarkerAnimations';

/**
 * Composable для управления метками в TabbedImg
 * Изолирует всю логику меток от основного компонента
 */
export function useTabbedImgMarkers(options = {}) {
  const {
    tabs = [],
    activeTab = ref(0),
    imgWrapperRef = null,
  } = options;

  // Animation
  const { animateMarkersEntry } = useMarkerAnimations();
  const markerRefsMap = ref({});
  const animatedTabs = ref(new Set());

  /**
   * Получить метки для конкретного таба
   */
  const getMarkersForTab = (tabIndex) => {
    const tab = tabs[tabIndex];
    return tab?.markers || [];
  };

  /**
   * Проверить есть ли метки в табах
   */
  const hasMarkers = computed(() => {
    return tabs.some(tab => tab.markers && tab.markers.length > 0);
  });

  /**
   * Обработчик готовности меток
   */
  const handleMarkersReady = (refs, tabIndex) => {
    markerRefsMap.value[tabIndex] = refs;

    // Анимировать метки если это активный таб и они еще не анимированы
    if (activeTab.value === tabIndex && !animatedTabs.value.has(tabIndex)) {
      animateTabMarkers(tabIndex);
    }
  };

  /**
   * Анимировать метки конкретного таба
   */
  const animateTabMarkers = (tabIndex) => {
    const refs = markerRefsMap.value[tabIndex];
    if (!refs || refs.length === 0) return;

    nextTick(() => {
      animateMarkersEntry(refs, imgWrapperRef.value, {
        
        
        
        
        // Для первого таба используем ScrollTrigger, для остальных - сразу показываем
        useScrollTrigger: tabIndex === 0,
      });

      animatedTabs.value.add(tabIndex);
    });
  };

  /**
   * Watch tab changes to animate markers
   */
  watch(activeTab, (newTab, oldTab) => {
    if (newTab !== oldTab && !animatedTabs.value.has(newTab)) {
      // Небольшая задержка чтобы дождаться перехода изображения
      setTimeout(() => {
        animateTabMarkers(newTab);
      }, 100);
    }
  });

  /**
   * Анимировать первый таб при загрузке
   */
  watch(
    () => markerRefsMap.value[0],
    (refs) => {
      if (refs && refs.length > 0 && !animatedTabs.value.has(0)) {
        animateTabMarkers(0);
      }
    },
    { immediate: true }
  );

  return {
    hasMarkers,
    getMarkersForTab,
    handleMarkersReady,
  };
}
