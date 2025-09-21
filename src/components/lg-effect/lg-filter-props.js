/**
 * Creates filter properties object based on effect options
 * @param {Object} options - Effect options object
 * @param {Object} state - State object containing filterReady, filterId, shaderMapUrl
 * @returns {Object} Filter properties for the glass effect
 */
export function createFilterProps(options, intensity, state) {
  const red = options.displacementScale * options.displacementCurvature * intensity;
  const green =
    options.displacementScale *
    options.displacementCurvature *
    (1 - options.aberrationIntensity * 0.05) *
    intensity;
  const blur = Math.max(
    0.12,
    options.glassBlur * 0.02 * options.refractionDepth * intensity
  );

  const surfaceIntensity = options.surfaceReflection;
  const edgeMatrix = `${0.3 * surfaceIntensity} ${0.3 * surfaceIntensity} ${
    0.3 * surfaceIntensity
  } 0 0
            ${0.3 * surfaceIntensity} ${0.3 * surfaceIntensity} ${
    0.3 * surfaceIntensity
  } 0 0
            ${0.3 * surfaceIntensity} ${0.3 * surfaceIntensity} ${
    0.3 * surfaceIntensity
  } 0 0
            0 0 0 1 0`;

  const contrast = 1 + (options.glassSaturation - 180) / 300;
  const brightness = 1 + options.surfaceReflection * 0.2;
  const surfaceMatrix = `${contrast} 0 0 0 ${
    brightness * 0.1
  }
            0 ${contrast} 0 0 ${
    brightness * 0.1
  }
            0 0 ${contrast} 0 ${
    brightness * 0.1
  }
            0 0 0 1 0`;

  return {
    filterReady: state.filterReady,
    filterId: state.filterId,
    currentMap: state.shaderMapUrl,
    edgeIntensityMatrix: edgeMatrix,
    redScale: red,
    greenScale: green,
    liquidGlassBlur: blur,
    surfaceEnhancementMatrix: surfaceMatrix,
  };
}