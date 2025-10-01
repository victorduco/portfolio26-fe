// Glass effect configuration for intro rectangles
export const INTRO_GLASS_CONFIG = {
  // GeFilter - SVG displacement map
  displacementScale: 50, // GeFilter: feDisplacementMap scale (baseScale)
  aberrationIntensity: 2.8, // GeFilter: chromatic aberration offset (redScale/blueScale)
  displacementCurvature: 1.8, // GeFilter: displacement curvature multiplier (baseScale)
  refractionDepth: 1, // GeFilter: blur calculation (liquidGlassBlur)
  surfaceReflection: 0.45, // GeFilter: feColorMatrix edge intensity & surface enhancement

  // GeCard - backdrop filter & background
  glassBlur: 60, // GeCard: backdropFilter blur, GeFilter: liquidGlassBlur
  glassSaturation: 185, // GeCard: backdropFilter saturate, GeFilter: surfaceEnhancementMatrix
  glassBrightness: 150, // GeCard: backdropFilter brightness
  glassContrast: 218, // GeCard: backdropFilter contrast
  glassTintHue: 0, // GeCard: backgroundColor & backgroundImage hue
  glassTintOpacity: 0, // GeCard: backgroundColor & backgroundImage opacity
  shadowDepth: 20, // GeCard: boxShadow opacity

  // GeLight - radial gradient overlay
  lightIntensity: 0, // GeLight: gradient opacity & start/mid stops
  lightSpread: 0, // GeLight: gradient spread & inner radius
  lightHue: 250, // GeLight: gradient color hue

  // GeHighlight - linear gradient overlay
  highlightReflection: 0.2, // GeHighlight: linear gradient opacity multiplier

  // GeNoise - SVG noise texture overlay
  noiseStrength: 0.22, // GeNoise: noise opacity multiplier
  noiseRefractionDepth: 2, // GeNoise: noise opacity multiplier

  // GeOutline - linear gradient border effect
  outlineIntensity: 0, // GeOutline: gradient opacity calculation
  outlineGlassTintHue: 250, // GeOutline: gradient color hue

  // GeFilter - ShaderDisplacementGenerator parameters
  shaderCornerRadius: -0.2, // ShaderDisplacementGenerator: corner radius
  shaderDistortionStart: 0.2, // ShaderDisplacementGenerator: distortion start point
  shaderDistortionEnd: 0, // ShaderDisplacementGenerator: distortion end point
  shaderDistortionOffset: 0.2, // ShaderDisplacementGenerator: distortion offset
  shaderScalingStart: 0.1, // ShaderDisplacementGenerator: scaling start value
  shaderScalingEnd: 0.1, // ShaderDisplacementGenerator: scaling end value
};
