import { effectScope } from "vue";
import "./backdropFilter.css";

const FILTER_MAP = { blur: "blur", saturate: "saturate", brightness: "brightness", contrast: "contrast", grayscale: "grayscale", hueRotate: "hue-rotate", invert: "invert", opacity: "opacity", sepia: "sepia" };

export const backdropFilter = {
  mounted(el, binding) {
    const scope = effectScope();
    const state = scope.run(() => {
      el.classList.add("backdrop-filter-element");
      const innerElement = document.createElement("div");
      innerElement.className = "backdrop-filter-inner";
      applyBackdropStyles(innerElement, binding.value);
      el.insertBefore(innerElement, el.firstChild);
      return { innerElement };
    });
    el._backdropFilter = { scope, ...state };
  },

  updated(el, binding) {
    const inst = el._backdropFilter;
    if (!inst?.innerElement) return;
    applyBackdropStyles(inst.innerElement, binding.value);
  },

  unmounted(el) {
    const inst = el._backdropFilter;
    if (!inst) return;
    inst.scope?.stop();
    inst.innerElement?.remove();
    el.classList.remove("backdrop-filter-element");
    delete el._backdropFilter;
  },
};

function applyBackdropStyles(element, styles) {
  const p = window.__keypadProfile, t = p?.cssUpdatedTime ? performance.now() : 0;
  if (!styles || typeof styles !== "object") {
    element.style.backdropFilter = "";
    return;
  }
  if (styles.filter) {
    element.style.backdropFilter = styles.filter;
  } else {
    const filters = Object.entries(FILTER_MAP).map(([key, fn]) => styles[key] ? `${fn}(${styles[key]})` : null).filter(Boolean);
    element.style.backdropFilter = filters.join(" ");
  }
  if (t && p) { p.backdropStyleSetTime = performance.now(); p.backdropStyleDuration = p.backdropStyleSetTime - t; }
}
