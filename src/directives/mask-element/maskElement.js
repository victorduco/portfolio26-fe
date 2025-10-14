import { effectScope } from "vue";
import { syncBackground } from "./syncBackground";
import "./maskElement.css";

export const maskElement = {
  mounted(el, binding) {
    window.__profile?.start?.("mask-element-mount");

    const scope = effectScope();
    const state = scope.run(() => {
      el.classList.add("mask-element");

      const innerElement = document.createElement("div");
      innerElement.className = "mask-element-inner";
      if (binding.value) innerElement.style.backgroundColor = binding.value;
      el.insertBefore(innerElement, el.firstChild);

      window.__profile?.mark?.("mask-element-dom-ready");

      const sync = () => {
        window.__profile?.start?.("mask-element-sync");
        syncBackground(el, innerElement);
        window.__profile?.end?.("mask-element-sync");
      };
      requestAnimationFrame(() => {
        sync();
        requestAnimationFrame(() => {
          window.__profile?.mark?.("mask-element-first-sync-complete");
        });
      });

      const observer = new MutationObserver(sync);
      observer.observe(el, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });

      const ro = new ResizeObserver(sync);
      ro.observe(el);

      return { sync, observer, ro, innerElement };
    });

    el._maskElement = { scope, ...state };

    window.__profile?.end?.("mask-element-mount");
    requestAnimationFrame(() => {
      window.__profile?.mark?.("mask-element-rendered");
    });
  },

  updated(el, binding) {
    const inst = el._maskElement;
    if (inst?.innerElement) {
      inst.innerElement.style.backgroundColor = binding.value || "";
    }
  },

  unmounted(el) {
    const inst = el._maskElement;
    if (!inst) return;

    inst.observer?.disconnect();
    inst.ro?.disconnect();
    inst.scope?.stop();
    inst.innerElement?.remove();

    el.classList.remove("mask-element");
    delete el._maskElement;
  },
};
