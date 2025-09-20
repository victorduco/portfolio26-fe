/**
 * Creates surface highlight style object for the glass effect
 * @param {Object} options - Effect options object
 * @returns {Object} Surface highlight style properties
 */
export function createSurfaceHighlightStyle(options) {
  return {
    background: `linear-gradient(135deg,
      rgba(255, 255, 255, ${options.surfaceReflection * 0.4}) 0%,
      rgba(255, 255, 255, ${options.surfaceReflection * 0.1}) 50%,
      rgba(255, 255, 255, 0.02) 100%)`,
    opacity: "calc(0.7 + var(--distortion-hovered, 0) * 0.3)",
    transition: "opacity 0.3s ease",
  };
}