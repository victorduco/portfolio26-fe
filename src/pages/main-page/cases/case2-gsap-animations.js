import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Configure GSAP for better performance
gsap.config({
  nullTargetWarn: false,
  force3D: true,
});

/**
 * Initialize Case2 GSAP animations with ScrollTrigger
 * Sequential animation order:
 * 1. Image/video wrapper slides in
 * 2. Title words fade in sequentially
 * 3. Card background fades in
 * 4. Description words fade in
 * 5. Button fades in
 * 6. Video scrubs throughout entire scroll
 *
 * @param {HTMLElement} containerRef - Main container element
 * @param {HTMLElement} contentWrapperRef - Content wrapper (image container)
 * @param {HTMLElement} videoElement - Video element for scrubbing
 * @returns {Object} - Timeline and ScrollTrigger instances for cleanup
 */
export function initCase2Animations(
  containerRef,
  contentWrapperRef,
  videoElement
) {
  // Clean up any previous ScrollTriggers for this component
  ScrollTrigger.getAll().forEach((st) => {
    if (st.vars.id?.startsWith("case2-")) {
      st.kill();
    }
  });

  // Clear any GSAP inline styles from previous runs
  if (contentWrapperRef) {
    gsap.set(contentWrapperRef, { clearProps: "all" });
  }

  const animations = {
    mainTimeline: null,
    videoTrigger: null,
  };

  // Create main timeline with ScrollTrigger
  animations.mainTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef,
      start: "top top",
      end: "+=400%", // Same length as Case1 and Case3
      pin: true,
      pinSpacing: true,
      scrub: 1,
      id: "case2-main",
    },
  });

  // Stage 1: Image/video wrapper slides in (slow)
  animations.mainTimeline.fromTo(
    contentWrapperRef,
    {
      opacity: 0,
      y: 100, // Start from below
    },
    {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power2.out",
    },
    0
  );

  // Stage 2: Title part 1 words fade in (after image animation starts)
  const titlePart1Elements = document.querySelectorAll(
    ".case2-title .word[data-word-part1]"
  );
  if (titlePart1Elements.length > 0) {
    animations.mainTimeline.fromTo(
      titlePart1Elements,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
      },
      1.2 // Start during image animation
    );
  }

  // Stage 3: Title part 2 words fade in
  const titlePart2Elements = document.querySelectorAll(
    ".case2-title .word[data-word-part2]"
  );
  if (titlePart2Elements.length > 0) {
    animations.mainTimeline.fromTo(
      titlePart2Elements,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
      },
      1.6 // Sequential after title part 1
    );
  }

  // Stage 4: Card background fades in
  const cardBackground = document.querySelector(".case2-card-background");
  if (cardBackground) {
    animations.mainTimeline.fromTo(
      cardBackground,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      2.0 // After title completes
    );
  }

  // Stage 5: Description words fade in
  const descriptionElements = document.querySelectorAll(
    ".case2-description .word[data-word-desc]"
  );
  if (descriptionElements.length > 0) {
    animations.mainTimeline.fromTo(
      descriptionElements,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        stagger: 0.02, // Quick stagger for many words
        ease: "power2.out",
      },
      2.2 // Start with card background
    );
  }

  // Stage 6: Button fades in
  const button = document.querySelector(".case2-open-story");
  if (button) {
    animations.mainTimeline.fromTo(
      button,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      3.0 // After description starts
    );
  }

  // Video scrubbing (independent timeline, synced to entire scroll)
  if (videoElement) {
    animations.videoTrigger = ScrollTrigger.create({
      trigger: containerRef,
      start: "top top",
      end: "+=400%", // Same length as main timeline
      scrub: true,
      id: "case2-video-scrub",
      onUpdate: (self) => {
        if (videoElement.duration && !isNaN(videoElement.duration)) {
          const targetTime = self.progress * videoElement.duration;
          if (Math.abs(videoElement.currentTime - targetTime) > 0.05) {
            videoElement.currentTime = targetTime;
          }
        }
      },
    });
  }

  return animations;
}

/**
 * Cleanup function to kill all ScrollTriggers and timelines
 * @param {Object} animationInstance - The instance returned from initCase2Animations
 */
export function cleanupCase2Animations(animationInstance) {
  if (!animationInstance) return;

  if (animationInstance.mainTimeline) {
    animationInstance.mainTimeline.kill();
  }

  if (animationInstance.videoTrigger) {
    animationInstance.videoTrigger.kill();
  }

  // Clean up any remaining case2 ScrollTriggers
  ScrollTrigger.getAll().forEach((st) => {
    if (st.vars.id?.startsWith("case2-")) {
      st.kill();
    }
  });
}
