<template>
  <section id="intro" class="intro-section item" :class="{ 'intro-visible': introVisible }">
    <section class="intro-hero" id="intro-text-export-node">
      <div class="intro-hero__title">
        <Motion tag="h1" class="h1" :variants="variants" :animate="titleState" :transition="{ type: 'tween', ease: [0.4, 0, 0.2, 1], duration: 0.6 }" initial="hidden">
          Victor Diukov
        </Motion>
        <Motion tag="p" class="body1" :variants="variants" :animate="subtitleState" :transition="{ type: 'tween', ease: [0.4, 0, 0.2, 1], duration: 0.5 }" initial="hidden">
          Currently designing for&nbsp;Apple. Bringing experience from&nbsp;large&#8209;scale B2B & FinTech with&nbsp;a&nbsp;product management&nbsp;background.
        </Motion>
      </div>
    </section>
    <ul class="intro-list">
      <IntroRectangle v-for="(_, i) in 4" :key="i" :index="i" :active-count="activeCount" :intro-visible="showRectangles"
        :force-close="forceCloseAll" :should-animate="rectangleStates[i]" :is-mobile-layout="isMobileLayout"
        :is-smallest-breakpoints="isSmallestBreakpoints" :active-mobile-index="activeMobileIndex"
        @active-change="handleActiveChange" @mobile-open="handleMobileOpen" @mobile-close="handleMobileClose" />
    </ul>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { Motion } from "motion-v";
import { useRoute } from "vue-router";
import IntroRectangle from "./IntroRectangle.vue";
import { NAVIGATION_MOBILE, INTRO_MOBILE_FULLSCREEN, useMediaQuery } from "@/composables/useMediaQuery.js";

const route = useRoute();
const introVisible = ref(false);
const shouldPlayNavIntro = computed(() => !route.meta?.skipNavIntro);
const isMobileLayout = useMediaQuery(NAVIGATION_MOBILE);
const isSmallestBreakpoints = useMediaQuery(INTRO_MOBILE_FULLSCREEN);

const activeCount = ref(0);
const forceCloseAll = ref(false);
const activeMobileIndex = ref(-1);
const titleState = ref("hidden");
const subtitleState = ref("hidden");
const rectangleStates = ref([false, false, false, false]);
const showRectangles = ref(false);
const variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

let observer = null;

watch(() => shouldPlayNavIntro.value, (play) => { introVisible.value = !play; }, { immediate: true });

watch(() => introVisible.value, (visible) => {
  if (!visible) {
    titleState.value = subtitleState.value = "hidden";
    rectangleStates.value = [false, false, false, false];
    showRectangles.value = false;
    activeMobileIndex.value = -1;
    activeCount.value = 0;
    return;
  }
  const ease = (t) => t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
  const delay = (i) => 400 - ease(i / 6) * 150;

  titleState.value = "visible";
  setTimeout(() => {
    subtitleState.value = "visible";
    setTimeout(() => {
      showRectangles.value = true;
      [0, 1, 2, 3].reduce((acc, i) => {
        setTimeout(() => { rectangleStates.value[i] = true; }, acc);
        return acc + delay(2 + i);
      }, 0);
    }, delay(1));
  }, delay(0));
}, { immediate: true });

watch(isMobileLayout, (isMobile) => { if (!isMobile) { handleMobileClose(); forceCloseAll.value = false; } });

function handleClickOutside(e) {
  if (activeCount.value === 0) return;
  if (!e.target.closest(".intro-square")) {
    if (isMobileLayout.value || isSmallestBreakpoints.value) {
      if (activeMobileIndex.value !== -1) handleMobileClose();
    } else {
      forceCloseAll.value = true;
      setTimeout(() => { forceCloseAll.value = false; }, 50);
    }
  }
}

function handleActiveChange(isActive) {
  activeCount.value = isMobileLayout.value ? (isActive ? 1 : 0) : activeCount.value + (isActive ? 1 : -1);
}

function handleMobileOpen(index) { activeMobileIndex.value = index; activeCount.value = 1; }
function handleMobileClose() { activeMobileIndex.value = -1; activeCount.value = 0; }
function handleNavAnimationComplete() { introVisible.value = true; }

onMounted(() => {
  const el = document.getElementById("intro-text-export-node");
  if (el) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting }) => {
        if (!isIntersecting && activeCount.value > 0) {
          isMobileLayout.value || isSmallestBreakpoints.value ? handleMobileClose() : (forceCloseAll.value = true);
        } else if (isIntersecting && !isMobileLayout.value && !isSmallestBreakpoints.value) {
          forceCloseAll.value = false;
        }
      });
    }, { threshold: 0.1 });
    observer.observe(el);
  }
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => { observer?.disconnect(); document.removeEventListener("click", handleClickOutside); });

defineExpose({ handleNavAnimationComplete, shouldPlayNavIntro });
</script>

<style scoped>
.intro-hero {
  position: relative;
  display: grid;
  align-content: center;
  justify-items: start;
  width: 100%;
  height: 100vh;
  padding-block: clamp(40px, 10vh, 96px);
  padding-inline: clamp(24px, 8vw, 120px) clamp(16px, 4vw, 48px);
  box-sizing: border-box;
  overflow: visible;
  grid-template-columns: repeat(auto-fill, min-content);
}

.intro-hero__title {
  max-width: 1050px;
  display: grid;
  gap: clamp(39px, 2.5vw, 48px);
  position: relative;
  z-index: 1;
  margin-bottom: 22vh;
  anchor-name: --title;
  place-items: start;
}

.intro-list {
  position: absolute;
  position-anchor: --title;
  top: anchor(bottom);
  display: grid;
  max-width: 100%;
  max-height: 100%;
  place-items: center start;
  padding: 0;
  list-style: none;
  pointer-events: auto;
  z-index: 10001;
  grid-template-columns: fit-content(100px) clamp(40px, 4vw, 80px) fit-content(100px) clamp(40px, 4vw, 80px) fit-content(100px) clamp(40px, 4vw, 80px) fit-content(100px);
  grid-template-rows: 0px 0px;
  row-gap: 0;
  column-gap: -500px;
  left: clamp(32px, 12vw, 120px);
  top: 50%;
  transform: translateY(-50%);
  margin-top: 64px;
}

.intro-section { opacity: 0; transition: opacity 0.5s ease-out; position: relative; }
.intro-section.intro-visible { opacity: 1; }

@media (max-width: 899px) {
  .intro-list { display: none; }
  .intro-hero__title { margin-bottom: 0; position: absolute; top: 50%; transform: translateY(-50%); padding-inline: clamp(16px, 4vw, 32px); }
}

@media (max-width: 767px) and (orientation: landscape) {
  .intro-hero { padding-block: clamp(24px, 5vh, 48px); padding-inline: clamp(24px, 6vw, 64px) clamp(16px, 3vw, 32px); }
  .intro-hero__title { position: relative; top: auto; transform: none; padding-inline: 0; }
}
</style>
