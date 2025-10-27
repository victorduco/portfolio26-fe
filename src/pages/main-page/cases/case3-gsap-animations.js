// case3-gsap-animations.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function initAnimations(pinContainer, refs) {
  const {
    titleElement,
    companyElement,
    buttonElement,
    imageContainer,
    videoElement,
    cloudCorners,
  } = refs;

  // Find sections inside pinContainer
  const section1 = pinContainer.querySelector(".section-1");
  const section2 = pinContainer.querySelector(".section-2");

  // Main pin: пинит .content на всё время прохождения секции
  ScrollTrigger.create({
    trigger: section1,
    start: "top top",
    endTrigger: section2,
    end: "bottom bottom",
    pin: ".content",
    id: "MAIN-PIN-CASE3",
    invalidateOnRefresh: true,
  });

  // SCRUB timeline: анимация появления элементов
  const tl1 = gsap.timeline({
    defaults: { ease: "power2.out", force3D: true },
    scrollTrigger: {
      trigger: section1,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      snap: {
        snapTo: [0, 1],
        duration: { min: 0.3, max: 1 },
        delay: 0.15,
        ease: "power1.inOut",
        inertia: false,
        directional: true,
      },
      id: "TL1-CASE3",
      invalidateOnRefresh: true,
    },
  });

  // Stage 1: Image/video wrapper slides from bottom to layout position (slow parallax)
  tl1.to(
    imageContainer,
    {
      y: 0,
      duration: 4.0,
      ease: "none",
    },
    0
  );

  // Stage 3: Title fades in and slides down (after clouds finish)
  tl1.fromTo(
    titleElement,
    {
      opacity: 0,
      y: 100,
    },
    {
      opacity: 1,
      y: 0,
      duration: 3,
    },
    "<50%"
  );

  // Stage 2: Clouds appear from sides (after parallax starts)
  if (cloudCorners) {
    const { topLeftCloud, topRightCloud, bottomLeftCloud, bottomRightCloud } =
      cloudCorners;

    // Top left cloud - slides from left
    if (topLeftCloud) {
      gsap.set(topLeftCloud, { opacity: 0, x: -50, y: -50 });
      tl1.to(
        topLeftCloud,
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 2,
        },
        "<75%"
      );
    }

    // Top right cloud - slides from right (same time as top left)
    if (topRightCloud) {
      gsap.set(topRightCloud, { opacity: 0, x: 50, y: -50 });
      tl1.to(
        topRightCloud,
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 2,
        },
        "<"
      );
    }

    // Bottom left cloud - slides from left (same time)
    if (bottomLeftCloud) {
      gsap.set(bottomLeftCloud, { opacity: 0, x: -50, y: 50 });
      tl1.to(
        bottomLeftCloud,
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 2,
        },
        "<"
      );
    }

    // Bottom right cloud - slides from right (same time)
    if (bottomRightCloud) {
      gsap.set(bottomRightCloud, { opacity: 0, x: 50, y: 50 });
      tl1.to(
        bottomRightCloud,
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 2,
        },
        "<"
      );
    }
  }

  // Stage 4: Company/subtitle fades in (shortly after title starts)
  tl1.to(
    companyElement,
    {
      opacity: 1,
      duration: 4,
    },
    ">-0.2"
  );

  // Stage 5: Button fades in (shortly after company starts)
  tl1.to(
    buttonElement,
    {
      opacity: 1,
      duration: 4,
    },
    ">-0.2"
  );

  // Video playback control scrubbed to scroll (independent timeline)
  let videoTrigger = null;
  if (videoElement) {
    // Load video metadata to get duration
    videoElement.load();

    // Use scrub to tie video progress to scroll progress
    videoTrigger = ScrollTrigger.create({
      trigger: section1,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      id: "VIDEO-CASE3",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (videoElement.readyState >= 2) {
          // HAVE_CURRENT_DATA
          // Map scroll progress (0-1) to video time (3-8 seconds)
          const videoDuration = 5; // 8 - 3 = 5 seconds of playback
          const startTime = 3;
          const targetTime = startTime + self.progress * videoDuration;

          // Set video current time based on scroll progress
          videoElement.currentTime = targetTime;
        }
      },
    });
  }

  // Refresh после загрузки
  setTimeout(() => ScrollTrigger.refresh(), 0);

  // Возвращаем все ScrollTrigger'ы для cleanup
  const mainPinST = ScrollTrigger.getById("MAIN-PIN-CASE3");

  return {
    mainPin: mainPinST,
    timeline1: tl1,
    videoTrigger: videoTrigger,
  };
}
