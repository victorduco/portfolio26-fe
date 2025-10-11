<template>
  <div
    class="case-video-container"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <motion.div
      class="case-video-shell"
      :initial="hasStartedPlayback ? 'visible' : 'hidden'"
      :animate="videoState"
      :variants="videoVariants"
      :transition="videoTransition"
    >
      <video
        ref="videoElement"
        class="case-video-element"
        :src="src"
        muted
        playsinline
        @ended="handleVideoEnded"
      ></video>
    </motion.div>

    <!-- Video Controls Bar -->
    <motion.div
      v-if="hasStartedPlayback && !showFinalOverlay"
      class="case-video-controls"
      :animate="isHovering ? 'visible' : 'hidden'"
      :variants="controlsVariants"
      :transition="controlsTransition"
      :initial="false"
    >
      <!-- Mute/Unmute button (first) -->
      <motion.button
        class="control-button"
        type="button"
        @click="toggleMute"
        @mouseenter="muteHovered = true"
        @mouseleave="muteHovered = false"
        :animate="muteHovered ? 'hover' : 'default'"
        :variants="buttonVariants"
        :transition="buttonTransition"
        :aria-label="isMuted ? 'Unmute' : 'Mute'"
      >
        <motion.svg
          v-if="isMuted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="control-icon"
          :animate="muteHovered ? 'hover' : 'default'"
          :variants="iconVariants"
          :transition="iconTransition"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </motion.svg>
        <motion.svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="control-icon"
          :animate="muteHovered ? 'hover' : 'default'"
          :variants="iconVariants"
          :transition="iconTransition"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </motion.svg>
      </motion.button>

      <!-- Play/Pause button (second) -->
      <motion.button
        class="control-button"
        type="button"
        @click="togglePlayPause"
        @mouseenter="playHovered = true"
        @mouseleave="playHovered = false"
        :animate="playHovered ? 'hover' : 'default'"
        :variants="buttonVariants"
        :transition="buttonTransition"
        :aria-label="isPlaying ? 'Pause' : 'Play'"
      >
        <motion.svg
          v-if="isPlaying"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="control-icon"
          :animate="playHovered ? 'hover' : 'default'"
          :variants="iconVariants"
          :transition="iconTransition"
        >
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </motion.svg>
        <motion.svg
          v-else
          viewBox="0 0 24 24"
          fill="currentColor"
          class="control-icon"
          :animate="playHovered ? 'hover' : 'default'"
          :variants="iconVariants"
          :transition="iconTransition"
        >
          <path d="M8 5v14l11-7z" />
        </motion.svg>
      </motion.button>

      <!-- Restart button (third) -->
      <motion.button
        class="control-button"
        type="button"
        @click="restartVideo"
        @mouseenter="restartHovered = true"
        @mouseleave="restartHovered = false"
        :animate="restartHovered ? 'hover' : 'default'"
        :variants="buttonVariants"
        :transition="buttonTransition"
        aria-label="Restart video"
      >
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="control-icon"
          :animate="restartHovered ? 'hover' : 'default'"
          :variants="iconVariants"
          :transition="iconTransition"
        >
          <path
            d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
          />
        </motion.svg>
      </motion.button>
    </motion.div>

    <motion.div
      v-if="showFinalOverlay"
      class="case-video-final"
      :animate="finalOverlayState"
      :variants="overlayVariants"
      :transition="overlayTransition"
      :initial="false"
    >
      <div class="case-video-final-content">
        <h2 class="case-video-final-title">
          Dive Deeper into the Design Process
        </h2>
        <RouterLink
          class="case-video-final-link"
          :to="finalLink"
          @mouseenter="linkHovered = true"
          @mouseleave="linkHovered = false"
        >
          <motion.div
            class="case-video-final-diamond"
            :animate="linkHovered ? 'hover' : 'default'"
            :variants="diamondVariants"
            :transition="diamondTransition"
          />
          <span class="case-video-final-link-text"> Open Story </span>
        </RouterLink>
      </div>

      <!-- Restart button positioned like during playback -->
      <div class="case-video-final-controls">
        <motion.button
          class="control-button control-button-final"
          type="button"
          @click="replayVideo"
          @mouseenter="finalRestartHovered = true"
          @mouseleave="finalRestartHovered = false"
          :animate="finalRestartHovered ? 'hover' : 'default'"
          :variants="buttonVariants"
          :transition="buttonTransition"
          aria-label="Restart video"
        >
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="control-icon"
            :animate="finalRestartHovered ? 'hover' : 'default'"
            :variants="iconVariants"
            :transition="iconTransition"
          >
            <path
              d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
            />
          </motion.svg>
        </motion.button>
      </div>
    </motion.div>
  </div>
