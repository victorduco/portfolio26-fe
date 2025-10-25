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
    smooth: 1,
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
    if (animationInstance.scrollTrigger) {
      animationInstance.scrollTrigger.kill();
    }
    if (animationInstance.timeline) {
      animationInstance.timeline.kill();
    }
  }
  ScrollTrigger.getAll().forEach((st) => st.kill());
}
