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
      v-if="showInitialOverlay"
      class="case-video-initial"
      :animate="initialOverlayState"
      :variants="overlayVariants"
      :transition="overlayTransition"
      :initial="false"
      aria-hidden="true"
    >
      <svg
        class="case-video-initial-icon"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="40" cy="40" r="36" stroke="currentColor" stroke-width="4" />
        <path
          d="M34 28L54 40L34 52V28Z"
          fill="currentColor"
          stroke="currentColor"
          stroke-linejoin="round"
        />
      </svg>
    </motion.div>

    <motion.div
      v-if="showFinalOverlay"
      class="case-video-final"
      :animate="finalOverlayState"
      :variants="overlayVariants"
      :transition="overlayTransition"
      :initial="false"
    >
      <p class="case-video-final-text">{{ finalText }}</p>
      <RouterLink class="case-video-final-link" :to="finalLink">
        View case
      </RouterLink>

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
  finalText: {
    type: String,
    required: true,
  },
  finalLink: {
    type: String,
    required: true,
  },
});

const videoElement = ref(null);
const showInitialOverlay = ref(false);
const showFinalOverlay = ref(false);
const initialOverlayState = ref("hidden");
const finalOverlayState = ref("hidden");
const videoState = ref("hidden");
const hasStartedPlayback = ref(false);
const initialSequenceRunning = ref(false);
const isHovering = ref(false);
const isPlaying = ref(false);
const isMuted = ref(false);
const muteHovered = ref(false);
const playHovered = ref(false);
const restartHovered = ref(false);
const finalRestartHovered = ref(false);

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

function startInitialSequence() {
  if (initialSequenceRunning.value || hasStartedPlayback.value) return;

  if (playTimeout) {
    clearTimeout(playTimeout);
    playTimeout = null;
  }

  initialSequenceRunning.value = true;
  showInitialOverlay.value = true;
  initialOverlayState.value = "visible";
  videoState.value = "hidden";

  initialHoldTimeout = setTimeout(() => {
    initialOverlayState.value = "hidden";
    videoState.value = "visible";
    if (!hasStartedPlayback.value) {
      schedulePlay(500);
    }
  }, 1000);

  initialCleanupTimeout = setTimeout(() => {
    showInitialOverlay.value = false;
    initialSequenceRunning.value = false;
    if (!hasStartedPlayback.value) {
      schedulePlay(0);
    }
  }, 1500);
}

function resetInitialSequence() {
  if (hasStartedPlayback.value) return;
  clearInitialTimers();
  initialSequenceRunning.value = false;
  showInitialOverlay.value = false;
  initialOverlayState.value = "hidden";
  videoState.value = "hidden";
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
      if (!initialSequenceRunning.value) {
        videoState.value = "visible";
      }
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
  if (!hasStartedPlayback.value) {
    startInitialSequence();
  } else if (!showFinalOverlay.value) {
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

  if (!hasStartedPlayback.value) {
    resetInitialSequence();
  } else if (!showFinalOverlay.value) {
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

.case-video-initial,
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
  pointer-events: none;
}

.case-video-initial {
  background: transparent;
  color: rgba(255, 255, 255, 0.9);
}

.case-video-initial-icon {
  width: clamp(48px, 8vw, 72px);
  height: clamp(48px, 8vw, 72px);
}

.case-video-final {
  background: #ffffff;
  color: #171717;
  align-items: flex-start;
  pointer-events: auto;
}

.case-video-final-text {
  margin: 0;
  font-size: clamp(18px, 2.2vw, 24px);
  font-weight: 500;
  line-height: 1.3;
}

.case-video-final-link {
  font-size: clamp(14px, 1.8vw, 16px);
  font-weight: 500;
  color: #171717;
  text-decoration: none;
  border-bottom: 1px solid rgba(23, 23, 23, 0.25);
}

.case-video-final-link:hover {
  border-bottom-color: rgba(23, 23, 23, 0.5);
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
