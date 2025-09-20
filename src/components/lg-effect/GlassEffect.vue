<template>
  <section class="liquid-glass">
    <svg v-if="filterReady" class="liquid-glass__filter" aria-hidden="true">
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

    <div ref="glassRef" class="liquid-glass__card" :style="cardStyle">
      <div
        class="liquid-glass__layer liquid-glass__layer--liquid"
        :style="liquidStyle"
      />
      <div
        class="liquid-glass__layer liquid-glass__layer--noise"
        :style="noiseStyle"
      />
      <div
        class="liquid-glass__layer liquid-glass__layer--highlight"
        :style="surfaceHighlightStyle"
      />

      <div class="liquid-glass__content">
        <slot />
      </div>

      <div
        class="liquid-glass__layer liquid-glass__layer--light"
        :style="lightStyle"
      />
      <div class="liquid-glass__outline" :style="outlineStyle" />
    </div>
  </section>
</template>

<script setup>
import { computed, toRef } from "vue";
import useGlassDemo from "./index.js";

const props = defineProps({
  backgroundImageUrl: {
    type: String,
    default: "",
  },
});

const backgroundImageUrl = toRef(props, "backgroundImageUrl");

const {
  filterReady,
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
} = useGlassDemo({
  displacementScale: 65,
  aberrationIntensity: 2.8,
  surfaceCurvature: 1.8,
  glassBlur: 25,
  glassSaturation: 185,
  refractionDepth: 2.0,
  surfaceReflection: 0.45,
  shadowDepth: 0.4,
  shaderCornerRadius: 0.2,
  distortion: {
    start: 0.3,
    end: 0.2,
    offset: 0.15,
  },
  scaling: {
    start: 0,
    end: 1,
  },
  backgroundImageUrl,
});
</script>

<style scoped src="./index.css"></style>
