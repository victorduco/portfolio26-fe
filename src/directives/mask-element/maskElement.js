import { effectScope } from "vue";
import { syncBackground } from "./syncBackground";
import "./maskElement.css";

export const maskElement = {
  mounted(el, binding) {
    el.classList.add("mask-element");
    const scope = effectScope();

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

    el._maskElement = { scope, observer, ro, innerElement };
  },

  updated(el, binding) {
    el._maskElement?.innerElement?.style.setProperty("background-color", binding.value || "");
  },

  unmounted(el) {
    const inst = el._maskElement;
    if (!inst) return;
    inst.scope?.stop();
    inst.observer?.disconnect();
    inst.ro?.disconnect();
    inst.innerElement?.remove();
    el.classList.remove("mask-element");
    delete el._maskElement;
  },
};
