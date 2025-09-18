<template>
  <div class="glass-demo">
    <div class="glass-demo__background" :style="backgroundStyle" />

    <div class="glass-demo__layout">
      <div class="glass-demo__card-wrapper">
        <svg
          v-if="filterReady"
          class="glass-demo__filter"
          aria-hidden="true"
          :style="{
            width: `${glassSize.width}px`,
            height: `${glassSize.height}px`,
          }"
        >
          <defs>
            <!-- Advanced Apple Liquid Glass Filter -->
            <filter
              :id="filterId"
              x="-35%"
              y="-35%"
              width="170%"
              height="170%"
              color-interpolation-filters="sRGB"
            >
              <!-- Displacement Map Source -->
              <feImage
                x="0"
                y="0"
                width="100%"
                height="100%"
                result="DISPLACEMENT_MAP"
                preserveAspectRatio="xMidYMid slice"
                :href="currentMap"
              />

              <!-- Enhanced Edge Intensity Processing -->
              <feColorMatrix
                in="DISPLACEMENT_MAP"
                type="matrix"
                :values="edgeIntensityMatrix"
                result="EDGE_INTENSITY"
              />

              <!-- Apple-style Edge Masking -->
              <feComponentTransfer in="EDGE_INTENSITY" result="EDGE_MASK">
                <feFuncA type="discrete" :tableValues="edgeMaskTable" />
              </feComponentTransfer>

              <!-- Preserve Center Original -->
              <feOffset
                in="SourceGraphic"
                dx="0"
                dy="0"
                result="CENTER_ORIGINAL"
              />

              <!-- Red Channel Displacement (X-axis distortion) -->
              <feDisplacementMap
                in="SourceGraphic"
                in2="DISPLACEMENT_MAP"
                xChannelSelector="R"
                yChannelSelector="B"
                :scale="redScale"
                result="RED_DISPLACED"
              />
              <feColorMatrix
                in="RED_DISPLACED"
                type="matrix"
                values="1 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0"
                result="RED_CHANNEL"
              />

              <!-- Green Channel Displacement (Slight chromatic aberration) -->
              <feDisplacementMap
                in="SourceGraphic"
                in2="DISPLACEMENT_MAP"
                xChannelSelector="R"
                yChannelSelector="B"
                :scale="greenScale"
                result="GREEN_DISPLACED"
              />
              <feColorMatrix
                in="GREEN_DISPLACED"
                type="matrix"
                values="0 0 0 0 0
                        0 1 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0"
                result="GREEN_CHANNEL"
              />

              <!-- Blue Channel Displacement (Y-axis distortion) -->
              <feDisplacementMap
                in="SourceGraphic"
                in2="DISPLACEMENT_MAP"
                xChannelSelector="R"
                yChannelSelector="B"
                :scale="0"
                result="BLUE_DISPLACED"
              />
              <feColorMatrix
                in="BLUE_DISPLACED"
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 1 0 0
                        0 0 0 1 0"
                result="BLUE_CHANNEL"
              />

              <!-- Combine Color Channels for Chromatic Aberration -->
              <feBlend
                in="GREEN_CHANNEL"
                in2="BLUE_CHANNEL"
                mode="screen"
                result="GB_COMBINED"
              />
              <feBlend
                in="RED_CHANNEL"
                in2="GB_COMBINED"
                mode="screen"
                result="RGB_COMBINED"
              />

              <!-- Apple Liquid Glass Blur Effect -->
              <feGaussianBlur
                :stdDeviation="liquidGlassBlur"
                in="RGB_COMBINED"
                result="ABERRATED_BLURRED"
              />

              <!-- Apply Edge Effects -->
              <feComposite
                in="ABERRATED_BLURRED"
                in2="EDGE_MASK"
                operator="in"
                result="EDGE_ABERRATION"
              />

              <!-- Create Inverted Mask for Center -->
              <feComponentTransfer in="EDGE_MASK" result="INVERTED_MASK">
                <feFuncA type="table" tableValues="1 0" />
              </feComponentTransfer>
              <feComposite
                in="CENTER_ORIGINAL"
                in2="INVERTED_MASK"
                operator="in"
                result="CENTER_CLEAN"
              />

              <!-- Final Composite -->
              <feComposite
                in="EDGE_ABERRATION"
                in2="CENTER_CLEAN"
                operator="over"
                result="FINAL_EFFECT"
              />

              <!-- Apple Surface Enhancement -->
              <feColorMatrix
                in="FINAL_EFFECT"
                type="matrix"
                :values="surfaceEnhancementMatrix"
              />
            </filter>
          </defs>
        </svg>

        <div
          ref="glassRef"
          class="glass-demo__card"
          :style="cardStyle"
          @mouseenter="handleEnter"
          @mouseleave="handleLeave"
          @mousedown="handleDown"
          @mouseup="handleUp"
          @mousemove="handleMouseMove"
        >
          <!-- Liquid Glass Layer - Only this gets the SVG distortion filter -->
          <div class="glass-demo__liquid" :style="liquidStyle" />

          <!-- Surface Effects -->
          <div class="glass-demo__noise" :style="noiseStyle" />
          <div
            class="glass-demo__surface-highlight"
            :style="surfaceHighlightStyle"
          />

          <!-- Content Layer - Always stays clear -->
          <div class="glass-demo__card-content">
            <h2>Apple Liquid Glass</h2>
            <p>
              Experience the revolutionary liquid glass with real refraction
              physics. Notice how the background distorts through the glass
              while text stays crystal clear.
            </p>
            <button type="button" class="glass-demo__button">
              Explore Magic
            </button>
          </div>

          <!-- Dynamic Light Effects -->
          <div class="glass-demo__light" :style="lightStyle" />
        </div>

        <span class="glass-demo__outline" :style="outlineStyle" />
      </div>

      <aside class="glass-demo__controls">
        <h3>Apple Liquid Glass Engine</h3>

        <section class="glass-demo__section">
          <h4>Surface Physics</h4>

          <label class="glass-demo__field">
            <span>Displacement Mode</span>
            <select v-model="mode">
              <option v-for="option in modes" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </label>

          <label class="glass-demo__field">
            <span>Liquid Glass Strength</span>
            <input
              type="range"
              min="10"
              max="120"
              v-model.number="displacementScale"
            />
            <strong>{{ displacementScale }}</strong>
          </label>

          <label class="glass-demo__field">
            <span>Chromatic Aberration</span>
            <input
              type="range"
              min="0"
              max="8"
              step="0.1"
              v-model.number="aberrationIntensity"
            />
            <strong>{{ aberrationIntensity.toFixed(1) }}</strong>
          </label>

          <label class="glass-demo__field">
            <span>Edge Softness</span>
            <input
              type="range"
              min="30"
              max="90"
              v-model.number="edgeFeather"
            />
            <strong>{{ edgeFeather }}</strong>
          </label>

          <label class="glass-demo__field">
            <span>Edge Definition</span>
            <input
              type="range"
              min="0.05"
              max="0.6"
              step="0.01"
              v-model.number="edgeSharpness"
            />
            <strong>{{ edgeSharpness.toFixed(2) }}</strong>
          </label>

          <label class="glass-demo__field">
            <span>Surface Curvature</span>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              v-model.number="surfaceCurvature"
            />
            <strong>{{ surfaceCurvature.toFixed(1) }}</strong>
          </label>
        </section>

        <section class="glass-demo__section">
          <h4>Glass Material</h4>

          <label class="glass-demo__field">
            <span>Backdrop Blur</span>
            <input type="range" min="8" max="40" v-model.number="glassBlur" />
            <strong>{{ glassBlur }}px</strong>
          </label>

          <label class="glass-demo__field">
            <span>Material Saturation</span>
            <input
              type="range"
              min="120"
              max="280"
              step="10"
              v-model.number="glassSaturation"
            />
            <strong>{{ glassSaturation }}%</strong>
          </label>

          <label class="glass-demo__field">
            <span>Glass Opacity</span>
            <input
              type="range"
              min="0.35"
              max="0.85"
              step="0.01"
              v-model.number="glassOpacity"
            />
            <strong>{{ Math.round(glassOpacity * 100) }}%</strong>
          </label>

          <label class="glass-demo__field">
            <span>Refraction Depth</span>
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.1"
              v-model.number="refractionDepth"
            />
            <strong>{{ refractionDepth.toFixed(1) }}</strong>
          </label>

          <label class="glass-demo__field">
            <span>Surface Reflection</span>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.01"
              v-model.number="surfaceReflection"
            />
            <strong>{{ Math.round(surfaceReflection * 100) }}%</strong>
          </label>
        </section>

        <section class="glass-demo__section">
          <h4>Light & Shadow</h4>

          <!-- Highlight Intensity, Highlight Spread, and Light Temperature controls removed as requested -->

          <label class="glass-demo__field">
            <span>Depth Shadows</span>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.01"
              v-model.number="shadowDepth"
            />
            <strong>{{ Math.round(shadowDepth * 100) }}%</strong>
          </label>
        </section>

        <section class="glass-demo__section">
          <h4>Advanced Effects</h4>

          <!-- Backdrop Brightness and Backdrop Contrast controls removed as requested -->

          <!-- Tint Hue, Tint Intensity, and Surface Texture controls removed as requested -->

          <label class="glass-demo__field">
            <span>Dynamic Parallax</span>
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.01"
              v-model.number="parallaxIntensity"
            />
            <strong>{{ parallaxIntensity.toFixed(2) }}</strong>
          </label>
        </section>

        <div class="glass-demo__presets">
          <button
            class="glass-demo__preset-btn"
            @click="applyAppleLiquidGlassPreset"
          >
            🍎 Apple Liquid Glass
          </button>
          <button
            class="glass-demo__preset-btn glass-demo__preset-btn--secondary"
            @click="applyMinimalGlassPreset"
          >
            ✨ Minimal Glass
          </button>
          <button
            class="glass-demo__preset-btn glass-demo__preset-btn--secondary"
            @click="applyIntenseGlassPreset"
          >
            🔥 Intense Refraction
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
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
import backgroundImageUrl from "../../assets/grd.jpg";

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

