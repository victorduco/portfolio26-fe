import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const dispatch = (id) => window.dispatchEvent(new CustomEvent('story-section-active', { detail: { sectionId: id } }));

export function initAnimations(pinContainer) {
  const section1 = pinContainer.querySelector(".section-1");
  const isMobile = window.innerWidth <= 767;
  const verticalOffset = isMobile ? "100px" : "105px";
  const textOffset = isMobile ? "-200px" : "-210px";

  gsap.set(".line-element", { xPercent: -50, yPercent: -50, x: 0, y: 0 });
  gsap.set(".text-container", { xPercent: -50, yPercent: 0, x: 0, y: 0 });

  ScrollTrigger.create({
    trigger: section1, start: "top top", end: "bottom bottom", pin: ".circle", id: "MAIN-PIN", invalidateOnRefresh: true,
    onEnter: () => dispatch('story1'), onEnterBack: () => dispatch('story1'),
    onLeave: () => dispatch('story2'), onLeaveBack: () => dispatch('intro'),
  });

  const tl = gsap.timeline({
    defaults: { ease: "power1.inOut" },
    scrollTrigger: {
      trigger: section1, start: "top top", end: "bottom bottom", scrub: 1, id: "MAIN-TIMELINE", invalidateOnRefresh: true,
      onRefresh: () => { gsap.set(".line-element", { xPercent: -50, yPercent: -50 }); gsap.set(".text-container", { xPercent: -50 }); },
    },
  });

  // Phase 1: Line grows
  tl.fromTo(".line-element",
    { width: "40px", height: "40px", borderRadius: "20px", backgroundColor: "#007aff", border: "4px solid #007aff", xPercent: -50 },
    { height: "6px", width: "5vw", duration: 3, xPercent: -50 }
  );
  tl.to(".line-element", { width: isMobile ? "100vw" : "60vw", duration: 7, xPercent: -50 }, "<25%");

  // Phase 2: Vertical movement
  tl.to(".line-element", { y: verticalOffset, borderRadius: isMobile ? "0px" : "30px", duration: 5, xPercent: -50 }, "<75%");
  tl.to(".text-container", { y: textOffset, duration: 5 }, "<");
  tl.to(".mask-element", { y: verticalOffset, duration: 5 }, "<");

  // Phase 3: Transform to button
  tl.to(".line-element", { width: isMobile ? "calc(100vw - 48px)" : "280px", borderRadius: "30px", backgroundColor: "#ffffff", duration: 8, xPercent: -50 }, "+=5");
  tl.to(".line-element", { height: "60px", border: "4px solid #007aff", duration: 7, xPercent: -50 }, "<50%");

  // Phase 4: Show button
  tl.to(".open-story-text", { opacity: 1, duration: 3 }, ">-3");
  tl.set(".line-element", { pointerEvents: "auto" }, "<");
  tl.to({}, { duration: 10 });

  setTimeout(() => ScrollTrigger.refresh(), 0);
  return { mainPin: ScrollTrigger.getById("MAIN-PIN"), timeline: tl };
}
