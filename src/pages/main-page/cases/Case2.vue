<template>
  <section id="case2" class="case2" ref="containerRef">
    <div class="case2-content">
      <div class="case2-content-inner">
        <h2 class="case2-title">
          <span
            v-for="(word, index) in titlePart1Words"
            :key="'title1-' + index"
            :data-word-part1="index"
            class="word"
          >
            {{ word }}
          </span>
          <span
            v-for="(word, index) in titlePart2Words"
            :key="'title2-' + index"
            :data-word-part2="index"
            class="word"
          >
            {{ word }}
          </span>
        </h2>

        <p class="case2-paragraph case2-paragraph-1" data-paragraph="1">
          {{ paragraph1 }}
        </p>

        <p class="case2-paragraph case2-paragraph-2" data-paragraph="2">
          {{ paragraph2 }}
        </p>

        <p class="case2-paragraph case2-paragraph-3" data-paragraph="3">
          {{ paragraph3 }}
        </p>

        <button class="case2-open-story">
          <img src="@/assets/icons/case2.svg" alt="" class="case2-icon" />
          Open Story
        </button>
      </div>
    </div>

    <div class="case2-image-container">
      <video
        class="case2-video"
        :src="videoSrc"
        muted
        playsinline
        preload="auto"
      ></video>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { initAnimations } from "./case2-gsap-animations.js";
import { cleanupAnimations } from "./gsap-utils.js";

const videoSrc = new URL(
  "@/assets/case-videos/case2-4-reverse.mp4",
  import.meta.url
).href;

const containerRef = ref(null);

const titlePart1Words = computed(() => ["Redesigning", "the"]);
const titlePart2Words = computed(() => ["Communications", "App"]);

// 3 paragraphs, each 2 lines
const paragraph1 = "Communication platform for teams. Streamlining internal communications with intuitive design.";
const paragraph2 = "Powerful features that empower organizations. Connect and collaborate across departments.";
const paragraph3 = "Share knowledge effectively at scale. Building better workplace connections.";

let animationInstance = null;

onMounted(() => {
  if (containerRef.value) {
    animationInstance = initAnimations(containerRef.value);
  }
});

onUnmounted(() => {
  cleanupAnimations(animationInstance);
  animationInstance = null;
});
</script>

<style scoped>
.case2 {
  position: relative;
  width: 100%;
  height: 100dvh;
  min-height: 100dvh;
  max-height: 100dvh;
  background-color: #ffffff;
  overflow: hidden;
}

.case2-content {
  position: absolute;
  left: 0;
  top: 0;
  max-width: min(40vw, 750px);
  pointer-events: none;
}

.case2-content-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: clamp(16px, 2vh, 24px);
  max-width: 900px;
  width: 100%;
  pointer-events: auto;
  padding: clamp(24px, 3vw, 40px) clamp(28px, 3.5vw, 48px);
  z-index: 1;
}

.case2-title {
  margin: 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 400;
  font-size: clamp(20px, 6vw, 42px);
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #000000;
  text-align: left;
}

.case2-title .word {
  display: inline-block;
  margin-right: 0.25em;
  opacity: 0;
}

.case2-paragraph {
  margin: 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 400;
  font-size: clamp(12px, 1.3vw, 15px);
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.7);
  text-align: left;
  max-width: 500px;
  opacity: 0;
}

.case2-open-story {
  background: none;
  border: none;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 500;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  cursor: pointer;
  padding: 0;
  gap: 10px;
  opacity: 0;
}

.case2-open-story:hover {
  opacity: 0.7;
}

.case2-icon {
  width: 24px;
  height: 24px;
  display: block;
}

.case2-image-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100vh;
  z-index: 1;
  overflow: hidden;
}

.case2-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

@media (max-width: 899px) {
  .case2 {
    height: auto;
    min-height: 100dvh;
  }

  .case2-content {
    padding: clamp(32px, 8vh, 64px) clamp(24px, 6vw, 48px);
    max-width: 100%;
  }

  .case2-content-inner {
    padding: 0;
    max-width: 100%;
    align-items: center;
    text-align: center;
    gap: clamp(20px, 3vh, 32px);
  }

  .case2-title {
    text-align: center;
    font-size: clamp(28px, 6vw, 40px);
  }

  .case2-paragraph {
    text-align: center;
    font-size: clamp(14px, 3.5vw, 16px);
  }

  .case2-open-story {
    font-size: 20px;
  }

  .case2-icon {
    width: 28px;
    height: 28px;
  }

  .case2-image-container {
    min-height: 50vh;
  }

  .case2-video {
    object-fit: contain;
  }
}

@media (max-width: 600px) {
  .case2-content {
    padding: clamp(24px, 6vh, 48px) 20px;
  }

  .case2-content-inner {
    gap: 16px;
    padding: 16px 20px;
  }

  .case2-title {
    font-size: clamp(24px, 5vw, 32px);
  }

  .case2-paragraph {
    font-size: 14px;
  }

  .case2-open-story {
    font-size: 18px;
    gap: 10px;
  }

  .case2-icon {
    width: 24px;
    height: 24px;
  }
}

</style>
