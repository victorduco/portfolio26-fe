<script setup lang="ts">
import { computed, defineEmits, defineProps, getCurrentInstance, onBeforeUnmount, onMounted, reactive, ref, watch, withDefaults } from "vue"
import { ShaderDisplacementGenerator, fragmentShaders } from "../../demos/shader-utils"
import { displacementMap, polarDisplacementMap, prominentDisplacementMap } from "../../demos/utils"

interface MousePosition {
  x: number
  y: number
}

type Mode = "standard" | "polar" | "prominent" | "shader"

const props = withDefaults(
  defineProps<{
    displacementScale?: number
    blurAmount?: number
    saturation?: number
    aberrationIntensity?: number
    elasticity?: number
    cornerRadius?: number
    globalMousePos?: MousePosition | null
    mouseOffset?: MousePosition | null
    mouseContainer?: HTMLElement | null
    padding?: string
    style?: Record<string, any>
    overLight?: boolean
    clickable?: boolean
    mode?: Mode
  }>(),
  {
    displacementScale: 70,
    blurAmount: 0.0625,
    saturation: 140,
    aberrationIntensity: 2,
    elasticity: 0.15,
    cornerRadius: 999,
    globalMousePos: null,
    mouseOffset: null,
    mouseContainer: null,
    padding: "24px 32px",
    style: () => ({}),
    overLight: false,
    clickable: false,
    mode: "standard" as Mode,
  },
)

const emit = defineEmits<{ (event: "click"): void }>()
const instance = getCurrentInstance()

const isHovered = ref(false)
const isActive = ref(false)
const glassRef = ref<HTMLDivElement | null>(null)
const glassSize = reactive({ width: 270, height: 69 })
const internalGlobalMousePos = ref<MousePosition>({ x: 0, y: 0 })
const internalMouseOffset = ref<MousePosition>({ x: 0, y: 0 })
const shaderMapUrl = ref("")
const filterId = `glass-filter-${Math.random().toString(36).slice(2, 10)}`

const resolvedGlobalMousePos = computed(() => props.globalMousePos ?? internalGlobalMousePos.value)
const resolvedMouseOffset = computed(() => props.mouseOffset ?? internalMouseOffset.value)
const hasMouse = computed(() => resolvedGlobalMousePos.value.x !== 0 || resolvedGlobalMousePos.value.y !== 0)
const hasClickListener = computed(() => {
  if (props.clickable) {
    return true
  }
  const vnodeProps = instance?.vnode.props as Record<string, unknown> | undefined
  return Boolean(vnodeProps?.onClick || vnodeProps?.onClickOnce)
})
const isFirefox = computed(() => typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().includes("firefox"))

const displacementModeMap: Record<Mode, string> = {
  standard: displacementMap,
  polar: polarDisplacementMap,
  prominent: prominentDisplacementMap,
  shader: displacementMap,
}

function getDisplacementMap(mode: Mode, generatedMap?: string) {
  if (mode === "shader" && generatedMap) {
    return generatedMap
  }
  return displacementModeMap[mode]
}

function updateGlassSize() {
  const el = glassRef.value
  if (!el) {
    return
  }
  const rect = el.getBoundingClientRect()
  glassSize.width = rect.width
  glassSize.height = rect.height
}

function handleMouseMove(event: MouseEvent) {
  const container = props.mouseContainer ?? glassRef.value
  if (!container) {
    return
  }
  const rect = container.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  internalMouseOffset.value = {
    x: ((event.clientX - centerX) / rect.width) * 100,
    y: ((event.clientY - centerY) / rect.height) * 100,
  }

  internalGlobalMousePos.value = {
    x: event.clientX,
    y: event.clientY,
  }
}

function calculateDirectionalScale(): string {
  if (!hasMouse.value || !glassRef.value) {
    return "scale(1)"
  }

  const rect = glassRef.value.getBoundingClientRect()
  const pillCenterX = rect.left + rect.width / 2
  const pillCenterY = rect.top + rect.height / 2
  const deltaX = resolvedGlobalMousePos.value.x - pillCenterX
  const deltaY = resolvedGlobalMousePos.value.y - pillCenterY

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

  return `scaleX(${Math.max(0.8, scaleX)}) scaleY(${Math.max(0.8, scaleY)})`
}

