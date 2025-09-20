import { ref } from "vue";

export const GLASS_DEFAULTS = {
  // Core displacement parameters
  displacementScale: 65,
  aberrationIntensity: 2.8,
  surfaceCurvature: 1.8,
  displacementCurvature: 1.8, // alias for surfaceCurvature

  // Glass material properties
  glassBlur: 25,
  glassSaturation: 185,
  refractionDepth: 2.0,
  surfaceReflection: 0.45,

  // Light and shadow
  highlightIntensity: 0.75,
  highlightSpread: 1.1,
  highlightHue: 210,
  shadowDepth: 0.4,

  // Advanced effects
  glassBrightness: 115,
  glassContrast: 118,
  glassTintHue: 210,
  glassTintOpacity: 0.38,
  noiseStrength: 0.22,

  // Shader distortion parameters
  shaderCornerRadius: 0.2,
  distortion: {
    start: 0.3,
    end: 0.2,
    offset: 0.15,
  },
  scaling: {
    start: 0,
    end: 1,
  },
  // Legacy aliases
  shaderDistortionStart: 0.3,
  shaderDistortionEnd: 0.2,
  shaderDistortionOffset: 0.15,
  shaderScalingStart: 0,
  shaderScalingEnd: 1,
};

/**
 * Create all glass effect refs with default values
 * @returns {Object} Object containing all glass effect refs
 */
export function createGlassRefs() {
  return {
    // Core displacement parameters
    displacementScale: ref(0),
    aberrationIntensity: ref(0),
    displacementCurvature: ref(0),

    // Glass material properties
    glassBlur: ref(0),
    glassSaturation: ref(0),
    refractionDepth: ref(0),
    surfaceReflection: ref(0),

    // Light and shadow
    highlightIntensity: ref(0),
    highlightSpread: ref(0),
    highlightHue: ref(0),
    shadowDepth: ref(0),

    // Advanced effects
    glassBrightness: ref(0),
    glassContrast: ref(0),
    glassTintHue: ref(0),
    glassTintOpacity: ref(0),
    noiseStrength: ref(0),

    // Shader distortion parameters
    shaderCornerRadius: ref(0),
    shaderDistortionStart: ref(0),
    shaderDistortionEnd: ref(0),
    shaderDistortionOffset: ref(0),
    shaderScalingStart: ref(0),
    shaderScalingEnd: ref(0),
  };
}

/**
 * Load values from options with defaults fallback
 * @param {Object} options - User provided options
 * @param {Object} refs - Vue refs object to populate
 */
export function loadGlassValues(options, refs) {
  // Core displacement parameters
  refs.displacementScale.value = options.displacementScale ?? GLASS_DEFAULTS.displacementScale;
  refs.aberrationIntensity.value = options.aberrationIntensity ?? GLASS_DEFAULTS.aberrationIntensity;

  // Handle legacy aliases for surfaceCurvature
  if (options.surfaceCurvature !== undefined) {
    refs.displacementCurvature.value = options.surfaceCurvature;
  } else if (options.displacementCurvature !== undefined) {
    refs.displacementCurvature.value = options.displacementCurvature;
  } else {
    refs.displacementCurvature.value = GLASS_DEFAULTS.surfaceCurvature;
  }

  // Glass material properties
  refs.glassBlur.value = options.glassBlur ?? GLASS_DEFAULTS.glassBlur;
  refs.glassSaturation.value = options.glassSaturation ?? GLASS_DEFAULTS.glassSaturation;
  refs.refractionDepth.value = options.refractionDepth ?? GLASS_DEFAULTS.refractionDepth;
  refs.surfaceReflection.value = options.surfaceReflection ?? GLASS_DEFAULTS.surfaceReflection;

  // Light and shadow
  refs.highlightIntensity.value = options.highlightIntensity ?? GLASS_DEFAULTS.highlightIntensity;
  refs.highlightSpread.value = options.highlightSpread ?? GLASS_DEFAULTS.highlightSpread;
  refs.highlightHue.value = options.highlightHue ?? GLASS_DEFAULTS.highlightHue;
  refs.shadowDepth.value = options.shadowDepth ?? GLASS_DEFAULTS.shadowDepth;

  // Advanced effects
  refs.glassBrightness.value = GLASS_DEFAULTS.glassBrightness;
  refs.glassContrast.value = GLASS_DEFAULTS.glassContrast;
  refs.glassTintHue.value = GLASS_DEFAULTS.glassTintHue;
  refs.glassTintOpacity.value = GLASS_DEFAULTS.glassTintOpacity;
  refs.noiseStrength.value = GLASS_DEFAULTS.noiseStrength;

  // Shader distortion parameters with nested object support
  refs.shaderCornerRadius.value = options.shaderCornerRadius ?? GLASS_DEFAULTS.shaderCornerRadius;

  refs.shaderDistortionStart.value =
    options.distortion?.start ??
    options.shaderDistortionStart ??
    GLASS_DEFAULTS.distortion.start;

  refs.shaderDistortionEnd.value =
    options.distortion?.end ??
    options.shaderDistortionEnd ??
    GLASS_DEFAULTS.distortion.end;

  refs.shaderDistortionOffset.value =
    options.distortion?.offset ??
    options.shaderDistortionOffset ??
    GLASS_DEFAULTS.distortion.offset;

  refs.shaderScalingStart.value =
    options.scaling?.start ??
    options.shaderScalingStart ??
    GLASS_DEFAULTS.scaling.start;

  refs.shaderScalingEnd.value =
    options.scaling?.end ??
    options.shaderScalingEnd ??
    GLASS_DEFAULTS.scaling.end;
}