<template>
  <div class="tabbed-img-container">
    <TabsNav :tabs="tabs" :active-tab="activeTab" @tab-change="switchTab" />
    <div class="img-wrapper">
      <img
        v-for="(tab, i) in tabs"
        :key="`img-${i}`"
        :src="tab.imageSrc"
        :alt="tab.alt || 'Tab image'"
        loading="lazy"
        class="tab-img"
        :class="{ 'img-active': activeTab === i }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TabsNav from "@/components/tabs-nav/TabsNav.vue";

defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: tabs => tabs.every(t => typeof t.title === "string" && typeof t.imageSrc === "string")
  }
});

const activeTab = ref(0);

const switchTab = (index) => {
  if (index === activeTab.value) return;
  activeTab.value = index;
};
</script>

<style scoped>
.tabbed-img-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(24px, 4vw, 40px) clamp(16px, 3vw, 40px);
  box-sizing: border-box;
  position: relative;
}

.img-wrapper {
  position: relative;
  max-width: 1200px;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-img {
  max-width: 100%;
  max-height: 100vh;
  width: auto;
  height: auto;
  object-fit: contain;
  display: none;
  margin: auto;
}

.tab-img.img-active {
  display: block;
}
</style>
