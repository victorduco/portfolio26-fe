<script setup>
/**
 * GeBackground Component
 *
 * Loads pregenerated keypad backgrounds or falls back to dynamic generation.
 *
 * MODES:
 * - Pregenerated (production): Loads pre-rendered PNG images (~20-50ms network, <1ms cached)
 * - Dynamic (dev/fallback): Uses `toPng` from html-to-image (~50-200ms)
 *
 * PERFORMANCE:
 * - Pregenerated first load: ~20-50ms
 * - Pregenerated cached: <1ms
 * - Dynamic fallback: ~50-200ms
 * - Resize listener is DISABLED to prevent performance degradation
 *
 * Only regenerates on:
 * - Component mount
 * - watchData changes (e.g., entered digits in Keypad)
 *
 * If you need resize support, add debounce (300-500ms minimum)
 */
import { onMounted, watch, nextTick } from "vue";
import { toPng } from "html-to-image";
import {
  loadBackground,
  prefetchNextDigits,
  preloadInitialBackgrounds,
} from "@/utils/keypadBackgroundLoader.js";

const props = defineProps({
  sourceSelector: { type: String, required: true },
  watchData: { type: [Array, Object, String, Number], default: null },
  renderDelay: { type: Number, default: 100 },
  backgroundStyles: { type: Object },
  usePregenerated: {
    type: Boolean,
    default: import.meta.env.VITE_USE_PREGENERATED_BACKGROUNDS === 'true',
  },
});

let isGenerating = false;

// Determine if we should use pregenerated backgrounds
const shouldUsePregenerated = props.usePregenerated;

const sanitizeStyles = (styles) => {
  if (!styles) return undefined;
  const entries = Object.entries(styles).filter(([, value]) => value != null);
  return entries.length ? Object.fromEntries(entries) : undefined;
};

/**
 * Generate background using pregenerated images
 */
