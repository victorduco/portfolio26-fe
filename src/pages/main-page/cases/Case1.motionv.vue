<template>
  <section
    id="case1"
    class="case-section item"
    style="background-color: #ffffff"
  >
    <div class="case1-container" ref="containerRef">
      <div
        v-if="wrapperVisible"
        class="animation-stage-wrapper"
        :class="{
          hidden: !isActive,
          ready: readyToShow,
          'not-initialized': !isInitialized,
          'normal-flow': isNormalFlow,
        }"
      >
        <!-- Text Container (z-index: 1, behind mask) -->
        <motion.div
          class="text-container"
          style="opacity: 0; transform: translate(-50%, 0px)"
          :animate="currentTextAnimation"
          :transition="currentTransition"
        >
          <h2 class="main-text">{{ mainText }}</h2>
          <p class="sub-text">{{ subText }}</p>
        </motion.div>

        <!-- Mask Element (z-index: 2, hides text below line) -->
        <motion.div
          class="mask-element"
          style="
            transform: translate(-50%, 0px);
            width: 100vw;
            height: 50vh;
            background-color: #ffffff;
            opacity: 1;
          "
          :animate="currentMaskAnimation"
          :transition="currentTransition"
        />

        <!-- Line Element (z-index: 3, on top) -->
        <motion.div
          class="line-element"
          style="opacity: 0"
          :animate="currentLineAnimation"
          :transition="currentTransition"
        >
          <motion.div
            class="button-content-wrapper"
            :animate="currentButtonContentAnimation"
            :transition="currentTransition"
          >
            <svg
              class="play-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M8 5v14l11-7L8 5z" fill="#007AFF" />
            </svg>
            <span class="button-text">Play Reel</span>
          </motion.div>

          <!-- Video Player inside line-element -->
          <VideoPlayer
            v-if="currentStageIndex >= 5"
            ref="videoPlayerRef"
            :video-src="videoSrc"
            :video-expanded="videoExpanded"
            class="case1-video-player"
          />
        </motion.div>

        <!-- Open Story Button (appears on stage7) -->
        <motion.a
          :href="routeTo"
          class="open-story-button"
          style="
            opacity: 0;
            transform: translate(-50%, 520px);
            width: 300px;
            height: 0px;
          "
          :animate="currentOpenStoryAnimation"
          :transition="currentOpenStoryTransition"
          @click.prevent="handleStoryLinkClick"
        >
          <span class="open-story-text">Open Story</span>
        </motion.a>
      </div>

      <div class="final-spacer"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { motion, useScroll, useTransform } from "motion-v";
import VideoPlayer from "@/components/VideoPlayer.vue";
import {
  animationStages,
  initialLineAnimation,
  initialTextAnimation,
  initialMaskAnimation,
  initialButtonContentAnimation,
  initialOpenStoryAnimation,
  shapeTransition,
  delayedTransition,
  instantTransition,
} from "./case1-animation-stages.js";

const containerRef = ref(null);
const scrollContainerRef = ref(null);
const videoPlayerRef = ref(null);
const currentStageIndex = ref(0);
const wrapperVisible = ref(false);
const isIntersecting = ref(false);
const isActive = ref(false); // Controls CSS visibility
const readyToShow = ref(false); // Controls when elements are ready to be visible
const isInitialized = ref(false); // Controls transition timing
const isNormalFlow = ref(false); // Controls whether wrapper is in normal document flow

// Text content
const mainText = "Cross-Domain AI Solution for Account Reconcilers";
const subText = "Apple";

// Video constants
const videoSrc = new URL("@/assets/case-videos/case1.mp4", import.meta.url)
  .href;
const routeTo = "/story/one";

// Video state
const videoExpanded = ref(false);

// Current animation states for each element
const currentLineAnimation = ref({ ...initialLineAnimation });
const currentTextAnimation = ref({ ...initialTextAnimation });
const currentMaskAnimation = ref({ ...initialMaskAnimation });
const currentButtonContentAnimation = ref({ ...initialButtonContentAnimation });
const currentOpenStoryAnimation = ref({ ...initialOpenStoryAnimation });

// Function to initialize states and mark as ready
const initializeStates = () => {
  currentLineAnimation.value = { ...initialLineAnimation };
  console.log("🎨 INITIAL TEXT CONTAINER STATE APPLIED:", initialTextAnimation);
  currentTextAnimation.value = { ...initialTextAnimation };
  currentMaskAnimation.value = { ...initialMaskAnimation };
  currentButtonContentAnimation.value = { ...initialButtonContentAnimation };
  currentOpenStoryAnimation.value = { ...initialOpenStoryAnimation };

  // Wait for Motion-v to apply styles before showing element
  nextTick(() => {
    readyToShow.value = true; // Mark as ready to show
    isInitialized.value = true; // Mark as initialized for transitions
  });
};
const currentTransition = ref(shapeTransition);
const currentOpenStoryTransition = ref(delayedTransition);

// Setup scroll tracking
const { scrollYProgress } = useScroll({
  target: containerRef,
  container: scrollContainerRef,
  offset: ["start start", "end end"],
});

