<template>
  <MediaContainer
    type="fullheight"
    :background-color="backgroundColor"
    :has-background="true"
    :label="videoLabel"
    wrapper-class="chaptered-video-wrapper"
    container-class="chaptered-video"
  >
    <div class="video-container-inner" ref="videoContainerRef">
      <!-- Left sidebar with chapter navigation -->
      <nav class="chapters-nav" ref="navRef">
          <div
            v-for="(group, groupIndex) in chapterGroups"
            :key="groupIndex"
            class="chapter-group"
          >
            <h4 v-if="group.title" class="group-title">{{ group.title }}</h4>
            <ul class="chapters-list">
              <li
                v-for="(chapter, chapterIndex) in group.chapters"
                :key="`${groupIndex}-${chapterIndex}`"
                class="chapter-item"
              >
                <button
                  class="chapter-button"
                  :class="{ active: isChapterActive(groupIndex, chapterIndex) }"
                  @click="seekToChapter(groupIndex, chapterIndex)"
                  :aria-label="`Go to ${chapter.title}`"
                >
                  {{ chapter.title }}
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <!-- Video wrapper -->
        <div class="video-wrapper">
              <!-- Native video element -->
              <video
                ref="videoElement"
                :src="videoSrc"
                muted
                playsinline
                preload="auto"
                @timeupdate="handleTimeUpdate"
                @ended="handleVideoEnded"
                @click="handleTogglePlayPause"
                :class="{ 'video-paused-blur': !isPlaying && hasStartedPlayback }"
              />

              <!-- Pause overlay with play button -->
              <div v-if="!isPlaying && hasStartedPlayback" class="pause-overlay" @click="handleTogglePlayPause">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="40" fill="rgba(255, 255, 255, 0.9)" />
                  <path d="M32 25L55 40L32 55V25Z" fill="#000000" />
                </svg>
              </div>

              <!-- Control buttons -->
              <VideoControls
                v-if="hasStartedPlayback"
                :is-playing="isPlaying"
                :is-muted="true"
                :is-fullscreen="isFullscreen"
                :is-small-screen="isSmallScreen"
                :hide-mute="true"
                @toggle-play-pause="handleTogglePlayPause"
                @restart="handleRestartVideo"
                @toggle-fullscreen="toggleFullscreen"
              />
        </div>
    </div>
  </MediaContainer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import VideoControls from "./VideoControls.vue";
import { useChapteredVideo } from "@/composables/useChapteredVideo";
import { useMediaQuery } from "@/composables/useMediaQuery";
import MediaContainer from './MediaContainer.vue';

const props = defineProps({
  videoSrc: {
    type: String,
    required: true,
  },
  backgroundColor: {
    type: String,
    default: "#f5f5f7",
  },
  videoLabel: {
    type: String,
    default: "",
  },
  chapterGroups: {
    type: Array,
    required: true,
    validator: (groups) => {
      return groups.every((group) => {
        return (
          Array.isArray(group.chapters) &&
          group.chapters.every(
            (ch) => typeof ch.title === "string" && typeof ch.startTime === "number"
          )
        );
      });
    },
  },
});

const videoElement = ref(null);
const videoContainerRef = ref(null);
const navRef = ref(null);

const isSmallScreen = useMediaQuery("(max-width: 899px)");

const {
  isPlaying,
  hasStartedPlayback,
  isFullscreen,
  togglePlayPause,
  restartVideo,
  toggleFullscreen,
  pauseVideo,
  playVideo,
} = useChapteredVideo(videoElement);

// Current chapter tracking
const currentChapterIndex = ref({ groupIndex: 0, chapterIndex: 0 });

// Get all chapters flattened with their group info
const allChapters = computed(() => {
  const chapters = [];
  props.chapterGroups.forEach((group, groupIndex) => {
    group.chapters.forEach((chapter, chapterIndex) => {
      chapters.push({
        ...chapter,
        groupIndex,
        chapterIndex,
      });
    });
  });
  return chapters.sort((a, b) => a.startTime - b.startTime);
});

// Check if a specific chapter is active
const isChapterActive = (groupIndex, chapterIndex) => {
  return (
    currentChapterIndex.value.groupIndex === groupIndex &&
    currentChapterIndex.value.chapterIndex === chapterIndex
  );
};

// Seek to a specific chapter
const seekToChapter = (groupIndex, chapterIndex) => {
  const chapter = props.chapterGroups[groupIndex].chapters[chapterIndex];
  if (videoElement.value && chapter) {
    videoElement.value.currentTime = chapter.startTime;
    currentChapterIndex.value = { groupIndex, chapterIndex };

    // Auto-play when seeking to a chapter
    if (!isPlaying.value) {
      userPaused.value = false;
      togglePlayPause();
    }
  }
};

// Handle time update to track current chapter
const handleTimeUpdate = () => {
  if (!videoElement.value) return;

  const currentTime = videoElement.value.currentTime;

  // Find the current chapter based on time
  for (let i = allChapters.value.length - 1; i >= 0; i--) {
    const chapter = allChapters.value[i];
    const nextChapter = allChapters.value[i + 1];

    if (currentTime >= chapter.startTime) {
      // Check if we're before the next chapter (or this is the last chapter)
      if (!nextChapter || currentTime < nextChapter.startTime) {
        currentChapterIndex.value = {
          groupIndex: chapter.groupIndex,
          chapterIndex: chapter.chapterIndex,
        };
        break;
      }
    }
  }
};

