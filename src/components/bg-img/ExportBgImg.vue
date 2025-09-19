<script setup>
import { ref, onMounted, watch } from "vue";
import { toPng } from "html-to-image";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  domId: {
    type: String,
    required: true,
  },
  pixelRatio: {
    type: Number,
    default: 2,
  },
  defaultImg: {
    type: String,
    default:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAKUlEQVR4Ae3BAQEAAAgDoJvc6F8wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwG4wAAQwA1wAAAABJRU5ErkJggg==", // 32x32 transparent PNG
  },
  modelValue: {
    type: String,
    default: "",
  },
  backgroundColor: {
    type: String,
    default: "#000",
  },
});

const imgUrl = ref(props.modelValue || props.defaultImg);

async function exportImage() {
  const node = document.getElementById(props.domId);
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  if (node) {
    try {
      // Create a canvas with window size and draw background
      const canvas = document.createElement("canvas");
      canvas.width = winW * props.pixelRatio;
      canvas.height = winH * props.pixelRatio;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = props.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render node to PNG
      const nodePng = await toPng(node, { pixelRatio: props.pixelRatio });
      const img = new window.Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = nodePng;
      });

      // Center node image on canvas
      const nodeRect = node.getBoundingClientRect();
      const nodeW = nodeRect.width * props.pixelRatio;
      const nodeH = nodeRect.height * props.pixelRatio;
      const x = (canvas.width - nodeW) / 2;
      const y = (canvas.height - nodeH) / 2;
      ctx.drawImage(img, x, y, nodeW, nodeH);

      imgUrl.value = canvas.toDataURL();
    } catch (e) {
      imgUrl.value = props.defaultImg;
    }
  } else {
    imgUrl.value = props.defaultImg;
  }
  emit("update:modelValue", imgUrl.value);
}

onMounted(exportImage);
watch(() => props.domId, exportImage);
watch(imgUrl, (val) => {
  emit("update:modelValue", val);
});

defineExpose({ imgUrl });
</script>

<template>
  <!-- No UI, just logic. Use via expose or v-model -->
</template>
