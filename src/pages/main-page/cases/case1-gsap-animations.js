// case1-gsap-animations.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function initAnimations(pinContainer) {
  // Find sections inside pinContainer
  const section1 = pinContainer.querySelector(".section-1");
  const section2 = pinContainer.querySelector(".section-2");

  // Main pin: пинит .circle на всё время прохождения обеих секций + 50vh
  ScrollTrigger.create({
    trigger: section1,
    start: "top top",
    endTrigger: section2,
    end: "bottom bottom",
    pin: ".circle",
    id: "MAIN-PIN",
    invalidateOnRefresh: true,
  });

  // 1) SCRUB timeline: анимация линии
  const tl1 = gsap.timeline({
    defaults: { ease: "power1.inOut", force3D: true },
    scrollTrigger: {
      trigger: section1,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      id: "TL1",
      invalidateOnRefresh: true,
    },
  });

  // Анимация роста линии
  tl1.fromTo(
    ".line-element",
    {
      width: "40px",
      height: "40px",
      borderRadius: "20px",
      opacity: 1,
    },
    {
      width: "60vw",
      duration: 1,
    }
  );

  // 2) NON-SCRUB timeline: срабатывает когда линия выросла
  const tl2 = gsap.timeline({
    defaults: { ease: "power1.inOut", force3D: true },
    scrollTrigger: {
      trigger: section2,
      start: "top center",
      toggleActions: "play none none reverse",
      id: "TL2",
    },
  });

  // Движение элементов
  tl2.to(".line-element", { y: "150px", duration: 1 });
  tl2.to(".text-container", { y: "-100px", duration: 1 }, "<");
  tl2.to(".mask-element", { y: "150px", duration: 1 }, "<");

  // Трансформация линии в прямоугольник
  tl2.to(".line-element", {
    width: "30px",
    height: "30px",
    borderRadius: "15px",
    border: "15px solid #2563eb",
    backgroundColor: "#ffffff",
    duration: 1,
  });

  tl2.to(".line-element", { y: "0px", duration: 1 }, "-=0.5");
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

  // Анимация кнопки
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
  tl2.to(".button-text", { opacity: 0, duration: 0.5 }, 0);
  tl2.to(".open-story-button", { opacity: 1, duration: 0.3 }, "+=0.5");
  tl2.to(
    ".open-story-button",
    { width: "300px", height: "60px", borderRadius: "30px", duration: 0.5 },
    "+=0.3"
  );

  // Refresh после загрузки
  setTimeout(() => ScrollTrigger.refresh(), 0);

  // Возвращаем все ScrollTrigger'ы для cleanup
  const mainPinST = ScrollTrigger.getById("MAIN-PIN");

  return {
    mainPin: mainPinST,
    timeline1: tl1,
    timeline2: tl2,
  };
}
