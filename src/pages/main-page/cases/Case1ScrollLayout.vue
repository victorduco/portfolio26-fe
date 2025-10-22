<template>
  <div
    class="case1-scroll-layout"
    ref="containerRef"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <!-- Spacer для начального скролла -->
    <div class="initial-spacer"></div>

    <!-- Text frame - фиксируется в центре viewport, но после определенного скролла становится обычным блоком -->
    <div
      :class="['text-frame-sticky', { 'unpinned': unpinned }]"
      v-show="showText && !showFinalOverlay"
      :style="unpinned ? { position: 'static', top: 'auto', left: 'auto', transform: 'none' } : {}"
    >
      <div class="text-content">
        <h2 class="case-title">
          <motion.span
            v-for="(word, index) in titleWords"
            :key="'title-' + index"
            :style="{ opacity: getWordOpacity(index) }"
            class="word"
            >{{ word }}</motion.span
          >
        </h2>
        <p class="case-subtitle">
          <motion.span :style="{ opacity: subtitleOpacity }">
            {{ company }}
          </motion.span>
        </p>
        <!-- Video под текстом -->
        <!-- Constraint wrapper to maintain layout -->
        <div class="video-constraint-wrapper">
          <motion.div
            class="video-container-wrapper"
            :style="{
              opacity: videoOpacity,
              transform: `translate(-50%, -50%) translateY(${videoYValue}%) scale(${videoScaleValue})`
            }"
          >
            <div
              class="video-wrapper"
              :class="{
                'video-playing': videoExpanded
              }"
            >
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
                  fill="white"
                  stroke="white"
                  stroke-width="1"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
              </svg>
              <video
                v-if="videoSrc"
                ref="videoElement"
                :src="videoSrc"
                class="case-video"
                :class="{
                  'video-visible': videoExpanded,
                  'video-paused-blur': !isPlaying && hasStartedPlayback
                }"
                :muted="shouldBeMutedByDefault || isMuted"
                playsinline
                @ended="handleVideoEnded"
                @timeupdate="handleTimeUpdate"
                @click="handleVideoClick"
              ></video>
              <!-- Pause Overlay (inside video wrapper) -->
              <motion.div
                v-if="!isPlaying && !showFinalOverlay && hasStartedPlayback && videoExpanded"
                class="case-video-pause-overlay"
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 1 }"
                :exit="{ opacity: 0 }"
                :transition="{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }"
              >
                <!-- Transparent clickable overlay -->
                <div class="pause-overlay-clickable" @click="togglePlayPause"></div>
                <!-- Large black play icon -->
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
              <!-- Video Controls Bar (inside video wrapper) -->
              <motion.div
                v-if="hasStartedPlayback && !showFinalOverlay && videoExpanded"
                class="case-video-controls"
                :class="{ 'mobile-controls': isSmallScreen }"
                :animate="isHovering || isSmallScreen ? 'visible' : 'hidden'"
                :variants="controlsVariants"
                :transition="controlsTransition"
                :initial="false"
              >
                <!-- ...existing code... -->
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
// Unpin logic: when scrollYProgress > 0.85, unpin the sticky block
import { computed } from "vue";
const unpinned = computed(() => scrollYProgress.get() > 0.85);

    <!-- Final Overlay -->
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
          :to="routeTo"
          @mouseenter="linkHovered = true"
          @mouseleave="linkHovered = false"
          @click="handleStoryLinkClick"
        >
          <motion.div
            class="case-video-final-diamond"
            :style="{ backgroundColor: '#319BF8' }"
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

    <!-- Spacer после видео для завершения анимации -->
    <div class="final-spacer"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { motion, useScroll, useTransform } from "motion-v";
import { RouterLink } from "vue-router";
import { useMediaQuery } from "@/composables/useMediaQuery.js";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  videoSrc: {
    type: String,
    default: "",
  },
  routeTo: {
    type: String,
    required: true,
  },
  backgroundColor: {
    type: String,
    default: "#ffffff",
  },
});

const containerRef = ref(null);
const videoElement = ref(null);
const scrollContainerRef = ref(null);

