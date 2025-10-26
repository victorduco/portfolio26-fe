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

    snapInstance = new Snap(lenisInstance, defaultSnapOptions);
    snap.value = snapInstance;

    // Keep casesSnapInstance as alias to same instance (for backwards compatibility)
    casesSnapInstance = snapInstance;

    // Create mandatory snap instance for elements requiring mandatory behavior
    mandatorySnapInstance = new Snap(lenisInstance, {
      type: 'mandatory',
      distanceThreshold: '30%',
      debounce: 100,
    });

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
        // Check if this element has mandatory snaps
        const elementMandatorySnaps = mandatorySnaps.filter(snap => snap.elementId === anchor.id);
        const hasMandatorySnaps = elementMandatorySnaps.length > 0;

        if (hasMandatorySnaps) {
          // For mandatory snaps, register only element-based positions (not trigger-based)
          const positions = elementMandatorySnaps
            .filter(snap => !snap.type || (!snap.type.startsWith('trigger')))
            .map(snap => snap.position);

          if (positions.length > 0) {
            // Register with positions
            mandatorySnapInstance.addElement(element, {
              align: positions.length > 1 ? positions : positions[0]
            });
            registeredCount++;
            console.log(`✅ Mandatory Snap: ${anchor.id} (${positions.join(', ')})`);
          }
        } else {
          // Regular proximity snap
          snapInstance.addElement(element, { align: anchor.align });
          registeredCount++;
          console.log(`✅ Snap: ${anchor.id} (${Array.isArray(anchor.align) ? anchor.align.join(', ') : anchor.align})`);
        }
      } else {
        console.warn(`⚠️ Snap anchor not found: ${anchor.id}`);
      }
    });

    // Note: trigger-based mandatory snaps are registered separately
    // via registerMandatoryTriggerSnaps() after GSAP animations are ready

    // Log active no-snap zones
    const activeZones = getActiveNoSnapZones();
    if (activeZones.length > 0) {
      console.log(`🚫 No-snap zones: ${activeZones.map(z => z.name).join(', ')}`);
    }

    console.log(`🎯 Total snap points: ${registeredCount} | No-snap zones: ${activeZones.length}`);
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

        console.log(
          `✅ Progress snap: ${progressSnap.name} at ${Math.round(progressSnap.progress * 100)}% (${Math.round(snapPosition)}px)`
        );
      } else {
        console.warn(`⚠️ ScrollTrigger not found: ${progressSnap.scrollTriggerId}`);
      }
    });

    if (registeredCount > 0) {
      console.log(`🎯 Registered ${registeredCount} progress-based snap points`);
    }
  }

  /**
   * Register mandatory snaps that depend on ScrollTriggers
   * Call this AFTER all GSAP animations are initialized
   */
  function registerMandatoryTriggerSnaps() {
    if (!mandatorySnapInstance) {
      console.warn("Mandatory snap instance not initialized.");
      return;
    }

    const mandatorySnaps = getEnabledMandatorySnaps();
    const triggerBasedSnaps = mandatorySnaps.filter(snap =>
      snap.type === 'trigger-end' || snap.type === 'trigger-progress'
    );
    let registeredCount = 0;

    triggerBasedSnaps.forEach((snap) => {
      const trigger = ScrollTrigger.getById(snap.scrollTriggerId);
      if (trigger) {
        let snapPosition;

        if (snap.type === 'trigger-end') {
          // Add snap at the end of the ScrollTrigger
          snapPosition = trigger.end;
        } else if (snap.type === 'trigger-progress') {
          // Add snap at specific progress point
          const scrollStart = trigger.start;
          const scrollEnd = trigger.end;
          snapPosition = scrollStart + (scrollEnd - scrollStart) * snap.progress;
        }

        mandatorySnapInstance.add(snapPosition);
        registeredCount++;
        console.log(`✅ Mandatory Snap (${snap.type}): ${snap.name} at ${Math.round(snapPosition)}px`);
      } else {
        console.warn(`⚠️ ScrollTrigger not found for mandatory snap: ${snap.scrollTriggerId}`);
      }
    });

    if (registeredCount > 0) {
      console.log(`🎯 Registered ${registeredCount} trigger-based mandatory snaps`);
    }
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
