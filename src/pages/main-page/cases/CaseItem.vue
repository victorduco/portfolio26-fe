<template>
  <div class="case-item" ref="caseElement">
    <div class="case-heading">
      <div class="case-heading-text">
        <h3 class="case-title">{{ title }}</h3>
        <p class="case-subtitle">{{ subtitle }}</p>
      </div>
      <NavigationChevron
        class="case-heading-action"
        type="route"
        :to="routeTo"
        direction="forward"
        :aria-label="`Open ${subtitle}`"
      />
    </div>
    <div class="video-wrapper">
      <CaseVideo ref="caseVideo" :src="videoSrc" :final-link="routeTo" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import CaseVideo from "./CaseVideo.vue";
import NavigationChevron from "@/components/common/NavigationChevron.vue";

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  videoSrc: {
    type: String,
    required: true,
  },
  routeTo: {
    type: String,
    required: true,
  },
});

const caseElement = ref(null);
const caseVideo = ref(null);
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          caseVideo.value?.handleEnter();
        } else {
          caseVideo.value?.handleLeave();
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  if (caseElement.value) {
    observer.observe(caseElement.value);
  }
});

onUnmounted(() => {
  if (observer && caseElement.value) {
    observer.unobserve(caseElement.value);
  }
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>

<style scoped>
.case-item {
  background: #171717;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  padding: 2vh 10vw;
  margin: auto;
  text-align: left;
  gap: clamp(16px, 2vh, 24px);
  max-height: 100dvh;
  width: 100%;
}

.case-heading {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(16px, 4vw, 40px);
  flex-wrap: wrap;
}

.case-heading-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.case-title {
  margin: 0;
  text-align: left;
  max-width: 560px;
}

.case-subtitle {
  margin: 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: left;
  color: #ffffff;
  opacity: 0.6;
  max-width: 480px;
}

.case-heading-action {
  flex-shrink: 0;
  align-self: center;
}

.video-wrapper {
  padding: clamp(8px, 1.4vw, 12px);
  border-radius: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 2px solid #ffffff10;
  box-shadow: none;
  flex: 1 1 auto;
  height: auto;
  overflow: hidden;
  transform-style: preserve-3d;
  transform-origin: center;
  aspect-ratio: 1662 / 1080;
  max-height: 100%;
}

@media (max-width: 768px) {
  .case-heading {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .case-heading-action {
    align-self: flex-start;
  }
}
</style>
