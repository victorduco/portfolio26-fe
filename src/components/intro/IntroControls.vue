<template>
  <!-- Кнопки управления -->
  <button
    class="house-toggle"
    @click="toggleHouse"
    :class="{ active: showHouse || showDistortion }"
  >
    {{ showHouse ? "Switch to Distortion" : (showDistortion ? "Turn Off" : "Show House") }}
  </button>

  <button
    class="content-toggle"
    @click="hideOriginalContent = !hideOriginalContent"
    :class="{ active: hideOriginalContent }"
  >
    {{ hideOriginalContent ? "Show Original" : "Hide Original" }}
  </button>

  <button
    class="magnification-toggle"
    @click="toggleMagnification"
    :class="{ active: magnificationState !== 'normal' }"
  >
    {{ magnificationState === 'normal' ? 'Magnify' : (magnificationState === 'scaled' ? 'Rotate' : 'Reset') }}
  </button>

  <!-- Лупы -->
  <IntroDistortion
    v-if="showDistortion"
    :source-element-id="sourceElementId"
    :enabled="showDistortion"
    :magnification-state="magnificationState"
  />
</template>

<script setup>
import { ref } from "vue";
import IntroDistortion from "./IntroDistortion.vue";

const props = defineProps({
  sourceElementId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:showHouse', 'update:hideOriginalContent', 'update:showDistortion']);

const showHouse = ref(false);
const showDistortion = ref(false);
const hideOriginalContent = ref(false);
const magnificationState = ref('normal'); // 'normal' | 'scaled' | 'rotated'

function toggleHouse() {
  if (showHouse.value) {
    showHouse.value = false;
    showDistortion.value = true;
  } else if (showDistortion.value) {
    showDistortion.value = false;
  } else {
    showHouse.value = true;
  }
  emit('update:showHouse', showHouse.value);
  emit('update:showDistortion', showDistortion.value);
}

function toggleMagnification() {
  if (magnificationState.value === 'normal') {
    magnificationState.value = 'scaled';
  } else if (magnificationState.value === 'scaled') {
    magnificationState.value = 'rotated';
  } else {
    magnificationState.value = 'normal';
  }
}

// Watchers для синхронизации с родителем
import { watch } from 'vue';

watch(hideOriginalContent, (value) => {
  emit('update:hideOriginalContent', value);
});

// Expose состояния для доступа из родителя
defineExpose({
  showHouse,
  showDistortion,
  hideOriginalContent,
  magnificationState,
});
</script>

<style scoped>
.house-toggle {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;

  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.house-toggle:hover {
  background: rgba(0, 0, 0, 0.8);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.house-toggle.active {
  background: rgba(34, 197, 94, 0.8);
  border-color: rgba(34, 197, 94, 0.6);
}

.house-toggle.active:hover {
  background: rgba(34, 197, 94, 0.9);
}

.content-toggle {
  position: fixed;
  top: 24px;
  right: 180px;
  z-index: 1000;

  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.content-toggle:hover {
  background: rgba(0, 0, 0, 0.8);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.content-toggle.active {
  background: rgba(239, 68, 68, 0.8);
  border-color: rgba(239, 68, 68, 0.6);
}

.content-toggle.active:hover {
  background: rgba(239, 68, 68, 0.9);
}

.magnification-toggle {
  position: fixed;
  top: 24px;
  right: 320px;
  z-index: 1000;

  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.magnification-toggle:hover {
  background: rgba(0, 0, 0, 0.8);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.magnification-toggle.active {
  background: rgba(147, 51, 234, 0.8);
  border-color: rgba(147, 51, 234, 0.6);
}

.magnification-toggle.active:hover {
  background: rgba(147, 51, 234, 0.9);
}

@media (max-width: 768px) {
  .house-toggle {
    top: 16px;
    right: 16px;
    padding: 10px 14px;
    font-size: 13px;
  }

  .content-toggle {
    top: 16px;
    right: 140px;
    padding: 10px 14px;
    font-size: 13px;
  }

  .magnification-toggle {
    top: 16px;
    right: 260px;
    padding: 10px 14px;
    font-size: 13px;
  }
}
</style>