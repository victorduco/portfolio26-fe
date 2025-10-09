import { effectScope } from "vue";
import { syncBackground } from "./syncBackground";
import "./maskElement.css";

export const maskElement = {
  mounted(el, binding) {
    const scope = effectScope();
    const state = scope.run(() => {
      el.classList.add("mask-element");

      const innerElement = document.createElement("div");
      innerElement.className = "mask-element-inner";
      if (binding.value) innerElement.style.backgroundColor = binding.value;
      el.insertBefore(innerElement, el.firstChild);

      const sync = () => syncBackground(el, innerElement);
      requestAnimationFrame(sync);

      const observer = new MutationObserver(sync);
      observer.observe(el, { attributes: true, attributeFilter: ["style", "class"] });

      const ro = new ResizeObserver(sync);
      ro.observe(el);

      return { sync, observer, ro, innerElement };
    });

    el._maskElement = { scope, ...state };
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
