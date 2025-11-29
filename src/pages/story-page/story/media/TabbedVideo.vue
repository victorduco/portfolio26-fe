<template>
  <div class="tabbed-video-container" ref="containerRef">
    <div class="tabs-wrapper">
      <TabsNav :tabs="tabs" :active-tab="activeTab" @tab-change="switchTab" />
    </div>
    <div class="video-content">
      <div class="video-wrapper">
        <video
          v-for="(tab, i) in tabs"
          :key="`video-${i}`"
          :ref="(el) => el && (videoRefs[i] = el)"
          :src="tab.videoSrc"
          muted
          playsinline
          preload="auto"
          class="tab-video"
          :class="{
            'video-active': activeTab === i,
            'video-paused-blur':
              activeTab === i && !isPlaying && hasStartedPlayback,
          }"
          @ended="isPlaying = false"
          @click="togglePlayPause"
        />
        <div
          v-if="!isPlaying && hasStartedPlayback"
          class="pause-overlay"
          @click="togglePlayPause"
        >
          <svg
            viewBox="0 0 100 100"
            fill="currentColor"
            class="pause-play-icon"
            aria-label="Play video"
          >
            <path
              d="M32 23L32 77C32 78.5 33 79.5 34.5 79L73 52C74.5 51.2 74.5 48.8 73 48L34.5 21C33 20.5 32 21.5 32 23Z"
            />
          </svg>
        </div>
        <VideoControls
          v-if="hasStartedPlayback"
          :is-playing="isPlaying"
          :is-muted="true"
          :is-fullscreen="isFullscreen"
          :is-small-screen="isSmallScreen"
          :hide-mute="true"
          @toggle-play-pause="togglePlayPause"
          @restart="restartVideo"
          @toggle-fullscreen="toggleFullscreen"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import VideoControls from "./VideoControls.vue";
import TabsNav from "@/components/tabs-nav/TabsNav.vue";
import { useChapteredVideo } from "@/composables/useChapteredVideo";
import { useMediaQuery } from "@/composables/useMediaQuery";

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: (tabs) =>
      tabs.every(
        (t) => typeof t.title === "string" && typeof t.videoSrc === "string"
      ),
  },
});

const containerRef = ref(null);
const videoRefs = ref([]);
const activeTab = ref(0);
const userPaused = ref(false);
const isSmallScreen = useMediaQuery("(max-width: 899px)");

const currentVideo = computed(() => videoRefs.value[activeTab.value]);
const {
  isPlaying,
  hasStartedPlayback,
  isFullscreen,
  togglePlayPause: baseToggle,
  toggleFullscreen: baseFullscreen,
  restartVideo: baseRestart,
  pauseVideo,
  playVideo,
} = useChapteredVideo(currentVideo);

const togglePlayPause = () => {
  userPaused.value = isPlaying.value;
  baseToggle();
};
const restartVideo = () => {
  userPaused.value = false;
  baseRestart();
};
const toggleFullscreen = () => {
  if (!containerRef.value) return;
  if (!document.fullscreenElement) {
    containerRef.value
      .requestFullscreen()
      .then(() => (isFullscreen.value = true))
      .catch(() => {});
  } else {
    document
      .exitFullscreen()
      .then(() => (isFullscreen.value = false))
      .catch(() => {});
  }
};

const switchTab = async (index) => {
  if (index === activeTab.value) return;
  videoRefs.value[activeTab.value]?.pause();
  isPlaying.value = false;
  hasStartedPlayback.value = false;
  userPaused.value = false;
  activeTab.value = index;
  await nextTick();
  const video = videoRefs.value[index];
  if (video) {
    video.currentTime = 0;
    playVideo();
  }
};

let observer = null;
onMounted(() => {
  if (!containerRef.value) return;
  const onFsChange = () => (isFullscreen.value = !!document.fullscreenElement);
  document.addEventListener("fullscreenchange", onFsChange);

  // Set playback rate for all videos
  videoRefs.value.forEach((video) => {
    if (video) video.playbackRate = 1.5;
  });

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        if (!userPaused.value) setTimeout(playVideo, 300);
      } else if (isPlaying.value) {
        pauseVideo();
        hasStartedPlayback.value = false;
      }
    },
    { threshold: [0, 0.5, 1] }
  );
  observer.observe(containerRef.value);

  setTimeout(() => {
    if (!userPaused.value) playVideo();
  }, 100);
});

onUnmounted(() => {
  observer?.disconnect();
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
  box-sizing: border-box;
  position: relative;
  padding: 40px 0;
}
.tabs-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 clamp(16px, 3vw, 40px);
  flex-shrink: 0;
}
.tabs-wrapper :deep(.tabs-nav) {
  max-width: 1200px;
}
.video-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0;
  margin-top: 0vh;
  flex-shrink: 0;
}
.video-wrapper {
  position: relative;
  max-width: 1200px;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  line-height: 0;
}
.video-wrapper::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 12px;
  box-shadow: inset 0 0 0 2px #0d0d0d;
  pointer-events: none;
  z-index: 10;
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
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  background: rgba(0, 0, 0, 0.6);
  border-radius: inherit;
}
.pause-play-icon {
  width: 120px;
  height: 120px;
  color: #fff;
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.3));
  cursor: pointer;
}
.pause-play-icon path {
  transition: opacity 0.2s ease;
}
.pause-play-icon:hover path {
  opacity: 0.8;
}
</style>
