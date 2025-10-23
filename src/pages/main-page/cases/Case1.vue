<template>
  <section
    id="case1"
    class="case-section item"
    style="background-color: #ffffff"
  >
    <div
      class="case1-scroll-layout"
      ref="containerRef"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
    <!-- Text frame - normal scroll flow -->
    <div ref="contentWrapperRef" class="text-frame-wrapper">
      <div class="text-content">
        <div class="text-only" :style="{ opacity: textOpacity }">
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
        </div>
        <!-- Video под текстом -->
        <!-- Constraint wrapper to maintain layout -->
        <div class="video-constraint-wrapper">
          <motion.div
            class="video-container-wrapper"
            :style="{
              opacity: videoOpacity,
              transform: `translate(-50%, -50%) translateY(${videoYValue}%) scale(${videoScaleValue})`,
            }"
          >
            <div class="video-and-link-wrapper">
              <div
                class="video-wrapper"
                :class="{
                  'video-playing': videoExpanded,
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
                    fill="black"
                    stroke="black"
                    stroke-width="2"
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
                    'video-paused-blur': !isPlaying && hasStartedPlayback,
                  }"
                  :muted="shouldBeMutedByDefault || isMuted"
                  playsinline
                  @ended="handleVideoEnded"
                  @timeupdate="handleTimeUpdate"
                ></video>
                <!-- Pause Overlay (inside video wrapper) -->
                <motion.div
                  v-if="!isPlaying && hasStartedPlayback && videoExpanded"
                  class="case-video-pause-overlay"
                  :class="{ 'is-playing': isPlaying }"
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: 1 }"
                  :exit="{ opacity: 0 }"
                  :transition="{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }"
                >
                  <!-- Large black play icon (clickable) -->
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

                <!-- Video Controls Bar (inside video wrapper) -->
                <div
                  v-if="hasStartedPlayback && videoExpanded"
                  class="case-video-controls"
                >
                  <!-- Mute/Unmute button -->
                  <motion.button
                    class="control-button"
                    type="button"
                    @click.stop="toggleMute"
                    @mouseenter="muteHovered = true"
                    @mouseleave="muteHovered = false"
                    :initial="'default'"
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

                  <!-- Play/Pause button -->
                  <motion.button
                    class="control-button"
                    type="button"
                    @click.stop="togglePlayPause"
                    @mouseenter="playHovered = true"
                    @mouseleave="playHovered = false"
                    :initial="'default'"
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

                  <!-- Restart button -->
                  <motion.button
                    class="control-button"
                    type="button"
                    @click.stop="restartVideo"
                    @mouseenter="restartHovered = true"
                    @mouseleave="restartHovered = false"
                    :initial="'default'"
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

                  <!-- Fullscreen button (mobile only) -->
                  <motion.button
                    v-if="isSmallScreen"
                    class="control-button"
                    type="button"
                    @click.stop="toggleFullscreen"
                    @mouseenter="fullscreenHovered = true"
                    @mouseleave="fullscreenHovered = false"
                    :initial="'default'"
                    :animate="fullscreenHovered ? 'hover' : 'default'"
                    :variants="buttonVariants"
                    :transition="buttonTransition"
                    :aria-label="
                      isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'
                    "
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
                </div>
              </div>
              <!-- Open Story Link (inside video-and-link-wrapper, after video-wrapper) -->
              <motion.a
                :href="routeTo"
                class="case-open-story-link"
                :initial="{ opacity: 0 }"
                :animate="{ opacity: showStoryLink && videoExpanded ? 1 : 0 }"
                :transition="{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }"
                :style="{
                  pointerEvents:
                    showStoryLink && videoExpanded ? 'auto' : 'none',
                }"
                @click.prevent="handleStoryLinkClick"
              >
                Open Story
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { motion, useScroll, useTransform } from "motion-v";
import { useMediaQuery } from "@/composables/useMediaQuery.js";
import { useRoute } from "vue-router";

