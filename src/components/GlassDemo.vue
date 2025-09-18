<template>
  <div class="apple-liquid-glass-demo">
    <!-- Background Layer -->
    <div class="demo-background" :style="backgroundStyle" />

    <!-- Distorted Background Layer (only this gets distorted) -->
    <div class="distorted-background-layer" :style="distortedBackgroundStyle" />

    <!-- SVG Filters for Advanced Apple Liquid Glass -->
    <svg class="liquid-glass-filters" aria-hidden="true">
      <defs>
        <!-- Apple Liquid Glass Displacement Filter -->
        <filter
          :id="filterId"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          color-interpolation-filters="sRGB"
        >
          <!-- Advanced displacement map with edge control -->
          <feImage
            :href="appleDisplacementMapUrl"
            result="displacement"
            preserveAspectRatio="xMidYMid slice"
          />

          <!-- Edge softening blur -->
          <feGaussianBlur
            in="displacement"
            :stdDeviation="edgeSoftness"
            result="soft-displacement"
          />

          <!-- Main displacement with Apple-style parameters -->
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft-displacement"
            :scale="liquidGlassStrength"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />

          <!-- Surface reflection enhancement -->
          <feColorMatrix
            in="displaced"
            type="matrix"
            :values="surfaceMatrix"
            result="surface-enhanced"
          />

          <!-- Edge masking for realistic boundaries -->
          <feComposite
            in="surface-enhanced"
            in2="SourceGraphic"
            operator="atop"
            result="masked"
          />

          <!-- Final brightness/contrast adjustment -->
          <feComponentTransfer in="masked">
            <feFuncA type="discrete" :tableValues="opacityProfile" />
          </feComponentTransfer>
        </filter>

        <!-- Apple Liquid Glass Edge Mask -->
        <radialGradient :id="`${filterId}-edge-mask`" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="white" :stop-opacity="centerOpacity" />
          <stop :offset="`${edgeTransition}%`" stop-color="white" :stop-opacity="midOpacity" />
          <stop offset="100%" stop-color="white" :stop-opacity="edgeOpacity" />
        </radialGradient>
      </defs>
    </svg>

    <div class="demo-container">
      <!-- Apple Liquid Glass Card -->
      <div class="glass-card-container">
        <div
          ref="glassCard"
          class="apple-glass-card"
          :style="appleGlassCardStyle"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
          @mousemove="handleMouseMove"
        >
          <!-- Backdrop distortion layer (invisible, only for backdrop-filter) -->
          <div class="backdrop-distortion-layer" :style="backdropDistortionStyle" />

          <!-- Content layer (never gets distorted) -->
          <div class="glass-content-layer">
            <h2>Apple Liquid Glass</h2>
            <p>Advanced liquid glass material with real refraction physics. Notice how the background distorts while text stays crystal clear.</p>
            <button class="apple-glass-button">Experience Magic</button>
          </div>
        </div>
      </div>

      <!-- Advanced Apple Controls -->
      <div class="apple-controls-panel">
        <h3>Apple Liquid Glass Engine</h3>

        <div class="control-group">
          <h4>Surface Physics</h4>

          <div class="apple-control-field">
            <label>Liquid Glass Strength</label>
            <input
              type="range"
              min="0"
              max="60"
              v-model.number="liquidGlassStrength"
            />
            <span>{{ liquidGlassStrength }}</span>
          </div>

          <div class="apple-control-field">
            <label>Surface Curvature</label>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              v-model.number="surfaceCurvature"
            />
            <span>{{ surfaceCurvature.toFixed(1) }}</span>
          </div>

          <div class="apple-control-field">
            <label>Refraction Index</label>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              v-model.number="refractionIndex"
            />
            <span>{{ refractionIndex.toFixed(1) }}</span>
          </div>

          <div class="apple-control-field">
            <label>Edge Softness</label>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.1"
              v-model.number="edgeSoftness"
            />
            <span>{{ edgeSoftness.toFixed(1) }}</span>
          </div>
        </div>

        <div class="control-group">
          <h4>Glass Material</h4>

          <div class="apple-control-field">
            <label>Backdrop Blur</label>
            <input
              type="range"
              min="8"
              max="40"
              v-model.number="backdropBlur"
            />
            <span>{{ backdropBlur }}px</span>
          </div>

          <div class="apple-control-field">
            <label>Material Opacity</label>
            <input
              type="range"
              min="0.05"
              max="0.4"
              step="0.01"
              v-model.number="materialOpacity"
            />
            <span>{{ Math.round(materialOpacity * 100) }}%</span>
          </div>

          <div class="apple-control-field">
            <label>Surface Saturation</label>
            <input
              type="range"
              min="120"
              max="250"
              step="5"
              v-model.number="surfaceSaturation"
            />
            <span>{{ surfaceSaturation }}%</span>
          </div>

          <div class="apple-control-field">
            <label>Border Definition</label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.01"
              v-model.number="borderDefinition"
            />
            <span>{{ Math.round(borderDefinition * 100) }}%</span>
          </div>
        </div>

        <div class="control-group">
          <h4>Edge Distortion Profile</h4>

          <div class="apple-control-field">
            <label>Center Intensity</label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.01"
              v-model.number="centerIntensity"
            />
            <span>{{ Math.round(centerIntensity * 100) }}%</span>
          </div>

          <div class="apple-control-field">
            <label>Edge Transition</label>
            <input
              type="range"
              min="30"
              max="80"
              v-model.number="edgeTransition"
            />
            <span>{{ edgeTransition }}%</span>
          </div>

          <div class="apple-control-field">
            <label>Edge Feathering</label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.01"
              v-model.number="edgeFeathering"
            />
            <span>{{ Math.round(edgeFeathering * 100) }}%</span>
          </div>

          <div class="apple-control-field">
            <label>Distortion Shape</label>
            <select v-model="distortionShape">
              <option value="radial">Radial (Apple Default)</option>
              <option value="elliptical">Elliptical</option>
              <option value="squircle">Squircle</option>
              <option value="organic">Organic Flow</option>
            </select>
          </div>
        </div>

        <div class="control-group">
          <h4>Light Interaction</h4>

          <div class="apple-control-field">
            <label>Surface Highlight</label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.01"
              v-model.number="surfaceHighlight"
            />
            <span>{{ Math.round(surfaceHighlight * 100) }}%</span>
          </div>

          <div class="apple-control-field">
            <label>Depth Shadows</label>
            <input
              type="range"
              min="0.0"
              max="0.6"
              step="0.01"
              v-model.number="depthShadows"
            />
            <span>{{ Math.round(depthShadows * 100) }}%</span>
          </div>
        </div>

        <div class="preset-section">
          <button class="apple-preset-button" @click="applyAppleLiquidGlassPreset">
            🍎 Apply Apple Liquid Glass
          </button>
          <button class="apple-preset-button secondary" @click="applyMinimalGlassPreset">
            ✨ Minimal Glass
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, reactive } from 'vue'
import backgroundImageUrl from '../assets/liquid-bg.jpg'

