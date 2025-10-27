// case1-gsap-animations.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function initAnimations(pinContainer, videoPlayerRef, videoExpanded) {
  // Find sections inside pinContainer
  const section1 = pinContainer.querySelector(".section-1");
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

  // Unified timeline: одна анимация для всего скролла
  const mainTimeline = gsap.timeline({
    defaults: { ease: "power1.inOut", force3D: true },
    scrollTrigger: {
      trigger: section1,
      start: "top top",
      endTrigger: section3,
      end: "bottom bottom",
      scrub: 1,
      id: "MAIN-TIMELINE",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Video control logic - запускаем видео когда анимация достигает фазы прямоугольника
        // Это примерно 85-90% всего timeline
        if (self.progress >= 0.85) {
          if (videoExpanded && !videoExpanded.value) {
            videoExpanded.value = true;
            if (videoPlayerRef && videoPlayerRef.value) {
              videoPlayerRef.value.attemptPlay();
            }
          }
        } else {
          if (videoExpanded && videoExpanded.value) {
            videoExpanded.value = false;
            if (videoPlayerRef && videoPlayerRef.value) {
              videoPlayerRef.value.pauseVideo();
            }
          }
        }
      },
      onLeave: () => {
        if (videoExpanded && videoExpanded.value) {
          videoExpanded.value = false;
          if (videoPlayerRef && videoPlayerRef.value) {
            videoPlayerRef.value.pauseVideo();
          }
        }
      },
    },
  });

  // ФАЗА 1: Рост линии (примерно 20% всего timeline)
  // Анимация роста линии: сначала уменьшение по высоте, потом расширение
  mainTimeline.fromTo(
    ".line-element",
    {
      width: "40px",
      height: "40px",
      borderRadius: "20px",
      border: "20px solid #007aff",
      backgroundColor: "#007aff",
      opacity: 1,
    },
    {
      height: "4px",
      width: "5vw",
      border: "4px solid #007aff",
      borderRadius: "20px",
      duration: 3,
      backgroundColor: "transparent",
    }
  );

  // Затем продолжает расширяться до 60vw
  mainTimeline.to(".line-element", {
    width: "60vw",
    height: "6px",
    borderRadius: "20px",
    duration: 7,
  });

  // ФАЗА 2: Движение элементов (примерно 10% timeline)
  mainTimeline.to(
    ".line-element",
    {
      y: "150px",
      borderRadius: "30px",
      duration: 5,
    },
    "<75%"
  );
  mainTimeline.to(".text-container", { y: "-100px", duration: 5 }, "<");
  mainTimeline.to(".mask-element", { y: "150px", duration: 5 }, "<");

  // ФАЗА 3: Трансформация в шарик (примерно 30% timeline)
  mainTimeline.to(
    ".line-element",
    {
      width: "25px",
      height: "25px",
      border: "15px solid #2563eb",
      borderRadius: "30px",
      backgroundColor: "#ffffff",
      duration: 15,
    },
    "+=5"
  );

  // ФАЗА 4: Подъем шарика вверх (примерно 20% timeline)
  mainTimeline.to(
    ".line-element",
    {
      y: "0px",
      duration: 10,
    },
    "<50%"
  );

  // ФАЗА 5: Трансформация в прямоугольник с видео (примерно 20% timeline)
  mainTimeline.to(
    ".line-element",
    {
      width: "min(1200px, 85vw)",
      height: "min(780px, 55.26vw)", // 85vw / 1.539 ≈ 55.26vw
      borderRadius: "30px",
      duration: 5,
    },
    ">"
  );

  // Уменьшаем границу одновременно с расширением
  mainTimeline.to(
    ".line-element",
    {
      border: "6px solid #DDDDDD",
      duration: 2,
    },
    "<"
  );

  // Анимация появления видео контента (opacity 0 -> 1)
  mainTimeline.fromTo(
    ".case1-video-player",
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 25,
    },
    "<"
  );

  // ФАЗА 6: Появление кнопки Open Story
  mainTimeline.set(".open-story-button", {
    opacity: 1,
    width: "300px",
    height: "0px",
    borderRadius: "30px",
    top: "calc(50% + min(390px, 27.63vw) + 50px)",
  });
  mainTimeline.to(".open-story-button", { height: "60px", duration: 2.5 });

  // Refresh после загрузки
  setTimeout(() => ScrollTrigger.refresh(), 0);

  // Возвращаем все ScrollTrigger'ы для cleanup
  const mainPinST = ScrollTrigger.getById("MAIN-PIN");

  return {
    mainPin: mainPinST,
    timeline: mainTimeline,
  };
}
