<template>
  <Teleport to="body">
    <div v-if="isVisible" class="glass-debugger">
      <div class="glass-debugger__header">
        <h3>Glass Effect Debugger</h3>
        <button class="glass-debugger__close" @click="isVisible = false">✕</button>
      </div>

      <div class="glass-debugger__content">
        <!-- Global Controls Section -->
        <section class="glass-debugger__section glass-debugger__section--global">
          <h4>Global Controls</h4>

          <label class="glass-debugger__field">
            <span>Effect Intensity ({{ intensityDisplay }})</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalIntensity"
            />
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalIntensity"
              class="glass-debugger__number-input"
            />
          </label>
        </section>

        <!-- Displacement Section -->
        <section class="glass-debugger__section">
          <h4>Displacement</h4>

          <label class="glass-debugger__field">
            <span>Displacement Scale</span>
            <input
              type="range"
              min="10"
              max="120"
              step="1"
              v-model.number="globalOptions.displacementScale"
            />
            <input
              type="number"
              min="10"
              max="120"
              v-model.number="globalOptions.displacementScale"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Aberration Intensity</span>
            <input
              type="range"
              min="0"
              max="8"
              step="0.1"
              v-model.number="globalOptions.aberrationIntensity"
            />
            <input
              type="number"
              min="0"
              max="8"
              step="0.1"
              v-model.number="globalOptions.aberrationIntensity"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Displacement Curvature</span>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              v-model.number="globalOptions.displacementCurvature"
            />
            <input
              type="number"
              min="0.5"
              max="3.0"
              step="0.1"
              v-model.number="globalOptions.displacementCurvature"
              class="glass-debugger__number-input"
            />
          </label>
        </section>

        <!-- Glass Material Section -->
        <section class="glass-debugger__section">
          <h4>Glass Material</h4>

          <label class="glass-debugger__field">
            <span>Glass Blur</span>
            <input
              type="range"
              min="8"
              max="40"
              step="1"
              v-model.number="globalOptions.glassBlur"
            />
            <input
              type="number"
              min="8"
              max="40"
              v-model.number="globalOptions.glassBlur"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Glass Saturation</span>
            <input
              type="range"
              min="0"
              max="400"
              step="5"
              v-model.number="globalOptions.glassSaturation"
            />
            <input
              type="number"
              min="0"
              max="400"
              v-model.number="globalOptions.glassSaturation"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Glass Brightness</span>
            <input
              type="range"
              min="0"
              max="500"
              step="1"
              v-model.number="globalOptions.glassBrightness"
            />
            <input
              type="number"
              min="0"
              max="500"
              v-model.number="globalOptions.glassBrightness"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Glass Contrast</span>
            <input
              type="range"
              min="0"
              max="500"
              step="1"
              v-model.number="globalOptions.glassContrast"
            />
            <input
              type="number"
              min="0"
              max="500"
              v-model.number="globalOptions.glassContrast"
              class="glass-debugger__number-input"
            />
          </label>
        </section>

        <!-- Tint Section -->
        <section class="glass-debugger__section">
          <h4>Tint</h4>

          <label class="glass-debugger__field">
            <span>Tint Hue</span>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              v-model.number="globalOptions.glassTintHue"
            />
            <input
              type="number"
              min="0"
              max="360"
              v-model.number="globalOptions.glassTintHue"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Tint Opacity</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalOptions.glassTintOpacity"
            />
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalOptions.glassTintOpacity"
              class="glass-debugger__number-input"
            />
          </label>
        </section>

        <!-- Effects Section -->
        <section class="glass-debugger__section">
          <h4>Effects</h4>

          <label class="glass-debugger__field">
            <span>Refraction Depth</span>
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.1"
              v-model.number="globalOptions.refractionDepth"
            />
            <input
              type="number"
              min="0.8"
              max="2.5"
              step="0.1"
              v-model.number="globalOptions.refractionDepth"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Surface Reflection</span>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.01"
              v-model.number="globalOptions.surfaceReflection"
            />
            <input
              type="number"
              min="0.1"
              max="0.8"
              step="0.01"
              v-model.number="globalOptions.surfaceReflection"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Shadow Depth</span>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.01"
              v-model.number="globalOptions.shadowDepth"
            />
            <input
              type="number"
              min="0.1"
              max="0.8"
              step="0.01"
              v-model.number="globalOptions.shadowDepth"
              class="glass-debugger__number-input"
            />
          </label>
        </section>

        <!-- Light Section -->
        <section class="glass-debugger__section">
          <h4>Light</h4>

          <label class="glass-debugger__field">
            <span>Light Intensity</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalOptions.lightIntensity"
            />
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalOptions.lightIntensity"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Light Spread</span>
            <input
              type="range"
              min="0.6"
              max="1.6"
              step="0.01"
              v-model.number="globalOptions.lightSpread"
            />
            <input
              type="number"
              min="0.6"
              max="1.6"
              step="0.01"
              v-model.number="globalOptions.lightSpread"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Light Hue</span>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              v-model.number="globalOptions.lightHue"
            />
            <input
              type="number"
              min="0"
              max="360"
              v-model.number="globalOptions.lightHue"
              class="glass-debugger__number-input"
            />
          </label>
        </section>

        <!-- Highlight Section -->
        <section class="glass-debugger__section">
          <h4>Highlight</h4>

          <label class="glass-debugger__field">
            <span>Highlight Reflection</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalOptions.highlightReflection"
            />
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalOptions.highlightReflection"
              class="glass-debugger__number-input"
            />
          </label>
        </section>

        <!-- Noise Section -->
        <section class="glass-debugger__section">
          <h4>Noise</h4>

          <label class="glass-debugger__field">
            <span>Noise Strength</span>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              v-model.number="globalOptions.noiseStrength"
            />
            <input
              type="number"
              min="0"
              max="0.5"
              step="0.01"
              v-model.number="globalOptions.noiseStrength"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Noise Refraction Depth</span>
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.1"
              v-model.number="globalOptions.noiseRefractionDepth"
            />
            <input
              type="number"
              min="0.8"
              max="2.5"
              step="0.1"
              v-model.number="globalOptions.noiseRefractionDepth"
              class="glass-debugger__number-input"
            />
          </label>
        </section>

        <!-- Outline Section -->
        <section class="glass-debugger__section">
          <h4>Outline</h4>

          <label class="glass-debugger__field">
            <span>Outline Intensity</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalOptions.outlineIntensity"
            />
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalOptions.outlineIntensity"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Outline Tint Hue</span>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              v-model.number="globalOptions.outlineGlassTintHue"
            />
            <input
              type="number"
              min="0"
              max="360"
              v-model.number="globalOptions.outlineGlassTintHue"
              class="glass-debugger__number-input"
            />
          </label>
        </section>

        <!-- Shader Section (only in dynamic mode) -->
        <section v-if="displacementMode === 'dynamic'" class="glass-debugger__section">
          <h4>Shader (Dynamic Generation)</h4>

          <label class="glass-debugger__field">
            <span>Corner Radius</span>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              v-model.number="globalOptions.shaderCornerRadius"
            />
            <input
              type="number"
              min="-1"
              max="1"
              step="0.01"
              v-model.number="globalOptions.shaderCornerRadius"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Rect Width (0 = diamond)</span>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              v-model.number="globalOptions.shaderRectWidth"
            />
            <input
              type="number"
              min="0"
              max="0.5"
              step="0.01"
              v-model.number="globalOptions.shaderRectWidth"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Rect Height (0 = diamond)</span>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              v-model.number="globalOptions.shaderRectHeight"
            />
            <input
              type="number"
              min="0"
              max="0.5"
              step="0.01"
              v-model.number="globalOptions.shaderRectHeight"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Center Offset X</span>
            <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.01"
              v-model.number="globalOptions.shaderCenterOffsetX"
            />
            <input
              type="number"
              min="-0.5"
              max="0.5"
              step="0.01"
              v-model.number="globalOptions.shaderCenterOffsetX"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Center Offset Y</span>
            <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.01"
              v-model.number="globalOptions.shaderCenterOffsetY"
            />
            <input
              type="number"
              min="-0.5"
              max="0.5"
              step="0.01"
              v-model.number="globalOptions.shaderCenterOffsetY"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Edge Softness</span>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              v-model.number="globalOptions.shaderEdgeSoftness"
            />
            <input
              type="number"
              min="0.1"
              max="10"
              step="0.1"
              v-model.number="globalOptions.shaderEdgeSoftness"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Distortion Start</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalOptions.shaderDistortionStart"
            />
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalOptions.shaderDistortionStart"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Distortion End</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalOptions.shaderDistortionEnd"
            />
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalOptions.shaderDistortionEnd"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Distortion Offset</span>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              v-model.number="globalOptions.shaderDistortionOffset"
            />
            <input
              type="number"
              min="0"
              max="0.5"
              step="0.01"
              v-model.number="globalOptions.shaderDistortionOffset"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Scaling Start</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalOptions.shaderScalingStart"
            />
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalOptions.shaderScalingStart"
              class="glass-debugger__number-input"
            />
          </label>

          <label class="glass-debugger__field">
            <span>Scaling End</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalOptions.shaderScalingEnd"
            />
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalOptions.shaderScalingEnd"
              class="glass-debugger__number-input"
            />
          </label>
        </section>

        <!-- Displacement Map Configuration Section -->
        <section class="glass-debugger__section glass-debugger__section--displacement">
          <h4>Displacement Map Configuration</h4>

          <label class="glass-debugger__field">
            <span>Mode</span>
            <select v-model="displacementMode" class="glass-debugger__select">
              <option value="static">Static Map (from files)</option>
              <option value="dynamic">Dynamic (shader generated)</option>
            </select>
          </label>

          <!-- Static map selector -->
          <label v-if="displacementMode === 'static'" class="glass-debugger__field">
            <span>Select Static Map</span>
            <select v-model="globalStaticMap" class="glass-debugger__select">
              <option v-for="map in availableDistmaps" :key="map.value" :value="map.value">
                {{ map.label }}
              </option>
            </select>
          </label>

          <!-- Instructions -->
          <div class="glass-debugger__hint">
            <span v-if="displacementMode === 'static'">
              💡 Static maps are pre-generated and faster. Select from library above.
            </span>
            <span v-else>
              💡 Dynamic mode generates the map in real-time using Shader parameters above.
            </span>
          </div>

          <!-- Preview -->
          <div class="glass-debugger__preview">
            <span class="glass-debugger__preview-label">
              Current Displacement Map
              <span v-if="displacementMode === 'dynamic'" class="glass-debugger__preview-badge">
                Live Generated
              </span>
            </span>
            <img
              v-if="previewMapUrl"
              :src="previewMapUrl"
              alt="Displacement Map Preview"
              class="glass-debugger__preview-img"
              @click="openMapInNewWindow"
              title="Click to open in new window"
            />
            <div v-else class="glass-debugger__preview-placeholder">
              Generating...
            </div>
          </div>
        </section>
      </div>

      <!-- Sticky Preview (only in dynamic mode when scrolling) -->
      <Transition name="sticky-fade">
        <div v-if="showStickyPreview && displacementMode === 'dynamic'" class="glass-debugger__sticky-preview">
          <div class="glass-debugger__sticky-preview-content">
            <span class="glass-debugger__sticky-preview-label">
              Displacement Map
              <span class="glass-debugger__preview-badge">Live</span>
            </span>
            <img
              v-if="previewMapUrl"
              :src="previewMapUrl"
              alt="Displacement Map"
              class="glass-debugger__sticky-preview-img"
              @click="openMapInNewWindow"
              title="Click to open in new window"
            />
          </div>
        </div>
      </Transition>
    </div>

    <!-- Toggle button -->
    <button
      class="glass-debugger-toggle"
      @click="isVisible = !isVisible"
      :class="{ active: isVisible }"
    >
      {{ isVisible ? '✕' : '⚙' }}
    </button>
  </Teleport>
