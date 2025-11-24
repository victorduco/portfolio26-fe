export function useAdaptiveShadow({ saturationMultiplier = 1.5, lightnessMultiplier = 0.3, opacity = 14 } = {}) {
  return {
    '--shadow-saturated': `hsl(from var(--bg-color, hsl(220deg 13% 18%)) h calc(s * ${saturationMultiplier}) calc(l * ${lightnessMultiplier}))`,
    '--shadow-opacity': `${opacity}%`,
  };
}

export function getAdaptiveShadowValue(shadowParams) {
  return `${shadowParams} color-mix(in srgb, var(--shadow-saturated) var(--shadow-opacity), transparent)`;
}
