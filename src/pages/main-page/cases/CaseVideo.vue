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
      @click="handleVideoClick"
    >
      <video
        ref="videoElement"
        class="case-video-element"
        :class="{ 'video-paused-blur': !isPlaying && hasStartedPlayback }"
        :src="props.src"
        :muted="shouldBeMutedByDefault || isMuted"
        playsinline
        @ended="handleVideoEnded"
        @timeupdate="handleTimeUpdate"
      ></video>
    </motion.div>

    
    <motion.div
      v-if="!isPlaying && !showFinalOverlay && hasStartedPlayback"
      class="case-video-pause-overlay"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }"
    >
      
      <div class="pause-overlay-clickable" @click="togglePlayPause"></div>

      
      <svg
        viewBox="0 0 100 100"
        fill="currentColor"
        class="pause-play-icon"
        @click="togglePlayPause"
        aria-label="Play video"
      >
        <path d="M 32 23 L 32 77 C 32 78.5 33 79.5 34.5 79 L 73 52 C 74.5 51.2 74.5 48.8 73 48 L 34.5 21 C 33 20.5 32 21.5 32 23 Z" />
      </svg>
    </motion.div>

    
    <motion.div
      v-if="hasStartedPlayback && !showFinalOverlay"
      class="case-video-controls"
      :class="{ 'mobile-controls': isSmallScreen }"
      :animate="isHovering || isSmallScreen ? 'visible' : 'hidden'"
      :variants="controlsVariants"
      :transition="controlsTransition"
      :initial="false"
    >
      
      <motion.button
        v-if="isSmallScreen"
        class="control-button"
        type="button"
        @click="toggleFullscreen"
        @mouseenter="fullscreenHovered = true"
        @mouseleave="fullscreenHovered = false"
        :animate="fullscreenHovered ? 'hover' : 'default'"
        :variants="buttonVariants"
        :transition="buttonTransition"
        :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
      >
        <motion.svg
          v-if="!isFullscreen"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="control-icon"
          :animate="fullscreenHovered ? 'hover' : 'default'"
          :variants="iconVariants"
          :transition="iconTransition"
        >
          <path
            d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
          />
        </motion.svg>
        <motion.svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="control-icon"
          :animate="fullscreenHovered ? 'hover' : 'default'"
          :variants="iconVariants"
          :transition="iconTransition"
        >
          <path
            d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"
          />
        </motion.svg>
      </motion.button>

      
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
          :to="props.finalLink"
          @mouseenter="linkHovered = true"
          @mouseleave="linkHovered = false"
          @click="handleStoryLinkClick"
        >
          <motion.div
            class="case-video-final-diamond"
            :style="{ backgroundColor: props.diamondColor }"
            :animate="linkHovered ? 'hover' : 'default'"
            :variants="diamondVariants"
            :transition="diamondTransition"
          />
          <span class="case-video-final-link-text"> Open Story </span>
        </RouterLink>
      </div>

      
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
import { onMounted, onUnmounted, ref, computed } from "vue";
import { motion } from "motion-v";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useMediaQuery } from "@/composables/useMediaQuery.js";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  finalLink: {
    type: String,
    required: true,
  },
  diamondColor: {
    type: String,
    default: "#319BF8",
  },
  finalOverlayTime: {
    type: Number,
    default: null, // If null, show on video end; otherwise show at this time in seconds
  },
});

const router = useRouter();
const route = useRoute();

const isSmallScreen = useMediaQuery("(max-width: 600px)");

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
const fullscreenHovered = ref(false);
const linkHovered = ref(false);
const largePlayHovered = ref(false);
const wasStateRestored = ref(false); // Track if state was restored
const shouldSaveState = ref(false); // Track if we should save state on unmount
const userPaused = ref(false); // Track if user manually paused the video
const isFullscreen = ref(false);


const shouldBeMutedByDefault = computed(() => isSmallScreen.value);


const userHasInteracted = computed(() => getUserHasInteracted());


const getStorageKey = () => `video-state-${props.src}`;


function saveVideoState() {
  const video = getVideoElement();
  if (!video) return;

  const state = {
    currentTime: video.currentTime,
    isPlaying: isPlaying.value,
    isMuted: isMuted.value,
    hasStartedPlayback: hasStartedPlayback.value,
    showFinalOverlay: showFinalOverlay.value,
    timestamp: Date.now(),
  };

  sessionStorage.setItem(getStorageKey(), JSON.stringify(state));
}


function clearVideoState() {
  sessionStorage.removeItem(getStorageKey());
}


