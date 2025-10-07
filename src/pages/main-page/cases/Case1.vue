<template>
  <div class="case1" ref="caseElement">
    <div class="case1-layout">
      <aside class="case-sidebar">
        <section class="case-card case-card--info">
          <h2 class="case-card__title">A Creative Canvas for All People in The Wrold</h2>
          <ul class="case-card__meta">
            <li>
              <span class="case-card__label">Scope</span>
              <span class="case-card__value">UX Research, Design, Workshops, etc UX Research</span>
            </li>
            <li>
              <span class="case-card__label">Company</span>
              <span class="case-card__value">UX Research, Design, Workshops, etc UX Research</span>
            </li>
            <li>
              <span class="case-card__label">My role</span>
              <span class="case-card__value">UX Research, Design, Workshops, etc UX Research</span>
            </li>
          </ul>
        </section>
        <section class="case-card case-card--fact">
          <p class="case-card__fact">Tools saves ~9k hours of specialists per year so it helps everybody.</p>
          <span class="case-card__footnote">Quick fact 1 of 3</span>
        </section>
        <RouterLink to="/story/one" class="case-card case-card--cta">
          <span>Open Story</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"></path>
            <path d="M13 5l7 7-7 7"></path>
          </svg>
        </RouterLink>
      </aside>
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
  justify-content: flex-start;
  position: relative;
  box-sizing: border-box;
  padding-inline-start: clamp(32px, 12vw, 120px);
  padding-inline-end: clamp(24px, 8vw, 96px);
}

.case1-layout {
  display: grid;
  grid-template-columns: clamp(280px, 26vw, 360px) minmax(0, 1fr);
  gap: 16px;
  align-items: stretch;
  width: 100%;
}

.case-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.case-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 16px;
  padding: 24px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.24);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08) inset,
    0 14px 36px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
  min-height: 0;
}

.case-card--info {
  gap: 24px;
  flex: 1 1 0;
}

.case-card__title {
  margin: 0;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 32px;
  line-height: 39px;
  color: #ffffff;
}

.case-card__meta {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 18px;
  margin-top: 24px;
}

.case-card__meta li {
  display: grid;
  grid-template-columns: minmax(0, max-content) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  width: 100%;
}

.case-card__label {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  text-align: left;
}

.case-card__value {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  text-align: left;
}

.case-card--fact {
  gap: 16px;
  flex: 1 1 0;
}

.case-card__fact {
  margin: 0;
  font-family: "Inter", sans-serif;
  font-size: 23px;
  line-height: 28px;
  font-weight: 500;
  color: #ffffff;
}

.case-card__footnote {
  font-family: "Inter", sans-serif;
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.case-card--cta {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex: 0 0 auto;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  font-family: "Inter", sans-serif;
  font-size: 18px;
  line-height: 24px;
  font-weight: 500;
  transition: background 0.2s ease, color 0.2s ease, opacity 0.2s ease;
  cursor: pointer;
  margin-top: auto;
}

.case-card--cta:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
}

.case-card--cta svg {
  color: currentColor;
}

.case-card--cta span {
  flex: 1;
}

.video-wrapper {
  position: relative;
  padding: 12px;
  border-radius: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  width: 100%;
  height: auto;
  border-radius: 16px;
  max-height: 100%;
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
