import { ref } from "vue";
import Lenis from "lenis";
import Snap from "lenis/snap";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Global instances
let lenisInstance = null;
let snapInstance = null;

/**
 * Vue composable for Lenis smooth scroll with snap functionality
 * Integrates with GSAP ScrollTrigger for animations
 */
export function useLenis() {
  const lenis = ref(null);
  const snap = ref(null);

  /**
   * Initialize Lenis with GSAP integration and snap functionality
   * @param {Object} options - Lenis configuration options
   * @param {Object} snapOptions - Snap configuration options
   */
  function setupLenis(options = {}, snapOptions = {}) {
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

    // Setup snap functionality for fullscreen sections
    const defaultSnapOptions = {
      type: "mandatory", // fullscreen behavior - always snap
      debounce: 100, // delay before snapping (ms)
      ...snapOptions,
    };

    snapInstance = new Snap(lenisInstance, defaultSnapOptions);
    snap.value = snapInstance;

    return lenisInstance;
  }

  /**
   * Register snap points for sections with .item class
   * Call this after sections are mounted in the DOM
   */
  function registerSnapPoints() {
    if (!snapInstance) {
      console.warn("Snap instance not initialized. Call setupLenis first.");
      return;
    }

    const sections = document.querySelectorAll(".item");
    if (sections.length > 0) {
      // Convert NodeList to Array for Lenis Snap
      snapInstance.addElements(Array.from(sections), {
        align: "start", // snap to start of section
      });
      console.log(`✅ Registered ${sections.length} snap points`);
    } else {
      console.warn("No .item sections found for snap registration");
    }
  }

  /**
   * Start Lenis and snap functionality
   */
  function start() {
    lenisInstance?.start();
    snapInstance?.start();
  }

  /**
   * Stop Lenis and snap functionality
   */
  function stop() {
    lenisInstance?.stop();
    snapInstance?.stop();
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
   * Refresh snap points (useful after DOM changes)
   */
  function refreshSnap() {
    if (snapInstance) {
      snapInstance.resize();
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

      // Destroy instances
      snapInstance?.stop();
      lenisInstance.destroy();

      lenisInstance = null;
      snapInstance = null;
      lenis.value = null;
      snap.value = null;
    }
  }

  return {
    lenis,
    snap,
    setupLenis,
    registerSnapPoints,
    start,
    stop,
    scrollTo,
    refreshSnap,
    destroy,
  };
}

/**
 * Get current Lenis instance (for use outside of composable)
 */
export function getLenisInstance() {
  return lenisInstance;
}

/**
 * Get current Snap instance (for use outside of composable)
 */
export function getSnapInstance() {
  return snapInstance;
}
