import { ref } from "vue";
import Lenis from "lenis";
import Snap from "lenis/snap";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  snapConfig,
  getActiveNoSnapZones,
  getEnabledAnchors,
  getEnabledProgressSnaps,
  getEnabledMandatorySnaps,
  calculateZonePosition,
} from "./snapConfig.js";
import {
  setupScrollDirectionTracking,
  createDirectionalSnapCallback,
} from "./directionalSnap.js";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Global instances
let lenisInstance = null;
let snapInstance = null;
let casesSnapInstance = null; // Separate snap instance for cases with medium strictness
let mandatorySnapInstance = null; // Mandatory snap instance for specific elements

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

    // Setup scroll direction tracking for directional snapping
    const scrollState = setupScrollDirectionTracking(lenisInstance);

    // Disable snap in "no-snap zones" using configuration
    // This allows GSAP ScrollTrigger to work freely in defined zones
    lenisInstance.on("scroll", (e) => {
      const scrollY = e.scroll;
      const activeZones = getActiveNoSnapZones();

      let inNoSnapZone = false;

      // Check if scrolling inside any configured no-snap zone
      activeZones.forEach((zone) => {
        const element = document.getElementById(zone.elementId);
        if (element) {
          const elementTop = element.offsetTop;
          const elementHeight = element.offsetHeight;

          const zoneStart = elementTop + elementHeight * zone.startPercent;
          const zoneEnd = elementTop + elementHeight * zone.endPercent;

          if (scrollY >= zoneStart && scrollY <= zoneEnd) {
            inNoSnapZone = true;
          }
        }
      });

      // Dynamically enable/disable snap based on zone
      if (inNoSnapZone) {
        snapInstance?.stop();
        mandatorySnapInstance?.stop();
      } else {
        snapInstance?.start();
        mandatorySnapInstance?.start();
      }
    });

    // Use GSAP ticker for smooth integration
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    // Disable GSAP's default lag smoothing
    gsap.ticker.lagSmoothing(0);

    // Setup snap functionality using centralized configuration
    const defaultSnapOptions = {
      ...snapConfig.global,
      ...snapOptions,
    };

    // Add directional snap behavior if enabled (via config)
    // TODO: Lenis directional snap - temporarily disabled, using GSAP directional snap for case3
    // if (snapConfig.behavior?.directionalSnap) {
    //   defaultSnapOptions.onSnapStart = (snap) => {
    //     const currentPosition = lenisInstance.scroll;
    //     const scrollDirection = scrollState.direction;
    //     const targetPosition = snap?.value ?? snap;

    //     // If snapping backwards against scroll direction, prevent it
    //     const shouldBlock =
    //       (scrollDirection > 0 && targetPosition < currentPosition) ||
    //       (scrollDirection < 0 && targetPosition > currentPosition);

    //     if (shouldBlock) {
    //       console.log('🚫 Blocking snap - staying at current position:', {
    //         direction: scrollDirection > 0 ? 'down' : 'up',
    //         current: Math.round(currentPosition),
    //         target: Math.round(targetPosition)
    //       });

    //       // Stay at current position - cancel the snap
    //       lenisInstance.scrollTo(currentPosition, {
    //         immediate: true,
    //         force: true,
    //         lock: true
    //       });

    //       return snap;
    //     }

    //     console.log('✅ Allowing snap:', {
    //       direction: scrollDirection > 0 ? 'down' : 'up',
    //       from: Math.round(currentPosition),
    //       to: Math.round(targetPosition)
    //     });

    //     return snap;
    //   };
    // }

    // Create snap instance with config including callback
    snapInstance = new Snap(lenisInstance, defaultSnapOptions);
    snap.value = snapInstance;

    // Keep casesSnapInstance as alias to same instance (for backwards compatibility)
    casesSnapInstance = snapInstance;

    // Use same instance for mandatory snaps (type is already 'mandatory' in global config)
    mandatorySnapInstance = snapInstance;

    return lenisInstance;
  }

  /**
   * Register snap points based on centralized configuration
   * Call this after sections are mounted in the DOM
   *
   * Uses snapConfig.js for all anchor definitions
   */
  function registerSnapPoints() {
    if (!snapInstance) {
      console.warn("Snap instance not initialized. Call setupLenis first.");
      return;
    }

    const enabledAnchors = getEnabledAnchors();
    const mandatorySnaps = getEnabledMandatorySnaps();
    let registeredCount = 0;

    enabledAnchors.forEach((anchor) => {
      const element = document.getElementById(anchor.id);
      if (element) {
        // Check if this element has mandatory snaps defined in mandatorySnaps config
        const elementMandatorySnaps = mandatorySnaps.filter(snap => snap.elementId === anchor.id);
        const hasMandatorySnaps = elementMandatorySnaps.length > 0;

        if (hasMandatorySnaps) {
          // Skip - will be registered in registerMandatoryTriggerSnaps() with exact positions
        } else {
          // Regular snap using element alignment
          snapInstance.addElement(element, { align: anchor.align });
          registeredCount++;
        }
      }
    });
  }

  /**
   * Start Lenis and snap functionality
   */
  function start() {
    lenisInstance?.start();
    snapInstance?.start();
    casesSnapInstance?.start();
    mandatorySnapInstance?.start();
  }

  /**
   * Stop Lenis and snap functionality
   */
  function stop() {
    lenisInstance?.stop();
    snapInstance?.stop();
    casesSnapInstance?.stop();
    mandatorySnapInstance?.stop();
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
    if (casesSnapInstance) {
      casesSnapInstance.resize();
    }
    if (mandatorySnapInstance) {
      mandatorySnapInstance.resize();
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
      casesSnapInstance?.stop();
      mandatorySnapInstance?.stop();
      lenisInstance.destroy();

      lenisInstance = null;
      snapInstance = null;
      casesSnapInstance = null;
      mandatorySnapInstance = null;
      lenis.value = null;
      snap.value = null;
    }
  }

  /**
   * Register additional snap points based on GSAP ScrollTrigger progress
   * Call this AFTER GSAP animations are initialized
   *
   * This allows snapping to specific points in the animation timeline
   */
  function registerProgressSnaps() {
    if (!snapInstance) {
      console.warn("Snap instance not initialized.");
      return;
    }

    const progressSnaps = getEnabledProgressSnaps();
    let registeredCount = 0;

    progressSnaps.forEach((progressSnap) => {
      const trigger = ScrollTrigger.getById(progressSnap.scrollTriggerId);

      if (trigger) {
        // Calculate scroll position at the specified progress
        const scrollStart = trigger.start;
        const scrollEnd = trigger.end;
        const snapPosition = scrollStart + (scrollEnd - scrollStart) * progressSnap.progress;

        // Add fixed position snap point
        snapInstance.add(snapPosition);
        registeredCount++;
      }
    });
  }

  /**
   * Register mandatory snaps that depend on ScrollTriggers
   * Call this AFTER all GSAP animations are initialized
   */
  function registerMandatoryTriggerSnaps() {
    if (!snapInstance) {
      console.warn("Snap instance not initialized.");
      return;
    }

    const mandatorySnaps = getEnabledMandatorySnaps();

    // Register ALL mandatory snaps (element-based and trigger-based) as position points
    let registeredCount = 0;

    mandatorySnaps.forEach((snap) => {
      let snapPosition;

      if (snap.type === 'trigger-end' || snap.type === 'trigger-progress') {
        // Trigger-based snaps
        const trigger = ScrollTrigger.getById(snap.scrollTriggerId);
        if (trigger) {
          if (snap.type === 'trigger-end') {
            snapPosition = trigger.end;
          } else if (snap.type === 'trigger-progress') {
            const scrollStart = trigger.start;
            const scrollEnd = trigger.end;
            snapPosition = scrollStart + (scrollEnd - scrollStart) * snap.progress;
          }

          snapInstance.add(snapPosition);
          registeredCount++;
        }
      } else if (snap.elementId && snap.position) {
        // Element-based snaps - calculate position
        const element = document.getElementById(snap.elementId);
        if (element) {
          const elementTop = element.offsetTop;

          if (snap.position === 'start') {
            snapPosition = elementTop;
          } else if (snap.position === 'end') {
            snapPosition = elementTop + element.offsetHeight - window.innerHeight;
          }

          snapInstance.add(snapPosition);
          registeredCount++;
        }
      }
    });
  }

  return {
    lenis,
    snap,
    setupLenis,
    registerSnapPoints,
    registerProgressSnaps,
    registerMandatoryTriggerSnaps,
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
