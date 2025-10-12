import { ref, onMounted, onUnmounted } from "vue";

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

  onMounted(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);

    // Set initial value
    matches.value = mediaQuery.matches;

    // Update on change
    const handler = (event) => {
      matches.value = event.matches;
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
    }

    // Cleanup
    onUnmounted(() => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    });
  });

  return matches;
}

/**
 * Media query constants for consistent breakpoints
 */
export const NAVIGATION_MOBILE = "(max-width: 899px)";

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