// Media query for small screens
const isSmallScreen = useMediaQuery("(max-width: 600px)");

// Video playback states
const isPlaying = ref(false);
const isMuted = ref(true);
const hasStartedPlayback = ref(false);
const userPaused = ref(false);
const wasStateRestored = ref(false);

// Final overlay states
const showFinalOverlay = ref(false);
const finalOverlayState = ref("hidden");

// Hover states for controls
const isHovering = ref(false);
const muteHovered = ref(false);
const playHovered = ref(false);
const restartHovered = ref(false);
const finalRestartHovered = ref(false);
const fullscreenHovered = ref(false);
const linkHovered = ref(false);
const isFullscreen = ref(false);

// Playback attempt tracking
let playAttempts = 0;
let playTimeout = null;
let finalCleanupTimeout = null;

// Detect mobile for muted by default
const shouldBeMutedByDefault = computed(() => {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
});

// ============================================================
// SessionStorage for video state management
// ============================================================

const getStorageKey = () => `video-state-${props.videoSrc}`;

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

    // Check if state is recent (within 5 minutes)
    const isRecent = Date.now() - state.timestamp < 5 * 60 * 1000;
    if (!isRecent) {
      clearVideoState();
      return false;
    }

    // Restore video state
    video.currentTime = state.currentTime || 0;
    isMuted.value = state.isMuted || false;
    video.muted = isMuted.value;
    hasStartedPlayback.value = state.hasStartedPlayback || false;
    showFinalOverlay.value = state.showFinalOverlay || false;

    if (showFinalOverlay.value) {
      finalOverlayState.value = "visible";
    } else if (hasStartedPlayback.value) {
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
    console.error("Failed to restore video state:", error);
    clearVideoState();
    return false;
  }
}

function isComingFromStory() {
  return sessionStorage.getItem(getStorageKey()) !== null;
}

// ============================================================
// Global user interaction tracking (sessionStorage)
// ============================================================

function getUserHasInteracted() {
  return sessionStorage.getItem('user-has-interacted') === 'true';
}

function setUserHasInteracted() {
  sessionStorage.setItem('user-has-interacted', 'true');
}

// ============================================================
// Video element getter helper
// ============================================================

function getVideoElement() {
  return videoElement.value;
}

// ============================================================
// Schedule play with timeout
// ============================================================

function schedulePlay(delay = 300) {
  if (playTimeout) {
    clearTimeout(playTimeout);
  }
  playTimeout = setTimeout(() => {
    attemptPlay();
  }, delay);
}

// ============================================================
// Main autoplay function with retry logic
// ============================================================

function attemptPlay() {
  const video = getVideoElement();
  const userHasInteracted = getUserHasInteracted();

  if (!video) return;

  // Don't attempt if already playing
  if (!video.paused && hasStartedPlayback.value) {
    return;
  }

  // Limit attempts to 3 times
  playAttempts++;
  if (playAttempts > 3) {
    video.muted = true;
    isMuted.value = true;
  }

  // If user has NOT interacted - try muted autoplay
  const shouldTryMuted = !userHasInteracted && !shouldBeMutedByDefault.value;
  video.muted = shouldTryMuted ? true : (shouldBeMutedByDefault.value || isMuted.value);
  video.playsInline = true;

  video
    .play()
    .then(() => {
      playAttempts = 0; // Reset on success
      hasStartedPlayback.value = true;
      isPlaying.value = true;

      // If started muted due to no interaction
      if (shouldTryMuted) {
        isMuted.value = true;

        // Try to unmute if user has NOW interacted
        if (getUserHasInteracted()) {
          video.muted = false;
          isMuted.value = false;
        }
      }
    })
    .catch((error) => {
      console.warn("[Case1ScrollLayout] Autoplay error:", error);

      // If autoplay with sound blocked - show play button
      if (userHasInteracted && !video.muted) {
        hasStartedPlayback.value = true;
        playAttempts = 0;
      } else if (!hasStartedPlayback.value && playAttempts <= 3) {
        schedulePlay(300); // Retry after 300ms
      }
    });
}

