<template>
  <label class="glass-panel__field">
    <span class="glass-panel__label">{{ props.field.label }}</span>
    <input type="range" class="glass-panel__slider" v-bind="props.field.attrs" v-model.number="binding" />
    <input
      type="number"
      class="glass-panel__number"
      v-bind="props.field.numberAttrs"
      v-model.number="binding"
    />
  </label>
</template>

<script setup>
import { computed, isRef } from 'vue';

const props = defineProps({
  model: {
    type: Object,
    required: true,
  },
  field: {
    type: Object,
    required: true,
  },
});

const binding = computed({
  get() {
    const target = isRef(props.model) ? props.model.value : props.model;
    return target?.[props.field.key];
  },
  set(value) {
    const target = isRef(props.model) ? props.model.value : props.model;
    if (target) target[props.field.key] = value;
  },
});
</script>
