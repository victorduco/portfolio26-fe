<template>
  <div class="glass-control-panel">
    <div class="glass-control-panel__header">
      <h3>Glass Effect Controls</h3>
    </div>

    <div class="glass-control-panel__content">
      <!-- Displacement Section -->
      <section class="glass-control-panel__section">
        <h4>Displacement</h4>

        <label class="glass-control-panel__field">
          <span>Displacement Scale</span>
          <input
            type="range"
            min="10"
            max="120"
            step="1"
            v-model.number="localOptions.displacementScale"
          />
          <input
            type="number"
            min="10"
            max="120"
            v-model.number="localOptions.displacementScale"
            class="glass-control-panel__number-input"
          />
        </label>

        <label class="glass-control-panel__field">
          <span>Aberration Intensity</span>
          <input
            type="range"
            min="0"
            max="8"
            step="0.1"
            v-model.number="localOptions.aberrationIntensity"
          />
          <input
            type="number"
            min="0"
            max="8"
            step="0.1"
            v-model.number="localOptions.aberrationIntensity"
            class="glass-control-panel__number-input"
          />
        </label>

        <label class="glass-control-panel__field">
          <span>Displacement Curvature</span>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            v-model.number="localOptions.displacementCurvature"
          />
          <input
            type="number"
            min="0.5"
            max="3.0"
            step="0.1"
            v-model.number="localOptions.displacementCurvature"
            class="glass-control-panel__number-input"
          />
        </label>
      </section>

      <!-- Glass Material Section -->
      <section class="glass-control-panel__section">
        <h4>Glass Material</h4>

        <label class="glass-control-panel__field">
          <span>Glass Blur</span>
          <input
            type="range"
            min="8"
            max="40"
            step="1"
            v-model.number="localOptions.glassBlur"
          />
          <input
            type="number"
            min="8"
            max="40"
            v-model.number="localOptions.glassBlur"
            class="glass-control-panel__number-input"
          />
        </label>

        <label class="glass-control-panel__field">
          <span>Glass Saturation</span>
          <input
            type="range"
            min="120"
            max="280"
            step="5"
            v-model.number="localOptions.glassSaturation"
          />
          <input
            type="number"
            min="120"
            max="280"
            v-model.number="localOptions.glassSaturation"
            class="glass-control-panel__number-input"
          />
        </label>

        <label class="glass-control-panel__field">
          <span>Glass Brightness</span>
          <input
            type="range"
            min="85"
            max="140"
            step="1"
            v-model.number="localOptions.glassBrightness"
          />
          <input
            type="number"
            min="85"
            max="140"
            v-model.number="localOptions.glassBrightness"
            class="glass-control-panel__number-input"
          />
        </label>

        <label class="glass-control-panel__field">
          <span>Glass Contrast</span>
          <input
            type="range"
            min="85"
            max="135"
            step="1"
            v-model.number="localOptions.glassContrast"
          />
          <input
            type="number"
            min="85"
            max="135"
            v-model.number="localOptions.glassContrast"
            class="glass-control-panel__number-input"
          />
        </label>
      </section>

      <!-- Tint Section -->
      <section class="glass-control-panel__section">
        <h4>Tint</h4>

        <label class="glass-control-panel__field">
          <span>Tint Hue</span>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            v-model.number="localOptions.glassTintHue"
          />
          <input
            type="number"
            min="0"
            max="360"
            v-model.number="localOptions.glassTintHue"
            class="glass-control-panel__number-input"
          />
        </label>

        <label class="glass-control-panel__field">
          <span>Tint Opacity</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="localOptions.glassTintOpacity"
          />
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            v-model.number="localOptions.glassTintOpacity"
            class="glass-control-panel__number-input"
          />
        </label>
      </section>

      <!-- Effects Section -->
      <section class="glass-control-panel__section">
        <h4>Effects</h4>

        <label class="glass-control-panel__field">
          <span>Refraction Depth</span>
          <input
            type="range"
            min="0.8"
            max="2.5"
            step="0.1"
            v-model.number="localOptions.refractionDepth"
          />
          <input
            type="number"
            min="0.8"
            max="2.5"
            step="0.1"
            v-model.number="localOptions.refractionDepth"
            class="glass-control-panel__number-input"
          />
        </label>

        <label class="glass-control-panel__field">
          <span>Surface Reflection</span>
          <input
            type="range"
            min="0.1"
            max="0.8"
            step="0.01"
            v-model.number="localOptions.surfaceReflection"
          />
          <input
            type="number"
            min="0.1"
            max="0.8"
            step="0.01"
            v-model.number="localOptions.surfaceReflection"
            class="glass-control-panel__number-input"
          />
        </label>

        <label class="glass-control-panel__field">
          <span>Shadow Depth</span>
          <input
            type="range"
            min="0.1"
            max="0.8"
            step="0.01"
            v-model.number="localOptions.shadowDepth"
          />
          <input
            type="number"
            min="0.1"
            max="0.8"
            step="0.01"
            v-model.number="localOptions.shadowDepth"
            class="glass-control-panel__number-input"
          />
        </label>
      </section>

      <!-- Light Section -->
      <section class="glass-control-panel__section">
        <h4>Light</h4>

        <label class="glass-control-panel__field">
          <span>Light Intensity</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="localOptions.lightIntensity"
          />
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            v-model.number="localOptions.lightIntensity"
            class="glass-control-panel__number-input"
          />
        </label>

        <label class="glass-control-panel__field">
          <span>Light Spread</span>
          <input
            type="range"
            min="0.6"
            max="1.6"
            step="0.01"
            v-model.number="localOptions.lightSpread"
          />
          <input
            type="number"
            min="0.6"
            max="1.6"
            step="0.01"
            v-model.number="localOptions.lightSpread"
            class="glass-control-panel__number-input"
          />
        </label>

        <label class="glass-control-panel__field">
          <span>Light Hue</span>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            v-model.number="localOptions.lightHue"
          />
          <input
            type="number"
            min="0"
            max="360"
            v-model.number="localOptions.lightHue"
            class="glass-control-panel__number-input"
          />
        </label>
      </section>

      <!-- Highlight Section -->
      <section class="glass-control-panel__section">
        <h4>Highlight</h4>

        <label class="glass-control-panel__field">
          <span>Highlight Reflection</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="localOptions.highlightReflection"
          />
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            v-model.number="localOptions.highlightReflection"
            class="glass-control-panel__number-input"
          />
        </label>
      </section>

      <!-- Noise Section -->
      <section class="glass-control-panel__section">
        <h4>Noise</h4>

        <label class="glass-control-panel__field">
          <span>Noise Strength</span>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.01"
            v-model.number="localOptions.noiseStrength"
          />
          <input
            type="number"
            min="0"
            max="0.5"
            step="0.01"
            v-model.number="localOptions.noiseStrength"
            class="glass-control-panel__number-input"
          />
        </label>

        <label class="glass-control-panel__field">
          <span>Noise Refraction Depth</span>
          <input
            type="range"
            min="0.8"
            max="2.5"
            step="0.1"
            v-model.number="localOptions.noiseRefractionDepth"
          />
          <input
            type="number"
            min="0.8"
            max="2.5"
            step="0.1"
            v-model.number="localOptions.noiseRefractionDepth"
            class="glass-control-panel__number-input"
          />
        </label>
      </section>

      <!-- Outline Section -->
      <section class="glass-control-panel__section">
        <h4>Outline</h4>

        <label class="glass-control-panel__field">
          <span>Outline Intensity</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="localOptions.outlineIntensity"
          />
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            v-model.number="localOptions.outlineIntensity"
            class="glass-control-panel__number-input"
          />
        </label>

        <label class="glass-control-panel__field">
          <span>Outline Tint Hue</span>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            v-model.number="localOptions.outlineGlassTintHue"
          />
          <input
            type="number"
            min="0"
            max="360"
            v-model.number="localOptions.outlineGlassTintHue"
            class="glass-control-panel__number-input"
          />
        </label>
      </section>

      <!-- Shader Section -->
      <section class="glass-control-panel__section">
        <h4>Shader</h4>

        <label class="glass-control-panel__field">
          <span>Corner Radius</span>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.01"
            v-model.number="localOptions.shaderCornerRadius"
          />
          <input
            type="number"
            min="0"
            max="0.5"
            step="0.01"
            v-model.number="localOptions.shaderCornerRadius"
            class="glass-control-panel__number-input"
          />
        </label>

        <label class="glass-control-panel__field">
          <span>Distortion Start</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="localOptions.shaderDistortionStart"
          />
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            v-model.number="localOptions.shaderDistortionStart"
            class="glass-control-panel__number-input"
          />
        </label>

        <label class="glass-control-panel__field">
          <span>Distortion End</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="localOptions.shaderDistortionEnd"
          />
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            v-model.number="localOptions.shaderDistortionEnd"
            class="glass-control-panel__number-input"
          />
        </label>

        <label class="glass-control-panel__field">
          <span>Distortion Offset</span>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.01"
            v-model.number="localOptions.shaderDistortionOffset"
          />
          <input
            type="number"
            min="0"
            max="0.5"
            step="0.01"
            v-model.number="localOptions.shaderDistortionOffset"
            class="glass-control-panel__number-input"
          />
        </label>

        <label class="glass-control-panel__field">
          <span>Scaling Start</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="localOptions.shaderScalingStart"
          />
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            v-model.number="localOptions.shaderScalingStart"
            class="glass-control-panel__number-input"
          />
        </label>

        <label class="glass-control-panel__field">
          <span>Scaling End</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="localOptions.shaderScalingEnd"
          />
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            v-model.number="localOptions.shaderScalingEnd"
            class="glass-control-panel__number-input"
          />
        </label>
      </section>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const localOptions = props.modelValue;

