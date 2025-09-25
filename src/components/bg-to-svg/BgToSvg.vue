<template>
  <div
    :id="resultSelectorId"
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
import { ref, onMounted, computed } from "vue";
import { toSvg } from "html-to-image";

const props = defineProps({
  sourceSelector: {
    type: String,
    required: true,
  },
  resultSelectorId: {
    type: String,
    required: true,
  },
  excludeSelectors: {
    type: Array,
    default: () => [".intro-list", ".intro-square", ".intro-distortion"],
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
  // Даем время на рендер
  await new Promise((resolve) => setTimeout(resolve, 100));

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
  console.log(bgImage.value);
  console.log(backgroundStyle.value);
};

const toggleBackground = () => {
  backgroundEnabled.value = !backgroundEnabled.value;
  console.log("Background toggled:", backgroundEnabled.value);
};

onMounted(async () => {
  generateBackground();
});
</script>

<style scoped>
.bg-to-svg__content {
  width: 100vw;
  height: 100vh;
  background-size: auto;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  visibility: hidden;
  background-size: auto;
  background-position: calc(0% + 1px) 0%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}

.bg-to-svg__content * {
  pointer-events: none !important;
  user-select: none !important;
}
</style>
