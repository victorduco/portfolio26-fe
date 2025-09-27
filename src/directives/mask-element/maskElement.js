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
          .mask-element{position:relative}
          .mask-element::before{
            content:"";position:absolute;top:-50%;left:-50%;
            width:200%;height:200%;
            background-image:var(--global-bg);
            background-size:var(--bg-size,100vw auto);
            background-position:var(--bg-pos-x,0px) var(--bg-pos-y,0px);
            transform:rotate(var(--bg-rotation,0deg));transform-origin:center;
            pointer-events:none;opacity:1;z-index:1;filter:var(--glass-filter,none)
          }`;
        doc.head.appendChild(st);
      }

      let rafId = null;
      const throttledSync = () => {
        if (rafId) return;
        rafId = raf(() => {
          syncBackground(el);
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

      return { throttledSync, observer, ro };
    });

    el._maskElement = { scope, ...state };
  },


  unmounted(el) {
    const inst = el._maskElement;
    if (!inst) return;

    inst.observer?.disconnect();
    inst.ro?.disconnect();
    inst.scope?.stop();

    el.classList.remove("mask-element");
    [
      "--bg-size",
      "--bg-pos-x",
      "--bg-pos-y",
      "--bg-rotation",
    ].forEach((p) => el.style.removeProperty(p));

    delete el._maskElement;
  },
};
