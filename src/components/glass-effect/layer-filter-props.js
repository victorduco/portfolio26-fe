/**
 * Creates filter properties object based on effect options
 * @param {Object} options - Effect options object
 * @param {Object} state - State object containing filterReady, filterId, shaderMapUrl
 * @returns {Object} Filter properties for the glass effect
 */
export function createFilterProps(options, intensity, state) {
  const baseScale = options.displacementScale * options.displacementCurvature * intensity;
  const red = baseScale * (1 + options.aberrationIntensity * 0.01);
  const green = baseScale;
  const blueScale = baseScale * (1 - options.aberrationIntensity * 0.01);

  const blur = Math.max(
    0.12,
    options.glassBlur * 0.02 * options.refractionDepth * intensity
  );

  // Edge mask table for EDGE_MASK creation (like original version)
  // Using safer values that are closer to original working version
  const edgeMaskTable = `0 0.1 1`;


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
  const surfaceMatrix = `${contrast} 0 0 0 ${brightness * 0.1}
            0 ${contrast} 0 0 ${brightness * 0.1}
            0 0 ${contrast} 0 ${brightness * 0.1}
            0 0 0 1 0`;

  return {
    filterReady: state.filterReady,
    filterId: state.filterId,
    currentMap: state.shaderMapUrl,
    edgeIntensityMatrix: edgeMatrix,
    edgeMaskTable,
    redScale: red,
    greenScale: green,
    blueScale,
    liquidGlassBlur: blur,
    surfaceEnhancementMatrix: surfaceMatrix,
  };
}
