/**
 * Creates liquid style object for the glass effect
 * @param {Object} backgroundImageUrl - Computed background image URL
 * @param {Object} sourceElementId - Computed source element ID for DOM cloning
 * @param {Object} glassElementRef - Ref to the glass element
 * @param {Object} glassSize - Reactive glass size object
 * @param {string} filterId - Filter ID for SVG filter
 * @returns {Object} Liquid style properties
 */
export function createLiquidStyle(
  backgroundImageUrl,
  sourceElementId,
  glassElementRef,
  glassSize,
  filterId,
  intensity = 1
) {
  // Если есть sourceElementId, используем DOM источник, иначе PNG
  if (sourceElementId.value && glassElementRef.value) {
    // Логика позиционирования из IntroDistortion
    const sourceElement = document.getElementById(sourceElementId.value);
    if (sourceElement) {
      const glassRect = glassElementRef.value.getBoundingClientRect();
      const sourceRect = sourceElement.getBoundingClientRect();

      const offsetX = glassRect.left - sourceRect.left;
      const offsetY = glassRect.top - sourceRect.top;

      return {
        backgroundImage: "none", // DOM элемент не нуждается в background-image
        backgroundSize: "100%",
        backgroundPosition: `${-offsetX}px ${-offsetY}px`,
        transform: `translate3d(${-offsetX}px, ${-offsetY}px, 0)`,
        filter: `url(#${filterId})`,
        opacity: intensity,
        // Добавляем стили для DOM контента
        overflow: "hidden",
        width: `${sourceRect.width}px`,
        height: `${sourceRect.height}px`,
      };
    }
  }

  // Fallback к PNG логике
  let offsetX = 0;
  let offsetY = 0;
  let scale = 0.24;
  let winW = window.innerWidth;
  let winH = window.innerHeight;
  if (glassElementRef.value) {
    const rect = glassElementRef.value.getBoundingClientRect();
    offsetX = rect.left;
    offsetY = rect.top;
  }
  const posX = ((offsetX + glassSize.width / 2) / winW) * 100;
  const posY = ((offsetY + glassSize.height / 2) / winH) * 100;
  const dx = -5.7;
  const dy = -24.9;
  const parallaxX = posX + dx;
  const parallaxY = posY + dy;
  return {
    backgroundImage: backgroundImageUrl.value
      ? `url(${backgroundImageUrl.value})`
      : "none",
    backgroundSize: backgroundImageUrl.value ? `${winW * scale}%` : "cover",
    backgroundPosition: `var(--distortion-background-position, ${parallaxX}% ${parallaxY}%)`,
    filter: backgroundImageUrl.value ? `url(#${filterId})` : "none",
    opacity: backgroundImageUrl.value ? intensity : 0.3 * intensity,
  };
}
