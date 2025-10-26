import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

let smoother = null;

export function initGSAP() {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  gsap.config({
    nullTargetWarn: false,
    force3D: true,
  });
}

export function initScrollSmoother(options = {}) {
  if (smoother) {
    smoother.kill();
  }

  smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 2,
    effects: true,
    ...options,
  });

  return smoother;
}

/**
 * Get the current ScrollSmoother instance
 * @returns {ScrollSmoother|null}
 */
export function getScrollSmoother() {
  return smoother;
}

export function cleanupAnimations(animationInstance) {
  if (animationInstance) {
    // Handle main pin
    if (animationInstance.mainPin) {
      animationInstance.mainPin.kill();
    }

    // Handle single timeline
    if (animationInstance.scrollTrigger) {
      animationInstance.scrollTrigger.kill();
    }
    if (animationInstance.timeline) {
      if (animationInstance.timeline.scrollTrigger) {
        animationInstance.timeline.scrollTrigger.kill();
      }
      animationInstance.timeline.kill();
    }

    // Handle multiple timelines
    if (animationInstance.timeline1) {
      if (animationInstance.timeline1.scrollTrigger) {
        animationInstance.timeline1.scrollTrigger.kill();
      }
      animationInstance.timeline1.kill();
    }
    if (animationInstance.timeline2) {
      if (animationInstance.timeline2.scrollTrigger) {
        animationInstance.timeline2.scrollTrigger.kill();
      }
      animationInstance.timeline2.kill();
    }
    if (animationInstance.scrollTrigger1) {
      animationInstance.scrollTrigger1.kill();
    }
    if (animationInstance.scrollTrigger2) {
      animationInstance.scrollTrigger2.kill();
    }

    // Handle video trigger (Case3)
    if (animationInstance.videoTrigger) {
      animationInstance.videoTrigger.kill();
    }
  }
  ScrollTrigger.getAll().forEach((st) => st.kill());
}
