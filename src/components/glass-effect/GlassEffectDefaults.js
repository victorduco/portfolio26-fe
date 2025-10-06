import { reactive } from "vue";

export function createEffectOptions(userOptions = {}) {
  const config = reactive({
    displacementScale: 65,
    displacementCurvature: 1.8,
    glassBlur: 25,
    glassSaturation: 185,
    glassBrightness: 60,
    glassContrast: 120,
    shadowDepth: 0.4,
    highlightReflection: 0.45,
    shaderCornerRadius: 0.2,
    shaderRectWidth: 0,
    shaderRectHeight: 0,
    shaderCenterOffsetX: 0,
    shaderCenterOffsetY: 0,
    shaderEdgeSoftness: 2,
    shaderDistortionStart: 0.3,
    shaderDistortionEnd: 0.2,
    shaderDistortionOffset: 0.15,
    shaderScalingStart: 0,
    shaderScalingEnd: 1,
  });

  Object.assign(
    config,
    userOptions,
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
