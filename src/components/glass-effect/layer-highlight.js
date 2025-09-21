/**
 * Creates surface highlight style object for the glass effect
 * @param {Object} options - Effect options object
 * @returns {Object} Surface highlight style properties
 */
export function createSurfaceHighlightStyle(options, intensity = 1) {
  return {
    background: `linear-gradient(135deg,
      rgba(255, 255, 255, ${options.surfaceReflection * 0.4 * intensity}) 0%,
      rgba(255, 255, 255, ${options.surfaceReflection * 0.1 * intensity}) 50%,
      rgba(255, 255, 255, ${0.02 * intensity}) 100%)`,
    opacity: "calc(0.7 + var(--distortion-hovered, 0) * 0.3)",
    transition: "opacity 0.3s ease",
  };
}