</template>

<script setup>
import { onUnmounted, ref } from "vue";
import { motion } from "motion-v";
import { RouterLink } from "vue-router";

defineProps({
  src: {
    type: String,
    required: true,
  },
  finalLink: {
    type: String,
    required: true,
  },
});

const videoElement = ref(null);
const showFinalOverlay = ref(false);
const finalOverlayState = ref("hidden");
const videoState = ref("hidden");
const hasStartedPlayback = ref(false);
const isHovering = ref(false);
const isPlaying = ref(false);
const isMuted = ref(false);
const muteHovered = ref(false);
const playHovered = ref(false);
const restartHovered = ref(false);
const finalRestartHovered = ref(false);
const linkHovered = ref(false);

let playTimeout = null;
let initialHoldTimeout = null;
let initialCleanupTimeout = null;
let finalCleanupTimeout = null;

function getVideoElement() {
  const target = videoElement.value;
  if (!target) return null;
  return target instanceof HTMLVideoElement ? target : null;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const overlayTransition = {
  duration: 0.5,
  ease: [0.33, 1, 0.68, 1],
};

const videoVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const videoTransition = {
  duration: 0.5,
  ease: [0.33, 1, 0.68, 1],
};

const controlsVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const controlsTransition = {
  duration: 0.3,
  ease: [0.33, 1, 0.68, 1],
};

const buttonVariants = {
  default: {
    rotate: 0,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  hover: {
    rotate: 45,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
};

const buttonTransition = {
  type: "spring",
  stiffness: 320,
  damping: 11,
  mass: 1.2,
};

const iconVariants = {
  default: {
    rotate: 0,
  },
  hover: {
    rotate: -45,
  },
};

const iconTransition = {
  type: "spring",
  stiffness: 320,
  damping: 11,
  mass: 1.2,
};

const diamondVariants = {
  default: {
    rotate: 45,
    backgroundColor: "#979797",
  },
  hover: {
    rotate: 0,
    backgroundColor: "#979797",
  },
};

const diamondTransition = {
  type: "spring",
  stiffness: 320,
  damping: 11,
  mass: 1.2,
};

function clearInitialTimers() {
  if (initialHoldTimeout) {
    clearTimeout(initialHoldTimeout);
    initialHoldTimeout = null;
  }
  if (initialCleanupTimeout) {
    clearTimeout(initialCleanupTimeout);
    initialCleanupTimeout = null;
  }
}

function clearFinalTimers() {
  if (finalCleanupTimeout) {
    clearTimeout(finalCleanupTimeout);
    finalCleanupTimeout = null;
  }
}

function attemptPlay() {
  const video = getVideoElement();
  if (!video || showFinalOverlay.value) return;

  video.muted = isMuted.value;
  video.playsInline = true;

  video
    .play()
    .then(() => {
      hasStartedPlayback.value = true;
      isPlaying.value = true;
      videoState.value = "visible";
    })
    .catch(() => {
      /* Ignore autoplay rejections */
      if (!hasStartedPlayback.value && !showFinalOverlay.value) {
        schedulePlay(300);
      }
    });
}

function handleVideoEnded() {
  showFinalOverlay.value = true;
  finalOverlayState.value = "visible";
  videoState.value = "hidden";
  isPlaying.value = false;
}

function replayVideo() {
  const video = getVideoElement();
  if (!video) return;

  clearFinalTimers();
  finalOverlayState.value = "hidden";
  finalCleanupTimeout = setTimeout(() => {
    showFinalOverlay.value = false;
  }, 500);

  videoState.value = "visible";
  video.currentTime = 0;
  video
    .play()
    .then(() => {
      hasStartedPlayback.value = true;
    })
    .catch(() => {
      // If playback fails, restore final overlay so the user keeps controls
      clearFinalTimers();
      showFinalOverlay.value = true;
      finalOverlayState.value = "visible";
    });
}

function schedulePlay(delay = 500) {
  if (playTimeout) {
    clearTimeout(playTimeout);
  }
  playTimeout = setTimeout(() => {
    attemptPlay();
  }, delay);
}

function handleEnter() {
  if (!showFinalOverlay.value) {
    videoState.value = "visible";
    schedulePlay();
  }
}

function handleLeave() {
  const video = getVideoElement();
  if (playTimeout) {
    clearTimeout(playTimeout);
    playTimeout = null;
  }

  if (video && typeof video.pause === "function" && !video.paused) {
    video.pause();
    isPlaying.value = false;
  }

  if (!showFinalOverlay.value) {
    videoState.value = "hidden";
  }
}

function togglePlayPause() {
  const video = getVideoElement();
  if (!video) return;

  if (video.paused) {
    video.play().then(() => {
      isPlaying.value = true;
    });
  } else {
    video.pause();
    isPlaying.value = false;
  }
}

function toggleMute() {
  const video = getVideoElement();
  if (!video) return;

  isMuted.value = !isMuted.value;
  video.muted = isMuted.value;
}

function restartVideo() {
  const video = getVideoElement();
  if (!video) return;

  video.currentTime = 0;
  video.play().then(() => {
    isPlaying.value = true;
  });
}

onUnmounted(() => {
  const video = getVideoElement();
  if (playTimeout) {
    clearTimeout(playTimeout);
    playTimeout = null;
  }
  if (video && typeof video.pause === "function" && !video.paused) {
    video.pause();
  }
  clearInitialTimers();
  clearFinalTimers();
});

defineExpose({
  handleEnter,
  handleLeave,
});
</script>

<style scoped>
.case-video-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: clamp(12px, 1.6vw, 16px);
  overflow: hidden;
}

.case-video-element {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.case-video-shell {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.case-video-final {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 3vw, 32px);
  gap: clamp(12px, 2vw, 20px);
  border-radius: inherit;
  z-index: 2;
  background: #ffffff;
  color: #171717;
  pointer-events: auto;
}

.case-video-final-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  max-width: 80%;
}

.case-video-final-title {
  margin: 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 600;
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #333333;
}

.case-video-final-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 19px;
  color: #333333;
  text-decoration: none;
  transition: color 0.2s ease, font-size 0.2s ease;
}

.case-video-final-link:hover {
  color: #000000;
  font-size: 20px;
}

.case-video-final-link-text {
  display: inline;
  transition: inherit;
}

.case-video-final-diamond {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  flex-shrink: 0;
}

.case-video-final-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 20px;
  pointer-events: none;
}

.control-button-final {
  pointer-events: auto;
}

.case-video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
  padding: 16px 20px;
  background: transparent;
  z-index: 3;
  pointer-events: none;
}

.control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  pointer-events: auto;
  outline: none !important;
  -webkit-tap-highlight-color: transparent;
}

.control-button:focus {
  outline: none !important;
}

.control-button:focus-visible {
  outline: none !important;
}

.control-button:active {
  background: rgba(0, 0, 0, 0.4);
  outline: none !important;
}

.control-icon {
  width: 18px;
  height: 18px;
  outline: none !important;
  -webkit-tap-highlight-color: transparent;
}

.control-icon:focus {
  outline: none !important;
}

.control-icon:focus-visible {
  outline: none !important;
}

@media (max-width: 768px) {
  .case-video-controls {
    padding: 12px 16px;
    gap: 8px;
  }

  .control-button {
    width: 36px;
    height: 36px;
  }

  .control-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
