import { reactive } from "vue";

export function createEffectOptions(userOptions = {}) {
  return reactive({ displacementMap: "", displacementScale: 65, glassBlur: 25,
    glassSaturation: 185, glassBrightness: 60, glassContrast: 120,
    highlightReflection: 0.15, ...userOptions });
}
