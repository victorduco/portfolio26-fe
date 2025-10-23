<template>
  <div class="video-wrapper" :class="{ 'video-playing': videoExpanded }">
    <!-- Play Icon -->
    <svg
      class="play-icon"
      :class="{ 'play-icon-hidden': videoExpanded }"
      width="100"
      height="100"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 5v14l11-7L8 5z"
        fill="black"
        stroke="black"
        stroke-width="2"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
    </svg>

    <!-- Video Element -->
    <video
      v-if="videoSrc"
      ref="videoElement"
      :src="videoSrc"
      class="case-video"
      :class="{
        'video-visible': videoExpanded,
        'video-paused-blur': !isPlaying && hasStartedPlayback,
      }"
      :muted="shouldBeMutedByDefault || isMuted"
      playsinline
      @ended="handleVideoEnded"
      @timeupdate="handleTimeUpdate"
    ></video>

    <!-- Pause Overlay (Play button when paused) -->
    <motion.div
      v-if="!isPlaying && hasStartedPlayback && videoExpanded"
      class="case-video-pause-overlay"
      :class="{ 'is-playing': isPlaying }"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }"
    >
      <svg
        viewBox="0 0 100 100"
        fill="currentColor"
        class="pause-play-icon"
        @click.stop="togglePlayPause"
        aria-label="Play video"
      >
        <path
          d="M 32 23 L 32 77 C 32 78.5 33 79.5 34.5 79 L 73 52 C 74.5 51.2 74.5 48.8 73 48 L 34.5 21 C 33 20.5 32 21.5 32 23 Z"
        />
      </svg>
    </motion.div>

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
import { motion } from "motion-v";
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
  document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);

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
  aspect-ratio: 1662 / 1080;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
  background: #ffffff;
  border: 40px solid #000000;
  border-radius: 80px;
  padding: 0;
  isolation: isolate;
  pointer-events: none;
  transition: border-radius 0.6s cubic-bezier(0.22, 0.61, 0.36, 1),
    border-width 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.video-wrapper.video-playing {
  background: #ffffff;
  border-width: 10px;
  border-radius: 20px;
}

.play-icon {
  width: 340px;
  height: 340px;
  opacity: 1;
  transition: opacity 0.3s ease-out;
  position: absolute;
  z-index: 2;
}

.play-icon.play-icon-hidden {
  opacity: 0;
  pointer-events: none;
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
  opacity: 0;
  border-radius: 40px;
  transition: opacity 0.4s ease-in,
    border-radius 0.6s cubic-bezier(0.22, 0.61, 0.36, 1), filter 0.3s ease;
  z-index: 1;
  pointer-events: none;
}

.case-video.video-visible {
  opacity: 1;
  border-radius: 10px;
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
  isolation: isolate;
  border-radius: 3px;
}

.pause-play-icon {
  position: relative;
  z-index: 101;
  width: 140px;
  height: 140px;
  color: #000000;
  cursor: pointer;
  pointer-events: auto;
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.1));
  transition: opacity 0.2s ease;
  will-change: transform;
  transform: translateZ(0);
}

.pause-play-icon:hover {
  opacity: 0.8;
}

@media (max-width: 899px) {
  .video-wrapper {
    background: transparent;
    border-radius: 0;
    padding: 0;
  }
}
</style>
