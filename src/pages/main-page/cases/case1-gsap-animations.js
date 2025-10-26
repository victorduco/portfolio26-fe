// case1-gsap-animations.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function initAnimations(pinContainer, videoPlayerRef, videoExpanded) {
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

  // 2) SCRUB timeline: срабатывает когда линия выросла
  const tl2 = gsap.timeline({
    defaults: { ease: "power1.inOut", force3D: true },
    scrollTrigger: {
      trigger: section2,
      start: "top center",
      end: "bottom bottom",
      scrub: 1,
      id: "TL2",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Video control logic based on progress
        // When line transforms to rectangle (around 70% progress), try to play video
        if (self.progress >= 0.7) {
          if (videoExpanded && !videoExpanded.value) {
            videoExpanded.value = true;
            if (videoPlayerRef && videoPlayerRef.value) {
              videoPlayerRef.value.attemptPlay();
            }
          }
        } else {
          // Before rectangle formation, pause video
          if (videoExpanded && videoExpanded.value) {
            videoExpanded.value = false;
            if (videoPlayerRef && videoPlayerRef.value) {
              videoPlayerRef.value.pauseVideo();
            }
          }
        }
      },
      onLeave: () => {
        // Pause video when leaving the section
        if (videoExpanded && videoExpanded.value) {
          videoExpanded.value = false;
          if (videoPlayerRef && videoPlayerRef.value) {
            videoPlayerRef.value.pauseVideo();
          }
        }
      },
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

  // Трансформация круга в прямоугольник (используем пропорции видео 1662:1080 ≈ 1.539)
  tl2.to(
    ".line-element",
    {
      width: "min(1200px, 85vw)",
      height: "min(780px, 55.26vw)", // 85vw / 1.539 ≈ 55.26vw
      borderRadius: "30px",
      duration: 0.5,
    },
    "<50%"
  );

  // Анимация кнопки Open Story
  tl2.set(".open-story-button", {
    opacity: 1,
    width: "300px",
    height: "0px",
    borderRadius: "30px",
    y: "calc(min(390px, 27.63vw) + 100px)", // Half of video height + gap
  });
  tl2.to(".open-story-button", { height: "60px", duration: 0.25 });

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
