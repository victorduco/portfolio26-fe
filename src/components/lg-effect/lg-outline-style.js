import { clamp } from "./lg-utils.js";

/**
 * Creates outline style object for the glass effect
 * @param {Object} options - Effect options object
 * @param {Object} glassSize - Reactive glass size object
 * @returns {Object} Outline style properties
 */
export function createOutlineStyle(options) {
  const hue = options.glassTintHue;
  const idleOpacity = clamp(
    0.18 + options.highlightIntensity * 0.28,
    0.22,
    0.6
  );
  const hoverOpacity = clamp(
    0.28 + options.highlightIntensity * 0.38,
    0.3,
    0.75
  );
  const baseOpacity = idleOpacity * options.surfaceReflection;
  const hoverOpacityTotal = hoverOpacity * options.surfaceReflection;
  const opacityDelta = hoverOpacityTotal - baseOpacity;
  return {
    width: "100%",
    height: "100%",
    transform:
      "var(--distortion-transform, scaleX(1) scaleY(1) translate(0px, 0px))",
    transition: `transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)`,
    opacity: `calc(${baseOpacity.toFixed(
      3
    )} + var(--distortion-hovered, 0) * ${opacityDelta.toFixed(3)})`,
    background: `linear-gradient(calc(135deg + var(--distortion-outline-rotation, 0deg)),
      hsla(${hue}, 95%, 86%, 0.08) 0%,
      hsla(${hue}, 96%, 78%, ${0.52 * options.surfaceReflection}) 50%,
      hsla(${hue}, 92%, 68%, 0.16) 100%)`,
  };
}
