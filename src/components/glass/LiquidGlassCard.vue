<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue"
import { ShaderDisplacementGenerator, fragmentShaders } from "../../lib/glass/shader-utils"
import {
  displacementMap,
  polarDisplacementMap,
  prominentDisplacementMap,
} from "../../lib/glass/displacement-maps"

const props = defineProps({
  mode: {
    type: String,
    default: "standard",
    validator: (value) =>
      ["standard", "polar", "prominent", "shader"].includes(value),
  },
  displacementScale: {
    type: Number,
    default: 60,
  },
  blurAmount: {
    type: Number,
    default: 0.08,
  },
  saturation: {
    type: Number,
    default: 160,
  },
  aberrationIntensity: {
    type: Number,
    default: 2,
  },
  elasticity: {
    type: Number,
    default: 0.18,
  },
  cornerRadius: {
    type: Number,
    default: 38,
  },
  padding: {
    type: String,
    default: "28px 36px",
  },
  overLight: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["click"])

const cardRef = ref(null)
const filterId = `glass-filter-${Math.random().toString(36).slice(2)}`
const shaderMapUrl = ref("")
const mouseOffset = reactive({ x: 0, y: 0 })
const globalMousePos = reactive({ x: 0, y: 0 })
const glassSize = reactive({ width: 320, height: 140 })
const isHovered = ref(false)
const isActive = ref(false)

const isFirefox =
  typeof navigator !== "undefined" &&
  navigator.userAgent.toLowerCase().includes("firefox")

const displacementDirection = computed(() => (props.mode === "shader" ? 1 : -1))

const redScale = computed(
  () => props.displacementScale * displacementDirection.value,
)
const greenScale = computed(
  () =>
    props.displacementScale *
    (displacementDirection.value - props.aberrationIntensity * 0.05),
)
const blueScale = computed(
  () =>
    props.displacementScale *
    (displacementDirection.value - props.aberrationIntensity * 0.1),
)

const aberrationBlur = computed(
  () => Math.max(0.1, 0.5 - props.aberrationIntensity * 0.1),
)
const edgeMaskStop = computed(
  () => Math.max(30, 80 - props.aberrationIntensity * 2),
)

const displacementHref = computed(() => {
  switch (props.mode) {
    case "polar":
      return polarDisplacementMap
    case "prominent":
      return prominentDisplacementMap
    case "shader":
      return shaderMapUrl.value || displacementMap
    default:
      return displacementMap
  }
})

const backdropStyle = computed(() => ({
  filter: isFirefox ? undefined : `url(#${filterId})`,
  backdropFilter: `blur(${(props.overLight ? 12 : 4) + props.blurAmount * 32}px) saturate(${props.saturation}%)`,
  WebkitBackdropFilter: `blur(${(props.overLight ? 12 : 4) + props.blurAmount * 32}px) saturate(${props.saturation}%)`,
  borderRadius: `${props.cornerRadius}px`,
  position: "absolute",
  inset: 0,
}))

const transformStyle = computed(() => {
  const translation = calculateElasticTranslation()
  const scale = calculateDirectionalScale()
  const activeScale = isActive.value ? " scale(0.96)" : ""
  return `translate(${translation.x}px, ${translation.y}px) ${scale}${activeScale}`
})

const frameStyle = computed(() => ({
  borderRadius: `${props.cornerRadius}px`,
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  gap: "24px",
  padding: props.padding,
  overflow: "hidden",
  boxShadow: props.overLight
    ? "0px 16px 70px rgba(0, 0, 0, 0.75)"
    : "0px 12px 40px rgba(0, 0, 0, 0.25)",
  transform: transformStyle.value,
  transition: "transform 0.25s ease-out, box-shadow 0.25s ease-out",
}))

const contentStyle = computed(() => ({
  position: "relative",
  zIndex: 1,
  color: "#fff",
  textShadow: props.overLight
    ? "0px 2px 12px rgba(0, 0, 0, 0)"
    : "0px 2px 12px rgba(0, 0, 0, 0.4)",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
}))

const borderBaseStyle = computed(() => ({
  pointerEvents: "none",
  position: "absolute",
  inset: 0,
  borderRadius: `${props.cornerRadius}px`,
  padding: "1.5px",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
  boxShadow:
    "0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset, 0 1px 4px rgba(0, 0, 0, 0.35)",
}))

const gradientBase = computed(
  () =>
    `linear-gradient(${135 + mouseOffset.x * 1.2}deg,` +
    ` rgba(255, 255, 255, 0.0) 0%,` +
    ` rgba(255, 255, 255, ${0.12 + Math.abs(mouseOffset.x) * 0.008}) ${Math.max(10, 33 + mouseOffset.y * 0.3)}%,` +
    ` rgba(255, 255, 255, ${0.4 + Math.abs(mouseOffset.x) * 0.012}) ${Math.min(90, 66 + mouseOffset.y * 0.4)}%,` +
    " rgba(255, 255, 255, 0.0) 100%)",
)

const gradientOverlay = computed(
  () =>
    `linear-gradient(${135 + mouseOffset.x * 1.2}deg,` +
    ` rgba(255, 255, 255, 0.0) 0%,` +
    ` rgba(255, 255, 255, ${0.32 + Math.abs(mouseOffset.x) * 0.008}) ${Math.max(10, 33 + mouseOffset.y * 0.3)}%,` +
    ` rgba(255, 255, 255, ${0.6 + Math.abs(mouseOffset.x) * 0.012}) ${Math.min(90, 66 + mouseOffset.y * 0.4)}%,` +
    " rgba(255, 255, 255, 0.0) 100%)",
)

const borderScreenStyle = computed(() => ({
  ...borderBaseStyle.value,
  mixBlendMode: "screen",
  opacity: 0.22,
  background: gradientBase.value,
}))

const borderOverlayStyle = computed(() => ({
  ...borderBaseStyle.value,
  mixBlendMode: "overlay",
  background: gradientOverlay.value,
}))

const hoverHighlightStyle = computed(() => ({
  pointerEvents: "none",
  position: "absolute",
  inset: 0,
  borderRadius: `${props.cornerRadius}px`,
  mixBlendMode: "overlay",
  opacity: isHovered.value ? 0.35 : isActive.value ? 0.55 : 0,
  transition: "opacity 0.2s ease-out",
  backgroundImage:
    "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 80%)",
}))

function calculateDirectionalScale() {
  if (!cardRef.value || !globalMousePos.x || !globalMousePos.y) {
    return "scale(1)"
  }

  const rect = cardRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const deltaX = globalMousePos.x - centerX
  const deltaY = globalMousePos.y - centerY

  const edgeDistanceX = Math.max(0, Math.abs(deltaX) - rect.width / 2)
  const edgeDistanceY = Math.max(0, Math.abs(deltaY) - rect.height / 2)
  const edgeDistance = Math.sqrt(edgeDistanceX * edgeDistanceX + edgeDistanceY * edgeDistanceY)

  const activationZone = 200
  if (edgeDistance > activationZone) {
    return "scale(1)"
  }

  const fadeInFactor = 1 - edgeDistance / activationZone
  const centerDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  if (centerDistance === 0) {
    return "scale(1)"
  }

  const normalizedX = deltaX / centerDistance
  const normalizedY = deltaY / centerDistance
  const stretchIntensity = Math.min(centerDistance / 300, 1) * props.elasticity * fadeInFactor

  const scaleX = 1 + Math.abs(normalizedX) * stretchIntensity * 0.3 - Math.abs(normalizedY) * stretchIntensity * 0.15
  const scaleY = 1 + Math.abs(normalizedY) * stretchIntensity * 0.3 - Math.abs(normalizedX) * stretchIntensity * 0.15

  return `scaleX(${Math.max(0.85, scaleX)}) scaleY(${Math.max(0.85, scaleY)})`
}

function calculateFadeInFactor() {
  if (!cardRef.value || !globalMousePos.x || !globalMousePos.y) {
    return 0
  }

  const rect = cardRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const edgeDistanceX = Math.max(0, Math.abs(globalMousePos.x - centerX) - rect.width / 2)
  const edgeDistanceY = Math.max(0, Math.abs(globalMousePos.y - centerY) - rect.height / 2)
  const edgeDistance = Math.sqrt(edgeDistanceX * edgeDistanceX + edgeDistanceY * edgeDistanceY)

  const activationZone = 200
  return edgeDistance > activationZone ? 0 : 1 - edgeDistance / activationZone
}

function calculateElasticTranslation() {
  if (!cardRef.value) {
    return { x: 0, y: 0 }
  }

  const fade = calculateFadeInFactor()
  const rect = cardRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  return {
    x: (globalMousePos.x - centerX) * props.elasticity * 0.1 * fade,
    y: (globalMousePos.y - centerY) * props.elasticity * 0.1 * fade,
  }
}

function updateGlassSize() {
  if (!cardRef.value) {
    return
  }
  const rect = cardRef.value.getBoundingClientRect()
  glassSize.width = rect.width
  glassSize.height = rect.height
}

function handleMouseMove(event) {
  if (!cardRef.value) {
    return
  }
  const rect = cardRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  mouseOffset.x = ((event.clientX - centerX) / rect.width) * 100
  mouseOffset.y = ((event.clientY - centerY) / rect.height) * 100
  globalMousePos.x = event.clientX
  globalMousePos.y = event.clientY
}

function handleMouseLeave() {
  mouseOffset.x = 0
  mouseOffset.y = 0
  globalMousePos.x = 0
  globalMousePos.y = 0
  isHovered.value = false
  isActive.value = false
}

function generateShaderDisplacementMap(width, height) {
  const generator = new ShaderDisplacementGenerator({
    width: Math.max(1, Math.round(width)),
    height: Math.max(1, Math.round(height)),
    fragment: fragmentShaders.liquidGlass,
  })
  const dataUrl = generator.updateShader()
  generator.destroy()
  return dataUrl
}

watch(
  () => [props.mode, glassSize.width, glassSize.height],
  ([mode, width, height]) => {
    if (mode === "shader" && width > 0 && height > 0) {
      shaderMapUrl.value = generateShaderDisplacementMap(width, height)
    }
  },
  { immediate: true },
)

onMounted(() => {
  updateGlassSize()
  window.addEventListener("resize", updateGlassSize)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateGlassSize)
})
</script>

