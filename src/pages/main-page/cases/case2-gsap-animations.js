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
 * - Scale animation (0.5 to 1.0) with pin
 * - Text reveal by words (title part 1, title part 2, description)
 * - Card background fade in
 * - Button fade in
 * - Data-speed based parallax effects
 * - Video scrubbing synchronized with scroll
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
    if (st.vars.id?.startsWith("case2-")) {
      st.kill();
    }
  });

  // Clear any GSAP inline styles from previous runs
  if (contentWrapperRef) {
    gsap.set(contentWrapperRef, { clearProps: "all" });
  }

  const timelines = [];
  const scrollTriggers = [];

  // Create main timeline for all animations
  const mainTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef,
      start: "top bottom", // Start when section enters viewport
      end: "bottom bottom",
      scrub: 1,
      pin: contentWrapperRef,
      pinSpacing: false,
      id: "case2-main",
      anticipatePin: 1,
    },
  });

  // Phase 1: Scale animation (0 -> 20%) - from entering viewport to center
  mainTimeline.fromTo(
    contentWrapperRef,
    {
      scale: 0.5,
      transformOrigin: "center center",
    },
    {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
      force3D: true,
    },
    0
  );

  // Phase 2: Text animations (20% -> 100%)
  const textStartTime = 0.2;

  // Title part 1 words (40% -> 55%)
  const titlePart1Elements = document.querySelectorAll(
    ".case2-title .word[data-word-part1]"
  );
  if (titlePart1Elements.length > 0) {
    mainTimeline.fromTo(
      titlePart1Elements,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.15,
        stagger: 0.15 / titlePart1Elements.length,
        ease: "power2.out",
      },
      textStartTime
    );
  }

  // Title part 2 words (55% -> 70%)
  const titlePart2Elements = document.querySelectorAll(
    ".case2-title .word[data-word-part2]"
  );
  if (titlePart2Elements.length > 0) {
    mainTimeline.fromTo(
      titlePart2Elements,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.15,
        stagger: 0.15 / titlePart2Elements.length,
        ease: "power2.out",
      },
      textStartTime + 0.15
    );
  }

  // Card background (85% -> 90%)
  const cardBackground = document.querySelector(".case2-card-background");
  if (cardBackground) {
    mainTimeline.fromTo(
      cardBackground,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.05,
        ease: "power2.out",
      },
      textStartTime + 0.45
    );
  }

  // Description words (90% -> 105%)
  const descriptionElements = document.querySelectorAll(
    ".case2-description .word[data-word-desc]"
  );
  if (descriptionElements.length > 0) {
    mainTimeline.fromTo(
      descriptionElements,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.15,
        stagger: 0.15 / descriptionElements.length,
        ease: "power2.out",
      },
      textStartTime + 0.5
    );
  }

  // Button (105% -> 115%)
  const button = document.querySelector(".case2-open-story");
  if (button) {
    mainTimeline.fromTo(
      button,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.1,
        ease: "power2.out",
      },
      textStartTime + 0.65
    );
  }

  // Video opacity - visible from the start
  if (videoElement) {
    mainTimeline.fromTo(
      videoElement,
      { opacity: 1 },
      {
        opacity: 1,
        duration: 0.01,
      },
      0
    );
  }

  timelines.push(mainTimeline);

  // Data-speed based parallax for content (more dramatic movement)
  const content = document.querySelector(".case2-content");
  if (content) {
    gsap.to(content, {
      y: "-120vh",
      ease: "power3.in",
      scrollTrigger: {
        trigger: containerRef,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
        id: "case2-parallax-content",
      },
    });
  }

  // Video scrubbing
  if (videoElement) {
    ScrollTrigger.create({
      trigger: containerRef,
      start: "top bottom",
      end: "bottom bottom",
      scrub: 1,
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

    const element = document.querySelector(
      `.case2-title .word[data-word-part1="${index}"]`
    );
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

    const element = document.querySelector(
      `.case2-title .word[data-word-part2="${index}"]`
    );
    if (element) {
      gsap.set(element, { opacity });
    }
  });
}

/**
 * Animate description words
 */
function animateDescriptionWords(textProgress) {
  const description =
    "Communication platform for teams. Streamlining internal communications with intuitive design and powerful features. Empowering organizations to connect, collaborate, and share knowledge effectively across all departments and locations.";
  const words = description.split(" ");

  words.forEach((word, index) => {
    const totalWords = words.length;
    const wordProgress = index / totalWords;
    const startProgress = 0.5 + wordProgress * 0.15;
    const endProgress = startProgress + 0.15 / totalWords;
    const opacity = getOpacity(textProgress, startProgress, endProgress);

    const element = document.querySelector(
      `.case2-description .word[data-word-desc="${index}"]`
    );
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
