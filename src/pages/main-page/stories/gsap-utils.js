import { ScrollTrigger } from "gsap/ScrollTrigger";

const killTimelineWithTrigger = (tl) => {
  if (!tl) return;
  if (tl.scrollTrigger) tl.scrollTrigger.kill();
  tl.kill();
};

export function cleanupAnimations(animationInstance) {
  if (!animationInstance) return;

  if (animationInstance.mainPin) animationInstance.mainPin.kill();
  if (animationInstance.scrollTrigger) animationInstance.scrollTrigger.kill();
  if (animationInstance.videoTrigger) animationInstance.videoTrigger.kill();

  killTimelineWithTrigger(animationInstance.timeline);
  [1, 2].forEach(i => {
    killTimelineWithTrigger(animationInstance[`timeline${i}`]);
    if (animationInstance[`scrollTrigger${i}`]) animationInstance[`scrollTrigger${i}`].kill();
  });

  ScrollTrigger.getAll().forEach((st) => st.kill());
}
