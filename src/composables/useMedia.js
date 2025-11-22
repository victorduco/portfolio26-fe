/**
 * Vue composable for media path resolution
 *
 * Provides reactive media path resolution with CDN support.
 * Automatically initializes the media manifest on first use.
 *
 * Usage:
 *   const { image, video } = useMedia()
 *
 *   // In template:
 *   <img :src="image('case1-domain-tree.png')" />
 *   <video :src="video('case1-summary.mp4')" />
 *
 *   // Or with full paths:
 *   <img :src="image('/images/case1-domain-tree.png')" />
 */

import { ref, onMounted } from "vue";
import {
  initMediaResolver,
  getImagePath,
  getVideoPath,
  resolveMediaPath,
  isManifestLoaded,
} from "@/utils/mediaResolver";

// Global initialization state
const isInitialized = ref(false);
const isInitializing = ref(false);

/**
 * Initialize media resolver (called once globally)
 */
async function ensureInitialized() {
  if (isInitialized.value || isInitializing.value) return;

  isInitializing.value = true;
  await initMediaResolver();
  isInitialized.value = true;
  isInitializing.value = false;
}

/**
 * Vue composable for media paths
 */
export function useMedia() {
  // Ensure initialization on first use
  onMounted(() => {
    ensureInitialized();
  });

  return {
    /**
     * Get resolved image path
     * @param {string} path - Image filename or full path
     */
    image: getImagePath,

    /**
     * Get resolved video path
     * @param {string} path - Video filename or full path
     */
    video: getVideoPath,

    /**
     * Resolve any media path (auto-detects type)
     * @param {string} path - Full path like '/images/foo.png'
     */
    resolve: resolveMediaPath,

    /**
     * Check if manifest is loaded
     */
    isReady: isManifestLoaded,
  };
}

/**
 * Initialize media resolver at app startup
 * Call this in main.js before mounting the app
 */
export async function setupMedia() {
  await ensureInitialized();
}

export default useMedia;
