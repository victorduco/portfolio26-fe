<template>
  <div class="case-video-controls">
    <!-- Mute/Unmute Button -->
    <motion.button
      class="control-button"
      type="button"
      @click.stop="$emit('toggle-mute')"
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

    <!-- Play/Pause Button -->
    <motion.button
      class="control-button"
      type="button"
      @click.stop="$emit('toggle-play-pause')"
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

    <!-- Restart Button -->
    <motion.button
      class="control-button"
      type="button"
      @click.stop="$emit('restart')"
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

    <!-- Fullscreen Button (only on small screens) -->
    <motion.button
      v-if="isSmallScreen"
      class="control-button"
      type="button"
      @click.stop="$emit('toggle-fullscreen')"
      @mouseenter="fullscreenHovered = true"
      @mouseleave="fullscreenHovered = false"
      :initial="'default'"
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import { motion } from "motion-v";
import {
  buttonVariants,
  buttonTransition,
  iconVariants,
  iconTransition,
} from "@/config/videoAnimationVariants.js";

defineProps({
  isPlaying: Boolean,
  isMuted: Boolean,
  isFullscreen: Boolean,
  isSmallScreen: Boolean,
});

defineEmits(["toggle-mute", "toggle-play-pause", "restart", "toggle-fullscreen"]);

const muteHovered = ref(false);
const playHovered = ref(false);
const restartHovered = ref(false);
const fullscreenHovered = ref(false);
</script>

<style scoped>
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
  transform: rotate(-45deg);
}

.control-icon:focus {
  outline: none !important;
}

.control-icon:focus-visible {
  outline: none !important;
}

.case-video-controls.mobile-controls {
  opacity: 1;
  pointer-events: auto;
}
</style>
