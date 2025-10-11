<template>
  <div class="case-video-container">
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
      <button class="case-video-replay" type="button" @click="replayVideo">
        <svg
          class="case-video-replay-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
          />
        </svg>
        Replay video
      </button>
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

  video.muted = true;
  video.playsInline = true;

  video
    .play()
    .then(() => {
      hasStartedPlayback.value = true;
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
  }

  if (!hasStartedPlayback.value) {
    resetInitialSequence();
  } else if (!showFinalOverlay.value) {
    videoState.value = "hidden";
  }
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

.case-video-replay {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  color: #171717;
  background: transparent;
  border: 1px solid rgba(23, 23, 23, 0.2);
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.case-video-replay:hover {
  border-color: rgba(23, 23, 23, 0.4);
  background: rgba(23, 23, 23, 0.05);
}

.case-video-replay-icon {
  width: 20px;
  height: 20px;
}
</style>