// ============================================================
// Animation variants for controls and overlays
// ============================================================

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const overlayTransition = {
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

// ============================================================
// Video control functions
// ============================================================

function clearFinalTimers() {
  if (finalCleanupTimeout) {
    clearTimeout(finalCleanupTimeout);
    finalCleanupTimeout = null;
  }
}

function handleTimeUpdate(event) {
  // Show overlay at 39.5 seconds
  if (!showFinalOverlay.value) {
    const video = event.target;
    if (video.currentTime >= 39.5) {
      showFinalOverlay.value = true;
      finalOverlayState.value = "visible";
      // Don't hide video, don't pause - let it keep playing with audio
    }
  }
}

function handleVideoEnded() {
  // Video ended - final overlay should already be visible
  if (!showFinalOverlay.value) {
    showFinalOverlay.value = true;
    finalOverlayState.value = "visible";
  }
  isPlaying.value = false;
}

function handleVideoClick(event) {
  console.log('[handleVideoClick]', event.target);

  // Don't toggle if clicking on control buttons
  if (event.target.closest('.case-video-controls')) {
    console.log('[handleVideoClick] Ignoring - clicked on controls');
    return;
  }

  console.log('[handleVideoClick] Toggling play/pause');
  togglePlayPause();
}

function togglePlayPause() {
  const video = getVideoElement();
  console.log('[togglePlayPause]', {
    hasVideo: !!video,
    paused: video?.paused,
    isPlaying: isPlaying.value
  });

  if (!video) return;

  if (video.paused) {
    // User is resuming playback
    console.log('[togglePlayPause] Resuming playback');
    userPaused.value = false;
    setUserHasInteracted();

    // Always unmute on user click (desktop only)
    if (!shouldBeMutedByDefault.value) {
      video.muted = false;
      isMuted.value = false;
    } else {
      // On mobile, keep muted
      video.muted = true;
      isMuted.value = true;
    }

    video.play().then(() => {
      isPlaying.value = true;
      hasStartedPlayback.value = true;
      console.log('[togglePlayPause] Playing');
    });
  } else {
    // User is manually pausing
    console.log('[togglePlayPause] Pausing');
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
    // Enter fullscreen
    const container = video.parentElement?.parentElement?.parentElement?.parentElement;
    if (container && container.requestFullscreen) {
      container
        .requestFullscreen()
        .then(() => {
          isFullscreen.value = true;
        })
        .catch((err) => {
          console.error("Failed to enter fullscreen:", err);
        });
    } else if (video.webkitRequestFullscreen) {
      // Safari fallback
      video
        .webkitRequestFullscreen()
        .then(() => {
          isFullscreen.value = true;
        })
        .catch((err) => {
          console.error("Failed to enter fullscreen:", err);
        });
    }
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        isFullscreen.value = false;
      });
    } else if (document.webkitExitFullscreen) {
      // Safari fallback
      document.webkitExitFullscreen();
      isFullscreen.value = false;
    }
  }
}

function restartVideo() {
  const video = getVideoElement();
  if (!video) return;

  video.currentTime = 0;

  // Clear saved state when restarting
  clearVideoState();
  wasStateRestored.value = false;
  userPaused.value = false;

  video.play().then(() => {
    isPlaying.value = true;
  });
}

function replayVideo() {
  const video = getVideoElement();
  if (!video) return;

  clearFinalTimers();
  finalOverlayState.value = "hidden";
  finalCleanupTimeout = setTimeout(() => {
    showFinalOverlay.value = false;
  }, 500);

  video.currentTime = 0;

  // Clear saved state when replaying
  clearVideoState();
  wasStateRestored.value = false;
  userPaused.value = false;

  video
    .play()
    .then(() => {
      hasStartedPlayback.value = true;
      isPlaying.value = true;
    })
    .catch(() => {
      // If playback fails, restore final overlay
      clearFinalTimers();
      showFinalOverlay.value = true;
      finalOverlayState.value = "visible";
    });
}

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement;
}

