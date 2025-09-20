import { clamp } from "./lg-utils.js";

/**
 * Creates light style object for the glass effect
 * @param {Object} options - Effect options object
 * @returns {Object} Light style properties
 */
export function createLightStyle(options) {
  const activeIntensity = options.highlightIntensity;
  const baseIntensity = activeIntensity * 0.6;
  const spread = Math.min(100, 48 + options.highlightSpread * 34);
  const inner = Math.max(12, options.highlightSpread * 14);
  const hue = options.highlightHue;

  const idleOpacity = clamp(baseIntensity + 0.12, 0.18, 0.95);
  const hoverOpacity = clamp(activeIntensity + 0.12, 0.18, 0.95);
  const opacityDelta = hoverOpacity - idleOpacity;

  const idleStartAlpha = clamp(0.45 + baseIntensity * 0.55, 0.35, 0.92);
  const hoverStartAlpha = clamp(0.45 + activeIntensity * 0.55, 0.35, 0.92);
  const startAlphaDelta = hoverStartAlpha - idleStartAlpha;

  const idleMidAlpha = clamp(0.12 + baseIntensity * 0.35, 0.14, 0.6);
  const hoverMidAlpha = clamp(0.12 + activeIntensity * 0.35, 0.14, 0.6);
  const midAlphaDelta = hoverMidAlpha - idleMidAlpha;

  return {
    opacity: `calc(${idleOpacity.toFixed(
      3
    )} + var(--distortion-hovered, 0) * ${opacityDelta.toFixed(3)})`,
    background: `radial-gradient(circle at calc(50% + var(--distortion-light-x, 0%)) calc(30% + var(--distortion-light-y, 0%)),
      hsla(${hue}, 96%, 82%, calc(${idleStartAlpha.toFixed(
      3
    )} + var(--distortion-hovered, 0) * ${startAlphaDelta.toFixed(3)})) 0%,
      hsla(${hue}, 98%, 74%, calc(${idleMidAlpha.toFixed(
      3
    )} + var(--distortion-hovered, 0) * ${midAlphaDelta.toFixed(
      3
    )})) ${inner}%,
      rgba(255, 255, 255, 0) ${spread}%)`,
  };
}