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
import defaultBackgroundImageUrl from "../../assets/grd3.png";

export default function useGlassDemo() {
  // Режим Apple Liquid Glass (только один)
  const defaultOptions = typeof arguments[0] === "object" ? arguments[0] : {};
  const mode = ref("shader");

  const backgroundImageOption = defaultOptions.backgroundImageUrl;
  const backgroundImageUrl = computed(() => {
    if (isRef(backgroundImageOption)) {
      return backgroundImageOption.value || defaultBackgroundImageUrl;
    }

    if (typeof backgroundImageOption === "string" && backgroundImageOption) {
      return backgroundImageOption;
    }

    return defaultBackgroundImageUrl;
  });

  // Core displacement parameters
  const displacementScale = ref(defaultOptions.displacementScale ?? 60);
  const aberrationIntensity = ref(defaultOptions.aberrationIntensity ?? 2.8);
  const displacementCurvature = ref(
    defaultOptions.displacementCurvature ?? defaultOptions.surfaceCurvature ?? 1.8
  );

  // Glass material properties
  const glassBlur = ref(defaultOptions.glassBlur ?? 25);
  const glassSaturation = ref(defaultOptions.glassSaturation ?? 185);
  const refractionDepth = ref(defaultOptions.refractionDepth ?? 1.8);
  const surfaceReflection = ref(defaultOptions.surfaceReflection ?? 0.4);

  // Light and shadow
  const highlightIntensity = ref(0.68);
  const highlightSpread = ref(1.05);
  const highlightHue = ref(210);
  const shadowDepth = ref(defaultOptions.shadowDepth ?? 0.35);

  // Advanced effects
  const glassBrightness = ref(110);
  const glassContrast = ref(112);
  const glassTintHue = ref(210);
  const glassTintOpacity = ref(0.32);
  const noiseStrength = ref(0.18);

  // Shader distortion parameters
  const shaderCornerRadius = ref(defaultOptions.shaderCornerRadius ?? 0.2);
  const shaderDistortionStart = ref(defaultOptions.shaderDistortionStart ?? 0.3);
  const shaderDistortionEnd = ref(defaultOptions.shaderDistortionEnd ?? 0);
  const shaderDistortionOffset = ref(defaultOptions.shaderDistortionOffset ?? 0.15);
  const shaderScalingStart = ref(defaultOptions.shaderScalingStart ?? 0);
  const shaderScalingEnd = ref(defaultOptions.shaderScalingEnd ?? 1);

  // Core system
  const cornerRadius = 32;
  const glassRef = ref(null);
  const filterId = `apple-liquid-glass-${Math.random().toString(36).slice(2)}`;
  const filterReady = ref(false);
  const shaderMapUrl = ref("");
  const isActive = ref(false);
  const glassSize = reactive({ width: 320, height: 160 });

  const isFirefox =
    typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getMap = (shaderUrl) => {
    return shaderUrl;
  };

  // Enhanced computed properties for Apple Liquid Glass
  const currentMap = computed(() => getMap(shaderMapUrl.value));

  // edgeFeather and edgeSharpness removed

  // Enhanced displacement scaling with surface curvature
  const redScale = computed(
    () => displacementScale.value * displacementCurvature.value
  );
  const greenScale = computed(
    () =>
      displacementScale.value *
      displacementCurvature.value *
      (1 - aberrationIntensity.value * 0.05)
  );

  // Apple Liquid Glass specific blur
  const liquidGlassBlur = computed(() =>
    Math.max(0.12, glassBlur.value * 0.02 * refractionDepth.value)
  );

  // Enhanced edge intensity matrix
  const edgeIntensityMatrix = computed(() => {
    const intensity = surfaceReflection.value;
    return `${0.3 * intensity} ${0.3 * intensity} ${0.3 * intensity} 0 0
            ${0.3 * intensity} ${0.3 * intensity} ${0.3 * intensity} 0 0
            ${0.3 * intensity} ${0.3 * intensity} ${0.3 * intensity} 0 0
            0 0 0 1 0`;
  });

  // Surface enhancement matrix for glass realism
  const surfaceEnhancementMatrix = computed(() => {
    const contrast = 1 + (glassSaturation.value - 180) / 300;
    const brightness = 1 + surfaceReflection.value * 0.2;
    return `${contrast} 0 0 0 ${brightness * 0.1}
            0 ${contrast} 0 0 ${brightness * 0.1}
            0 0 ${contrast} 0 ${brightness * 0.1}
            0 0 0 1 0`;
  });

  // Liquid layer style - THIS IS WHERE THE MAGIC HAPPENS
  // Only this layer gets the SVG distortion filter applied to show distorted background
  const liquidStyle = computed(() => {
    // Получаем позицию блока относительно окна
    let offsetX = 0;
    let offsetY = 0;
    let scale = 0.24;
    let winW = window.innerWidth;
    let winH = window.innerHeight;
    // ...existing code...
    if (glassRef.value) {
      const rect = glassRef.value.getBoundingClientRect();
      offsetX = rect.left;
      offsetY = rect.top;
      winW = window.innerWidth;
      winH = window.innerHeight;
    }
    // Базовая позиция для fallback (без интерактивности)
    const posX = ((offsetX + glassSize.width / 2) / winW) * 100;
    const posY = ((offsetY + glassSize.height / 2) / winH) * 100;
    const dx = -5.7;
    const dy = -24.9;
    const parallaxX = posX + dx;
    const parallaxY = posY + dy;
    return {
      borderRadius: `${cornerRadius}px`,
      backgroundImage: backgroundImageUrl.value
        ? `url(${backgroundImageUrl.value})`
        : "none",
      backgroundSize: `${winW * scale}%`,
      backgroundPosition: `var(--distortion-background-position, ${parallaxX}% ${parallaxY}%)`,
      filter: isFirefox ? undefined : `url(#${filterId})`, // SVG filter applied HERE
      opacity: 1,
    };
  });

  // Enhanced card style with better Apple Liquid Glass properties
  const cardStyle = computed(() => {
    const borderAlpha = 0.42;
    const brightness = Math.max(0.5, glassBrightness.value / 100).toFixed(2);
    const contrast = Math.max(0.5, glassContrast.value / 100).toFixed(2);
    const tintHue = glassTintHue.value;
    const tintOpacity = glassTintOpacity.value;
    const shadowIntensity = shadowDepth.value * (isActive.value ? 1.3 : 1);

    return {
      borderRadius: `${cornerRadius}px`,
      transform:
        "var(--distortion-transform, scaleX(1) scaleY(1) translate(0px, 0px))",
      transition: `transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)`,
      boxShadow: isActive.value
        ? `0 18px 60px rgba(0, 0, 0, ${shadowIntensity + 0.2})`
        : `0 24px 70px rgba(6, 10, 24, ${shadowIntensity})`,
      backgroundColor: `hsla(${tintHue}, 50%, 14%, ${clamp(
        tintOpacity * 0.8,
        0.12,
        0.55
      )})`,
      border: `1px solid hsla(${tintHue}, 92%, 86%, ${borderAlpha})`,
      backdropFilter: `blur(${glassBlur.value}px) saturate(${glassSaturation.value}%) brightness(${brightness}) contrast(${contrast})`,
      backgroundImage: `linear-gradient(145deg,
        hsla(${tintHue}, 70%, ${Math.min(82, 60 + tintOpacity * 35)}%, ${clamp(
        tintOpacity * 1.25,
        0.06,
        0.55
      )}) 0%,
        hsla(${tintHue}, 50%, ${Math.max(32, 46 + tintOpacity * 18)}%, ${clamp(
        tintOpacity * 0.9,
        0.05,
        0.42
      )}) 100%)`,
    };
  });

  // Enhanced surface highlight
  const surfaceHighlightStyle = computed(() => ({
    borderRadius: `${cornerRadius}px`,
    background: `linear-gradient(135deg,
      rgba(255, 255, 255, ${surfaceReflection.value * 0.4}) 0%,
      rgba(255, 255, 255, ${surfaceReflection.value * 0.1}) 50%,
      rgba(255, 255, 255, 0.02) 100%)`,
    opacity: "calc(0.7 + var(--distortion-hovered, 0) * 0.3)",
    transition: "opacity 0.3s ease",
  }));

  // Enhanced noise texture
  const noiseTexture =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.3' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E";

  const noiseStyle = computed(() => ({
    borderRadius: `${cornerRadius}px`,
    backgroundImage: `url(${noiseTexture})`,
    backgroundSize: "180px",
    mixBlendMode: "soft-light",
    opacity: clamp(noiseStrength.value * refractionDepth.value, 0, 1),
  }));

  // Enhanced light style with temperature control
  const lightStyle = computed(() => {
    const activeIntensity = highlightIntensity.value;
    const baseIntensity = activeIntensity * 0.6;
    const spread = Math.min(100, 48 + highlightSpread.value * 34);
    const inner = Math.max(12, highlightSpread.value * 14);
    const hue = highlightHue.value;

    const idleOpacity = clamp(baseIntensity + 0.12, 0.18, 0.95);
    const hoverOpacity = clamp(activeIntensity + 0.12, 0.18, 0.95);
    const opacityDelta = hoverOpacity - idleOpacity;

    const idleStartAlpha = clamp(0.45 + baseIntensity * 0.55, 0.35, 0.92);
    const hoverStartAlpha = clamp(0.45 + activeIntensity * 0.55, 0.35, 0.92);
    const startAlphaDelta = hoverStartAlpha - idleStartAlpha;

    const idleMidAlpha = clamp(0.12 + baseIntensity * 0.35, 0.14, 0.6);
    const hoverMidAlpha = clamp(0.12 + activeIntensity * 0.35, 0.14, 0.6);
    const midAlphaDelta = hoverMidAlpha - idleMidAlpha;

    return {
      opacity: `calc(${idleOpacity.toFixed(3)} + var(--distortion-hovered, 0) * ${
        opacityDelta.toFixed(3)
      })`,
      background: `radial-gradient(circle at calc(50% + var(--distortion-light-x, 0%)) calc(30% + var(--distortion-light-y, 0%)),
        hsla(${hue}, 96%, 82%, calc(${idleStartAlpha.toFixed(3)} + var(--distortion-hovered, 0) * ${startAlphaDelta.toFixed(3)})) 0%,
        hsla(${hue}, 98%, 74%, calc(${idleMidAlpha.toFixed(3)} + var(--distortion-hovered, 0) * ${midAlphaDelta.toFixed(3)})) ${inner}%,
        rgba(255, 255, 255, 0) ${spread}%)`,
    };
  });

  // Enhanced outline with surface curvature
  const outlineStyle = computed(() => {
    const hue = glassTintHue.value;
    const idleOpacity = clamp(0.18 + highlightIntensity.value * 0.28, 0.22, 0.6);
    const hoverOpacity = clamp(0.28 + highlightIntensity.value * 0.38, 0.3, 0.75);
    const baseOpacity = idleOpacity * surfaceReflection.value;
    const hoverOpacityTotal = hoverOpacity * surfaceReflection.value;
    const opacityDelta = hoverOpacityTotal - baseOpacity;
    return {
      borderRadius: `${cornerRadius}px`,
      width: `${glassSize.width}px`,
      height: `${glassSize.height}px`,
      transform:
        "var(--distortion-transform, scaleX(1) scaleY(1) translate(0px, 0px))",
      transition: `transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)`,
      opacity: `calc(${baseOpacity.toFixed(3)} + var(--distortion-hovered, 0) * ${
        opacityDelta.toFixed(3)
      })`,
      background: `linear-gradient(calc(135deg + var(--distortion-outline-rotation, 0deg)),
        hsla(${hue}, 95%, 86%, 0.08) 0%,
        hsla(${hue}, 96%, 78%, ${0.52 * surfaceReflection.value}) 50%,
        hsla(${hue}, 92%, 68%, 0.16) 100%)`,
    };
  });

  // Core system functions
  const updateGlassSize = () => {
    if (!glassRef.value) return;
    const rect = glassRef.value.getBoundingClientRect();
    glassSize.width = Math.round(rect.width);
    glassSize.height = Math.round(rect.height);
    // Триггерим обновление liquidStyle
    // (computed автоматически пересчитается)
  };

  const generateShaderDisplacementMap = () => {
    if (typeof window === "undefined") {
      return;
    }
    const generator = new ShaderDisplacementGenerator({
      width: Math.max(1, Math.floor(glassSize.width)),
      height: Math.max(1, Math.floor(glassSize.height)),
      cornerRadius: shaderCornerRadius.value,
      distortionStart: shaderDistortionStart.value,
      distortionEnd: shaderDistortionEnd.value,
      distortionOffset: shaderDistortionOffset.value,
      scalingStart: shaderScalingStart.value,
      scalingEnd: shaderScalingEnd.value,
    });
    shaderMapUrl.value = generator.updateShader();
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

  // Apple Liquid Glass Presets

  // Lifecycle
  onMounted(() => {
    filterReady.value = true;
    updateGlassSize();
    scheduleShaderGeneration();
    window.addEventListener("resize", updateGlassSize);
    // Значения по умолчанию
    if (defaultOptions.displacementScale !== undefined) {
      displacementScale.value = defaultOptions.displacementScale;
    } else {
      displacementScale.value = 65;
    }
    if (defaultOptions.aberrationIntensity !== undefined) {
      aberrationIntensity.value = defaultOptions.aberrationIntensity;
    } else {
      aberrationIntensity.value = 2.8;
    }
    if (defaultOptions.surfaceCurvature !== undefined) {
      displacementCurvature.value = defaultOptions.surfaceCurvature;
    } else if (defaultOptions.displacementCurvature !== undefined) {
      displacementCurvature.value = defaultOptions.displacementCurvature;
    } else {
      displacementCurvature.value = 1.8;
    }
    if (defaultOptions.glassBlur !== undefined) {
      glassBlur.value = defaultOptions.glassBlur;
    } else {
      glassBlur.value = 25;
    }
    if (defaultOptions.glassSaturation !== undefined) {
      glassSaturation.value = defaultOptions.glassSaturation;
    } else {
      glassSaturation.value = 185;
    }
    // glassOpacity removed, always 100%
    if (defaultOptions.refractionDepth !== undefined) {
      refractionDepth.value = defaultOptions.refractionDepth;
    } else {
      refractionDepth.value = 2.0;
    }
    if (defaultOptions.surfaceReflection !== undefined) {
      surfaceReflection.value = defaultOptions.surfaceReflection;
    } else {
      surfaceReflection.value = 0.45;
    }
    if (defaultOptions.highlightIntensity !== undefined) {
      highlightIntensity.value = defaultOptions.highlightIntensity;
    } else {
      highlightIntensity.value = 0.75;
    }
    if (defaultOptions.highlightSpread !== undefined) {
      highlightSpread.value = defaultOptions.highlightSpread;
    } else {
      highlightSpread.value = 1.1;
    }
    if (defaultOptions.highlightHue !== undefined) {
      highlightHue.value = defaultOptions.highlightHue;
    } else {
      highlightHue.value = 210;
    }
    if (defaultOptions.shadowDepth !== undefined) {
      shadowDepth.value = defaultOptions.shadowDepth;
    } else {
      shadowDepth.value = 0.4;
    }
    glassBrightness.value = 115;
    glassContrast.value = 118;
    glassTintHue.value = 210;
    glassTintOpacity.value = 0.38;
    noiseStrength.value = 0.22;
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateGlassSize);
  });

  watch(
    () => [
      glassSize.width,
      glassSize.height,
      shaderCornerRadius.value,
      shaderDistortionStart.value,
      shaderDistortionEnd.value,
      shaderDistortionOffset.value,
      shaderScalingStart.value,
      shaderScalingEnd.value
    ],
    () => {
      scheduleShaderGeneration();
    }
  );

  return {
    mode,
    displacementScale,
    aberrationIntensity,
    displacementCurvature,
    glassBlur,
    glassSaturation,
    refractionDepth,
    surfaceReflection,
    shadowDepth,
    shaderCornerRadius,
    shaderDistortionStart,
    shaderDistortionEnd,
    shaderDistortionOffset,
    shaderScalingStart,
    shaderScalingEnd,
    filterReady,
    glassSize,
    filterId,
    currentMap,
    edgeIntensityMatrix,
    redScale,
    greenScale,
    liquidGlassBlur,
    surfaceEnhancementMatrix,
    glassRef,
    cardStyle,
    liquidStyle,
    noiseStyle,
    surfaceHighlightStyle,
    lightStyle,
    outlineStyle,
  };
}
