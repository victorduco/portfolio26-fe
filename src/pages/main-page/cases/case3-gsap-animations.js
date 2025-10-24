import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Force GSAP to use 'transform' matrix instead of individual CSS properties
gsap.config({
  nullTargetWarn: false,
  force3D: true,
});

/**
 * Initialize GSAP animations for Case3
 * Sequential animation order:
 * 1. Image/video wrapper slides in
 * 2. Clouds appear from sides
 * 3. Title, subtitle, button fade in sequentially
 * 4. Video scrubs throughout entire scroll
 *
 * @param {HTMLElement} sectionElement - The main section element
 * @param {Object} refs - Vue refs for various elements
 * @returns {Object} - Animation instances for cleanup
 */
export function initAnimations(sectionElement, refs) {
  const {
    titleElement,
    companyElement,
    buttonElement,
    imageContainer,
    videoElement,
    cloudCorners
  } = refs;

  // Clean up only Case3 ScrollTriggers if they exist
  ScrollTrigger.getAll().forEach((st) => {
    if (st.vars.id && st.vars.id.startsWith("case3-")) {
      st.kill();
    }
  });

  const animations = {
    mainTimeline: null,
    videoTrigger: null,
  };

  // Create main timeline with ScrollTrigger
  animations.mainTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: sectionElement,
      start: "top top",
      end: "+=400%", // Same length as Case1
      pin: true,
      pinSpacing: true,
      scrub: 1,
      id: "case3-main",
    },
  });

  // Stage 1: Image/video wrapper slides in (slow)
  animations.mainTimeline.to(imageContainer, {
    opacity: 1,
    y: 0,
    duration: 1.5,
    ease: "power2.out",
  }, 0);

  // Stage 2: Clouds appear from sides (near the end of image animation)
  if (cloudCorners) {
    const { topLeftCloud, topRightCloud, bottomLeftCloud, bottomRightCloud } = cloudCorners;

    // Set initial state - clouds off screen
    gsap.set([topLeftCloud, topRightCloud, bottomLeftCloud, bottomRightCloud], {
      opacity: 0,
    });

    // Top left cloud - slides from left
    if (topLeftCloud) {
      gsap.set(topLeftCloud, { x: -100, y: -100 });
      animations.mainTimeline.to(topLeftCloud, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }, 1.2); // Start near end of image animation
    }

    // Top right cloud - slides from right
    if (topRightCloud) {
      gsap.set(topRightCloud, { x: 100, y: -100 });
      animations.mainTimeline.to(topRightCloud, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }, 1.2);
    }

    // Bottom left cloud - slides from left
    if (bottomLeftCloud) {
      gsap.set(bottomLeftCloud, { x: -100, y: 100 });
      animations.mainTimeline.to(bottomLeftCloud, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }, 1.2);
    }

    // Bottom right cloud - slides from right
    if (bottomRightCloud) {
      gsap.set(bottomRightCloud, { x: 100, y: 100 });
      animations.mainTimeline.to(bottomRightCloud, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }, 1.2);
    }
  }

  // Stage 3: Title fades in
  animations.mainTimeline.to(titleElement, {
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
  }, 2.0); // After clouds animation

  // Stage 4: Company/subtitle fades in
  animations.mainTimeline.to(companyElement, {
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
  }, 2.4); // Sequential after title

  // Stage 5: Button fades in
  animations.mainTimeline.to(buttonElement, {
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
  }, 2.8); // Sequential after subtitle

  // Video playback control scrubbed to scroll (independent timeline)
  if (videoElement) {
    // Load video metadata to get duration
    videoElement.load();

    // Use scrub to tie video progress to scroll progress
    animations.videoTrigger = ScrollTrigger.create({
      trigger: sectionElement,
      start: "top top",
      end: "+=400%", // Same length as main timeline
      scrub: true,
      id: "case3-video",
      onUpdate: (self) => {
        if (videoElement.readyState >= 2) { // HAVE_CURRENT_DATA
          // Map scroll progress (0-1) to video time (3-8 seconds)
          const videoDuration = 5; // 8 - 3 = 5 seconds of playback
          const startTime = 3;
          const targetTime = startTime + (self.progress * videoDuration);

          // Set video current time based on scroll progress
          videoElement.currentTime = targetTime;
        }
      },
    });
  }

  return animations;
}

/**
 * Cleanup function to kill all animations and observers
 * @param {Object} animationInstances - The instances returned from initAnimations
 */
export function cleanupAnimations(animationInstances) {
  if (!animationInstances) return;

  if (animationInstances.mainTimeline) {
    animationInstances.mainTimeline.kill();
  }

  if (animationInstances.videoTrigger) {
    animationInstances.videoTrigger.kill();
  }

  // Don't kill all ScrollTriggers - only the ones we created are already killed above
}
