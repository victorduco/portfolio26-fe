/**
 * Media Path Resolver
 *
 * Resolves media paths using a manifest file that maps original filenames to content-hashed versions.
 * In production, can optionally use CDN URLs.
 *
 * Dev mode behavior:
 * - If file is in manifest: returns hashed version (/images/file.abc123.png)
 * - If file NOT in manifest: returns original name (/images/file.png)
 * - This allows working with new files before running the hash script
 *
 * Usage:
 *   import { getImagePath, getVideoPath } from '@/utils/mediaResolver'
 *
 *   const src = getImagePath('story1-domain-tree.png')
 *   // Dev:  /images/story1-domain-tree.abc12345.png (if in manifest) OR /images/story1-domain-tree.png (if not)
 *   // Prod: https://cdn.example.com/images/story1-domain-tree.abc12345.png (if CDN configured)
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
 * @param {string} filename - Original filename (e.g., 'story1-domain-tree.png')
 * @returns {string} Resolved path (CDN URL in prod, local path in dev)
 */
export function getImagePath(filename) {
  // Handle full paths (e.g., '/images/story1.png')
  if (filename.startsWith("/images/")) {
    filename = filename.replace("/images/", "");
  }

  // In dev mode, try hashed name first, fallback to original if not in manifest
  // This allows working with new files before they're hashed
  if (import.meta.env.DEV) {
    const hashedName = manifest?.images?.[filename];
    return hashedName ? `/images/${hashedName}` : `/images/${filename}`;
  }

  // In prod, always use manifest (or original as fallback)
  const hashedName = manifest?.images?.[filename] || filename;

  if (USE_CDN) {
    return `${CDN_BASE_URL}/images/${hashedName}`;
  }

  return `/images/${hashedName}`;
}

/**
 * Get the resolved path for a video
 * @param {string} filename - Original filename (e.g., 'story1-summary.mp4')
 * @returns {string} Resolved path (CDN URL in prod, local path in dev)
 */
export function getVideoPath(filename) {
  // Handle full paths (e.g., '/videos/story1.mp4')
  if (filename.startsWith("/videos/")) {
    filename = filename.replace("/videos/", "");
  }

  // In dev mode, try hashed name first, fallback to original if not in manifest
  // This allows working with new files before they're hashed
  if (import.meta.env.DEV) {
    const hashedName = manifest?.videos?.[filename];
    return hashedName ? `/videos/${hashedName}` : `/videos/${filename}`;
  }

  // In prod, always use manifest (or original as fallback)
  const hashedName = manifest?.videos?.[filename] || filename;

  if (USE_CDN) {
    return `${CDN_BASE_URL}/videos/${hashedName}`;
  }

  return `/videos/${hashedName}`;
}

/**
 * Get the resolved path for a font
 * @param {string} filename - Original filename (e.g., 'noto-sans-latin.woff2')
 * @returns {string} Resolved path (CDN URL in prod, local path in dev)
 */
export function getFontPath(filename) {
  // Handle full paths (e.g., '/fonts/noto-sans.woff2')
  if (filename.startsWith("/fonts/")) {
    filename = filename.replace("/fonts/", "");
  }

  // In dev mode, use local path
  if (import.meta.env.DEV) {
    return `/fonts/${filename}`;
  }

  // In prod, get hashed filename from manifest (fonts don't need hashing, but support it)
  const hashedName = manifest?.fonts?.[filename] || filename;

  if (USE_CDN) {
    return `${CDN_BASE_URL}/fonts/${hashedName}`;
  }

  return `/fonts/${hashedName}`;
}

/**
 * Get the resolved path for a document (PDF, etc.)
 * @param {string} filename - Original filename (e.g., 'victor_diukov_resume.pdf')
 * @returns {string} Resolved path (CDN URL in prod, local path in dev)
 */
export function getDocumentPath(filename) {
  // Handle full paths (e.g., '/documents/resume.pdf')
  if (filename.startsWith("/documents/")) {
    filename = filename.replace("/documents/", "");
  }

  // In dev mode, try hashed name first, fallback to original if not in manifest
  if (import.meta.env.DEV) {
    const hashedName = manifest?.documents?.[filename];
    return hashedName ? `/documents/${hashedName}` : `/documents/${filename}`;
  }

  // In prod, always use manifest (or original as fallback)
  const hashedName = manifest?.documents?.[filename] || filename;

  if (USE_CDN) {
    return `${CDN_BASE_URL}/documents/${hashedName}`;
  }

  return `/documents/${hashedName}`;
}

/**
 * Get CDN base URL for fonts (for CSS usage)
 * @returns {string} Base URL for fonts
 */
export function getFontBaseUrl() {
  if (USE_CDN) {
    return `${CDN_BASE_URL}/fonts`;
  }
  return '/fonts';
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
 * Force reload the manifest (useful in dev when manifest changes)
 * @returns {Promise<void>}
 */
export async function reloadManifest() {
  manifest = null;
  manifestLoading = null;
  await loadManifest();
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
    documents: Object.keys(manifest.documents || {}).length,
    useCDN: USE_CDN,
    cdnUrl: CDN_BASE_URL || "not configured",
  };
}

// Export for debugging in dev tools
if (typeof window !== "undefined") {
  window.__mediaResolver = {
    getImagePath,
    getVideoPath,
    getDocumentPath,
    resolveMediaPath,
    getManifestStats,
    isManifestLoaded,
    reloadManifest,
  };
}
