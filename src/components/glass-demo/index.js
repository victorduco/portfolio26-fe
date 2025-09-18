import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { ShaderDisplacementGenerator } from "./shader-generator.ts";
import backgroundImageUrl from "../../assets/grd3.png";

export default function useGlassDemo() {
  // Enhanced modes for Apple Liquid Glass
  const modes = ["shader"];
  const mode = ref("shader");

  // Core displacement parameters
  const displacementScale = ref(60);
  const aberrationIntensity = ref(2.4);
  const edgeFeather = ref(68);
  const edgeSharpness = ref(0.18);
  const surfaceCurvature = ref(1.5);

  // Glass material properties
  const glassBlur = ref(28);
  const glassSaturation = ref(180);
  const glassOpacity = ref(0.58);
  const refractionDepth = ref(1.8);
  const surfaceReflection = ref(0.4);

  // Light and shadow
  const highlightIntensity = ref(0.68);
  const highlightSpread = ref(1.05);
  const highlightHue = ref(210);
  const shadowDepth = ref(0.35);

  // Advanced effects
  const glassBrightness = ref(110);
  const glassContrast = ref(112);
  const glassTintHue = ref(210);
  const glassTintOpacity = ref(0.32);
  const noiseStrength = ref(0.18);
  const parallaxIntensity = ref(0.36);

  // Core system
  const cornerRadius = 32;
  const glassRef = ref(null);
  const filterId = `apple-liquid-glass-${Math.random().toString(36).slice(2)}`;
  const filterReady = ref(false);
  const shaderMapUrl = ref("");
  const isActive = ref(false);
  const isHovered = ref(false);
  const mouseOffset = reactive({ x: 0, y: 0 });
  const glassSize = reactive({ width: 320, height: 160 });

  const isFirefox =
    typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getMap = (currentMode, shaderUrl) => {
    return shaderUrl;
  };

  // Enhanced computed properties for Apple Liquid Glass
  const currentMap = computed(() => getMap(mode.value, shaderMapUrl.value));

  const edgeMaskStop = computed(() => clamp(edgeFeather.value, 20, 95));
  const edgeMaskTable = computed(() => `0 ${edgeSharpness.value.toFixed(2)} 1`);
  const displacementSign = computed(() => (mode.value === "shader" ? 1 : -1));

  // Enhanced displacement scaling with surface curvature
  const redScale = computed(
    () =>
      displacementScale.value * displacementSign.value * surfaceCurvature.value
  );
  const greenScale = computed(
    () =>
      displacementScale.value *
      surfaceCurvature.value *
      (displacementSign.value - aberrationIntensity.value * 0.05)
  );
  const blueScale = computed(
    () =>
      displacementScale.value *
      surfaceCurvature.value *
      (displacementSign.value - aberrationIntensity.value * 0.1)
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
    console.log("winW, winH", winW, winH);
    if (glassRef.value) {
      const rect = glassRef.value.getBoundingClientRect();
      offsetX = rect.left;
      offsetY = rect.top;
      winW = window.innerWidth;
      winH = window.innerHeight;
    }
    // Вычисляем процент смещения для backgroundPosition
    const posX = ((offsetX + glassSize.width / 2) / winW) * 100;
    const posY = ((offsetY + glassSize.height / 2) / winH) * 100;
    let dx = -5.7;
    let dy = -24.9;
    //Добавляем параллакс
    let parallaxToggle = true;
    let parallaxX = posX + dx;
    let parallaxY = posY + dy;
    if (parallaxToggle) {
      parallaxX = clamp(
        parallaxX - mouseOffset.x * parallaxIntensity.value,
        0,
        100
      );
      parallaxY = clamp(
        parallaxY - mouseOffset.y * parallaxIntensity.value,
        0,
        100
      );
    }
    return {
      borderRadius: `${cornerRadius}px`,
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundSize: `${winW * scale}%`,
      backgroundPosition: `${parallaxX}% ${parallaxY}%`,
      filter: isFirefox ? undefined : `url(#${filterId})`, // SVG filter applied HERE
      opacity: clamp(0.75 + glassOpacity.value * 0.35, 0.65, 1),
    };
  });

  // Enhanced card transform with surface curvature
  const cardTransform = computed(() => {
    const curvature = surfaceCurvature.value * 0.5;
    const scaleX =
      1 + Math.max(-0.2, Math.min(0.2, mouseOffset.x / 120)) * curvature;
    const scaleY =
      1 + Math.max(-0.2, Math.min(0.2, mouseOffset.y / 160)) * curvature;
    const translateX = mouseOffset.x * 0.35;
    const translateY = mouseOffset.y * 0.35;
    return `scaleX(${scaleX.toFixed(3)}) scaleY(${scaleY.toFixed(
      3
    )}) translate(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px)`;
  });

  // Enhanced card style with better Apple Liquid Glass properties
  const cardStyle = computed(() => {
    const borderAlpha = clamp(
      0.1 + glassOpacity.value * 0.28,
      0.16,
      0.42
    ).toFixed(3);
    const brightness = Math.max(0.5, glassBrightness.value / 100).toFixed(2);
    const contrast = Math.max(0.5, glassContrast.value / 100).toFixed(2);
    const tintHue = glassTintHue.value;
    const tintOpacity = glassTintOpacity.value;
    const shadowIntensity = shadowDepth.value * (isActive.value ? 1.3 : 1);

    return {
      borderRadius: `${cornerRadius}px`,
      transform: cardTransform.value,
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
    opacity: isHovered.value ? 1 : 0.7,
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
    const intensity = isHovered.value
      ? highlightIntensity.value
      : highlightIntensity.value * 0.6;
    const spread = Math.min(100, 48 + highlightSpread.value * 34);
    const inner = Math.max(12, highlightSpread.value * 14);
    const hue = highlightHue.value;
    return {
      opacity: clamp(intensity + 0.12, 0.18, 0.95),
      background: `radial-gradient(circle at ${50 + mouseOffset.x * 0.35}% ${
        30 + mouseOffset.y * 0.22
      }%,
        hsla(${hue}, 96%, 82%, ${clamp(
        0.45 + intensity * 0.55,
        0.35,
        0.92
      ).toFixed(3)}) 0%,
        hsla(${hue}, 98%, 74%, ${clamp(
        0.12 + intensity * 0.35,
        0.14,
        0.6
      ).toFixed(3)}) ${inner}%,
        rgba(255, 255, 255, 0) ${spread}%)`,
    };
  });

  // Enhanced outline with surface curvature
  const outlineStyle = computed(() => {
    const hue = glassTintHue.value;
    const opacity = isHovered.value
      ? clamp(0.28 + highlightIntensity.value * 0.38, 0.3, 0.75)
      : clamp(0.18 + highlightIntensity.value * 0.28, 0.22, 0.6);
    return {
      borderRadius: `${cornerRadius}px`,
      width: `${glassSize.width}px`,
      height: `${glassSize.height}px`,
      transform: cardTransform.value,
      transition: `transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)`,
      opacity: opacity * surfaceReflection.value,
      background: `linear-gradient(${135 + mouseOffset.x * 1.2}deg,
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
    if (mode.value !== "shader" || typeof window === "undefined") {
      return;
    }
    const generator = new ShaderDisplacementGenerator({
      width: Math.max(1, Math.floor(glassSize.width)),
      height: Math.max(1, Math.floor(glassSize.height)),
    });
    shaderMapUrl.value = generator.updateShader();
    generator.destroy();
  };

  const scheduleShaderGeneration = () => {
    if (mode.value !== "shader") {
      shaderMapUrl.value = "";
      return;
    }
    nextTick(() => {
      requestAnimationFrame(() => {
        updateGlassSize();
        generateShaderDisplacementMap();
      });
    });
  };

  // Event handlers
  const handleMouseMove = (event) => {
    if (!glassRef.value) return;
    const rect = glassRef.value.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * 100;
    const relativeY = ((event.clientY - rect.top) / rect.height) * 100;
    mouseOffset.x = Math.max(-50, Math.min(50, relativeX - 50));
    mouseOffset.y = Math.max(-50, Math.min(50, relativeY - 50));
  };

  const handleEnter = () => {
    isHovered.value = true;
  };

  const handleDown = () => {
    isActive.value = true;
  };

  const handleUp = () => {
    isActive.value = false;
  };

  const handleLeave = () => {
    isHovered.value = false;
    isActive.value = false;
    mouseOffset.x = 0;
    mouseOffset.y = 0;
  };

  // Apple Liquid Glass Presets
  const applyAppleLiquidGlassPreset = () => {
    mode.value = "shader";
    displacementScale.value = 65;
    aberrationIntensity.value = 2.8;
    edgeFeather.value = 72;
    edgeSharpness.value = 0.22;
    surfaceCurvature.value = 1.8;
    glassBlur.value = 25;
    glassSaturation.value = 185;
    glassOpacity.value = 0.62;
    refractionDepth.value = 2.0;
    surfaceReflection.value = 0.45;
    highlightIntensity.value = 0.75;
    highlightSpread.value = 1.1;
    highlightHue.value = 210;
    shadowDepth.value = 0.4;
    glassBrightness.value = 115;
    glassContrast.value = 118;
    glassTintHue.value = 210;
    glassTintOpacity.value = 0.38;
    noiseStrength.value = 0.22;
    parallaxIntensity.value = 0.4;
  };

  const applyMinimalGlassPreset = () => {
    mode.value = "standard";
    displacementScale.value = 35;
    aberrationIntensity.value = 1.2;
    edgeFeather.value = 75;
    edgeSharpness.value = 0.15;
    surfaceCurvature.value = 1.0;
    glassBlur.value = 18;
    glassSaturation.value = 160;
    glassOpacity.value = 0.45;
    refractionDepth.value = 1.2;
    surfaceReflection.value = 0.25;
    highlightIntensity.value = 0.5;
    highlightSpread.value = 0.8;
    highlightHue.value = 200;
    shadowDepth.value = 0.25;
    glassBrightness.value = 105;
    glassContrast.value = 108;
    glassTintHue.value = 200;
    glassTintOpacity.value = 0.25;
    noiseStrength.value = 0.12;
    parallaxIntensity.value = 0.25;
  };

  const applyIntenseGlassPreset = () => {
    mode.value = "prominent";
    displacementScale.value = 95;
    aberrationIntensity.value = 4.5;
    edgeFeather.value = 65;
    edgeSharpness.value = 0.35;
    surfaceCurvature.value = 2.5;
    glassBlur.value = 35;
    glassSaturation.value = 220;
    glassOpacity.value = 0.75;
    refractionDepth.value = 2.5;
    surfaceReflection.value = 0.65;
    highlightIntensity.value = 0.9;
    highlightSpread.value = 1.4;
    highlightHue.value = 220;
    shadowDepth.value = 0.6;
    glassBrightness.value = 125;
    glassContrast.value = 125;
    glassTintHue.value = 220;
    glassTintOpacity.value = 0.5;
    noiseStrength.value = 0.35;
    parallaxIntensity.value = 0.6;
  };

  // Lifecycle
  onMounted(() => {
    filterReady.value = true;
    updateGlassSize();
    scheduleShaderGeneration();
    window.addEventListener("resize", updateGlassSize);
    // Apply Apple preset by default
    applyAppleLiquidGlassPreset();
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateGlassSize);
  });

  watch(mode, () => {
    scheduleShaderGeneration();
  });

  watch(
    () => [glassSize.width, glassSize.height],
    () => {
      scheduleShaderGeneration();
    }
  );

  return {
    modes,
    mode,
    displacementScale,
    aberrationIntensity,
    edgeFeather,
    edgeSharpness,
    surfaceCurvature,
    glassBlur,
    glassSaturation,
    glassOpacity,
    refractionDepth,
    surfaceReflection,
    shadowDepth,
    parallaxIntensity,
    filterReady,
    glassSize,
    filterId,
    currentMap,
    edgeIntensityMatrix,
    edgeMaskTable,
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
    handleEnter,
    handleLeave,
    handleDown,
    handleUp,
    handleMouseMove,
    applyAppleLiquidGlassPreset,
    applyMinimalGlassPreset,
    applyIntenseGlassPreset,
  };
}
