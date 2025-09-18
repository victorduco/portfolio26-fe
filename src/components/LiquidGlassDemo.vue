<template>
  <div class="liquid-demo">
    <div class="liquid-demo__gradient"></div>
    <div class="liquid-demo__gradient liquid-demo__gradient--two"></div>
    <div class="liquid-demo__gradient liquid-demo__gradient--three"></div>

    <div class="liquid-demo__content">
      <header class="liquid-demo__header">
        <p class="liquid-demo__eyebrow">Displacement filters</p>
        <h1 class="liquid-demo__title">Liquid glass background demo</h1>
        <p class="liquid-demo__subtitle">
          Move your cursor near the glass pill to bend and stretch the scenery behind it. The
          shader-driven displacement maps from the <code>demos/</code> directory are used to power
          the filter.
        </p>
      </header>

      <div class="liquid-demo__modes" role="toolbar" aria-label="Choose displacement map">
        <button
          v-for="mode in modes"
          :key="mode"
          class="liquid-demo__mode-button"
          :class="{ 'is-active': displacementMode === mode }"
          type="button"
          @click="displacementMode = mode"
        >
          {{ modeLabels[mode] }}
        </button>
      </div>

      <div class="liquid-demo__stage">
        <div class="liquid-demo__stage-light"></div>
        <div class="liquid-demo__stage-light liquid-demo__stage-light--right"></div>

        <div class="liquid-demo__pill-wrapper">
          <div v-if="glassReady" class="liquid-demo__overlay" :style="overLightDarkStyle" aria-hidden="true"></div>
          <div
            v-if="glassReady"
            class="liquid-demo__overlay liquid-demo__overlay--blend"
            :style="overLightOverlayStyle"
            aria-hidden="true"
          ></div>

          <div
            ref="glassRef"
            class="liquid-demo__glass-wrapper"
            :style="baseStyle"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
          >
            <svg
              v-if="glassReady"
              :style="{
                position: 'absolute',
                width: `${Math.max(1, Math.round(glassSize.width))}px`,
                height: `${Math.max(1, Math.round(glassSize.height))}px`,
              }"
              aria-hidden="true"
            >
              <defs>
                <radialGradient :id="`${filterId}-edge-mask`" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="black" stop-opacity="0" />
                  <stop
                    :offset="`${Math.max(30, 80 - aberrationIntensity * 2)}%`"
                    stop-color="black"
                    stop-opacity="0"
                  />
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
                    :href="displacementHref"
                    preserveAspectRatio="xMidYMid slice"
                  />

                  <feColorMatrix
                    in="DISPLACEMENT_MAP"
                    type="matrix"
                    values="0.3 0.3 0.3 0 0 0.3 0.3 0.3 0 0 0.3 0.3 0.3 0 0 0 0 0 1 0"
                    result="EDGE_INTENSITY"
                  />
                  <feComponentTransfer in="EDGE_INTENSITY" result="EDGE_MASK">
                    <feFuncA :type="'discrete'" :tableValues="`0 ${aberrationIntensity * 0.05} 1`" />
                  </feComponentTransfer>

                  <feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER_ORIGINAL" />

                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="DISPLACEMENT_MAP"
                    :scale="displacementScale * modeScale"
                    xChannelSelector="R"
                    yChannelSelector="B"
                    result="RED_DISPLACED"
                  />
                  <feColorMatrix
                    in="RED_DISPLACED"
                    type="matrix"
                    values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
                    result="RED_CHANNEL"
                  />

                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="DISPLACEMENT_MAP"
                    :scale="displacementScale * (modeScale - aberrationIntensity * 0.05)"
                    xChannelSelector="R"
                    yChannelSelector="B"
                    result="GREEN_DISPLACED"
                  />
                  <feColorMatrix
                    in="GREEN_DISPLACED"
                    type="matrix"
                    values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0"
                    result="GREEN_CHANNEL"
                  />

                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="DISPLACEMENT_MAP"
                    :scale="displacementScale * (modeScale - aberrationIntensity * 0.1)"
                    xChannelSelector="R"
                    yChannelSelector="B"
                    result="BLUE_DISPLACED"
                  />
                  <feColorMatrix
                    in="BLUE_DISPLACED"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0"
                    result="BLUE_CHANNEL"
                  />

                  <feBlend in="GREEN_CHANNEL" in2="BLUE_CHANNEL" mode="screen" result="GB_COMBINED" />
                  <feBlend in="RED_CHANNEL" in2="GB_COMBINED" mode="screen" result="RGB_COMBINED" />

                  <feGaussianBlur
                    in="RGB_COMBINED"
                    :stdDeviation="Math.max(0.1, 0.5 - aberrationIntensity * 0.1)"
                    result="ABERRATED_BLURRED"
                  />

                  <feComposite in="ABERRATED_BLURRED" in2="EDGE_MASK" operator="in" result="EDGE_ABERRATION" />

                  <feComponentTransfer in="EDGE_MASK" result="INVERTED_MASK">
                    <feFuncA type="table" tableValues="1 0" />
                  </feComponentTransfer>
                  <feComposite in="CENTER_ORIGINAL" in2="INVERTED_MASK" operator="in" result="CENTER_CLEAN" />

                  <feComposite in="EDGE_ABERRATION" in2="CENTER_CLEAN" operator="over" />
                </filter>
              </defs>
            </svg>

            <div class="liquid-demo__glass" :style="glassInnerStyle">
              <span class="liquid-demo__glass-warp" :style="glassWarpStyle"></span>
              <div class="liquid-demo__glass-content" :style="glassContentStyle">
                <div class="liquid-demo__tag">
                  {{ displacementMode === 'shader' ? 'Generated shader map' : 'Prebaked displacement map' }}
                </div>
                <h2 class="liquid-demo__glass-heading">Liquid glass surface</h2>
                <p class="liquid-demo__glass-copy">{{ glassCopy }}</p>
              </div>
              <button class="liquid-demo__cta" type="button">
                <span>Copy settings</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <span v-if="glassReady" class="liquid-demo__border" :style="screenBorderStyle" aria-hidden="true"></span>
          <span
            v-if="glassReady"
            class="liquid-demo__border liquid-demo__border--overlay"
            :style="overlayBorderStyle"
            aria-hidden="true"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { ShaderDisplacementGenerator, fragmentShaders } from "../../demos/shader-utils";
