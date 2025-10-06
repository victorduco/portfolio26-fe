<template>
  <Teleport to="body">
    <div v-if="isVisible" class="glass-panel glass-panel--debugger">
      <header class="glass-panel__header">
        <h3 class="glass-panel__title">Glass Effect Debugger</h3>
        <div class="glass-debugger__actions">
          <button class="glass-debugger__icon-btn" @click="downloadSettings" title="Download settings">💾</button>
          <button class="glass-debugger__icon-btn glass-debugger__icon-btn--close" @click="isVisible = false">✕</button>
        </div>
      </header>

      <div class="glass-panel__content">
        <section class="glass-panel__section glass-debugger__section glass-debugger__section--accent">
          <h4 class="glass-panel__section-title">Global Controls</h4>
          <label class="glass-panel__field">
            <span class="glass-panel__label">Effect Intensity ({{ intensityDisplay }})</span>
            <input
              type="range"
              class="glass-panel__slider"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalIntensity"
            />
            <input
              type="number"
              class="glass-panel__number"
              min="0"
              max="1"
              step="0.01"
              v-model.number="globalIntensity"
            />
          </label>
        </section>

        <section v-for="section in controlSections" :key="section.title" class="glass-panel__section glass-debugger__section">
          <h4 class="glass-panel__section-title">{{ section.title }}</h4>
          <GlassEffectField v-for="field in section.fields" :key="field.key" :field="field" :model="globalOptions" />
        </section>

        <section class="glass-panel__section glass-debugger__section glass-debugger__section--warm">
          <h4 class="glass-panel__section-title">Displacement Map</h4>

          <label class="glass-panel__field">
            <span class="glass-panel__label">Select Static Map</span>
            <div class="glass-debugger__select-wrapper">
              <select v-model="globalOptions.displacementMap" class="glass-debugger__select">
                <option v-for="map in availableDistmaps" :key="map.value" :value="map.value">{{ map.label }}</option>
              </select>
              <button class="glass-debugger__icon-btn" @click="refreshDistmaps" title="Refresh distmaps list">🔄</button>
            </div>
          </label>

          <div class="glass-debugger__hint">
            💡 Select a displacement map from the library. Maps are located in /src/assets/distmaps/
          </div>

          <div class="glass-debugger__preview">
            <span class="glass-panel__label">Current Displacement Map</span>
            <img
              v-if="selectedMap"
              :src="selectedMap"
              alt="Displacement Map Preview"
              class="glass-debugger__preview-img"
              @click="openMapInNewWindow"
              title="Click to open in new window"
            />
            <div v-else class="glass-debugger__preview-placeholder">No map selected</div>
          </div>
        </section>
      </div>
    </div>

    <button class="glass-debugger-toggle" @click="isVisible = !isVisible" :class="{ active: isVisible }">
      {{ isVisible ? '✕' : '⚙' }}
    </button>
  </Teleport>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { createControlSections } from './controlFields.js';
import GlassEffectField from './GlassEffectField.vue';
import './glassPanel.css';

const loadDistmaps = () =>
  Object.entries(
    import.meta.glob('/src/assets/distmaps/*.png', { eager: true, query: '?url', import: 'default' })
  ).map(
    ([path, url]) => ({ value: url, label: path.split('/').pop().replace('.png', '') })
  );

const availableDistmaps = ref(loadDistmaps());
const controlSections = createControlSections();

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

const debuggerIntensity = inject('glassDebuggerIntensity', null);
const globalIntensity = debuggerIntensity || ref(props.intensity);

const intensityDisplay = computed(() =>
  Number.isFinite(+globalIntensity.value) ? (+globalIntensity.value).toFixed(2) : '1.00'
);
const selectedMap = computed(() => globalOptions.displacementMap);

const refreshDistmaps = () => {
  availableDistmaps.value = loadDistmaps();
};

const openMapInNewWindow = () => {
  if (selectedMap.value) window.open(selectedMap.value, '_blank');
};

const downloadSettings = () => {
  const blob = new Blob(
    [JSON.stringify({ intensity: globalIntensity.value, options: globalOptions }, null, 2)],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `glass-effect-settings-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
.glass-panel--debugger {
  pointer-events: auto;
}

.glass-debugger__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.glass-debugger__icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.glass-debugger__icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 1);
}

.glass-debugger__icon-btn--close {
  font-size: 24px;
}

.glass-debugger__section {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px;
}

.glass-debugger__section--accent {
  background: rgba(100, 150, 255, 0.08);
  border-color: rgba(100, 150, 255, 0.2);
}

.glass-debugger__section--warm {
  background: rgba(255, 200, 100, 0.08);
  border-color: rgba(255, 200, 100, 0.2);
}

.glass-debugger__hint {
  margin-top: 8px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
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

.glass-debugger__preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
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
  .glass-debugger-toggle.active {
    right: 24px;
  }
}
</style>
