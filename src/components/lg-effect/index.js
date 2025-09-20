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
import { ShaderDisplacementGenerator } from "./shader-generator.ts";
import { createEffectOptions } from "./effect-options.js";
import { createFilterProps } from "./lg-filter-props.js";
import { createLiquidStyle } from "./lg-liquid-style.js";
import { createCardStyle } from "./lg-card-style.js";
import { createSurfaceHighlightStyle } from "./lg-surface-highlight-style.js";
import { createNoiseStyle } from "./lg-noise-style.js";
import { createLightStyle } from "./lg-light-style.js";
import { createOutlineStyle } from "./lg-outline-style.js";
import defaultBackgroundImageUrl from "../../assets/grd3.png";

export default function useGlassDemo({
  backgroundImageUrl: backgroundImageOption,
  ...userOptions
} = {}) {
  // =====  INPUT HANDLING  =====
  const backgroundImageUrl = computed(() =>
    isRef(backgroundImageOption)
      ? backgroundImageOption.value || defaultBackgroundImageUrl
      : "none"
  );
  const options = createEffectOptions(userOptions);

  // ===== REMAINING CODE TODO: REFACTOR =====
  const glassElementRef = ref(null);
  const filterId = `apple-liquid-glass-${Math.random().toString(36).slice(2)}`;
  const filterReady = ref(false);
  const shaderMapUrl = ref("");
  const glassSize = reactive({ width: 320, height: 160 });

  const filterProps = computed(() =>
    createFilterProps(options, {
      filterReady: filterReady.value,
      filterId,
      shaderMapUrl: shaderMapUrl.value,
    })
  );

  const isFirefox =
    typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent);
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const liquidStyle = computed(() =>
    createLiquidStyle(
      backgroundImageUrl,
      glassElementRef,
      glassSize,
      isFirefox,
      filterId
    )
  );
  const cardStyle = computed(() => createCardStyle(options, clamp));
  const surfaceHighlightStyle = computed(() =>
    createSurfaceHighlightStyle(options)
  );
  const noiseStyle = computed(() => createNoiseStyle(options, clamp));
  const lightStyle = computed(() => createLightStyle(options, clamp));
  const outlineStyle = computed(() =>
    createOutlineStyle(options, glassSize, clamp)
  );

  const updateGlassSize = () => {
    if (!glassElementRef.value) return;
    const rect = glassElementRef.value.getBoundingClientRect();
    glassSize.width = Math.round(rect.width);
    glassSize.height = Math.round(rect.height);
  };

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
    filterReady,
    glassSize,
    filterId,
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
