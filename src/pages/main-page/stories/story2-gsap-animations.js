import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initAnimations(trigger) {
  const videoElement = document.querySelector(".story2-video");

  // Create pin ScrollTrigger separately (starts at top top)
  ScrollTrigger.create({
    trigger: trigger,
    start: "top top",
    end: "bottom bottom",
    pin: true,
    pinSpacing: false,
    id: "story2-pin",
  });

  // Animation timeline starts earlier (top bottom) for text fade-in
  const tl = gsap.timeline({
    defaults: {
      ease: "power2.out",
    },
    scrollTrigger: {
      trigger: trigger,
      start: "top bottom",
      end: "bottom bottom",
      scrub: 1,
      id: "story2-main",
    },
  });

  // Sync with Lenis snap points: 0%, 20%, 40%, 60%, 80%, 100%
  // Timeline is normalized 0-1, so snap points are at: 0, 0.2, 0.4, 0.6, 0.8, 1.0

  // Calculate vertical center position
  const contentElement = document.querySelector(".story2-content");
  const titleElement = document.querySelector(".story2-title");

  // Set initial state - content starts with opacity 0 (before scroll trigger)
  gsap.set(".story2-content", {
    opacity: 0,
    y: () => {
      // Position so title is roughly centered at start
      const titleHeight = titleElement ? titleElement.offsetHeight : 0;
      return window.innerHeight / 2 - titleHeight / 2 - 50; // Slightly above center
    },
  });

  // -0.3 to -0.1 - Fade in content as user approaches the trigger (earlier)
  tl.fromTo(
    ".story2-content",
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 0.2,
    },
    -0.3
  );

  // -0.3 - Company name appears
  tl.to(
    ".story2-company",
    {
      opacity: 1,
      duration: 0.1,
    },
    -0.3
  );

  // -0.25 to -0.15 - Title words appear before reaching top top (earlier)
  tl.to(
    ".story2-title .word[data-word-part1]",
    {
      opacity: 1,
      duration: 0.05,
      stagger: 0.01,
    },
    -0.25
  );

  tl.to(
    ".story2-title .word[data-word-part2]",
    {
      opacity: 1,
      duration: 0.05,
      stagger: 0.01,
    },
    -0.2
  );

  // 0-100% - Container moves to center full content at the end
  tl.to(
    ".story2-content",
    {
      y: () => {
        // Calculate center: 50vh - half of full content height - 50px offset
        const contentHeight = contentElement ? contentElement.offsetHeight : 0;
        return window.innerHeight / 2 - contentHeight / 2 - 50;
      },
      duration: 1.0, // Full timeline duration
      ease: "none", // Linear movement
    },
    0
  );

  // 45% - Paragraph part 1 appears (text + logos)
  tl.to(
    ".story2-paragraph-part1",
    {
      opacity: 1,
      duration: 0.15,
    },
    0.45
  );

  // 67.5% - Paragraph part 2 appears (text + badges)
  tl.to(
    ".story2-paragraph-part2",
    {
      opacity: 1,
      duration: 0.15,
    },
    0.675
  );

  // 90% - Button appears
  tl.to(
    ".story2-open-story",
    {
      opacity: 1,
      duration: 0.15,
    },
    0.9
  );

  // 75% - Final image fades in, replacing video (when video completes)
  tl.to(
    ".story2-final-image",
    {
      opacity: 1,
      duration: 0.05,
    },
    0.8
  );

  // PAUSE: Add empty space at the end to keep the pin active while animations are done
  tl.to({}, { duration: 0.25 });

  if (videoElement) {
    // Use quickSetter for smoother video scrubbing
    const setVideoTime = gsap.quickSetter(videoElement, "currentTime");

    // Video scrubbing based on scroll - completes at 75% scroll progress
    ScrollTrigger.create({
      trigger: trigger,
      start: "top bottom", // Start playing when section enters viewport
      end: "bottom bottom",
      scrub: 2,
      id: "story2-video-scrub",
      onUpdate: (self) => {
        if (videoElement.duration && !isNaN(videoElement.duration)) {
          // Map 0-75% scroll to 0-100% video
          // Video completes when scroll reaches 75%
          const videoProgress = Math.min(self.progress / 0.6, 1);
          const targetTime = videoProgress * videoElement.duration;
          // Use quickSetter for smoother performance
          setVideoTime(targetTime);
        }
      },
    });
  }

  return {
    timeline: tl,
    scrollTrigger: tl.scrollTrigger,
  };
}
