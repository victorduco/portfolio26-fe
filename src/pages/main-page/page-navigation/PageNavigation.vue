<template>
  <nav class="page-navigation" aria-label="Page sections navigation">
    <NavigationItem
      v-for="section in sections"
      :key="section.id"
      :label="section.label"
      :section-id="section.id"
      :is-active="activeSection === section.id"
      @navigate="handleNavigate"
    />
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import NavigationItem from "./NavigationItem.vue";

const props = defineProps({
  sections: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(
        (section) =>
          typeof section.id === "string" && typeof section.label === "string"
      );
    },
  },
  scrollBehavior: {
    type: String,
    default: "smooth",
    validator: (value) => ["smooth", "auto", "instant"].includes(value),
  },
  observerRootMargin: {
    type: String,
    default: "-50% 0px -50% 0px",
  },
});

const activeSection = ref(props.sections[0]?.id || "");
let observer = null;

function handleNavigate(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: props.scrollBehavior,
      block: "start",
    });
  }
}

function setupIntersectionObserver() {
  const options = {
    root: null,
    rootMargin: props.observerRootMargin,
    threshold: 0,
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id;
      }
    });
  }, options);

  props.sections.forEach((section) => {
    const element = document.getElementById(section.id);
    if (element) {
      observer.observe(element);
    }
  });
}

onMounted(() => {
  setupIntersectionObserver();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.page-navigation {
  position: fixed;
  right: 48px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 1000;
  padding: 24px 0;
}

@media (max-width: 768px) {
  .page-navigation {
    right: 24px;
  }
}
</style>
