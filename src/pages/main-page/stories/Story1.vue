<template>
  <div id="story1" class="scroll-container" ref="scrollContainerRef">
    <div class="pin-container" ref="pinContainerRef">
      <div class="section-1">
        <div class="circle">
          <div class="text-container">
            <p class="company-text">Apple</p>
            <h2 class="main-text">Transforming Account Reconciliation with AI-Driven User Experience</h2>
            <div class="tags-container">
              <span class="tag">Global User Research</span>
              <span class="tag-separator">•</span>
              <span class="tag">Concept-to-Launch Design</span>
              <span class="tag-separator">•</span>
              <span class="tag">Cross-Domain UX Alignment</span>
            </div>
          </div>
          <div class="mask-element"></div>
          <a href="/story/one" class="line-element" @click.prevent="handleStoryLinkClick">
            <span class="open-story-text">Open Story</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { initAnimations } from "./story1-gsap-animations.js";
import { cleanupAnimations } from "./gsap-utils.js";

const router = useRouter();
const scrollContainerRef = ref(null), pinContainerRef = ref(null);
let animationInstance = null;

onMounted(() => { if (pinContainerRef.value) animationInstance = initAnimations(pinContainerRef.value); });
onUnmounted(() => { cleanupAnimations(animationInstance); animationInstance = null; });

const handleStoryLinkClick = () => router.push("/story/one");
defineExpose({ handleStoryLinkClick });
</script>

<style scoped>
.scroll-container { width: 100%; background-color: #ffffff; position: relative; }
.pin-container { width: 100%; position: relative; display: flex; flex-direction: column; }
.section-1 { width: 100%; height: 300vh; position: relative; display: flex; align-items: center; justify-content: center; z-index: 1; }
.circle { position: absolute; top: 0; left: 0; width: 100%; height: 100vh; pointer-events: none; }
.circle > * { pointer-events: auto; }

.text-container { position: absolute; top: 50%; left: 50%; text-align: center; z-index: 1; width: 100%; max-width: 1200px; padding: 0 5vw; box-sizing: border-box; }
.company-text { margin: 0 0 12px 0; font-family: 'Noto Sans', sans-serif; font-weight: 700; font-size: clamp(16px, 2vw, 28px); line-height: 1.4; color: #007aff; text-align: center; width: 100%; }
.main-text { margin: 0; font-family: 'Noto Sans', sans-serif; font-weight: 600; font-size: clamp(24px, 2.2vw, 48px); line-height: 1.2; color: #000000; }
.tags-container { margin: 16px 0 0 0; display: flex; gap: 4px; justify-content: center; align-items: center; }
.tag, .tag-separator { font-family: 'Noto Sans', sans-serif; font-size: 18px; line-height: 1.4; color: #666666; }
.tag { font-weight: 500; }
.tag-separator { opacity: 0.5; }

.mask-element { position: absolute; top: 50%; left: 50%; transform: translate(-50%, 0); width: 100vw; height: 25vh; background-color: #ffffff; z-index: 2; }
.line-element { position: absolute; top: 50%; left: 50%; display: flex; align-items: center; justify-content: center; border: 4px solid #007aff; border-radius: 20px; overflow: hidden; cursor: pointer; text-decoration: none; box-sizing: border-box; width: 40px; height: 40px; z-index: 3; background-color: #007aff; pointer-events: none; }
.line-element:hover { background-color: rgba(255, 255, 255, 0.8); border-color: rgba(0, 122, 255, 0.8); }
.line-element:hover .open-story-text { color: rgba(0, 122, 255, 0.8); }
.open-story-text { font-family: 'Noto Sans', sans-serif; font-weight: 700; font-size: 20px; line-height: 1.4; color: #007aff; white-space: nowrap; opacity: 0; }

@media (max-width: 767px) {
  .mask-element { height: clamp(30vh, 45vw, 40vh); }
  .text-container { width: 100%; max-width: 100%; padding: 0 clamp(16px, 4vw, 32px); box-sizing: border-box; }
  .company-text, .main-text { text-align: center; width: 100%; }
  .tags-container { flex-direction: column; gap: 8px; align-items: stretch; width: 100%; }
  .tag { width: 100%; text-align: center; }
  .tag-separator { display: none; }
}
</style>
