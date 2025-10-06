<template>
  <div class="glass-control-panel">
    <div class="glass-control-panel__header">
      <h3>Glass Effect Controls</h3>
    </div>

    <div class="glass-control-panel__content">
      <section
        v-for="section in controlSections"
        :key="section.title"
        class="glass-control-panel__section"
      >
        <h4>{{ section.title }}</h4>
        <label
          v-for="field in section.fields"
          :key="field.key"
          class="glass-control-panel__field"
        >
          <span>{{ field.label }}</span>
          <input type="range" v-bind="field.attrs" v-model.number="localOptions[field.key]" />
          <input
            type="number"
            class="glass-control-panel__number-input"
            v-bind="field.numberAttrs"
            v-model.number="localOptions[field.key]"
          />
        </label>
      </section>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { createControlSections } from './controlFields.js';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const localOptions = props.modelValue;
const controlSections = createControlSections({
  glassSaturation: { attrs: { min: 120, max: 280, step: 5 } },
  glassBrightness: { attrs: { min: 85, max: 140, step: 1 } },
  glassContrast: { attrs: { min: 85, max: 135, step: 1 } },
});

watch(localOptions, (value) => emit('update:modelValue', value), { deep: true });
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
