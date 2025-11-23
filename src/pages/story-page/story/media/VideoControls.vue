<template>
  <div class="story-video-controls">
    <!-- Mute/Unmute Button -->
    <button
      v-if="!hideMute"
      class="control-button"
      type="button"
      @click.stop="$emit('toggle-mute')"
      :aria-label="isMuted ? 'Unmute' : 'Mute'"
    >
      <svg
        v-if="isMuted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="control-icon"
      >
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="control-icon"
      >
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    </button>

    <!-- Play/Pause Button -->
    <button
      class="control-button"
      type="button"
      @click.stop="$emit('toggle-play-pause')"
      :aria-label="isPlaying ? 'Pause' : 'Play'"
    >
      <svg
        v-if="isPlaying"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="control-icon"
      >
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="currentColor"
        class="control-icon"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>

    <!-- Restart Button -->
    <button
      class="control-button"
      type="button"
      @click.stop="$emit('restart')"
      aria-label="Restart video"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="control-icon"
      >
        <path
          d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
        />
      </svg>
    </button>

    <!-- Fullscreen Button (only on small screens) -->
    <button
      v-if="isSmallScreen"
      class="control-button"
      type="button"
      @click.stop="$emit('toggle-fullscreen')"
      :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
    >
      <svg
        v-if="!isFullscreen"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="control-icon"
      >
        <path
          d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
        />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="control-icon"
      >
        <path
          d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  isPlaying: Boolean,
  isMuted: Boolean,
  isFullscreen: Boolean,
  isSmallScreen: Boolean,
  hideMute: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['toggle-mute', 'toggle-play-pause', 'restart', 'toggle-fullscreen']);
</script>

<style scoped>
.story-video-controls {
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
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  pointer-events: auto;
  outline: none !important;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.2s ease, transform 0.1s ease;
}

.control-button:hover {
  background: rgba(0, 0, 0, 0.4);
}

.control-button:active {
  background: rgba(0, 0, 0, 0.5);
  transform: scale(0.95);
}

.control-icon {
  width: 18px;
  height: 18px;
  outline: none !important;
  -webkit-tap-highlight-color: transparent;
}
</style>
