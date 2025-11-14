/**
 * Composable for managing chaptered video playback
 * Simplified version focused on autoplay and basic controls
 */

import { ref } from "vue";

export function useChapteredVideo(videoElement) {
  const isPlaying = ref(false);
  const hasStartedPlayback = ref(false);
  const isFullscreen = ref(false);

  const getVideoElement = () => videoElement.value;

  const togglePlayPause = () => {
    const video = getVideoElement();
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        isPlaying.value = true;
        hasStartedPlayback.value = true;
      }).catch((error) => {
        console.warn('Play failed:', error);
      });
    } else {
      video.pause();
      isPlaying.value = false;
    }
  };

  const toggleFullscreen = () => {
    const video = getVideoElement();
    if (!video) return;

    if (!document.fullscreenElement) {
      const container = video.parentElement?.parentElement?.parentElement;
      if (container?.requestFullscreen) {
        container.requestFullscreen()
          .then(() => {
            isFullscreen.value = true;
          })
          .catch(() => {});
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen()
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
  };

  const restartVideo = () => {
    const video = getVideoElement();
    if (!video) return;

    video.currentTime = 0;
    video.play().then(() => {
      isPlaying.value = true;
      hasStartedPlayback.value = true;
    });
  };

  const pauseVideo = () => {
    const video = getVideoElement();
    if (video && !video.paused) {
      video.pause();
      isPlaying.value = false;
    }
  };

  const playVideo = () => {
    const video = getVideoElement();
    if (!video) return;

    // Ensure video is muted for autoplay to work
    video.muted = true;

    video.play().then(() => {
      isPlaying.value = true;
      hasStartedPlayback.value = true;
    }).catch((error) => {
      console.warn('Autoplay failed:', error);
      isPlaying.value = false;
    });
  };

  return {
    // State
    isPlaying,
    hasStartedPlayback,
    isFullscreen,

    // Actions
    togglePlayPause,
    toggleFullscreen,
    restartVideo,
    pauseVideo,
    playVideo,
  };
}
