<!--
SVG элемент с displacement map изображением
Генерирует shader displacement map и отображает его
-->
<template>
  <svg
    v-if="shaderMapUrl && intensity >= 0.01"
    class="glass-filter__displacement-svg"
    aria-hidden="true"
  >
    <image
      :id="`${filterId}-displacement-image`"
      x="0"
      y="0"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      :href="shaderMapUrl"
      :xlink:href="shaderMapUrl"
    />
  </svg>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { ShaderDisplacementGenerator } from "./ShaderDisplacementGenerator.ts";

const props = defineProps({
  filterId: { type: String, required: true },
  intensity: { type: Number, required: true },
  shaderCornerRadius: { type: Number, required: true },
  shaderDistortionStart: { type: Number, required: true },
  shaderDistortionEnd: { type: Number, required: true },
  shaderDistortionOffset: { type: Number, required: true },
  shaderScalingStart: { type: Number, required: true },
  shaderScalingEnd: { type: Number, required: true },
});

const shaderMapUrl = ref("");

const generateShaderDisplacementMap = () => {
  const generator = new ShaderDisplacementGenerator({
    width: 400,
    height: 400,
    cornerRadius: props.shaderCornerRadius,
    distortionStart: props.shaderDistortionStart,
    distortionEnd: props.shaderDistortionEnd,
    distortionOffset: props.shaderDistortionOffset,
    scalingStart: props.shaderScalingStart,
    scalingEnd: props.shaderScalingEnd,
  });
  shaderMapUrl.value = generator.updateShader();
  generator.destroy();
};

onMounted(() => {
  generateShaderDisplacementMap();
});

watch(
  () => [
    props.shaderCornerRadius,
    props.shaderDistortionStart,
    props.shaderDistortionEnd,
    props.shaderDistortionOffset,
    props.shaderScalingStart,
    props.shaderScalingEnd,
  ],
  () => generateShaderDisplacementMap(),
  { deep: true }
);

defineExpose({ shaderMapUrl });
</script>

<style scoped>
.glass-filter__displacement-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  opacity: 0;
}
</style>