function restoreVideoState() {
  try {
    const stored = sessionStorage.getItem(getStorageKey());
    if (!stored) return false;

    const state = JSON.parse(stored);
    const video = getVideoElement();
    if (!video) return false;

    
    const isRecent = Date.now() - state.timestamp < 5 * 60 * 1000;
    if (!isRecent) {
      clearVideoState();
      return false;
    }

    
    video.currentTime = state.currentTime || 0;
    isMuted.value = state.isMuted || false;
    video.muted = isMuted.value;
    hasStartedPlayback.value = state.hasStartedPlayback || false;
    showFinalOverlay.value = state.showFinalOverlay || false;

    if (showFinalOverlay.value) {
      finalOverlayState.value = "visible";
      videoState.value = "hidden";
    } else if (hasStartedPlayback.value) {
      videoState.value = "visible";
      if (state.isPlaying) {
        video
          .play()
          .then(() => {
            isPlaying.value = true;
          })
          .catch(() => {
            isPlaying.value = false;
          });
      }
    }

    wasStateRestored.value = true;
    return true;
  } catch (error) {
    clearVideoState();
    return false;
  }
}


function isComingFromStory() {
  
  return sessionStorage.getItem(getStorageKey()) !== null;
}

let playTimeout = null;
let initialHoldTimeout = null;
let initialCleanupTimeout = null;
let finalCleanupTimeout = null;
let playAttempts = 0; // Track number of play attempts to prevent infinite loop


function getUserHasInteracted() {
  return sessionStorage.getItem('user-has-interacted') === 'true';
}

function setUserHasInteracted() {
  sessionStorage.setItem('user-has-interacted', 'true');
}

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
    rotate: 45,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  hover: {
    rotate: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
};

const buttonTransition = {
  type: "spring",
  stiffness: 320,
  damping: 11,
  mass: 1.2,
};

const largePlayButtonVariants = {
  default: {
    scale: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  hover: {
    scale: 1.1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
};

const diamondPlayVariants = {
  default: {
    rotate: 45,
    scale: 1,
  },
  hover: {
    rotate: 0,
    scale: 1.05,
  },
};

const iconVariants = {
  default: {
    rotate: -45,
  },
  hover: {
    rotate: 0,
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
    backgroundColor: "#319BF8",
  },
  hover: {
    rotate: 0,
    backgroundColor: "#319BF8",
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
  const userHasInteracted = getUserHasInteracted();

  if (!video || showFinalOverlay.value) return;

  
  if (!video.paused && hasStartedPlayback.value) {
    return;
  }

  
  playAttempts++;
  if (playAttempts > 3) {
    
    video.muted = true;
    isMuted.value = true;
  }

  
  const shouldTryMuted = !userHasInteracted && !shouldBeMutedByDefault.value;
  video.muted = shouldTryMuted ? true : (shouldBeMutedByDefault.value || isMuted.value);
  video.playsInline = true;

  video
    .play()
    .then(() => {
      playAttempts = 0; // Reset on success
      hasStartedPlayback.value = true;
      isPlaying.value = true;
      videoState.value = "visible";

      
      if (shouldTryMuted) {
        isMuted.value = true;

        
        if (getUserHasInteracted()) {
          video.muted = false;
          isMuted.value = false;
        }
      }
    })
    .catch(() => {
      /* Handle autoplay rejections */

      
      if (userHasInteracted && !video.muted) {
        hasStartedPlayback.value = true; // Show play button
        playAttempts = 0; // Reset
      } else if (!hasStartedPlayback.value && !showFinalOverlay.value && playAttempts <= 3) {
        schedulePlay(300);
      }
    });
}

function handleTimeUpdate(event) {
  
  if (props.finalOverlayTime !== null && !showFinalOverlay.value) {
    const video = event.target;
    if (video.currentTime >= props.finalOverlayTime) {
      showFinalOverlay.value = true;
      finalOverlayState.value = "visible";
      
    }
  }
}

function handleVideoEnded() {
  
  if (props.finalOverlayTime === null) {
    showFinalOverlay.value = true;
    finalOverlayState.value = "visible";
    videoState.value = "hidden";
    isPlaying.value = false;
  }
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

  
  clearVideoState();
  wasStateRestored.value = false;
  userPaused.value = false; // Reset user pause state on replay

  video
    .play()
    .then(() => {
      hasStartedPlayback.value = true;
      isPlaying.value = true;
    })
    .catch(() => {
      
      clearFinalTimers();
      showFinalOverlay.value = true;
      finalOverlayState.value = "visible";
    });
}

function schedulePlay(delay = 0) {
  if (playTimeout) {
    clearTimeout(playTimeout);
  }
  playTimeout = setTimeout(() => {
    attemptPlay();
  }, delay);
}

function handleEnter() {
  const video = getVideoElement();
  const userHasInteracted = getUserHasInteracted();

  if (!video) return;

  
  if (wasStateRestored.value) {
    wasStateRestored.value = false;
    return;
  }

  
  videoState.value = "visible";

  
  if (!showFinalOverlay.value && !userPaused.value && userHasInteracted) {
    schedulePlay();
  } else if (!hasStartedPlayback.value) {
    
    hasStartedPlayback.value = true;
  }
}

function handleLeave() {
  const video = getVideoElement();
  if (playTimeout) {
    clearTimeout(playTimeout);
    playTimeout = null;
  }

  
  playAttempts = 0;

  
  if (video && typeof video.pause === "function" && !video.paused) {
    video.pause();
    isPlaying.value = false;
    
  }

  
}

function handleVideoClick(event) {
  
  if (event.target.closest('.case-video-controls')) {
    return;
  }
  togglePlayPause();
}

function togglePlayPause() {
  const video = getVideoElement();

  if (!video) return;

  if (video.paused) {
    
    userPaused.value = false;
    setUserHasInteracted();

    
    if (!shouldBeMutedByDefault.value) {
      video.muted = false;
      isMuted.value = false;
    } else {
      
      video.muted = true;
      isMuted.value = true;
    }

    video.play().then(() => {
      isPlaying.value = true;
      hasStartedPlayback.value = true;
      videoState.value = "visible";
    });
  } else {
    
    userPaused.value = true;
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

function toggleFullscreen() {
  const video = getVideoElement();
  if (!video) return;

  if (!document.fullscreenElement) {
    
    const container = video.parentElement?.parentElement;
    if (container && container.requestFullscreen) {
      container
        .requestFullscreen()
        .then(() => {
          isFullscreen.value = true;
        })
        .catch(() => {});
    } else if (video.webkitRequestFullscreen) {
      
      video
        .webkitRequestFullscreen()
        .then(() => {
          isFullscreen.value = true;
        })
        .catch(() => {});
    }
  } else {
    
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        isFullscreen.value = false;
      });
    } else if (document.webkitExitFullscreen) {
      
      document.webkitExitFullscreen();
      isFullscreen.value = false;
    }
  }
}

function restartVideo() {
  const video = getVideoElement();
  if (!video) return;

  video.currentTime = 0;

  
  clearVideoState();
  wasStateRestored.value = false;
  userPaused.value = false; // Reset user pause state on restart

  video.play().then(() => {
    isPlaying.value = true;
  });
}


function handleStoryLinkClick() {
  if (hasStartedPlayback.value) {
    saveVideoState();
  }
}

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement;
}


function handleUserInteraction() {
  if (getUserHasInteracted()) return; // Already handled

  
  setUserHasInteracted();

  
  const video = getVideoElement();
  if (video && !video.paused && hasStartedPlayback.value && isMuted.value && !shouldBeMutedByDefault.value) {
    video.muted = false;
    isMuted.value = false;
  }

  
  removeInteractionListeners();
}

function removeInteractionListeners() {
  document.removeEventListener("click", handleUserInteraction);
  document.removeEventListener("touchstart", handleUserInteraction);
  document.removeEventListener("keydown", handleUserInteraction);
}

onMounted(() => {
  
  const video = getVideoElement();
  if (video && isComingFromStory()) {
    
    video.addEventListener(
      "loadedmetadata",
      () => {
        restoreVideoState();
      },
      { once: true }
    );

    
    if (video.readyState >= 1) {
      restoreVideoState();
    }
  }

  
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

  
  
  document.addEventListener("click", handleUserInteraction);
  document.addEventListener("touchstart", handleUserInteraction, { passive: true });
  document.addEventListener("keydown", handleUserInteraction);
});

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

  
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  document.removeEventListener(
    "webkitfullscreenchange",
    handleFullscreenChange
  );

  
  removeInteractionListeners();
});