// Reactive state
const glassCard = ref(null)
const isHovered = ref(false)
const mousePosition = reactive({ x: 0.5, y: 0.5 })

// Apple Liquid Glass parameters
const liquidGlassStrength = ref(35)
const surfaceCurvature = ref(1.2)
const refractionIndex = ref(1.8)
const edgeSoftness = ref(3.0)
const backdropBlur = ref(20)
const materialOpacity = ref(0.15)
const surfaceSaturation = ref(180)
const borderDefinition = ref(0.4)

// Edge distortion profile
const centerIntensity = ref(0.85)
const edgeTransition = ref(60)
const edgeFeathering = ref(0.75)
const distortionShape = ref('radial')

// Light interaction
const surfaceHighlight = ref(0.7)
const depthShadows = ref(0.3)

// Generate unique filter ID
const filterId = `apple-liquid-glass-${Math.random().toString(36).slice(2)}`

// Background styles
const backgroundStyle = computed(() => ({
  backgroundImage: `url(${backgroundImageUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}))

const distortedBackgroundStyle = computed(() => ({
  backgroundImage: `url(${backgroundImageUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  filter: `url(#${filterId})`,
  opacity: 0.9
}))

// Advanced Apple displacement map generation
const appleDisplacementMapUrl = computed(() => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  // Clear with neutral displacement
  ctx.fillStyle = 'rgb(127, 127, 127)'
  ctx.fillRect(0, 0, 512, 512)

  const centerX = 256 + (mousePosition.x - 0.5) * 100 * centerIntensity.value
  const centerY = 256 + (mousePosition.y - 0.5) * 100 * centerIntensity.value

  // Create distortion based on shape
  if (distortionShape.value === 'radial') {
    createRadialDistortion(ctx, centerX, centerY)
  } else if (distortionShape.value === 'elliptical') {
    createEllipticalDistortion(ctx, centerX, centerY)
  } else if (distortionShape.value === 'squircle') {
    createSquircleDistortion(ctx, centerX, centerY)
  } else if (distortionShape.value === 'organic') {
    createOrganicDistortion(ctx, centerX, centerY)
  }

  return canvas.toDataURL()
})

// Distortion shape functions
const createRadialDistortion = (ctx, centerX, centerY) => {
  const maxRadius = 200 * surfaceCurvature.value
  const intensity = refractionIndex.value / 2.5

  for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
    for (let r = 0; r < maxRadius; r += 2) {
      const x = centerX + Math.cos(angle) * r
      const y = centerY + Math.sin(angle) * r

      if (x >= 0 && x < 512 && y >= 0 && y < 512) {
        const distanceFromCenter = r / maxRadius
        const falloff = Math.pow(1 - distanceFromCenter, 2 * edgeFeathering.value)

        const displacementX = Math.cos(angle) * intensity * falloff * 60
        const displacementY = Math.sin(angle) * intensity * falloff * 60

        const red = Math.max(0, Math.min(255, 127 + displacementX))
        const green = Math.max(0, Math.min(255, 127 + displacementY))

        ctx.fillStyle = `rgb(${Math.round(red)}, ${Math.round(green)}, 127)`
        ctx.fillRect(x - 1, y - 1, 2, 2)
      }
    }
  }
}