</template>

<script setup>
import { ref, computed, inject, watch, onMounted, onBeforeUnmount } from 'vue';
import { availableDistmaps } from './distmapsList.js';
import { ShaderDisplacementGenerator } from './ShaderDisplacementGenerator';

const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
  intensity: {
    type: [Object, Number],
    required: true,
  },
  staticMap: {
    type: [Object, String],
    required: true,
  },
  mode: {
    type: [Object, String],
    required: true,
  },
});

const isVisible = ref(true);
const globalOptions = props.options;
const showStickyPreview = ref(false);
const contentElement = ref(null);

// Get the actual refs from inject (same as GlassEffect does)
// These are the SAME refs that App.vue provides, so changes here affect all components
const debuggerIntensity = inject('glassDebuggerIntensity', null);
const debuggerStaticMap = inject('glassDebuggerStaticMap', null);
const debuggerMode = inject('glassDebuggerMode', null);

// Use the injected refs directly (they are writable)
const globalIntensity = debuggerIntensity || ref(props.intensity);
const globalStaticMap = debuggerStaticMap || ref(props.staticMap);
const displacementMode = debuggerMode || ref(props.mode);

// Dynamic displacement map generation
const dynamicMapUrl = ref('');
let shaderGenerator = null;

// Generate displacement map from shader parameters
const generateDynamicMap = () => {
  if (displacementMode.value !== 'dynamic') return;

  // Clean up old generator
  if (shaderGenerator) {
    shaderGenerator.destroy();
  }

  // Create new generator with current shader parameters (square for preview)
  shaderGenerator = new ShaderDisplacementGenerator({
    width: 300,
    height: 300,
    cornerRadius: globalOptions.shaderCornerRadius,
    rectWidth: globalOptions.shaderRectWidth,
    rectHeight: globalOptions.shaderRectHeight,
    centerOffsetX: globalOptions.shaderCenterOffsetX,
    centerOffsetY: globalOptions.shaderCenterOffsetY,
    edgeSoftness: globalOptions.shaderEdgeSoftness,
    distortionStart: globalOptions.shaderDistortionStart,
    distortionEnd: globalOptions.shaderDistortionEnd,
    distortionOffset: globalOptions.shaderDistortionOffset,
    scalingStart: globalOptions.shaderScalingStart,
    scalingEnd: globalOptions.shaderScalingEnd,
  });

  dynamicMapUrl.value = shaderGenerator.updateShader();
};