defineExpose({
  handleEnter,
  handleLeave,
  handleStoryLinkClick, // Expose for external navigation clicks
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
  object-fit: contain;
  border-radius: clamp(12px, 1.6vw, 16px);
  transition: filter 0.3s ease;
}

.case-video-element.video-paused-blur {
  filter: blur(10px) brightness(1.1);
}

.case-video-shell {
  position: absolute;
  inset: 0;
  z-index: 1;
  cursor: pointer;
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
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-h1);
  line-height: var(--line-height-tight);
  letter-spacing: -0.01em;
  color: #333333;
  text-align: center;
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

/* Mobile controls always visible */
.case-video-controls.mobile-controls {
  opacity: 1;
  pointer-events: auto;
}

@media (max-width: 899px) {
  .case-video-container {
    border-radius: 0;
  }

  .case-video-element {
    border-radius: 0;
  }

  .case-video-controls {
    padding: 12px 16px;
    gap: 10px;
  }

  .control-button {
    width: 40px;
    height: 40px;
  }

  .control-icon {
    width: 20px;
    height: 20px;
  }
}

/* Mobile landscape: adjust button sizes */
@media (max-width: 767px) and (orientation: landscape) {
  .case-video-controls {
    padding: 8px 12px;
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

/* Pause Overlay */
.case-video-pause-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10; /* High z-index to be above all video elements */
  pointer-events: auto;
  isolation: isolate; /* Create new stacking context to prevent blur inheritance */
}

.pause-overlay-clickable {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1); /* Very light overlay for contrast */
  cursor: pointer;
}

.pause-play-icon {
  position: relative;
  z-index: 11; /* Above overlay */
  width: 140px;
  height: 140px;
  color: #000000;
  cursor: pointer;
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.1));
  transition: opacity 0.2s ease;
  will-change: transform; /* Force hardware acceleration */
  transform: translateZ(0); /* Force new layer */
}

.pause-play-icon:hover {
  opacity: 0.8;
}

@media (max-width: 899px) {
  .pause-play-icon {
    width: 100px;
    height: 100px;
  }
}
</style>