// Case 1 Data - Apple
const title = "Cross-Domain AI Solution for Account Reconcilers";
const company = "Apple";
const videoSrc = new URL("@/assets/case-videos/case1.mp4", import.meta.url).href;
const routeTo = "/story/one";
const primaryColor = "#319BF8";
const backgroundColor = "#ffffff";
const finalOverlayTime = 39.5;

const containerRef = ref(null);
const contentWrapperRef = ref(null);
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
const showStoryLink = ref(false);

// Hover states for controls
const isHovering = ref(false);
const muteHovered = ref(false);
const playHovered = ref(false);
const restartHovered = ref(false);
const fullscreenHovered = ref(false);
const isFullscreen = ref(false);

// Playback attempt tracking
let playAttempts = 0;
let storyLinkTimeout = null;

// Detect mobile for muted by default
const shouldBeMutedByDefault = computed(() => {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
});

// ============================================================
// SessionStorage for video state management
// ============================================================

const getStorageKey = () => `video-state-${videoSrc}`;

function saveVideoState() {
  const video = getVideoElement();
  if (!video) return;

  const state = {
    currentTime: video.currentTime,
    isPlaying: isPlaying.value,
    isMuted: isMuted.value,
    hasStartedPlayback: hasStartedPlayback.value,
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

    if (hasStartedPlayback.value) {
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
  return sessionStorage.getItem("user-has-interacted") === "true";
}

function setUserHasInteracted() {
  sessionStorage.setItem("user-has-interacted", "true");
}

// ============================================================
// Video element getter helper
// ============================================================

function getVideoElement() {
  return videoElement.value;
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

  // If user has NOT interacted OR on mobile - show play button (pause state)
  if (!userHasInteracted || shouldBeMutedByDefault.value) {
    hasStartedPlayback.value = true;
    isPlaying.value = false;
    return;
  }

  // User has interacted - try to play with sound
  video.muted = false;
  isMuted.value = false;
  video.playsInline = true;

  video
    .play()
    .then(() => {
      playAttempts = 0; // Reset on success
      hasStartedPlayback.value = true;
      isPlaying.value = true;
    })
    .catch((error) => {
      console.warn("[Case1ScrollLayout] Autoplay error:", error);
      // If autoplay fails - show play button (pause state)
      hasStartedPlayback.value = true;
      isPlaying.value = false;
      playAttempts = 0;
    });
}

// ============================================================
// Animation variants for controls
// ============================================================

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

// ============================================================
// Video control functions
// ============================================================

function handleTimeUpdate() {
  // No special handling needed - video plays to the end
}

function handleVideoEnded() {
  // Video ended - just stop playing
  isPlaying.value = false;
}

function togglePlayPause() {
  const video = getVideoElement();
  console.log("[togglePlayPause]", {
    hasVideo: !!video,
    paused: video?.paused,
    isPlaying: isPlaying.value,
  });

  if (!video) return;

  if (video.paused) {
    // User is resuming playback
    console.log("[togglePlayPause] Resuming playback");
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
      console.log("[togglePlayPause] Playing");
    });
  } else {
    // User is manually pausing
    console.log("[togglePlayPause] Pausing");
    userPaused.value = true;
    video.pause();
    isPlaying.value = false;
  }
}

function toggleMute() {
  console.log("[toggleMute] Button clicked");
  const video = getVideoElement();
  if (!video) return;

  isMuted.value = !isMuted.value;
  video.muted = isMuted.value;
  console.log("[toggleMute] Muted:", isMuted.value);
}

