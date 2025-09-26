<!--
TODO: Главный координатор стеклянного эффекта

ВХОДЯЩИЕ ПРОПСЫ:
- sourceElementId: String - ID DOM элемента для клонирования в фильтре
- userOptions: Object - пользовательские опции для переопределения дефолтов:
  {
    // Core displacement parameters
    displacementScale: 65,
    aberrationIntensity: 2.8,
    displacementCurvature: 1.8,

    // Glass material properties
    glassBlur: 25,
    glassSaturation: 185,
    refractionDepth: 2.0,
    surfaceReflection: 0.45,

    // Light and shadow
    highlightIntensity: 0.75,
    highlightSpread: 1.1,
    highlightHue: 210,
    shadowDepth: 0.4,

    // Advanced effects
    glassBrightness: 115,
    glassContrast: 118,
    glassTintHue: 210,
    glassTintOpacity: 0.38,
    noiseStrength: 0.22,

    // Shader distortion parameters
    shaderCornerRadius: 0.2,
    shaderDistortionStart: 0.3,
    shaderDistortionEnd: 0.2,
    shaderDistortionOffset: 0.15,
    shaderScalingStart: 0,
    shaderScalingEnd: 1
  }
- intensity: Number (0-1) - общая интенсивность эффекта

СЛОТЫ:
- default: обычное состояние контента
- hover: состояние при наведении
- active: активное состояние

ФУНКЦИОНАЛЬНОСТЬ:
- Создает конфигурацию через createEffectOptions(userOptions)
- Деструктурирует опции и передает подкомпонентам
- Координирует все слои стеклянного эффекта

КАРТА СООТВЕТСТВИЯ (старое → новое):

КОМПОНЕНТЫ:
- GlassEffect.vue (монолит) → GlassEffect.vue + 5 подкомпонентов
- SvgFilter.vue → GeFilter.vue (+ DOM source логика)
- effect-options.js → GlassEffectDefaults.js

СТРУКТУРА СЛОЕВ:
Старое:
  <section class="liquid-glass">
    <SvgFilter />
    <div class="liquid-glass__card" ref="glassElementRef">
      <div class="liquid-glass__layer--dom-source" />
      <div class="liquid-glass__layer--highlight" />
      <div class="liquid-glass__layer--noise" />
      <div class="liquid-glass__content"><slot /></div>
      <div class="liquid-glass__layer--light" />
      <div class="liquid-glass__outline" />
    </div>
  </section>

Новое:
  <div class="glass-effect">
    <GeFilter /> 
    <div class="glass-effect__content"> - 3 слота вместо 1 

    </div>
    <GeHighlight /> - было liquid-glass__layer--highlight
    <GeNoise />  - было liquid-glass__layer--noise
    <GeLight /> - было liquid-glass__layer--light 
    <GeOutline - было liquid-glass__outline + card shadow 



    ПРОПСЫ:
- glassConfig → userOptions
- Отдельные пропсы → объекты { options, intensity }

CSS КЛАССЫ:
- .liquid-glass → .glass-effect
- .liquid-glass__layer--* → .glass-* в отдельных компонентах
- .liquid-glass__card → удален (логика перенесена в GeOutline)
-->
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

// Generate shader displacement map
const generateShaderDisplacementMap = () => {
  console.log('🎨 Generating shader displacement map...');
  console.log('Shader options:', {
    width: 400,
    height: 400,
    cornerRadius: opts.shaderCornerRadius,
    distortionStart: opts.shaderDistortionStart,
    distortionEnd: opts.shaderDistortionEnd,
    distortionOffset: opts.shaderDistortionOffset,
    scalingStart: opts.shaderScalingStart,
    scalingEnd: opts.shaderScalingEnd,
  });

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
  console.log('🎨 Generated shader URL length:', url.length);
  console.log('🎨 Setting filterReady to true');

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
  console.log('🚀 GlassEffect mounted, generating shader...');
  generateShaderDisplacementMap();
  console.log('🚀 GlassEffect shader generation complete');
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
