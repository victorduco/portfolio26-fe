<template>
  <div class="tabbed-video-container" ref="containerRef">
    <!-- Tabs navigation -->
    <nav class="tabs-nav">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-button"
        :class="{ active: activeTab === index }"
        @click="switchTab(index)"
      >
        {{ tab.title }}
      </button>
    </nav>

    <!-- Video wrapper -->
    <div class="video-wrapper">
      <!-- Video elements - one per tab -->
      <video
        v-for="(tab, index) in tabs"
        :key="`video-${index}`"
        :ref="el => setVideoRef(el, index)"
        :src="tab.videoSrc"
        muted
        playsinline
        preload="auto"
        class="tab-video"
        :class="{
          'video-active': activeTab === index,
          'video-paused-blur': activeTab === index && !isPlaying && hasStartedPlayback
        }"
        @ended="handleVideoEnded"
        @click="handleTogglePlayPause"
      />

      <!-- Pause overlay with play button -->
      <div
        v-if="!isPlaying && hasStartedPlayback"
        class="pause-overlay"
        @click="handleTogglePlayPause"
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="40" fill="rgba(255, 255, 255, 0.9)" />
          <path d="M32 25L55 40L32 55V25Z" fill="#000000" />
        </svg>
      </div>

      <!-- Control buttons -->
      <VideoControls
        v-if="hasStartedPlayback"
        :is-playing="isPlaying"
        :is-muted="true"
        :is-fullscreen="isFullscreen"
        :is-small-screen="isSmallScreen"
        :hide-mute="true"
        @toggle-play-pause="handleTogglePlayPause"
        @restart="handleRestartVideo"
        @toggle-fullscreen="toggleFullscreen"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import VideoControls from "./VideoControls.vue";
import { useMediaQuery } from "@/composables/useMediaQuery";

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: (tabs) => {
      return tabs.every(
        (tab) =>
          typeof tab.title === "string" && typeof tab.videoSrc === "string"
      );
    },
  },
});

const containerRef = ref(null);
const videoRefs = ref([]);
const activeTab = ref(0);

const isSmallScreen = useMediaQuery("(max-width: 899px)");

// Video state
const isPlaying = ref(false);
const hasStartedPlayback = ref(false);
const isFullscreen = ref(false);
const userPaused = ref(false);

// Set video refs
const setVideoRef = (el, index) => {
  if (el) {
    videoRefs.value[index] = el;
  }
};

// Get current active video element
const currentVideo = computed(() => videoRefs.value[activeTab.value]);

// Switch tab
const switchTab = async (index) => {
  if (index === activeTab.value) return;

  // Pause current video
  const prevVideo = videoRefs.value[activeTab.value];
  if (prevVideo) {
    prevVideo.pause();
  }

  // Reset state
  isPlaying.value = false;
  hasStartedPlayback.value = false;
  userPaused.value = false;

  // Switch tab
  activeTab.value = index;

  // Wait for next tick and start playing new video
  await nextTick();

  const newVideo = videoRefs.value[index];
  if (newVideo) {
    newVideo.currentTime = 0;
    // Auto-play when switching tabs if in viewport
    if (isVideoInViewport()) {
      playVideo();
    }
  }
};

// Play video
const playVideo = async () => {
  const video = currentVideo.value;
  if (!video) return;

  try {
    await video.play();
    isPlaying.value = true;
    hasStartedPlayback.value = true;
  } catch (error) {
    console.warn("Video play failed:", error);
  }
};

// Pause video
const pauseVideo = () => {
  const video = currentVideo.value;
  if (!video) return;

  video.pause();
  isPlaying.value = false;
};

// Toggle play/pause
const handleTogglePlayPause = () => {
  userPaused.value = isPlaying.value;
  if (isPlaying.value) {
    pauseVideo();
  } else {
    playVideo();
  }
};

// Restart video
const handleRestartVideo = () => {
  const video = currentVideo.value;
  if (!video) return;

  video.currentTime = 0;
  userPaused.value = false;
  playVideo();
};

// Handle video ended
const handleVideoEnded = () => {
  isPlaying.value = false;
};

// Toggle fullscreen
const toggleFullscreen = async () => {
  if (!containerRef.value) return;

  try {
    if (!document.fullscreenElement) {
      await containerRef.value.requestFullscreen();
      isFullscreen.value = true;
    } else {
      await document.exitFullscreen();
      isFullscreen.value = false;
    }
  } catch (error) {
    console.warn("Fullscreen toggle failed:", error);
  }
};

// Helper function to check if video is in viewport
const isVideoInViewport = () => {
  if (!containerRef.value) return false;

  const rect = containerRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);

  const totalHeight = rect.height;
  const totalWidth = rect.width;

  const visibleArea = visibleHeight * visibleWidth;
  const totalArea = totalHeight * totalWidth;

  const visibilityRatio = totalArea > 0 ? visibleArea / totalArea : 0;

  return visibilityRatio >= 0.5;
};

// Intersection Observer for scroll-based play/pause
let observer = null;
let scrollCheckInterval = null;

onMounted(() => {
  if (!containerRef.value) return;

  // Handle fullscreen changes
  const handleFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement;
  };
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

  // Setup Intersection Observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const isSufficientlyVisible =
          entry.isIntersecting && entry.intersectionRatio >= 0.5;

        if (isSufficientlyVisible) {
          if (!userPaused.value) {
            setTimeout(() => {
              playVideo();
            }, 300);
          }
        } else {
          if (isPlaying.value) {
            pauseVideo();
            hasStartedPlayback.value = false;
          }
        }
      });
    },
    {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: "0px",
    }
  );

  observer.observe(containerRef.value);

  // Periodic check for fast scrolling
  scrollCheckInterval = setInterval(() => {
    if (isPlaying.value && !isVideoInViewport()) {
      pauseVideo();
      hasStartedPlayback.value = false;
    }
  }, 200);

  // Auto-play on mount if in viewport
  setTimeout(() => {
    if (isVideoInViewport() && !userPaused.value) {
      playVideo();
    }
  }, 100);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  if (scrollCheckInterval) {
    clearInterval(scrollCheckInterval);
    scrollCheckInterval = null;
  }

  pauseVideo();
});
</script>

<style scoped>
.tabbed-video-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-sizing: border-box;
  position: relative;
}

/* Tabs navigation */
.tabs-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
}

.tab-button {
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  line-height: 1.4;
  color: inherit;
  opacity: 0.6;
  white-space: nowrap;
}

.tab-button:hover {
  opacity: 0.8;
  background: rgba(0, 0, 0, 0.05);
}

.tab-button.active {
  background: var(--case-primary-color, #007aff);
  color: #ffffff;
  opacity: 1;
}

/* Video wrapper */
.video-wrapper {
  position: relative;
  max-width: 1200px;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid #cccccc;
  line-height: 0;
}

.tab-video {
  width: 100%;
  height: auto;
  display: none;
  cursor: pointer;
  transition: filter 0.3s ease;
}

.tab-video.video-active {
  display: block;
}

.tab-video.video-paused-blur {
  filter: blur(4px);
}

.pause-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: inherit;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .tabbed-video-container {
    padding: 32px 24px;
  }

  .tabs-nav {
    margin-bottom: 20px;
  }

  .tab-button {
    padding: 10px 20px;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .tabbed-video-container {
    padding: 24px 16px;
  }

  .tabs-nav {
    margin-bottom: 16px;
    gap: 4px;
    padding: 3px;
  }

  .tab-button {
    padding: 8px 16px;
    font-size: 12px;
  }
}
</style>
