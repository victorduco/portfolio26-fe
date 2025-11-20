// case1-gsap-animations.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function initAnimations(pinContainer) {
  // Find section inside pinContainer
  const section1 = pinContainer.querySelector(".section-1");

  // Check if mobile
  const isMobile = window.innerWidth <= 767;

  // Set initial transform values for GSAP
  gsap.set(".line-element", {
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0
  });

  // Main pin: pins .circle for the duration of section1
  ScrollTrigger.create({
    trigger: section1,
    start: "top top",
    end: "bottom bottom",
    pin: ".circle",
    id: "MAIN-PIN",
    invalidateOnRefresh: true,
  });

  // Main timeline: simplified animation for line to button transformation
  const mainTimeline = gsap.timeline({
    defaults: { ease: "power1.inOut", force3D: false },
    scrollTrigger: {
      trigger: section1,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      id: "MAIN-TIMELINE",
      invalidateOnRefresh: true,
      onRefresh: () => {
        // Reset transform on refresh to prevent positioning bugs
        gsap.set(".line-element", {
          xPercent: -50,
          yPercent: -50,
        });
      },
    },
  });

  // PHASE 1: Line grows horizontally (30% of timeline)
  // First, quickly flatten the circle into a thin line
  mainTimeline.fromTo(
    ".line-element",
    {
      width: "40px",
      height: "40px",
      borderRadius: "20px",
      backgroundColor: "#007aff",
      border: "4px solid #007aff",
    },
    {
      height: "6px",
      width: "5vw",
      border: "4px solid #007aff",
      borderRadius: "20px",
      backgroundColor: "#007aff",
      duration: 3,
    }
  );

  // Then, expand the line horizontally
  mainTimeline.to(
    ".line-element",
    {
      width: isMobile ? "100vw" : "60vw",
      duration: 7,
    },
    "<25%"
  );

  // PHASE 2: Move elements vertically (20% of timeline)
  // Balanced spacing for better laptop visibility: 105px (desktop) / 100px (mobile for more space)
  const verticalOffset = isMobile ? "100px" : "105px";
  const textOffset = isMobile ? "-200px" : "-210px";

  mainTimeline.to(
    ".line-element",
    {
      y: verticalOffset,
      xPercent: -50,
      borderRadius: isMobile ? "0px" : "30px",
      duration: 5,
    },
    "<75%"
  );
  // Text needs to move further up because it starts lower (at line level, not centered)
  // Total distance from initial position to final = 105px (line movement) + 105px (spacing) = 210px
  mainTimeline.to(".text-container", { y: textOffset, duration: 5 }, "<");
  // Mask moves down with the line to keep blue line = top edge of mask
  mainTimeline.to(".mask-element", { y: verticalOffset, duration: 5 }, "<");

  // PHASE 3: Transform line into button (50% of timeline)
  // First, shrink the width and change background to white
  mainTimeline.to(
    ".line-element",
    {
      width: isMobile ? "calc(100vw - 48px)" : "280px",
      xPercent: -50,
      borderRadius: "30px",
      backgroundColor: "#ffffff",
      duration: 8,
    },
    "+=5"
  );

  // Then, increase height
  mainTimeline.to(
    ".line-element",
    {
      height: "60px",
      xPercent: -50,
      border: "4px solid #007aff",
      duration: 7,
    },
    "<50%"
  );

  // PHASE 4: Show button text and enable clicking (final 10% of timeline)
  mainTimeline.to(
    ".open-story-text",
    {
      opacity: 1,
      duration: 3,
    },
    ">-3"
  );

  // Enable button clicking when text appears
  mainTimeline.set(".line-element", { pointerEvents: "auto" }, "<");

  // Refresh after loading
  setTimeout(() => ScrollTrigger.refresh(), 0);

  // Return ScrollTriggers for cleanup
  const mainPinST = ScrollTrigger.getById("MAIN-PIN");

  return {
    mainPin: mainPinST,
    timeline: mainTimeline,
  };
}
