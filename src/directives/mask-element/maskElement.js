import { effectScope } from "vue";
import { syncBackground } from "./syncBackground";
import "./maskElement.css";

export const maskElement = {
  mounted(el, binding) {
    const { document: doc, requestAnimationFrame: raf } = globalThis;

    const scope = effectScope();
    const state = scope.run(() => {
      el.classList.add("mask-element");

      // Create inner element for background compensation
      const innerElement = doc.createElement("div");
      innerElement.className = "mask-element-inner";

      // Apply custom color if provided
      if (binding.value) {
        innerElement.style.backgroundColor = binding.value;
      }

      // Insert as first child so it's behind existing content
      el.insertBefore(innerElement, el.firstChild);

      let rafId = null;
      const throttledSync = () => {
        if (rafId) return;
        rafId = raf(() => {
          syncBackground(el, innerElement);
          rafId = null;
        });
      };

      // первый sync после layout
      raf(throttledSync);

      const observer = new MutationObserver(throttledSync);
      observer.observe(el, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });

      // реагируем на изменения реальных размеров элемента
      const ro = new ResizeObserver(throttledSync);
      ro.observe(el);

      return { throttledSync, observer, ro, innerElement };
    });

    el._maskElement = { scope, ...state };
  },

  updated(el, binding) {
    const inst = el._maskElement;
    if (!inst?.innerElement) return;

    // Update color if changed
    if (binding.value) {
      inst.innerElement.style.backgroundColor = binding.value;
    } else {
      inst.innerElement.style.backgroundColor = "";
    }
  },

  unmounted(el) {
    const inst = el._maskElement;
    if (!inst) return;

    inst.observer?.disconnect();
    inst.ro?.disconnect();
    inst.scope?.stop();

    // Remove inner element
    if (inst.innerElement && inst.innerElement.parentNode) {
      inst.innerElement.remove();
    }

    el.classList.remove("mask-element");

    delete el._maskElement;
  },
};
