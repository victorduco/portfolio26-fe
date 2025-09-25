<template>
  <div
    :id="resultSelector"
    class="bg-to-svg__content"
    :style="backgroundStyle"
  ></div>

  <!-- Кнопка для включения/выключения фона -->
  <button
    @click="toggleBackground"
    style="
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 99999;
      background: #007bff;
      color: white;
      padding: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    "
  >
    {{ backgroundEnabled ? "Hide BG" : "Show BG" }}
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { toSvg } from "html-to-image";

const props = defineProps({
  sourceSelector: {
    type: String,
    required: true,
  },
  resultSelector: {
    type: String,
    required: true,
  },
});

const bgImage = ref("");
const backgroundEnabled = ref(false);

const backgroundStyle = computed(() => ({
  backgroundImage: bgImage.value ? `url("${bgImage.value}")` : "none",
  visibility: backgroundEnabled.value ? "visible" : "hidden",
}));

const generateBackground = async () => {
  const source = document.getElementById(props.sourceSelector);

  // Получаем фон из body
  const bodyBgColor =
    window.getComputedStyle(document.body).backgroundColor || "#000000";

  const bgElement = await toSvg(source, {
    width: Math.max(source.offsetWidth, 1200),
    height: Math.max(source.offsetHeight, 800),
    backgroundColor: bodyBgColor,
    pixelRatio: 1,
  });

  bgImage.value = bgElement;
};

const toggleBackground = () => {
  backgroundEnabled.value = !backgroundEnabled.value;
};

const handleResize = () => {
  generateBackground();
};

onMounted(async () => {
  generateBackground();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.bg-to-svg__content {
  width: 100vw;
  height: 100vh;
  background-size: auto;
  background-position: calc(0% + 1px) 0%;
  background-repeat: no-repeat;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  visibility: hidden;
}

.bg-to-svg__content * {
  pointer-events: none !important;
  user-select: none !important;
}
</style>
