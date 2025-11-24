import { ref, onMounted } from "vue";
import { initMediaResolver, getImagePath, getVideoPath, resolveMediaPath, isManifestLoaded } from "@/utils/mediaResolver";

const isInitialized = ref(false);
const isInitializing = ref(false);

async function ensureInitialized() {
  if (isInitialized.value || isInitializing.value) return;
  isInitializing.value = true;
  await initMediaResolver();
  isInitialized.value = true;
  isInitializing.value = false;
}

export function useMedia() {
  onMounted(ensureInitialized);
  return {
    image: getImagePath,
    video: getVideoPath,
    resolve: resolveMediaPath,
    isReady: isManifestLoaded,
  };
}

export async function setupMedia() {
  await ensureInitialized();
}
