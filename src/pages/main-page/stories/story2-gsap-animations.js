import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const dispatch = (id) => window.dispatchEvent(new CustomEvent('story-section-active', { detail: { sectionId: id } }));

export function initAnimations(trigger) {
  const videoElement = document.querySelector(".story2-video");
  const contentElement = document.querySelector(".story2-content");
  const titleElement = document.querySelector(".story2-title");

  const getCenter = (el) => window.innerHeight / 2 - (el?.offsetHeight || 0) / 2 - 50;

  ScrollTrigger.create({
    trigger, start: "top top", end: "bottom bottom", pin: true, pinSpacing: false, id: "story2-pin",
    onEnter: () => dispatch('story2'), onEnterBack: () => dispatch('story2'),
    onLeave: () => dispatch('story3'), onLeaveBack: () => dispatch('story1'),
  });

  gsap.set(".story2-content", { opacity: 0, y: () => getCenter(titleElement) });

  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    scrollTrigger: { trigger, start: "top bottom", end: "bottom bottom", scrub: 1, id: "story2-main" },
  });

  // Sequential reveal: content fade → company → title words → paragraphs → button → image
  tl.fromTo(".story2-content", { opacity: 0 }, { opacity: 1, duration: 0.2 }, -0.3);
  tl.to(".story2-company", { opacity: 1, duration: 0.1 }, -0.3);
  tl.to(".story2-title .word[data-word-part1]", { opacity: 1, duration: 0.05, stagger: 0.01 }, -0.25);
  tl.to(".story2-title .word[data-word-part2]", { opacity: 1, duration: 0.05, stagger: 0.01 }, -0.2);
  tl.to(".story2-content", { y: () => getCenter(contentElement), duration: 1.0, ease: "none" }, 0);
  tl.to(".story2-paragraph-part1", { opacity: 1, duration: 0.15 }, 0.45);
  tl.to(".story2-paragraph-part2", { opacity: 1, duration: 0.15 }, 0.675);
  tl.to(".story2-open-story", { opacity: 1, duration: 0.15 }, 0.9);
  tl.to(".story2-final-image", { opacity: 1, duration: 0.05 }, 0.8);
  tl.to({}, { duration: 0.25 });

  if (videoElement) {
    const setVideoTime = gsap.quickSetter(videoElement, "currentTime");
    ScrollTrigger.create({
      trigger, start: "top bottom", end: "bottom bottom", scrub: 2, id: "story2-video-scrub",
      onUpdate: (self) => {
        if (videoElement.duration && !isNaN(videoElement.duration)) {
          setVideoTime(Math.min(self.progress / 0.6, 1) * videoElement.duration);
        }
      },
    });
  }

  return { timeline: tl, scrollTrigger: tl.scrollTrigger };
}
