import { clamp } from "./utils.js";

/**
 * Creates noise style object for the glass effect
 * @param {Object} options - Effect options object
 * @returns {Object} Noise style properties
 */
export function createNoiseStyle(options, intensity = 1) {
  const noiseTexture =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.3' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E";

  // Normalize large values: divide by 1000 if > 1
  const normalizedStrength = options.noiseStrength > 1 ? options.noiseStrength / 1000 : options.noiseStrength;
  const normalizedDepth = options.noiseRefractionDepth > 1 ? options.noiseRefractionDepth / 1000 : options.noiseRefractionDepth;

  const calculatedOpacity = clamp(normalizedStrength * normalizedDepth * intensity, 0, 1);

  console.log('Noise opacity:', {
    noiseStrength: options.noiseStrength,
    noiseRefractionDepth: options.noiseRefractionDepth,
    normalizedStrength,
    normalizedDepth,
    intensity,
    calculatedOpacity
  });

  return {
    backgroundImage: `url(${noiseTexture})`,
    backgroundSize: "180px",
    mixBlendMode: "soft-light",
    opacity: calculatedOpacity,
  };
}