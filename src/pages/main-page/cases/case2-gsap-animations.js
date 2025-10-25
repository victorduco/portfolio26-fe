import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initGSAP } from "./gsap-utils";

initGSAP();

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

  tl.to(".case2-content", {
    opacity: 1,
    y: 0,
    duration: 1.5,
  });

  tl.to(
    ".case2-title .word[data-word-part1]",
    {
      opacity: 1,
      duration: 0.4,
      stagger: 0.1,
    },
    1.2
  );

  tl.to(
    ".case2-title .word[data-word-part2]",
    {
      opacity: 1,
      duration: 0.4,
      stagger: 0.1,
    },
    1.6
  );

  tl.to(
    ".case2-card-background",
    {
      opacity: 1,
      duration: 0.5,
    },
    2.0
  );

  tl.to(
    ".case2-description .word[data-word-desc]",
    {
      opacity: 1,
      duration: 0.8,
      stagger: 0.02,
    },
    2.2
  );

  tl.to(
    ".case2-open-story",
    {
      opacity: 1,
      duration: 0.6,
    },
    3.0
  );

  if (videoElement) {
    ScrollTrigger.create({
      trigger: trigger,
      start: "top top",
      end: "+=400%",
      scrub: true,
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
    timeline: tl,
    scrollTrigger: tl.scrollTrigger,
  };
}