// useScroll отслеживает скролл контейнера
// offset: ["start end", "end start"] означает:
// progress = 0 когда начало секции появляется внизу экрана
// progress = 1 когда конец секции уходит вверх экрана
const { scrollYProgress } = useScroll({
  target: containerRef,
  container: scrollContainerRef,
  offset: ["start end", "end start"],
});

// Трансформируем прогресс скролла в значения для анимации
// scrollYProgress от 0 (секция внизу экрана) до 1 (секция ушла вверх)

// Разбиваем title на слова
const titleWords = computed(() => props.title.split(" "));

// Общая анимация для subtitle (появляется после title)
const subtitleOpacity = useTransform(scrollYProgress, [0.32, 0.37], [0, 1]);

// Создаем opacity для каждого слова
const appearStart = 0.25;
const appearEnd = 0.35;

const wordOpacities = computed(() => {
  const words = titleWords.value;
  const totalWords = words.length;

  return words.map((_, wordIndex) => {
    const wordAppearDuration = (appearEnd - appearStart) / totalWords;
    const wordStart = appearStart + wordIndex * wordAppearDuration;
    const wordEnd = wordStart + wordAppearDuration;

    return useTransform(scrollYProgress, [wordStart, wordEnd], [0, 1]);
  });
});

// Функция для получения opacity слова по индексу
const getWordOpacity = (wordIndex) => {
  return wordOpacities.value[wordIndex];
};

// Видео wrapper появляется после слова "Apple" (subtitle)
// Subtitle появляется на 0.32-0.37, видео появляется сразу после с такой же задержкой
const videoOpacity = useTransform(scrollYProgress, [0.37, 0.42], [0, 1]);

// Видео увеличивается по триггеру при scrollYProgress >= 0.45
// Inverse scale: start at 0.125 (small), scale up to 1 (large)
const videoExpanded = ref(false);
const videoScaleValue = ref(0.125); // Start small (1/8)
const videoYValue = ref(0);

// watchEffect для отслеживания scrollYProgress через onChange
onMounted(() => {
  // Подписываемся на изменения scrollYProgress
  const unsubscribe = scrollYProgress.on?.('change', (progress) => {
    const shouldExpand = progress >= 0.45;

    if (shouldExpand !== videoExpanded.value) {
      videoExpanded.value = shouldExpand;
      videoScaleValue.value = shouldExpand ? 1 : 0.125; // Expand to scale(1)
      // Adjusted value to properly center when expanded
      videoYValue.value = shouldExpand ? -12 : 0;

      // ============================================================
      // Autoplay when video expands, pause when shrinks
      // ============================================================
      const video = getVideoElement();
      if (video) {
        if (shouldExpand) {
          // Video is expanding - attempt autoplay
          setTimeout(() => {
            attemptPlay();
          }, 300); // 300ms delay for smooth transition
        } else {
          // Video is shrinking - auto-pause (not user-initiated)
          if (!video.paused) {
            video.pause();
            isPlaying.value = false;
            // Don't set userPaused - this is auto-pause
          }
        }
      }
    }
  });

  // Очистка при unmount
  onUnmounted(() => {
    if (unsubscribe) unsubscribe();
  });
});

// Показываем текст всегда, когда секция в viewport
const showText = ref(true);

// ============================================================
// User interaction listeners for unmuting
// ============================================================

function handleUserInteraction() {
  if (getUserHasInteracted()) return; // Already handled

  // Mark interaction
  setUserHasInteracted();

  // If video is playing muted - try to unmute
  const video = getVideoElement();
  if (video && !video.paused && hasStartedPlayback.value && isMuted.value && !shouldBeMutedByDefault.value) {
    video.muted = false;
    isMuted.value = false;
  }

  // Remove listeners after first interaction
  removeInteractionListeners();
}

function removeInteractionListeners() {
  document.removeEventListener("click", handleUserInteraction);
  document.removeEventListener("touchstart", handleUserInteraction);
  document.removeEventListener("keydown", handleUserInteraction);
}

