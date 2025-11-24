import { computed, effectScope, reactive, ref, watch } from "vue";

const CFG = {
  clampX: 0.2, clampY: 0.2, curve: 0.5, divX: 120, divY: 160,
  trans: 0.35, lightX: 0.35, lightY: 0.22, rot: 1.2,
  parallaxX: -5.7, parallaxY: -24.9,
};

const CSS_PROPS = [
  "--distortion-transform", "--distortion-hovered", "--distortion-light-x",
  "--distortion-light-y", "--distortion-outline-rotation",
  "--distortion-background-position", "transform", "transition", "transform-origin",
];

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const isTouch = () => "ontouchstart" in window || navigator.maxTouchPoints > 0;

const parseOpts = (v) => v == null ? {} : typeof v === "number"
  ? { curvature: v }
  : { curvature: v.curvature ?? v.surfaceCurvature, parallaxIntensity: v.parallaxIntensity };

export const hoverDistortion = {
  mounted(el, binding) {
    if (binding.value === null || binding.value === false || isTouch()) return;

    const scope = effectScope();
    const state = scope.run(() => {
      const opts = parseOpts(binding.value);
      const curvature = ref(opts.curvature ?? 1.8);
      const parallax = ref(opts.parallaxIntensity ?? 0.35);
      const mouse = reactive({ x: 0, y: 0 });
      const hovered = ref(false);

      let rect = null, rafId = null, pending = false, throttled = false;

      const base = window.getComputedStyle(el).transform;
      const baseTransform = base !== "none" ? base : "";

      const transform = computed(() => {
        const c = curvature.value * CFG.curve;
        const lx = clamp(mouse.x / CFG.divX, -CFG.clampX, CFG.clampX);
        const ly = clamp(mouse.y / CFG.divY, -CFG.clampY, CFG.clampY);
        const t = `scaleX(${(1 + Math.abs(lx) * c).toFixed(3)}) scaleY(${(1 + Math.abs(ly) * c).toFixed(3)}) translate(${(mouse.x * CFG.trans).toFixed(2)}px, ${(mouse.y * CFG.trans).toFixed(2)}px)`;
        return baseTransform ? `${baseTransform} ${t}` : t;
      });

      watch(transform, (v) => requestAnimationFrame(() => {
        el.style.setProperty("--distortion-transform", v);
        el.style.transform = v;
      }), { flush: "sync" });

      watch(hovered, (v) => el.style.setProperty("--distortion-hovered", v ? "1" : "0"), { immediate: true });

      const updateVars = () => {
        const r = rect || el.getBoundingClientRect();
        const lx = (mouse.x * CFG.lightX).toFixed(2);
        const ly = (mouse.y * CFG.lightY).toFixed(2);
        const rot = (mouse.x * CFG.rot).toFixed(2);
        const w = window.innerWidth || r.width;
        const h = window.innerHeight || r.height;
        const px = clamp(((r.left + r.width / 2) / w) * 100 + CFG.parallaxX - mouse.x * parallax.value, 0, 100);
        const py = clamp(((r.top + r.height / 2) / h) * 100 + CFG.parallaxY - mouse.y * parallax.value, 0, 100);
        Object.assign(el.style, {
          "--distortion-light-x": `${lx}%`, "--distortion-light-y": `${ly}%`,
          "--distortion-outline-rotation": `${rot}deg`,
          "--distortion-background-position": `${px.toFixed(2)}% ${py.toFixed(2)}%`,
        });
      };

      watch([() => mouse.x, () => mouse.y, parallax], () => {
        if (pending) return;
        pending = true;
        rafId = requestAnimationFrame(() => { updateVars(); pending = false; });
      }, { immediate: true });

      const onMove = (e) => {
        if (!hovered.value || throttled) return;
        throttled = true;
        requestAnimationFrame(() => {
          if (!hovered.value) { throttled = false; return; }
          const r = rect || el.getBoundingClientRect();
          mouse.x = clamp(((e.clientX - r.left) / r.width) * 100 - 50, -50, 50);
          mouse.y = clamp(((e.clientY - r.top) / r.height) * 100 - 50, -50, 50);
          throttled = false;
        });
      };

      const onEnter = (e) => { hovered.value = true; rect = el.getBoundingClientRect(); e && onMove(e); };
      const onLeave = () => {
        hovered.value = false;
        rafId && (cancelAnimationFrame(rafId), rafId = null, pending = false);
        mouse.x = mouse.y = 0;
        el.style.removeProperty("--distortion-background-position");
      };

      const updateOpts = (v) => {
        const o = parseOpts(v);
        o.curvature != null && (curvature.value = o.curvature);
        o.parallaxIntensity != null && (parallax.value = o.parallaxIntensity);
      };

      updateOpts(binding.value);
      return { onMove, onEnter, onLeave, updateOpts, updateRect: () => (rect = el.getBoundingClientRect()) };
    });

    el.addEventListener("mouseenter", state.onEnter);
    el.addEventListener("mouseleave", state.onLeave);
    el.addEventListener("mousemove", state.onMove);
    const onResize = () => state.updateRect();
    window.addEventListener("resize", onResize);

    el.style.transition = "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1)";
    el.style.transformOrigin = "center center";
    el._hoverDistortion = { scope, onResize, ...state };
  },

  updated(el, binding) {
    if (isTouch()) return;
    if (binding.value === null || binding.value === false) {
      el._hoverDistortion && hoverDistortion.unmounted(el);
      return;
    }
    if (!el._hoverDistortion && (binding.oldValue === null || binding.oldValue === false)) {
      hoverDistortion.mounted(el, binding);
      return;
    }
    el._hoverDistortion?.updateOpts?.(binding.value);
  },

  unmounted(el) {
    const i = el._hoverDistortion;
    if (!i) return;
    el.removeEventListener("mouseenter", i.onEnter);
    el.removeEventListener("mouseleave", i.onLeave);
    el.removeEventListener("mousemove", i.onMove);
    window.removeEventListener("resize", i.onResize);
    i.scope.stop();
    CSS_PROPS.forEach((p) => el.style.removeProperty(p));
    delete el._hoverDistortion;
  },
};
