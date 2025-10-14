import { effectScope } from "vue";
import "./backdropFilter.css";

/**
 * Backdrop Filter Directive
 *
 * Applies backdrop-filter with customizable styles passed as props.
 * Simpler alternative to v-mask-element for cases where SVG masking is not needed.
 *
 * Usage:
 * v-backdrop-filter="{ blur: '10px', saturate: '180%', brightness: '90%' }"
 */
export const backdropFilter = {
  mounted(el, binding) {
    const scope = effectScope();

    const state = scope.run(() => {
      el.classList.add("backdrop-filter-element");

      // Create inner element for backdrop-filter
      const innerElement = document.createElement("div");
      innerElement.className = "backdrop-filter-inner";

      // Apply backdrop-filter styles from binding value
      applyBackdropStyles(innerElement, binding.value);

      // Insert as first child so it's behind existing content
      el.insertBefore(innerElement, el.firstChild);

      return { innerElement };
    });

    el._backdropFilter = { scope, ...state };
  },

  updated(el, binding) {
    const inst = el._backdropFilter;
    if (!inst?.innerElement) return;

    // Update backdrop-filter styles if changed
    applyBackdropStyles(inst.innerElement, binding.value);
  },

  unmounted(el) {
    const inst = el._backdropFilter;
    if (!inst) return;

    inst.scope?.stop();

    // Remove inner element
    if (inst.innerElement && inst.innerElement.parentNode) {
      inst.innerElement.remove();
    }

    el.classList.remove("backdrop-filter-element");

    delete el._backdropFilter;
  },
};

/**
 * Apply backdrop-filter styles to element
 * @param {HTMLElement} element
 * @param {Object} styles - { blur, saturate, brightness, contrast, etc. }
 */
function applyBackdropStyles(element, styles) {
  // 🔍 PROFILING: Track backdrop filter application
  const profile = window.__keypadProfile;
  const startTime = profile?.cssUpdatedTime ? performance.now() : null;

  if (!styles || typeof styles !== "object") {
    element.style.backdropFilter = "";
    return;
  }

  const filterParts = [];

  // Map common properties to CSS filter functions
  if (styles.blur) filterParts.push(`blur(${styles.blur})`);
  if (styles.saturate) filterParts.push(`saturate(${styles.saturate})`);
  if (styles.brightness) filterParts.push(`brightness(${styles.brightness})`);
  if (styles.contrast) filterParts.push(`contrast(${styles.contrast})`);
  if (styles.grayscale) filterParts.push(`grayscale(${styles.grayscale})`);
  if (styles.hueRotate) filterParts.push(`hue-rotate(${styles.hueRotate})`);
  if (styles.invert) filterParts.push(`invert(${styles.invert})`);
  if (styles.opacity) filterParts.push(`opacity(${styles.opacity})`);
  if (styles.sepia) filterParts.push(`sepia(${styles.sepia})`);

  // Apply combined filter or raw filter string
  if (styles.filter) {
    element.style.backdropFilter = styles.filter;
  } else if (filterParts.length > 0) {
    element.style.backdropFilter = filterParts.join(" ");
  } else {
    element.style.backdropFilter = "";
  }

  // 🔍 PROFILING: Backdrop style set
  if (startTime && profile) {
    const setTime = performance.now();
    profile.backdropStyleSetTime = setTime;
    profile.backdropStyleDuration = setTime - startTime;
  }
}
