import { computed, effectScope, reactive, ref, watch } from "vue";

const CONFIG = {
  clampLimitX: 0.2,
  clampLimitY: 0.2,
  curvatureMultiplier: 0.5,
  transformDivisorX: 120,
  transformDivisorY: 160,
  translateMultiplier: 0.35,
  lightXMultiplier: 0.35,
  lightYMultiplier: 0.22,
  rotationMultiplier: 1.2,
  parallaxOffsetX: -5.7,
  parallaxOffsetY: -24.9,
};

const resolveDirectiveOptions = (value) => {
  if (value == null) return {};
  if (typeof value === "number") return { curvature: value };
  return {
    curvature: value.curvature ?? value.surfaceCurvature,
    parallaxIntensity: value.parallaxIntensity,
  };
};

const updateCSSProperties = (el, props) => {
  Object.entries(props).forEach(([key, val]) => {
    el.style.setProperty(key, val);
  });
};

export const hoverDistortion = {
  mounted(el, binding) {
    const scope = effectScope();

    const state = scope.run(() => {
      const options = resolveDirectiveOptions(binding.value);
      const surfaceCurvature = ref(options.curvature ?? 1.8);
      const parallaxIntensity = ref(options.parallaxIntensity ?? 0.35);
      const mouseOffset = reactive({ x: 0, y: 0 });
      const isHovered = ref(false);

      let cachedRect = null;
      let rafId = null;
      let transformRafId = null;
      let pendingUpdate = false;

      const initialTransform = window.getComputedStyle(el).transform;
      const baseTransform = initialTransform !== "none" ? initialTransform : "";

      const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

      const cardTransform = computed(() => {
        const curvature = surfaceCurvature.value * CONFIG.curvatureMultiplier;
        const limitedX = clamp(
          mouseOffset.x / CONFIG.transformDivisorX,
          -CONFIG.clampLimitX,
          CONFIG.clampLimitX
        );
        const limitedY = clamp(
          mouseOffset.y / CONFIG.transformDivisorY,
          -CONFIG.clampLimitY,
          CONFIG.clampLimitY
        );
        const scaleX = 1 + Math.abs(limitedX) * curvature;
        const scaleY = 1 + Math.abs(limitedY) * curvature;
        const translateX = mouseOffset.x * CONFIG.translateMultiplier;
        const translateY = mouseOffset.y * CONFIG.translateMultiplier;

        const distortionTransform = `scaleX(${scaleX.toFixed(
          3
        )}) scaleY(${scaleY.toFixed(3)}) translate(${translateX.toFixed(
          2
        )}px, ${translateY.toFixed(2)}px)`;

        return baseTransform
          ? `${baseTransform} ${distortionTransform}`
          : distortionTransform;
      });

      const updateTransform = (value) => {
        if (transformRafId) cancelAnimationFrame(transformRafId);
        transformRafId = requestAnimationFrame(() => {
          updateCSSProperties(el, {
            "--distortion-transform": value,
            transform: value,
          });
          transformRafId = null;
        });
      };

      watch(cardTransform, updateTransform, { flush: "sync" });

      watch(
        isHovered,
        (value) => {
          el.style.setProperty("--distortion-hovered", value ? "1" : "0");
        },
        { immediate: true }
      );

      const updateCachedRect = () => {
        cachedRect = el.getBoundingClientRect();
      };

      const scheduleUpdate = () => {
        if (pendingUpdate) return;
        pendingUpdate = true;

        rafId = requestAnimationFrame(() => {
          updatePointerVariables();
          pendingUpdate = false;
        });
      };

      const updatePointerVariables = () => {
        const rect = cachedRect || el.getBoundingClientRect();
        if (typeof window === "undefined") return;

        const lightX = (mouseOffset.x * CONFIG.lightXMultiplier).toFixed(2);
        const lightY = (mouseOffset.y * CONFIG.lightYMultiplier).toFixed(2);
        const rotation = (mouseOffset.x * CONFIG.rotationMultiplier).toFixed(2);

        const winW = window.innerWidth || rect.width;
        const winH = window.innerHeight || rect.height;
        const baseX = ((rect.left + rect.width / 2) / winW) * 100;
        const baseY = ((rect.top + rect.height / 2) / winH) * 100;

        const parallaxX = clamp(
          baseX + CONFIG.parallaxOffsetX - mouseOffset.x * parallaxIntensity.value,
          0,
          100
        );
        const parallaxY = clamp(
          baseY + CONFIG.parallaxOffsetY - mouseOffset.y * parallaxIntensity.value,
          0,
          100
        );

        updateCSSProperties(el, {
          "--distortion-light-x": `${lightX}%`,
          "--distortion-light-y": `${lightY}%`,
          "--distortion-outline-rotation": `${rotation}deg`,
          "--distortion-background-position": `${parallaxX.toFixed(2)}% ${parallaxY.toFixed(2)}%`,
        });
      };

      watch(
        [() => mouseOffset.x, () => mouseOffset.y, parallaxIntensity],
        scheduleUpdate,
        { immediate: true }
      );

      const updateOptions = (value) => {
        const next = resolveDirectiveOptions(value);
        if (next.curvature != null) surfaceCurvature.value = next.curvature;
        if (next.parallaxIntensity != null) parallaxIntensity.value = next.parallaxIntensity;
      };

      let mouseMoveThrottled = false;

      const handleMouseMove = (event) => {
        if (!isHovered.value || mouseMoveThrottled) return;
        mouseMoveThrottled = true;

        requestAnimationFrame(() => {
          if (!isHovered.value) {
            mouseMoveThrottled = false;
            return;
          }

          const rect = cachedRect || el.getBoundingClientRect();
          const relativeX = ((event.clientX - rect.left) / rect.width) * 100;
          const relativeY = ((event.clientY - rect.top) / rect.height) * 100;

          mouseOffset.x = clamp(relativeX - 50, -50, 50);
          mouseOffset.y = clamp(relativeY - 50, -50, 50);

          mouseMoveThrottled = false;
        });
      };

      const handleEnter = (event) => {
        isHovered.value = true;
        updateCachedRect();
        if (event != null) handleMouseMove(event);
      };

      const handleLeave = () => {
        isHovered.value = false;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
          pendingUpdate = false;
        }

        mouseOffset.x = 0;
        mouseOffset.y = 0;

        el.style.removeProperty("--distortion-background-position");
      };

      updateOptions(binding.value);

      return {
        handleMouseMove,
        handleEnter,
        handleLeave,
        updateOptions,
        updateCachedRect,
      };
    });

    el.addEventListener("mouseenter", state.handleEnter);
    el.addEventListener("mouseleave", state.handleLeave);
    el.addEventListener("mousemove", state.handleMouseMove);

    const handleResize = () => state.updateCachedRect();
    window.addEventListener("resize", handleResize);

    el.style.transition =
      "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1)";
    el.style.transformOrigin = "center center";

    el._hoverDistortion = {
      scope,
      handleResize,
      ...state,
    };
  },

  updated(el, binding) {
    el._hoverDistortion?.updateOptions?.(binding.value);
  },

  unmounted(el) {
    const instance = el._hoverDistortion;
    if (!instance) return;

    el.removeEventListener("mouseenter", instance.handleEnter);
    el.removeEventListener("mouseleave", instance.handleLeave);
    el.removeEventListener("mousemove", instance.handleMouseMove);
    window.removeEventListener("resize", instance.handleResize);

    instance.scope.stop();

    const props = [
      "--distortion-transform",
      "--distortion-hovered",
      "--distortion-light-x",
      "--distortion-light-y",
      "--distortion-outline-rotation",
      "--distortion-background-position",
      "transform",
      "transition",
      "transform-origin",
    ];
    props.forEach((prop) => el.style.removeProperty(prop));

    delete el._hoverDistortion;
  },
};