const createEllipticalDistortion = (ctx, centerX, centerY) => {
  const radiusX = 180 * surfaceCurvature.value
  const radiusY = 120 * surfaceCurvature.value
  const intensity = refractionIndex.value / 2.5

  for (let angle = 0; angle < Math.PI * 2; angle += 0.08) {
    for (let t = 0; t < 1; t += 0.02) {
      const x = centerX + Math.cos(angle) * radiusX * t
      const y = centerY + Math.sin(angle) * radiusY * t

      if (x >= 0 && x < 512 && y >= 0 && y < 512) {
        const falloff = Math.pow(1 - t, 1.5 * edgeFeathering.value)

        const displacementX = Math.cos(angle) * intensity * falloff * 50
        const displacementY = Math.sin(angle) * intensity * falloff * 35

        const red = Math.max(0, Math.min(255, 127 + displacementX))
        const green = Math.max(0, Math.min(255, 127 + displacementY))

        ctx.fillStyle = `rgb(${Math.round(red)}, ${Math.round(green)}, 127)`
        ctx.fillRect(x - 1, y - 1, 2, 2)
      }
    }
  }
}

const createSquircleDistortion = (ctx, centerX, centerY) => {
  const size = 160 * surfaceCurvature.value
  const intensity = refractionIndex.value / 2.5

  for (let x = -size; x <= size; x += 2) {
    for (let y = -size; y <= size; y += 2) {
      // Squircle equation: |x|^n + |y|^n = r^n
      const n = 4
      const normalizedX = x / size
      const normalizedY = y / size
      const squircleValue = Math.pow(Math.abs(normalizedX), n) + Math.pow(Math.abs(normalizedY), n)

      if (squircleValue <= 1) {
        const pixelX = centerX + x
        const pixelY = centerY + y

        if (pixelX >= 0 && pixelX < 512 && pixelY >= 0 && pixelY < 512) {
          const distanceFromEdge = 1 - squircleValue
          const falloff = Math.pow(distanceFromEdge, edgeFeathering.value)

          const displacementX = normalizedX * intensity * falloff * 40
          const displacementY = normalizedY * intensity * falloff * 40

          const red = Math.max(0, Math.min(255, 127 + displacementX))
          const green = Math.max(0, Math.min(255, 127 + displacementY))

          ctx.fillStyle = `rgb(${Math.round(red)}, ${Math.round(green)}, 127)`
          ctx.fillRect(pixelX - 1, pixelY - 1, 2, 2)
        }
      }
    }
  }
}

