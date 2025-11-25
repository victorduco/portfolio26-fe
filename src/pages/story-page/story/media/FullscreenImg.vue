<template>
  <div class="fullscreen-image__container" ref="containerRef">
    <!-- Image wrapper для корректного позиционирования меток -->
    <div class="fullscreen-image__img-wrapper" ref="imgWrapperRef">
      <img :src="imageSrc" :alt="alt" class="fullscreen-image__img" loading="lazy" />

      <!-- Markers overlay (опционально, привязан к img) -->
      <ImageMarkerOverlay
        v-if="markers && markers.length > 0"
        ref="overlayRef"
        :markers="preparedMarkers"
        :default-button-color="defaultButtonColor"
        :default-icon-color="defaultIconColor"
        :default-icon-type="defaultIconType"
        @markers-ready="handleMarkersReady"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import ImageMarkerOverlay from '@/components/media/markers/ImageMarkerOverlay.vue';
import { useImageMarkers } from '@/composables/useImageMarkers';

const props = defineProps({
  imageSrc: { type: String, required: true },
  alt: { type: String, default: 'Case image' },
  markers: { type: Array, default: () => [] },
  defaultButtonColor: { type: String, default: '#4A90E2' },
  defaultIconColor: { type: String, default: '#ffffff' },
  defaultIconType: { type: String, default: 'plus' }
});

const containerRef = ref(null);

const {
  overlayRef,
  preparedMarkers,
  handleMarkersReady,
  cleanup,
} = useImageMarkers({
  markers: props.markers,
  triggerElement: containerRef,
  enableScrollTrigger: true,
});

onUnmounted(() => {
  cleanup();
});
</script>

<style scoped>
.fullscreen-image__container {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-image__img-wrapper {
  position: relative;
  display: inline-block;
  max-width: 100%;
  max-height: 100vh;
}

.fullscreen-image__img {
  max-width: 100%;
  max-height: 100vh;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
}
</style>
