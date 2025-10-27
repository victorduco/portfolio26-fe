<template>
  <div v-if="isOpen" class="font-switcher-overlay" @click="close">
    <div class="font-switcher-panel" @click.stop>
      <div class="font-switcher-header">
        <h3>Font Switcher (Temp Tool)</h3>
        <button @click="close" class="close-btn">×</button>
      </div>
      <div class="font-list">
        <button
          v-for="font in fonts"
          :key="font.value"
          :class="['font-item', { active: currentFont === font.value }]"
          @click="selectFont(font.value)"
        >
          <span :style="{ fontFamily: font.preview }">{{ font.label }}</span>
          <span v-if="currentFont === font.value" class="check">✓</span>
        </button>
      </div>
      <div class="hint">
        Press Cmd+Shift+F (Mac) or Ctrl+Shift+F (Win) to toggle
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isOpen = ref(false);
const currentFont = ref("zedou");

const fonts = [
  { label: "Zedou (Current)", value: "zedou", preview: "zedou" },
  { label: "Inter", value: "Inter", preview: "Inter, sans-serif" },
  {
    label: "Shadows Into Light",
    value: "Shadows Into Light",
    preview: '"Shadows Into Light", cursive',
  },
];

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const close = () => {
  isOpen.value = false;
};

const selectFont = async (fontValue) => {
  try {
    const response = await fetch("/__temp_change_font", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ font: fontValue }),
    });

    if (response.ok) {
      currentFont.value = fontValue;
      console.log("✅ Font changed to:", fontValue);
    } else {
      console.error("❌ Failed to change font");
    }
  } catch (error) {
    console.error("❌ Error changing font:", error);
  }
};

const handleKeydown = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "F") {
    e.preventDefault();
    toggle();
  }
  if (e.key === "Escape" && isOpen.value) {
    close();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);

  // Load Google Font
  if (!document.querySelector("#temp-google-fonts")) {
    const link = document.createElement("link");
    link.id = "temp-google-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Shadows+Into+Light&family=Inter:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.font-switcher-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.font-switcher-panel {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.font-switcher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #333;
}

.font-switcher-header h3 {
  margin: 0;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 32px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
  line-height: 1;
}

.close-btn:hover {
  background: #333;
  color: #fff;
}

.font-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.font-item {
  background: #222;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 16px 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  text-align: left;
}

.font-item:hover {
  background: #2a2a2a;
  border-color: #444;
  transform: translateX(4px);
}

.font-item.active {
  background: #2a5a8a;
  border-color: #3a7ac0;
}

.font-item span:first-child {
  flex: 1;
}

.check {
  color: #4ade80;
  font-size: 20px;
  font-weight: bold;
}

.hint {
  color: #666;
  font-size: 12px;
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #2a2a2a;
}
</style>
