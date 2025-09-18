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
import useGlassDemo from "./index.js";

const {
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
  backgroundStyle,
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
} = useGlassDemo();
</script>

<style scoped src="./index.css"></style>
