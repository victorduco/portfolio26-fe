import { reactive } from "vue";

/**
 * Create all glass effect refs with default values
 * @param {Object} options - User options to override defaults
 * @returns {Object} Object containing all glass effect refs
 */
export function createGlassRefs(options = {}) {
  const refs = reactive({
    // Core displacement parameters
    displacementScale: 65,
    aberrationIntensity: 2.8,
    displacementCurvature: 1.8,

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
    shaderDistortionStart: 0.3,
    shaderDistortionEnd: 0.2,
    shaderDistortionOffset: 0.15,
    shaderScalingStart: 0,
    shaderScalingEnd: 1,
  });

  loadGlassValues(options, refs);
  return refs;
}

/**
 * Override glass refs with user options (refs already have defaults)
 * @param {Object} options - User provided options
 * @param {Object} refs - Vue refs object to update
 */
function loadGlassValues(options, refs) {
  Object.assign(refs, options);

  // Handle legacy aliases
  if (options.surfaceCurvature !== undefined) {
    refs.displacementCurvature = options.surfaceCurvature;
  }

  // Handle nested object support
  if (options.distortion) {
    Object.assign(refs, {
      shaderDistortionStart: options.distortion.start,
      shaderDistortionEnd: options.distortion.end,
      shaderDistortionOffset: options.distortion.offset,
    });
  }

  if (options.scaling) {
    Object.assign(refs, {
      shaderScalingStart: options.scaling.start,
      shaderScalingEnd: options.scaling.end,
    });
  }
}