function handleEnter() {
  // Called when section enters viewport
  const video = getVideoElement();

  if (!video) return;

  // Don't autoplay if state was restored
  if (wasStateRestored.value) {
    wasStateRestored.value = false;
    return;
  }

  // Note: Autoplay only happens when video expands (scrollYProgress >= 0.45)
  // This function just prepares the video element
}

function handleLeave() {
  // Called when section leaves viewport
  const video = getVideoElement();

  if (playTimeout) {
    clearTimeout(playTimeout);
    playTimeout = null;
  }

  // Reset attempt counter
  playAttempts = 0;

  // Auto-pause when leaving (NOT user-initiated)
  if (video && typeof video.pause === "function" && !video.paused) {
    video.pause();
    isPlaying.value = false;
    // Don't set userPaused - this is auto-pause
  }
}

function handleStoryLinkClick() {
  // Called before navigation to story page - save state
  if (hasStartedPlayback.value) {
    saveVideoState();
  }
}

let observer = null;

onMounted(() => {
  // Try to restore state only if coming from story page
  const video = getVideoElement();
  if (video && isComingFromStory()) {
    // Wait for video metadata to be loaded
    video.addEventListener(
      "loadedmetadata",
      () => {
        restoreVideoState();
      },
      { once: true }
    );

    // If metadata is already loaded
    if (video.readyState >= 1) {
      restoreVideoState();
    }
  }

  // Найти скролл-контейнер от vue-scroll-snap
  const scrollContainer = document.querySelector(".scroll-snap-container");
  if (scrollContainer) {
    scrollContainerRef.value = scrollContainer;
  }

  // IntersectionObserver для определения видимости секции
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        showText.value = entry.isIntersecting;

        if (entry.isIntersecting) {
          handleEnter();
        } else {
          handleLeave();
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  if (containerRef.value) {
    observer.observe(containerRef.value);
  }

  // ============================================================
  // Add user interaction listeners
  // ============================================================
  document.addEventListener("click", handleUserInteraction);
  document.addEventListener("touchstart", handleUserInteraction, { passive: true });
  document.addEventListener("keydown", handleUserInteraction);

  // ============================================================
  // Listen for fullscreen changes
  // ============================================================
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
});

onUnmounted(() => {
  if (observer && containerRef.value) {
    observer.unobserve(containerRef.value);
  }
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // Clean up interaction listeners
  removeInteractionListeners();

  // Clean up play timeout
  if (playTimeout) {
    clearTimeout(playTimeout);
    playTimeout = null;
  }

  // Clean up final timers
  clearFinalTimers();

  // Remove fullscreen listeners
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);

  // Pause video if playing
  const video = getVideoElement();
  if (video && typeof video.pause === "function" && !video.paused) {
    video.pause();
  }
});

defineExpose({
  handleEnter,
  handleLeave,
  handleStoryLinkClick,
});
</script>

<style scoped>
.case1-scroll-layout {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  /* overflow: hidden убран - блокирует sticky */
}

/* Spacer - половина экрана */
.initial-spacer {
  height: 50vh;
  width: 100%;
}

/* Text frame sticky - прибито к центру экрана */
.text-frame-sticky {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  pointer-events: none;
}

.text-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  padding: 0 5vw;
  max-width: 1400px;
}

.case-title {
  margin: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 63px;
  line-height: 1.2;
  color: #000000;
  width: 100%;
}

.case-title .word {
  display: inline-block;
  margin-right: 0.25em;
}

.case-subtitle {
  margin: 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 400;
  font-size: 48px;
  line-height: 1.3;
  color: #000000;
  width: 100%;
}

.case-subtitle span {
  opacity: 1;
}

/* Final spacer - для скrolла */
.final-spacer {
  height: 150vh;
  width: 100%;
}

/* Constraint wrapper - maintains layout space */
.video-constraint-wrapper {
  width: 16.67%; /* Visual space in layout */
  max-width: calc(1662px / 6);
  margin-top: 24px;
  position: relative;
  /* Height matches the aspect ratio at small scale */
  aspect-ratio: 1662 / 1080;
  overflow: visible;
  /* This container defines the layout space */
}