// Determine which stage should be active based on scroll progress
const getActiveStage = (progress) => {
  for (let i = animationStages.length - 1; i >= 0; i--) {
    const stage = animationStages[i];
    if (progress >= stage.startProgress) {
      return { index: i, stage };
    }
  }
  return { index: -1, stage: null };
};

// Find element state from current or previous stages (fallback with merge)
const getElementState = (elementName, currentStageIndex) => {
  // Get initial state for this element
  let initialState = null;
  if (elementName === "line") initialState = { ...initialLineAnimation };
  if (elementName === "textContainer")
    initialState = { ...initialTextAnimation };
  if (elementName === "mask") initialState = { ...initialMaskAnimation };
  if (elementName === "buttonContent")
    initialState = { ...initialButtonContentAnimation };
  if (elementName === "openStory")
    initialState = { ...initialOpenStoryAnimation };

  // Start with initial state
  let mergedState = { ...initialState };

  // Merge states from stage 0 to current stage
  for (let i = 0; i <= currentStageIndex; i++) {
    const stage = animationStages[i];
    if (stage.elements && stage.elements[elementName]) {
      // Merge current stage properties into accumulated state
      mergedState = { ...mergedState, ...stage.elements[elementName] };
    }
  }

  return mergedState;
};

// Apply animations from stage to all elements with fallback
const applyStageAnimations = (stage, stageIndex) => {
  if (!stage) return;

  // Update transition for this stage
  currentTransition.value = stage.transition || shapeTransition;

  // Apply animations to each element with fallback logic
  if (stage.elements) {
    // Apply line animation (with fallback)
    currentLineAnimation.value = getElementState("line", stageIndex);

    // Apply text animation (with fallback)
    const textState = getElementState("textContainer", stageIndex);
    console.log("🎨 TEXT CONTAINER ANIMATION APPLIED:", textState);
    currentTextAnimation.value = textState;

    // Apply mask animation (with fallback)
    currentMaskAnimation.value = getElementState("mask", stageIndex);

    // Apply button content animation (with fallback)
    currentButtonContentAnimation.value = getElementState(
      "buttonContent",
      stageIndex
    );

    // Apply open story animation (with fallback)
    const openStoryState = getElementState("openStory", stageIndex);
    if (openStoryState.transition) {
      currentOpenStoryTransition.value = openStoryState.transition;
      delete openStoryState.transition; // Remove transition from animation object
    } else if (openStoryState.reverseTransition) {
      currentOpenStoryTransition.value = openStoryState.reverseTransition;
      delete openStoryState.reverseTransition; // Remove reverseTransition from animation object
    } else {
      currentOpenStoryTransition.value = delayedTransition; // Default for openStory
    }
    currentOpenStoryAnimation.value = openStoryState;
  } else if (stage.animation) {
    // Backward compatibility: old format with animation property
    currentLineAnimation.value = stage.animation;
    // For old format, reset other elements to initial
    currentTextAnimation.value = initialTextAnimation;
    currentMaskAnimation.value = initialMaskAnimation;
    currentButtonContentAnimation.value = initialButtonContentAnimation;
    currentOpenStoryAnimation.value = initialOpenStoryAnimation;
  }
};

let scrollUnsubscribe = null;
let observer = null;

