<template>
  <div class="tabbed-video-container" ref="containerRef">
    <TabsNav :tabs="tabs" :active-tab="activeTab" @tab-change="switchTab" />
    <div class="video-wrapper">
      <video v-for="(tab, i) in tabs" :key="`video-${i}`" :ref="el => el && (videoRefs[i] = el)" :src="tab.videoSrc" muted playsinline preload="auto" class="tab-video" :class="{ 'video-active': activeTab === i, 'video-paused-blur': activeTab === i && !isPlaying && hasStartedPlayback }" @ended="isPlaying = false" @click="togglePlayPause" />
      <div v-if="!isPlaying && hasStartedPlayback" class="pause-overlay" @click="togglePlayPause">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="40" fill="rgba(255,255,255,0.9)"/><path d="M32 25L55 40L32 55V25Z" fill="#000"/></svg>
      </div>
      <VideoControls v-if="hasStartedPlayback" :is-playing="isPlaying" :is-muted="true" :is-fullscreen="isFullscreen" :is-small-screen="isSmallScreen" :hide-mute="true" @toggle-play-pause="togglePlayPause" @restart="restartVideo" @toggle-fullscreen="toggleFullscreen" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import VideoControls from "./VideoControls.vue";
import TabsNav from "@/components/tabs-nav/TabsNav.vue";
import { useChapteredVideo } from "@/composables/useChapteredVideo";
import { useMediaQuery } from "@/composables/useMediaQuery";

const props = defineProps({
  tabs: { type: Array, required: true, validator: tabs => tabs.every(t => typeof t.title === "string" && typeof t.videoSrc === "string") }
});

const containerRef = ref(null);
const videoRefs = ref([]);
const activeTab = ref(0);
const userPaused = ref(false);
const isSmallScreen = useMediaQuery("(max-width: 899px)");

const currentVideo = computed(() => videoRefs.value[activeTab.value]);
const { isPlaying, hasStartedPlayback, isFullscreen, togglePlayPause: baseToggle, toggleFullscreen: baseFullscreen, restartVideo: baseRestart, pauseVideo, playVideo } = useChapteredVideo(currentVideo);

const togglePlayPause = () => { userPaused.value = isPlaying.value; baseToggle(); };
const restartVideo = () => { userPaused.value = false; baseRestart(); };
const toggleFullscreen = () => {
  if (!containerRef.value) return;
  if (!document.fullscreenElement) {
    containerRef.value.requestFullscreen().then(() => isFullscreen.value = true).catch(() => {});
  } else {
    document.exitFullscreen().then(() => isFullscreen.value = false).catch(() => {});
  }
};

const switchTab = async (index) => {
  if (index === activeTab.value) return;
  videoRefs.value[activeTab.value]?.pause();
  isPlaying.value = false;
  hasStartedPlayback.value = false;
  userPaused.value = false;
  activeTab.value = index;
  await nextTick();
  const video = videoRefs.value[index];
  if (video) { video.currentTime = 0; playVideo(); }
};

let observer = null;
onMounted(() => {
  if (!containerRef.value) return;
  const onFsChange = () => isFullscreen.value = !!document.fullscreenElement;
  document.addEventListener("fullscreenchange", onFsChange);

  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
      if (!userPaused.value) setTimeout(playVideo, 300);
    } else if (isPlaying.value) {
      pauseVideo();
      hasStartedPlayback.value = false;
    }
  }, { threshold: [0, 0.5, 1] });
  observer.observe(containerRef.value);

  setTimeout(() => { if (!userPaused.value) playVideo(); }, 100);
});

onUnmounted(() => { observer?.disconnect(); pauseVideo(); });
</script>

<style scoped>
.tabbed-video-container { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: clamp(24px, 4vw, 40px) clamp(16px, 3vw, 40px); box-sizing: border-box; position: relative; }
.video-wrapper { position: relative; max-width: 1200px; width: 100%; overflow: hidden; border-radius: 12px; border: 1px solid #ccc; line-height: 0; }
.tab-video { width: 100%; height: auto; display: none; cursor: pointer; transition: filter 0.3s ease; }
.tab-video.video-active { display: block; }
.tab-video.video-paused-blur { filter: blur(4px); }
.pause-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 100; background: rgba(255,255,255,0.6); border-radius: inherit; }
</style>
