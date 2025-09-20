import { reactive } from "vue";

/**
 * Create all glass effect refs with default values
 * @returns {Object} Object containing all glass effect refs
 */
export function createGlassRefs() {
  return reactive({
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
}

/**
 * Override glass refs with user options (refs already have defaults)
 * @param {Object} options - User provided options
 * @param {Object} refs - Vue refs object to update
 */
export function loadGlassValues(options, refs) {
  // Simple property mapping
  const simpleProps = [
    "displacementScale",
    "aberrationIntensity",
    "glassBlur",
    "glassSaturation",
    "refractionDepth",
    "surfaceReflection",
    "highlightIntensity",
    "highlightSpread",
    "highlightHue",
    "shadowDepth",
    "shaderCornerRadius",
  ];

  simpleProps.forEach((prop) => {
    if (options[prop] !== undefined) {
      refs[prop] = options[prop];
    }
  });

  // Handle legacy aliases for surfaceCurvature
  if (options.surfaceCurvature !== undefined) {
    refs.displacementCurvature = options.surfaceCurvature;
  } else if (options.displacementCurvature !== undefined) {
    refs.displacementCurvature = options.displacementCurvature;
  }

  // Nested object mapping
  const nestedProps = [
    {
      ref: "shaderDistortionStart",
      nested: "distortion.start",
      legacy: "shaderDistortionStart",
    },
    {
      ref: "shaderDistortionEnd",
      nested: "distortion.end",
      legacy: "shaderDistortionEnd",
    },
    {
      ref: "shaderDistortionOffset",
      nested: "distortion.offset",
      legacy: "shaderDistortionOffset",
    },
    {
      ref: "shaderScalingStart",
      nested: "scaling.start",
      legacy: "shaderScalingStart",
    },
    {
      ref: "shaderScalingEnd",
      nested: "scaling.end",
      legacy: "shaderScalingEnd",
    },
  ];

  nestedProps.forEach(({ ref, nested, legacy }) => {
    const [obj, prop] = nested.split(".");
    const nestedValue = options[obj]?.[prop];
    const legacyValue = options[legacy];

    if (nestedValue !== undefined || legacyValue !== undefined) {
      refs[ref] = nestedValue ?? legacyValue;
    }
  });
}
