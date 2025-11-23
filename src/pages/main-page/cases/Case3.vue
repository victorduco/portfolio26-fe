<template>
  <!-- scroll-container: внешний контейнер для скролла -->
  <div id="case3" class="scroll-container" ref="scrollContainerRef">
    <!-- pin-container: pinned элемент -->
    <div class="pin-container" ref="pinContainerRef">
      <!-- section-1: основная секция с контентом -->
      <div class="section-1">
        <!-- content: все анимируемые объекты -->
        <div class="content">
          <CloudCorners ref="cloudCornersRef" />

          <div class="case3-container">
            <div class="case3-text-section" ref="textSection">
              <div class="case3-company-title-group">
                <div class="case3-tags-container" ref="tagsElement">
                  <template v-for="(tag, index) in tags" :key="tag">
                    <span class="case3-tag">{{ tag }}</span>
                    <svg
                      v-if="index < tags.length - 1"
                      class="case3-tag-separator"
                      width="12"
                      height="14"
                      viewBox="0 0 24 29"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2.04785C11.0513 2.04785 10.2734 2.81756 10.2734 3.75977C10.2737 4.70179 11.0515 5.4707 12 5.4707C12.9485 5.47061 13.7254 4.70173 13.7256 3.75977C13.7256 2.81762 12.9486 2.04795 12 2.04785ZM9.93164 6.79004L9.88867 6.75977C8.907 6.07995 8.30577 4.95598 8.30566 3.75977C8.30566 1.7427 9.96197 0.0996094 12 0.0996094C14.0379 0.0997302 15.6943 1.74298 15.6943 3.75977C15.6942 4.95593 15.0928 6.07997 14.1113 6.75977L14.0684 6.79004V7.61914H15.4854L15.5137 7.59375C15.8855 7.2664 16.3711 7.08208 16.8779 7.08203C18.0214 7.08203 18.9463 7.99913 18.9463 9.12988C18.9463 10.2606 18.0214 11.1777 16.8779 11.1777C16.3711 11.1777 15.8855 10.9934 15.5137 10.666L15.4854 10.6406H14.0684V21.6641C14.0684 21.8623 14.1591 22.0418 14.3125 22.1621C14.4664 22.2827 14.6596 22.3272 14.8564 22.2832L14.8574 22.2822C17.1427 21.7431 18.5901 20.8739 19.2119 19.6084L19.2529 19.5234L19.1709 19.4775L18.165 18.9092C18.0389 18.8331 17.9556 18.7051 17.9424 18.5674C17.9292 18.4234 17.9861 18.2883 18.0967 18.1963L22.417 14.582L22.416 14.5811C22.541 14.4801 22.7143 14.4513 22.8623 14.5117L22.8643 14.5127C23.0134 14.5692 23.1191 14.7041 23.1367 14.8652V14.8672L23.8955 20.9893L23.8965 20.9902C23.9183 21.1509 23.8483 21.3069 23.7119 21.3984L23.709 21.4004C23.5952 21.4831 23.4458 21.5012 23.3115 21.4541L23.2549 21.4297L22.1055 20.8389L22.0283 20.7998L21.9785 20.8711C21.3415 21.7804 19.6621 23.9276 17.2842 25.0977C14.1213 26.6494 12.9137 27.7855 12.4717 28.5225L12.3955 28.6602C12.3757 28.6945 12.3595 28.7178 12.3418 28.7354L12.333 28.7441L12.3262 28.7549C12.3185 28.7676 12.3089 28.7774 12.2959 28.7852L12.2852 28.791L12.2764 28.7998C12.2587 28.8174 12.2348 28.8329 12.2002 28.8525C12.1771 28.8635 12.1527 28.8723 12.1191 28.8818L12.1152 28.8838C12.0793 28.8957 12.0414 28.9004 12 28.9004C11.9586 28.9004 11.9207 28.8957 11.8848 28.8838C11.8516 28.8728 11.8259 28.864 11.8008 28.8516L11.7871 28.8447C11.7594 28.8283 11.739 28.8151 11.7236 28.7998L11.7148 28.791L11.7041 28.7852C11.6911 28.7774 11.6815 28.7675 11.6738 28.7549L11.667 28.7441L11.6582 28.7354C11.6413 28.7185 11.625 28.6959 11.6064 28.6592C11.2381 27.9356 10.0898 26.753 6.71582 25.0977C4.33777 23.9274 2.6584 21.7802 2.02148 20.8711L1.97168 20.7998L1.89453 20.8389L0.745117 21.4297C0.597547 21.505 0.421166 21.495 0.291016 21.4004L0.288086 21.3984L0.240234 21.3613C0.135756 21.2679 0.0843928 21.1308 0.103516 20.9902L0.104492 20.9893L0.863281 14.8672V14.8652C0.880913 14.7042 0.985755 14.5693 1.13477 14.5127H1.13672C1.29138 14.4514 1.45915 14.4814 1.58398 14.583L5.90332 18.1963C6.01387 18.2883 6.07083 18.4234 6.05762 18.5674C6.04443 18.7053 5.96039 18.8331 5.83398 18.9092L4.82812 19.4775L4.74609 19.5234L4.78809 19.6084C5.40976 20.8739 6.8564 21.7431 9.1416 22.2822L9.14258 22.2832C9.33955 22.3273 9.53355 22.2829 9.6875 22.1621C9.84091 22.0417 9.93164 21.8623 9.93164 21.6641V10.6406H8.51465L8.48633 10.666C8.11445 10.9935 7.62807 11.1777 7.12109 11.1777C5.97775 11.1776 5.05371 10.2605 5.05371 9.12988C5.05371 7.99924 5.97775 7.08221 7.12109 7.08203C7.62807 7.08203 8.11445 7.26622 8.48633 7.59375L8.51465 7.61914H9.93164V6.79004Z"
                        fill="#C33D33"
                        stroke="#C33D33"
                        stroke-width="0.2"
                      />
                    </svg>
                  </template>
                </div>
                <div class="case3-title-wrapper" ref="titleElement">
                  <h2 class="case3-title case3-title-shadow">
                    {{ title }}
                  </h2>
                  <h2 class="case3-title case3-title-main" aria-hidden="true">
                    {{ title }}
                  </h2>
                </div>
                <p class="case3-description" ref="descriptionElement">
                  {{ description }}
                </p>
              </div>
              <a
                href="/story/three"
                class="case3-button-wrapper"
                ref="buttonElement"
                @click.prevent="handleStoryLinkClick"
              >
                <div class="case3-button case3-button-shadow"></div>
                <div class="case3-button case3-button-main">
                  <svg
                    class="case3-button-icon"
                    width="24"
                    height="29"
                    viewBox="0 0 24 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2.04785C11.0513 2.04785 10.2734 2.81756 10.2734 3.75977C10.2737 4.70179 11.0515 5.4707 12 5.4707C12.9485 5.47061 13.7254 4.70173 13.7256 3.75977C13.7256 2.81762 12.9486 2.04795 12 2.04785ZM9.93164 6.79004L9.88867 6.75977C8.907 6.07995 8.30577 4.95598 8.30566 3.75977C8.30566 1.7427 9.96197 0.0996094 12 0.0996094C14.0379 0.0997302 15.6943 1.74298 15.6943 3.75977C15.6942 4.95593 15.0928 6.07997 14.1113 6.75977L14.0684 6.79004V7.61914H15.4854L15.5137 7.59375C15.8855 7.2664 16.3711 7.08208 16.8779 7.08203C18.0214 7.08203 18.9463 7.99913 18.9463 9.12988C18.9463 10.2606 18.0214 11.1777 16.8779 11.1777C16.3711 11.1777 15.8855 10.9934 15.5137 10.666L15.4854 10.6406H14.0684V21.6641C14.0684 21.8623 14.1591 22.0418 14.3125 22.1621C14.4664 22.2827 14.6596 22.3272 14.8564 22.2832L14.8574 22.2822C17.1427 21.7431 18.5901 20.8739 19.2119 19.6084L19.2529 19.5234L19.1709 19.4775L18.165 18.9092C18.0389 18.8331 17.9556 18.7051 17.9424 18.5674C17.9292 18.4234 17.9861 18.2883 18.0967 18.1963L22.417 14.582L22.416 14.5811C22.541 14.4801 22.7143 14.4513 22.8623 14.5117L22.8643 14.5127C23.0134 14.5692 23.1191 14.7041 23.1367 14.8652V14.8672L23.8955 20.9893L23.8965 20.9902C23.9183 21.1509 23.8483 21.3069 23.7119 21.3984L23.709 21.4004C23.5952 21.4831 23.4458 21.5012 23.3115 21.4541L23.2549 21.4297L22.1055 20.8389L22.0283 20.7998L21.9785 20.8711C21.3415 21.7804 19.6621 23.9276 17.2842 25.0977C14.1213 26.6494 12.9137 27.7855 12.4717 28.5225L12.3955 28.6602C12.3757 28.6945 12.3595 28.7178 12.3418 28.7354L12.333 28.7441L12.3262 28.7549C12.3185 28.7676 12.3089 28.7774 12.2959 28.7852L12.2852 28.791L12.2764 28.7998C12.2587 28.8174 12.2348 28.8329 12.2002 28.8525C12.1771 28.8635 12.1527 28.8723 12.1191 28.8818L12.1152 28.8838C12.0793 28.8957 12.0414 28.9004 12 28.9004C11.9586 28.9004 11.9207 28.8957 11.8848 28.8838C11.8516 28.8728 11.8259 28.864 11.8008 28.8516L11.7871 28.8447C11.7594 28.8283 11.739 28.8151 11.7236 28.7998L11.7148 28.791L11.7041 28.7852C11.6911 28.7774 11.6815 28.7675 11.6738 28.7549L11.667 28.7441L11.6582 28.7354C11.6413 28.7185 11.625 28.6959 11.6064 28.6592C11.2381 27.9356 10.0898 26.753 6.71582 25.0977C4.33777 23.9274 2.6584 21.7802 2.02148 20.8711L1.97168 20.7998L1.89453 20.8389L0.745117 21.4297C0.597547 21.505 0.421166 21.495 0.291016 21.4004L0.288086 21.3984L0.240234 21.3613C0.135756 21.2679 0.0843928 21.1308 0.103516 20.9902L0.104492 20.9893L0.863281 14.8672V14.8652C0.880913 14.7042 0.985755 14.5693 1.13477 14.5127H1.13672C1.29138 14.4514 1.45915 14.4814 1.58398 14.583L5.90332 18.1963C6.01387 18.2883 6.07083 18.4234 6.05762 18.5674C6.04443 18.7053 5.96039 18.8331 5.83398 18.9092L4.82812 19.4775L4.74609 19.5234L4.78809 19.6084C5.40976 20.8739 6.8564 21.7431 9.1416 22.2822L9.14258 22.2832C9.33955 22.3273 9.53355 22.2829 9.6875 22.1621C9.84091 22.0417 9.93164 21.8623 9.93164 21.6641V10.6406H8.51465L8.48633 10.666C8.11445 10.9935 7.62807 11.1777 7.12109 11.1777C5.97775 11.1776 5.05371 10.2605 5.05371 9.12988C5.05371 7.99924 5.97775 7.08221 7.12109 7.08203C7.62807 7.08203 8.11445 7.26622 8.48633 7.59375L8.51465 7.61914H9.93164V6.79004Z"
                      fill="white"
                      stroke="#C33D33"
                      stroke-width="0.2"
                    />
                  </svg>
                  <span class="case3-button-text">Open Story</span>
                </div>
              </a>
            </div>

            <div class="case3-image-section" ref="imageContainer">
              <div
                class="case3-media-container"
                :style="{ backgroundImage: `url(${imageSrc})` }"
                ref="mediaContainer"
              >
                <div
                  v-if="videoSrc"
                  class="case3-video-container"
                  :style="{
                    left: videoPositionX,
                    top: videoPositionY,
                    '--video-scale': videoScale,
                  }"
                >
                  <video
                    :src="videoSrc"
                    class="case3-video"
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

      <!-- section-2: буфер для дополнительного пространства после анимации -->
      <div class="section-2"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { gsap } from "gsap";