const createOrganicDistortion = (ctx, centerX, centerY) => {
  const baseRadius = 150 * surfaceCurvature.value
  const intensity = refractionIndex.value / 2.5

  for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
    // Create organic variation
    const organicRadius = baseRadius * (1 + 0.3 * Math.sin(angle * 3) * Math.cos(angle * 5))

    for (let r = 0; r < organicRadius; r += 1.5) {
      const x = centerX + Math.cos(angle) * r
      const y = centerY + Math.sin(angle) * r

      if (x >= 0 && x < 512 && y >= 0 && y < 512) {
        const distanceFromCenter = r / organicRadius
        const falloff = Math.pow(1 - distanceFromCenter, 1.8 * edgeFeathering.value)

        // Add organic wave displacement
        const waveX = Math.sin(angle * 2 + r * 0.02) * 0.3
        const waveY = Math.cos(angle * 3 + r * 0.015) * 0.3

        const displacementX = (Math.cos(angle) + waveX) * intensity * falloff * 45
        const displacementY = (Math.sin(angle) + waveY) * intensity * falloff * 45

        const red = Math.max(0, Math.min(255, 127 + displacementX))
        const green = Math.max(0, Math.min(255, 127 + displacementY))

        ctx.fillStyle = `rgb(${Math.round(red)}, ${Math.round(green)}, 127)`
        ctx.fillRect(x - 1, y - 1, 2, 2)
      }
    }
  }
}

// Backdrop distortion style (only affects background, not content)
const backdropDistortionStyle = computed(() => ({
  backdropFilter: `blur(${backdropBlur.value}px) saturate(${surfaceSaturation.value}%) brightness(110%)`,
}))

// Apple glass card style (content layer)
const appleGlassCardStyle = computed(() => {
  const transform = isHovered.value
    ? `translateY(-3px) scale(1.015)`
    : 'translateY(0) scale(1)'

  const shadowIntensity = depthShadows.value * (isHovered.value ? 1.4 : 1)

  return {
    transform,
    backgroundColor: `rgba(255, 255, 255, ${materialOpacity.value})`,
    border: `1px solid rgba(255, 255, 255, ${borderDefinition.value})`,
    boxShadow: `
      0 ${isHovered.value ? 30 : 25}px ${isHovered.value ? 60 : 50}px rgba(0, 0, 0, ${shadowIntensity}),
      inset 0 1px 0 rgba(255, 255, 255, ${borderDefinition.value + 0.2}),
      inset 0 -1px 0 rgba(255, 255, 255, ${borderDefinition.value * 0.6})
    `,
    '--surface-highlight': surfaceHighlight.value,
    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
  }
})

// Surface matrix for glass enhancement
const surfaceMatrix = computed(() => {
  const contrast = 1 + (surfaceSaturation.value - 180) / 300
  const brightness = 1 + surfaceHighlight.value * 0.15
  return `${contrast} 0 0 0 ${brightness * 0.08}
          0 ${contrast} 0 0 ${brightness * 0.08}
          0 0 ${contrast} 0 ${brightness * 0.08}
          0 0 0 1 0`
})

// Opacity profile for edge control
const opacityProfile = computed(() => {
  const center = centerIntensity.value
  const edge = edgeFeathering.value
  return `0 ${edge.toFixed(2)} ${center.toFixed(2)} 1`
})

// Edge parameters
const centerOpacity = computed(() => centerIntensity.value)
const midOpacity = computed(() => centerIntensity.value * 0.7)
const edgeOpacity = computed(() => edgeFeathering.value * 0.3)

// Event handlers
const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
  mousePosition.x = 0.5
  mousePosition.y = 0.5
}

const handleMouseMove = (event) => {
  if (!glassCard.value) return

  const rect = glassCard.value.getBoundingClientRect()
  mousePosition.x = (event.clientX - rect.left) / rect.width
  mousePosition.y = (event.clientY - rect.top) / rect.height
}

// Presets
const applyAppleLiquidGlassPreset = () => {
  liquidGlassStrength.value = 35
  surfaceCurvature.value = 1.2
  refractionIndex.value = 1.8
  edgeSoftness.value = 3.0
  backdropBlur.value = 20
  materialOpacity.value = 0.15
  surfaceSaturation.value = 180
  borderDefinition.value = 0.4
  centerIntensity.value = 0.85
  edgeTransition.value = 60
  edgeFeathering.value = 0.75
  distortionShape.value = 'radial'
  surfaceHighlight.value = 0.7
  depthShadows.value = 0.3
}

