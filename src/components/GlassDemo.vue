<template>
  <div class="glass-demo">
    <div class="glass-demo__background" :style="backgroundStyle" />

    <div class="glass-demo__layout">
      <div class="glass-demo__card-wrapper">
        <svg
          v-if="filterReady"
          class="glass-demo__filter"
          aria-hidden="true"
          :style="{ width: `${glassSize.width}px`, height: `${glassSize.height}px` }"
        >
          <defs>
            <radialGradient :id="`${filterId}-edge-mask`" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="black" stop-opacity="0" />
              <stop :offset="`${edgeMaskStop}%`" stop-color="black" stop-opacity="0" />
              <stop offset="100%" stop-color="white" stop-opacity="1" />
            </radialGradient>
            <filter
              :id="filterId"
              x="-35%"
              y="-35%"
              width="170%"
              height="170%"
              color-interpolation-filters="sRGB"
            >
              <feImage
                x="0"
                y="0"
                width="100%"
                height="100%"
                result="DISPLACEMENT_MAP"
                preserveAspectRatio="xMidYMid slice"
                :href="currentMap"
              />

              <feColorMatrix
                in="DISPLACEMENT_MAP"
                type="matrix"
                values="0.3 0.3 0.3 0 0
                        0.3 0.3 0.3 0 0
                        0.3 0.3 0.3 0 0
                        0 0 0 1 0"
                result="EDGE_INTENSITY"
              />
              <feComponentTransfer in="EDGE_INTENSITY" result="EDGE_MASK">
                <feFuncA type="discrete" :tableValues="edgeMaskTable" />
              </feComponentTransfer>

              <feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER_ORIGINAL" />

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

              <feDisplacementMap
                in="SourceGraphic"
                in2="DISPLACEMENT_MAP"
                xChannelSelector="R"
                yChannelSelector="B"
                :scale="blueScale"
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

              <feBlend in="GREEN_CHANNEL" in2="BLUE_CHANNEL" mode="screen" result="GB_COMBINED" />
              <feBlend in="RED_CHANNEL" in2="GB_COMBINED" mode="screen" result="RGB_COMBINED" />

              <feGaussianBlur :stdDeviation="gaussianBlur" in="RGB_COMBINED" result="ABERRATED_BLURRED" />

              <feComposite in="ABERRATED_BLURRED" in2="EDGE_MASK" operator="in" result="EDGE_ABERRATION" />

              <feComponentTransfer in="EDGE_MASK" result="INVERTED_MASK">
                <feFuncA type="table" tableValues="1 0" />
              </feComponentTransfer>
              <feComposite in="CENTER_ORIGINAL" in2="INVERTED_MASK" operator="in" result="CENTER_CLEAN" />

              <feComposite in="EDGE_ABERRATION" in2="CENTER_CLEAN" operator="over" />
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
          <div class="glass-demo__liquid" :style="liquidStyle" />
          <div class="glass-demo__noise" :style="noiseStyle" />
          <div class="glass-demo__card-content">
            <h2>Liquid Glass Playground</h2>
            <p>
              Move your cursor across the card and tweak the controls to see how
              the displacement filter reacts in real time.
            </p>
            <button type="button" class="glass-demo__button">Explore API</button>
          </div>
          <div class="glass-demo__light" :style="lightStyle" />
        </div>

        <span class="glass-demo__outline" :style="outlineStyle" />
      </div>

      <aside class="glass-demo__controls">
        <h3>Effect controls</h3>
        <section class="glass-demo__section">
          <h4>Displacement</h4>
          <label class="glass-demo__field">
            <span>Mode</span>
            <select v-model="mode">
              <option v-for="option in modes" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </label>

          <label class="glass-demo__field">
            <span>Displacement scale</span>
            <input type="range" min="10" max="120" v-model.number="displacementScale" />
            <strong>{{ displacementScale }}</strong>
          </label>

          <label class="glass-demo__field">
            <span>Aberration</span>
            <input type="range" min="0" max="6" step="0.1" v-model.number="aberrationIntensity" />
            <strong>{{ aberrationIntensity.toFixed(1) }}</strong>
          </label>

          <label class="glass-demo__field">
            <span>Edge feather</span>
            <input type="range" min="30" max="90" v-model.number="edgeFeather" />
            <strong>{{ edgeFeather }}</strong>
          </label>

          <label class="glass-demo__field">
            <span>Edge contrast</span>
            <input type="range" min="0.05" max="0.4" step="0.01" v-model.number="edgeSharpness" />
            <strong>{{ edgeSharpness.toFixed(2) }}</strong>
          </label>
        </section>

        <section class="glass-demo__section">
          <h4>Glass</h4>
          <label class="glass-demo__field">
            <span>Glass blur</span>
            <input type="range" min="12" max="40" v-model.number="glassBlur" />
            <strong>{{ glassBlur }}px</strong>
          </label>

          <label class="glass-demo__field">
            <span>Glass saturation</span>
            <input type="range" min="120" max="280" step="10" v-model.number="glassSaturation" />
            <strong>{{ glassSaturation }}%</strong>
          </label>

          <label class="glass-demo__field">
            <span>Glass opacity</span>
            <input type="range" min="0.35" max="0.85" step="0.01" v-model.number="glassOpacity" />
            <strong>{{ Math.round(glassOpacity * 100) }}%</strong>
          </label>

          <label class="glass-demo__field">
            <span>Highlight intensity</span>
            <input type="range" min="0.2" max="1" step="0.01" v-model.number="highlightIntensity" />
            <strong>{{ highlightIntensity.toFixed(2) }}</strong>
          </label>

          <label class="glass-demo__field">
            <span>Highlight spread</span>
            <input type="range" min="0.6" max="1.6" step="0.01" v-model.number="highlightSpread" />
            <strong>{{ highlightSpread.toFixed(2) }}</strong>
          </label>

          <label class="glass-demo__field">
            <span>Highlight hue</span>
            <input type="range" min="0" max="360" v-model.number="highlightHue" />
            <strong>{{ highlightHue }}°</strong>
          </label>

          <label class="glass-demo__field">
            <span>Backdrop brightness</span>
            <input type="range" min="85" max="140" v-model.number="glassBrightness" />
            <strong>{{ glassBrightness }}%</strong>
          </label>

          <label class="glass-demo__field">
            <span>Backdrop contrast</span>
            <input type="range" min="85" max="135" v-model.number="glassContrast" />
            <strong>{{ glassContrast }}%</strong>
          </label>

          <label class="glass-demo__field">
            <span>Tint hue</span>
            <input type="range" min="0" max="360" v-model.number="glassTintHue" />
            <strong>{{ glassTintHue }}°</strong>
          </label>

          <label class="glass-demo__field">
            <span>Tint saturation</span>
            <input type="range" min="20" max="100" v-model.number="glassTintSaturation" />
            <strong>{{ glassTintSaturation }}%</strong>
          </label>

          <label class="glass-demo__field">
            <span>Tint depth</span>
            <input type="range" min="0.05" max="0.65" step="0.01" v-model.number="glassTintOpacity" />
            <strong>{{ glassTintOpacity.toFixed(2) }}</strong>
          </label>

          <label class="glass-demo__field">
            <span>Surface noise</span>
            <input type="range" min="0" max="0.5" step="0.01" v-model.number="noiseStrength" />
            <strong>{{ noiseStrength.toFixed(2) }}</strong>
          </label>

          <label class="glass-demo__field">
            <span>Parallax</span>
            <input type="range" min="0" max="0.8" step="0.01" v-model.number="parallaxIntensity" />
            <strong>{{ parallaxIntensity.toFixed(2) }}</strong>
          </label>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { ShaderDisplacementGenerator, fragmentShaders } from "../../demos/shader-utils.ts";
