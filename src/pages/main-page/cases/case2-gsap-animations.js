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
 * This component features:
 * - Scale animation (0.5 to 1.0)
 * - Text reveal by words (title part 1, title part 2, description)
 * - Card background fade in
 * - Button fade in
 * - Parallax effects for image and content
 * - Video scrubbing synchronized with scroll
 * - Pin/unpin mechanism for content wrapper
 *
 * @param {HTMLElement} containerRef - Main container element
 * @param {HTMLElement} contentWrapperRef - Content wrapper to be pinned
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
    if (st.vars.id === "case2-main") {
      st.kill();
    }
  });

  // Clear any GSAP inline styles from previous runs
  if (contentWrapperRef) {
    gsap.set(contentWrapperRef, { clearProps: "all" });
  }

  const timelines = [];
  const scrollTriggers = [];

  // Main ScrollTrigger for tracking progress
  const mainST = ScrollTrigger.create({
    trigger: containerRef,
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
    id: "case2-main",
    onUpdate: (self) => {
      const progress = self.progress;

      // Phase 1: Scale animation (0 -> 0.4)
      const scaleEndThreshold = 0.4;
      const scale = progress <= scaleEndThreshold
        ? 0.5 + (progress / scaleEndThreshold) * 0.5
        : 1;

      gsap.set(contentWrapperRef, {
        scale: scale,
        transformOrigin: "center center",
        force3D: true,
      });

      // Phase 2: Text and content animations (0.4 -> 1.0)
      const textProgress =
        progress <= scaleEndThreshold
          ? 0
          : (progress - scaleEndThreshold) / (1 - scaleEndThreshold);

      // Animate title part 1 words (0 -> 0.15)
      animateTitlePart1Words(textProgress);

      // Animate title part 2 words (0.15 -> 0.3)
      animateTitlePart2Words(textProgress);

      // Animate description words (0.5 -> 0.65)
      animateDescriptionWords(textProgress);

      // Animate card background (0.45 -> 0.5)
      animateCardBackground(textProgress);

      // Animate button (0.65 -> 0.75)
      animateButton(textProgress);

      // Image parallax effect
      const parallaxY = (0.5 - textProgress) * 20;
      gsap.set(".case2-image-wrapper", {
        y: `${parallaxY}%`,
        force3D: true,
      });

      // Content parallax effect
      let contentParallaxY;
      if (textProgress < 0.7) {
        contentParallaxY = -(textProgress / 0.7) * 3;
      } else {
        const laterProgress = (textProgress - 0.7) / 0.3;
        const easeInCubic = laterProgress * laterProgress * laterProgress;
        contentParallaxY = -3 + easeInCubic * (-120 + 3);
      }
      gsap.set(".case2-content", {
        y: `${contentParallaxY}vh`,
        force3D: true,
      });

      // Video scrubbing
      if (videoElement && videoElement.duration && !isNaN(videoElement.duration)) {
        const targetTime = progress * videoElement.duration;
        if (Math.abs(videoElement.currentTime - targetTime) > 0.05) {
          videoElement.currentTime = targetTime;
        }
      }

      // Video opacity (fade in at 0.1)
      const videoOpacity = progress > 0.1 ? 1 : 0;
      if (videoElement) {
        gsap.set(videoElement, { opacity: videoOpacity });
      }

      // Pin/unpin logic
      const pinStartThreshold = 0.4;
      const shouldPin = progress >= pinStartThreshold && progress < 1;

      if (shouldPin) {
        gsap.set(contentWrapperRef, {
          position: "fixed",
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          width: "100%",
          height: "100vh",
          zIndex: 200,
        });
      } else if (progress >= 1) {
        // Unpinned at the end
        const containerRect = containerRef.getBoundingClientRect();
        const wrapperHeight = contentWrapperRef.offsetHeight;
        const unpinTopOffset = containerRect.height - wrapperHeight;

        gsap.set(contentWrapperRef, {
          position: "absolute",
          top: `${unpinTopOffset}px`,
          left: 0,
          x: 0,
          y: 0,
          width: "100%",
          zIndex: 1,
        });
      } else {
        // Initial state
        gsap.set(contentWrapperRef, {
          position: "relative",
          top: "auto",
          left: "auto",
          x: 0,
          y: 0,
          width: "100%",
          height: "100vh",
          zIndex: 1,
        });
      }
    },
  });

  scrollTriggers.push(mainST);

  return {
    timelines,
    scrollTriggers,
  };
}

