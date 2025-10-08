<template>
  <div class="case1" ref="caseElement">
    <div class="case1-heading">
      <div class="case1-heading-top">
        <h2 class="case1-title">
          Cross-Domain AI Solution for Account Reconcilers
        </h2>
        <RouterLink
          to="/story/one"
          class="case1-decoration-link"
          aria-label="Open story one"
          v-hover-distortion="4"
        >
          <div class="case1-decoration" aria-hidden="true">
            <svg
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.4242 0.421755C12.5482 0.545775 12.6413 0.688397 12.7033 0.849623C12.7653 1.00258 12.7942 1.18034 12.7901 1.38291L12.6909 10.8208C12.6867 11.1391 12.5689 11.4141 12.3374 11.6456C12.1886 11.7944 12.0129 11.8957 11.8103 11.9494C11.6078 12.0031 11.4052 12.0073 11.2026 11.9618C11.0042 11.9122 10.8264 11.8088 10.6693 11.6518C10.442 11.4244 10.3262 11.135 10.3221 10.7836L10.4399 2.40607L2.06235 2.52389C1.7151 2.52389 1.42572 2.40814 1.19421 2.17664C1.04126 2.02368 0.939974 1.84798 0.890366 1.64955C0.840758 1.44285 0.842825 1.23822 0.896567 1.03565C0.950309 0.833088 1.05159 0.657393 1.20042 0.508569C1.43192 0.277065 1.70683 0.159246 2.02515 0.155112L11.4631 0.0558963C11.6615 0.0558963 11.8393 0.0848341 11.9963 0.14271C12.1534 0.200586 12.2961 0.293601 12.4242 0.421755Z"
                fill="white"
              />
            </svg>
          </div>
        </RouterLink>
      </div>
      <p class="case1-subtitle">Apple</p>
    </div>
    <motion.div class="video-wrapper" :style="{ rotateX: videoTiltDeg }">
      <video
        ref="videoElement"
        class="case-video"
        src="@/assets/case-videos/case1.mp4"
        muted
        playsinline
        @ended="handleVideoEnded"
      ></video>
      <button
        v-if="showReplayButton"
        class="replay-button"
        @click="replayVideo"
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
          />
        </svg>
      </button>
    </motion.div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
} from "motion-v";
import { RouterLink } from "vue-router";

const caseElement = ref(null);
const videoElement = ref(null);
const showReplayButton = ref(false);
let observer = null;
let playTimeout = null;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const scrollContainer = ref(null);
const { scrollY } = useScroll({ container: scrollContainer });
const scrollVelocity = useVelocity(scrollY);
const videoTiltRaw = useTransform(scrollVelocity, (velocity = 0) => {
  if (!Number.isFinite(velocity)) {
    return 0;
  }
  const scaled = velocity / 130;
  return clamp(scaled, -48, 48);
});
const videoTilt = useSpring(videoTiltRaw, {
  stiffness: 3,
  damping: 1.5,
  mass: 0.5,
});
const videoTiltDeg = useTransform(videoTilt, (value) => `${value}deg`);

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
  scrollContainer.value =
    caseElement.value?.closest(".scroll-snap-container.fullscreen") ??
    document.querySelector(".scroll-snap-container.fullscreen") ??
    null;
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
  width: auto;
  height: auto;
  background: #171717;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  padding: 2vh 10vw;
  margin: auto;
  text-align: left;
  perspective: 1600px;
  perspective-origin: center;
  gap: clamp(16px, 2vh, 24px);
}

.case1-heading {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.case1-heading-top {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(16px, 4vw, 40px);
}

.case1-decoration-link {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  margin-right: 4px;
}

.case1-decoration-link:focus-visible .case1-decoration {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.25);
}

.case1-decoration {
  box-sizing: border-box;
  width: 56px;
  height: 56px;
  background: #212121;
  border: 1px solid rgba(109, 109, 109, 0.52);
  border-radius: 11px;
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.case1-decoration svg {
  width: 18px;
  height: 16px;
}

.case1-title {
  margin: 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-style: normal;
  font-weight: 590;
  font-size: 28.96px;
  line-height: 35px;
  text-align: left;
  color: #ffffff;
  max-width: min(100%, 560px);
}

.case1-subtitle {
  margin: 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: left;
  color: #ffffff;
  opacity: 0.6;
  max-width: min(100%, 480px);
}

.video-wrapper {
  padding: clamp(8px, 1.4vw, 12px);
  border-radius: 20px;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 2px solid #ffffff10;
  box-shadow: none;
  flex: 1 1 auto;
  height: auto;
  overflow: hidden;
  transform-style: preserve-3d;
  transform-origin: center;
  will-change: transform;
}

.case-video {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: clamp(12px, 1.6vw, 16px);
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

@media (max-width: 768px) {
  .case1-heading {
    gap: 16px;
  }

  .case1-decoration-link {
    width: 40px;
    height: 40px;
    margin-right: 0;
  }

  .case1-decoration {
    width: 40px;
    height: 40px;
    border-radius: 8px;
  }

  .case1-decoration svg {
    width: 14px;
    height: 12px;
  }
}
</style>