// Watch for changes and emit updates
watch(
  () => localOptions,
  (newValue) => {
    emit('update:modelValue', newValue);
  },
  { deep: true }
);
</script>

<style scoped>
.glass-control-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 380px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.glass-control-panel__header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
}

.glass-control-panel__header h3 {
  margin: 0;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
}

.glass-control-panel__content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.glass-control-panel__content::-webkit-scrollbar {
  width: 8px;
}

.glass-control-panel__content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

.glass-control-panel__content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.glass-control-panel__content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.glass-control-panel__section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.glass-control-panel__section h4 {
  margin: 0 0 8px;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 8px;
}

.glass-control-panel__field {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.88);
}

.glass-control-panel__field span {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
}

.glass-control-panel__field input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.glass-control-panel__field input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  border: 2px solid rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.glass-control-panel__field input[type="range"]::-webkit-slider-thumb:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.glass-control-panel__field input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  border: 2px solid rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.glass-control-panel__field input[type="range"]::-moz-range-thumb:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.glass-control-panel__number-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.9rem;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
  font-variant-numeric: tabular-nums;
  transition: all 0.2s ease;
}

.glass-control-panel__number-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(0, 0, 0, 0.4);
}

.glass-control-panel__number-input:hover {
  border-color: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .glass-control-panel {
    width: 100%;
    max-width: 100vw;
  }
}
</style>
