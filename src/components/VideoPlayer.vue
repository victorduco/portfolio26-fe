<template>
  <div class="video-wrapper">
    <!-- Video Element -->
    <video
      v-if="videoSrc"
      ref="videoElement"
      :src="videoSrc"
      class="case-video"
      :class="{
        'video-paused-blur': !isPlaying && hasStartedPlayback,
      }"
      :muted="shouldBeMutedByDefault || isMuted"
      playsinline
      @ended="handleVideoEnded"
      @timeupdate="handleTimeUpdate"
    ></video>

    <!-- Pause Overlay (Play button when paused) -->
    <div
      v-if="!isPlaying && hasStartedPlayback && videoExpanded"
      class="case-video-pause-overlay"
    >
      <svg
        viewBox="0 0 100 100"
        fill="currentColor"
        class="pause-play-icon"
        aria-label="Play video"
      >
        <path
          class="pause-play-icon-path"
          d="M 32 23 L 32 77 C 32 78.5 33 79.5 34.5 79 L 73 52 C 74.5 51.2 74.5 48.8 73 48 L 34.5 21 C 33 20.5 32 21.5 32 23 Z"
          @click="togglePlayPause"
        />
      </svg>
    </div>

    <!-- Video Controls -->
    <VideoControls
      v-if="hasStartedPlayback && videoExpanded"
      :is-playing="isPlaying"
      :is-muted="isMuted"
      :is-fullscreen="isFullscreen"
      :is-small-screen="isSmallScreen"
      @toggle-mute="toggleMute"
      @toggle-play-pause="togglePlayPause"
      @restart="restartVideo"
      @toggle-fullscreen="toggleFullscreen"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useMediaQuery } from "@/composables/useMediaQuery.js";
import { useVideoPlayer } from "@/composables/useVideoPlayer.js";
import { useRoute } from "vue-router";
import VideoControls from "./VideoControls.vue";

const props = defineProps({
  videoSrc: {
    type: String,
    required: true,
  },
  videoExpanded: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["save-state"]);

const videoElement = ref(null);
const isSmallScreen = useMediaQuery("(max-width: 600px)");

const {
  isPlaying,
  isMuted,
  hasStartedPlayback,
  wasStateRestored,
  isFullscreen,
  shouldBeMutedByDefault,
  attemptPlay,
  togglePlayPause,
  toggleMute,
  toggleFullscreen,
  restartVideo,
  handleVideoEnded,
  handleFullscreenChange,
  handleUserInteraction,
  pauseVideo,
  saveState,
  restoreState,
  clearVideoState,
  isComingFromStory,
} = useVideoPlayer(props.videoSrc, videoElement);

const handleTimeUpdate = () => {
  // Can be used for progress tracking if needed
};

// Watch videoExpanded to control playback
watch(
  () => props.videoExpanded,
  (expanded) => {
    const video = videoElement.value;
    if (!video) return;

    if (expanded) {
      attemptPlay();
    } else {
      pauseVideo();
    }
  }
);

// Setup on mount
onMounted(() => {
  const route = useRoute();
  const cameFromStory = route.meta?.skipNavIntro;

  if (!cameFromStory) {
    const videoStateKey = `video-state-${props.videoSrc}`;
    sessionStorage.removeItem(videoStateKey);
  }

  const video = videoElement.value;
  if (video && isComingFromStory()) {
    video.addEventListener(
      "loadedmetadata",
      () => {
        restoreState();
      },
      { once: true }
    );

    if (video.readyState >= 1) {
      restoreState();
    }
  }

  // Setup interaction listeners
  document.addEventListener("click", handleUserInteraction);
  document.addEventListener("touchstart", handleUserInteraction, {
    passive: true,
  });
  document.addEventListener("keydown", handleUserInteraction);

  // Setup fullscreen listeners
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
});

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener("click", handleUserInteraction);
  document.removeEventListener("touchstart", handleUserInteraction);
  document.removeEventListener("keydown", handleUserInteraction);
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  document.removeEventListener(
    "webkitfullscreenchange",
    handleFullscreenChange
  );

  pauseVideo();
});

// Expose methods for parent component
defineExpose({
  saveState,
  pauseVideo,
  attemptPlay,
});
</script>

<style scoped>
.video-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
  background: transparent;
  pointer-events: none;
  border-radius: inherit;
}

.case-video {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1;
  z-index: 1;
  pointer-events: none;
  border-radius: 20px;
  transition: filter 0.3s ease;
}

.case-video.video-paused-blur {
  filter: blur(10px);
}

.case-video-pause-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  pointer-events: none;
  border-radius: inherit;
}

.pause-play-icon {
  display: block;
  width: 120px;
  height: 120px;
  color: #000000;
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.1));
  padding: 0;
  margin: 0;
  pointer-events: none;
}

.pause-play-icon-path {
  cursor: pointer;
  pointer-events: auto;
  transition: opacity 0.2s ease;
}

.pause-play-icon-path:hover {
  opacity: 0.8;
}
</style>
