<template>
  <div :class="['media-container-wrapper', wrapperClass]">
    <div
      :class="[
        'media-container',
        containerClass,
        { 'with-background': backgroundColor !== 'transparent' },
      ]"
      :style="containerStyle"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  backgroundColor: { type: String, default: "transparent" },
  overflow: {
    type: String,
    default: "hidden",
    validator: (v) => ["hidden", "visible"].includes(v),
  },
  wrapperClass: { type: String, default: "" },
  containerClass: { type: String, default: "" },
});

const containerStyle = computed(() => ({
  overflow: props.overflow,
  backgroundColor: props.backgroundColor,
  height: "90vh",
  minHeight: "950px",
  width: "98vw",
}));
</script>

<style scoped>
.media-container-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin: 36px 0 48px;
  overflow: visible;
}
.media-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 0;
}
.media-container.with-background {
  border-radius: 12px;
}
@media (max-width: 767px) {
  .media-container {
    height: auto !important;
  }
}
</style>