import CloudCorners from "./CloudCorners.vue";
import { initAnimations } from "./case3-gsap-animations.js";
import { cleanupAnimations } from "./gsap-utils.js";
import { getImagePath, getVideoPath } from "@/utils/mediaResolver.js";

const router = useRouter();
const route = useRoute();

// Check if we should skip animations (returning from story page)
const shouldSkipAnimation = computed(() => route.meta?.skipNavIntro === true);

// Content data
const title = "Field Operations App for Oil Terminals";
const tags = ["Consultancy", "Redesign", "Mentorship"];
const description =
  "A full redesign focused on improving app usability in the field and creating a more pleasant, smooth experience.";
const imageSrc = getImagePath("case3-ipad.png");
const videoSrc = getVideoPath("case3-video.mp4");

// Video positioning (relative to media container)
const videoPositionX = "4.5%";
const videoPositionY = "44%";
const videoScale = 0.45;

// Refs
const scrollContainerRef = ref(null);
const pinContainerRef = ref(null);
const textSection = ref(null);
const tagsElement = ref(null);
const titleElement = ref(null);
const descriptionElement = ref(null);
const buttonElement = ref(null);
const imageContainer = ref(null);
const mediaContainer = ref(null);
const videoElement = ref(null);
const cloudCornersRef = ref(null);