onMounted(() => {
  // Find the scroll container - try both selectors
  const scrollContainer =
    document.querySelector(".scroll-snap-container.fullscreen") ||
    document.querySelector(".scroll-snap-container");
  if (scrollContainer) {
    scrollContainerRef.value = scrollContainer;
  }

  // Setup Intersection Observer to detect when section is visible
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isIntersecting.value = entry.isIntersecting;
        console.log(
          "Case1 intersecting:",
          entry.isIntersecting,
          "ratio:",
          entry.intersectionRatio
        );

        // When section becomes visible, apply initial states
        if (entry.isIntersecting) {
          initializeStates(); // Initialize states first
          // Don't show wrapper until Motion-v is ready
          wrapperVisible.value = true;
          isActive.value = false; // Keep hidden initially
        } else {
          // Force hide wrapper when not intersecting
          wrapperVisible.value = false;
          isActive.value = false;
          readyToShow.value = false; // Reset ready state
          isInitialized.value = false; // Reset initialization state
          initializeStates(); // Reset to initial states
        }
      });
    },
    {
      root: scrollContainer,
      threshold: 0.1,
      rootMargin: "-10px",
    }
  );

  if (containerRef.value) {
    observer.observe(containerRef.value);
  }

  // Subscribe to scroll progress changes
  scrollUnsubscribe = scrollYProgress.on?.("change", (progress) => {
    // Debug: log progress to see what's happening
    console.log(
      "Case1 scroll progress:",
      progress,
      "isIntersecting:",
      isIntersecting.value,
      "wrapperVisible:",
      wrapperVisible.value
    );

    // Show wrapper only when section is intersecting AND progress is valid
    if (isIntersecting.value && progress >= 0 && progress <= 1) {
      wrapperVisible.value = true;
    } else if (!isIntersecting.value) {
      wrapperVisible.value = false;
    }

    // Only update animations if visible
    if (isIntersecting.value) {
      const { index, stage } = getActiveStage(progress);
      console.log(
        "Active stage:",
        stage?.id,
        "index:",
        index,
        "progress:",
        progress
      );

      if (stage) {
        // Update current stage index
        currentStageIndex.value = index;

        // Make visible when first stage starts
        if (!isActive.value) {
          isActive.value = true;
        }

        // Apply all animations for this stage (with fallback)
        applyStageAnimations(stage, index);
        console.log("Applied stage:", stage.id, "index:", index);

        // Update normal flow state
        isNormalFlow.value = stage.normalFlow === true;

        // Video control logic from stage configuration
        if (stage.videoExpanded !== undefined) {
          const shouldExpand = stage.videoExpanded;
          videoExpanded.value = shouldExpand;
          if (videoPlayerRef.value) {
            if (shouldExpand) {
              videoPlayerRef.value.attemptPlay();
            } else {
              videoPlayerRef.value.pauseVideo();
            }
          }
        } else {
          // If stage doesn't have videoExpanded, pause video
          if (videoExpanded.value) {
            videoExpanded.value = false;
            if (videoPlayerRef.value) {
              videoPlayerRef.value.pauseVideo();
            }
          }
        }
      } else {
        // Before first stage - keep initial state (hidden)
        isActive.value = false; // Hide via CSS
        isInitialized.value = false; // Reset initialization state
        isNormalFlow.value = false; // Reset normal flow
        initializeStates(); // Reset to initial states
        currentTransition.value = instantTransition; // Instant reset
        currentOpenStoryTransition.value = instantTransition; // Instant reset
        videoExpanded.value = false;
        console.log("No stage found, using initial animations");
      }
    } else {
      // When not intersecting, reset to initial state
      isActive.value = false;
      readyToShow.value = false; // Reset ready state
      isInitialized.value = false; // Reset initialization state
      isNormalFlow.value = false; // Reset normal flow
      initializeStates(); // Reset to initial states
      currentTransition.value = instantTransition; // Instant reset
      currentOpenStoryTransition.value = instantTransition; // Instant reset
      videoExpanded.value = false;
    }
  });
});

onUnmounted(() => {
  if (scrollUnsubscribe) {
    scrollUnsubscribe();
    scrollUnsubscribe = null;
  }

  if (observer && containerRef.value) {
    observer.unobserve(containerRef.value);
  }
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});

// Handle story link click
const handleStoryLinkClick = (event) => {
  if (videoPlayerRef.value) {
    videoPlayerRef.value.saveState();
  }
  if (event && event.currentTarget && event.currentTarget.href) {
    window.location.href = event.currentTarget.href;
  }
};

defineExpose({
  videoPlayerRef,
});
</script>

<style scoped>
.case1-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  overflow: hidden;
}

.animation-stage-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 100;
  transition: opacity 0.3s ease-out;
  overflow: hidden;
  visibility: hidden;
  opacity: 0;
}

/* Instant transition before initialization */
.animation-stage-wrapper.not-initialized {
  transition: none;
}

.animation-stage-wrapper.hidden {
  visibility: hidden;
  opacity: 0;
}

.animation-stage-wrapper.ready {
  visibility: visible;
  opacity: 1;
}

.animation-stage-wrapper.normal-flow {
  position: absolute;
  top: calc(420vh + 50vh);
  transform: translate(-50%, -50%);
}

.line-element {
  position: absolute;
  top: 50%;
  left: 50%;
  will-change: transform, width, height, border-radius;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  /* Initial state from config */
  transform: translate(-50%, 0px) scale(0);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #007aff;
}

.mask-element {
  position: absolute;
  top: 50%;
  left: 50%;
  will-change: transform, height;
  z-index: 2;
  pointer-events: none;
}

.text-container {
  position: absolute;
  top: 50%;
  left: 50%;
  will-change: transform, opacity;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  max-width: 90vw;
  overflow: hidden;
}

.main-text {
  margin: 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 600;
  font-size: clamp(24px, 3vw, 48px);
  line-height: 1.2;
  color: #000000;
}

.sub-text {
  margin: 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 400;
  font-size: clamp(16px, 2vw, 28px);
  line-height: 1.4;
  color: #000000;
}

.button-content-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.play-icon {
  flex-shrink: 0;
}

.button-text {
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 400;
  font-size: clamp(16px, 2vw, 28px);
  line-height: 1.4;
  color: #007aff;
  white-space: nowrap;
}

.case1-video-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 1;
  pointer-events: none;
}

.open-story-button {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #007aff;
  border-radius: 40px;
  overflow: hidden;
  text-decoration: none;
  pointer-events: auto;
  cursor: pointer;
  transition: background-color 0.2s ease;
  z-index: 4;
}

.open-story-button:hover {
  border: 4px solid #007bffde;
}

.open-story-text {
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4;
  color: #007aff;
  white-space: nowrap;
}

.final-spacer {
  height: 500vh;
  width: 100%;
}

.case-section.item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  height: 100dvh;
}

#case1.case-section.item {
  height: 600vh;
  min-height: 600vh;
  max-height: 600vh;
}
</style>
