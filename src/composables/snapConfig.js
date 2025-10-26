/**
 * Snap Configuration
 * Centralized configuration for Lenis Snap behavior across the portfolio
 */

export const snapConfig = {
  // Global snap settings
  global: {
    type: "proximity", // 'mandatory', 'proximity', 'lock'
    distanceThreshold: "50%", // Snap zone distance
    debounce: 200, // Delay before snapping (ms)
  },

  // Anchor points - main sections to snap to
  anchors: [
    {
      id: "intro",
      align: "start", // 'start', 'center', 'end', or ['start', 'end']
      enabled: true,
    },
    {
      id: "case1",
      align: ["start", "end"], // Snap to both start and end
      enabled: true,
    },
    {
      id: "case2",
      align: ["start", "end"],
      enabled: true,
    },
    {
      id: "case3",
      align: ["start", "end"],
      enabled: true,
    },
    {
      id: "ai-play",
      align: "start",
      enabled: true,
    },
    {
      id: "contacts",
      align: "start",
      enabled: true,
    },
  ],

  // No-snap zones - areas where snap should be disabled
  noSnapZones: [
    {
      name: "Case1 middle animation",
      elementId: "case1",
      // Zone defined as percentage of element height (0-1)
      startPercent: 0.1, // Start at 10% of element
      endPercent: 0.9, // End at 90% of element
      enabled: true,
    },
    {
      name: "Case2 middle animation",
      elementId: "case2",
      startPercent: 0.1,
      endPercent: 0.9,
      enabled: true,
    },
    {
      name: "Case3 middle animation",
      elementId: "case3",
      startPercent: 0.1,
      endPercent: 0.9,
      enabled: true,
    },
  ],

  // Additional snap points based on GSAP ScrollTrigger progress
  progressSnaps: [
    {
      name: "Case1 - line fully expanded",
      elementId: "case1",
      // Reference to ScrollTrigger ID (defined in case1-gsap-animations.js)
      scrollTriggerId: "TL1",
      // Snap when timeline reaches this progress (0-1)
      progress: 0.5, // 50% of timeline
      enabled: false, // Disabled by default - enable if needed
    },
    {
      name: "Case1 - button appears",
      elementId: "case1",
      scrollTriggerId: "TL2",
      progress: 0.8, // 80% of timeline
      enabled: false,
    },
    {
      name: "Case2 - text fully visible",
      elementId: "case2",
      scrollTriggerId: "case2-main",
      progress: 0.6,
      enabled: false,
    },
    {
      name: "Case3 - video starts",
      elementId: "case3",
      scrollTriggerId: "case3-video-scrub",
      progress: 0.3,
      enabled: false,
    },
  ],

  // Snap points at specific scroll trigger positions
  triggerSnaps: [
    {
      name: "Case1 - Pin start",
      elementId: "case1",
      // Snap at specific ScrollTrigger marker
      triggerType: "start", // 'start', 'center', 'end'
      align: "top top", // ScrollTrigger start/end syntax
      enabled: false,
    },
    {
      name: "Case1 - Pin end",
      elementId: "case1",
      triggerType: "end",
      align: "bottom bottom",
      enabled: false,
    },
  ],

  // Dynamic zones that change based on viewport size
  responsiveZones: {
    mobile: {
      // Override settings for mobile (max-width: 768px)
      noSnapZones: [
        {
          elementId: "case1",
          startPercent: 0.05, // Smaller no-snap zone on mobile
          endPercent: 0.95,
        },
      ],
    },
    tablet: {
      // Override for tablet (768px - 1024px)
      noSnapZones: [],
    },
    desktop: {
      // Override for desktop (1024px+)
      noSnapZones: [],
    },
  },
};

/**
 * Helper function to get current breakpoint
 */
export function getCurrentBreakpoint() {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

/**
 * Helper function to calculate pixel position from element percentage
 */
export function calculateZonePosition(elementId, percent) {
  const element = document.getElementById(elementId);
  if (!element) return null;

  const elementTop = element.offsetTop;
  const elementHeight = element.offsetHeight;

  return elementTop + elementHeight * percent;
}

/**
 * Get active no-snap zones based on current breakpoint
 */
export function getActiveNoSnapZones() {
  const breakpoint = getCurrentBreakpoint();
  const responsiveOverrides = snapConfig.responsiveZones[breakpoint]?.noSnapZones || [];

  // Merge base zones with responsive overrides
  const zones = [...snapConfig.noSnapZones];

  // Apply responsive overrides
  responsiveOverrides.forEach((override) => {
    const zoneIndex = zones.findIndex((z) => z.elementId === override.elementId);
    if (zoneIndex !== -1) {
      zones[zoneIndex] = { ...zones[zoneIndex], ...override };
    }
  });

  return zones.filter((zone) => zone.enabled);
}

/**
 * Get enabled anchor points
 */
export function getEnabledAnchors() {
  return snapConfig.anchors.filter((anchor) => anchor.enabled);
}

/**
 * Get enabled progress snaps
 */
export function getEnabledProgressSnaps() {
  return snapConfig.progressSnaps.filter((snap) => snap.enabled);
}

/**
 * Get enabled trigger snaps
 */
export function getEnabledTriggerSnaps() {
  return snapConfig.triggerSnaps.filter((snap) => snap.enabled);
}
