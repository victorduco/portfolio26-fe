<template>
  <div class="case1-layout">
    <!-- Background frame image - full screen -->
    <div class="case1-frame-bg" :style="{ backgroundImage: `url(${imageSrc})` }">
      <!-- Video positioned in the white screen area -->
      <video
        v-if="videoSrc"
        :src="videoSrc"
        class="case1-video"
        muted
        loop
        playsinline
        autoplay
        ref="videoElement"
      ></video>
    </div>

    <!-- Text overlay -->
    <div class="case1-text">
      <h2 class="case1-title">{{ title }}</h2>
      <p class="case1-company">{{ company }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  imageSrc: {
    type: String,
    required: true,
  },
  videoSrc: {
    type: String,
    default: "",
  },
  backgroundColor: {
    type: String,
    default: "#ffffff",
  },
});

const videoElement = ref(null);

onMounted(() => {
  if (videoElement.value) {
    videoElement.value.play().catch((err) => {
      console.error("[Case1Layout] Video play error:", err);
    });
  }
});

function handleEnter() {
  // Called when section enters viewport
}

function handleLeave() {
  // Called when section leaves viewport
}

function handleStoryLinkClick() {
  // Called before navigation to story page
}

defineExpose({
  handleEnter,
  handleLeave,
  handleStoryLinkClick,
});
</script>

<style scoped>
.case1-layout {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
}

/* Background frame - full screen with cover, centered */
.case1-frame-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1.15);
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

/* Video positioned in the white screen area */
.case1-video {
  position: absolute;
  /* Center the video horizontally and vertically */
  left: 50%;
  top: 47%;
  transform: translate(-50%, -50%) scale(0.95);

  /* Video size to fit the white screen area - increased size */
  width: 80vw;
  max-width: 1100px;
  height: auto;

  object-fit: cover;
  pointer-events: none;
  z-index: 1;
}

/* Text overlay - positioned on top */
.case1-text {
  position: absolute;
  top: 6vh;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
  z-index: 2;
  width: 90%;
  max-width: 900px;
}

.case1-title {
  margin: 0;
  font-family: "Inter", "SF Pro", "SF Pro Display", sans-serif;
  font-weight: 500;
  font-size: clamp(18px, 2.3vw, 26px);
  line-height: 1.2;
  color: #ffffff;
}

.case1-company {
  margin: 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #ffffff;
  opacity: 0.6;
}

/* Mobile Responsive */
@media (max-width: 899px) {
  .case1-text {
    top: 5vh;
  }

  .case1-title {
    font-size: clamp(18px, 3.8vw, 24px);
  }

  .case1-company {
    font-size: 16px;
  }

  .case1-video {
    width: 82vw;
  }
}

@media (max-width: 600px) {
  .case1-text {
    top: 4vh;
  }

  .case1-title {
    font-size: clamp(16px, 4.3vw, 22px);
  }

  .case1-company {
    font-size: 14px;
  }

  .case1-video {
    width: 85vw;
  }
}
</style>
