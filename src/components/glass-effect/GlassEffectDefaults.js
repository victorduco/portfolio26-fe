import { reactive } from "vue";

export function createEffectOptions(userOptions = {}) {
  const config = reactive({
    displacementMap: "",
    displacementScale: 65,
    glassBlur: 25,
    glassSaturation: 185,
    glassBrightness: 60,
    glassContrast: 120,
    highlightReflection: 0.45,
  });

  Object.assign(config, userOptions);

  return config;
}
