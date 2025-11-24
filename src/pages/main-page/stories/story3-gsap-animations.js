import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const dispatch = (id) => () =>
  window.dispatchEvent(new CustomEvent("story-section-active", { detail: { sectionId: id } }));

export function initAnimations(pinContainer, refs, skipAnimation = false) {
  const { tagsElement, titleElement, descriptionElement, buttonElement, imageContainer, videoElement, cloudCorners } = refs;

  if (skipAnimation) {
    [imageContainer, tagsElement, titleElement, descriptionElement, buttonElement]
      .forEach((el) => gsap.set(el, { opacity: 1, scale: 1, clearProps: "transform" }));
    if (cloudCorners?.$el) gsap.set(cloudCorners.$el, { opacity: 1, clearProps: "all" });
  }

  const section1 = pinContainer.querySelector(".section-1");

  ScrollTrigger.create({
    trigger: section1,
    start: "top top",
    end: "bottom bottom",
    pin: ".content",
    id: "MAIN-PIN-STORY3",
    invalidateOnRefresh: true,
    onEnter: dispatch("story3"),
    onEnterBack: dispatch("story3"),
    onLeave: dispatch("ai-play"),
    onLeaveBack: dispatch("story2"),
  });

  const tl1 = gsap.timeline({
    defaults: { ease: "power2.out" },
    scrollTrigger: {
      trigger: section1,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      id: "TL1-STORY3",
      invalidateOnRefresh: true,
    },
  });

  // Sequence: image scale → title + shadow → cloud corners → description → tags → button
  tl1.to(imageContainer, { scale: 1, duration: 4, ease: "none" }, 0);

  tl1.fromTo(titleElement, { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 3 }, 1);

  const titleShadow = titleElement.querySelector(".story3-title-shadow");
  if (titleShadow) {
    tl1.fromTo(titleShadow, { top: 0, left: 0 }, { top: "4px", left: "5px", duration: 3 }, 1);
  }

  if (cloudCorners) {
    const { topLeftCloud, topRightCloud, bottomLeftCloud, bottomRightCloud } = cloudCorners;
    const clouds = [
      [topLeftCloud.value, -50, -50],
      [topRightCloud.value, 50, -50],
      [bottomLeftCloud.value, -50, 50],
      [bottomRightCloud.value, 50, 50],
    ];
    clouds.forEach(([el, x, y], i) => {
      if (!el) return;
      gsap.set(el, { opacity: 0, x, y });
      tl1.to(el, { opacity: 1, x: 0, y: 0, duration: 2 }, i ? "<" : 1);
    });
  }

  [
    [descriptionElement, 1.2, 1, ">-0.2"],
    [tagsElement, 1.1, 0.8, ">-0.1"],
    [buttonElement, 1.1, 0.6, ">-0.1"],
  ].forEach(([el, scale, dur, pos]) =>
    tl1.fromTo(el, { opacity: 0, scale }, { opacity: 1, scale: 1, duration: dur }, pos)
  );

  tl1.to({}, { duration: 2 });

  let videoTrigger = null;
  if (videoElement) {
    videoElement.load();
    const setVideoTime = gsap.quickSetter(videoElement, "currentTime");

    videoTrigger = ScrollTrigger.create({
      trigger: section1,
      start: "top center",
      end: "bottom bottom",
      scrub: 2,
      id: "VIDEO-CASE3",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (videoElement.readyState >= 2) {
          setVideoTime(self.progress * videoElement.duration);
        }
      },
    });
  }

  setTimeout(() => ScrollTrigger.refresh(), 0);

  return {
    mainPin: ScrollTrigger.getById("MAIN-PIN-STORY3"),
    timeline1: tl1,
    videoTrigger,
  };
}