import {
  displacementMap,
  polarDisplacementMap,
  prominentDisplacementMap,
} from "../../demos/utils.ts";
import backgroundImageUrl from "../assets/liquid-bg.jpg";

const modes = ["standard", "polar", "prominent", "shader"];
const mode = ref("shader");
const displacementScale = ref(60);
const aberrationIntensity = ref(2.4);
const edgeFeather = ref(68);
const edgeSharpness = ref(0.18);
const glassBlur = ref(28);
const glassSaturation = ref(180);
const glassOpacity = ref(0.58);
const highlightIntensity = ref(0.68);
const highlightSpread = ref(1.05);
const highlightHue = ref(210);
const parallaxIntensity = ref(0.36);
const glassBrightness = ref(110);
const glassContrast = ref(112);
const glassTintHue = ref(210);
const glassTintSaturation = ref(68);
const glassTintOpacity = ref(0.32);
const noiseStrength = ref(0.18);
const cornerRadius = 32;

const glassRef = ref(null);
const filterId = `liquid-glass-${Math.random().toString(36).slice(2)}`;
const filterReady = ref(false);
const shaderMapUrl = ref("");
const isActive = ref(false);
const isHovered = ref(false);
const mouseOffset = reactive({ x: 0, y: 0 });
const glassSize = reactive({ width: 320, height: 160 });

