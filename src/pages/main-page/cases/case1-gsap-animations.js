import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initAnimations(pinContainer) {
  // ========================================
  // ScrollTrigger #1 - Общий Pin (200vh)
  // ========================================
  const mainPinST = ScrollTrigger.create({
    trigger: pinContainer,
    start: "top top",
    end: "bottom bottom",
    pin: true,
    pinSpacing: true,
    id: "case1-main-pin",
    markers: true,
  });

  // ========================================
  // Timeline #1 - Scroll-driven (0-100vh)
  // ========================================
  const tl1 = gsap.timeline({
    defaults: {
      duration: 0.5,
      ease: "power1.inOut",
      force3D: true,
    },
    scrollTrigger: {
      trigger: ".section-1",
      start: "top top",
      end: "bottom top",
      scrub: 1,
      id: "case1-timeline1",
      markers: true,
    },
  });

  // TIMELINE 1: Line growth with scrub
  // Small circle appears
  tl1.to(".line-element", {
    scale: 1,
    width: "6px",
    height: "6px",
    borderRadius: "30px",
    opacity: 1,
  });

  // Grow to 100px
  tl1.to(
    ".line-element",
    {
      width: "100px",
    },
    "<50%"
  );

  tl1.addLabel("small-line");

  // Expand to half screen
  tl1.to(
    ".line-element",
    {
      width: "50vw",
      duration: 6,
    },
    ">"
  );

  tl1.addLabel("almost-full-line");

  // Expand to full
  tl1.to(
    ".line-element",
    {
      width: "60vw",
      duration: 1,
    },
    ">"
  );

  tl1.addLabel("timeline1-end");

  // ========================================
  // Timeline #2 - Scroll-triggered (100-200vh)
  // ========================================
  const tl2 = gsap.timeline({
    defaults: {
      ease: "power1.inOut",
      force3D: true,
    },
    scrollTrigger: {
      trigger: ".section-2",
      start: "top top",
      end: "bottom top",
      toggleActions: "play reverse play reverse",
      id: "case1-timeline2",
      markers: true,
    },
  });

  // TIMELINE 2 animations start here
  // Move line down, Text moves up, Mask moves down
  tl2.to(".line-element", {
    y: "150px",
    duration: 1,
  });
  tl2.to(
    ".text-container",
    {
      y: "-100px",
      duration: 1,
    },
    "<"
  );
  tl2.to(
    ".mask-element",
    {
      y: "150px",
      duration: 1,
    },
    "<"
  );

  // Transform line back to 30px circle at bottom
  tl2.to(".line-element", {
    width: "30px",
    height: "30px",
    borderRadius: "15px",
    border: "15px solid #2563eb",
    backgroundColor: "#ffffff",
    duration: 1,
  });

  // Move 30px circle to center
  tl2.to(
    ".line-element",
    {
      y: "0px",
      duration: 1,
    },
    "-=0.5"
  );

  // Expand to video size (starts in the middle of moving to center)
  tl2.to(
    ".line-element",
    {
      width: "75vw",
      height: "35vw",
      borderRadius: "30px",
      border: "6px solid #DDDDDD",
      duration: 1,
    },
    "-=0.5"
  );

  // Hide button content
  tl2.to(
    ".button-text",
    {
      opacity: 0,
      duration: 0.5,
    },
    0
  );

  // prep story button - start as a small dot
  tl2.set(
    ".open-story-button",
    {
      opacity: 0,
      width: "30px",
      height: "30px",
      borderRadius: "15px",
      y: "20.5vw",
    },
    0
  );

  // Show story button as dot
  tl2.to(
    ".open-story-button",
    {
      opacity: 1,
      duration: 0.3,
    },
    "+=0.5"
  );

  // Expand to full button size
  tl2.to(
    ".open-story-button",
    {
      width: "300px",
      height: "60px",
      borderRadius: "30px",
      duration: 0.5,
    },
    "+=0.3"
  );

  return {
    mainPin: mainPinST,
    timeline1: tl1,
    timeline2: tl2,
    scrollTrigger1: tl1.scrollTrigger,
    scrollTrigger2: tl2.scrollTrigger,
  };
}
