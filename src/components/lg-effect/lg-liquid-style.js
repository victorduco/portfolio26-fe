/**
 * Creates liquid style object for the glass effect
 * @param {Object} backgroundImageUrl - Computed background image URL
 * @param {Object} glassElementRef - Ref to the glass element
 * @param {Object} glassSize - Reactive glass size object
 * @param {string} filterId - Filter ID for SVG filter
 * @returns {Object} Liquid style properties
 */
export function createLiquidStyle(
  backgroundImageUrl,
  glassElementRef,
  glassSize,
  filterId
) {
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
    backgroundSize: `${winW * scale}%`,
    backgroundPosition: `var(--distortion-background-position, ${parallaxX}% ${parallaxY}%)`,
    filter: `url(#${filterId})`,
    opacity: 1,
  };
}
