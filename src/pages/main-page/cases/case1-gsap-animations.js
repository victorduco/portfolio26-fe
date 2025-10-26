// case1-gsap-animations.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function initAnimations(pinContainer) {
  // Find sections inside pinContainer
  const section1 = pinContainer.querySelector(".section-1");
  const section2 = pinContainer.querySelector(".section-2");
  const section3 = pinContainer.querySelector(".section-3");

  // Main pin: пинит .circle на всё время прохождения всех трех секций
  ScrollTrigger.create({
    trigger: section1,
    start: "top top",
    endTrigger: section3,
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
      snap: {
        snapTo: [0, 1], // snap к началу (0) или концу (1) анимации
        duration: { min: 0.3, max: 1 },
        delay: 0,
        ease: "power1.inOut",
        inertia: false,
      },
      id: "TL1",
      invalidateOnRefresh: true,
    },
  });

  // Анимация роста линии: сначала уменьшение по высоте, потом расширение
  tl1.fromTo(
    ".line-element",
    {
      width: "40px",
      height: "40px",
      borderRadius: "20px",
      opacity: 1,
    },
    {
      height: "6px",
      borderRadius: "3px",
      duration: 0.6,
    }
  );

  // Одновременно с уменьшением высоты расширяется до 10vw
  tl1.to(
    ".line-element",
    {
      width: "10vw",
      duration: 0.6,
    },
    "<"
  );

  // Затем продолжает расширяться до 60vw
  tl1.to(".line-element", {
    width: "60vw",
    borderRadius: "3px",
    duration: 1.4,
  });

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

  // Движение элементов вниз
  tl2.to(".line-element", {
    y: "150px",
    borderRadius: "3px",
    duration: 0.5
  });
  tl2.to(".text-container", { y: "-100px", duration: 0.5 }, "<");
  tl2.to(".mask-element", { y: "150px", duration: 0.5 }, "<");

  // Трансформация линии в шарик (пока внизу)
  tl2.to(".line-element", {
    width: "25px",
    height: "25px",
    borderRadius: "12.5px",
    border: "15px solid #2563eb",
    backgroundColor: "#ffffff",
    duration: 0.5,
  });

  // Подъем шарика вверх и увеличение (пока еще круг)
  tl2.to(".line-element", {
    y: "0px",
    borderRadius: "12.5px",
    duration: 0.5
  });
  tl2.to(
    ".line-element",
    {
      border: "6px solid #DDDDDD",
      borderRadius: "12.5px",
      duration: 0.5,
    },
    "<"
  );

  // Трансформация круга в прямоугольник
  tl2.to(
    ".line-element",
    {
      width: "75vw",
      height: "35vw",
      borderRadius: "30px",
      duration: 0.5,
    },
    "<50%"
  );

  // Анимация кнопки
  tl2.set(".open-story-button", {
    opacity: 1,
    width: "300px",
    height: "0px",
    borderRadius: "30px",
    y: "20.5vw",
  });
  tl2.to(".button-text", { opacity: 0, duration: 0.5 }, ">");
  tl2.to(".open-story-button", { height: "60px", duration: 0.25 }, "<25%");

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