// Watch shader parameters and regenerate when they change
watch(
  () => [
    displacementMode.value,
    globalOptions.shaderCornerRadius,
    globalOptions.shaderRectWidth,
    globalOptions.shaderRectHeight,
    globalOptions.shaderCenterOffsetX,
    globalOptions.shaderCenterOffsetY,
    globalOptions.shaderEdgeSoftness,
    globalOptions.shaderDistortionStart,
    globalOptions.shaderDistortionEnd,
    globalOptions.shaderDistortionOffset,
    globalOptions.shaderScalingStart,
    globalOptions.shaderScalingEnd,
  ],
  () => {
    if (displacementMode.value === 'dynamic') {
      generateDynamicMap();
    }
  },
  { immediate: true }
);

// Computed for display
const intensityDisplay = computed(() => {
  const val = globalIntensity.value;
  return typeof val === 'number' ? val.toFixed(2) : '1.00';
});

// Computed for preview image - use dynamic map in dynamic mode, static otherwise
const previewMapUrl = computed(() => {
  return displacementMode.value === 'dynamic' ? dynamicMapUrl.value : globalStaticMap.value;
});

// Function to open displacement map in new window
const openMapInNewWindow = () => {
  window.open(previewMapUrl.value, '_blank');
};

// Handle scroll to show/hide sticky preview
const handleScroll = (event) => {
  if (displacementMode.value !== 'dynamic') {
    showStickyPreview.value = false;
    return;
  }

  const container = event.target;
  const scrollTop = container.scrollTop;
  const scrollHeight = container.scrollHeight;
  const clientHeight = container.clientHeight;

  // Show sticky preview when scrolled past 50% of content
  showStickyPreview.value = scrollTop > (scrollHeight - clientHeight) * 0.3;
};