// Animation instance
let animationInstance = null;

onMounted(() => {
  // Initialize GSAP animations with ScrollTrigger
  if (pinContainerRef.value) {
    animationInstance = initAnimations(
      pinContainerRef.value,
      {
        tagsElement: tagsElement.value,
        titleElement: titleElement.value,
        descriptionElement: descriptionElement.value,
        buttonElement: buttonElement.value,
        imageContainer: imageContainer.value,
        videoElement: videoElement.value,
        cloudCorners: cloudCornersRef.value,
      },
      shouldSkipAnimation.value
    );
  }
});

// Watch for route changes - if returning from story, set elements to final state
watch(
  () => route.meta?.skipNavIntro,
  (skipIntro) => {
    if (skipIntro && buttonElement.value && imageContainer.value) {
      gsap.set(imageContainer.value, { scale: 1 });
      gsap.set(tagsElement.value, { opacity: 1, scale: 1 });
      gsap.set(titleElement.value, { opacity: 1, scale: 1, x: 0, y: 0 });
      gsap.set(descriptionElement.value, { opacity: 1, scale: 1 });
      gsap.set(buttonElement.value, { opacity: 1, scale: 1 });
      if (cloudCornersRef.value?.$el) {
        gsap.set(cloudCornersRef.value.$el, { opacity: 1 });
      }
    }
  }
);