function calculateFadeInFactor(): number {
  if (!hasMouse.value || !glassRef.value) {
    return 0
  }

  const rect = glassRef.value.getBoundingClientRect()
  const pillCenterX = rect.left + rect.width / 2
  const pillCenterY = rect.top + rect.height / 2

  const edgeDistanceX = Math.max(0, Math.abs(resolvedGlobalMousePos.value.x - pillCenterX) - rect.width / 2)
  const edgeDistanceY = Math.max(0, Math.abs(resolvedGlobalMousePos.value.y - pillCenterY) - rect.height / 2)
  const edgeDistance = Math.sqrt(edgeDistanceX * edgeDistanceX + edgeDistanceY * edgeDistanceY)
  const activationZone = 200

  return edgeDistance > activationZone ? 0 : 1 - edgeDistance / activationZone
}

function calculateElasticTranslation() {
  if (!glassRef.value) {
    return { x: 0, y: 0 }
  }

  const rect = glassRef.value.getBoundingClientRect()
  const pillCenterX = rect.left + rect.width / 2
  const pillCenterY = rect.top + rect.height / 2
  const fadeInFactor = calculateFadeInFactor()

  return {
    x: (resolvedGlobalMousePos.value.x - pillCenterX) * props.elasticity * 0.1 * fadeInFactor,
    y: (resolvedGlobalMousePos.value.y - pillCenterY) * props.elasticity * 0.1 * fadeInFactor,
  }
}

const elasticTranslation = computed(() => calculateElasticTranslation())
const directionalScale = computed(() => calculateDirectionalScale())

const transformStyle = computed(
  () =>
    `translate(calc(-50% + ${elasticTranslation.value.x}px), calc(-50% + ${elasticTranslation.value.y}px)) ${
      hasClickListener.value && isActive.value ? "scale(0.96)" : directionalScale.value
    }`,
)

const baseStyle = computed(() => ({
  ...props.style,
  transform: transformStyle.value,
  transition: "all ease-out 0.2s",
}))

const positionStyles = computed(() => ({
  position: baseStyle.value.position ?? "relative",
  top: baseStyle.value.top ?? "50%",
  left: baseStyle.value.left ?? "50%",
}))

const overlayBase = computed(() => ({
  ...positionStyles.value,
  transform: baseStyle.value.transform,
  transition: baseStyle.value.transition,
  height: `${glassSize.height}px`,
  width: `${glassSize.width}px`,
  borderRadius: `${props.cornerRadius}px`,
}))

const overLightShadowStyle = computed(() => ({
  ...overlayBase.value,
  pointerEvents: "none",
  backgroundColor: "#000",
  opacity: props.overLight ? 0.2 : 0,
}))

const overLightOverlayStyle = computed(() => ({
  ...overlayBase.value,
  pointerEvents: "none",
  backgroundColor: "#000",
  mixBlendMode: "overlay",
  opacity: props.overLight ? 1 : 0,
}))

const borderBase = computed(() => ({
  ...overlayBase.value,
  pointerEvents: "none",
  padding: "1.5px",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
  boxShadow: "0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset, 0 1px 4px rgba(0, 0, 0, 0.35)",
}))

const borderScreenStyle = computed(() => ({
  ...borderBase.value,
  mixBlendMode: "screen",
  opacity: 0.2,
  background: `linear-gradient(${135 + resolvedMouseOffset.value.x * 1.2}deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, ${
    0.12 + Math.abs(resolvedMouseOffset.value.x) * 0.008
  }) ${Math.max(10, 33 + resolvedMouseOffset.value.y * 0.3)}%, rgba(255, 255, 255, ${
    0.4 + Math.abs(resolvedMouseOffset.value.x) * 0.012
  }) ${Math.min(90, 66 + resolvedMouseOffset.value.y * 0.4)}%, rgba(255, 255, 255, 0) 100%)`,
}))

const borderOverlayStyle = computed(() => ({
  ...borderBase.value,
  mixBlendMode: "overlay",
  background: `linear-gradient(${135 + resolvedMouseOffset.value.x * 1.2}deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, ${
    0.32 + Math.abs(resolvedMouseOffset.value.x) * 0.008
  }) ${Math.max(10, 33 + resolvedMouseOffset.value.y * 0.3)}%, rgba(255, 255, 255, ${
    0.6 + Math.abs(resolvedMouseOffset.value.x) * 0.012
  }) ${Math.min(90, 66 + resolvedMouseOffset.value.y * 0.4)}%, rgba(255, 255, 255, 0) 100%)`,
}))

