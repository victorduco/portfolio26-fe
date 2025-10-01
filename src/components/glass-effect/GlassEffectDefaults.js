import { reactive } from "vue";

export function createEffectOptions(userOptions = {}) {
  const config = reactive({
    displacementScale: 65,
    aberrationIntensity: 2.8,
    displacementCurvature: 1.8,
    glassBlur: 25,
    glassSaturation: 185,
    glassBrightness: 115,
    glassContrast: 118,
    glassTintHue: 210,
    glassTintOpacity: 0.38,
    refractionDepth: 2.0,
    surfaceReflection: 0.45,
    lightIntensity: 0.75,
    lightSpread: 1.1,
    lightHue: 210,
    shadowDepth: 0.4,
    highlightReflection: 0.45,
    noiseStrength: 0.22,
    noiseRefractionDepth: 2.0,
    outlineIntensity: 0.4,
    outlineGlassTintHue: 210,
    shaderCornerRadius: 0.2,
    shaderDistortionStart: 0.3,
    shaderDistortionEnd: 0.2,
    shaderDistortionOffset: 0.15,
    shaderScalingStart: 0,
    shaderScalingEnd: 1,
  });

  Object.assign(config, userOptions,
    userOptions.distortion && {
      shaderDistortionStart: userOptions.distortion.start,
      shaderDistortionEnd: userOptions.distortion.end,
      shaderDistortionOffset: userOptions.distortion.offset,
    },
    userOptions.scaling && {
      shaderScalingStart: userOptions.scaling.start,
      shaderScalingEnd: userOptions.scaling.end,
    }
  );

  return config;
}
