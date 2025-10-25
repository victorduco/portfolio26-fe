import { gsap } from "gsap";
import { initGSAP } from "./gsap-utils";
import { ScrollTrigger } from "gsap/ScrollTrigger";

initGSAP();

export function initAnimations(trigger) {
  const tl = gsap.timeline({
    defaults: {
      duration: 0.5,
      ease: "power2.inOut",
      force3D: true,
    },
    scrollTrigger: {
      trigger: trigger,
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: true,
      scrub: 1,
      snap: {
        snapTo: "labels",
        duration: 0.5,
        delay: 0,
        ease: "power2.inOut",
      },
      markers: true,
      id: "case1-main",
    },
  });

  // Small circle appears
  tl.to(".line-element", {
    scale: 1,
    width: "6px",
    height: "6px",
    borderRadius: "3px",
    opacity: 1,
  });

  // Grow to 100px
  tl.to(
    ".line-element",
    {
      width: "100px",
    },
    "<50%"
  );

  // Expand to half screen
  tl.to(
    ".line-element",
    {
      width: "50vw",
      duration: 4,
    },
    ">"
  );

  // Move line down
  tl.to(
    ".line-element",
    {
      y: "150px",
    },
    ">"
  );

  // Text moves up
  tl.to(
    ".text-container",
    {
      y: "-100px",
    },
    "<"
  );

  // Mask moves down
  tl.to(
    ".mask-element",
    {
      y: "150px",
    },
    "<"
  );

  // Prep to hide bg
  tl.to(
    ".line-element",
    {
      backgroundColor: "#ffffff",
    },
    "<"
  );

  // Transform to button
  tl.to(
    ".line-element",
    {
      width: "50vw",
      height: "96px",
      borderRadius: "48px",
    },
    "<100%"
  );

  // Show button content
  tl.to(
    ".button-content-wrapper",
    {
      opacity: 1,
      ease: "power2.out",
    },
    "<"
  );

  // Expand to video size
  tl.to(
    ".line-element",
    {
      width: "75vw",
      height: "35vw",
      borderRadius: "26px",
      border: "6px solid #DDDDDD",
      y: "0px",
    },
    ">"
  );

  // Hide button content
  tl.to(
    ".button-text",
    {
      opacity: 0,
      ease: "power2.out",
    },
    "<"
  );

  // prep story button
  tl.set(
    ".open-story-button",
    {
      opacity: 0,
      height: "0",
      y: "20.5vw",
    },
    "<"
  );

  // Show story button
  tl.to(
    ".open-story-button",
    {
      height: "60px",
      opacity: 1,
      y: "20.5vw",
      ease: "power2.out",
    },
    ">+=0.5"
  );

  return {
    timeline: tl,
    scrollTrigger: tl.scrollTrigger,
  };
}