.video-container-wrapper {
  /* Inverse scale approach: start large, scale down, then scale up to 1 */
  width: 800%; /* 133.33% relative to constraint wrapper = 16.67% of text-content */
  max-width: 1662px; /* Full width at scale(1) */
  pointer-events: none;
  transform-origin: center center;
  transition: transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: transform;
  backface-visibility: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  /* Base transform is set via inline style to include reactive values */
}

.video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1662 / 1080;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible; /* Changed from hidden to visible for controls */
  box-sizing: border-box;
  background: #000000;
  /* Larger radius at scale(0.125) = 80px × 0.125 = 10px visual */
  border-radius: 80px;
  /* Use padding instead of border for proper inner radius */
  padding: 10px;
  transition: border-radius 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.video-wrapper.video-playing {
  background: transparent;
  /* Keep black background/frame when playing */
  background: #000000;
  /* Smaller radius at scale(1) for expanded state */
  border-radius: 10px;
}

.play-icon {
  width: 800px; /* 100px × 8 to compensate for scale(0.125) */
  height: 800px;
  opacity: 1;
  transition: opacity 0.3s ease-out;
  position: absolute;
  z-index: 2;
}

.play-icon.play-icon-hidden {
  opacity: 0;
}

.case-video {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  object-fit: cover;
  opacity: 0;
  border-radius: 70px; /* Inner radius matches outer - padding (80px - 10px) */
  transition: opacity 0.4s ease-in, border-radius 0.6s cubic-bezier(0.22, 0.61, 0.36, 1), filter 0.3s ease;
  transition-delay: 0.2s;
  z-index: 1;
  cursor: pointer;
}

.case-video.video-visible {
  opacity: 1;
  border-radius: 3px; /* Smaller radius when video is visible/expanded */
}

.case-video.video-paused-blur {
  filter: blur(10px);
}

.video-wrapper.video-paused-blur {
  /* No additional blur on wrapper to avoid double blur */
}

.case-open-story {
  align-self: flex-end;
  margin: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: 21px;
  line-height: var(--line-height-snug);
  text-align: right;
  text-decoration: none;
  color: #000000;
  transition: opacity 0.2s ease;
}

.case-open-story:hover {
  opacity: 0.7;
}

/* ============================================================ */
/* Pause Overlay */
/* ============================================================ */

.case-video-pause-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  pointer-events: auto;
  isolation: isolate;
  border-radius: 3px;
}

.pause-overlay-clickable {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  border-radius: 10px;
}

.pause-play-icon {
  position: relative;
  z-index: 101;
  width: 140px;
  height: 140px;
  color: #000000;
  cursor: pointer;
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.1));
  transition: opacity 0.2s ease;
  will-change: transform;
  transform: translateZ(0);
}

.pause-play-icon:hover {
  opacity: 0.8;
}

/* ============================================================ */
/* Video Controls Bar */
/* ============================================================ */

.case-video-controls {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
  padding: 16px 20px;
  background: transparent;
  z-index: 50;
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
  /* Default diamond state */
  transform: rotate(45deg);
  background-color: rgba(0, 0, 0, 0.25);
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
  /* Counter-rotate to keep icon straight when button is diamond */
  transform: rotate(-45deg);
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

/* ============================================================ */
/* Final Overlay */
/* ============================================================ */

.case-video-final {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: clamp(16px, 3vw, 32px);
  gap: clamp(12px, 2vw, 20px);
  z-index: 200;
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
  pointer-events: auto;
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
  gap: 15px;
  padding: 16px 20px;
  z-index: 201;
}

.control-button-final {
  /* Same styling as regular control buttons */
}

/* Mobile Responsive */
@media (max-width: 899px) {
  .case-title {
    font-size: 32px;
  }

  .case-subtitle {
    font-size: 24px;
  }

  .video-wrapper {
    background: transparent;
    border-radius: 0;
    padding: 0;
  }

  .case-open-story {
    display: none;
  }
}

@media (max-width: 600px) {
  .case-title {
    font-size: 24px;
  }

  .case-subtitle {
    font-size: 18px;
  }
}
</style>
