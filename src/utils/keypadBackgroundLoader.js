/**
 * Keypad Background Loader
 *
 * Handles loading and caching of pregenerated keypad background images.
 * Provides optimized loading with memory cache and prefetching capabilities.
 */

// Memory cache for loaded images (data URLs)
const imageCache = new Map();

// Track failed loads to avoid retry loops
const failedLoads = new Set();

// Track in-flight requests to avoid duplicate fetches
const inflightRequests = new Map();

// Statistics for monitoring
const stats = {
  cacheHits: 0,
  cacheMisses: 0,
  networkLoads: 0,
  failures: 0,
};

/**
 * Convert digit array to 4-digit code string
 * @param {number[]} digits - Array of digits (e.g., [1, 2, 3, 4])
 * @returns {string} - Padded code string (e.g., "1234")
 */
function getCodeFromDigits(digits) {
  return digits.map(d => String(d)).join('').padStart(4, '0');
}

/**
 * Get the path to a background image
 * @param {number[]} digits - Array of digits
 * @returns {string} - Path to the image file
 */
export function getBackgroundPath(digits) {
  const code = getCodeFromDigits(digits);
  return `/keypad-backgrounds/${code}.png`;
}

/**
 * Convert image blob to data URL
 * @param {Blob} blob - Image blob
 * @returns {Promise<string>} - Data URL
 */
async function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Load a single background image
 * @param {number[]} digits - Array of digits
 * @param {Object} profile - Optional profiling object
 * @returns {Promise<string>} - Path to the image (browser will cache it)
 */
export async function loadBackground(digits, profile = null) {
  const code = getCodeFromDigits(digits);
  const path = getBackgroundPath(digits);

  // Check cache first - if we've preloaded it, return path immediately
  if (imageCache.has(code)) {
    stats.cacheHits++;
    if (profile) {
      profile.cacheHit = true;
    }
    return imageCache.get(code);
  }

  stats.cacheMisses++;

  // Check if load already failed
  if (failedLoads.has(code)) {
    throw new Error(`Previous load failed for ${code}`);
  }

  // Check if request is already in flight
  if (inflightRequests.has(code)) {
    return inflightRequests.get(code);
  }

  // Start timing if profiling
  if (profile) {
    profile.fetchStartTime = performance.now();
  }

  // Create the load promise
  const loadPromise = (async () => {
    try {
      // Preload the image to ensure it's loaded and ready
      const img = new Image();

      const imageLoaded = new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        // Set timeout
        setTimeout(() => reject(new Error('Image load timeout')), 10000);
      });

      img.src = path;
      await imageLoaded;

      if (profile) {
        profile.fetchCompleteTime = performance.now();
      }

      // Cache the path - image is now in browser's cache
      imageCache.set(code, path);
      stats.networkLoads++;

      return path;

    } catch (error) {
      stats.failures++;
      failedLoads.add(code);
      console.error(`Failed to load background ${code}:`, error.message);
      throw error;
    } finally {
      inflightRequests.delete(code);
    }
  })();

  // Store in-flight request
  inflightRequests.set(code, loadPromise);

  return loadPromise;
}

/**
 * Preload multiple backgrounds in the background
 * @param {number[][]} digitArrays - Array of digit arrays to preload
 */
export async function preloadBackgrounds(digitArrays) {
  const promises = digitArrays.map(digits => {
    const code = getCodeFromDigits(digits);

    // Skip if already cached or failed
    if (imageCache.has(code) || failedLoads.has(code)) {
      return Promise.resolve();
    }

    // Use requestIdleCallback if available, otherwise setTimeout
    return new Promise((resolve) => {
      const doLoad = () => {
        loadBackground(digits)
          .then(resolve)
          .catch(() => resolve()); // Ignore errors in prefetch
      };

      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(doLoad);
      } else {
        setTimeout(doLoad, 0);
      }
    });
  });

  // Don't wait for all - fire and forget
  Promise.all(promises).catch(() => {}); // Ignore errors
}

/**
 * Preload the next possible digits based on current input
 * @param {number[]} currentDigits - Current digit array
 */
export function prefetchNextDigits(currentDigits) {
  if (currentDigits.length >= 4) return; // Already at max

  // Generate next 10 possible combinations
  const nextCombinations = [];
  for (let i = 0; i < 10; i++) {
    nextCombinations.push([...currentDigits, i]);
  }

  preloadBackgrounds(nextCombinations);
}

/**
 * Preload initial backgrounds on app start
 */
export function preloadInitialBackgrounds() {
  // Preload first 10 combinations (0000-0009)
  const initial = [];
  for (let i = 0; i < 10; i++) {
    initial.push([i]);
  }
  preloadBackgrounds(initial);
}

/**
 * Clear the cache (useful for debugging or memory management)
 */
export function clearCache() {
  imageCache.clear();
  failedLoads.clear();
  inflightRequests.clear();
  stats.cacheHits = 0;
  stats.cacheMisses = 0;
  stats.networkLoads = 0;
  stats.failures = 0;
}

/**
 * Get cache statistics
 * @returns {Object} - Cache statistics
 */
export function getStats() {
  return {
    ...stats,
    cacheSize: imageCache.size,
    failedLoads: failedLoads.size,
    inflightRequests: inflightRequests.size,
    hitRate: stats.cacheHits + stats.cacheMisses > 0
      ? (stats.cacheHits / (stats.cacheHits + stats.cacheMisses) * 100).toFixed(1) + '%'
      : '0%',
  };
}

// Export for debugging
if (import.meta.env.DEV) {
  window.__keypadBackgroundLoader = {
    getStats,
    clearCache,
    imageCache,
    failedLoads,
  };
}