onUnmounted(() => {
  cleanupAnimations(animationInstance);
  animationInstance = null;
});

// Handle story link click
const handleStoryLinkClick = (event) => {
  event.preventDefault();
  router.push("/story/three");
};

defineExpose({
  handleStoryLinkClick,
});
</script>

<style scoped>
/* ========================================
   scroll-container: внешний контейнер
   ======================================== */
.scroll-container {
  width: 100%;
  background-color: #b9e2f7;
  position: relative;
}

/* ========================================
   pin-container: контейнер для всех секций
   ======================================== */
.pin-container {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* ========================================
   section-1, section-2: триггеры
   ======================================== */
.section-1 {
  width: 100%;
  height: 300vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.section-2 {
  width: 100%;
  height: 50vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
}

/* ========================================
   content: контейнер для всех анимируемых объектов
   ======================================== */
.content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  display: flex;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;
}

.content > * {
  pointer-events: auto;
}

/* Container with 80% width */
.case3-container {
  width: 48%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
  gap: 0;
}

/* Text Section: 60% height */
.case3-text-section {
  width: 100%;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(28px, 3.5vh, 45px);
  padding-bottom: 0;
}

/* Company and Title Group Container */
.case3-company-title-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

/* Tags container */
.case3-tags-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  opacity: 0; /* Initial state for GSAP */
  margin-bottom: -36px;
}

/* Individual tag styling */
.case3-tag {
  margin: 0;
  font-family: "Neue Haas Grotesk Display Pro", -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: clamp(15px, 1.06vw, 17px);
  line-height: 1.23;
  text-align: center;
  color: #143154;
}

