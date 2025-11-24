<template>
  <div class="video-wrapper" ref="videoContainerRef">
    <video ref="videoElement" :src="videoSrc" class="story-video"
      :class="{ 'video-paused-blur': !isPlaying && hasStartedPlayback }"
      :muted="shouldBeMutedByDefault || isMuted" playsinline
      @ended="handleVideoEnded" @click="togglePlayPause" />

    <div v-if="!isPlaying && hasStartedPlayback" class="story-video-pause-overlay">
      <svg viewBox="0 0 100 100" fill="currentColor" class="pause-play-icon" aria-label="Play video">
        <path d="M32 23L32 77C32 78.5 33 79.5 34.5 79L73 52C74.5 51.2 74.5 48.8 73 48L34.5 21C33 20.5 32 21.5 32 23Z" @click="togglePlayPause" />
      </svg>
    </div>

    <VideoControls v-if="hasStartedPlayback" :is-playing="isPlaying" :is-muted="isMuted"
      :is-fullscreen="isFullscreen" :is-small-screen="isSmallScreen"
      @toggle-mute="toggleMute" @toggle-play-pause="togglePlayPause"
      @restart="restartVideo" @toggle-fullscreen="toggleFullscreen" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useMediaQuery } from "@/composables/useMediaQuery.js";
import { useVideoPlayer } from "@/composables/useVideoPlayer.js";
import VideoControls from "./VideoControls.vue";

const props = defineProps({
  videoSrc: { type: String, required: true },
  autoplayThreshold: { type: Number, default: 0.75, validator: v => v >= 0 && v <= 1 },
});

const videoElement = ref(null);
const videoContainerRef = ref(null);
const isSmallScreen = useMediaQuery("(max-width: 600px)");

const { isPlaying, isMuted, hasStartedPlayback, isFullscreen, shouldBeMutedByDefault,
  userPaused, attemptPlay, togglePlayPause, toggleMute, toggleFullscreen,
  restartVideo, handleVideoEnded, handleFullscreenChange, handleUserInteraction, pauseVideo
} = useVideoPlayer(props.videoSrc, videoElement);

let observer = null;
let playTimeout = null;
let isCurrentlyVisible = false;
const interactionEvents = ["click", "touchstart", "keydown"];
const fullscreenEvents = ["fullscreenchange", "webkitfullscreenchange"];

onMounted(() => {
  interactionEvents.forEach(e => document.addEventListener(e, handleUserInteraction, e === "touchstart" ? { passive: true } : undefined));
  fullscreenEvents.forEach(e => document.addEventListener(e, handleFullscreenChange));

  if (videoContainerRef.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        const isVisibleEnough = entry.isIntersecting && entry.intersectionRatio >= props.autoplayThreshold;
        isCurrentlyVisible = isVisibleEnough;

        if (playTimeout) {
          clearTimeout(playTimeout);
          playTimeout = null;
        }

        if (isVisibleEnough) {
          if (!userPaused.value) {
            playTimeout = setTimeout(() => {
              if (isCurrentlyVisible && !userPaused.value) {
                attemptPlay();
              }
              playTimeout = null;
            }, 300);
          }
        } else {
          pauseVideo();
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5, props.autoplayThreshold, 0.9, 1] }
    );
    observer.observe(videoContainerRef.value);
  }
});

onUnmounted(() => {
  interactionEvents.forEach(e => document.removeEventListener(e, handleUserInteraction));
  fullscreenEvents.forEach(e => document.removeEventListener(e, handleFullscreenChange));
  if (playTimeout) {
    clearTimeout(playTimeout);
    playTimeout = null;
  }
  observer?.disconnect();
  pauseVideo();
});
</script>

<style scoped>
.video-wrapper { position: relative; max-width: 1200px; overflow: hidden; border-radius: 12px; border: 1px solid #ccc; line-height: 0; }
.story-video { width: 100%; height: auto; display: block; transition: filter 0.3s ease; cursor: pointer; }
.story-video.video-paused-blur { filter: blur(10px); transform: scale(1.05); }
.story-video-pause-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 100; pointer-events: none; border-radius: inherit; background: rgba(255,255,255,0.6); }
.pause-play-icon { width: 120px; height: 120px; color: #000; filter: drop-shadow(0 4px 16px rgba(0,0,0,0.1)); }
.pause-play-icon path { cursor: pointer; pointer-events: auto; transition: opacity 0.2s ease; }
.pause-play-icon path:hover { opacity: 0.8; }
</style>