const hoverHighlightStyle = computed(() => ({
  ...overlayBase.value,
  pointerEvents: "none",
  opacity: isHovered.value ? 0.4 : isActive.value ? 0.8 : 0,
  backgroundImage: "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)",
  mixBlendMode: "overlay",
}))

const hoverSheenStyle = computed(() => ({
  ...overlayBase.value,
  pointerEvents: "none",
  opacity: isHovered.value || isActive.value ? 0.5 : 0,
  backgroundImage: "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 50%)",
  mixBlendMode: "overlay",
}))

const activeSheenStyle = computed(() => ({
  ...overlayBase.value,
  pointerEvents: "none",
  opacity: isActive.value ? 0.5 : 0,
  backgroundImage: "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 80%)",
  mixBlendMode: "overlay",
}))

const glassShellStyle = computed(() => ({
  borderRadius: `${props.cornerRadius}px`,
  position: "relative" as const,
  display: "inline-flex",
  alignItems: "center",
  gap: "24px",
  padding: props.padding,
  overflow: "hidden",
  transition: "all 0.2s ease-in-out",
  boxShadow: props.overLight ? "0px 16px 70px rgba(0, 0, 0, 0.75)" : "0px 12px 40px rgba(0, 0, 0, 0.25)",
}))

const filterStyle = computed(() => (isFirefox.value ? undefined : `url(#${filterId})`))

const warpStyle = computed(() => ({
  position: "absolute" as const,
  inset: 0,
  filter: filterStyle.value,
  backdropFilter: `blur(${(props.overLight ? 12 : 4) + props.blurAmount * 32}px) saturate(${props.saturation}%)`,
}))

const contentStyle = computed(() => ({
  position: "relative" as const,
  zIndex: 1,
  color: "#fff",
  font: "500 20px/1 system-ui",
  textShadow: props.overLight ? "0px 2px 12px rgba(0, 0, 0, 0)" : "0px 2px 12px rgba(0, 0, 0, 0.4)",
}))

function handleClick() {
  emit("click")
}

function generateShaderMap() {
  if (props.mode !== "shader" || typeof window === "undefined") {
    shaderMapUrl.value = ""
    return
  }

  const generator = new ShaderDisplacementGenerator({
    width: Math.max(1, Math.round(glassSize.width)),
    height: Math.max(1, Math.round(glassSize.height)),
    fragment: fragmentShaders.liquidGlass,
  })

  const url = generator.updateShader()
  generator.destroy()
  shaderMapUrl.value = url
}

onMounted(() => {
  updateGlassSize()
  const container = props.mouseContainer ?? glassRef.value
  container?.addEventListener("mousemove", handleMouseMove)
  if (typeof window !== "undefined") {
    window.addEventListener("resize", updateGlassSize)
  }
  generateShaderMap()
})

onBeforeUnmount(() => {
  const container = props.mouseContainer ?? glassRef.value
  container?.removeEventListener("mousemove", handleMouseMove)
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", updateGlassSize)
  }
})

watch(
  () => [props.mode, glassSize.width, glassSize.height],
  () => {
    generateShaderMap()
  },
)
</script>