const isFirefox = typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getMap = (currentMode, shaderUrl) => {
  switch (currentMode) {
    case "standard":
      return displacementMap;
    case "polar":
      return polarDisplacementMap;
    case "prominent":
      return prominentDisplacementMap;
    case "shader":
      return shaderUrl || displacementMap;
    default:
      return displacementMap;
  }
};

const currentMap = computed(() => getMap(mode.value, shaderMapUrl.value));

const edgeMaskStop = computed(() => clamp(edgeFeather.value, 20, 95));
const edgeMaskTable = computed(() => `0 ${edgeSharpness.value.toFixed(2)} 1`);
const displacementSign = computed(() => (mode.value === "shader" ? 1 : -1));
const redScale = computed(() => displacementScale.value * displacementSign.value);
const greenScale = computed(
  () => displacementScale.value * (displacementSign.value - aberrationIntensity.value * 0.05),
);
const blueScale = computed(
  () => displacementScale.value * (displacementSign.value - aberrationIntensity.value * 0.1),
);
const gaussianBlur = computed(() => Math.max(0.12, glassBlur.value * 0.02));

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${backgroundImageUrl})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
}));

const liquidStyle = computed(() => {
  const parallaxX = clamp(50 - mouseOffset.x * parallaxIntensity.value, 8, 92);
  const parallaxY = clamp(50 - mouseOffset.y * parallaxIntensity.value, 5, 95);
  return {
    borderRadius: `${cornerRadius}px`,
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: `${parallaxX}% ${parallaxY}%`,
    filter: isFirefox ? undefined : `url(#${filterId})`,
    opacity: clamp(0.75 + glassOpacity.value * 0.35, 0.65, 1),
  };
});

const cardTransform = computed(() => {
  const scaleX = 1 + Math.max(-0.2, Math.min(0.2, mouseOffset.x / 120));
  const scaleY = 1 + Math.max(-0.2, Math.min(0.2, mouseOffset.y / 160));
  const translateX = mouseOffset.x * 0.35;
  const translateY = mouseOffset.y * 0.35;
  return `scaleX(${scaleX.toFixed(3)}) scaleY(${scaleY.toFixed(3)}) translate(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px)`;
});

const cardStyle = computed(() => {
  const borderAlpha = clamp(0.1 + glassOpacity.value * 0.28, 0.16, 0.42).toFixed(3);
  const brightness = Math.max(0.5, glassBrightness.value / 100).toFixed(2);
  const contrast = Math.max(0.5, glassContrast.value / 100).toFixed(2);
  const tintHue = glassTintHue.value;
  const tintSaturation = clamp(glassTintSaturation.value, 0, 100);
  const tintTopOpacity = clamp(glassTintOpacity.value * 1.25, 0.06, 0.55).toFixed(3);
  const tintBottomOpacity = clamp(glassTintOpacity.value * 0.9, 0.05, 0.42).toFixed(3);
  const baseAlpha = clamp(glassTintOpacity.value * 0.5 + glassOpacity.value * 0.25, 0.12, 0.55).toFixed(3);
  return {
    borderRadius: `${cornerRadius}px`,
    transform: cardTransform.value,
    transition: `transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)`,
    boxShadow: isActive.value
      ? "0 18px 60px rgba(0, 0, 0, 0.35)"
      : "0 24px 70px rgba(6, 10, 24, 0.48)",
    backgroundColor: `hsla(${tintHue}, ${Math.max(12, tintSaturation * 0.45)}%, 14%, ${baseAlpha})`,
    border: `1px solid hsla(${tintHue}, 92%, 86%, ${borderAlpha})`,
    backdropFilter: `blur(${glassBlur.value}px) saturate(${glassSaturation.value}%) brightness(${brightness}) contrast(${contrast})`,
    backgroundImage: `linear-gradient(145deg, hsla(${tintHue}, ${tintSaturation}%, ${Math.min(
      82,
      60 + glassTintOpacity.value * 35,
    )}%, ${tintTopOpacity}) 0%, hsla(${tintHue}, ${Math.max(
      32,
      tintSaturation * 0.66,
    )}%, ${Math.max(32, 46 + glassTintOpacity.value * 18)}%, ${tintBottomOpacity}) 100%)`,
  };
});

const noiseTexture =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.3' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E";

const noiseStyle = computed(() => ({
  borderRadius: `${cornerRadius}px`,
  backgroundImage: `url(${noiseTexture})`,
  backgroundSize: "180px",
  mixBlendMode: "soft-light",
  opacity: clamp(noiseStrength.value, 0, 1),
}));

