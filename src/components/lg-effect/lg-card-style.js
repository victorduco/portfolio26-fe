/**
 * Creates card style object for the glass effect
 * @param {Object} options - Effect options object
 * @param {Function} clamp - Clamp utility function
 * @returns {Object} Card style properties
 */
export function createCardStyle(options, clamp) {
  const borderAlpha = 0.42;
  const brightness = Math.max(0.5, options.glassBrightness / 100).toFixed(2);
  const contrast = Math.max(0.5, options.glassContrast / 100).toFixed(2);
  const tintHue = options.glassTintHue;
  const tintOpacity = options.glassTintOpacity;
  const shadowIntensity = options.shadowDepth;

  return {
    transform:
      "var(--distortion-transform, scaleX(1) scaleY(1) translate(0px, 0px))",
    transition: `transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)`,
    boxShadow: `0 24px 70px rgba(6, 10, 24, ${shadowIntensity})`,
    backgroundColor: `hsla(${tintHue}, 50%, 14%, ${clamp(
      tintOpacity * 0.8,
      0.12,
      0.55
    )})`,
    border: `1px solid hsla(${tintHue}, 92%, 86%, ${borderAlpha})`,
    backdropFilter: `blur(${options.glassBlur}px) saturate(${options.glassSaturation}%) brightness(${brightness}) contrast(${contrast})`,
    backgroundImage: `linear-gradient(145deg,
      hsla(${tintHue}, 70%, ${Math.min(82, 60 + tintOpacity * 35)}%, ${clamp(
      tintOpacity * 1.25,
      0.06,
      0.55
    )}) 0%,
      hsla(${tintHue}, 50%, ${Math.max(32, 46 + tintOpacity * 18)}%, ${clamp(
      tintOpacity * 0.9,
      0.05,
      0.42
    )}) 100%)`,
  };
}