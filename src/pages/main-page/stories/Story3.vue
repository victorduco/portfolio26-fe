<template>
  <div id="story3" class="scroll-container" ref="scrollContainerRef">
    <div class="pin-container" ref="pinContainerRef">
      <div class="section-1">
        <div class="content">
          <CloudCorners ref="cloudCornersRef" />

          <div class="story3-container">
            <div class="story3-text-section" ref="textSection">
              <div class="story3-company-title-group">
                <div class="story3-tags-container" ref="tagsElement">
                  <template v-for="(tag, index) in tags" :key="tag">
                    <span class="story3-tag">{{ tag }}</span>
                    <img
                      v-if="index < tags.length - 1"
                      :src="anchorRedIcon"
                      alt=""
                      class="story3-tag-separator"
                    />
                  </template>
                </div>
                <div class="story3-title-wrapper" ref="titleElement">
                  <h2 class="story3-title story3-title-shadow">
                    {{ title }}
                  </h2>
                  <h2 class="story3-title story3-title-main" aria-hidden="true">
                    {{ title }}
                  </h2>
                </div>
                <p class="story3-description" ref="descriptionElement">
                  {{ description }}
                </p>
              </div>
              <a
                href="/story/three"
                class="story3-button-wrapper"
                ref="buttonElement"
                @click.prevent="handleStoryLinkClick"
              >
                <div class="story3-button story3-button-shadow"></div>
                <div class="story3-button story3-button-main">
                  <img :src="anchorWhiteIcon" alt="" class="story3-button-icon" />
                  <span class="story3-button-text">Open Story</span>
                </div>
              </a>
            </div>

            <div class="story3-image-section" ref="imageContainer">
              <div
                class="story3-media-container"
                :style="{ backgroundImage: `url(${imageSrc})` }"
                ref="mediaContainer"
              >
                <div
                  v-if="videoSrc"
                  class="story3-video-container"
                  :style="{
                    left: videoPositionX,
                    top: videoPositionY,
                    '--video-scale': videoScale,
                  }"
                >
                  <video
                    :src="videoSrc"
                    class="story3-video"
                    muted
                    playsinline
                    ref="videoElement"
                  ></video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import CloudCorners from "./CloudCorners.vue";
import { initAnimations } from "./story3-gsap-animations.js";
import { cleanupAnimations } from "./gsap-utils.js";
import { getImagePath, getVideoPath } from "@/utils/mediaResolver.js";
import anchorRedIcon from "@/assets/icons/anchor-red.svg";
import anchorWhiteIcon from "@/assets/icons/anchor-white.svg";

const router = useRouter();
const route = useRoute();

const shouldSkipAnimation = computed(() => route.meta?.skipNavIntro === true);

const title = "Field Operations App for\u00A0Oil\u00A0Terminals";
const tags = ["Consultancy", "Redesign", "Mentorship"];
const description = "A full redesign focused on improving app usability in the field and creating a more pleasant, smooth experience.";
const imageSrc = getImagePath("story3-ipad.png");
const videoSrc = getVideoPath("story3-video.mp4");
const videoPositionX = "4.25%", videoPositionY = "53.1%", videoScale = 0.45;

const scrollContainerRef = ref(null), pinContainerRef = ref(null), textSection = ref(null);
const tagsElement = ref(null), titleElement = ref(null), descriptionElement = ref(null);
const buttonElement = ref(null), imageContainer = ref(null), mediaContainer = ref(null);
const videoElement = ref(null), cloudCornersRef = ref(null);
let animationInstance = null;

onMounted(() => {
  if (pinContainerRef.value) {
    animationInstance = initAnimations(pinContainerRef.value, {
      tagsElement: tagsElement.value, titleElement: titleElement.value,
      descriptionElement: descriptionElement.value, buttonElement: buttonElement.value,
      imageContainer: imageContainer.value, videoElement: videoElement.value,
      cloudCorners: cloudCornersRef.value
    }, shouldSkipAnimation.value);
  }
});


onUnmounted(() => { cleanupAnimations(animationInstance); animationInstance = null; });

const handleStoryLinkClick = (event) => { event.preventDefault(); router.push("/story/three"); };

defineExpose({ handleStoryLinkClick });
</script>

