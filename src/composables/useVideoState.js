/**
 * Composable for managing video state in sessionStorage
 * Handles saving, restoring, and clearing video playback state
 */

export function useVideoState(videoSrc) {
  const getStorageKey = () => `video-state-${videoSrc}`;

  const saveVideoState = (video, isPlaying, isMuted, hasStartedPlayback) => {
    if (!video) return;

    const state = {
      currentTime: video.currentTime,
      isPlaying,
      isMuted,
      hasStartedPlayback,
      timestamp: Date.now(),
    };

    sessionStorage.setItem(getStorageKey(), JSON.stringify(state));
  };

  const clearVideoState = () => {
    sessionStorage.removeItem(getStorageKey());
  };

  const restoreVideoState = (video, isMutedRef, hasStartedPlaybackRef, isPlayingRef) => {
    try {
      const stored = sessionStorage.getItem(getStorageKey());
      if (!stored) return false;

      const state = JSON.parse(stored);
      if (!video) return false;

      // Check if state is recent (within 5 minutes)
      const isRecent = Date.now() - state.timestamp < 5 * 60 * 1000;
      if (!isRecent) {
        clearVideoState();
        return false;
      }

      // Restore video state
      video.currentTime = state.currentTime || 0;
      isMutedRef.value = state.isMuted || false;
      video.muted = isMutedRef.value;
      hasStartedPlaybackRef.value = state.hasStartedPlayback || false;

      // Attempt to restore playback
      if (hasStartedPlaybackRef.value && state.isPlaying) {
        video
          .play()
          .then(() => {
            isPlayingRef.value = true;
          })
          .catch(() => {
            isPlayingRef.value = false;
          });
      }

      return true;
    } catch (error) {
      clearVideoState();
      return false;
    }
  };

  const isComingFromStory = () => {
    return sessionStorage.getItem(getStorageKey()) !== null;
  };

  const getUserHasInteracted = () => {
    return sessionStorage.getItem("user-has-interacted") === "true";
  };

  const setUserHasInteracted = () => {
    sessionStorage.setItem("user-has-interacted", "true");
  };

  return {
    saveVideoState,
    clearVideoState,
    restoreVideoState,
    isComingFromStory,
    getUserHasInteracted,
    setUserHasInteracted,
  };
}
