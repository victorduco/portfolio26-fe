<template>
  <section id="case2" class="case2" ref="containerRef">
    <div class="case2-content">
      <div class="case2-content-inner">
        <div class="case2-company">Smarp</div>

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

        <div class="case2-paragraph">
          <span class="case2-paragraph-part1">
            {{ descriptionPart1 }}<img :src="googleLogo" alt="Google" class="client-logo client-logo-google" /><img :src="cocaColaLogo" alt="Coca-Cola" class="client-logo" /><img :src="lorealLogo" alt="L'Oreal" class="client-logo client-logo-loreal" />
          </span><span class="case2-paragraph-part2">{{ descriptionPart2 }}<img :src="g2Badge" alt="G2 Awards" class="awards-badge" />{{ descriptionPart3 }}.</span>
        </div>

        <a
          href="/story/two"
          class="case2-open-story"
          @click.prevent="handleStoryLinkClick"
        >
          Open Story
          <img src="@/assets/icons/rocket.svg" alt="" class="case2-icon" />
        </a>
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
      <img
        class="case2-final-image"
        :src="finalImageSrc"
        alt="Final frame"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { initAnimations } from "./case2-gsap-animations.js";
import { cleanupAnimations } from "./gsap-utils.js";
import { getImagePath, getVideoPath } from "@/utils/mediaResolver.js";

const router = useRouter();

const videoSrc = getVideoPath("case2-video.mp4");

const finalImageSrc = getImagePath("case2-comparison.png");

const containerRef = ref(null);

const titlePart1Words = computed(() => ["Redesigning", "the", "Employee"]);
const titlePart2Words = computed(() => ["Comms", "mobile", "experience"]);

const descriptionPart1 = "Redesigning the Employee Comms mobile experience used by global teams ";
const descriptionPart2 = " and improving content variety, information discoverability, and overall usability with recognized excellence ";
const descriptionPart3 = " by G2";

const googleLogo = getImagePath("case2-logo-google.svg");
const cocaColaLogo = getImagePath("case2-logo-coca-cola.svg");
const lorealLogo = getImagePath("case2-logo-loreal.svg");
const g2Badge = getImagePath("case2-badge-g2.png");

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

// Handle story link click
const handleStoryLinkClick = (event) => {
  event.preventDefault();
  router.push("/story/two");
};
</script>

<style scoped>
.case2 {
  position: relative;
  width: 100%;
  height: 300vh;
  background-color: #ffffff;
  overflow: hidden;
}

.case2-content {
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.case2-content-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: clamp(16px, 2vh, 24px);
  max-width: min(48vw, 800px);
  width: 100%;
  pointer-events: auto;
  padding: clamp(24px, 3vw, 40px) clamp(28px, 3.5vw, 48px);
  z-index: 1;
}

.case2-company {
  font-family: 'Hanken Grotesk', sans-serif;
  font-style: normal;
  font-weight: 590;
  font-size: clamp(16px, 1.2vw, 21px);
  line-height: 25px;
  color: #B39999;
  margin: 0;
  margin-bottom: -18px;
  opacity: 0;
}

.case2-title {
  margin: 0;
  font-family: 'Hanken Grotesk', sans-serif;
  font-weight: 500;
  font-size: clamp(32px, 3vw, 56px);
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
  margin-top: clamp(7px, 2vh, 23px);
  margin-bottom: clamp(17px, 3vh, 33px);
  font-weight: 400;
  font-size: clamp(18px, 1.6vw, 26px);
  line-height: 2;
  color: rgba(0, 0, 0, 0.7);
  text-align: left;
}

.case2-paragraph-part1,
.case2-paragraph-part2 {
  opacity: 0;
}

.client-logo {
  height: 32px;
  width: auto;
  display: inline-block;
  vertical-align: middle;
  margin: 0 8px;
  transform: translateY(-2px);
}

.client-logo-google {
  height: 36px;
  transform: translateY(1px);
}

.client-logo-loreal {
  height: 26px;
  transform: translateY(-2px);
}

.awards-badge {
  height: 70px;
  width: auto;
  display: inline-block;
  vertical-align: middle;
  margin-left: 0;
}

.case2-open-story {
  background: #F7E7E7;
  border: none;
  font-family: 'Hanken Grotesk', sans-serif;
  font-weight: 600;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9b382d;
  cursor: pointer;
  padding: 0 24px 0 29px;
  gap: 10px;
  opacity: 0;
  width: 95%;
  height: 82px;
  border-radius: 16px;
  transition: background 0.3s ease;
  text-decoration: none;
}

.case2-open-story:hover {
  background: rgba(247, 231, 231, 0.8);
}

.case2-icon {
  height: 23px;
  width: auto;
  display: block;
  transform: translateY(0px);
}

.case2-image-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100vh;
  z-index: 1;
  overflow: hidden;
  padding: 16px;
}

.case2-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 12px;
}

.case2-final-image {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  bottom: 16px;
  width: calc(100% - 32px);
  height: calc(100% - 32px);
  object-fit: cover;
  object-position: center;
  opacity: 0;
  z-index: 2;
  border-radius: 12px;
}

@media (max-width: 767px) {
  .case2 {
    height: auto;
    min-height: 100vh;
  }

  .case2-content {
    width: 100%;
    padding: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  .case2-content-inner {
    width: calc(100vw - 48px);
    max-width: calc(100vw - 48px);
    padding: 0 24px;
    align-items: center;
    text-align: center;
    gap: clamp(16px, 3vh, 24px);
  }

  .case2-company {
    text-align: center;
  }

  .case2-title {
    text-align: center;
    width: 100%;
  }

  .case2-paragraph {
    text-align: center;
    width: 100%;
  }

  .case2-open-story {
    width: 100%;
  }

  .case2-image-container {
    display: none;
  }

  .case2-video {
    display: none;
  }

  .case2-final-image {
    display: none;
  }
}

@media (min-width: 768px) and (max-width: 899px) {
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
    height: 23px;
    width: auto;
    transform: translateY(-1px);
  }

  .case2-image-container {
    min-height: 50vh;
  }

  .case2-video {
    object-fit: contain;
  }

  .case2-final-image {
    object-fit: contain;
  }
}

</style>