<template>
  <div
    ref="cardRef"
    class="liquid-glass-card"
    :class="{ 'liquid-glass-card--clickable': Boolean($attrs.onClick) }"
    @mousemove="handleMouseMove"
    @mouseenter="isHovered = true"
    @mouseleave="handleMouseLeave"
    @mousedown="isActive = true"
    @mouseup="isActive = false"
    @click="emit('click')"
  >
    <svg
      class="liquid-glass-card__filter"
      :style="{ width: `${Math.max(1, Math.round(glassSize.width))}px`, height: `${Math.max(1, Math.round(glassSize.height))}px` }"
      aria-hidden="true"
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
            :href="displacementHref"
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
            <feFuncA type="discrete" :tableValues="`0 ${props.aberrationIntensity * 0.05} 1`" />
          </feComponentTransfer>

          <feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER_ORIGINAL" />

          <feDisplacementMap
            in="SourceGraphic"
            in2="DISPLACEMENT_MAP"
            :scale="redScale"
            xChannelSelector="R"
            yChannelSelector="B"
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
            :scale="greenScale"
            xChannelSelector="R"
            yChannelSelector="B"
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
            :scale="blueScale"
            xChannelSelector="R"
            yChannelSelector="B"
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

          <feGaussianBlur
            in="RGB_COMBINED"
            :stdDeviation="aberrationBlur"
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

    <div class="liquid-glass-card__frame" :style="frameStyle">
      <span class="liquid-glass-card__warp" :style="backdropStyle" />
      <div class="liquid-glass-card__content" :style="contentStyle">
        <slot>
          <strong class="liquid-glass-card__headline">Liquid glass demo</strong>
          <span class="liquid-glass-card__body">
            Move your cursor around the card to see how the background bends and
            highlights respond in real time.
          </span>
        </slot>
      </div>
    </div>

    <span class="liquid-glass-card__border liquid-glass-card__border--screen" :style="borderScreenStyle" />
    <span class="liquid-glass-card__border liquid-glass-card__border--overlay" :style="borderOverlayStyle" />
    <span class="liquid-glass-card__highlight" :style="hoverHighlightStyle" />
  </div>
</template>

<style scoped>
.liquid-glass-card {
  position: relative;
  display: inline-block;
}

.liquid-glass-card__filter {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.liquid-glass-card__frame {
  position: relative;
  z-index: 1;
}

.liquid-glass-card__warp {
  display: block;
  z-index: 0;
}

.liquid-glass-card__content {
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
}

.liquid-glass-card__headline {
  font-size: 1.25rem;
  font-weight: 600;
}

.liquid-glass-card__body {
  font-size: 0.95rem;
  font-weight: 400;
  max-width: 320px;
  opacity: 0.86;
}

.liquid-glass-card__border {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.liquid-glass-card__highlight {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.liquid-glass-card--clickable .liquid-glass-card__frame {
  cursor: pointer;
}
</style>
