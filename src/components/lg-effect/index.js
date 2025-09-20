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
import { createGlassConfig } from "./defaults.js";
import defaultBackgroundImageUrl from "../../assets/grd3.png";

export default function useGlassDemo({
  backgroundImageUrl: backgroundImageOption,
  ...userOptions
} = {}) {

  // Input handling
  const backgroundImageUrl = computed(() =>
    isRef(backgroundImageOption)
      ? backgroundImageOption.value || defaultBackgroundImageUrl
      : "none"
  );
  const options = createGlassConfig(userOptions);

  // Core system
  const cornerRadius = 32;
  const glassElementRef = ref(null);
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
    () => options.displacementScale * options.displacementCurvature
  );
  const greenScale = computed(
    () =>
      options.displacementScale *
      options.displacementCurvature *
      (1 - options.aberrationIntensity * 0.05)
  );

  // Apple Liquid Glass specific blur
  const liquidGlassBlur = computed(() =>
    Math.max(0.12, options.glassBlur * 0.02 * options.refractionDepth)
  );

  // Enhanced edge intensity matrix
  const edgeIntensityMatrix = computed(() => {
    const intensity = options.surfaceReflection;
    return `${0.3 * intensity} ${0.3 * intensity} ${0.3 * intensity} 0 0
            ${0.3 * intensity} ${0.3 * intensity} ${0.3 * intensity} 0 0
            ${0.3 * intensity} ${0.3 * intensity} ${0.3 * intensity} 0 0
            0 0 0 1 0`;
  });

  // Surface enhancement matrix for glass realism
  const surfaceEnhancementMatrix = computed(() => {
    const contrast = 1 + (options.glassSaturation - 180) / 300;
    const brightness = 1 + options.surfaceReflection * 0.2;
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
    if (glassElementRef.value) {
      const rect = glassElementRef.value.getBoundingClientRect();
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
    const brightness = Math.max(0.5, options.glassBrightness / 100).toFixed(2);
    const contrast = Math.max(0.5, options.glassContrast / 100).toFixed(2);
    const tintHue = options.glassTintHue;
    const tintOpacity = options.glassTintOpacity;
    const shadowIntensity = options.shadowDepth * (isActive.value ? 1.3 : 1);

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
      backdropFilter: `blur(${options.glassBlur}px) saturate(${options.glassSaturation}%) brightness(${brightness}) contrast(${contrast})`,
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
      rgba(255, 255, 255, ${options.surfaceReflection * 0.4}) 0%,
      rgba(255, 255, 255, ${options.surfaceReflection * 0.1}) 50%,
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
    opacity: clamp(options.noiseStrength * options.refractionDepth, 0, 1),
  }));

  // Enhanced light style with temperature control
  const lightStyle = computed(() => {
    const activeIntensity = options.highlightIntensity;
    const baseIntensity = activeIntensity * 0.6;
    const spread = Math.min(100, 48 + options.highlightSpread * 34);
    const inner = Math.max(12, options.highlightSpread * 14);
    const hue = options.highlightHue;

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
      opacity: `calc(${idleOpacity.toFixed(
        3
      )} + var(--distortion-hovered, 0) * ${opacityDelta.toFixed(3)})`,
      background: `radial-gradient(circle at calc(50% + var(--distortion-light-x, 0%)) calc(30% + var(--distortion-light-y, 0%)),
        hsla(${hue}, 96%, 82%, calc(${idleStartAlpha.toFixed(
        3
      )} + var(--distortion-hovered, 0) * ${startAlphaDelta.toFixed(3)})) 0%,
        hsla(${hue}, 98%, 74%, calc(${idleMidAlpha.toFixed(
        3
      )} + var(--distortion-hovered, 0) * ${midAlphaDelta.toFixed(
        3
      )})) ${inner}%,
        rgba(255, 255, 255, 0) ${spread}%)`,
    };
  });

  // Enhanced outline with surface curvature
  const outlineStyle = computed(() => {
    const hue = options.glassTintHue;
    const idleOpacity = clamp(
      0.18 + options.highlightIntensity * 0.28,
      0.22,
      0.6
    );
    const hoverOpacity = clamp(
      0.28 + options.highlightIntensity * 0.38,
      0.3,
      0.75
    );
    const baseOpacity = idleOpacity * options.surfaceReflection;
    const hoverOpacityTotal = hoverOpacity * options.surfaceReflection;
    const opacityDelta = hoverOpacityTotal - baseOpacity;
    return {
      borderRadius: `${cornerRadius}px`,
      width: `${glassSize.width}px`,
      height: `${glassSize.height}px`,
      transform:
        "var(--distortion-transform, scaleX(1) scaleY(1) translate(0px, 0px))",
      transition: `transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)`,
      opacity: `calc(${baseOpacity.toFixed(
        3
      )} + var(--distortion-hovered, 0) * ${opacityDelta.toFixed(3)})`,
      background: `linear-gradient(calc(135deg + var(--distortion-outline-rotation, 0deg)),
        hsla(${hue}, 95%, 86%, 0.08) 0%,
        hsla(${hue}, 96%, 78%, ${0.52 * options.surfaceReflection}) 50%,
        hsla(${hue}, 92%, 68%, 0.16) 100%)`,
    };
  });

  // Core system functions
  const updateGlassSize = () => {
    if (!glassElementRef.value) return;
    const rect = glassElementRef.value.getBoundingClientRect();
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
      cornerRadius: options.shaderCornerRadius,
      distortionStart: options.shaderDistortionStart,
      distortionEnd: options.shaderDistortionEnd,
      distortionOffset: options.shaderDistortionOffset,
      scalingStart: options.shaderScalingStart,
      scalingEnd: options.shaderScalingEnd,
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
    ...options,
    filterReady,
    glassSize,
    filterId,
    currentMap,
    edgeIntensityMatrix,
    redScale,
    greenScale,
    liquidGlassBlur,
    surfaceEnhancementMatrix,
    glassElementRef,
    cardStyle,
    liquidStyle,
    noiseStyle,
    surfaceHighlightStyle,
    lightStyle,
    outlineStyle,
  };
}
