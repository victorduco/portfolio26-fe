<template>
  <div class="case1" ref="caseElement">
    <div class="case1-content">
      <div class="case-header">
        <h2 class="case-title">A Creative Canvas for&nbsp;All</h2>
        <RouterLink to="/story/one" class="case-link">Open Story</RouterLink>
      </div>
      <div class="video-wrapper">
        <video
          ref="videoElement"
          class="case-video"
          src="@/assets/case-videos/case1.mp4"
          muted
          playsinline
          @ended="handleVideoEnded"
        ></video>
        <button v-if="showReplayButton" class="replay-button" @click="replayVideo">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink } from "vue-router";

const caseElement = ref(null);
const videoElement = ref(null);
const showReplayButton = ref(false);
let observer = null;
let playTimeout = null;

function handleVideoEnded() {
  showReplayButton.value = true;
}

function replayVideo() {
  showReplayButton.value = false;
  if (videoElement.value) {
    videoElement.value.currentTime = 0;
    videoElement.value.play();
  }
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Запускаем видео через 0.5 секунды после появления в области видимости
          playTimeout = setTimeout(() => {
            if (videoElement.value) {
              showReplayButton.value = false;
              videoElement.value.play();
            }
          }, 500);
        } else {
          // Очищаем таймаут и останавливаем видео при выходе из области видимости
          if (playTimeout) {
            clearTimeout(playTimeout);
            playTimeout = null;
          }
          if (videoElement.value) {
            videoElement.value.pause();
          }
        }
      });
    },
    {
      threshold: 0.5, // Секция должна быть видна хотя бы на 50%
    }
  );

  if (caseElement.value) {
    observer.observe(caseElement.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
  if (playTimeout) {
    clearTimeout(playTimeout);
  }
});
</script>

<style scoped>
.case1 {
  width: 100vw;
  height: 100vh;
  background: #171717;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.case1-content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}

.case-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  width: 100%;
  padding: 0 12px;
}

.case-title {
  margin: 0;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 18px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
}

.case-link {
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 18px;
  color: #ffffff;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s ease;
  opacity: 0.8;
}

.case-link:hover {
  opacity: 1;
}

.video-wrapper {
  position: relative;
  padding: 12px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 8px 32px rgba(0, 0, 0, 0.1);
}

.case-video {
  display: block;
  width: 60vw;
  height: auto;
  border-radius: 20px;
  object-fit: contain;
}

.replay-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 1;
}

.replay-button:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: translate(-50%, -50%) scale(1.1);
}

.replay-button svg {
  width: 40px;
  height: 40px;
}
</style>
