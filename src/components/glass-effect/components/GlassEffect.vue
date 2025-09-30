<template>
  <div class="glass-effect">
    <GeFilter :filterProps="filterProps" />

    <div class="glass-effect__content">
      <slot />
    </div>

    <GeHighlight :options="{ highlightReflection }" :intensity />

    <GeNoise :options="{ noiseStrength, noiseRefractionDepth }" :intensity />

    <GeLight :options="{ lightIntensity, lightSpread, lightHue }" :intensity />

    <GeOutline
      :options="{
        outlineIntensity,
        outlineGlassTintHue,
        surfaceReflection,
        shadowDepth,
      }"
      :intensity
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { createEffectOptions } from "./GlassEffectDefaults.js";
import { createFilterProps } from "../layer-filter-props.js";
import { ShaderDisplacementGenerator } from "../filter-displacement-generator.ts";
import GeFilter from "./GeFilter.vue";
import GeHighlight from "./GeHighlight.vue";
import GeNoise from "./GeNoise.vue";
import GeLight from "./GeLight.vue";
import GeOutline from "./GeOutline.vue";

const props = defineProps({
  sourceElementId: {
    type: String,
    default: "",
  },
  userOptions: {
    type: Object,
    default: () => ({}),
  },
  intensity: {
    type: Number,
    default: 1,
    validator: (value) => value >= 0 && value <= 1,
  },
});

const opts = createEffectOptions(props.userOptions);

// Filter state
const filterId = `apple-liquid-glass-${Math.random().toString(36).slice(2)}`;
const filterReady = ref(false);
const shaderMapUrl = ref("");

// Expose filterId to parent component
defineExpose({
  filterId,
});

// Generate shader displacement map
const generateShaderDisplacementMap = () => {
  const generator = new ShaderDisplacementGenerator({
    width: 400,
    height: 400,
    cornerRadius: opts.shaderCornerRadius,
    distortionStart: opts.shaderDistortionStart,
    distortionEnd: opts.shaderDistortionEnd,
    distortionOffset: opts.shaderDistortionOffset,
    scalingStart: opts.shaderScalingStart,
    scalingEnd: opts.shaderScalingEnd,
  });
  const url = generator.updateShader();

  filterReady.value = true;
  shaderMapUrl.value = url;
  generator.destroy();
};

// Create filter props
const filterProps = computed(() =>
  createFilterProps(opts, props.intensity, {
    filterReady: filterReady.value,
    filterId,
    shaderMapUrl: shaderMapUrl.value,
  })
);

// Initialize shader on mount
onMounted(() => {
  generateShaderDisplacementMap();
});

const {
  lightIntensity,
  lightSpread,
  lightHue,
  highlightReflection,
  noiseStrength,
  noiseRefractionDepth,
  outlineIntensity,
  outlineGlassTintHue,
  surfaceReflection,
  shadowDepth,
} = opts;
</script>

<style scoped>
.glass-effect {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.glass-effect__content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: inherit;
  overflow: hidden;
  cursor: pointer;
  isolation: isolate;
  will-change: transform;
  transition: box-shadow 0.25s ease, border 0.25s ease, background 0.25s ease;
  z-index: 1;
}
</style>