// Handle video ended
const handleVideoEnded = () => {
  // Video ended, nothing special to do
};

// Intersection Observer for scroll-based play/pause
let observer = null;
let scrollCheckInterval = null;

// Helper function to check if video is in viewport
const isVideoInViewport = () => {
  if (!videoContainerRef.value) return false;

  const rect = videoContainerRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  // Calculate what portion of the video is visible
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);

  const totalHeight = rect.height;
  const totalWidth = rect.width;

  const visibleArea = visibleHeight * visibleWidth;
  const totalArea = totalHeight * totalWidth;

  const visibilityRatio = totalArea > 0 ? visibleArea / totalArea : 0;

  return visibilityRatio >= 0.5; // 50% threshold
};

// User pause tracking
const userPaused = ref(false);

// Handle play/pause and track user pause state
const handleTogglePlayPause = () => {
  userPaused.value = isPlaying.value; // If playing, user is pausing it
  togglePlayPause();
};

// Handle restart and reset user pause state
const handleRestartVideo = () => {
  userPaused.value = false;
  restartVideo();
};

onMounted(() => {
  if (!videoContainerRef.value) return;

  // Setup Intersection Observer for scroll-based autoplay
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Check if video is sufficiently visible (meets threshold)
        const isSufficientlyVisible = entry.isIntersecting && entry.intersectionRatio >= 0.5;

        if (isSufficientlyVisible) {
          // Video is visible enough - play it only if user didn't manually pause
          if (!userPaused.value) {
            setTimeout(() => {
              playVideo();
            }, 300);
          }
        } else {
          // Video is not sufficiently visible - ALWAYS pause it to prevent background playback
          if (isPlaying.value) {
            pauseVideo();
            // Reset hasStartedPlayback so pause overlay doesn't show when scrolling away
            hasStartedPlayback.value = false;
          }
        }
      });
    },
    {
      // Use multiple thresholds to catch fast scrolling
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: '0px',
    }
  );

  observer.observe(videoContainerRef.value);

  // Additional safeguard: periodically check if video should be paused
  // This catches cases where IntersectionObserver might miss fast scrolling
  scrollCheckInterval = setInterval(() => {
    if (isPlaying.value && !isVideoInViewport()) {
      pauseVideo();
      // Reset hasStartedPlayback so pause overlay doesn't show when scrolling away
      hasStartedPlayback.value = false;
    }
  }, 200); // Check every 200ms

  // Auto-play video on mount if it's in viewport
  setTimeout(() => {
    if (isVideoInViewport() && !userPaused.value) {
      playVideo();
    }
  }, 100);
});

onUnmounted(() => {
  // Disconnect Intersection Observer
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // Clear interval
  if (scrollCheckInterval) {
    clearInterval(scrollCheckInterval);
    scrollCheckInterval = null;
  }

  pauseVideo();
});
</script>

<style scoped>
.chaptered-video-wrapper {
  padding: 0 16px;
}

.video-container-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-sizing: border-box;
  position: relative;
}

/* Chapter navigation sidebar */
.chapters-nav {
  position: absolute;
  left: 40px;
  top: 50%;
  transform: translateY(-50%);
  width: 240px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.chapter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-title {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold);
  font-size: 14px;
  line-height: 1.4;
  color: inherit;
  opacity: 0.6;
  margin: 0 0 4px 0;
  padding: 0;
}

.chapters-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chapter-item {
  margin: 0;
  padding: 0;
}

.chapter-button {
  width: 100%;
  display: block;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-regular);
  font-size: 13px;
  line-height: 1.4;
  color: inherit;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chapter-button:hover {
  background: rgba(0, 0, 0, 0.05);
  opacity: 1;
}

.chapter-button.active {
  background: var(--case-primary-color, #007aff);
  color: #ffffff;
  opacity: 1;
  font-weight: var(--font-weight-medium);
}

.video-wrapper {
  position: relative;
  max-width: 1200px;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid #cccccc;
  line-height: 0;
}

video {
  width: 100%;
  height: auto;
  display: block;
  cursor: pointer;
  transition: filter 0.3s ease;
}

.video-paused-blur {
  filter: blur(4px);
}

.pause-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: inherit;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .background-container {
    flex-direction: column;
    padding: 32px 24px;
    gap: 24px;
  }

  .chapters-nav {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    gap: 16px;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }

  .chapters-nav::-webkit-scrollbar {
    height: 4px;
  }

  .chapters-nav::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 2px;
  }

  .chapters-nav::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
  }

  .chapter-group {
    flex-shrink: 0;
    min-width: auto;
  }

  .chapters-list {
    flex-direction: row;
    gap: 8px;
  }

  .chapter-button {
    white-space: nowrap;
    padding: 6px 12px;
    font-size: 12px;
  }

  .group-title {
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .background-container {
    padding: 24px 16px;
    gap: 16px;
  }

  .chapters-nav {
    gap: 12px;
  }

  .chapter-button {
    padding: 6px 10px;
    font-size: 11px;
  }
}
</style>
