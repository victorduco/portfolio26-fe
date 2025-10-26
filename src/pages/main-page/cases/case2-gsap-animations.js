import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initAnimations(trigger) {
  const videoElement = document.querySelector(".case2-video");

  const tl = gsap.timeline({
    defaults: {
      ease: "power2.out",
      force3D: true,
    },
    scrollTrigger: {
      trigger: trigger,
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: true,
      scrub: 1,
      id: "case2-main",
    },
  });

  // Sync with Lenis snap points: 0%, 20%, 40%, 60%, 80%, 100%
  // Timeline is normalized 0-1, so snap points are at: 0, 0.2, 0.4, 0.6, 0.8, 1.0

  // Calculate vertical center position
  const contentElement = document.querySelector(".case2-content");
  const titleElement = document.querySelector(".case2-title");

  // Set initial state - title roughly centered
  gsap.set(".case2-content", {
    opacity: 1,
    y: () => {
      // Position so title is roughly centered at start
      const titleHeight = titleElement ? titleElement.offsetHeight : 0;
      return (window.innerHeight / 2) - (titleHeight / 2) - 50; // Slightly above center
    },
  });

  // 0-100% - Container moves to center full content at the end
  tl.to(".case2-content", {
    y: () => {
      // Calculate center: 50vh - half of full content height
      const contentHeight = contentElement ? contentElement.offsetHeight : 0;
      return (window.innerHeight / 2) - (contentHeight / 2);
    },
    duration: 1.0, // Full timeline duration
    ease: "none", // Linear movement
  }, 0);

  tl.to(
    ".case2-title .word[data-word-part1]",
    {
      opacity: 1,
      duration: 0.1,
      stagger: 0.02,
    },
    0
  );

  tl.to(
    ".case2-title .word[data-word-part2]",
    {
      opacity: 1,
      duration: 0.1,
      stagger: 0.02,
    },
    0.05
  );

  // 20% - Paragraph 1 appears
  tl.to(
    ".case2-paragraph-1",
    {
      opacity: 1,
      duration: 0.15,
    },
    0.2
  );

  // 40% - Paragraph 2 appears
  tl.to(
    ".case2-paragraph-2",
    {
      opacity: 1,
      duration: 0.15,
    },
    0.4
  );

  // 60% - Paragraph 3 appears
  tl.to(
    ".case2-paragraph-3",
    {
      opacity: 1,
      duration: 0.15,
    },
    0.6
  );

  // 80% - Button appears
  tl.to(
    ".case2-open-story",
    {
      opacity: 1,
      duration: 0.15,
    },
    0.8
  );

  // 100% - nothing (hold final state)

  if (videoElement) {
    // Video scrubbing based on scroll - synced with full timeline (0-100%)
    ScrollTrigger.create({
      trigger: trigger,
      start: "top top",
      end: "+=400%",
      scrub: true,
      id: "case2-video-scrub",
      onUpdate: (self) => {
        if (videoElement.duration && !isNaN(videoElement.duration)) {
          const targetTime = self.progress * videoElement.duration;
          if (Math.abs(videoElement.currentTime - targetTime) > 0.01) {
            videoElement.currentTime = targetTime;
          }
        }
      },
    });
  }

  return {
    timeline: tl,
    scrollTrigger: tl.scrollTrigger,
  };
}
