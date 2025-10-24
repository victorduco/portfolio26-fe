import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Initialize GSAP with plugins and configuration
 * Must be called before using any GSAP animations
 */
export function initGSAP() {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // CRITICAL FIX: Force GSAP to use 'transform' matrix instead of individual CSS properties
  // Individual properties (translate, rotate, scale) override 'transform' in modern CSS
  gsap.config({
    nullTargetWarn: false,
    force3D: true,
  });
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
