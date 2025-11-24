import { ref, onMounted, onBeforeUnmount } from "vue";

/**
 * Reactive media query composable with SSR safety
 * @param {string} query - CSS media query string
 * @returns {Ref<boolean>}
 */
export function useMediaQuery(query) {
  const matches = ref(false);
  let mediaQuery = null;

  onMounted(() => {
    if (typeof window === "undefined") return;
    mediaQuery = window.matchMedia(query);
    matches.value = mediaQuery.matches;
    mediaQuery.addEventListener("change", (e) => matches.value = e.matches);
  });

  onBeforeUnmount(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener("change", () => {});
      mediaQuery = null;
    }
  });

  return matches;
}

export const NAVIGATION_MOBILE = "(max-width: 899px)";
export const INTRO_MOBILE_FULLSCREEN = "(max-width: 600px)";

export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}

export function useHasHover() {
  return useMediaQuery("(hover: hover)");
}

export function useIsTouchDevice() {
  return useMediaQuery("(pointer: coarse)");
}

export function useIsLandscape() {
  return useMediaQuery("(orientation: landscape)");
}

export function useIsLandscapeMobile() {
  return useMediaQuery("(orientation: landscape) and (max-height: 700px)");
}
