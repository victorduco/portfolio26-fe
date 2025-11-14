/**
 * Composable for managing video playback logic
 * Handles play/pause, mute, fullscreen, and playback state
 */

import { ref, computed } from "vue";
import { useVideoState } from "./useVideoState.js";

export function useVideoPlayer(videoSrc, videoElement) {
  const isPlaying = ref(false);
  const isMuted = ref(true);
  const hasStartedPlayback = ref(false);
  const userPaused = ref(false);
  const wasStateRestored = ref(false);
  const isFullscreen = ref(false);

  let playAttempts = 0;

  const {
    saveVideoState,
    clearVideoState,
    restoreVideoState,
    isComingFromStory,
    getUserHasInteracted,
    setUserHasInteracted,
  } = useVideoState(videoSrc);

  const shouldBeMutedByDefault = computed(() => {
    if (typeof window === "undefined") return false;
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  });

  const getVideoElement = () => videoElement.value;

  const attemptPlay = () => {
    const video = getVideoElement();
    const userHasInteracted = getUserHasInteracted();

    if (!video) return;

    if (!video.paused && hasStartedPlayback.value) {
      return;
    }

    if (!userHasInteracted || shouldBeMutedByDefault.value) {
      hasStartedPlayback.value = true;
      isPlaying.value = false;
      return;
    }

    video.muted = false;
    isMuted.value = false;
    video.playsInline = true;

    video
      .play()
      .then(() => {
        playAttempts = 0;
        hasStartedPlayback.value = true;
        isPlaying.value = true;
      })
      .catch(() => {
        hasStartedPlayback.value = true;
        isPlaying.value = false;
        playAttempts = 0;
      });
  };

  const togglePlayPause = () => {
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
      });
    } else {
      userPaused.value = true;
      video.pause();
      isPlaying.value = false;
    }
  };

  const toggleMute = () => {
    const video = getVideoElement();
    if (!video) return;

    isMuted.value = !isMuted.value;
    video.muted = isMuted.value;
  };

  const toggleFullscreen = () => {
    const video = getVideoElement();
    if (!video) return;

    if (!document.fullscreenElement) {
      const container =
        video.parentElement?.parentElement?.parentElement?.parentElement;
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
  };

  const restartVideo = () => {
    const video = getVideoElement();
    if (!video) return;

    video.currentTime = 0;

    clearVideoState();
    wasStateRestored.value = false;
    userPaused.value = false;

    video.play().then(() => {
      isPlaying.value = true;
    });
  };

  const handleVideoEnded = () => {
    isPlaying.value = false;
  };

  const handleFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement;
  };

  const handleUserInteraction = () => {
    if (getUserHasInteracted()) return;

    setUserHasInteracted();

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
  };

  const pauseVideo = () => {
    const video = getVideoElement();
    playAttempts = 0;

    if (video && typeof video.pause === "function" && !video.paused) {
      video.pause();
      isPlaying.value = false;
    }
  };

  const playVideo = () => {
    const video = getVideoElement();
    if (!video) return;

    // Ensure video is muted for autoplay to work
    video.muted = true;
    isMuted.value = true;

    video.play().then(() => {
      isPlaying.value = true;
      hasStartedPlayback.value = true;
    }).catch((error) => {
      console.warn('Autoplay failed:', error);
      isPlaying.value = false;
    });
  };

  const saveState = () => {
    const video = getVideoElement();
    if (hasStartedPlayback.value) {
      saveVideoState(video, isPlaying.value, isMuted.value, hasStartedPlayback.value);
    }
  };

  const restoreState = () => {
    const video = getVideoElement();
    if (video && isComingFromStory()) {
      const restored = restoreVideoState(
        video,
        isMuted,
        hasStartedPlayback,
        isPlaying
      );
      if (restored) {
        wasStateRestored.value = true;
      }
      return restored;
    }
    return false;
  };

  return {
    // State
    isPlaying,
    isMuted,
    hasStartedPlayback,
    userPaused,
    wasStateRestored,
    isFullscreen,
    shouldBeMutedByDefault,

    // Actions
    attemptPlay,
    togglePlayPause,
    toggleMute,
    toggleFullscreen,
    restartVideo,
    handleVideoEnded,
    handleFullscreenChange,
    handleUserInteraction,
    pauseVideo,
    playVideo,
    saveState,
    restoreState,
    clearVideoState,
    isComingFromStory,
  };
}
