<template>
  <div class="video-container-inner" ref="videoContainerRef">
    <nav class="chapters-nav" ref="navRef">
      <div v-for="(group, gi) in chapterGroups" :key="gi" class="chapter-group">
        <h4 v-if="group.title" class="group-title">{{ group.title }}</h4>
        <ul class="chapters-list">
          <li v-for="(ch, ci) in group.chapters" :key="`${gi}-${ci}`" class="chapter-item">
            <button class="chapter-button" :class="{ active: currentChapterIndex.groupIndex === gi && currentChapterIndex.chapterIndex === ci }" @click="seekToChapter(gi, ci)" :aria-label="`Go to ${ch.title}`">{{ ch.title }}</button>
          </li>
        </ul>
      </div>
    </nav>
    <div class="video-wrapper">
      <video ref="videoElement" :src="videoSrc" muted playsinline preload="auto" @timeupdate="handleTimeUpdate" @click="handleTogglePlayPause" :class="{ 'video-paused-blur': !isPlaying && hasStartedPlayback }" />
      <div v-if="!isPlaying && hasStartedPlayback" class="pause-overlay" @click="handleTogglePlayPause">
        <div class="play-icon"></div>
      </div>
      <VideoControls v-if="hasStartedPlayback" :is-playing="isPlaying" :is-muted="true" :is-fullscreen="isFullscreen" :is-small-screen="isSmallScreen" :hide-mute="true" @toggle-play-pause="handleTogglePlayPause" @restart="handleRestartVideo" @toggle-fullscreen="toggleFullscreen" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import VideoControls from "./VideoControls.vue";
import { useChapteredVideo } from "@/composables/useChapteredVideo";
import { useMediaQuery } from "@/composables/useMediaQuery";

const props = defineProps({
  videoSrc: { type: String, required: true },
  chapterGroups: { type: Array, required: true },
});

const videoElement = ref(null);
const videoContainerRef = ref(null);
const navRef = ref(null);
const isSmallScreen = useMediaQuery("(max-width: 899px)");
const { isPlaying, hasStartedPlayback, isFullscreen, togglePlayPause, restartVideo, toggleFullscreen, pauseVideo, playVideo } = useChapteredVideo(videoElement);
const currentChapterIndex = ref({ groupIndex: 0, chapterIndex: 0 });
const userPaused = ref(false);

const allChapters = computed(() => {
  const chapters = [];
  props.chapterGroups.forEach((group, gi) => {
    group.chapters.forEach((chapter, ci) => {
      chapters.push({ ...chapter, groupIndex: gi, chapterIndex: ci });
    });
  });
  return chapters.sort((a, b) => a.startTime - b.startTime);
});

const seekToChapter = (gi, ci) => {
  const chapter = props.chapterGroups[gi].chapters[ci];
  if (videoElement.value && chapter) {
    videoElement.value.currentTime = chapter.startTime;
    currentChapterIndex.value = { groupIndex: gi, chapterIndex: ci };
    if (!isPlaying.value) {
      userPaused.value = false;
      togglePlayPause();
    }
  }
};

const handleTimeUpdate = () => {
  if (!videoElement.value) return;
  const currentTime = videoElement.value.currentTime;
  for (let i = allChapters.value.length - 1; i >= 0; i--) {
    const chapter = allChapters.value[i];
    const nextChapter = allChapters.value[i + 1];
    if (currentTime >= chapter.startTime && (!nextChapter || currentTime < nextChapter.startTime)) {
      currentChapterIndex.value = { groupIndex: chapter.groupIndex, chapterIndex: chapter.chapterIndex };
      break;
    }
  }
};

const handleTogglePlayPause = () => {
  userPaused.value = isPlaying.value;
  togglePlayPause();
};

const handleRestartVideo = () => {
  userPaused.value = false;
  restartVideo();
};

let observer = null;
onMounted(() => {
  if (!videoContainerRef.value) return;
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      if (visible) {
        if (!userPaused.value) setTimeout(() => playVideo(), 300);
      } else if (isPlaying.value) {
        pauseVideo();
        hasStartedPlayback.value = false;
      }
    });
  }, { threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1], rootMargin: "0px" });
  observer.observe(videoContainerRef.value);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  pauseVideo();
});
</script>

<style scoped>
.video-container-inner { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 40px; box-sizing: border-box; position: relative; }
.chapters-nav { position: absolute; left: 40px; top: 50%; transform: translateY(-50%); width: 240px; display: flex; flex-direction: column; gap: 24px; }
.chapter-group { display: flex; flex-direction: column; gap: 8px; }
.group-title { font-family: var(--font-family-base); font-weight: var(--font-weight-semibold); font-size: 14px; line-height: 1.4; color: inherit; opacity: 0.6; margin: 0 0 4px 0; padding: 0; }
.chapters-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.chapter-item { margin: 0; padding: 0; }
.chapter-button { width: 100%; display: block; padding: 8px 12px; background: transparent; border: none; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; text-align: left; font-family: var(--font-family-base); font-weight: var(--font-weight-regular); font-size: 13px; line-height: 1.4; color: inherit; opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chapter-button:hover { background: rgba(0, 0, 0, 0.05); opacity: 1; }
.chapter-button.active { background: var(--story-primary-color, #007aff); color: #fff; opacity: 1; font-weight: var(--font-weight-medium); }
.video-wrapper { position: relative; max-width: 1200px; overflow: hidden; border-radius: 12px; border: 1px solid #ccc; line-height: 0; }
video { width: 100%; height: auto; display: block; cursor: pointer; transition: filter 0.3s ease; }
.video-paused-blur { filter: blur(4px); }
.pause-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 100; background: rgba(255, 255, 255, 0.6); border-radius: inherit; }
.play-icon { width: 80px; height: 80px; border-radius: 50%; background: rgba(255, 255, 255, 0.9); position: relative; }
.play-icon::after { content: ''; position: absolute; top: 50%; left: 55%; transform: translate(-50%, -50%); width: 0; height: 0; border-style: solid; border-width: 15px 0 15px 25px; border-color: transparent transparent transparent #000; }

@media (max-width: 1024px) {
  .chapters-nav { position: static; transform: none; width: 100%; flex-direction: row; overflow-x: auto; gap: 16px; padding-bottom: 4px; -webkit-overflow-scrolling: touch; scrollbar-width: thin; }
  .chapters-nav::-webkit-scrollbar { height: 4px; }
  .chapters-nav::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.05); border-radius: 2px; }
  .chapters-nav::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.2); border-radius: 2px; }
  .chapter-group { flex-shrink: 0; }
  .chapters-list { flex-direction: row; gap: 8px; }
  .chapter-button { white-space: nowrap; padding: 6px 12px; font-size: 12px; }
  .group-title { font-size: 12px; }
}

@media (max-width: 768px) {
  .chapters-nav { gap: 12px; }
  .chapter-button { padding: 6px 10px; font-size: 11px; }
}
</style>
