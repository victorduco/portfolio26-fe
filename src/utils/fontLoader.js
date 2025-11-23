/**
 * Font Loader
 *
 * Loads fonts from CDN in production, local in development.
 * Uses FontFace API to dynamically load fonts with correct URLs.
 */

// CDN configuration
const CDN_BASE_URL = import.meta.env.VITE_CDN_MEDIA_URL;
const USE_CDN = CDN_BASE_URL && import.meta.env.PROD;

/**
 * Get font URL based on environment
 */
function getFontUrl(filename) {
  if (USE_CDN) {
    return `${CDN_BASE_URL}/fonts/${filename}`;
  }
  return `/fonts/${filename}`;
}

/**
 * Font definitions
 */
const fontDefinitions = [
  // Noto Sans - Variable font
  {
    family: 'Noto Sans',
    file: 'noto-sans-latin.woff2',
    descriptors: {
      style: 'normal',
      weight: '100 900',
      stretch: '100%',
      display: 'swap',
    },
  },
  {
    family: 'Noto Sans',
    file: 'noto-sans-latin-italic.woff2',
    descriptors: {
      style: 'italic',
      weight: '100 900',
      stretch: '100%',
      display: 'swap',
    },
  },
  // Hanken Grotesk - Variable font
  {
    family: 'Hanken Grotesk',
    file: 'hanken-grotesk-latin.woff2',
    descriptors: {
      style: 'normal',
      weight: '100 900',
      stretch: '100%',
      display: 'swap',
    },
  },
  {
    family: 'Hanken Grotesk',
    file: 'hanken-grotesk-latin-italic.woff2',
    descriptors: {
      style: 'italic',
      weight: '100 900',
      stretch: '100%',
      display: 'swap',
    },
  },
  // Neue Haas Grotesk Display Pro
  {
    family: 'Neue Haas Grotesk Display Pro',
    file: 'neue-haas-display-medium.woff2',
    descriptors: {
      style: 'normal',
      weight: '500',
      display: 'swap',
    },
  },
  {
    family: 'Neue Haas Grotesk Display Pro',
    file: 'neue-haas-display-medium.woff2',
    descriptors: {
      style: 'normal',
      weight: '600',
      display: 'swap',
    },
  },
  {
    family: 'Neue Haas Grotesk Display Pro',
    file: 'neue-haas-display-bold.woff2',
    descriptors: {
      style: 'normal',
      weight: '700',
      display: 'swap',
    },
  },
];

/**
 * Load all fonts
 * Only loads via FontFace API in production with CDN
 * In development, CSS @font-face rules handle loading
 */
export async function loadFonts() {
  // In development or without CDN, CSS handles font loading
  if (!USE_CDN) {
    return;
  }

  // In production with CDN, use FontFace API
  const loadPromises = fontDefinitions.map(async (def) => {
    try {
      const font = new FontFace(def.family, `url(${getFontUrl(def.file)})`, def.descriptors);
      await font.load();
      document.fonts.add(font);
    } catch (error) {
      console.warn(`Failed to load font ${def.family} (${def.file}):`, error);
    }
  });

  await Promise.all(loadPromises);
}

/**
 * Check if fonts are loaded
 */
export function areFontsLoaded() {
  return document.fonts.check('16px "Noto Sans"');
}

/**
 * Get font loading stats (for debugging)
 */
export function getFontStats() {
  return {
    useCDN: USE_CDN,
    cdnUrl: CDN_BASE_URL || 'not configured',
    fontsReady: document.fonts.status,
    loadedFonts: Array.from(document.fonts).map(f => `${f.family} ${f.weight} ${f.style}`),
  };
}

// Export for debugging
if (typeof window !== 'undefined') {
  window.__fontLoader = {
    loadFonts,
    areFontsLoaded,
    getFontStats,
  };
}
