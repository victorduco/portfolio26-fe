<template>
  <section class="s3ns">
    <div class="s3ns-container">
      <div class="s3ns-text-section">
        <div class="s3ns-company-title-group">
          <div class="s3ns-tags-container">
            <template v-for="(tag, index) in tags" :key="tag">
              <span class="s3ns-tag">{{ tag }}</span>
              <img
                v-if="index < tags.length - 1"
                :src="anchorRedIcon"
                alt=""
                class="s3ns-tag-separator"
              />
            </template>
          </div>
          <div class="s3ns-title-wrapper">
            <h2 class="s3ns-title s3ns-title-shadow">
              {{ title }}
            </h2>
            <h2 class="s3ns-title s3ns-title-main" aria-hidden="true">
              {{ title }}
            </h2>
          </div>
          <p class="s3ns-description">
            {{ description }}
          </p>
        </div>
        <a
          href="/story/three"
          class="s3ns-button-wrapper"
          @click.prevent="$router.push('/story/three')"
        >
          <div class="s3ns-button s3ns-button-shadow"></div>
          <div class="s3ns-button s3ns-button-main">
            <img :src="anchorWhiteIcon" alt="" class="s3ns-button-icon" />
            <span class="s3ns-button-text">Open Story</span>
          </div>
        </a>
      </div>

      <div class="s3ns-image-section">
        <div
          class="s3ns-media-container"
          :style="{ backgroundImage: `url(${imageSrc})` }"
        ></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { getImagePath } from "@/utils/mediaResolver.js";
import anchorRedIcon from "@/assets/icons/anchor-red.svg";
import anchorWhiteIcon from "@/assets/icons/anchor-white.svg";

const title = "Field Operations App for\u00A0Oil\u00A0Terminals";
const tags = ["Consultancy", "Redesign", "Mentorship"];
const description = "A full redesign focused on improving app usability in the field and creating a more pleasant, smooth experience.";
const imageSrc = getImagePath("story3-ipad.png");
</script>

<style scoped>
:root {
  --font-story3: "Neue Haas Grotesk Display Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.s3ns {
  width: 100%;
  height: 100vh;
  background: #b9e2f7;
  display: flex;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;
}

.s3ns-container {
  width: 48%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.s3ns-text-section {
  width: 100%;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: clamp(28px, 3.5vh, 45px);
  padding-top: clamp(60px, 10vh, 120px);
  padding-bottom: clamp(30px, 5vh, 60px);
}

.s3ns-company-title-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(16px, 2.5vh, 32px);
}

.s3ns-tags-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}

.s3ns-tag,
.s3ns-description {
  margin: 0;
  font-family: var(--font-story3);
  font-weight: 600;
  font-size: clamp(16.5px, 1.1vw, 23px);
  line-height: 1.23;
  text-align: center;
  color: rgba(20, 49, 84, 0.75);
}

.s3ns-tag-separator {
  width: clamp(8px, 0.65vw, 10.5px);
  height: auto;
  flex-shrink: 0;
}

.s3ns-title-wrapper {
  position: relative;
  width: 100%;
}

.s3ns-title {
  margin: 0;
  font-family: var(--font-story3);
  font-weight: 600;
  font-size: clamp(30px, 3.2vw, 70px);
  line-height: 1.2;
  text-align: center;
  width: 100%;
  padding: 0 20px;
}

.s3ns-title-shadow {
  position: absolute;
  top: 4px;
  left: 5px;
  color: rgba(10, 49, 74, 0.15);
  z-index: 0;
}

.s3ns-title-main {
  position: relative;
  color: #143154;
  z-index: 1;
}

.s3ns-description {
  width: 100%;
}

.s3ns-button-wrapper {
  position: relative;
  width: clamp(290px, 24vw, 380px);
  height: clamp(48px, 4vw, 67px);
  cursor: pointer;
  text-decoration: none;
  display: block;
  pointer-events: auto;
  z-index: 10;
}

.s3ns-button-wrapper:hover .s3ns-button-main {
  transform: translate(2px, 2.5px);
}

.s3ns-button-wrapper:active .s3ns-button-main {
  transform: translate(4px, 5px);
}

.s3ns-button {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-story3);
  font-weight: 600;
  font-size: clamp(16px, 1.3vw, 21px);
  pointer-events: none;
}

.s3ns-button-shadow {
  top: 10px;
  left: 8px;
  background: #1e426d;
  z-index: 0;
}

.s3ns-button-main {
  top: 0;
  left: 0;
  background: linear-gradient(91.24deg, #ca4034 1.06%, #992c28 74.69%);
  color: white;
  z-index: 1;
  position: relative;
  transition: transform 0.25s ease;
}

.s3ns-button-icon {
  position: absolute;
  left: clamp(18px, 1.5vw, 24px);
  width: clamp(18px, 1.5vw, 24px);
  height: auto;
  pointer-events: none;
}

.s3ns-button-text {
  pointer-events: none;
}

.s3ns-image-section {
  width: 100%;
  flex: 0 0 auto;
  max-height: 50vh;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: visible;
  position: relative;
  will-change: transform;
}

.s3ns-media-container {
  position: relative;
  width: 100%;
  aspect-ratio: 2550 / 1912;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center bottom;
  transform-origin: center bottom;
  will-change: transform;
  border-radius: 15px 15px 0 0;
  overflow: hidden;
}

@media (max-width: 767px) {
  .s3ns {
    min-height: 100vh;
  }
  .s3ns-container {
    width: 100%;
    padding-left: clamp(16px, 4vw, 32px);
    padding-right: clamp(16px, 4vw, 32px);
    box-sizing: border-box;
    justify-content: center;
  }
  .s3ns-text-section {
    flex: none;
    gap: 32px;
  }
  .s3ns-company-title-group {
    gap: 32px;
  }
  .s3ns-button-wrapper {
    margin-top: 32px;
    width: 100%;
  }
  .s3ns-title {
    padding: 0;
  }
  .s3ns-image-section,
  .s3ns-media-container {
    display: none;
  }
}

@media (min-width: 768px) and (max-width: 899px) {
  .s3ns-container {
    width: 90%;
  }
  .s3ns-text-section {
    height: 25%;
    gap: clamp(10px, 1.2vh, 16px);
  }
  .s3ns-image-section {
    height: 75%;
  }
  .s3ns-title {
    font-size: clamp(28px, 5vw, 40px);
  }
  .s3ns-tag {
    font-size: clamp(13px, 2.6vw, 15px);
  }
  .s3ns-tag-separator {
    width: clamp(7px, 1.5vw, 9px);
  }
  .s3ns-description {
    font-size: clamp(14.3px, 2.86vw, 19.8px);
  }
  .s3ns-button-wrapper {
    width: clamp(250px, 72vw, 330px);
    height: clamp(42px, 10vw, 58px);
  }
  .s3ns-button {
    font-size: clamp(14px, 3.5vw, 18px);
  }
  .s3ns-button-icon {
    width: clamp(16px, 4vw, 20px);
  }
}
</style>