async function generateBackgroundPregenerated() {
  if (isGenerating) return;
  isGenerating = true;

  // 🔍 PROFILING: Background generation started
  const profile = window.__keypadProfile;
  if (profile?.clickTime) {
    profile.bgStartTime = performance.now();
    profile.mode = 'pregenerated';
  }

  // Validate watchData is an array of digits
  if (!Array.isArray(props.watchData) || props.watchData.length === 0) {
    isGenerating = false;
    return;
  }

  try {
    // 🔍 PROFILING: Starting image load
    if (profile?.bgStartTime) {
      profile.imgLoadStartTime = performance.now();
    }

    // Load the pregenerated image (returns path, not data URL)
    const imagePath = await loadBackground(props.watchData, profile);

    // 🔍 PROFILING: Image load complete
    if (profile?.imgLoadStartTime) {
      profile.imgLoadCompleteTime = performance.now();
    }

    // Set CSS variable with the image path
    document.documentElement.style.setProperty(
      "--global-keypad-bg",
      `url("${imagePath}")`
    );

    // 🔍 PROFILING: CSS variable updated
    if (profile?.imgLoadCompleteTime) {
      profile.bgGeneratedTime = performance.now();
      profile.cssUpdatedTime = performance.now();

      // Wait for next paint to check if backdrop filter applied
      requestAnimationFrame(() => {
        profile.raf1Time = performance.now();
        requestAnimationFrame(() => {
          profile.raf2Time = performance.now();
          profile.filterAppliedTime = performance.now();

          // Calculate all timings
          const clickToBg = profile.bgStartTime - profile.clickTime;
          const imgLoadTotal = profile.imgLoadCompleteTime - profile.imgLoadStartTime;

          // Breakdown of image loading
          let imgLoadBreakdown = '';
          if (profile.cacheHit) {
            imgLoadBreakdown = 'cached';
          } else if (profile.fetchStartTime) {
            const fetchTime = (profile.fetchCompleteTime || profile.imgLoadCompleteTime) - profile.fetchStartTime;
            const blobTime = profile.blobCompleteTime ? profile.blobCompleteTime - profile.fetchCompleteTime : 0;
            const dataURLTime = profile.dataURLCompleteTime ? profile.dataURLCompleteTime - profile.blobCompleteTime : 0;
            imgLoadBreakdown = `fetch ${fetchTime.toFixed(1)}`;
            if (blobTime > 0) imgLoadBreakdown += ` + blob ${blobTime.toFixed(1)}`;
            if (dataURLTime > 0) imgLoadBreakdown += ` + dataURL ${dataURLTime.toFixed(1)}`;
          } else {
            imgLoadBreakdown = 'network';
          }

          const cssUpdate = profile.cssUpdatedTime - profile.bgGeneratedTime;
          const raf1 = profile.raf1Time - profile.cssUpdatedTime;
          const raf2 = profile.raf2Time - profile.raf1Time;
          const total = profile.filterAppliedTime - profile.clickTime;

          const bgGenTotal = profile.bgGeneratedTime - profile.bgStartTime;
          const filterTotal = profile.filterAppliedTime - profile.cssUpdatedTime;

          // Build detailed output
          let output = `⏱️ Keypad [Pregenerated]: Click→Bg ${clickToBg.toFixed(1)}ms | `;

          // BgGen breakdown
          output += `BgGen ${bgGenTotal.toFixed(1)}ms (`;
          output += `imgLoad ${imgLoadTotal.toFixed(1)} [${imgLoadBreakdown}]) | `;

          output += `CSS ${cssUpdate.toFixed(1)}ms | `;

          // Filter breakdown
          output += `Filter ${filterTotal.toFixed(1)}ms (`;
          output += `raf1 ${raf1.toFixed(1)} + `;
          output += `raf2 ${raf2.toFixed(1)}`;

          // Add mask element timings if available (desktop only)
          if (profile.maskReadStartTime) {
            const maskRead =
              profile.maskReadCompleteTime - profile.maskReadStartTime;
            const maskWrite =
              profile.maskWriteCompleteTime - profile.maskWriteStartTime;
            output += ` + mask-read ${maskRead.toFixed(
              1
            )} + mask-write ${maskWrite.toFixed(1)}`;
          }

          // Add backdrop filter timing if available (mobile only)
          if (profile.backdropStyleDuration) {
            output += ` + backdrop ${profile.backdropStyleDuration.toFixed(1)}`;
          }

          output += `) | `;
          output += `Total ${total.toFixed(1)}ms`;

          console.log(output);

          // Clean up
          delete window.__keypadProfile;
        });
      });
    }

    // Prefetch next possible combinations
    if (props.watchData.length < 4) {
      prefetchNextDigits(props.watchData);
    }

  } catch (error) {
    console.error('Failed to load pregenerated background, falling back to toPng:', error);
    // Fall back to dynamic generation
    await generateBackgroundDynamic();
  } finally {
    isGenerating = false;
  }
}

/**
 * Generate background dynamically using toPng (fallback/dev mode)
 */
