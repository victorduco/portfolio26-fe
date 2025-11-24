import { ref, computed } from "vue";
import { useVideoState } from "./useVideoState.js";

export function useVideoPlayer(videoSrc, videoElement) {
  const isPlaying = ref(false);
  const isMuted = ref(true);
  const hasStartedPlayback = ref(false);
  const userPaused = ref(false);
  const wasStateRestored = ref(false);
  const isFullscreen = ref(false);

  const { saveVideoState, clearVideoState, restoreVideoState, isComingFromStory, getUserHasInteracted, setUserHasInteracted } = useVideoState(videoSrc);

  const shouldBeMutedByDefault = computed(() => typeof window !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

  const v = () => videoElement.value;
  const setMuted = (muted) => { const el = v(); if (el) { el.muted = muted; isMuted.value = muted; } };
  const setPlaying = (playing) => { isPlaying.value = playing; hasStartedPlayback.value = true; };

  const attemptPlay = () => {
    const video = v();
    if (!video || (!video.paused && hasStartedPlayback.value)) return;
    if (!getUserHasInteracted() || shouldBeMutedByDefault.value) { setPlaying(false); return; }
    setMuted(false);
    video.playsInline = true;
    video.play().then(() => setPlaying(true)).catch(() => { hasStartedPlayback.value = true; setPlaying(false); });
  };

  const togglePlayPause = () => {
    const video = v();
    if (!video) return;
    if (video.paused) {
      userPaused.value = false;
      setUserHasInteracted();
      setMuted(shouldBeMutedByDefault.value);
      video.play().then(() => setPlaying(true));
    } else {
      userPaused.value = true;
      video.pause();
      isPlaying.value = false;
    }
  };

  const toggleMute = () => { const video = v(); if (video) setMuted(!isMuted.value); };

  const toggleFullscreen = () => {
    const video = v();
    if (!video) return;
    if (!document.fullscreenElement) {
      const c = video.parentElement?.parentElement?.parentElement?.parentElement;
      if (c?.requestFullscreen) c.requestFullscreen().then(() => isFullscreen.value = true);
      else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen().then(() => isFullscreen.value = false);
      else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); isFullscreen.value = false; }
    }
  };

  const restartVideo = () => {
    const video = v();
    if (!video) return;
    video.currentTime = 0;
    clearVideoState();
    wasStateRestored.value = false;
    userPaused.value = false;
    video.play().then(() => { isPlaying.value = true; });
  };

  const handleVideoEnded = () => { isPlaying.value = false; };
  const handleFullscreenChange = () => { isFullscreen.value = !!document.fullscreenElement; };

  const handleUserInteraction = () => {
    if (getUserHasInteracted()) return;
    setUserHasInteracted();
    const video = v();
    if (video && !video.paused && hasStartedPlayback.value && isMuted.value && !shouldBeMutedByDefault.value) setMuted(false);
  };

  const pauseVideo = () => { const video = v(); if (video?.pause && !video.paused) { video.pause(); isPlaying.value = false; } };

  const playVideo = () => {
    const video = v();
    if (!video) return;
    setMuted(true);
    video.play().then(() => setPlaying(true)).catch(() => { isPlaying.value = false; });
  };

  const saveState = () => { if (hasStartedPlayback.value) saveVideoState(v(), isPlaying.value, isMuted.value, hasStartedPlayback.value); };

  const restoreState = () => {
    const video = v();
    if (!video || !isComingFromStory()) return false;
    const restored = restoreVideoState(video, isMuted, hasStartedPlayback, isPlaying);
    if (restored) wasStateRestored.value = true;
    return restored;
  };

  return {
    isPlaying, isMuted, hasStartedPlayback, userPaused, wasStateRestored, isFullscreen, shouldBeMutedByDefault,
    attemptPlay, togglePlayPause, toggleMute, toggleFullscreen, restartVideo, handleVideoEnded,
    handleFullscreenChange, handleUserInteraction, pauseVideo, playVideo, saveState, restoreState, clearVideoState, isComingFromStory,
  };
}
