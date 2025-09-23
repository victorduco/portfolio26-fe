import {
  computed,
  isRef,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { ShaderDisplacementGenerator } from "./filter-displacement-generator.ts";
import { createEffectOptions } from "./effect-options.js";
import { createFilterProps } from "./layer-filter-props.js";
import { createLiquidStyle } from "./layer-liquid.js";
import { createCardStyle } from "./layer-card.js";
import { createSurfaceHighlightStyle } from "./layer-highlight.js";
import { createNoiseStyle } from "./layer-noise.js";
import { createLightStyle } from "./layer-light.js";
import { createOutlineStyle } from "./layer-outline.js";
import defaultBackgroundImageUrl from "../../assets/grd3.png";

export default function useGlassDemo({
  backgroundImageUrl: backgroundImageOption,
  sourceElementId: sourceElementIdOption,
  intensity: intensityOption,
  ...userOptions
} = {}) {
  //
  // =====  INPUT HANDLING  =====
  //
  const backgroundImageUrl = computed(() =>
    isRef(backgroundImageOption)
      ? backgroundImageOption.value || defaultBackgroundImageUrl
      : "none"
  );
  const sourceElementId = computed(() =>
    isRef(sourceElementIdOption)
      ? sourceElementIdOption.value
      : ""
  );
  const intensity = computed(() =>
    isRef(intensityOption) ? intensityOption.value : 1
  );
  const options = createEffectOptions(userOptions);

  //
  // =====  ELEMENT REFS  =====
  //
  const glassElementRef = ref(null);
  const filterId = `apple-liquid-glass-${Math.random().toString(36).slice(2)}`;
  const filterReady = ref(false);
  const shaderMapUrl = ref("");
  const glassSize = reactive({ width: 0, height: 0 });

  //
  // =====  SHADER GENERATION  =====
  //
  const generateShaderDisplacementMap = () => {
    if (typeof window === "undefined") {
      return;
    }
    const generator = new ShaderDisplacementGenerator({
      width: Math.max(1, Math.floor(glassSize.width)),
      height: Math.max(1, Math.floor(glassSize.height)),
      cornerRadius: options.shaderCornerRadius,
      distortionStart: options.shaderDistortionStart,
      distortionEnd: options.shaderDistortionEnd,
      distortionOffset: options.shaderDistortionOffset,
      scalingStart: options.shaderScalingStart,
      scalingEnd: options.shaderScalingEnd,
    });
    const url = generator.updateShader();
    shaderMapUrl.value = url;
    generator.destroy();
  };

  const filterProps = computed(() =>
    createFilterProps(options, intensity.value, {
      filterReady: filterReady.value,
      filterId,
      shaderMapUrl: shaderMapUrl.value,
    })
  );

  //
  // =====  STYLES  =====
  //
  const liquidStyle = computed(() =>
    createLiquidStyle(backgroundImageUrl, sourceElementId, glassElementRef, glassSize, filterId, intensity.value)
  );
  const cardStyle = computed(() => createCardStyle(options, backgroundImageUrl.value, intensity.value));
  const surfaceHighlightStyle = computed(() =>
    createSurfaceHighlightStyle(options, intensity.value)
  );
  const noiseStyle = computed(() => createNoiseStyle(options, intensity.value));
  const lightStyle = computed(() => createLightStyle(options, intensity.value));
  const outlineStyle = computed(() => createOutlineStyle(options, intensity.value));

  //
  // =====  LIFECYCLE & WATCHERS  =====
  //
  const updateGlassSize = () => {
    if (!glassElementRef.value) return;
    const rect = glassElementRef.value.getBoundingClientRect();
    glassSize.width = Math.round(rect.width);
    glassSize.height = Math.round(rect.height);
  };

  const scheduleShaderGeneration = () => {
    nextTick(() => {
      requestAnimationFrame(() => {
        updateGlassSize();
        generateShaderDisplacementMap();
      });
    });
  };

  onMounted(() => {
    filterReady.value = true;
    updateGlassSize();
    scheduleShaderGeneration();
    window.addEventListener("resize", updateGlassSize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateGlassSize);
  });

  watch(
    () => [
      glassSize.width,
      glassSize.height,
      options.shaderCornerRadius,
      options.shaderDistortionStart,
      options.shaderDistortionEnd,
      options.shaderDistortionOffset,
      options.shaderScalingStart,
      options.shaderScalingEnd,
    ],
    () => {
      scheduleShaderGeneration();
    }
  );

  return {
    filterProps,
    glassElementRef,
    cardStyle,
    liquidStyle,
    noiseStyle,
    surfaceHighlightStyle,
    lightStyle,
    outlineStyle,
  };
}