// Background style
const backgroundStyle = computed(() => ({
  backgroundImage: `url(${backgroundImageUrl})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "absolute",
  top: `${window.scrollY}px`,
  left: "0",
  width: "100vw",
  height: "100vh",
}));

// Liquid layer style - THIS IS WHERE THE MAGIC HAPPENS
// Only this layer gets the SVG distortion filter applied to show distorted background
const liquidStyle = computed(() => {
  // Получаем позицию блока относительно окна
  let offsetX = 0;
  let offsetY = 0;
  let winW = window.innerWidth;
  let winH = window.innerHeight;
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
  // Добавляем параллакс
  const parallaxX = clamp(
    posX - mouseOffset.x * parallaxIntensity.value,
    0,
    100
  );
  const parallaxY = clamp(
    posY - mouseOffset.y * parallaxIntensity.value,
    0,
    100
  );
  return {
    borderRadius: `${cornerRadius}px`,
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: `${winW}px ${winH}px`,
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
</script>

<style scoped>
.glass-demo {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px clamp(24px, 4vw, 64px);
  box-sizing: border-box;
  background: radial-gradient(
    circle at top,
    rgba(8, 12, 26, 0.65),
    rgba(4, 6, 12, 0.9)
  );
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.glass-demo__background {
  position: fixed;
  inset: 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 0;
  transform: translateZ(0);
}

.glass-demo__layout {
  position: relative;
  z-index: 1;
  width: min(100%, 1200px);
  display: grid;
  gap: clamp(32px, 5vw, 64px);
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  align-items: center;
}

.glass-demo__card-wrapper {
  position: relative;
  justify-self: center;
  width: min(100%, 460px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  box-sizing: border-box;
}

.glass-demo__filter {
  position: absolute;
  top: 18px;
  left: 18px;
  pointer-events: none;
  z-index: 1;
}

.glass-demo__card {
  position: relative;
  width: 100%;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px clamp(24px, 5vw, 36px);
  box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.25s ease, border 0.25s ease, background 0.25s ease;
  isolation: isolate;
  will-change: transform;
}

/* THE MAGIC LAYER - Only this gets SVG distortion filter */
.glass-demo__liquid {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  pointer-events: none;
}

.glass-demo__surface-highlight {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.glass-demo__noise {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background-repeat: repeat;
}

.glass-demo__card-content {
  position: relative;
  z-index: 4;
  color: #f4f6fb;
}

.glass-demo__card-content h2 {
  margin: 0 0 16px;
  font-size: clamp(1.8rem, 2.6vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.85) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-demo__card-content p {
  margin: 0 0 24px;
  color: rgba(239, 243, 255, 0.9);
  line-height: 1.65;
  font-size: 1rem;
}

.glass-demo__button {
  border: none;
  outline: none;
  font-size: 1rem;
  font-weight: 700;
  padding: 14px 24px;
  border-radius: 999px;
  background: linear-gradient(
    135deg,
    rgba(21, 110, 255, 0.9) 0%,
    rgba(21, 110, 255, 0.95) 100%
  );
  color: white;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(21, 110, 255, 0.4);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(21, 110, 255, 0.3);
}

.glass-demo__button:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(21, 110, 255, 0.5);
  background: linear-gradient(
    135deg,
    rgba(21, 110, 255, 0.95) 0%,
    rgba(21, 110, 255, 1) 100%
  );
}

.glass-demo__light {
  position: absolute;
  inset: -30% 0 0;
  z-index: 3;
  mix-blend-mode: screen;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.glass-demo__outline {
  position: absolute;
  top: 18px;
  left: 18px;
  padding: 1.5px;
  border-radius: 32px;
  mix-blend-mode: screen;
  pointer-events: none;
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4) inset,
    0 1px 4px rgba(0, 0, 0, 0.45) inset;
}

.glass-demo__controls {
  background: rgba(5, 8, 16, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: clamp(24px, 4vw, 36px);
  border-radius: 28px;
  backdrop-filter: blur(25px);
  color: rgba(244, 247, 255, 0.9);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
  display: grid;
  gap: 28px;
  max-height: 85vh;
  overflow-y: auto;
}

.glass-demo__controls h3 {
  margin: 0 0 12px;
  font-size: 1.3rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-demo__section {
  display: grid;
  gap: 20px;
}

.glass-demo__section h4 {
  margin: 0 0 8px;
  font-size: 0.9rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 700;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
}

.glass-demo__field {
  display: grid;
  gap: 8px;
  font-size: 0.9rem;
}

.glass-demo__field span {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

.glass-demo__field input[type="range"] {
  width: 100%;
  margin: 4px 0;
  accent-color: #007aff;
}

.glass-demo__field select {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  font-size: 0.9rem;
  font-weight: 500;
}

.glass-demo__field strong {
  justify-self: flex-end;
  font-variant-numeric: tabular-nums;
  color: #007aff;
  font-weight: 700;
  background: rgba(0, 122, 255, 0.1);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.85rem;
}

.glass-demo__presets {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.glass-demo__preset-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #007aff 0%, #0056cc 100%);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 10px 35px rgba(0, 122, 255, 0.3);
}

.glass-demo__preset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 45px rgba(0, 122, 255, 0.4);
}

.glass-demo__preset-btn--secondary {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.06) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);
}

.glass-demo__preset-btn--secondary:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.18) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.2);
}

/* Custom scrollbar */
.glass-demo__controls::-webkit-scrollbar {
  width: 6px;
}

.glass-demo__controls::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.glass-demo__controls::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

@media (max-width: 768px) {
  .glass-demo {
    padding: 32px 24px 64px;
  }

  .glass-demo__card-wrapper {
    width: 100%;
  }

  .glass-demo__controls {
    max-height: 70vh;
  }
}
</style>
