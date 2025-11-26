import { onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useMarkerAnimations() {
  const timelines = [];
  const scrollTriggers = [];

  /**
   * Анимация появления меток с последовательной задержкой
   * @param {Array} markerRefs - Массив refs компонентов ImageMarker
   * @param {Object} triggerElement - Элемент триггера для ScrollTrigger
   * @param {Object} options - Опции анимации
   */
  const animateMarkersEntry = (markerRefs, triggerElement, options = {}) => {
    const {
      stagger = 0.5,
      duration = 0.3,
      ease = "back.out(2.5)",
      startDelay = 0.5,
      useScrollTrigger = true,
    } = options;

    if (!markerRefs || markerRefs.length === 0) {
      console.warn("[Markers Animation] No marker refs!");
      return;
    }

    // Создаем timeline для анимации
    const tl = gsap.timeline({
      paused: useScrollTrigger, // Если используем ScrollTrigger - ставим на паузу
    });

    markerRefs.forEach((markerRef, index) => {
      if (!markerRef || !markerRef.$el) {
        console.warn(`[Markers Animation] Marker ${index} has no $el`);
        return;
      }

      const markerEl = markerRef.$el;
      const buttonEl = markerEl.querySelector(".marker-button");
      const ringEl = markerEl.querySelector(".marker-ring");

      if (!buttonEl) {
        console.warn(`[Markers Animation] Marker ${index} has no button!`);
        return;
      }

      // Начальное состояние
      gsap.set(buttonEl, {
        scale: 0,
        opacity: 0,
        rotation: 0,
      });

      if (ringEl) {
        gsap.set(ringEl, {
          scale: 1,
          opacity: 0,
        });
      }

      // Анимация кнопки
      tl.to(
        buttonEl,
        {
          scale: 1,
          opacity: 1,
          rotation: 45,
          duration,
          ease,
        },
        startDelay + index * stagger
      );
    });

    timelines.push(tl);

    // Настроить ScrollTrigger если нужно
    if (useScrollTrigger && triggerElement) {
      // Получить реальный элемент (если передан ref)
      const element = triggerElement.value || triggerElement;

      if (element) {
        // Обновить ScrollTrigger после загрузки изображений
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);

        const st = ScrollTrigger.create({
          trigger: element,
          start: "top 50%", // Верх элемента на середине экрана (50% от верха viewport)
          end: "bottom top", // Низ элемента на верху экрана (0% viewport)
          once: true,
          markers: false, // Визуальные маркеры для отладки отключены
          invalidateOnRefresh: true, // ✅ Пересчитывать при изменении
          refreshPriority: -1, // ✅ Обновлять после изображений
          onEnter: () => {
            tl.play();
          },
        });

        scrollTriggers.push(st);
      } else {
        console.error(
          "[Markers Animation] ❌ No valid element for ScrollTrigger!"
        );
      }
    } else if (!useScrollTrigger) {
      // Запустить сразу
      tl.play();
    } else {
      console.warn(
        "[Markers Animation] ScrollTrigger enabled but no trigger element provided!"
      );
    }

    return tl;
  };

  /**
   * Анимация раскрытия всплывающего сообщения
   * @param {HTMLElement} buttonEl - Элемент кнопки
   * @param {HTMLElement} popupEl - Элемент popup
   */
  const animatePopupOpen = (buttonEl, popupEl) => {
    if (!buttonEl || !popupEl) return null;

    const tl = gsap.timeline();

    // Скрыть кнопку
    tl.to(buttonEl, {
      scale: 0,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    });

    // Начальное состояние popup
    gsap.set(popupEl, {
      scale: 0,
      opacity: 0,
    });

    // Раскрыть popup из центра
    tl.to(
      popupEl,
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
      },
      0.1
    );

    // Fade in содержимого
    const content = popupEl.querySelector(".marker-popup-content");
    if (content) {
      gsap.set(content, { opacity: 0 });
      tl.to(
        content,
        {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        },
        0.3
      );
    }

    timelines.push(tl);
    return tl;
  };

  /**
   * Анимация закрытия всплывающего сообщения
   * @param {HTMLElement} buttonEl - Элемент кнопки
   * @param {HTMLElement} popupEl - Элемент popup
   */
  const animatePopupClose = (buttonEl, popupEl) => {
    if (!buttonEl || !popupEl) return null;

    const tl = gsap.timeline();

    // Скрыть popup
    tl.to(popupEl, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    });

    // Показать кнопку
    tl.to(
      buttonEl,
      {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "back.out(1.7)",
      },
      0.1
    );

    timelines.push(tl);
    return tl;
  };

  /**
   * Continuous ring pulse animation
   * @param {HTMLElement} ringEl - Ring element
   */
  const animateRingPulse = (ringEl) => {
    if (!ringEl) return null;

    const tl = gsap.timeline({ repeat: -1 });

    tl.to(ringEl, {
      scale: 1.3,
      opacity: 0.6,
      duration: 1.5,
      ease: "sine.inOut",
    });

    tl.to(ringEl, {
      scale: 1.6,
      opacity: 0,
      duration: 1.5,
      ease: "sine.inOut",
    });

    timelines.push(tl);
    return tl;
  };

  /**
   * Cleanup all animations
   */
  const cleanup = () => {
    timelines.forEach((tl) => {
      if (tl) tl.kill();
    });

    scrollTriggers.forEach((st) => {
      if (st) st.kill();
    });

    timelines.length = 0;
    scrollTriggers.length = 0;
  };

  // Auto cleanup on unmount
  onUnmounted(() => {
    cleanup();
  });

  return {
    animateMarkersEntry,
    animatePopupOpen,
    animatePopupClose,
    animateRingPulse,
    cleanup,
  };
}
