// Glass effect configuration for intro rectangles
export const INTRO_GLASS_CONFIG = {
  // Core displacement parameters - REQUIRED for distortion map
  displacementScale: 0,
  aberrationIntensity: 0,
  displacementCurvature: 0,

  // Glass material properties
  glassBlur: 0,
  glassSaturation: 0,
  glassBrightness: 0,
  glassContrast: 0,
  glassTintHue: 0,
  glassTintOpacity: 0,
  refractionDepth: 0,
  surfaceReflection: 0,

  // GeLight
  lightIntensity: 0,
  lightSpread: 0,
  lightHue: 250,

  // GeHighlight
  highlightReflection: 0,

  // GeNoise
  // todo: не работает?
  noiseStrength: 0,
  noiseRefractionDepth: 0,

  // GeOutline
  // todo: не работает?
  outlineIntensity: 0,
  outlineGlassTintHue: 250,

  // Shadow and advanced effects
  // todo: не работает?
  shadowDepth: 0,

  // Shader distortion parameters
  shaderCornerRadius: 2,
  shaderDistortionStart: 0.3,
  shaderDistortionEnd: 0.2,
  shaderDistortionOffset: 0.15,
  shaderScalingStart: 0,
  shaderScalingEnd: 0.1,
};
