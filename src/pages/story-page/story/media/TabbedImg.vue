<template>
  <div class="tabbed-img-container" ref="containerRef">
    <TabsNav :tabs="tabsWithTitles" :active-tab="activeTab" @tab-change="switchTab" />
    <div class="img-wrapper" ref="imgWrapperRef">
      <!-- Обернем каждое изображение для корректного позиционирования меток -->
      <div
        v-for="(tab, i) in tabs"
        :key="`img-wrapper-${i}`"
        class="tab-img-wrapper"
        :class="{ 'wrapper-active': activeTab === i }"
      >
        <img
          :src="tab.imageSrc"
          :alt="tab.alt || 'Tab image'"
          loading="lazy"
          class="tab-img"
        />

        <!-- Marker overlay для этого таба (привязан к img) -->
        <ImageMarkerOverlay
          v-if="markersLogic.hasMarkers.value && tab.markers && tab.markers.length > 0"
          :markers="tab.markers"
          :default-button-color="defaultButtonColor"
          :default-icon-color="defaultIconColor"
          :default-icon-type="defaultIconType"
          :visible="activeTab === i"
          class="tab-marker-overlay"
          @markers-ready="(refs) => markersLogic.handleMarkersReady(refs, i)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import TabsNav from "@/components/tabs-nav/TabsNav.vue";
import ImageMarkerOverlay from '@/components/media/markers/ImageMarkerOverlay.vue';
import { useTabbedImgMarkers } from '@/composables/useTabbedImgMarkers';

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: tabs => tabs.every(t => typeof t.title === "string" && typeof t.imageSrc === "string")
  },
  defaultButtonColor: {
    type: String,
    default: '#4A90E2'
  },
  defaultIconColor: {
    type: String,
    default: '#ffffff'
  },
  defaultIconType: {
    type: String,
    default: 'plus'
  }
});

const containerRef = ref(null);
const imgWrapperRef = ref(null);
const activeTab = ref(0);

// Extract only titles for TabsNav (без markers)
const tabsWithTitles = computed(() => {
  return props.tabs.map(tab => ({
    title: tab.title,
    imageSrc: tab.imageSrc,
    alt: tab.alt
  }));
});

const switchTab = (index) => {
  if (index === activeTab.value) return;
  activeTab.value = index;
};

// Markers logic (изолировано в composable)
const markersLogic = useTabbedImgMarkers({
  tabs: props.tabs,
  activeTab: activeTab,
  imgWrapperRef: imgWrapperRef,
});
</script>

<style scoped>
.tabbed-img-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(24px, 4vw, 40px) clamp(16px, 3vw, 40px);
  box-sizing: border-box;
  position: relative;
}

.img-wrapper {
  max-width: 1200px;
  width: 100%;
  border-radius: 12px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.tab-img-wrapper {
  position: relative;
  display: none;
  max-width: 100%;
  max-height: 100vh;
}

.tab-img-wrapper.wrapper-active {
  display: inline-block;
}

.tab-img {
  max-width: 100%;
  max-height: 100vh;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
}

.tab-marker-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
