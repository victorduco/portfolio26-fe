<template>
  <div class="glass-demo">
    <div class="glass-demo__background" />

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
                :values="edgeIntensityMatrix"
                result="EDGE_INTENSITY"
              />

              <feOffset
                in="SourceGraphic"
                dx="0"
                dy="0"
                result="CENTER_ORIGINAL"
              />

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

              <feGaussianBlur
                :stdDeviation="liquidGlassBlur"
                in="RGB_COMBINED"
                result="ABERRATED_BLURRED"
              />

              <feComposite
                in="ABERRATED_BLURRED"
                in2="EDGE_MASK"
                operator="in"
                result="EDGE_ABERRATION"
              />

              <feComponentTransfer in="EDGE_MASK" result="INVERTED_MASK">
                <feFuncA type="table" tableValues="1 0" />
              </feComponentTransfer>
              <feComposite
                in="CENTER_ORIGINAL"
                in2="INVERTED_MASK"
                operator="in"
                result="CENTER_CLEAN"
              />

              <feComposite
                in="EDGE_ABERRATION"
                in2="CENTER_CLEAN"
                operator="over"
                result="FINAL_EFFECT"
              />

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
          <div class="glass-demo__liquid" :style="liquidStyle" />

          <div class="glass-demo__noise" :style="noiseStyle" />
          <div
            class="glass-demo__surface-highlight"
            :style="surfaceHighlightStyle"
          />

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

          <div class="glass-demo__light" :style="lightStyle" />
        </div>

        <span class="glass-demo__outline" :style="outlineStyle" />
      </div>
    </div>
  </div>
</template>

<script setup>
import useGlassDemo from "./index.js";

const {
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
  handleEnter,
  handleLeave,
  handleDown,
  handleUp,
  handleMouseMove,
} = useGlassDemo({
  displacementScale: 65,
  aberrationIntensity: 2.8,
  surfaceCurvature: 1.8,
  glassBlur: 25,
  glassSaturation: 185,
  refractionDepth: 2.0,
  surfaceReflection: 0.45,
  shadowDepth: 0.4,
  parallaxIntensity: 0.35,
});
</script>

<style scoped src="./index.css"></style>
