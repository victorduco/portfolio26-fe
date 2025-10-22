import { ref, onMounted, onBeforeUnmount } from "vue";

/**
 * Reactive media query composable
 * SSR-safe implementation with cleanup
 *
 * @param {string} query - CSS media query string
 * @returns {Ref<boolean>} - Reactive boolean indicating if media query matches
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 767px)')
 */
export function useMediaQuery(query) {
  const matches = ref(false);
  let mediaQuery = null;
  let handler = null;

  // Setup and cleanup in onMounted
  onMounted(() => {
    if (typeof window === "undefined") return;

    mediaQuery = window.matchMedia(query);

    // Set initial value
    matches.value = mediaQuery.matches;

    // Update on change
    handler = (event) => {
      matches.value = event.matches;
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
    }
  });

  // Cleanup before unmount
  onBeforeUnmount(() => {
    if (mediaQuery && handler) {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handler);
      } else {
        mediaQuery.removeListener(handler);
      }
      mediaQuery = null;
      handler = null;
    }
  });

  return matches;
}

/**
 * Media query constants for consistent breakpoints
 */
export const NAVIGATION_MOBILE = "(max-width: 899px)";

/**
 * Two smallest breakpoints (xs + sm): 360px to 600px
 * For intro rectangles fullscreen behavior
 */
export const INTRO_MOBILE_FULLSCREEN = "(max-width: 600px)";

/**
 * Detects mobile devices (screens < 768px)
 * Based on standard tablet/mobile breakpoint
 *
 * @returns {Ref<boolean>} - true if mobile device
 */
export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}

/**
 * Detects devices with hover capability
 * Useful for disabling hover effects on touch devices
 *
 * @returns {Ref<boolean>} - true if device supports hover
 */
export function useHasHover() {
  return useMediaQuery("(hover: hover)");
}

/**
 * Detects touch devices
 *
 * @returns {Ref<boolean>} - true if touch device
 */
export function useIsTouchDevice() {
  return useMediaQuery("(pointer: coarse)");
}

/**
 * Detects landscape orientation
 *
 * @returns {Ref<boolean>} - true if landscape orientation
 */
export function useIsLandscape() {
  return useMediaQuery("(orientation: landscape)");
}

/**
 * Detects mobile devices in landscape orientation
 * Used for performance optimization - disables heavy effects on small landscape screens
 *
 * @returns {Ref<boolean>} - true if landscape orientation with height < 700px
 */
export function useIsLandscapeMobile() {
  return useMediaQuery("(orientation: landscape) and (max-height: 700px)");
}
