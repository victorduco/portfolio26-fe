import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// CRITICAL FIX: Force GSAP to use 'transform' matrix instead of individual CSS properties
// Individual properties (translate, rotate, scale) override 'transform' in modern CSS
gsap.config({
  nullTargetWarn: false,
  force3D: true,
});

/**
 * Animation Stages Configuration
 * Each stage defines animations that happen at specific scroll positions
 * Uses ScrollTrigger with pin for smooth scroll-based transitions
 */
export const animationStages = [
  // Stage 0: Small circle appears
  {
    id: "stage0-circle-appear",
    description: "Small circle appears",
    animations: [
      {
        target: ".line-element",
        to: {
          scale: 1,
          width: "6px",
          height: "6px",
          borderRadius: "3px",
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut",
        },
      },
    ],
  },
  // Stage 1: Line grows horizontally to 100px
  {
    id: "stage1-grow-horizontal",
    description: "Line grows horizontally to 100px",
    animations: [
      {
        target: ".line-element",
        to: {
          width: "100px",
          duration: 0.5,
          ease: "power2.inOut",
        },
      },
    ],
  },
  // Stage 2: Line expands to 50vw
  {
    id: "stage2-expand-full-width",
    description: "Line expands to 50vw",
    animations: [
      {
        target: ".line-element",
        to: {
          width: "50vw",
          duration: 4,
          ease: "power2.inOut",
        },
      },
    ],
  },
  // Stage 3: Line moves down, text appears and moves up
  {
    id: "stage3-line-down-text-up",
    description:
      "Line moves down 55px, text appears from behind and moves up to -150px",
    animations: [
      {
        target: ".line-element",
        to: {
          y: "100px",
          duration: 0.5,
          ease: "power2.inOut",
        },
      },
      {
        target: ".text-container",
        to: {
          y: "-100px",
          duration: 0.5,
          ease: "power2.inOut",
        },
      },
      {
        target: ".mask-element",
        to: {
          y: "100px",
          duration: 0.5,
          ease: "power2.inOut",
        },
      },
    ],
  },
  // Stage 4: Line transforms to button with Play Reel text
  {
    id: "stage4-line-to-button",
    description:
      "Line moves to 100px and transforms into button with Play Reel text",
    animations: [
      {
        target: ".line-element",
        to: {
          width: "50vw",
          height: "96px",
          borderRadius: "48px",
          backgroundColor: "#ffffff",
          border: "6px solid #007AFF",
          duration: 0.5,
          ease: "power2.inOut",
        },
      },
      {
        target: ".button-content-wrapper",
        to: {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
      },
    ],
  },
  // Stage 5: Expand to video proportions
  {
    id: "stage5-expand-to-video",
    description: "Line expands to video proportions, text fades out",
    animations: [
      {
        target: ".line-element",
        to: {
          width: "75vw",
          height: "45vw",
          borderRadius: "26px",
          border: "6px solid #DDDDDD",
          y: "0px",
          duration: 0.5,
          ease: "power2.inOut",
        },
      },
      {
        target: ".button-content-wrapper",
        to: {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        },
      },
    ],
  },
  // Stage 6: Open Story button appears
  {
    id: "stage6-open-story-appears",
    description: "Open Story button appears below video",
    animations: [
      {
        target: ".open-story-button",
        to: {
          height: "60px",
          opacity: 1,
          duration: 0.5,
          delay: 0.75,
          ease: "power2.out",
        },
      },
    ],
  },
];

/**
 * Creates and initializes all animation stages with ScrollTrigger
 * @param {HTMLElement} trigger - The section element that triggers scroll and gets pinned
 * @returns {Object} - Timeline and ScrollTrigger instance for cleanup
 */
export function initAnimations(trigger) {
  // Clean up any previous ScrollTriggers
  ScrollTrigger.getAll().forEach((st) => st.kill());

  // Clear any GSAP inline styles from previous runs
  gsap.set(trigger, { clearProps: "all" });

  // Set initial state for text container (visible and positioned below)
  gsap.set(".text-container", { opacity: 1, y: 100 });

  // Set initial state for open story button (hidden initially)
  gsap.set(".open-story-button", { opacity: 0, height: "60px" });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: trigger,
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: true,
      scrub: 1,
      snap: {
        snapTo: "labels",
        duration: 0.5,
        delay: 0,
        ease: "power2.inOut",
      },
      markers: true,
      id: "case1-main",
    },
  });

  // Add animations to timeline sequentially
  animationStages.forEach((stage, stageIndex) => {
    stage.animations.forEach((anim, animIndex) => {
      // Each stage starts after previous completes
      // Multiple animations within same stage start together
      const position =
        stageIndex === 0 && animIndex === 0 ? 0 : animIndex === 0 ? ">=" : "<";

      tl.to(
        anim.target,
        {
          ...anim.to,
          force3D: true,
        },
        position
      );
    });
  });

  return {
    timeline: tl,
    scrollTrigger: tl.scrollTrigger,
  };
}

/**
 * Cleanup function to kill all ScrollTriggers and timelines
 * @param {Object} animationInstance - The instance returned from initAnimations
 */
export function cleanupAnimations(animationInstance) {
  if (animationInstance) {
    if (animationInstance.scrollTrigger) {
      animationInstance.scrollTrigger.kill();
    }
    if (animationInstance.timeline) {
      animationInstance.timeline.kill();
    }
  }
  ScrollTrigger.getAll().forEach((st) => st.kill());
}
