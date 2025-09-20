<template>
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
</template>

<script setup>
defineProps({
  filterReady: {
    type: Boolean,
    required: true,
  },
  filterId: {
    type: String,
    required: true,
  },
  currentMap: {
    type: String,
    required: true,
  },
  edgeIntensityMatrix: {
    type: String,
    required: true,
  },
  redScale: {
    type: Number,
    required: true,
  },
  greenScale: {
    type: Number,
    required: true,
  },
  liquidGlassBlur: {
    type: Number,
    required: true,
  },
  surfaceEnhancementMatrix: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.liquid-glass__filter {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
</style>