<style scoped>
:root {
  --font-story3: "Neue Haas Grotesk Display Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.scroll-container { width: 100%; background-color: #b9e2f7; position: relative; }
.pin-container { width: 100%; position: relative; display: flex; flex-direction: column; }
.section-1 { width: 100%; height: 300vh; position: relative; display: flex; align-items: center; justify-content: center; z-index: 1; }
.content { position: absolute; top: 0; left: 0; width: 100%; height: 100vh; pointer-events: none; display: flex; align-items: stretch; justify-content: center; overflow: hidden; }
.content > * { pointer-events: auto; }
.story3-container { width: 48%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; }

.story3-text-section { width: 100%; flex: 1 1 auto; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: clamp(28px, 3.5vh, 45px); padding-top: clamp(60px, 10vh, 120px); padding-bottom: clamp(30px, 5vh, 60px); }
.story3-company-title-group { width: 100%; display: flex; flex-direction: column; align-items: center; gap: clamp(16px, 2.5vh, 32px); }
.story3-tags-container { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; opacity: 0; }

.story3-tag, .story3-description { margin: 0; font-family: var(--font-story3); font-weight: 600; font-size: clamp(16.5px, 1.1vw, 23px); line-height: 1.23; text-align: center; color: rgba(20, 49, 84, 0.75); }
.story3-tag-separator { width: clamp(8px, 0.65vw, 10.5px); height: auto; flex-shrink: 0; }
.story3-title-wrapper { position: relative; width: 100%; opacity: 0; }
.story3-title { margin: 0; font-family: var(--font-story3); font-weight: 600; font-size: clamp(30px, 3.2vw, 70px); line-height: 1.2; text-align: center; width: 100%; padding: 0 20px; }
.story3-title-shadow { position: absolute; top: 4px; left: 5px; color: rgba(10, 49, 74, 0.15); z-index: 0; }
.story3-title-main { position: relative; color: #143154; z-index: 1; }
.story3-description { width: 100%; opacity: 0; }

.story3-button-wrapper { position: relative; width: clamp(290px, 24vw, 380px); height: clamp(48px, 4vw, 67px); cursor: pointer; opacity: 0; text-decoration: none; display: block; pointer-events: auto; z-index: 10; }
.story3-button-wrapper:hover .story3-button-main { transform: translate(2px, 2.5px); }
.story3-button-wrapper:active .story3-button-main { transform: translate(4px, 5px); }
.story3-button { position: absolute; width: 100%; height: 100%; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-family: var(--font-story3); font-weight: 600; font-size: clamp(16px, 1.3vw, 21px); pointer-events: none; }
.story3-button-shadow { top: 10px; left: 8px; background: #1e426d; z-index: 0; }
.story3-button-main { top: 0; left: 0; background: linear-gradient(91.24deg, #ca4034 1.06%, #992c28 74.69%); color: white; z-index: 1; position: relative; transition: transform 0.25s ease; }
.story3-button-icon { position: absolute; left: clamp(18px, 1.5vw, 24px); width: clamp(18px, 1.5vw, 24px); height: auto; pointer-events: none; }
.story3-button-text { pointer-events: none; }

.story3-image-section { width: 100%; flex: 0 0 auto; max-height: 50vh; display: flex; align-items: flex-end; justify-content: center; overflow: visible; position: relative; will-change: transform; transform: scale(1.5); }
.story3-media-container { position: relative; width: 100%; aspect-ratio: 2550 / 1912; background-size: contain; background-repeat: no-repeat; background-position: center bottom; transform-origin: center bottom; will-change: transform; border-radius: 15px 15px 0 0; overflow: hidden; }
.story3-video-container { position: absolute; aspect-ratio: 1488 / 592; border-radius: 15px; overflow: hidden; width: calc(var(--video-scale, 0.25) * 100%); height: auto; }
.story3-video { width: 100%; height: 100%; object-fit: cover; pointer-events: none; border-radius: 15px; clip-path: inset(0 round 15px); }


@media (max-width: 767px) {
  .scroll-container { min-height: 100vh; }
  .section-1 { height: 100vh; }
  .content { align-items: center; justify-content: center; }
  .story3-container {
    width: 100%;
    padding-left: clamp(16px, 4vw, 32px);
    padding-right: clamp(16px, 4vw, 32px);
    box-sizing: border-box;
    justify-content: center;
  }
  .story3-text-section { flex: none; gap: 32px; }
  .story3-company-title-group { gap: 32px; }
  .story3-button-wrapper { margin-top: 32px; width: 100%; }
  .story3-title { padding: 0; }
  .story3-image-section, .story3-media-container, .story3-video-container, .story3-video { display: none; }
  .content > :first-child { display: none; }
}

@media (min-width: 768px) and (max-width: 899px) {
  .story3-container { width: 90%; }
  .story3-text-section { height: 25%; gap: clamp(10px, 1.2vh, 16px); }
  .story3-image-section { height: 75%; }
  .story3-title { font-size: clamp(28px, 5vw, 40px); }
  .story3-tag { font-size: clamp(13px, 2.6vw, 15px); }
  .story3-tag-separator { width: clamp(7px, 1.5vw, 9px); }
  .story3-description { font-size: clamp(14.3px, 2.86vw, 19.8px); }
  .story3-button-wrapper { width: clamp(250px, 72vw, 330px); height: clamp(42px, 10vw, 58px); }
  .story3-button { font-size: clamp(14px, 3.5vw, 18px); }
  .story3-button-icon { width: clamp(16px, 4vw, 20px); }
}
</style>
