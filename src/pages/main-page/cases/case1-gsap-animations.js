import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initAnimations(trigger) {
  // Timeline 1: Line growth with scrub
  const tl1 = gsap.timeline({
    defaults: {
      duration: 0.5,
      ease: "power1.inOut",
      force3D: true,
    },
    scrollTrigger: {
      trigger: trigger,
      start: "top top",
      end: "+=300%",
      pin: true,
      pinSpacing: false, // Important: disable pinSpacing for first timeline
      scrub: true,
      id: "case1-timeline1",
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

  //
  // Move line down, Text moves up, Mask moves down
  tl1.to(
    ".line-element",
    {
      y: "150px",
      duration: 1,
      delay: 1,
    },
    "almost-full-line"
  );
  tl1.to(
    ".text-container",
    {
      y: "-100px",
      duration: 1,
      delay: 1,
    },
    "almost-full-line"
  );
  tl1.to(
    ".mask-element",
    {
      y: "150px",
      duration: 1,
      delay: 1,
    },
    "almost-full-line"
  );

  tl1.addLabel("timeline1-end");

  // Timeline 2: Circle to video transformation without scrub
  const tl2 = gsap.timeline({
    defaults: {
      ease: "power1.inOut",
      force3D: true,
    },
    scrollTrigger: {
      trigger: trigger,
      start: "top -300%", // Start right after timeline 1 ends (300% offset)
      end: "+=100%",
      pin: true,
      pinSpacing: true,
      scrub: false,
      id: "case1-timeline2",
    },
  });

  // TIMELINE 2 animations start here
  //
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
    timeline1: tl1,
    timeline2: tl2,
    scrollTrigger1: tl1.scrollTrigger,
    scrollTrigger2: tl2.scrollTrigger,
  };
}
