/**
 * Composable for managing video state in sessionStorage
 */
export function useVideoState(videoSrc) {
  const key = `video-state-${videoSrc}`;

  const saveVideoState = (video, isPlaying, isMuted, hasStartedPlayback) => {
    if (!video) return;
    sessionStorage.setItem(key, JSON.stringify({
      currentTime: video.currentTime,
      isPlaying,
      isMuted,
      hasStartedPlayback,
      timestamp: Date.now(),
    }));
  };

  const clearVideoState = () => sessionStorage.removeItem(key);

  const restoreVideoState = (video, isMutedRef, hasStartedPlaybackRef, isPlayingRef) => {
    try {
      const state = JSON.parse(sessionStorage.getItem(key));
      if (!state || !video || Date.now() - state.timestamp > 300000) {
        clearVideoState();
        return false;
      }

      video.currentTime = state.currentTime || 0;
      video.muted = isMutedRef.value = state.isMuted || false;
      hasStartedPlaybackRef.value = state.hasStartedPlayback || false;

      if (hasStartedPlaybackRef.value && state.isPlaying) {
        video.play().then(() => isPlayingRef.value = true).catch(() => isPlayingRef.value = false);
      }
      return true;
    } catch {
      clearVideoState();
      return false;
    }
  };

  return {
    saveVideoState,
    clearVideoState,
    restoreVideoState,
    isComingFromStory: () => sessionStorage.getItem(key) !== null,
    getUserHasInteracted: () => sessionStorage.getItem("user-has-interacted") === "true",
    setUserHasInteracted: () => sessionStorage.setItem("user-has-interacted", "true"),
  };
}
