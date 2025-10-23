/**
 * Keypad Background Loader
 *
 * Handles loading and caching of pregenerated keypad background images.
 * Provides optimized loading with memory cache and prefetching capabilities.
 * Supports CDN URLs with content-hashed filenames.
 */

let manifest = null;
async function loadManifest() {
  if (manifest) return manifest;

  try {
    const response = await fetch("/keypad-backgrounds/manifest.json");
    if (!response.ok) throw new Error("Manifest not found");
    manifest = await response.json();
    return manifest;
  } catch (error) {
    return null;
  }
}

const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL;
const USE_CDN = CDN_BASE_URL && import.meta.env.PROD;

const imageCache = new Map();

const failedLoads = new Set();

const inflightRequests = new Map();

const stats = {
  cacheHits: 0,
  cacheMisses: 0,
  networkLoads: 0,
  failures: 0,
};

function getCodeFromDigits(digits) {
  return digits.map((d) => String(d)).join("");
}

export function getBackgroundPath(digits) {
  const code = getCodeFromDigits(digits);

  if (USE_CDN && manifest) {
    const filename = manifest[code] || `${code}.png`;
    return `${CDN_BASE_URL}/sharp/${filename}`;
  }

  if (manifest && manifest[code]) {
    return `/keypad-backgrounds/sharp/${manifest[code]}`;
  }

  return `/keypad-backgrounds/sharp/${code}.png`;
}

function getBackgroundPathWithManifest(digits, manifestData) {
  const code = getCodeFromDigits(digits);

  if (USE_CDN && manifestData) {
    const filename = manifestData[code] || `${code}.png`;
    return `${CDN_BASE_URL}/sharp/${filename}`;
  }

  if (manifestData && manifestData[code]) {
    return `/keypad-backgrounds/sharp/${manifestData[code]}`;
  }

  return `/keypad-backgrounds/sharp/${code}.png`;
}

async function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function loadBackground(digits, profile = null) {
  const code = getCodeFromDigits(digits);

  if (imageCache.has(code)) {
    stats.cacheHits++;
    if (profile) {
      profile.cacheHit = true;
    }
    return imageCache.get(code);
  }

  stats.cacheMisses++;

  if (failedLoads.has(code)) {
    throw new Error(`Previous load failed for ${code}`);
  }

  if (inflightRequests.has(code)) {
    return inflightRequests.get(code);
  }

  if (profile) {
    profile.fetchStartTime = performance.now();
  }

  const loadPromise = (async () => {
    try {
      const manifestData = await loadManifest();
      const path = getBackgroundPathWithManifest(digits, manifestData);

      const img = new Image();

      const imageLoaded = new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        setTimeout(() => reject(new Error("Image load timeout")), 10000);
      });

      img.src = path;
      await imageLoaded;

      if (profile) {
        profile.fetchCompleteTime = performance.now();
      }

      imageCache.set(code, path);
      stats.networkLoads++;

      return path;
    } catch (error) {
      stats.failures++;
      failedLoads.add(code);
      throw error;
    } finally {
      inflightRequests.delete(code);
    }
  })();

  inflightRequests.set(code, loadPromise);

  return loadPromise;
}

export async function preloadBackgrounds(digitArrays) {
  const promises = digitArrays.map((digits) => {
    const code = getCodeFromDigits(digits);

    if (imageCache.has(code) || failedLoads.has(code)) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const doLoad = () => {
        loadBackground(digits)
          .then(resolve)
          .catch(() => resolve());
      };

      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(doLoad);
      } else {
        setTimeout(doLoad, 0);
      }
    });
  });

  Promise.all(promises).catch(() => {});
}

export function prefetchNextDigits(currentDigits) {
  if (currentDigits.length >= 4) return;

  const nextCombinations = [];
  for (let i = 0; i < 10; i++) {
    nextCombinations.push([...currentDigits, i]);
  }

  preloadBackgrounds(nextCombinations);
}

export async function preloadInitialBackgrounds() {
  await loadManifest();

  const initial = [];
  for (let i = 0; i < 10; i++) {
    initial.push([i]);
  }
  preloadBackgrounds(initial);
}

export function clearCache() {
  imageCache.clear();
  failedLoads.clear();
  inflightRequests.clear();
  stats.cacheHits = 0;
  stats.cacheMisses = 0;
  stats.networkLoads = 0;
  stats.failures = 0;
}

export function getStats() {
  return {
    ...stats,
    cacheSize: imageCache.size,
    failedLoads: failedLoads.size,
    inflightRequests: inflightRequests.size,
    hitRate:
      stats.cacheHits + stats.cacheMisses > 0
        ? (
            (stats.cacheHits / (stats.cacheHits + stats.cacheMisses)) *
            100
          ).toFixed(1) + "%"
        : "0%",
  };
}

if (import.meta.env.DEV) {
  window.__keypadBackgroundLoader = {
    getStats,
    clearCache,
    imageCache,
    failedLoads,
  };
}
