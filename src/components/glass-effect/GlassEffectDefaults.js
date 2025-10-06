import { reactive } from "vue";

export function createEffectOptions(userOptions = {}) {
  const config = reactive({
    displacementMap: "",
    displacementScale: 65,
    displacementCurvature: 1.8,
    glassBlur: 25,
    glassSaturation: 185,
    glassBrightness: 60,
    glassContrast: 120,
    shadowDepth: 0.4,
    highlightReflection: 0.45,
  });

  Object.assign(config, userOptions);

  return config;
}
