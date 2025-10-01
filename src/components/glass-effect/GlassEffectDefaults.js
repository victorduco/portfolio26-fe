import { reactive } from "vue";

/**
 * Create reactive glass effect configuration with default values
 * @param {Object} userOptions - User options to override defaults
 * @returns {Object} Reactive object containing all glass effect configuration
 */
export function createEffectOptions(userOptions = {}) {
  const config = reactive({
    // Core displacement parameters
    displacementScale: 65,
    aberrationIntensity: 2.8,
    displacementCurvature: 1.8,

    // Glass material properties
    glassBlur: 25,
    glassSaturation: 185,
    glassBrightness: 115,
    glassContrast: 118,
    glassTintHue: 210,
    glassTintOpacity: 0.38,
    refractionDepth: 2.0,
    surfaceReflection: 0.45,

    // Light and shadow
    lightIntensity: 0.75,
    lightSpread: 1.1,
    lightHue: 210,
    shadowDepth: 0.4,

    // Highlight parameters
    highlightReflection: 0.45,

    // Noise parameters
    noiseStrength: 0.22,
    noiseRefractionDepth: 2.0,

    // Outline parameters
    outlineIntensity: 0.4,
    outlineGlassTintHue: 210,

    // Shader distortion parameters
    shaderCornerRadius: 0.2,
    shaderDistortionStart: 0.3,
    shaderDistortionEnd: 0.2,
    shaderDistortionOffset: 0.15,
    shaderScalingStart: 0,
    shaderScalingEnd: 1,
  });

  loadGlassValues(userOptions, config);
  return config;
}

/**
 * Override glass refs with user options (refs already have defaults)
 * @param {Object} options - User provided options
 * @param {Object} refs - Vue refs object to update
 */
function loadGlassValues(options, refs) {
  Object.assign(refs, options);

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
