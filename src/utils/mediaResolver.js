/**
 * Media Path Resolver - Resolves media paths using manifest with content-hashed filenames.
 * Dev: uses hashed version if in manifest, otherwise original.
 * Prod: CDN URLs from VITE_CDN_MEDIA_URL env var if configured, otherwise local paths.
 * Manifest: /media-manifest.json with { images: {}, videos: {}, fonts: {}, documents: {} }
 */

const CDN_BASE_URL = import.meta.env.VITE_CDN_MEDIA_URL;
const USE_CDN = CDN_BASE_URL && import.meta.env.PROD;
const IS_DEV = import.meta.env.DEV;

let manifest = null;
let manifestLoading = null;

async function loadManifest() {
  if (manifest) return manifest;
  if (manifestLoading) return manifestLoading;

  manifestLoading = (async () => {
    try {
      const res = await fetch("/media-manifest.json");
      if (!res.ok) { console.warn("Media manifest not found"); return null; }
      return manifest = await res.json();
    } catch (e) { console.warn("Failed to load media manifest:", e); return null; }
  })();
  return manifestLoading;
}

function getMediaPath(type, filename) {
  const prefix = `/${type}/`;
  if (filename.startsWith(prefix)) filename = filename.slice(prefix.length);

  const hashedName = manifest?.[type]?.[filename];

  if (IS_DEV) return hashedName ? `${prefix}${hashedName}` : `${prefix}${filename}`;

  const resolved = hashedName || filename;
  return USE_CDN ? `${CDN_BASE_URL}${prefix}${resolved}` : `${prefix}${resolved}`;
}

export const getImagePath = (f) => getMediaPath('images', f);
export const getVideoPath = (f) => getMediaPath('videos', f);
export const getFontPath = (f) => getMediaPath('fonts', f);
export const getDocumentPath = (f) => getMediaPath('documents', f);
export const getFontBaseUrl = () => USE_CDN ? `${CDN_BASE_URL}/fonts` : '/fonts';

export function resolveMediaPath(path) {
  if (path.startsWith("/images/")) return getImagePath(path);
  if (path.startsWith("/videos/")) return getVideoPath(path);
  return path;
}

export const initMediaResolver = () => loadManifest();
export const isManifestLoaded = () => manifest !== null;

export async function reloadManifest() {
  manifest = null;
  manifestLoading = null;
  await loadManifest();
}

export function getManifestStats() {
  if (!manifest) return { loaded: false };
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

if (typeof window !== "undefined") {
  window.__mediaResolver = {
    getImagePath, getVideoPath, getDocumentPath, resolveMediaPath,
    getManifestStats, isManifestLoaded, reloadManifest,
  };
}