const applyMinimalGlassPreset = () => {
  liquidGlassStrength.value = 15
  surfaceCurvature.value = 0.8
  refractionIndex.value = 1.3
  edgeSoftness.value = 2.0
  backdropBlur.value = 15
  materialOpacity.value = 0.1
  surfaceSaturation.value = 150
  borderDefinition.value = 0.3
  centerIntensity.value = 0.6
  edgeTransition.value = 70
  edgeFeathering.value = 0.9
  distortionShape.value = 'elliptical'
  surfaceHighlight.value = 0.5
  depthShadows.value = 0.2
}

// Apply Apple preset on mount
onMounted(() => {
  applyAppleLiquidGlassPreset()
})
</script>

<style scoped>
.apple-liquid-glass-demo {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #0f1419;
}

.demo-background {
  position: fixed;
  inset: 0;
  z-index: 0;
}

.distorted-background-layer {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.liquid-glass-filters {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.demo-container {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4rem;
  align-items: center;
  max-width: 1400px;
  width: 100%;
}

.glass-card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
}

.apple-glass-card {
  position: relative;
  width: 420px;
  border-radius: 2rem;
  cursor: pointer;
  will-change: transform;
  isolation: isolate;
  overflow: hidden;
}

.backdrop-distortion-layer {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: 0;
  pointer-events: none;
}

.glass-content-layer {
  position: relative;
  z-index: 1;
  padding: 3.5rem 3rem;
  text-align: center;
  color: white;
}

.glass-content-layer::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, calc(var(--surface-highlight) * 0.4)) 0%,
    rgba(255, 255, 255, calc(var(--surface-highlight) * 0.08)) 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
  pointer-events: none;
  z-index: -1;
}

.glass-content-layer h2 {
  margin: 0 0 1.5rem;
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.85) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.glass-content-layer p {
  margin: 0 0 2.5rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.92);
  font-size: 1.05rem;
}

.apple-glass-button {
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 2rem;
  background: rgba(255, 255, 255, 0.18);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.apple-glass-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.apple-controls-panel {
  width: 380px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2.5rem;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(25px);
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: white;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
}

.apple-controls-panel h3 {
  margin: 0 0 2rem;
  font-size: 1.4rem;
  font-weight: 800;
  text-align: center;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.control-group {
  margin-bottom: 2.5rem;
}

.control-group h4 {
  margin: 0 0 1.2rem;
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}

.apple-control-field {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.8rem;
  align-items: center;
  margin-bottom: 1.2rem;
}

.apple-control-field label {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.apple-control-field input[type="range"] {
  grid-column: 1 / -1;
  margin: 0.4rem 0;
  accent-color: #007AFF;
}

.apple-control-field select {
  grid-column: 1 / -1;
  padding: 0.6rem;
  border-radius: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
}

.apple-control-field span {
  font-size: 0.85rem;
  font-weight: 700;
  color: #007AFF;
  font-variant-numeric: tabular-nums;
  padding: 0.2rem 0.6rem;
  background: rgba(0, 122, 255, 0.1);
  border-radius: 0.5rem;
}

.preset-section {
  display: grid;
  gap: 1rem;
  margin-top: 2rem;
}

.apple-preset-button {
  width: 100%;
  padding: 1.2rem;
  border: none;
  border-radius: 1.2rem;
  background: linear-gradient(135deg, #007AFF 0%, #0056CC 100%);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 8px 32px rgba(0, 122, 255, 0.25);
}

.apple-preset-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 45px rgba(0, 122, 255, 0.35);
}

.apple-preset-button.secondary {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.apple-preset-button.secondary:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.15);
}

/* Custom scrollbar */
.apple-controls-panel::-webkit-scrollbar {
  width: 6px;
}

.apple-controls-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.apple-controls-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

@media (max-width: 1200px) {
  .demo-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .apple-glass-card {
    width: 100%;
    max-width: 420px;
  }

  .apple-controls-panel {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    max-height: 70vh;
  }
}
</style>