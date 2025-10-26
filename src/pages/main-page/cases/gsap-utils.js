import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Cleanup GSAP animations and ScrollTriggers
 * @param {Object} animationInstance - Animation instance with timelines and triggers
 */
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
