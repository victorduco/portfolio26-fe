<template>
  <aside class="glass-panel glass-panel--control">
    <header class="glass-panel__header">
      <h3 class="glass-panel__title">Glass Effect Controls</h3>
    </header>

    <div class="glass-panel__content">
      <section v-for="section in sections" :key="section.title" class="glass-panel__section">
        <h4 class="glass-panel__section-title">{{ section.title }}</h4>
        <GlassEffectField v-for="field in section.fields" :key="field.key" :field="field" :model="options" />
      </section>
    </div>
  </aside>
</template>

<script setup>
import { createControlSections } from './controlFields.js';
import GlassEffectField from './GlassEffectField.vue';
import './glassPanel.css';

const options = defineModel({
  type: Object,
  required: true,
});

const sections = createControlSections({
  glassSaturation: { attrs: { min: 120, max: 280, step: 5 } },
  glassBrightness: { attrs: { min: 85, max: 140, step: 1 } },
  glassContrast: { attrs: { min: 85, max: 135, step: 1 } },
});
</script>