function toggleFullscreen() {
  console.log("[toggleFullscreen] Button clicked");
  const video = getVideoElement();
  if (!video) return;

  if (!document.fullscreenElement) {
    // Enter fullscreen
    const container =
      video.parentElement?.parentElement?.parentElement?.parentElement;
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
  console.log("[restartVideo] Button clicked");
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

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement;
}

// useScroll отслеживает скролл контейнера
// offset: ["start end", "end end"] означает:
// progress = 0 когда начало секции доходит до конца viewport (низ экрана)
// progress = 1 когда конец секции доходит до низа экрана
const { scrollYProgress } = useScroll({
  target: containerRef,
  container: scrollContainerRef,
  offset: ["start end", "end end"],
});

// Трансформируем прогресс скролла в значения для анимации
// scrollYProgress от 0 (секция внизу экрана) до 1 (секция ушла вверх)

// Разбиваем title на слова
const titleWords = computed(() => title.split(" "));

// Общая анимация для subtitle (появляется после title)
const subtitleOpacity = useTransform(scrollYProgress, [0.70, 0.75], [0.2, 1]);

// Создаем opacity для каждого слова
const appearStart = 0.60;
const appearEnd = 0.70;

const wordOpacities = computed(() => {
  const words = titleWords.value;
  const totalWords = words.length;

  return words.map((_, wordIndex) => {
    const wordAppearDuration = (appearEnd - appearStart) / totalWords;
    const wordStart = appearStart + wordIndex * wordAppearDuration;
    const wordEnd = wordStart + wordAppearDuration;

    return useTransform(scrollYProgress, [wordStart, wordEnd], [0.2, 1]);
  });
});

// Функция для получения opacity слова по индексу
const getWordOpacity = (wordIndex) => {
  return wordOpacities.value[wordIndex];
};

// Видео wrapper появляется после слова "Apple" (subtitle)
// Subtitle появляется на 0.70-0.75, видео появляется сразу после с такой же задержкой
const videoOpacity = useTransform(scrollYProgress, [0.75, 0.80], [0.2, 1]);

// Видео увеличивается по триггеру при scrollYProgress >= 0.80
// Inverse scale: start at 0.1875 (small), scale up to 1 (large)
const videoExpanded = ref(false);
const videoScaleValue = ref(0.1875); // Start small (1/8 × 1.5 = 0.1875)
const videoYValue = ref(0);

// Slow scroll effect when video is pinned
const slowScrollY = ref(0);

// Text opacity during video expansion
const textOpacity = ref(1);

// Store unsubscribe function for cleanup
let scrollUnsubscribe = null;

// watchEffect для отслеживания scrollYProgress через onChange
onMounted(() => {
  // Подписываемся на изменения scrollYProgress
  scrollUnsubscribe = scrollYProgress.on?.("change", (progress) => {
    // Dynamic parallax: gradually increase scroll speed from slow to normal
    // Element stays fixed throughout, just moves with increasing speed

    // Text opacity animation
    if (progress < 0.80) {
      textOpacity.value = 1; // Text fully visible
    } else if (progress < 0.90) {
      // Fade out text as video expands (0.80 to 0.90) - faster animation
      const fadeProgress = (progress - 0.80) / (0.90 - 0.80);
      textOpacity.value = 1 - fadeProgress;
    } else {
      textOpacity.value = 0;
    }

    // No parallax effect - text scrolls naturally with page

    // Log scroll position for debugging
    const wrapperRect = contentWrapperRef.value?.getBoundingClientRect();
    const containerRect = containerRef.value?.getBoundingClientRect();

    console.log("[Case1 Scroll]", {
      progress: progress.toFixed(3),
      slowScrollY: slowScrollY.value.toFixed(2),
      wrapperTop: wrapperRect ? wrapperRect.top.toFixed(0) : "N/A",
      containerTop: containerRect ? containerRect.top.toFixed(0) : "N/A",
      videoExpanded: videoExpanded.value,
    });

    const shouldExpand = progress >= 0.80;

    if (shouldExpand !== videoExpanded.value) {
      console.log("[DEBUG] 🎬 Video expand state changing:", {
        from: videoExpanded.value,
        to: shouldExpand,
        scrollProgress: progress,
      });

      videoExpanded.value = shouldExpand;
      videoScaleValue.value = shouldExpand ? 1 : 0.1875; // Expand to scale(1)
      // Move video down when expanded for better positioning
      videoYValue.value = shouldExpand ? 10 : 0;

      // Show story link 800ms after video expands (only if not already shown/scheduled)
      if (shouldExpand) {
        // Only set new timeout if link is not already visible and no timeout is pending
        if (!showStoryLink.value && !storyLinkTimeout) {
          console.log("[DEBUG] 🔗 Setting timeout to show story link in 800ms");
          storyLinkTimeout = setTimeout(() => {
            console.log("[DEBUG] 🔗 Showing story link now");
            showStoryLink.value = true;
            storyLinkTimeout = null;
          }, 800);
        }
      } else {
        // Clear timeout and hide link when video shrinks
        console.log("[DEBUG] 🔗 Video shrinking, hiding story link");
        if (storyLinkTimeout) {
          clearTimeout(storyLinkTimeout);
          storyLinkTimeout = null;
        }
        showStoryLink.value = false;
      }

      // Log computed styles after state change
      setTimeout(() => {
        const videoContainerWrapper = containerRef.value?.querySelector(
          ".video-container-wrapper"
        );
        const videoWrapper =
          containerRef.value?.querySelector(".video-wrapper");

        console.log("[DEBUG] 🎨 Styles after expand state change:", {
          videoExpanded: videoExpanded.value,
          videoContainerWrapper: videoContainerWrapper
            ? {
                pointerEvents: window.getComputedStyle(videoContainerWrapper)
                  .pointerEvents,
                transform: window.getComputedStyle(videoContainerWrapper)
                  .transform,
                position: window.getComputedStyle(videoContainerWrapper)
                  .position,
                zIndex: window.getComputedStyle(videoContainerWrapper).zIndex,
              }
            : "NOT FOUND",
          videoWrapper: videoWrapper
            ? {
                pointerEvents:
                  window.getComputedStyle(videoWrapper).pointerEvents,
                cursor: window.getComputedStyle(videoWrapper).cursor,
                position: window.getComputedStyle(videoWrapper).position,
                zIndex: window.getComputedStyle(videoWrapper).zIndex,
              }
            : "NOT FOUND",
        });
      }, 50);

      // ============================================================
      // Autoplay when video expands, pause when shrinks
      // ============================================================
      const video = getVideoElement();
      if (video) {
        if (shouldExpand) {
          // Video is expanding - attempt autoplay
          attemptPlay();
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
  if (
    video &&
    !video.paused &&
    hasStartedPlayback.value &&
    isMuted.value &&
    !shouldBeMutedByDefault.value
  ) {
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

  // Note: Autoplay only happens when video expands (scrollYProgress >= 0.80)
  // This function just prepares the video element
}

function handleLeave() {
  // Called when section leaves viewport
  const video = getVideoElement();

  // Reset attempt counter
  playAttempts = 0;

  // Auto-pause when leaving (NOT user-initiated)
  if (video && typeof video.pause === "function" && !video.paused) {
    video.pause();
    isPlaying.value = false;
    // Don't set userPaused - this is auto-pause
  }
}

function handleStoryLinkClick(event) {
  // Called before navigation to story page - save state
  if (hasStartedPlayback.value) {
    saveVideoState();
  }
  // Navigate to the route
  if (event && event.currentTarget && event.currentTarget.href) {
    window.location.href = event.currentTarget.href;
  }
}

let observer = null;

onMounted(() => {
  // Clear video state if not coming from story page
  const route = useRoute();
  const cameFromStory = route.meta?.skipNavIntro;
  if (!cameFromStory) {
    const videoStateKey = 'video-state-' + videoSrc;
    sessionStorage.removeItem(videoStateKey);
  }

  // DEBUG: Log document structure on mount
  console.log("[DEBUG] 📋 Component mounted. Checking document structure...");
  setTimeout(() => {
    const container = containerRef.value;
    if (container) {
      const textFrame = container.querySelector(".text-frame-wrapper");
      const videoContainerWrapper = container.querySelector(
        ".video-container-wrapper"
      );
      const videoWrapper = container.querySelector(".video-wrapper");
      const video = container.querySelector(".case-video");

      console.log("[DEBUG] 📊 Element structure:", {
        container: {
          exists: !!container,
          pointerEvents: window.getComputedStyle(container).pointerEvents,
          position: window.getComputedStyle(container).position,
          zIndex: window.getComputedStyle(container).zIndex,
        },
        textFrame: {
          exists: !!textFrame,
          pointerEvents: textFrame
            ? window.getComputedStyle(textFrame).pointerEvents
            : "N/A",
          position: textFrame
            ? window.getComputedStyle(textFrame).position
            : "N/A",
          zIndex: textFrame ? window.getComputedStyle(textFrame).zIndex : "N/A",
        },
        videoContainerWrapper: {
          exists: !!videoContainerWrapper,
          pointerEvents: videoContainerWrapper
            ? window.getComputedStyle(videoContainerWrapper).pointerEvents
            : "N/A",
          position: videoContainerWrapper
            ? window.getComputedStyle(videoContainerWrapper).position
            : "N/A",
          zIndex: videoContainerWrapper
            ? window.getComputedStyle(videoContainerWrapper).zIndex
            : "N/A",
        },
        videoWrapper: {
          exists: !!videoWrapper,
          pointerEvents: videoWrapper
            ? window.getComputedStyle(videoWrapper).pointerEvents
            : "N/A",
          position: videoWrapper
            ? window.getComputedStyle(videoWrapper).position
            : "N/A",
          zIndex: videoWrapper
            ? window.getComputedStyle(videoWrapper).zIndex
            : "N/A",
        },
        video: {
          exists: !!video,
          pointerEvents: video
            ? window.getComputedStyle(video).pointerEvents
            : "N/A",
          position: video ? window.getComputedStyle(video).position : "N/A",
          zIndex: video ? window.getComputedStyle(video).zIndex : "N/A",
        },
      });
    }
  }, 500);

  // DEBUG: Wheel event listener to catch scroll events
  let lastScrollY = window.scrollY;
  let wheelEventCount = 0;

  document.addEventListener(
    "wheel",
    (e) => {
      wheelEventCount++;
      const path = e.composedPath ? e.composedPath() : e.path || [];
      const videoWrapper = path.find(
        (el) =>
          el.className &&
          el.className.includes &&
          el.className.includes("video-container-wrapper")
      );
      if (videoWrapper) {
        console.log(
          `[DEBUG] 🔍 Wheel over video-container-wrapper detected! (Event #${wheelEventCount})`
        );

        // Get the element directly under cursor
        const elementUnderCursor = document.elementFromPoint(
          e.clientX,
          e.clientY
        );
        if (elementUnderCursor) {
          console.log("[DEBUG] 🎯 Element directly under cursor:", {
            tag: elementUnderCursor.tagName,
            classes: elementUnderCursor.className,
            pointerEvents:
              window.getComputedStyle(elementUnderCursor).pointerEvents,
            zIndex: window.getComputedStyle(elementUnderCursor).zIndex,
            position: window.getComputedStyle(elementUnderCursor).position,
          });
        }

        // Log ALL elements in path with their pointer-events
        const pathInfo = path
          .slice(0, 15)
          .map((el) => {
            if (!el.tagName) return null;
            const styles = window.getComputedStyle(el);
            return {
              tag: el.tagName,
              classes: el.className,
              pointerEvents: styles.pointerEvents,
              position: styles.position,
              zIndex: styles.zIndex,
              overflow: styles.overflow,
              width: styles.width,
              height: styles.height,
            };
          })
          .filter(Boolean);

        console.log("[DEBUG] Wheel event FULL PATH", {
          targetTag: e.target.tagName,
          targetClasses: e.target.className,
          deltaY: e.deltaY,
          deltaX: e.deltaX,
          defaultPrevented: e.defaultPrevented,
          cancelable: e.cancelable,
          bubbles: e.bubbles,
          eventPhase: e.eventPhase,
          currentScrollY: window.scrollY,
          documentScrollHeight: document.documentElement.scrollHeight,
          documentClientHeight: document.documentElement.clientHeight,
          canScrollMore:
            window.scrollY <
            document.documentElement.scrollHeight -
              document.documentElement.clientHeight,
          fullPath: pathInfo,
        });

        // Check if any element in path has pointer-events: none
        const blockedElements = pathInfo.filter(
          (el) => el.pointerEvents === "none"
        );
        if (blockedElements.length > 0) {
          console.log(
            "[DEBUG] ⚠️ Elements with pointer-events:none in path:",
            blockedElements.map((el) => ({
              tag: el.tag,
              classes: el.classes,
              position: el.position,
              zIndex: el.zIndex,
              width: el.width,
              height: el.height,
            }))
          );
        }

        // Find which specific element is blocking scroll
        const motionDivs = path.filter(
          (el) =>
            el.tagName === "DIV" &&
            el.hasAttribute &&
            (el.hasAttribute("data-motion-id") ||
              el.className.includes("motion"))
        );
        if (motionDivs.length > 0) {
          console.log(
            "[DEBUG] 🎭 Motion divs in path:",
            motionDivs.map((div) => ({
              tag: div.tagName,
              classes: div.className,
              hasDataMotionId: div.hasAttribute("data-motion-id"),
              pointerEvents: window.getComputedStyle(div).pointerEvents,
              position: window.getComputedStyle(div).position,
            }))
          );
        }

        // Check for elements that might be covering the scroll container
        const textFrameWrapper = path.find(
          (el) =>
            el.className &&
            el.className.includes &&
            el.className.includes("text-frame-wrapper")
        );
        if (textFrameWrapper) {
          const textFrameStyles = window.getComputedStyle(textFrameWrapper);
          console.log("[DEBUG] 📐 text-frame-wrapper in path:", {
            pointerEvents: textFrameStyles.pointerEvents,
            position: textFrameStyles.position,
            zIndex: textFrameStyles.zIndex,
            top: textFrameStyles.top,
            left: textFrameStyles.left,
            width: textFrameStyles.width,
            height: textFrameStyles.height,
          });
        }

        setTimeout(() => {
          const newScrollY = window.scrollY;
          const scrolled = newScrollY !== lastScrollY;
          const diff = newScrollY - lastScrollY;

          console.log("[DEBUG] Wheel over video - DID PAGE SCROLL?", {
            oldScrollY: lastScrollY,
            newScrollY: newScrollY,
            diff: diff,
            scrolled: scrolled,
          });

          if (!scrolled && Math.abs(e.deltaY) > 0) {
            console.log(
              "[DEBUG] ⚠️ SCROLL BLOCKED! Wheel event but page didn't scroll",
              {
                deltaY: e.deltaY,
                scrollY: newScrollY,
                reasonCheck: {
                  isEventPrevented: e.defaultPrevented,
                  hasPointerEventsNone: blockedElements.length > 0,
                  targetPointerEvents: window.getComputedStyle(e.target)
                    .pointerEvents,
                },
              }
            );
          }
          lastScrollY = newScrollY;
        }, 10);
      }
    },
    true
  );

  // DEBUG: Global click listener to catch ALL clicks
  document.addEventListener(
    "click",
    (e) => {
      const path = e.composedPath ? e.composedPath() : e.path || [];
      console.log("[DEBUG] Global click on document", {
        target: e.target,
        targetTagName: e.target.tagName,
        targetClasses: e.target.className,
        pointerEvents: window.getComputedStyle(e.target).pointerEvents,
        zIndex: window.getComputedStyle(e.target).zIndex,
        eventPath: path.slice(0, 10).map((el) => ({
          tag: el.tagName,
          classes: el.className,
          pointerEvents: el.style
            ? window.getComputedStyle(el).pointerEvents
            : "N/A",
        })),
      });
    },
    true
  ); // Capture phase - first

  // DEBUG: Add direct click listener to video element
  const video = getVideoElement();
  if (video) {
    video.addEventListener(
      "click",
      (e) => {
        console.log("[DEBUG] Direct click listener on <video>", {
          target: e.target,
          timestamp: Date.now(),
        });
      },
      true
    ); // Use capture phase
  }

  // Try to restore state only if coming from story page
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
  document.addEventListener("touchstart", handleUserInteraction, {
    passive: true,
  });
  document.addEventListener("keydown", handleUserInteraction);

  // ============================================================
  // Listen for fullscreen changes
  // ============================================================
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
});

onUnmounted(() => {
  // Clean up scroll listener
  if (scrollUnsubscribe) {
    scrollUnsubscribe();
    scrollUnsubscribe = null;
  }

  if (observer && containerRef.value) {
    observer.unobserve(containerRef.value);
  }
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // Clean up interaction listeners
  removeInteractionListeners();

  // Remove fullscreen listeners
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  document.removeEventListener(
    "webkitfullscreenchange",
    handleFullscreenChange
  );

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
  min-height: 100vh;
  background-color: #ffffff;
  /* overflow: hidden убран - блокирует sticky */
}

/* Text frame wrapper - normal scroll flow */
.text-frame-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 200;
  pointer-events: none;
  padding-top: 15vh;
  transform: translateY(0);
}

.text-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  text-align: center;
  padding: 0 5vw;
  max-width: 1400px;
}

.text-only {
  transition: opacity 0.3s ease-out;
}

.case-title {
  margin: 0;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: clamp(32px, 4.5vw, 63px);
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
  font-size: clamp(20px, 2.8vw, 38px);
  line-height: 1.3;
  color: #000000;
  width: 100%;
}

.case-subtitle span {
  opacity: 1;
}

/* Constraint wrapper - maintains layout space */
.video-constraint-wrapper {
  width: clamp(120px, 20vw, calc(1662px / 6)); /* More responsive width */
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
  max-width: min(
    1200px,
    85vw
  ); /* Adaptive max width: smaller on MacBooks, larger on big screens */
  pointer-events: none; /* Don't block scroll */
  transform-origin: center center;
  transition: transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: transform;
  backface-visibility: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  /* Base transform is set via inline style to include reactive values */
}

.video-and-link-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
}

.video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1662 / 1080;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* Clip blur edges to prevent bleeding onto border */
  box-sizing: border-box;
  background: #ffffff;
  border: 40px solid #000000;
  /* Outer radius 80px: at scale(0.1875) = 15px visual outer, inner = 80-40 = 40px → 7.5px visual */
  border-radius: 80px;
  /* Use padding instead of border for proper inner radius */
  padding: 0;
  isolation: isolate; /* Create stacking context to contain blur */
  pointer-events: none; /* Don't block scroll */
  transition: border-radius 0.6s cubic-bezier(0.22, 0.61, 0.36, 1),
    border-width 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.video-wrapper.video-playing {
  background: #ffffff;
  border-width: 10px;
  /* Outer radius 20px at scale(1), inner = 20-10 = 10px */
  border-radius: 20px;
}

.play-icon {
  width: 340px; /* Уменьшено еще больше для лучшей пропорции с маленьким видео */
  height: 340px;
  opacity: 1;
  transition: opacity 0.3s ease-out;
  position: absolute;
  z-index: 2;
}

.play-icon.play-icon-hidden {
  opacity: 0;
  pointer-events: none; /* Don't block clicks when hidden */
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
  border-radius: 40px; /* Inner radius matches container inner (80px - 40px = 40px) */
  transition: opacity 0.4s ease-in,
    border-radius 0.6s cubic-bezier(0.22, 0.61, 0.36, 1), filter 0.3s ease;
  z-index: 1;
  pointer-events: none; /* Don't block scroll */
}

.case-video.video-visible {
  opacity: 1;
  border-radius: 10px; /* Inner radius when expanded (20px - 10px = 10px) */
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

.case-open-story-link {
  display: block;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  font-size: clamp(20px, 2.2vw, 36px);
  line-height: 1.2;
  color: #000000;
  text-decoration: underline;
  text-align: center;
  transition: text-decoration 0.2s ease;
  cursor: pointer;
  white-space: nowrap;
}

.case-open-story-link:hover {
  text-decoration: none;
}

/* ============================================================ */
/* Pause Overlay */
/* ============================================================ */

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
  pointer-events: none; /* Don't block scroll - only icon is clickable */
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
  pointer-events: auto; /* Icon is clickable */
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
  bottom: 16px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
  background: transparent;
  z-index: 150;
  pointer-events: none; /* Container doesn't block, only buttons do */
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
  /* Transform and background controlled by motion variants */
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

/* Section wrapper styles from MainPage */
.case-section.item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  height: 100dvh;
}

/* Case1 needs extra height for scroll animation */
#case1.case-section.item {
  height: 200vh;
  min-height: 200vh;
  max-height: 200vh;
}
</style>
