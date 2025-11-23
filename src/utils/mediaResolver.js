/**
 * Media Path Resolver
 *
 * Resolves media paths to CDN URLs in production or local paths in development.
 * Uses a manifest file to map original filenames to content-hashed versions.
 *
 * Usage:
 *   import { getImagePath, getVideoPath } from '@/utils/mediaResolver'
 *
 *   const src = getImagePath('case1-domain-tree.png')
 *   // Dev:  /images/case1-domain-tree.abc12345.png
 *   // Prod: https://cdn.example.com/images/case1-domain-tree.abc12345.png
 */

// CDN configuration
const CDN_BASE_URL = import.meta.env.VITE_CDN_MEDIA_URL;
const USE_CDN = CDN_BASE_URL && import.meta.env.PROD;

// Manifest cache
let manifest = null;
let manifestLoading = null;

/**
 * Load the media manifest
 */
async function loadManifest() {
  if (manifest) return manifest;

  if (manifestLoading) return manifestLoading;

  manifestLoading = (async () => {
    try {
      const response = await fetch("/media-manifest.json");
      if (!response.ok) {
        console.warn("Media manifest not found, using direct paths");
        return null;
      }
      manifest = await response.json();
      return manifest;
    } catch (error) {
      console.warn("Failed to load media manifest:", error);
      return null;
    }
  })();

  return manifestLoading;
}

/**
 * Get the resolved path for an image
 * @param {string} filename - Original filename (e.g., 'case1-domain-tree.png')
 * @returns {string} Resolved path (CDN URL in prod, local path in dev)
 */
export function getImagePath(filename) {
  // Handle full paths (e.g., '/images/case1.png')
  if (filename.startsWith("/images/")) {
    filename = filename.replace("/images/", "");
  }

  // In dev mode, use original filename directly (no manifest needed)
  if (import.meta.env.DEV) {
    return `/images/${filename}`;
  }

  // In prod, get hashed filename from manifest
  const hashedName = manifest?.images?.[filename] || filename;

  if (USE_CDN) {
    return `${CDN_BASE_URL}/images/${hashedName}`;
  }

  return `/images/${hashedName}`;
}

/**
 * Get the resolved path for a video
 * @param {string} filename - Original filename (e.g., 'case1-summary.mp4')
 * @returns {string} Resolved path (CDN URL in prod, local path in dev)
 */
export function getVideoPath(filename) {
  // Handle full paths (e.g., '/videos/case1.mp4')
  if (filename.startsWith("/videos/")) {
    filename = filename.replace("/videos/", "");
  }

  // In dev mode, use original filename directly (no manifest needed)
  if (import.meta.env.DEV) {
    return `/videos/${filename}`;
  }

  // In prod, get hashed filename from manifest
  const hashedName = manifest?.videos?.[filename] || filename;

  if (USE_CDN) {
    return `${CDN_BASE_URL}/videos/${hashedName}`;
  }

  return `/videos/${hashedName}`;
}

/**
 * Resolve any media path (auto-detects type)
 * @param {string} path - Path like '/images/foo.png' or '/videos/bar.mp4'
 * @returns {string} Resolved path
 */
export function resolveMediaPath(path) {
  if (path.startsWith("/images/")) {
    return getImagePath(path);
  }
  if (path.startsWith("/videos/")) {
    return getVideoPath(path);
  }
  // Return unchanged if not a recognized media path
  return path;
}

/**
 * Initialize the media resolver (call on app startup)
 * @returns {Promise<void>}
 */
export async function initMediaResolver() {
  await loadManifest();
}

/**
 * Check if manifest is loaded
 * @returns {boolean}
 */
export function isManifestLoaded() {
  return manifest !== null;
}

/**
 * Get manifest stats (for debugging)
 */
export function getManifestStats() {
  if (!manifest) {
    return { loaded: false };
  }

  return {
    loaded: true,
    generated: manifest.generated,
    images: Object.keys(manifest.images || {}).length,
    videos: Object.keys(manifest.videos || {}).length,
    useCDN: USE_CDN,
    cdnUrl: CDN_BASE_URL || "not configured",
  };
}

// Export for debugging in dev tools
if (typeof window !== "undefined") {
  window.__mediaResolver = {
    getImagePath,
    getVideoPath,
    resolveMediaPath,
    getManifestStats,
    isManifestLoaded,
  };
}
