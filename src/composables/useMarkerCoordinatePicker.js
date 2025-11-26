import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Composable для визуального выбора координат маркеров на изображении
 * Показывает координаты в процентах при клике на изображение
 *
 * @param {Object} options - Опции
 * @param {Boolean} options.enabled - Включить/выключить режим выбора координат
 * @returns {Object} - API для работы с выбором координат
 */
export function useMarkerCoordinatePicker(options = {}) {
  const { enabled = false } = options;

  const isActive = ref(enabled);
  const lastCoordinate = ref(null);
  const overlayElement = ref(null);

  /**
   * Создать оверлей для отображения координат
   */
  const createOverlay = () => {
    if (overlayElement.value) return;

    const overlay = document.createElement('div');
    overlay.id = 'marker-coordinate-picker-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.85);
      color: #00ff00;
      padding: 16px 20px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      z-index: 999999;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      border: 2px solid #00ff00;
      min-width: 300px;
    `;
    overlay.innerHTML = `
      <div style="margin-bottom: 8px; font-weight: bold; color: #00ff00;">📍 Marker Coordinate Picker</div>
      <div style="color: #888; font-size: 12px; margin-bottom: 8px;">Click on any image to get coordinates</div>
      <div id="coordinate-display" style="color: #fff; font-size: 13px;">
        Waiting for click...
      </div>
    `;

    document.body.appendChild(overlay);
    overlayElement.value = overlay;
  };

  /**
   * Удалить оверлей
   */
  const removeOverlay = () => {
    if (overlayElement.value) {
      overlayElement.value.remove();
      overlayElement.value = null;
    }
  };

  /**
   * Обновить отображение координат
   */
  const updateDisplay = (x, y, imageId) => {
    const display = document.getElementById('coordinate-display');
    if (display) {
      display.innerHTML = `
        <div style="margin-bottom: 4px;">
          <span style="color: #00ff00;">Image:</span> <span style="color: #fff; font-size: 11px;">${imageId}</span>
        </div>
        <div style="margin-bottom: 4px;">
          <span style="color: #00ff00;">x:</span> <span style="color: #fff; font-weight: bold;">${x}%</span>
        </div>
        <div style="margin-bottom: 8px;">
          <span style="color: #00ff00;">y:</span> <span style="color: #fff; font-weight: bold;">${y}%</span>
        </div>
        <div style="color: #888; font-size: 11px; border-top: 1px solid #333; padding-top: 8px;">
          Copied to clipboard:
        </div>
        <div style="color: #00ccff; margin-top: 4px; word-break: break-all; font-size: 11px;">
          { position: { x: ${x}, y: ${y} } }
        </div>
      `;
    }
  };

  /**
   * Создать визуальный маркер на месте клика
   */
  const createVisualMarker = (x, y, element) => {
    const marker = document.createElement('div');
    marker.className = 'temp-coordinate-marker';
    marker.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      background: #00ff00;
      border: 2px solid #fff;
      border-radius: 50%;
      z-index: 99999;
      pointer-events: none;
      animation: pulse 1s ease-in-out infinite;
      box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7);
    `;

    // Добавить CSS анимацию если её нет
    if (!document.getElementById('coordinate-picker-styles')) {
      const style = document.createElement('style');
      style.id = 'coordinate-picker-styles';
      style.textContent = `
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(0, 255, 0, 0);
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Найти ближайший position:relative родитель или использовать сам элемент
    let container = element;
    while (container && window.getComputedStyle(container).position === 'static') {
      container = container.parentElement;
    }

    if (container) {
      container.style.position = 'relative';
      container.appendChild(marker);

      // Удалить маркер через 3 секунды
      setTimeout(() => marker.remove(), 3000);
    }
  };

  /**
   * Обработчик клика по изображению
   */
  const handleImageClick = (event) => {
    if (!isActive.value) return;

    // Найти изображение в цепочке событий
    let target = event.target;
    let imgElement = null;

    // Если клик по изображению напрямую
    if (target.tagName === 'IMG') {
      imgElement = target;
    } else {
      // Попытаться найти изображение в родителях или рядом
      const container = target.closest('.fullscreen-image__img-wrapper, .card-inner, .slide-inner');
      if (container) {
        imgElement = container.querySelector('img');
      }
    }

    if (!imgElement) return;

    // ВАЖНО: Предотвратить всплытие и действие по умолчанию с высшим приоритетом
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();

    // Получить размеры и позицию изображения
    const rect = imgElement.getBoundingClientRect();

    // Вычислить координаты клика относительно изображения
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Преобразовать в проценты с точностью до сотых
    const percentX = parseFloat(((clickX / rect.width) * 100).toFixed(2));
    const percentY = parseFloat(((clickY / rect.height) * 100).toFixed(2));

    // Получить ID картинки (src или alt или сгенерировать)
    const imgSrc = imgElement.getAttribute('src') || '';
    const imgAlt = imgElement.getAttribute('alt') || '';
    const imgId = imgSrc.split('/').pop() || imgAlt || `image-${Date.now()}`;

    // Сохранить координаты с ID
    lastCoordinate.value = { x: percentX, y: percentY, imageId: imgId };

    // Обновить дисплей
    updateDisplay(percentX, percentY, imgId);

    // Создать визуальный маркер
    createVisualMarker(percentX, percentY, imgElement.parentElement);

    // Скопировать в буфер обмена
    const clipboardText = `Image: ${imgId}\n{ position: { x: ${percentX}, y: ${percentY} } }`;

    navigator.clipboard.writeText(clipboardText).catch(err => {
      console.warn('Failed to copy to clipboard:', err);
    });

    // Показать уведомление
    showNotification(percentX, percentY, imgId);
  };

  /**
   * Показать временное уведомление
   */
  const showNotification = (x, y, imageId) => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #00ff00;
      color: #000;
      padding: 12px 20px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      font-weight: bold;
      z-index: 999999;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0, 255, 0, 0.5);
      max-width: 400px;
    `;
    notification.innerHTML = `
      <div style="margin-bottom: 4px; font-size: 11px; opacity: 0.8;">${imageId}</div>
      <div>✓ Copied: x:${x}%, y:${y}%</div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  };

  /**
   * Включить режим выбора координат
   */
  const enable = () => {
    isActive.value = true;
    createOverlay();

    // Добавить стиль для отключения pointer-events у маркеров
    const styleId = 'marker-picker-override-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* Отключить pointer-events у всех маркеров когда picker активен */
        .image-marker,
        .marker-button,
        .marker-popup,
        .card-marker-overlay,
        .mobile-marker-overlay,
        .tab-marker-overlay,
        .image-marker-overlay {
          pointer-events: none !important;
        }
        /* Сделать изображения кликабельными */
        .tab-img,
        .tab-img-state1,
        .tab-img-state2 {
          pointer-events: auto !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Использовать capture phase с максимальным приоритетом
    document.addEventListener('click', handleImageClick, { capture: true });
  };

  /**
   * Выключить режим выбора координат
   */
  const disable = () => {
    isActive.value = false;
    removeOverlay();
    document.removeEventListener('click', handleImageClick, { capture: true });

    // Удалить override стили
    const overrideStyles = document.getElementById('marker-picker-override-styles');
    if (overrideStyles) overrideStyles.remove();

    // Удалить временные маркеры
    document.querySelectorAll('.temp-coordinate-marker').forEach(m => m.remove());
  };

  /**
   * Переключить режим
   */
  const toggle = () => {
    if (isActive.value) {
      disable();
    } else {
      enable();
    }
  };

  // Auto enable если enabled = true
  onMounted(() => {
    if (enabled) {
      enable();
    }
  });

  // Cleanup при unmount
  onUnmounted(() => {
    if (isActive.value) {
      disable();
    }

    // Удалить стили
    const styles = document.getElementById('coordinate-picker-styles');
    if (styles) styles.remove();
  });

  return {
    isActive,
    lastCoordinate,
    enable,
    disable,
    toggle,
  };
}

// Export for use in code only (no global console functions)
