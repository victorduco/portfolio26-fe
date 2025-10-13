<script setup>
/**
 * GeBackground Component
 *
 * Converts DOM element to PNG and sets it as CSS variable background.
 *
 * PERFORMANCE WARNING:
 * - Uses `toPng` from html-to-image (slow operation ~50-200ms)
 * - Resize listener is DISABLED to prevent performance degradation
 * - With resize listener: 10.85s total, 467ms avg resize, +468% degradation
 * - Without resize listener: 2.61s total, 74ms avg resize, no degradation
 *
 * Only regenerates on:
 * - Component mount
 * - watchData changes (e.g., entered digits in Keypad)
 *
 * If you need resize support, add debounce (300-500ms minimum)
 */
import { onMounted, watch, nextTick } from "vue";
import { toPng } from "html-to-image";

const props = defineProps({
  sourceSelector: { type: String, required: true },
  watchData: { type: [Array, Object, String, Number], default: null },
  renderDelay: { type: Number, default: 100 },
  backgroundStyles: { type: Object },
});

let isGenerating = false;

const sanitizeStyles = (styles) => {
  if (!styles) return undefined;
  const entries = Object.entries(styles).filter(([, value]) => value != null);
  return entries.length ? Object.fromEntries(entries) : undefined;
};

async function generateBackground() {
  if (isGenerating) return;
  isGenerating = true;

  // 🔍 PROFILING: Background generation started
  const profile = window.__keypadProfile;
  if (profile?.clickTime) {
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
        const delayWait = profile.delayCompleteTime - profile.stylesPreparedTime;
        const fontsWait = profile.fontsReadyTime - profile.delayCompleteTime;
        const toPngExec = profile.bgGeneratedTime - profile.fontsReadyTime;
        const cssUpdate = profile.cssUpdatedTime - profile.bgGeneratedTime;
        const raf1 = profile.raf1Time - profile.cssUpdatedTime;
        const raf2 = profile.raf2Time - profile.raf1Time;
        const total = profile.filterAppliedTime - profile.clickTime;
        
        const bgGenTotal = profile.bgGeneratedTime - profile.bgStartTime;
        const filterTotal = profile.filterAppliedTime - profile.cssUpdatedTime;
        
        // Build detailed output
        let output = `⏱️ Keypad: Click→Bg ${clickToBg.toFixed(1)}ms | `;
        
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
          const maskRead = profile.maskReadCompleteTime - profile.maskReadStartTime;
          const maskWrite = profile.maskWriteCompleteTime - profile.maskWriteStartTime;
          output += ` + mask-read ${maskRead.toFixed(1)} + mask-write ${maskWrite.toFixed(1)}`;
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

watch(
  () => [props.watchData, props.backgroundStyles],
  async () => {
    await nextTick();
    requestAnimationFrame(generateBackground);
  },
  { deep: true }
);

onMounted(() => {
  requestAnimationFrame(generateBackground);
});
</script>
