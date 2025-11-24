/**
 * Keypad Background Loader - handles loading/caching of pregenerated keypad background images
 */

let manifest = null;
let manifestLoading = null;

async function loadManifest() {
  if (manifest) return manifest;
  if (manifestLoading) return manifestLoading;
  manifestLoading = fetch("/keypad-backgrounds/manifest.json")
    .then(r => r.ok ? r.json() : null)
    .then(m => manifest = m)
    .catch(() => null);
  return manifestLoading;
}

loadManifest();

const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL;
const USE_CDN = CDN_BASE_URL && import.meta.env.PROD;
const imageCache = new Map();
const failedLoads = new Set();
const inflightRequests = new Map();
const stats = { cacheHits: 0, cacheMisses: 0, networkLoads: 0, failures: 0 };

function getPath(code, m = manifest) {
  const base = USE_CDN ? `${CDN_BASE_URL}/sharp` : '/keypad-backgrounds/sharp';
  const filename = m?.[code] || `${code}.png`;
  return `${base}/${filename}`;
}

export function getBackgroundPath(digits) {
  const code = digits.join("");
  if (!manifest) {
    console.warn('Keypad manifest not loaded yet, returning empty path');
    return '';
  }
  return getPath(code);
}

export async function getBackgroundPathAsync(digits) {
  const m = manifest || await loadManifest();
  if (!m) {
    console.warn('Keypad manifest failed to load, returning empty path');
    return '';
  }
  const code = digits.join("");
  return getPath(code, m);
}

export async function loadBackground(digits, profile = null) {
  const code = digits.join("");

  if (imageCache.has(code)) {
    stats.cacheHits++;
    if (profile) profile.cacheHit = true;
    return imageCache.get(code);
  }

  stats.cacheMisses++;
  if (failedLoads.has(code)) throw new Error(`Previous load failed for ${code}`);
  if (inflightRequests.has(code)) return inflightRequests.get(code);

  if (profile) profile.fetchStartTime = performance.now();

  const loadPromise = (async () => {
    try {
      const m = await loadManifest();
      const path = getPath(code, m);
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Failed to load image"));
        setTimeout(() => reject(new Error("Image load timeout")), 10000);
        img.src = path;
      });

      if (profile) profile.fetchCompleteTime = performance.now();
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
  const idle = typeof requestIdleCallback !== "undefined" ? requestIdleCallback : setTimeout;
  digitArrays.forEach(digits => {
    const code = digits.join("");
    if (!imageCache.has(code) && !failedLoads.has(code)) {
      idle(() => loadBackground(digits).catch(() => {}));
    }
  });
}

export function prefetchNextDigits(currentDigits) {
  if (currentDigits.length >= 4) return;
  preloadBackgrounds(Array.from({ length: 10 }, (_, i) => [...currentDigits, i]));
}

export async function preloadInitialBackgrounds() {
  await loadManifest();
  preloadBackgrounds(Array.from({ length: 10 }, (_, i) => [i]));
}

export function clearCache() {
  [imageCache, failedLoads, inflightRequests].forEach(c => c.clear());
  Object.assign(stats, { cacheHits: 0, cacheMisses: 0, networkLoads: 0, failures: 0 });
}

export function getStats() {
  const total = stats.cacheHits + stats.cacheMisses;
  return {
    ...stats,
    cacheSize: imageCache.size,
    failedLoads: failedLoads.size,
    inflightRequests: inflightRequests.size,
    hitRate: total > 0 ? ((stats.cacheHits / total) * 100).toFixed(1) + "%" : "0%",
  };
}

export async function initKeypadBackgrounds() {
  await loadManifest();
}

if (import.meta.env.DEV) {
  window.__keypadBackgroundLoader = { getStats, clearCache, imageCache, failedLoads };
}
