// case3-gsap-animations.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function initAnimations(pinContainer, refs, skipAnimation = false) {
  const {
    tagsElement,
    titleElement,
    descriptionElement,
    buttonElement,
    imageContainer,
    videoElement,
    cloudCorners,
  } = refs;

  // If returning from story page, set all elements to final state immediately
  if (skipAnimation) {
    gsap.set(imageContainer, { scale: 1, clearProps: "all" });
    gsap.set(tagsElement, { opacity: 1, scale: 1, clearProps: "transform" });
    gsap.set(titleElement, { opacity: 1, scale: 1, x: 0, y: 0, clearProps: "transform" });
    gsap.set(descriptionElement, { opacity: 1, scale: 1, clearProps: "transform" });
    gsap.set(buttonElement, { opacity: 1, scale: 1, clearProps: "transform" });
    if (cloudCorners?.$el) {
      gsap.set(cloudCorners.$el, { opacity: 1, clearProps: "all" });
    }
  }

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
    defaults: { ease: "power2.out" },
    scrollTrigger: {
      trigger: section1,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      // snap: {
      //   snapTo: [0, 1],
      //   duration: { min: 0.3, max: 1 },
      //   delay: 0.15,
      //   ease: "power1.inOut",
      //   inertia: false,
      //   directional: true,
      // },
      id: "TL1-CASE3",
      invalidateOnRefresh: true,
    },
  });

  // Stage 1: Image/video wrapper scales from 1.5 to 1
  tl1.to(
    imageContainer,
    {
      scale: 1,
      duration: 4.0,
      ease: "none",
    },
    0
  );

  // Stage 3: Title shrinks in (starts after 25% of scale animation)
  tl1.fromTo(
    titleElement,
    {
      opacity: 0,
      scale: 1.2,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 3,
    },
    1 // 25% of 4 = 1, ends at 4
  );

  // Animate title shadow from 0 to final position
  const titleShadow = titleElement.querySelector('.case3-title-shadow');
  if (titleShadow) {
    tl1.fromTo(
      titleShadow,
      {
        top: 0,
        left: 0,
      },
      {
        top: '4px',
        left: '5px',
        duration: 3,
      },
      1 // Same timing as title
    );
  }

  // Stage 2: Clouds appear from sides (after parallax starts)
  if (cloudCorners) {
    const { topLeftCloud, topRightCloud, bottomLeftCloud, bottomRightCloud } =
      cloudCorners;

    // Top left cloud - slides from left (starts after 25% of scale animation)
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
        1
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

  // Stage 4: Description shrinks in (shortly after title starts)
  tl1.fromTo(
    descriptionElement,
    {
      opacity: 0,
      scale: 1.2,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 1,
    },
    ">-0.2"
  );

  // Stage 5: Tags appear (after description)
  tl1.fromTo(
    tagsElement,
    {
      opacity: 0,
      scale: 1.1,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.8,
    },
    ">-0.1"
  );

  // Stage 6: Button shrinks in (after tags)
  tl1.fromTo(
    buttonElement,
    {
      opacity: 0,
      scale: 1.1,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.6,
    },
    ">-0.1"
  );

  // PAUSE: Add empty space at the end to keep the pin active while animations are done
  tl1.to({}, { duration: 2 });

  // Video playback control scrubbed to scroll (independent timeline)
  // Extended to continue beyond section1 into section2
  let videoTrigger = null;
  if (videoElement) {
    // Load video metadata to get duration
    videoElement.load();

    // Use quickSetter for smoother video scrubbing
    const setVideoTime = gsap.quickSetter(videoElement, "currentTime");

    // Use scrub to tie video progress to scroll progress
    // Extended to section2 so video continues after other animations finish
    // Video starts from 0 when section reaches center of viewport
    videoTrigger = ScrollTrigger.create({
      trigger: section1,
      start: "top center",
      endTrigger: section2,
      end: "bottom bottom",
      scrub: 2,
      id: "VIDEO-CASE3",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (videoElement.readyState >= 2) {
          // HAVE_CURRENT_DATA
          // Map scroll progress (0-1) to video duration minus last 2 seconds
          const effectiveDuration = Math.max(0, videoElement.duration - 1);
          const targetTime = self.progress * effectiveDuration;

          // Set video current time using quickSetter for smoother performance
          setVideoTime(targetTime);
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