/* Tag separator - anchor icon */
.case3-tag-separator {
  width: clamp(8px, 0.65vw, 10.5px);
  height: auto;
  flex-shrink: 0;
}

/* Title wrapper with hard shadow effect */
.case3-title-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
  opacity: 0; /* Initial state for GSAP */
}

/* Base title styling */
.case3-title {
  margin: 0;
  font-family: "Neue Haas Grotesk Display Pro", -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: clamp(36px, 3.2vw, 78px);
  line-height: 1.21;
  text-align: center;
  width: 100%;
  max-width: 100%;
  padding: 0 20px;
}

/* Shadow layer (back) */
.case3-title-shadow {
  position: absolute;
  top: 4px;
  left: 5px;
  color: rgba(10, 49, 74, 0.21);
  z-index: 0;
}

/* Main layer (front) */
.case3-title-main {
  position: relative;
  color: #143154;
  z-index: 1;
}

/* Company/Subtitle Styling from Figma */
.case3-company {
  margin: 0;
  font-family: var(--font-family-base);
  font-style: normal;
  font-weight: 600;
  font-size: clamp(14px, 1.2vw, 19px);
  line-height: 1;
  text-align: center;
  color: rgba(30, 66, 109, 0.75);
  width: 100%;
  max-width: 100%;
  opacity: 0; /* Initial state for GSAP */
}

/* Description Styling */
.case3-description {
  margin: 0;
  font-family: "Neue Haas Grotesk Display Pro", -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: clamp(16.5px, 1.1vw, 23px);
  line-height: 1.23;
  text-align: center;
  color: #143154;
  width: 100%;
  max-width: 100%;
  opacity: 0; /* Initial state for GSAP */
}

/* Button wrapper with hard shadow effect */
.case3-button-wrapper {
  position: relative;
  width: clamp(290px, 24vw, 380px);
  height: clamp(48px, 4vw, 67px);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  margin-top: 0;
  transition: transform 0.2s ease;
  opacity: 0; /* Initial state for GSAP */
  text-decoration: none;
  display: block;
  pointer-events: auto;
  z-index: 10; /* Ensure it's on top */
}

.case3-button-wrapper:hover .case3-button-main {
  transform: translate(2px, 2.5px);
}

.case3-button-wrapper:active .case3-button-main {
  transform: translate(4px, 5px);
}

/* Base button styling */
.case3-button {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Neue Haas Grotesk Display Pro", -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: clamp(16px, 1.3vw, 21px);
  line-height: 1;
  pointer-events: none;
}

/* Shadow layer (back) */
.case3-button-shadow {
  top: 10px;
  left: 8px;
  background: #1e426d;
  z-index: 0;
}

/* Main layer (front) */
.case3-button-main {
  top: 0;
  left: 0;
  background: linear-gradient(91.24deg, #ca4034 1.06%, #992c28 74.69%);
  color: white;
  z-index: 1;
  position: relative;
  transition: transform 0.25s ease;
}

/* Button icon */
.case3-button-icon {
  position: absolute;
  left: clamp(18px, 1.5vw, 24px);
  width: clamp(18px, 1.5vw, 24px);
  height: auto;
  flex-shrink: 0;
  pointer-events: none;
}

/* Button text */
.case3-button-text {
  flex-shrink: 0;
  pointer-events: none;
}

/* Image Section: 40% height */
.case3-image-section {
  width: 100%;
  flex: 0 0 auto;
  max-height: 50vh;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: visible;
  position: relative;
  will-change: transform;
  transition: transform 0.1s ease-out;
  opacity: 1; /* Always visible */
  transform: scale(1.5); /* Start with scale 1.5 */
  padding-bottom: 0;
  margin-bottom: 0;
}

/* Media container - holds both image and video */
.case3-media-container {
  position: relative;
  width: 100%;
  aspect-ratio: 2550 / 1912; /* Match image dimensions */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center bottom;
  opacity: 1;
  transform-origin: center bottom;
  will-change: transform;
  border-radius: 15px 15px 0 0;
  overflow: hidden;
}

/* Video container */
.case3-video-container {
  position: absolute;
  aspect-ratio: 1488 / 592; /* Match actual video dimensions */
  border-radius: 15px;
  overflow: hidden;
  /* Use percentage of parent container */
  /* Since parent has fixed aspect-ratio matching the image, */
  /* the video will scale proportionally with the image */
  width: calc(var(--video-scale, 0.25) * 100%);
  height: auto;
}

/* Video overlay */
.case3-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  pointer-events: none;
  z-index: 1;
  border-radius: 15px;
  overflow: hidden;
  clip-path: inset(0 round 15px);
}

