<template>
  <div class="case1" ref="caseElement">
    <div class="case1-content">
      <h2 class="case1-title">Cross-Domain AI Solution for Account Reconcilers</h2>
      <p class="case1-subtitle">Apple</p>
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
      <RouterLink to="/story/one" class="case1-cta">Open Story</RouterLink>
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
  width: 92vw;
  height: 96vh;
  background: #171717;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  padding: 2vh 4vw;
  margin: auto;
}

.case1-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 100%;
  height: 100%;
  min-height: 0;
  text-align: center;
}

.case1-title {
  margin: 0;
  margin-bottom: 8px;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-style: normal;
  font-weight: 590;
  font-size: 28.96px;
  line-height: 35px;
  text-align: center;
  color: #ffffff;
  max-width: min(100%, 560px);
}

.case1-subtitle {
  margin: 0;
  margin-bottom: 16px;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #ffffff;
  opacity: 0.6;
  max-width: min(100%, 480px);
}

.video-wrapper {
  position: relative;
  padding: clamp(8px, 1.4vw, 12px);
  margin-bottom: 16px;
  border-radius: 20px;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 2px solid #ffffff10;
  box-shadow: none;
  flex: 1 1 auto;
  min-height: 0;
  aspect-ratio: 277 / 180;
  height: 100%;
  max-width: 100%;
  overflow: hidden;
}

.case-video {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  max-height: 100%;
  object-fit: contain;
}

.case1-cta {
  text-decoration: none;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-style: normal;
  font-weight: 590;
  font-size: 21.96px;
  line-height: 26px;
  text-align: center;
  color: #ffffff;
  opacity: 1;
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