onMounted(() => {
  // Find the content scrollable element
  const content = document.querySelector('.glass-debugger__content');
  if (content) {
    contentElement.value = content;
    content.addEventListener('scroll', handleScroll);
  }
});

onBeforeUnmount(() => {
  if (contentElement.value) {
    contentElement.value.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped>
.glass-debugger {
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

.glass-debugger__header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.glass-debugger__header h3 {
  margin: 0;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
}

.glass-debugger__close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.glass-debugger__close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 1);
}

.glass-debugger__content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.glass-debugger__content::-webkit-scrollbar {
  width: 8px;
}

.glass-debugger__content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

.glass-debugger__content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.glass-debugger__content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.glass-debugger__section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.glass-debugger__section h4 {
  margin: 0 0 8px;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 8px;
}

.glass-debugger__field {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.88);
}

.glass-debugger__field span {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
}

.glass-debugger__field input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.glass-debugger__field input[type="range"]::-webkit-slider-thumb {
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

.glass-debugger__field input[type="range"]::-webkit-slider-thumb:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.glass-debugger__field input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  border: 2px solid rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.glass-debugger__field input[type="range"]::-moz-range-thumb:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.glass-debugger__number-input {
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

.glass-debugger__number-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(0, 0, 0, 0.4);
}

.glass-debugger__number-input:hover {
  border-color: rgba(255, 255, 255, 0.3);
}

.glass-debugger__text-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.9rem;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
  transition: all 0.2s ease;
}

.glass-debugger__text-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(0, 0, 0, 0.4);
}

