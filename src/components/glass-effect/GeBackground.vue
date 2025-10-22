<template>
  <div ref="backgroundNumbers" class="background-numbers"></div>
</template>

<script setup>
import { onMounted, watch, nextTick, ref } from "vue";
import { generateCompositeSVG } from "@/utils/svgBackgroundGenerator.js";

const props = defineProps({
  watchData: { type: [Array, Object, String, Number], default: null },
});

const backgroundNumbers = ref(null);
let isGenerating = false;

/**
 * Generate background from SVG composition
 */
async function generateBackgroundSVG() {
  if (isGenerating) return;
  isGenerating = true;

  // 🔍 PROFILING: Background generation started
  const profile = window.__keypadProfile;
  if (profile?.clickTime) {
    profile.bgStartTime = performance.now();
    profile.mode = "svg-composition";
  }

  // Validate watchData is an array of digits
  if (!Array.isArray(props.watchData) || props.watchData.length === 0) {
    isGenerating = false;
    return;
  }

  try {
    // 🔍 PROFILING: Starting SVG generation
    if (profile?.bgStartTime) {
      profile.svgGenStartTime = performance.now();
    }

    // Generate SVG markup
    const svgMarkup = generateCompositeSVG(props.watchData);

    // 🔍 PROFILING: SVG generation complete
    if (profile?.svgGenStartTime) {
      profile.svgGenCompleteTime = performance.now();
    }

    if (!svgMarkup) {
      isGenerating = false;
      return;
    }

    // Render SVG to .background-numbers container
    if (backgroundNumbers.value) {
      backgroundNumbers.value.innerHTML = svgMarkup;
    }

    // 🔍 PROFILING: SVG rendered to DOM
    if (profile?.svgGenCompleteTime) {
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
          const svgGenTime =
            profile.svgGenCompleteTime - profile.svgGenStartTime;
          const cssUpdate = profile.cssUpdatedTime - profile.bgGeneratedTime;
          const raf1 = profile.raf1Time - profile.cssUpdatedTime;
          const raf2 = profile.raf2Time - profile.raf1Time;
          const total = profile.filterAppliedTime - profile.clickTime;

          const bgGenTotal = profile.bgGeneratedTime - profile.bgStartTime;
          const filterTotal =
            profile.filterAppliedTime - profile.cssUpdatedTime;

          // Build detailed output
          let output = `⏱️ Keypad [SVG-Composition]: Click→Bg ${clickToBg.toFixed(
            1
          )}ms | `;

          // BgGen breakdown
          output += `BgGen ${bgGenTotal.toFixed(1)}ms (`;
          output += `svgGen ${svgGenTime.toFixed(1)}) | `;

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

          // Clean up
          delete window.__keypadProfile;
        });
      });
    }
  } catch (error) {
    console.error("Failed to generate SVG background:", error);
  } finally {
    isGenerating = false;
  }
}

watch(
  () => props.watchData,
  async () => {
    await nextTick();
    requestAnimationFrame(generateBackgroundSVG);
  },
  { deep: true }
);

onMounted(() => {
  requestAnimationFrame(generateBackgroundSVG);
});
</script>

<style scoped>
.background-numbers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.background-numbers svg {
  width: 100%;
  height: 100%;
}
</style>
