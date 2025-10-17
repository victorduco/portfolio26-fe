<template>
  <!-- Use Case2SplitLayout for case2 -->
  <Case2SplitLayout
    v-if="useSplitLayout"
    ref="caseMedia"
    :title="title"
    :description="description"
    :image-src="imageSrc"
    :route-to="routeTo"
    @navigation-click="handleNavigationClick"
  />

  <!-- Use Case3UniqueLayout for case3 -->
  <Case3UniqueLayout
    v-else-if="useUniqueLayout"
    ref="caseMedia"
    :title="title"
    :company="subtitle"
    :image-src="imageSrc"
    :background-color="backgroundColor"
  />

  <!-- Default layout for other cases -->
  <div
    v-else
    class="case-item"
    ref="caseElement"
    :class="{ 'dark-mode': darkMode, 'light-mode': !darkMode }"
  >
    <div class="case-content">
      <div class="case-heading">
        <div class="case-heading-text">
          <h3 class="case-title">{{ title }}</h3>
          <p class="case-subtitle">{{ subtitle }}</p>
        </div>
      </div>
      <div class="video-wrapper" :class="{ 'image-wrapper': imageSrc }">
        <CaseVideo
          v-if="videoSrc && !imageSrc"
          ref="caseMedia"
          :src="videoSrc"
          :final-link="routeTo"
          :diamond-color="props.primaryColor"
          :final-overlay-time="props.finalOverlayTime"
        />
        <CaseImage
          v-else-if="imageSrc"
          ref="caseMedia"
          :src="imageSrc"
          :alt="subtitle"
          :final-link="routeTo"
          :diamond-color="props.primaryColor"
        />
      </div>
      <RouterLink
        :to="routeTo"
        class="case-action mobile-only"
        @click="handleNavigationClick"
      >
        <span class="case-action-text">View Case Study</span>
        <svg
          class="case-action-arrow"
          width="8"
          height="12"
          viewBox="0 0 8 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L6.5 6L1 11"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { RouterLink } from "vue-router";
import CaseVideo from "./CaseVideo.vue";
import CaseImage from "./CaseImage.vue";
import Case2SplitLayout from "./Case2SplitLayout.vue";
import Case3UniqueLayout from "./Case3UniqueLayout.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  videoSrc: {
    type: String,
    default: "",
  },
  imageSrc: {
    type: String,
    default: "",
  },
  routeTo: {
    type: String,
    required: true,
  },
  primaryColor: {
    type: String,
    default: "#979797",
  },
  backgroundColor: {
    type: String,
    default: "#171717",
  },
  darkMode: {
    type: Boolean,
    default: true,
  },
  finalOverlayTime: {
    type: Number,
    default: null,
  },
  useSplitLayout: {
    type: Boolean,
    default: false,
  },
  useUniqueLayout: {
    type: Boolean,
    default: false,
  },
});

const caseElement = ref(null);
const caseMedia = ref(null);
let observer = null;

function handleNavigationClick() {
  // Save media state before navigating
  caseMedia.value?.handleStoryLinkClick();
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          caseMedia.value?.handleEnter();
        } else {
          caseMedia.value?.handleLeave();
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
  /* background removed - using dynamic page background */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  padding: 0;
  margin: auto;
  width: 100%;
  height: 100dvh;
}

.case-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(12px, 2.5vh, 24px); /* Reduced gap from 16-40px to 12-24px */
  height: 100%;
  width: 100%;
  max-width: 90vw; /* Increased width for better video proportions */
  padding: 11vh 5vw; /* 5% + 3% = 8% vertical padding */
}

.case-heading {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(16px, 4vw, 40px);
  flex-wrap: nowrap;
  flex-shrink: 0;
}

.case-heading-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px; /* Reduced from 8px */
  flex: 1;
  min-width: 0;
}

.case-title {
  margin: 0;
  text-align: center;
  max-width: 100%;
  font-size: clamp(20px, 2.5vw, 28px); /* Reduced from default h3 size */
}

/* Dark mode - white text for dark backgrounds */
.case-item.dark-mode .case-title {
  color: #ffffff;
}

/* Light mode - dark text for light backgrounds */
.case-item.light-mode .case-title {
  color: #000000;
}

.case-subtitle {
  margin: 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  opacity: 0.6;
  max-width: 100%;
}

/* Dark mode - white text for dark backgrounds */
.case-item.dark-mode .case-subtitle {
  color: #ffffff;
}

/* Light mode - dark text for light backgrounds */
.case-item.light-mode .case-subtitle {
  color: #000000;
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
  box-shadow: none;
  flex: 1 1 auto;
  overflow: hidden;
  transform-style: preserve-3d;
  transform-origin: center;
  aspect-ratio: 1662 / 1080;
  max-height: 100%;
}

/* Dark mode - subtle white border */
.case-item.dark-mode .video-wrapper:not(.image-wrapper) {
  border: 2px solid #ffffff10;
}

/* Light mode - subtle dark border */
.case-item.light-mode .video-wrapper:not(.image-wrapper) {
  border: 2px solid #00000010;
}

/* No border for image wrapper */
.video-wrapper.image-wrapper {
  border: none;
}

.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}

@media (max-width: 899px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: flex;
  }

  .case-item {
    padding: clamp(24px, 6vh, 48px) 0;
  }

  .case-content {
    padding: 0;
    max-width: 100%;
    gap: clamp(32px, 7vh, 56px);
    justify-content: center;
  }

  .case-heading {
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 0 clamp(24px, 6vw, 48px);
  }

  .case-heading-text {
    align-items: center;
    text-align: center;
    width: 100%;
    gap: 12px;
  }

  .case-title {
    text-align: center;
  }

  .case-subtitle {
    text-align: center;
    font-size: 18px;
  }

  .video-wrapper {
    padding: 0;
    border: none;
    border-radius: 0;
    max-width: 100%;
    width: 100%;
    aspect-ratio: 16 / 9;
  }

  .case-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-decoration: none;
    font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 1;
    letter-spacing: 0.02em;
    padding: 12px 16px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.2s ease;
    flex-shrink: 0;
    align-self: center;
  }

  /* Dark mode - white text for dark backgrounds */
  .case-item.dark-mode .case-action {
    color: rgba(255, 255, 255, 0.7);
  }

  .case-item.dark-mode .case-action:hover,
  .case-item.dark-mode .case-action:active {
    color: #ffffff;
  }

  /* Light mode - dark text for light backgrounds */
  .case-item.light-mode .case-action {
    color: rgba(0, 0, 0, 0.7);
  }

  .case-item.light-mode .case-action:hover,
  .case-item.light-mode .case-action:active {
    color: #000000;
  }

  .case-action-text {
    flex-shrink: 0;
  }

  .case-action-arrow {
    width: 8px;
    height: 12px;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .case-action:hover .case-action-arrow {
    transform: translateX(2px);
  }
}

@media (max-width: 600px) {
  .case-content {
    gap: clamp(16px, 4vh, 24px);
  }

  .case-heading {
    padding: 0 16px;
  }

  .case-action {
    font-size: 14px;
  }

  .case-action-arrow {
    width: 6px;
    height: 10px;
  }
}
</style>