/**
 * Animate title part 1 words (Redesigning, the)
 */
function animateTitlePart1Words(textProgress) {
  const words = ["Redesigning", "the"];
  words.forEach((word, index) => {
    const totalWords = words.length;
    const wordProgress = index / totalWords;
    const startProgress = wordProgress * 0.15;
    const endProgress = startProgress + 0.15 / totalWords;
    const opacity = getOpacity(textProgress, startProgress, endProgress);

    const element = document.querySelector(`.case2-title .word[data-word-part1="${index}"]`);
    if (element) {
      gsap.set(element, { opacity });
    }
  });
}

/**
 * Animate title part 2 words (Communications, App)
 */
function animateTitlePart2Words(textProgress) {
  const words = ["Communications", "App"];
  words.forEach((word, index) => {
    const totalWords = words.length;
    const wordProgress = index / totalWords;
    const startProgress = 0.15 + wordProgress * 0.15;
    const endProgress = startProgress + 0.15 / totalWords;
    const opacity = getOpacity(textProgress, startProgress, endProgress);

    const element = document.querySelector(`.case2-title .word[data-word-part2="${index}"]`);
    if (element) {
      gsap.set(element, { opacity });
    }
  });
}

/**
 * Animate description words
 */
function animateDescriptionWords(textProgress) {
  const description = "Communication platform for teams. Streamlining internal communications with intuitive design and powerful features. Empowering organizations to connect, collaborate, and share knowledge effectively across all departments and locations.";
  const words = description.split(" ");

  words.forEach((word, index) => {
    const totalWords = words.length;
    const wordProgress = index / totalWords;
    const startProgress = 0.5 + wordProgress * 0.15;
    const endProgress = startProgress + 0.15 / totalWords;
    const opacity = getOpacity(textProgress, startProgress, endProgress);

    const element = document.querySelector(`.case2-description .word[data-word-desc="${index}"]`);
    if (element) {
      gsap.set(element, { opacity });
    }
  });
}

/**
 * Animate card background
 */
function animateCardBackground(textProgress) {
  const opacity = getOpacity(textProgress, 0.45, 0.5);
  const element = document.querySelector(".case2-card-background");
  if (element) {
    gsap.set(element, { opacity });
  }
}

/**
 * Animate button
 */
function animateButton(textProgress) {
  const opacity = getOpacity(textProgress, 0.65, 0.75);
  const element = document.querySelector(".case2-open-story");
  if (element) {
    gsap.set(element, { opacity });
  }
}

/**
 * Calculate opacity based on progress range
 */
function getOpacity(progress, startProgress, endProgress) {
  if (progress < startProgress) return 0;
  if (progress > endProgress) return 1;
  return (progress - startProgress) / (endProgress - startProgress);
}

/**
 * Cleanup function to kill all ScrollTriggers and timelines
 * @param {Object} animationInstance - The instance returned from initCase2Animations
 */
export function cleanupCase2Animations(animationInstance) {
  if (animationInstance) {
    if (animationInstance.scrollTriggers) {
      animationInstance.scrollTriggers.forEach((st) => st.kill());
    }
    if (animationInstance.timelines) {
      animationInstance.timelines.forEach((tl) => tl.kill());
    }
  }

  // Kill all case2-related ScrollTriggers
  ScrollTrigger.getAll().forEach((st) => {
    if (st.vars.id === "case2-main") {
      st.kill();
    }
  });
}