.glass-debugger__text-input:hover {
  border-color: rgba(255, 255, 255, 0.3);
}

.glass-debugger__section--global {
  background: rgba(100, 150, 255, 0.08);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(100, 150, 255, 0.2);
}

.glass-debugger__section--global h4 {
  color: rgba(150, 180, 255, 0.9);
}

.glass-debugger__section--displacement {
  background: rgba(255, 200, 100, 0.08);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 200, 100, 0.2);
}

.glass-debugger__section--displacement h4 {
  color: rgba(255, 210, 120, 0.9);
}

.glass-debugger__hint {
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
  margin-top: 8px;
}

.glass-debugger__select {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.glass-debugger__select:hover {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.4);
}

.glass-debugger__select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
}

.glass-debugger__preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.glass-debugger__preview-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
  display: flex;
  align-items: center;
  gap: 8px;
}

.glass-debugger__preview-badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(0, 255, 100, 0.2);
  color: rgba(0, 255, 150, 1);
  border: 1px solid rgba(0, 255, 100, 0.3);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.glass-debugger__preview-placeholder {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

.glass-debugger__preview-img {
  width: 100%;
  height: 120px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.glass-debugger__preview-img:hover {
  border-color: rgba(100, 150, 255, 0.5);
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(100, 150, 255, 0.3);
}

.glass-debugger__sticky-preview {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 200, 100, 0.3);
  padding: 16px 24px;
  z-index: 10;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.5);
}

.glass-debugger__sticky-preview-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.glass-debugger__sticky-preview-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
  display: flex;
  align-items: center;
  gap: 8px;
}

.glass-debugger__sticky-preview-img {
  width: 100%;
  height: 100px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid rgba(255, 200, 100, 0.3);
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.glass-debugger__sticky-preview-img:hover {
  border-color: rgba(255, 200, 100, 0.6);
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(255, 200, 100, 0.4);
}

.sticky-fade-enter-active,
.sticky-fade-leave-active {
  transition: all 0.3s ease;
}

.sticky-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.sticky-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.glass-debugger-toggle {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 10001;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass-debugger-toggle:hover {
  background: rgba(0, 0, 0, 0.85);
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.glass-debugger-toggle.active {
  right: 404px;
}

@media (max-width: 768px) {
  .glass-debugger {
    width: 100%;
    max-width: 100vw;
  }

  .glass-debugger-toggle.active {
    right: 24px;
  }
}
</style>
