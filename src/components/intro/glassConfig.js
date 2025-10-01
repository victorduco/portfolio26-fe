// Glass effect configuration for intro rectangles
export const INTRO_GLASS_CONFIG = {
  // Core displacement parameters - REQUIRED for distortion map
  displacementScale: 75,
  aberrationIntensity: 0.1,
  displacementCurvature: 1,

  // Glass material properties
  glassSaturation: 180,

  // Shader distortion parameters
  shaderCornerRadius: 2,
  shaderDistortionStart: 0.3,
  shaderDistortionEnd: 0.2,
  shaderDistortionOffset: 0.15,
  shaderScalingEnd: 0.1,
};
