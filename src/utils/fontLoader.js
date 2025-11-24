/**
 * Font Loader - Loads fonts from CDN in production, local in development.
 */

const CDN_BASE_URL = import.meta.env.VITE_CDN_MEDIA_URL;
const USE_CDN = CDN_BASE_URL && import.meta.env.PROD;

const variableFont = (family, file, style = 'normal') => ({
  family, file, descriptors: { style, weight: '100 900', stretch: '100%', display: 'swap' }
});

const staticFont = (family, file, weight) => ({
  family, file, descriptors: { style: 'normal', weight, display: 'swap' }
});

const fontDefinitions = [
  variableFont('Noto Sans', 'noto-sans-latin.woff2'),
  variableFont('Noto Sans', 'noto-sans-latin-italic.woff2', 'italic'),
  variableFont('Hanken Grotesk', 'hanken-grotesk-latin.woff2'),
  variableFont('Hanken Grotesk', 'hanken-grotesk-latin-italic.woff2', 'italic'),
  staticFont('Neue Haas Grotesk Display Pro', 'neue-haas-display-medium.woff2', '500'),
  staticFont('Neue Haas Grotesk Display Pro', 'neue-haas-display-medium.woff2', '600'),
  staticFont('Neue Haas Grotesk Display Pro', 'neue-haas-display-bold.woff2', '700'),
];

export async function loadFonts() {
  if (!USE_CDN) return;

  await Promise.all(fontDefinitions.map(async ({ family, file, descriptors }) => {
    try {
      const font = new FontFace(family, `url(${CDN_BASE_URL}/fonts/${file})`, descriptors);
      await font.load();
      document.fonts.add(font);
    } catch (e) {
      console.warn(`Failed to load font ${family} (${file}):`, e);
    }
  }));
}

export const areFontsLoaded = () => document.fonts.check('16px "Noto Sans"');

export const getFontStats = () => ({
  useCDN: USE_CDN,
  cdnUrl: CDN_BASE_URL || 'not configured',
  fontsReady: document.fonts.status,
  loadedFonts: Array.from(document.fonts).map(f => `${f.family} ${f.weight} ${f.style}`),
});

if (typeof window !== 'undefined') {
  window.__fontLoader = { loadFonts, areFontsLoaded, getFontStats };
}
