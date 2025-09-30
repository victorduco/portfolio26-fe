import { effectScope } from "vue";
import { syncBackground } from "./syncBackground";

let STYLES_INJECTED = false;

export const maskElement = {
  mounted(el) {
    console.log("maskeffect mounted");
    const { document: doc, requestAnimationFrame: raf } = globalThis;

    const scope = effectScope();
    const state = scope.run(() => {
      el.classList.add("mask-element");

      if (!STYLES_INJECTED) {
        STYLES_INJECTED = true;
        const st = doc.createElement("style");
        st.id = "mask-element-styles";
        st.textContent = `
          .mask-element{
            position:relative;
            overflow:hidden
          }
          .mask-element-inner{
            transform:rotate(var(--rotation,0deg)) scale(var(--scale,1)) translateX(var(--x-offset,0px)) translateY(var(--y-offset,0px));
            transform-origin:center center;
            width:100vw;
            height:100vh;

            background-image:var(--global-bg);
            background-position:50% 50%;
            background-size:100vw auto;
            background-repeat:no-repeat;
            pointer-events:none;
            opacity:1;
            filter:var(--glass-filter,none);
            position:absolute;
            z-index:1
          }`;
        doc.head.appendChild(st);
      }

      // Create inner element for background compensation
      const innerElement = doc.createElement("div");
      innerElement.className = "mask-element-inner";

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
