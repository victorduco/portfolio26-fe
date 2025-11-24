<template>
  <div :class="['media-container-wrapper', wrapperClass]">
    <MediaLabel v-if="label || sources.length > 0" :label="label" :sources="sources" :tag="labelTag" />
    <div :class="['media-container', containerClass, { 'with-background': backgroundColor !== 'transparent' }]" :style="containerStyle">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import MediaLabel from "../elements/MediaLabel.vue";

const props = defineProps({
  backgroundColor: { type: String, default: "transparent" },
  overflow: { type: String, default: "hidden", validator: v => ["hidden", "visible"].includes(v) },
  label: { type: String, default: "" },
  sources: { type: Array, default: () => [] },
  labelTag: { type: String, default: "h3" },
  wrapperClass: { type: String, default: "" },
  containerClass: { type: String, default: "" },
});

const containerStyle = computed(() => ({
  overflow: props.overflow,
  backgroundColor: props.backgroundColor,
  height: "95vh",
  width: "98vw",
}));
</script>

<style scoped>
.media-container-wrapper { width: 100%; display: flex; flex-direction: column; align-items: center; position: relative; left: 50%; transform: translateX(-50%); margin: 48px 0; overflow: visible; }
.media-container { width: 100%; display: flex; align-items: center; justify-content: center; position: relative; z-index: 0; }
.media-container.with-background { border-radius: 12px; }
@media (max-width: 767px) { .media-container { height: auto !important; } }
</style>
