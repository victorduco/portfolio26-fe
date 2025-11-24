import { ref } from "vue";

export function useChapteredVideo(videoElement) {
  const isPlaying = ref(false);
  const hasStartedPlayback = ref(false);
  const isFullscreen = ref(false);

  const play = (video, muted = false) => {
    if (muted) video.muted = true;
    video.play().then(() => {
      isPlaying.value = true;
      hasStartedPlayback.value = true;
    }).catch((e) => { isPlaying.value = false; console.warn('Play failed:', e); });
  };

  const togglePlayPause = () => {
    const video = videoElement.value;
    if (!video) return;
    video.paused ? play(video) : (video.pause(), isPlaying.value = false);
  };

  const toggleFullscreen = () => {
    const video = videoElement.value;
    if (!video) return;
    if (!document.fullscreenElement) {
      const container = video.parentElement?.parentElement?.parentElement;
      (container?.requestFullscreen || video.webkitRequestFullscreen)?.call(container || video)
        .then(() => { isFullscreen.value = true; }).catch(() => {});
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
      isFullscreen.value = false;
    }
  };

  return {
    isPlaying, hasStartedPlayback, isFullscreen,
    togglePlayPause, toggleFullscreen,
    restartVideo: () => { const v = videoElement.value; if (v) { v.currentTime = 0; play(v); } },
    pauseVideo: () => { const v = videoElement.value; if (v && !v.paused) { v.pause(); isPlaying.value = false; } },
    playVideo: () => { const v = videoElement.value; if (v) play(v, true); },
  };
}
