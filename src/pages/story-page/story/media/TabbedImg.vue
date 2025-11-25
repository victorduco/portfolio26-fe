<template>
  <div class="tabbed-img-container" ref="containerRef">
    <div class="tabs-wrapper">
      <TabsNav :tabs="tabsWithTitles" :active-tab="activeTab" @tab-change="switchTab" />
    </div>
    <div class="img-wrapper" ref="imgWrapperRef">
      <!-- Обернем каждое изображение для корректного позиционирования меток -->
      <div
        v-for="(tab, i) in tabs"
        :key="`img-wrapper-${i}`"
        class="tab-img-wrapper"
        :class="{ 'wrapper-active': activeTab === i }"
      >
        <div class="img-container" :style="imgContainerStyle">
          <div class="img-states-wrapper">
            <!-- State 1 image (base layer) -->
            <img
              :src="tab.imageSrc"
              :alt="tab.alt || 'Tab image'"
              loading="lazy"
              class="tab-img tab-img-state1"
            />

            <!-- State 2 image (overlay layer with fade animation) -->
            <img
              v-if="tab.imageSrcState2"
              :src="tab.imageSrcState2"
              :alt="tab.alt || 'Tab image state 2'"
              loading="lazy"
              class="tab-img tab-img-state2"
              :class="{ 'state2-visible': activeTab === i && tabStates[i] }"
            />
          </div>

          <!-- Marker overlay для этого таба (привязан к img) -->
          <!-- Add data-marker-overlay attribute to help identify overlay elements -->
          <ImageMarkerOverlay
            v-if="markersLogic.hasMarkers.value && tab.markers && tab.markers.length > 0"
            :markers="tab.markers"
            :default-button-color="defaultButtonColor"
            :default-icon-color="defaultIconColor"
            :default-icon-type="defaultIconType"
            :visible="activeTab === i"
            class="tab-marker-overlay"
            data-marker-overlay
            @markers-ready="(refs) => markersLogic.handleMarkersReady(refs, i)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
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
  },
  maxWidth: {
    type: String,
    default: null
  },
  borderWidth: {
    type: String,
    default: null
  },
  borderColor: {
    type: String,
    default: null
  },
  borderRadius: {
    type: String,
    default: null
  }
});

const containerRef = ref(null);
const imgWrapperRef = ref(null);
const activeTab = ref(0);

// Track state2 visibility for each tab
const tabStates = ref({});
const hasBeenVisible = ref({});
let observer = null;

// Extract only titles for TabsNav (без markers)
const tabsWithTitles = computed(() => {
  return props.tabs.map(tab => ({
    title: tab.title,
    imageSrc: tab.imageSrc,
    alt: tab.alt
  }));
});

// Computed styles for image container
const imgContainerStyle = computed(() => {
  const styles = {};
  if (props.maxWidth) styles.maxWidth = props.maxWidth;
  if (props.borderWidth && props.borderColor) {
    styles.border = `${props.borderWidth} solid ${props.borderColor}`;
  }
  if (props.borderRadius) styles.borderRadius = props.borderRadius;
  return styles;
});

const switchTab = (index) => {
  if (index === activeTab.value) return;

  // Hide state2 for the previous tab
  const oldTab = activeTab.value;
  tabStates.value[oldTab] = false;

  // Reset state for the new tab to allow re-animation
  tabStates.value[index] = false;

  activeTab.value = index;

  // Mark this tab as visible (since parent component is already visible if user can switch tabs)
  hasBeenVisible.value[index] = true;

  // Trigger animation for the new tab
  triggerState2Animation(index);
};

const triggerState2Animation = (tabIndex) => {
  const tab = props.tabs[tabIndex];
  if (tab && tab.imageSrcState2) {
    // Show state1 for 0.5 seconds (same as marker animation startDelay), then show state2
    setTimeout(() => {
      tabStates.value[tabIndex] = true;
    }, 500);
  }
};

// Setup Intersection Observer
onMounted(() => {
  if (!containerRef.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasBeenVisible.value[activeTab.value]) {
          hasBeenVisible.value[activeTab.value] = true;
          triggerState2Animation(activeTab.value);
        }
      });
    },
    {
      threshold: 0.5, // Trigger when 50% of component is visible
    }
  );

  observer.observe(containerRef.value);
});

onUnmounted(() => {
  if (observer && containerRef.value) {
    observer.unobserve(containerRef.value);
  }
});

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
  box-sizing: border-box;
  position: relative;
}

.tabs-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: clamp(24px, 4vw, 40px) clamp(16px, 3vw, 40px) 0;
}

.tabs-wrapper :deep(.tabs-nav) {
  max-width: 1200px;
}

.img-wrapper {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: clamp(16px, 2.5vw, 24px) 40px clamp(24px, 4vw, 40px);
}

.tab-img-wrapper {
  display: none;
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
}

.tab-img-wrapper.wrapper-active {
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-container {
  position: relative;
  display: inline-block;
  max-width: 100%;
  max-height: 100%;
  overflow: visible;
  box-sizing: border-box;
}

.img-states-wrapper {
  position: relative;
  display: block;
  overflow: clip;
}

.tab-img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
}

.tab-img-state1 {
  /* Base image that defines the size */
}

.tab-img-state2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.6s ease;
}

.tab-img-state2.state2-visible {
  opacity: 1;
}

.tab-marker-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

/* Make sure marker buttons can receive clicks */
.tab-marker-overlay :deep(.marker-button) {
  pointer-events: auto;
}

/* Make sure marker popups can receive clicks */
.tab-marker-overlay :deep(.marker-popup) {
  pointer-events: auto;
}
</style>
