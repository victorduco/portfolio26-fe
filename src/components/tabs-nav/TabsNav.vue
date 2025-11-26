<template>
  <nav class="tabs-nav">
    <button
      v-for="(tab, i) in tabs"
      :key="i"
      class="tab-button"
      :class="{ active: activeTab === i }"
      @click="$emit('tab-change', i)"
    >
      {{ tab.title }}
    </button>
  </nav>
</template>

<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: tabs => tabs.every(t => typeof t.title === "string")
  },
  activeTab: {
    type: Number,
    default: 0
  }
});

defineEmits(['tab-change']);
</script>

<style scoped>
.tabs-nav {
  display: flex;
  gap: clamp(4px, 1vw, 8px);
  margin-bottom: clamp(16px, 2.5vw, 24px);
  padding: clamp(3px, 0.5vw, 4px);
  background: rgba(0, 0, 0, 0.05);
  border-radius: 999px;
}

.tab-button {
  flex: 1;
  padding: clamp(8px, 1.2vw, 12px) clamp(32px, 4.5vw, 48px);
  background: transparent;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: clamp(12px, 1.4vw, 14px);
  line-height: 1.4;
  color: inherit;
  opacity: 0.6;
  white-space: nowrap;
}

.tab-button:hover {
  opacity: 0.8;
  background: rgba(0, 0, 0, 0.05);
}

.tab-button.active {
  background: var(--story-primary-color, #007aff);
  color: #fff;
  opacity: 1;
}
</style>
