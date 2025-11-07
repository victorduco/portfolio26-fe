<template>
  <div class="fullscreen-video-wrapper">
    <h3 v-if="videoLabel" class="video-label">{{ videoLabel }}</h3>
    <div class="fullscreen-video" ref="videoContainerRef">
      <div class="background-container" :style="{ backgroundColor: backgroundColor }">
      <div class="video-wrapper">
      <!-- Video Element -->
      <video
        ref="videoElement"
        :src="videoSrc"
        class="case-video"
        :class="{
          'video-paused-blur': !isPlaying && hasStartedPlayback,
        }"
        :muted="shouldBeMutedByDefault || isMuted"
        playsinline
        @ended="handleVideoEnded"
        @click="togglePlayPause"
      ></video>

      <!-- Pause Overlay (Play button when paused) -->
      <div
        v-if="!isPlaying && hasStartedPlayback"
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
        v-if="hasStartedPlayback"
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
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useMediaQuery } from '@/composables/useMediaQuery.js';
import { useVideoPlayer } from '@/composables/useVideoPlayer.js';
import VideoControls from './VideoControls.vue';

const props = defineProps({
  videoSrc: {
    type: String,
    required: true,
  },
  backgroundColor: {
    type: String,
    default: '#000000',
  },
  autoplayThreshold: {
    type: Number,
    default: 0.75,
    validator: (value) => value >= 0 && value <= 1,
  },
  videoLabel: {
    type: String,
    default: '',
  },
});

const videoElement = ref(null);
const videoContainerRef = ref(null);
const isSmallScreen = useMediaQuery('(max-width: 600px)');

const {
  isPlaying,
  isMuted,
  hasStartedPlayback,
  isFullscreen,
  shouldBeMutedByDefault,
  userPaused,
  attemptPlay,
  togglePlayPause,
  toggleMute,
  toggleFullscreen,
  restartVideo,
  handleVideoEnded,
  handleFullscreenChange,
  handleUserInteraction,
  pauseVideo,
} = useVideoPlayer(props.videoSrc, videoElement);

// Intersection Observer for scroll-based play/pause
let observer = null;

// Setup on mount
onMounted(() => {
  // Setup interaction listeners
  document.addEventListener('click', handleUserInteraction);
  document.addEventListener('touchstart', handleUserInteraction, {
    passive: true,
  });
  document.addEventListener('keydown', handleUserInteraction);

  // Setup fullscreen listeners
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

  // Setup Intersection Observer for scroll-based autoplay
  if (videoContainerRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video is visible - play it only if user didn't manually pause
            if (!userPaused.value) {
              setTimeout(() => {
                attemptPlay();
              }, 300);
            }
          } else {
            // Video is not visible - ALWAYS pause it to prevent background playback
            pauseVideo();
          }
        });
      },
      {
        threshold: props.autoplayThreshold,
        rootMargin: '0px',
      }
    );

    observer.observe(videoContainerRef.value);
  }
});

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('click', handleUserInteraction);
  document.removeEventListener('touchstart', handleUserInteraction);
  document.removeEventListener('keydown', handleUserInteraction);
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);

  // Disconnect Intersection Observer
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  pauseVideo();
});
</script>

<style scoped>
.fullscreen-video-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
}

.video-label {
  width: 100%;
  max-width: 1200px;
  margin: 0 0 -8px 0;
  padding: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  line-height: 1.2;
  color: inherit;
  opacity: 0.5;
}

.fullscreen-video {
  width: 100%;
  height: 100vh;
  padding: 16px;
  box-sizing: border-box;
}

.background-container {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-wrapper {
  position: relative;
  max-width: 1200px;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid #cccccc;
  line-height: 0;
}

.case-video {
  width: 100%;
  height: auto;
  display: block;
  transition: filter 0.3s ease;
  cursor: pointer;
}

.case-video.video-paused-blur {
  filter: blur(10px);
  transform: scale(1.05);
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
  background-color: rgba(255, 255, 255, 0.6);
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