/* Fade-in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Large Desktop - increase all element sizes */
@media (min-width: 1920px) {
  .case3-title {
    font-size: clamp(78px, 5.12vw, 92px);
    line-height: 1.19;
  }

  .case3-company {
    font-size: clamp(19px, 1.3vw, 22px);
  }

  .case3-tag {
    font-size: clamp(17px, 1.15vw, 20px);
  }

  .case3-tag-separator {
    width: clamp(10.5px, 0.7vw, 12px);
  }

  .case3-description {
    font-size: clamp(23px, 1.54vw, 27.5px);
  }

  .case3-button-wrapper {
    width: clamp(380px, 25vw, 435px);
    height: clamp(67px, 4.2vw, 78px);
  }

  .case3-button {
    font-size: clamp(21px, 1.4vw, 24px);
  }

  .case3-button-icon {
    width: clamp(24px, 1.6vw, 28px);
    left: clamp(24px, 1.6vw, 28px);
  }

  .case3-title-shadow {
    top: 5px;
    left: 6px;
  }

  .case3-button-shadow {
    top: 11px;
    left: 9px;
  }
}

/* Mobile Responsive */
@media (max-width: 767px) {
  .scroll-container {
    min-height: 100vh;
  }

  .section-1 {
    height: 100vh;
  }

  .content {
    align-items: center;
    justify-content: center;
  }

  .case3-container {
    width: 100%;
    max-width: 100%;
    padding-left: clamp(16px, 4vw, 32px);
    padding-right: clamp(16px, 4vw, 32px);
    box-sizing: border-box;
    justify-content: center;
  }

  .case3-text-section {
    width: 100%;
    height: auto;
    flex: none;
    gap: 32px;
  }

  .case3-company-title-group {
    width: 100%;
    gap: 32px;
  }

  .case3-tags-container {
    width: 100%;
    margin-bottom: 0;
  }

  .case3-button-wrapper {
    margin-top: 32px;
  }

  .case3-title-wrapper {
    width: 100%;
  }

  .case3-title {
    width: 100%;
    padding: 0;
  }

  .case3-description {
    width: 100%;
  }

  .case3-button-wrapper {
    width: 100%;
    max-width: 100%;
  }

  .case3-image-section {
    display: none;
  }

  .case3-media-container {
    display: none;
  }

  .case3-video-container {
    display: none;
  }

  .case3-video {
    display: none;
  }

  /* Hide CloudCorners on mobile */
  .content > :first-child {
    display: none;
  }
}

@media (min-width: 768px) and (max-width: 899px) {
  .case3-container {
    width: 90%;
  }

  .case3-text-section {
    height: 25%;
    gap: clamp(10px, 1.2vh, 16px);
  }

  .case3-image-section {
    height: 75%;
  }

  .case3-title {
    font-size: clamp(28px, 5vw, 40px);
  }

  .case3-company {
    font-size: clamp(12px, 2.5vw, 16px);
  }

  .case3-tag {
    font-size: clamp(13px, 2.6vw, 15px);
  }

  .case3-tag-separator {
    width: clamp(7px, 1.5vw, 9px);
  }

  .case3-description {
    font-size: clamp(14.3px, 2.86vw, 19.8px);
  }

  .case3-button-wrapper {
    width: clamp(250px, 72vw, 330px);
    height: clamp(42px, 10vw, 58px);
  }

  .case3-button {
    font-size: clamp(14px, 3.5vw, 18px);
  }

  .case3-button-icon {
    width: clamp(16px, 4vw, 20px);
  }
}
</style>
