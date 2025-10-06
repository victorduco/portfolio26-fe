<template>
  <Teleport to="body">
    <div v-if="isVisible" class="glass-debugger">
      <div class="glass-debugger__header">
        <h3>Glass Effect Debugger</h3>
        <div class="glass-debugger__header-actions">
          <button class="glass-debugger__action-btn" @click="downloadSettings" title="Download settings">
            💾
          </button>
          <button class="glass-debugger__close" @click="isVisible = false">✕</button>
        </div>
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

        <!-- Effects Section -->
        <section class="glass-debugger__section">
          <h4>Effects</h4>

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

        <!-- Displacement Map Selection Section -->
        <section class="glass-debugger__section glass-debugger__section--displacement">
          <h4>Displacement Map</h4>

          <label class="glass-debugger__field">
            <span>Select Static Map</span>
            <div class="glass-debugger__select-wrapper">
              <select v-model="globalOptions.displacementMap" class="glass-debugger__select">
                <option v-for="map in availableDistmaps" :key="map.value" :value="map.value">
                  {{ map.label }}
                </option>
              </select>
              <button
                class="glass-debugger__refresh-btn"
                @click="refreshDistmaps"
                title="Refresh distmaps list"
              >
                🔄
              </button>
            </div>
          </label>

          <div class="glass-debugger__hint">
            💡 Select a displacement map from the library. Maps are located in /src/assets/distmaps/
          </div>

          <!-- Preview -->
          <div class="glass-debugger__preview">
            <span class="glass-debugger__preview-label">Current Displacement Map</span>
            <img
              v-if="globalOptions.displacementMap"
              :src="globalOptions.displacementMap"
              alt="Displacement Map Preview"
              class="glass-debugger__preview-img"
              @click="openMapInNewWindow"
              title="Click to open in new window"
            />
            <div v-else class="glass-debugger__preview-placeholder">
              No map selected
            </div>
          </div>
        </section>
      </div>
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
import { ref, computed, inject } from 'vue';

// Auto-load all distmaps from assets folder
const distmapsModules = import.meta.glob('/src/assets/distmaps/*.png', { eager: true, as: 'url' });
const availableDistmaps = ref(
  Object.entries(distmapsModules).map(([path, url]) => ({
    value: url,
    label: path.split('/').pop().replace('.png', '')
  }))
);

const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
  intensity: {
    type: [Object, Number],
    required: true,
  },
});

const isVisible = ref(true);
const globalOptions = props.options;

// Get the actual refs from inject (same as GlassEffect does)
// These are the SAME refs that App.vue provides, so changes here affect all components
const debuggerIntensity = inject('glassDebuggerIntensity', null);

// Use the injected refs directly (they are writable)
const globalIntensity = debuggerIntensity || ref(props.intensity);

// Computed for display
const intensityDisplay = computed(() => {
  const val = globalIntensity.value;
  return typeof val === 'number' ? val.toFixed(2) : '1.00';
});

// Refresh distmaps list
const refreshDistmaps = async () => {
  const modules = import.meta.glob('/src/assets/distmaps/*.png', { eager: true, as: 'url' });
  availableDistmaps.value = Object.entries(modules).map(([path, url]) => ({
    value: url,
    label: path.split('/').pop().replace('.png', '')
  }));
  console.log('Distmaps refreshed:', availableDistmaps.value.length);
};

// Function to open displacement map in new window
const openMapInNewWindow = () => {
  if (globalOptions.displacementMap) {
    window.open(globalOptions.displacementMap, '_blank');
  }
};

// Download settings as JSON
const downloadSettings = () => {
  const settings = {
    intensity: globalIntensity.value,
    options: globalOptions
  };

  const json = JSON.stringify(settings, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `glass-effect-settings-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
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

.glass-debugger__header-actions {
  display: flex;
  gap: 8px;
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

.glass-debugger__action-btn,
.glass-debugger__close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
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

.glass-debugger__action-btn:hover,
.glass-debugger__close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 1);
}

.glass-debugger__close {
  font-size: 24px;
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

.glass-debugger__select-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.glass-debugger__select {
  flex: 1;
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

.glass-debugger__refresh-btn {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass-debugger__refresh-btn:hover {
  background: rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 1);
  transform: rotate(180deg);
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