const lightStyle = computed(() => {
  const intensity = isHovered.value ? highlightIntensity.value : highlightIntensity.value * 0.6;
  const spread = Math.min(100, 48 + highlightSpread.value * 34);
  const inner = Math.max(12, highlightSpread.value * 14);
  const hue = highlightHue.value;
  return {
    opacity: clamp(intensity + 0.12, 0.18, 0.95),
    background: `radial-gradient(circle at ${50 + mouseOffset.x * 0.35}% ${30 + mouseOffset.y * 0.22}%, hsla(${hue}, 96%, 82%, ${clamp(
      0.45 + intensity * 0.55,
      0.35,
      0.92,
    ).toFixed(3)}) 0%, hsla(${hue}, 98%, 74%, ${clamp(
      0.12 + intensity * 0.35,
      0.14,
      0.6,
    ).toFixed(3)}) ${inner}%, rgba(255, 255, 255, 0) ${spread}%)`,
  };
});

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
    opacity,
    background: `linear-gradient(${135 + mouseOffset.x * 1.2}deg, hsla(${hue}, 95%, 86%, 0.08) 0%, hsla(${hue}, 96%, 78%, 0.52) 50%, hsla(${hue}, 92%, 68%, 0.16) 100%)`,
  };
});

const updateGlassSize = () => {
  if (!glassRef.value) return;
  const rect = glassRef.value.getBoundingClientRect();
  glassSize.width = Math.round(rect.width);
  glassSize.height = Math.round(rect.height);
};

const generateShaderDisplacementMap = () => {
  if (mode.value !== "shader" || typeof window === "undefined") {
    return;
  }
  const generator = new ShaderDisplacementGenerator({
    width: Math.max(1, Math.floor(glassSize.width)),
    height: Math.max(1, Math.floor(glassSize.height)),
    fragment: fragmentShaders.liquidGlass,
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

onMounted(() => {
  filterReady.value = true;
  updateGlassSize();
  scheduleShaderGeneration();
  window.addEventListener("resize", updateGlassSize);
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
  },
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
  background: radial-gradient(circle at top, rgba(8, 12, 26, 0.65), rgba(4, 6, 12, 0.9));
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
  width: min(100%, 1080px);
  display: grid;
  gap: clamp(32px, 5vw, 64px);
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  align-items: center;
}

.glass-demo__card-wrapper {
  position: relative;
  justify-self: center;
  width: min(100%, 440px);
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
}

.glass-demo__card {
  position: relative;
  width: 100%;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px clamp(24px, 5vw, 32px);
  box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.25s ease, border 0.25s ease, background 0.25s ease;
  isolation: isolate;
}

.glass-demo__liquid {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  pointer-events: none;
}

.glass-demo__noise {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background-repeat: repeat;
}

.glass-demo__card-content {
  position: relative;
  z-index: 3;
  color: #f4f6fb;
}

.glass-demo__card-content h2 {
  margin: 0;
  font-size: clamp(1.6rem, 2.4vw, 2rem);
  letter-spacing: -0.02em;
}

.glass-demo__card-content p {
  margin: 8px 0 20px;
  color: rgba(239, 243, 255, 0.88);
  line-height: 1.6;
}

.glass-demo__button {
  border: none;
  outline: none;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 12px 20px;
  border-radius: 999px;
  background: rgba(21, 110, 255, 0.92);
  color: white;
  cursor: pointer;
  box-shadow: 0 8px 26px rgba(21, 110, 255, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.glass-demo__button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 32px rgba(21, 110, 255, 0.48);
}

.glass-demo__light {
  position: absolute;
  inset: -30% 0 0;
  z-index: 2;
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
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4) inset, 0 1px 4px rgba(0, 0, 0, 0.45) inset;
}

.glass-demo__controls {
  background: rgba(10, 14, 28, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: clamp(20px, 4vw, 32px);
  border-radius: 24px;
  backdrop-filter: blur(18px);
  color: rgba(244, 247, 255, 0.88);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.4);
  display: grid;
  gap: 24px;
}

.glass-demo__controls h3 {
  margin: 0 0 8px;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.glass-demo__section {
  display: grid;
  gap: 18px;
}

.glass-demo__section h4 {
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.glass-demo__field {
  display: grid;
  gap: 6px;
  font-size: 0.9rem;
}

.glass-demo__field input[type="range"] {
  width: 100%;
}

.glass-demo__field select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.25);
  color: inherit;
}

.glass-demo__field strong {
  justify-self: flex-end;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 768px) {
  .glass-demo {
    padding: 32px 24px 64px;
  }

  .glass-demo__card-wrapper {
    width: 100%;
  }
}
</style>