import {
  displacementMap,
  polarDisplacementMap,
  prominentDisplacementMap,
} from "../../demos/utils";

type DisplacementMode = "standard" | "polar" | "prominent" | "shader";

const modes: DisplacementMode[] = ["standard", "polar", "prominent", "shader"];
const modeLabels: Record<DisplacementMode, string> = {
  standard: "Standard",
  polar: "Polar ripples",
  prominent: "Prominent edges",
  shader: "Shader generated",
};

const displacementMode = ref<DisplacementMode>("shader");
const shaderMapUrl = ref("");

const displacementScale = 70;
const blurAmount = 0.0625;
const saturation = 140;
const aberrationIntensity = 2;
const elasticity = 0.15;
const cornerRadius = 999;
const padding = "28px 42px";
const overLight = false;

const glassRef = ref<HTMLDivElement | null>(null);
const glassSize = reactive({ width: 0, height: 0 });
const globalMousePos = reactive({ x: 0, y: 0 });
const mouseOffset = reactive({ x: 0, y: 0 });
const isActive = ref(false);
const isMounted = ref(false);

const filterId = `liquid-glass-${Math.random().toString(36).slice(2)}`;

const isFirefox = computed(
  () => typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().includes("firefox"),
);

const getMap = (mode: DisplacementMode, shaderUrl?: string) => {
  switch (mode) {
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

const displacementHref = computed(() => getMap(displacementMode.value, shaderMapUrl.value));
const modeScale = computed(() => (displacementMode.value === "shader" ? 1 : -1));
const warpBackdrop = computed(
  () => `blur(${(overLight ? 12 : 4) + blurAmount * 32}px) saturate(${saturation}%)`,
);

const glassReady = computed(() => glassSize.width > 0 && glassSize.height > 0);

const updateGlassSize = () => {
  if (!glassRef.value) {
    return;
  }

  const rect = glassRef.value.getBoundingClientRect();
  glassSize.width = rect.width;
  glassSize.height = rect.height;
};

const handleMouseMove = (event: MouseEvent) => {
  if (!glassRef.value) {
    return;
  }

  const rect = glassRef.value.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return;
  }

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  globalMousePos.x = event.clientX;
  globalMousePos.y = event.clientY;

  mouseOffset.x = ((event.clientX - centerX) / rect.width) * 100;
  mouseOffset.y = ((event.clientY - centerY) / rect.height) * 100;
};

const handleMouseEnter = () => {
  // Hover state is used only to trigger mouse tracking; the cursor position
  // handler keeps the offset reactive so we do not need additional logic here.
};

const handleMouseLeave = () => {
  isActive.value = false;
  mouseOffset.x = 0;
  mouseOffset.y = 0;
};

const handleMouseDown = () => {
  isActive.value = true;
};

const handleMouseUp = () => {
  isActive.value = false;
};

const directionalScale = computed(() => {
  if (!glassRef.value) {
    return "scale(1)";
  }

  const rect = glassRef.value.getBoundingClientRect();
  const pillCenterX = rect.left + rect.width / 2;
  const pillCenterY = rect.top + rect.height / 2;
  const pillWidth = glassSize.width;
  const pillHeight = glassSize.height;

  const deltaX = globalMousePos.x - pillCenterX;
  const deltaY = globalMousePos.y - pillCenterY;

  const edgeDistanceX = Math.max(0, Math.abs(deltaX) - pillWidth / 2);
  const edgeDistanceY = Math.max(0, Math.abs(deltaY) - pillHeight / 2);
  const edgeDistance = Math.sqrt(edgeDistanceX * edgeDistanceX + edgeDistanceY * edgeDistanceY);
  const activationZone = 200;

  if (edgeDistance > activationZone) {
    return "scale(1)";
  }

  const centerDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  if (centerDistance === 0) {
    return "scale(1)";
  }

  const fadeInFactor = 1 - edgeDistance / activationZone;
  const normalizedX = deltaX / centerDistance;
  const normalizedY = deltaY / centerDistance;
  const stretchIntensity = Math.min(centerDistance / 300, 1) * elasticity * fadeInFactor;

  const scaleX = 1 + Math.abs(normalizedX) * stretchIntensity * 0.3 - Math.abs(normalizedY) * stretchIntensity * 0.15;
  const scaleY = 1 + Math.abs(normalizedY) * stretchIntensity * 0.3 - Math.abs(normalizedX) * stretchIntensity * 0.15;

  return `scaleX(${Math.max(0.8, scaleX)}) scaleY(${Math.max(0.8, scaleY)})`;
});

const fadeInFactor = computed(() => {
  if (!glassRef.value) {
    return 0;
  }

  const rect = glassRef.value.getBoundingClientRect();
  const pillCenterX = rect.left + rect.width / 2;
  const pillCenterY = rect.top + rect.height / 2;

  const edgeDistanceX = Math.max(0, Math.abs(globalMousePos.x - pillCenterX) - glassSize.width / 2);
  const edgeDistanceY = Math.max(0, Math.abs(globalMousePos.y - pillCenterY) - glassSize.height / 2);
  const edgeDistance = Math.sqrt(edgeDistanceX * edgeDistanceX + edgeDistanceY * edgeDistanceY);
  const activationZone = 200;

  return edgeDistance > activationZone ? 0 : 1 - edgeDistance / activationZone;
});

const elasticTranslation = computed(() => {
  if (!glassRef.value) {
    return { x: 0, y: 0 };
  }

  const rect = glassRef.value.getBoundingClientRect();
  const pillCenterX = rect.left + rect.width / 2;
  const pillCenterY = rect.top + rect.height / 2;

  return {
    x: (globalMousePos.x - pillCenterX) * elasticity * 0.1 * fadeInFactor.value,
    y: (globalMousePos.y - pillCenterY) * elasticity * 0.1 * fadeInFactor.value,
  };
});

const transformStyle = computed(() => {
  const translation = elasticTranslation.value;
  const scale = isActive.value ? "scale(0.96)" : directionalScale.value;

  return `translate(calc(-50% + ${translation.x.toFixed(2)}px), calc(-50% + ${translation.y.toFixed(2)}px)) ${scale}`;
});

const baseStyle = computed(() => ({
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: transformStyle.value,
  transition: "all ease-out 0.2s",
}));

const positionStyles = computed(() => ({
  position: baseStyle.value.position,
  top: baseStyle.value.top,
  left: baseStyle.value.left,
}));

const glassInnerStyle = computed(() => ({
  borderRadius: `${cornerRadius}px`,
  position: "relative" as const,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "32px",
  padding,
  overflow: "hidden",
  transition: "all 0.2s ease-in-out",
  boxShadow: overLight
    ? "0px 16px 70px rgba(0, 0, 0, 0.75)"
    : "0px 12px 40px rgba(0, 0, 0, 0.25)",
  backgroundColor: "rgba(8, 11, 25, 0.55)",
}));

const glassWarpStyle = computed(() => ({
  position: "absolute" as const,
  inset: "0",
  borderRadius: `${cornerRadius}px`,
  filter: isFirefox.value ? undefined : `url(#${filterId})`,
  backdropFilter: warpBackdrop.value,
  WebkitBackdropFilter: warpBackdrop.value,
}));

const glassContentStyle = computed(() => ({
  position: "relative" as const,
  zIndex: 1,
  width: "100%",
}));

const createBorderGradient = (startOpacity: number, midOpacity: number) => {
  const angle = 135 + mouseOffset.x * 1.2;
  const start = Math.max(10, 33 + mouseOffset.y * 0.3);
  const end = Math.min(90, 66 + mouseOffset.y * 0.4);

  return `linear-gradient(${angle}deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, ${startOpacity}) ${start}%, rgba(255, 255, 255, ${midOpacity}) ${end}%, rgba(255, 255, 255, 0) 100%)`;
};

const borderCommon = computed(() => ({
  ...positionStyles.value,
  height: `${glassSize.height}px`,
  width: `${glassSize.width}px`,
  borderRadius: `${cornerRadius}px`,
  transform: baseStyle.value.transform,
  transition: baseStyle.value.transition,
  pointerEvents: "none" as const,
  padding: "1.5px",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
  boxShadow:
    "0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset, 0 1px 4px rgba(0, 0, 0, 0.35)",
}));

const screenBorderStyle = computed(() => ({
  ...borderCommon.value,
  mixBlendMode: "screen" as const,
  opacity: 0.2,
  background: createBorderGradient(
    0.12 + Math.abs(mouseOffset.x) * 0.008,
    0.4 + Math.abs(mouseOffset.x) * 0.012,
  ),
}));

const overlayBorderStyle = computed(() => ({
  ...borderCommon.value,
  mixBlendMode: "overlay" as const,
  background: createBorderGradient(
    0.32 + Math.abs(mouseOffset.x) * 0.008,
    0.6 + Math.abs(mouseOffset.x) * 0.012,
  ),
}));

const overLightBaseStyle = computed(() => ({
  ...positionStyles.value,
  height: `${glassSize.height}px`,
  width: `${glassSize.width}px`,
  borderRadius: `${cornerRadius}px`,
  transform: baseStyle.value.transform,
  transition: baseStyle.value.transition,
  pointerEvents: "none" as const,
}));

const overLightDarkStyle = computed(() => ({
  ...overLightBaseStyle.value,
  backgroundColor: "rgba(0, 0, 0, 1)",
  opacity: overLight ? 0.2 : 0,
}));

const overLightOverlayStyle = computed(() => ({
  ...overLightBaseStyle.value,
  backgroundColor: "rgba(0, 0, 0, 1)",
  mixBlendMode: "overlay" as const,
  opacity: overLight ? 1 : 0,
}));

const glassCopy = computed(() => {
  if (displacementMode.value === "shader") {
    return "A shader recalculates the displacement map whenever the pill resizes so the distortion stays sharp.";
  }

  if (displacementMode.value === "prominent") {
    return "Highlights the strong contrast areas to emphasise edges. Great for bold backgrounds.";
  }

  if (displacementMode.value === "polar") {
    return "Wraps the background in a polar swirl that reacts to your cursor position.";
  }

  return "A classic normal-map style displacement that gently refracts the scenery behind the glass.";
});

let resizeObserver: ResizeObserver | null = null;

const generateShaderMap = () => {
  if (!isMounted.value || displacementMode.value !== "shader") {
    shaderMapUrl.value = displacementMode.value === "shader" ? shaderMapUrl.value : "";
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  if (!glassSize.width || !glassSize.height) {
    return;
  }

  const generator = new ShaderDisplacementGenerator({
    width: Math.max(1, Math.round(glassSize.width)),
    height: Math.max(1, Math.round(glassSize.height)),
    fragment: fragmentShaders.liquidGlass,
  });

  const url = generator.updateShader();
  shaderMapUrl.value = url;
  generator.destroy();
};

onMounted(() => {
  isMounted.value = true;

  nextTick(() => {
    updateGlassSize();
    generateShaderMap();
  });

  if (typeof window !== "undefined") {
    window.addEventListener("resize", updateGlassSize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  if (typeof ResizeObserver !== "undefined" && glassRef.value) {
    resizeObserver = new ResizeObserver(() => updateGlassSize());
    resizeObserver.observe(glassRef.value);
  }
});

onBeforeUnmount(() => {
  isMounted.value = false;

  if (typeof window !== "undefined") {
    window.removeEventListener("resize", updateGlassSize);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  resizeObserver?.disconnect();
});

watch(
  () => [displacementMode.value, glassSize.width, glassSize.height],
  () => {
    if (!isMounted.value) {
      return;
    }

    if (displacementMode.value !== "shader") {
      shaderMapUrl.value = "";
      return;
    }

    generateShaderMap();
  },
);
</script>

<style scoped>
.liquid-demo {
  position: relative;
  min-height: 100vh;
  padding: 4rem 1.5rem 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #f5f6ff;
}

.liquid-demo__gradient {
  position: absolute;
  inset: -40% -10% auto;
  height: 120vh;
  background: radial-gradient(ellipse at top left, rgba(111, 76, 255, 0.65), transparent 60%);
  filter: blur(40px);
  opacity: 0.8;
  pointer-events: none;
}

.liquid-demo__gradient--two {
  inset: auto -30% -40% auto;
  background: radial-gradient(circle at bottom right, rgba(64, 221, 255, 0.7), transparent 55%);
}

.liquid-demo__gradient--three {
  inset: 20% auto -50% -20%;
  background: radial-gradient(circle at bottom left, rgba(255, 105, 180, 0.45), transparent 60%);
}

.liquid-demo__content {
  position: relative;
  z-index: 1;
  width: min(960px, 100%);
  text-align: center;
}

.liquid-demo__header {
  margin-bottom: 2.5rem;
}

.liquid-demo__eyebrow {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.6);
}

.liquid-demo__title {
  font-size: clamp(2.2rem, 3vw, 3.2rem);
  margin: 0 0 1.25rem;
}

.liquid-demo__subtitle {
  margin: 0 auto;
  max-width: 640px;
  line-height: 1.6;
  color: rgba(240, 242, 255, 0.75);
}

.liquid-demo__subtitle code {
  font-family: "JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  color: #d1d8ff;
  background: rgba(12, 12, 28, 0.45);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.liquid-demo__modes {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.liquid-demo__mode-button {
  background: rgba(12, 18, 45, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: inherit;
  font-size: 0.95rem;
  padding: 0.55rem 1.2rem;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.2s ease, border 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.liquid-demo__mode-button:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.35);
  background: rgba(20, 28, 65, 0.75);
}

.liquid-demo__mode-button.is-active {
  background: rgba(69, 120, 255, 0.4);
  border-color: rgba(196, 220, 255, 0.8);
  box-shadow: 0 12px 40px rgba(64, 157, 255, 0.35);
}

.liquid-demo__stage {
  position: relative;
  width: min(580px, 100%);
  height: clamp(220px, 40vw, 320px);
  margin: 0 auto;
}

.liquid-demo__stage-light {
  position: absolute;
  width: 60%;
  height: 60%;
  top: 10%;
  left: -15%;
  background: radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.4), transparent 65%);
  filter: blur(60px);
  opacity: 0.6;
  pointer-events: none;
}

.liquid-demo__stage-light--right {
  left: auto;
  right: -10%;
  top: 40%;
  background: radial-gradient(circle at 80% 40%, rgba(127, 200, 255, 0.6), transparent 65%);
}

.liquid-demo__pill-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.liquid-demo__glass-wrapper {
  width: max-content;
  height: max-content;
}

.liquid-demo__glass {
  position: relative;
  isolation: isolate;
  min-width: clamp(320px, 60vw, 480px);
  max-width: 100%;
  color: inherit;
}

.liquid-demo__glass-warp {
  display: block;
}

.liquid-demo__glass-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  text-align: left;
}

.liquid-demo__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.85);
}

.liquid-demo__glass-heading {
  font-size: clamp(1.6rem, 2vw, 2.2rem);
  margin: 0;
}

.liquid-demo__glass-copy {
  margin: 0;
  line-height: 1.55;
  color: rgba(235, 237, 255, 0.82);
}

.liquid-demo__cta {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(12, 15, 38, 0.65);
  color: inherit;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, border 0.2s ease, box-shadow 0.2s ease;
}

.liquid-demo__cta:hover {
  transform: translateY(-2px);
  background: rgba(46, 96, 255, 0.45);
  border-color: rgba(200, 220, 255, 0.8);
  box-shadow: 0 10px 32px rgba(72, 132, 255, 0.35);
}

.liquid-demo__border {
  position: absolute;
}

.liquid-demo__border--overlay {
  opacity: 0.65;
}

.liquid-demo__overlay {
  position: absolute;
}

.liquid-demo__overlay--blend {
  mix-blend-mode: overlay;
}

@media (max-width: 720px) {
  .liquid-demo {
    padding: 3rem 1rem 4rem;
  }

  .liquid-demo__glass {
    min-width: clamp(280px, 80vw, 360px);
  }

  .liquid-demo__cta {
    margin-top: 1.25rem;
  }
}
</style>
