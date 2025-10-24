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
 * Handles text fade-in, parallax scrolling, and video playback
 * @param {HTMLElement} sectionElement - The main section element
 * @param {Object} refs - Vue refs for various elements
 * @returns {Object} - Animation instances for cleanup
 */
export function initAnimations(sectionElement, refs) {
  const { textSection, titleElement, companyElement, buttonElement, imageContainer, videoElement } = refs;

  // Clean up only Case3 ScrollTriggers if they exist
  ScrollTrigger.getAll().forEach((st) => {
    if (st.vars.id && st.vars.id.startsWith("case3-")) {
      st.kill();
    }
  });

  const animations = {
    textTimeline: null,
    parallaxTrigger: null,
    videoTrigger: null,
    videoUpdateHandler: null,
  };

  // Text fade-in animation timeline
  animations.textTimeline = gsap.timeline({
    paused: true,
  });

  // Title fade in
  animations.textTimeline.to(titleElement, {
    opacity: 1,
    duration: 0.8,
    ease: "cubic-bezier(0.4, 0, 0.2, 1)",
  });

  // Company fade in with delay
  animations.textTimeline.to(
    companyElement,
    {
      opacity: 1,
      duration: 0.8,
      ease: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    "-=0.55" // 250ms after title starts (800ms - 550ms overlap)
  );

  // Button fade in with delay
  animations.textTimeline.to(
    buttonElement,
    {
      opacity: 1,
      duration: 0.8,
      ease: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    "-=0.55" // 250ms after company starts
  );

  // Parallax scroll effect for image section
  if (imageContainer) {
    animations.parallaxTrigger = ScrollTrigger.create({
      trigger: sectionElement,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      id: "case3-parallax",
      onUpdate: (self) => {
        const rect = imageContainer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const scrollProgress = 1 - (rect.top + rect.height / 2) / viewportHeight;
        const parallaxOffset = Math.max(-50, Math.min(50, scrollProgress * 100 - 50));

        gsap.set(imageContainer, {
          y: parallaxOffset,
          force3D: true,
        });
      },
    });
  }

  // Video playback control based on visibility
  if (videoElement) {
    animations.videoUpdateHandler = handleVideoTimeUpdate.bind(null, videoElement);

    animations.videoTrigger = ScrollTrigger.create({
      trigger: sectionElement,
      start: "top 70%",
      end: "bottom 30%",
      id: "case3-video",
      onEnter: () => startVideo(videoElement, animations.videoUpdateHandler),
      onLeave: () => resetVideo(videoElement, animations.videoUpdateHandler),
      onEnterBack: () => startVideo(videoElement, animations.videoUpdateHandler),
      onLeaveBack: () => resetVideo(videoElement, animations.videoUpdateHandler),
    });
  }

  // Intersection Observer for text animations
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animations.textTimeline.play();
        } else {
          animations.textTimeline.reverse();
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  if (sectionElement) {
    intersectionObserver.observe(sectionElement);
  }

  animations.intersectionObserver = intersectionObserver;

  return animations;
}

/**
 * Handle video time updates for playback control
 * @param {HTMLVideoElement} videoElement
 */
function handleVideoTimeUpdate(videoElement) {
  if (!videoElement) return;

  const currentTime = videoElement.currentTime;

  // Stop at 8 seconds
  if (currentTime >= 8) {
    videoElement.pause();
    videoElement.currentTime = 8;
    return;
  }

  // Slow down from 7 to 8 seconds
  if (currentTime >= 7) {
    const progress = (currentTime - 7) / 1; // 1 second range
    const newSpeed = 1 - progress * 0.7; // From 1x to 0.3x
    videoElement.playbackRate = Math.max(0.3, newSpeed);
  }
}

/**
 * Start video playback
 * @param {HTMLVideoElement} videoElement
 * @param {Function} updateHandler
 */
function startVideo(videoElement, updateHandler) {
  if (!videoElement) return;

  videoElement.currentTime = 3; // Start at 3 seconds
  videoElement.playbackRate = 1; // Normal speed
  videoElement.addEventListener("timeupdate", updateHandler);
  videoElement.play().catch(() => {});
}

/**
 * Reset video to initial state
 * @param {HTMLVideoElement} videoElement
 * @param {Function} updateHandler
 */
function resetVideo(videoElement, updateHandler) {
  if (!videoElement) return;

  videoElement.pause();
  videoElement.removeEventListener("timeupdate", updateHandler);
}

/**
 * Cleanup function to kill all animations and observers
 * @param {Object} animationInstances - The instances returned from initAnimations
 */
export function cleanupAnimations(animationInstances) {
  if (!animationInstances) return;

  if (animationInstances.textTimeline) {
    animationInstances.textTimeline.kill();
  }

  if (animationInstances.parallaxTrigger) {
    animationInstances.parallaxTrigger.kill();
  }

  if (animationInstances.videoTrigger) {
    animationInstances.videoTrigger.kill();
  }

  if (animationInstances.intersectionObserver) {
    animationInstances.intersectionObserver.disconnect();
  }

  if (animationInstances.videoElement && animationInstances.videoUpdateHandler) {
    animationInstances.videoElement.removeEventListener(
      "timeupdate",
      animationInstances.videoUpdateHandler
    );
  }

  // Don't kill all ScrollTriggers - only the ones we created are already killed above
}