<template>
  <div class="liquid-glass-wrapper">
    <div class="liquid-glass-light" :style="overLightShadowStyle" />
    <div class="liquid-glass-light mix" :style="overLightOverlayStyle" />

    <div
      ref="glassRef"
      class="liquid-glass-container"
      :class="{ clickable: hasClickListener, active: isActive }"
      :style="baseStyle"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @mousedown="() => (isActive = true)"
      @mouseup="() => (isActive = false)"
      @click="handleClick"
    >
      <svg class="liquid-glass-filter" :style="{ width: `${glassSize.width}px`, height: `${glassSize.height}px` }" aria-hidden="true">
        <defs>
          <radialGradient :id="`${filterId}-edge-mask`" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="black" stop-opacity="0" />
            <stop :offset="`${Math.max(30, 80 - props.aberrationIntensity * 2)}%`" stop-color="black" stop-opacity="0" />
            <stop offset="100%" stop-color="white" stop-opacity="1" />
          </radialGradient>
          <filter :id="filterId" x="-35%" y="-35%" width="170%" height="170%" color-interpolation-filters="sRGB">
            <feImage
              id="feimage"
              x="0"
              y="0"
              width="100%"
              height="100%"
              result="DISPLACEMENT_MAP"
              :href="getDisplacementMap(props.mode, shaderMapUrl)"
              preserveAspectRatio="xMidYMid slice"
            />
            <feColorMatrix
              in="DISPLACEMENT_MAP"
              type="matrix"
              values="0.3 0.3 0.3 0 0 0.3 0.3 0.3 0 0 0.3 0.3 0.3 0 0 0 0 0 1 0"
              result="EDGE_INTENSITY"
            />
            <feComponentTransfer in="EDGE_INTENSITY" result="EDGE_MASK">
              <feFuncA :type="'discrete'" :tableValues="`0 ${props.aberrationIntensity * 0.05} 1`" />
            </feComponentTransfer>
            <feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER_ORIGINAL" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="DISPLACEMENT_MAP"
              :scale="(props.overLight ? props.displacementScale * 0.5 : props.displacementScale) * (props.mode === 'shader' ? 1 : -1)"
              xChannelSelector="R"
              yChannelSelector="B"
              result="RED_DISPLACED"
            />
            <feColorMatrix in="RED_DISPLACED" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="RED_CHANNEL" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="DISPLACEMENT_MAP"
              :scale="
                (props.overLight ? props.displacementScale * 0.5 : props.displacementScale) *
                ((props.mode === 'shader' ? 1 : -1) - props.aberrationIntensity * 0.05)
              "
              xChannelSelector="R"
              yChannelSelector="B"
              result="GREEN_DISPLACED"
            />
            <feColorMatrix in="GREEN_DISPLACED" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="GREEN_CHANNEL" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="DISPLACEMENT_MAP"
              :scale="
                (props.overLight ? props.displacementScale * 0.5 : props.displacementScale) *
                ((props.mode === 'shader' ? 1 : -1) - props.aberrationIntensity * 0.1)
              "
              xChannelSelector="R"
              yChannelSelector="B"
              result="BLUE_DISPLACED"
            />
            <feColorMatrix in="BLUE_DISPLACED" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="BLUE_CHANNEL" />
            <feBlend in="GREEN_CHANNEL" in2="BLUE_CHANNEL" mode="screen" result="GB_COMBINED" />
            <feBlend in="RED_CHANNEL" in2="GB_COMBINED" mode="screen" result="RGB_COMBINED" />
            <feGaussianBlur
              in="RGB_COMBINED"
              :stdDeviation="Math.max(0.1, 0.5 - props.aberrationIntensity * 0.1)"
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

      <div class="liquid-glass" :style="glassShellStyle">
        <span class="liquid-glass-warp" :style="warpStyle" />
        <div class="liquid-glass-content" :style="contentStyle">
          <slot />
        </div>
      </div>
    </div>

    <span class="liquid-glass-border" :style="borderScreenStyle" />
    <span class="liquid-glass-border overlay" :style="borderOverlayStyle" />

    <div v-if="hasClickListener" class="liquid-glass-hover" :style="hoverSheenStyle" />
    <div v-if="hasClickListener" class="liquid-glass-hover active" :style="activeSheenStyle" />
    <div v-if="hasClickListener" class="liquid-glass-hover highlight" :style="hoverHighlightStyle" />
  </div>
</template>

<style scoped>
.liquid-glass-wrapper {
  position: relative;
  display: inline-block;
}

.liquid-glass-container {
  position: relative;
  transform-origin: center;
  display: inline-block;
}

.liquid-glass-container.clickable {
  cursor: pointer;
}

.liquid-glass-filter {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.liquid-glass {
  position: relative;
  isolation: isolate;
}

.liquid-glass-warp {
  display: block;
}

.liquid-glass-content {
  position: relative;
}

.liquid-glass-border,
.liquid-glass-hover,
.liquid-glass-light {
  position: absolute;
}

.liquid-glass-border.overlay {
  mix-blend-mode: overlay;
}

.liquid-glass-light.mix {
  mix-blend-mode: overlay;
}
</style>
