import { gsap } from "gsap";
import { initGSAP } from "./gsap-utils";
import { ScrollTrigger } from "gsap/ScrollTrigger";

initGSAP();

export function initAnimations(trigger) {
  const tl = gsap.timeline({
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
    duration: 0.5,
    ease: "power2.inOut",
    force3D: true,
  });

  // Grow to 100px
  tl.to(
    ".line-element",
    {
      width: "100px",
      duration: 0.5,
      ease: "power2.inOut",
      force3D: true,
    },
    "<50%"
  );

  // Expand to half screen
  tl.to(
    ".line-element",
    {
      width: "50vw",
      duration: 4,
      ease: "power2.inOut",
      force3D: true,
    },
    ">"
  );

  // Move line down
  tl.to(
    ".line-element",
    {
      y: "150px",
      duration: 0.5,
      ease: "power2.inOut",
      force3D: true,
    },
    ">"
  );

  // Text moves up
  tl.to(
    ".text-container",
    {
      y: "-100px",
      duration: 0.5,
      ease: "power2.inOut",
      force3D: true,
    },
    "<"
  );

  // Mask moves down
  tl.to(
    ".mask-element",
    {
      y: "150px",
      duration: 0.5,
      ease: "power2.inOut",
      force3D: true,
    },
    "<"
  );

  // Prep to hide bg
  tl.to(
    ".line-element",
    {
      backgroundColor: "#ffffff",
      force3D: true,
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
      duration: 0.5,
      ease: "power2.inOut",
      force3D: true,
    },
    "<100%"
  );

  // Show button content
  tl.to(
    ".button-content-wrapper",
    {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
      force3D: true,
    },
    "<"
  );

  // Expand to video size
  tl.to(
    ".line-element",
    {
      width: "75vw",
      height: "45vw",
      borderRadius: "26px",
      border: "6px solid #DDDDDD",
      y: "0px",
      duration: 0.5,
      ease: "power2.inOut",
      force3D: true,
    },
    ">"
  );

  // Hide button content
  tl.to(
    ".button-content-wrapper",
    {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      force3D: true,
    },
    "<"
  );

  // Show story button
  tl.to(
    ".open-story-button",
    {
      height: "60px",
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
      force3D: true,
    },
    ">"
  );

  return {
    timeline: tl,
    scrollTrigger: tl.scrollTrigger,
  };
}
