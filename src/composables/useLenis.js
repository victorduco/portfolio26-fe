import { ref } from "vue";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Global instances
let lenisInstance = null;

/**
 * Vue composable for Lenis smooth scroll
 * Integrates with GSAP ScrollTrigger for animations
 */
export function useLenis() {
  const lenis = ref(null);

  /**
   * Initialize Lenis with GSAP integration
   * @param {Object} options - Lenis configuration options
   */
  function setupLenis(options = {}) {
    // Configure GSAP
    gsap.config({
      nullTargetWarn: false,
      force3D: true,
    });

    // Default Lenis options for smooth scroll
    const defaultOptions = {
      lerp: 0.1, // smoothness (0-1)
      duration: 1.2, // scroll duration
      smoothWheel: true,
      syncTouch: false, // disable on touch devices for better performance
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      autoResize: true,
      ...options,
    };

    // Create Lenis instance
    lenisInstance = new Lenis(defaultOptions);
    lenis.value = lenisInstance;

    // Integrate Lenis with GSAP ScrollTrigger
    lenisInstance.on("scroll", ScrollTrigger.update);

    // Use GSAP ticker for smooth integration
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    // Disable GSAP's default lag smoothing
    gsap.ticker.lagSmoothing(0);

    return lenisInstance;
  }

  /**
   * Start Lenis
   */
  function start() {
    lenisInstance?.start();
  }

  /**
   * Stop Lenis
   */
  function stop() {
    lenisInstance?.stop();
  }

  /**
   * Scroll to a target element or position
   * @param {string|number|HTMLElement} target - Target to scroll to
   * @param {Object} options - Scroll options
   */
  function scrollTo(target, options = {}) {
    if (lenisInstance) {
      lenisInstance.scrollTo(target, {
        offset: 0,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        ...options,
      });
    }
  }

  /**
   * Destroy Lenis and cleanup
   */
  function destroy() {
    if (lenisInstance) {
      // Remove GSAP ticker
      gsap.ticker.remove((time) => {
        lenisInstance.raf(time * 1000);
      });

      // Destroy instance
      lenisInstance.destroy();

      lenisInstance = null;
      lenis.value = null;
    }
  }

  return {
    lenis,
    setupLenis,
    start,
    stop,
    scrollTo,
    destroy,
  };
}

/**
 * Get current Lenis instance (for use outside of composable)
 */
export function getLenisInstance() {
  return lenisInstance;
}