async function generateBackgroundDynamic() {
  if (isGenerating) return;
  isGenerating = true;

  // 🔍 PROFILING: Background generation started
  const profile = window.__keypadProfile;
  if (profile?.clickTime) {
    profile.mode = 'dynamic';
    profile.bgStartTime = performance.now();
  }

  const src = document.getElementById(props.sourceSelector);
  if (!src) {
    isGenerating = false;
    return;
  }

  // 🔍 PROFILING: DOM element found
  if (profile?.bgStartTime) {
    profile.domFoundTime = performance.now();
  }

  const bodyBg = getComputedStyle(document.body).backgroundColor || "#000";
  const sanitizedStyles = sanitizeStyles(props.backgroundStyles);

  // 🔍 PROFILING: Styles prepared
  if (profile?.domFoundTime) {
    profile.stylesPreparedTime = performance.now();
  }

  await new Promise((resolve) => setTimeout(resolve, props.renderDelay));

  // 🔍 PROFILING: Render delay complete
  if (profile?.stylesPreparedTime) {
    profile.delayCompleteTime = performance.now();
  }

  await document.fonts.ready;

  // 🔍 PROFILING: Fonts ready
  if (profile?.delayCompleteTime) {
    profile.fontsReadyTime = performance.now();
  }

  const img = await toPng(src, {
    width: src.offsetWidth,
    height: src.offsetHeight,
    backgroundColor: bodyBg,
    pixelRatio: 1,
    style: sanitizedStyles,
  });

  // 🔍 PROFILING: Background generated (toPng complete)
  if (profile?.fontsReadyTime) {
    profile.bgGeneratedTime = performance.now();
  }

  document.documentElement.style.setProperty(
    "--global-keypad-bg",
    `url("${img}")`
  );

  // 🔍 PROFILING: CSS variable updated
  if (profile?.bgGeneratedTime) {
    profile.cssUpdatedTime = performance.now();

    // Wait for next paint to check if backdrop filter applied
    requestAnimationFrame(() => {
      profile.raf1Time = performance.now();
      requestAnimationFrame(() => {
        profile.raf2Time = performance.now();
        profile.filterAppliedTime = performance.now();

        // Calculate all timings
        const clickToBg = profile.bgStartTime - profile.clickTime;
        const domFind = profile.domFoundTime - profile.bgStartTime;
        const stylesPrep = profile.stylesPreparedTime - profile.domFoundTime;
        const delayWait =
          profile.delayCompleteTime - profile.stylesPreparedTime;
        const fontsWait = profile.fontsReadyTime - profile.delayCompleteTime;
        const toPngExec = profile.bgGeneratedTime - profile.fontsReadyTime;
        const cssUpdate = profile.cssUpdatedTime - profile.bgGeneratedTime;
        const raf1 = profile.raf1Time - profile.cssUpdatedTime;
        const raf2 = profile.raf2Time - profile.raf1Time;
        const total = profile.filterAppliedTime - profile.clickTime;

        const bgGenTotal = profile.bgGeneratedTime - profile.bgStartTime;
        const filterTotal = profile.filterAppliedTime - profile.cssUpdatedTime;

        // Build detailed output
        let output = `⏱️ Keypad [Dynamic]: Click→Bg ${clickToBg.toFixed(1)}ms | `;

        // BgGen breakdown
        output += `BgGen ${bgGenTotal.toFixed(1)}ms (`;
        output += `dom ${domFind.toFixed(1)} + `;
        output += `styles ${stylesPrep.toFixed(1)} + `;
        output += `delay ${delayWait.toFixed(1)} + `;
        output += `fonts ${fontsWait.toFixed(1)} + `;
        output += `toPng ${toPngExec.toFixed(1)}) | `;

        output += `CSS ${cssUpdate.toFixed(1)}ms | `;

        // Filter breakdown
        output += `Filter ${filterTotal.toFixed(1)}ms (`;
        output += `raf1 ${raf1.toFixed(1)} + `;
        output += `raf2 ${raf2.toFixed(1)}`;

        // Add mask element timings if available (desktop only)
        if (profile.maskReadStartTime) {
          const maskRead =
            profile.maskReadCompleteTime - profile.maskReadStartTime;
          const maskWrite =
            profile.maskWriteCompleteTime - profile.maskWriteStartTime;
          output += ` + mask-read ${maskRead.toFixed(
            1
          )} + mask-write ${maskWrite.toFixed(1)}`;
        }

        // Add backdrop filter timing if available (mobile only)
        if (profile.backdropStyleDuration) {
          output += ` + backdrop ${profile.backdropStyleDuration.toFixed(1)}`;
        }

        output += `) | `;
        output += `Total ${total.toFixed(1)}ms`;

        console.log(output);

        // Clean up
        delete window.__keypadProfile;
      });
    });
  }

  isGenerating = false;
}

/**
 * Main entry point - routes to pregenerated or dynamic based on mode
 */
async function generateBackground() {
  if (shouldUsePregenerated) {
    await generateBackgroundPregenerated();
  } else {
    await generateBackgroundDynamic();
  }
}

watch(
  () => [props.watchData, props.backgroundStyles],
  async () => {
    await nextTick();
    requestAnimationFrame(generateBackground);
  },
  { deep: true }
);

onMounted(() => {
  // Preload initial backgrounds if using pregenerated mode
  if (shouldUsePregenerated) {
    preloadInitialBackgrounds();
  }

  requestAnimationFrame(generateBackground);
});
</script>
