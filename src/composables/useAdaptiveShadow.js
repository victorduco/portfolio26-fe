/**
 * Композабл для создания адаптивной тени на основе цвета фона
 *
 * @param {Object} options - Настройки тени
 * @param {number} options.saturationMultiplier - Множитель насыщенности (по умолчанию 1.5)
 * @param {number} options.lightnessMultiplier - Множитель яркости (по умолчанию 0.3)
 * @param {number} options.opacity - Прозрачность тени в процентах (по умолчанию 14)
 * @returns {Object} CSS переменные для тени
 */
export function useAdaptiveShadow(options = {}) {
  const {
    saturationMultiplier = 1.5,
    lightnessMultiplier = 0.3,
    opacity = 14,
  } = options;

  return {
    '--shadow-saturated': `hsl(from var(--bg-color, hsl(220deg 13% 18%)) h calc(s * ${saturationMultiplier}) calc(l * ${lightnessMultiplier}))`,
    '--shadow-opacity': `${opacity}%`,
  };
}

/**
 * Генерирует CSS строку для box-shadow с адаптивным цветом
 *
 * @param {string} shadowParams - Параметры box-shadow (например, "0px 3px 12px")
 * @returns {string} Полная CSS строка для box-shadow
 */
export function getAdaptiveShadowValue(shadowParams) {
  return `${shadowParams} color-mix(in srgb, var(--shadow-saturated) var(--shadow-opacity), transparent)`;
}
