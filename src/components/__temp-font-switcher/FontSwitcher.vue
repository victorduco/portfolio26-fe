<template>
  <Transition name="slide">
    <div v-if="isOpen" class="font-switcher-panel" @wheel.stop @touchmove.stop>
      <div class="font-switcher-header">
        <h3>Font Switcher</h3>
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
      <div class="hint">Cmd+Shift+F (Mac) or Ctrl+Shift+F (Win)</div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";

const isOpen = ref(false);
const currentFont = ref("zedou");

const fonts = [
  {
    label: "Zedou (Current)",
    value: "zedou",
    provider: "current",
    preview: "zedou",
  },
  {
    label: "Albert Sans",
    value: "Albert+Sans",
    provider: "google",
    preview: "Albert Sans, sans-serif",
  },
  {
    label: "Average Sans",
    value: "Average+Sans",
    provider: "google",
    preview: "Average Sans, sans-serif",
  },
  {
    label: "Be Vietnam Pro",
    value: "Be+Vietnam+Pro",
    provider: "google",
    preview: "Be Vietnam Pro, sans-serif",
  },
  {
    label: "Biryani",
    value: "Biryani",
    provider: "google",
    preview: "Biryani, sans-serif",
  },
  {
    label: "Cabin",
    value: "Cabin",
    provider: "google",
    preview: "Cabin, sans-serif",
  },
  {
    label: "Carlito",
    value: "Carlito",
    provider: "google",
    preview: "Carlito, sans-serif",
  },
  {
    label: "Commissioner",
    value: "Commissioner",
    provider: "google",
    preview: "Commissioner, sans-serif",
  },
  {
    label: "Figtree",
    value: "Figtree",
    provider: "google",
    preview: "Figtree, sans-serif",
  },
  {
    label: "Gantari",
    value: "Gantari",
    provider: "google",
    preview: "Gantari, sans-serif",
  },
  {
    label: "Hanken Grotesk",
    value: "Hanken+Grotesk",
    provider: "google",
    preview: "Hanken Grotesk, sans-serif",
  },
  {
    label: "Hind Mysuru",
    value: "Hind+Mysuru",
    provider: "google",
    preview: "Hind Mysuru, sans-serif",
  },
  {
    label: "Instrument Sans",
    value: "Instrument+Sans",
    provider: "google",
    preview: "Instrument Sans, sans-serif",
  },
  {
    label: "Khula",
    value: "Khula",
    provider: "google",
    preview: "Khula, sans-serif",
  },
  {
    label: "Kumbh Sans",
    value: "Kumbh+Sans",
    provider: "google",
    preview: "Kumbh Sans, sans-serif",
  },
  {
    label: "League Spartan",
    value: "League+Spartan",
    provider: "google",
    preview: "League Spartan, sans-serif",
  },
  {
    label: "Merriweather Sans",
    value: "Merriweather+Sans",
    provider: "google",
    preview: "Merriweather Sans, sans-serif",
  },
  {
    label: "Mukta Mahee",
    value: "Mukta+Mahee",
    provider: "google",
    preview: "Mukta Mahee, sans-serif",
  },
  {
    label: "Mukta",
    value: "Mukta",
    provider: "google",
    preview: "Mukta, sans-serif",
  },
  {
    label: "Mulish",
    value: "Mulish",
    provider: "google",
    preview: "Mulish, sans-serif",
  },
  {
    label: "Nokora",
    value: "Nokora",
    provider: "google",
    preview: "Nokora, sans-serif",
  },
  {
    label: "Noto Sans Display",
    value: "Noto+Sans+Display",
    provider: "google",
    preview: "Noto Sans Display, sans-serif",
  },
  {
    label: "Noto Sans",
    value: "Noto+Sans",
    provider: "google",
    preview: "Noto Sans, sans-serif",
  },
  {
    label: "PT Sans Caption",
    value: "PT+Sans+Caption",
    provider: "google",
    preview: "PT Sans Caption, sans-serif",
  },
  {
    label: "Sarabun",
    value: "Sarabun",
    provider: "google",
    preview: "Sarabun, sans-serif",
  },
  {
    label: "Sarala",
    value: "Sarala",
    provider: "google",
    preview: "Sarala, sans-serif",
  },
  {
    label: "Teachers",
    value: "Teachers",
    provider: "google",
    preview: "Teachers, sans-serif",
  },
  {
    label: "Tenor Sans",
    value: "Tenor+Sans",
    provider: "google",
    preview: "Tenor Sans, sans-serif",
  },
  {
    label: "Urbanist",
    value: "Urbanist",
    provider: "google",
    preview: "Urbanist, sans-serif",
  },
  {
    label: "Yantramanav",
    value: "Yantramanav",
    provider: "google",
    preview: "Yantramanav, sans-serif",
  },
  {
    label: "Adapter PE Variable",
    value: "mdsx",
    provider: "adobe",
    cssName: "adapter-pe-variable",
    preview: "adapter-pe-variable, sans-serif",
  },
  {
    label: "Avenir",
    value: "jdgv",
    provider: "adobe",
    cssName: "avenir-lt-pro",
    preview: "avenir-lt-pro, sans-serif",
  },
  {
    label: "Avenir Next",
    value: "rskz",
    provider: "adobe",
    cssName: "avenir-next-lt-pro",
    preview: "avenir-next-lt-pro, sans-serif",
  },
  {
    label: "Brisbane",
    value: "xnrb",
    provider: "adobe",
    cssName: "brisbane",
    preview: "brisbane, sans-serif",
  },
  {
    label: "Darkmode CC",
    value: "wkss",
    provider: "adobe",
    cssName: "darkmode-off-cc",
    preview: "darkmode-off-cc, sans-serif",
  },
  {
    label: "DM Sans",
    value: "kmkm",
    provider: "adobe",
    cssName: "dm-sans",
    preview: "dm-sans, sans-serif",
  },
  {
    label: "Guyot Sans",
    value: "nlxq",
    provider: "adobe",
    cssName: "guyot-sans",
    preview: "guyot-sans, sans-serif",
  },
  {
    label: "Hanken Grotesk (Adobe)",
    value: "zgmm",
    provider: "adobe",
    cssName: "hanken-grotesk",
    preview: "hanken-grotesk, sans-serif",
  },
  {
    label: "Highgate Variable",
    value: "jqhf",
    provider: "adobe",
    cssName: "highgate-variable",
    preview: "highgate-variable, sans-serif",
  },
  {
    label: "Hind Mysuru (Adobe)",
    value: "zfpl",
    provider: "adobe",
    cssName: "hind-mysuru",
    preview: "hind-mysuru, sans-serif",
  },
  {
    label: "Hind Vadodara",
    value: "dwfw",
    provider: "adobe",
    cssName: "hind-vadodara",
    preview: "hind-vadodara, sans-serif",
  },
  {
    label: "Indivisible Variable",
    value: "wgbm",
    provider: "adobe",
    cssName: "indivisible-variable",
    preview: "indivisible-variable, sans-serif",
  },
  {
    label: "Instrument Sans Variable",
    value: "ktqq",
    provider: "adobe",
    cssName: "instrument-sans-variable",
    preview: "instrument-sans-variable, sans-serif",
  },
  {
    label: "K2D",
    value: "vjtw",
    provider: "adobe",
    cssName: "k2d",
    preview: "k2d, sans-serif",
  },
  {
    label: "Koddiud Ongothic",
    value: "tdyv",
    provider: "adobe",
    cssName: "koddiud-ongothic",
    preview: "koddiud-ongothic, sans-serif",
  },
  {
    label: "Mulish Variable",
    value: "mlrd",
    provider: "adobe",
    cssName: "mulish-variable",
    preview: "mulish-variable, sans-serif",
  },
  {
    label: "MVB Salis",
    value: "czbt",
    provider: "adobe",
    cssName: "salis-mvb",
    preview: "salis-mvb, sans-serif",
  },
  {
    label: "Myriad Variable",
    value: "pflp",
    provider: "adobe",
    cssName: "myriad-variable",
    preview: "myriad-variable, sans-serif",
  },
  {
    label: "Neue Frutiger World",
    value: "yswy",
    provider: "adobe",
    cssName: "neue-frutiger-world",
    preview: "neue-frutiger-world, sans-serif",
  },
  {
    label: "Neulis Sans",
    value: "qmfx",
    provider: "adobe",
    cssName: "neulis-sans",
    preview: "neulis-sans, sans-serif",
  },
  {
    label: "New Hero",
    value: "ywnr",
    provider: "adobe",
    cssName: "new-hero",
    preview: "new-hero, sans-serif",
  },
  {
    label: "Polymath",
    value: "slkb",
    provider: "adobe",
    cssName: "polymath",
    preview: "polymath, sans-serif",
  },
  {
    label: "Proxima Nova Devanagari",
    value: "bwwl",
    provider: "adobe",
    cssName: "proxima-nova-devanagari",
    preview: "proxima-nova-devanagari, sans-serif",
  },
  {
    label: "Sarvatrik Latin Variable",
    value: "jlyf",
    provider: "adobe",
    cssName: "sarvatrik-latin-variable",
    preview: "sarvatrik-latin-variable, sans-serif",
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
    const font = fonts.find((f) => f.value === fontValue);
    if (!font) {
      console.error("❌ Font not found:", fontValue);
      return;
    }

    const response = await fetch("/__temp_change_font", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        font: fontValue,
        provider: font.provider,
        cssName: font.cssName,
      }),
    });

    if (response.ok) {
      currentFont.value = fontValue;
      console.log("✅ Font changed to:", font.label, `(${font.provider})`);
    } else {
      console.error("❌ Failed to change font");
    }
  } catch (error) {
    console.error("❌ Error changing font:", error);
  }
};

const handleKeydown = (e) => {
  if (
    (e.metaKey || e.ctrlKey) &&
    e.shiftKey &&
    (e.key === "F" || e.key === "f")
  ) {
    e.preventDefault();
    toggle();
  }
  if (e.key === "Escape" && isOpen.value) {
    close();
  }
};

// Watch for isOpen changes to manage body scroll
watch(isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});
</script>

<style scoped>
.font-switcher-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 400px;
  background: #1a1a1a;
  border-left: 1px solid #333;
  padding: 24px;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
  z-index: 999999;
  display: flex;
  flex-direction: column;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
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
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  margin-bottom: 16px;
}

.font-list::-webkit-scrollbar {
  width: 8px;
}

.font-list::-webkit-scrollbar-track {
  background: #1a1a1a;
  border-radius: 4px;
}

.font-list::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}

.font-list::-webkit-scrollbar-thumb:hover {
  background: #555;
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
