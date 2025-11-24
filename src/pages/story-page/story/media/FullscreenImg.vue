<template>
  <div class="fullscreen-image__container" ref="containerRef"
    :data-magnifier="enableMagnifier ? 'true' : undefined"
    @mousemove="handleMouseMove" @mouseenter="handleMouseEnter" @mouseleave="showMagnifier = false">
    <img :src="imageSrc" :alt="alt" class="fullscreen-image__img" loading="lazy" ref="imageRef" />
    <div v-if="enableMagnifier && showMagnifier" class="magnifier" :style="magnifierStyle">
      <div class="magnifier__image" :style="magnifierImageStyle"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  imageSrc: { type: String, required: true },
  alt: { type: String, default: 'Case image' },
  enableMagnifier: { type: Boolean, default: false },
  magnifierSize: { type: Number, default: 250 },
  zoomLevel: { type: Number, default: 2.5 },
  backgroundColor: { type: String, default: '#ffffff' },
});

const containerRef = ref(null), imageRef = ref(null);
const showMagnifier = ref(false), mouseX = ref(0), mouseY = ref(0), containerRect = ref(null);

const handleMouseEnter = () => {
  if (!props.enableMagnifier) return;
  showMagnifier.value = true;
  containerRect.value = containerRef.value?.getBoundingClientRect();
};

const handleMouseMove = (e) => {
  if (!props.enableMagnifier || !containerRect.value) return;
  mouseX.value = e.clientX - containerRect.value.left;
  mouseY.value = e.clientY - containerRect.value.top;
};

const magnifierStyle = computed(() => {
  const half = props.magnifierSize / 2;
  return { left: `${mouseX.value - half}px`, top: `${mouseY.value - half}px`, width: `${props.magnifierSize}px`, height: `${props.magnifierSize}px` };
});

const magnifierImageStyle = computed(() => {
  if (!containerRect.value || !imageRef.value) return {};
  const { naturalWidth: nw, naturalHeight: nh } = imageRef.value;
  const { width: cw, height: ch } = containerRect.value;
  const ratio = nw / nh, cRatio = cw / ch;
  const [rw, rh] = ratio > cRatio ? [cw, cw / ratio] : [ch * ratio, ch];
  const [ox, oy] = ratio > cRatio ? [0, (ch - rh) / 2] : [(cw - rw) / 2, 0];
  const { magnifierSize: size, zoomLevel: zoom, backgroundColor, imageSrc } = props;
  return {
    backgroundColor, backgroundImage: `url(${imageSrc})`,
    backgroundSize: `${rw * zoom}px ${rh * zoom}px`,
    backgroundPosition: `-${(mouseX.value - ox) * zoom - size / 2}px -${(mouseY.value - oy) * zoom - size / 2}px`,
  };
});
</script>

<style scoped>
.fullscreen-image__container {
  width: 100%; position: relative; border-radius: 12px; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.fullscreen-image__img {
  max-width: 100%; max-height: 100vh; width: auto; height: auto;
  object-fit: contain; display: block; cursor: default; margin: auto;
}
.fullscreen-image__container[data-magnifier="true"]:hover .fullscreen-image__img { cursor: none; }
.magnifier {
  position: absolute; border: 3px solid rgba(255, 255, 255, 0.9); border-radius: 50%;
  pointer-events: none; z-index: 10; overflow: hidden; transition: opacity 0.15s ease;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}
.magnifier__image { width: 100%; height: 100%; background-repeat: no-repeat; border-radius: 50%; }
.fullscreen-image__container:not(:hover) .magnifier { opacity: 0; }
</style>
