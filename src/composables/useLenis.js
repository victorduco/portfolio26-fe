import { ref } from "vue";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;
let rafCallback = null;

export function useLenis() {
  const lenis = ref(null);

  /** Setup Lenis smooth scroll with GSAP ticker. Options: lerp, duration, smoothWheel, etc */
  const setupLenis = (options = {}) => {
    gsap.config({ nullTargetWarn: false, force3D: true });

    lenisInstance = new Lenis({
      lerp: 0.1, duration: 1.2, smoothWheel: true, syncTouch: false,
      wheelMultiplier: 1, touchMultiplier: 2, infinite: false, autoResize: true,
      ...options,
    });
    lenis.value = lenisInstance;

    lenisInstance.on("scroll", ScrollTrigger.update);
    rafCallback = (time) => lenisInstance.raf(time * 1000);
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return lenisInstance;
  };

  /** Scroll to target. target: string|number|Element, options: { offset?, duration?, easing? } */
  const scrollTo = (target, options = {}) => {
    lenisInstance?.scrollTo(target, {
      offset: 0, duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      ...options,
    });
  };

  const destroy = () => {
    if (!lenisInstance) return;
    if (rafCallback) gsap.ticker.remove(rafCallback);
    lenisInstance.destroy();
    lenisInstance = null;
    lenis.value = null;
  };

  return {
    lenis, setupLenis, scrollTo, destroy,
    start: () => lenisInstance?.start(),
    stop: () => lenisInstance?.stop(),
  };
}

export const getLenisInstance = () => lenisInstance;
