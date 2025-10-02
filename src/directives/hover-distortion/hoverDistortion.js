import { computed, effectScope, reactive, ref, watch } from "vue";

// Animation constants
const CLAMP_LIMIT_X = 0.2;
const CLAMP_LIMIT_Y = 0.2;
const CURVATURE_MULTIPLIER = 0.5;
const TRANSFORM_DIVISOR_X = 120;
const TRANSFORM_DIVISOR_Y = 160;
const TRANSLATE_MULTIPLIER = 0.35;
const LIGHT_X_MULTIPLIER = 0.35;
const LIGHT_Y_MULTIPLIER = 0.22;
const ROTATION_MULTIPLIER = 1.2;
const PARALLAX_OFFSET_X = -5.7;
const PARALLAX_OFFSET_Y = -24.9;

const resolveDirectiveOptions = (value) => {
  if (value == null) {
    return {};
  }

  if (typeof value === "number") {
    return { curvature: value };
  }

  const options = {};

  if (typeof value.curvature === "number") {
    options.curvature = value.curvature;
  } else if (typeof value.surfaceCurvature === "number") {
    options.curvature = value.surfaceCurvature;
  }

  if (typeof value.parallaxIntensity === "number") {
    options.parallaxIntensity = value.parallaxIntensity;
  }

  return options;
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

      // Performance optimizations - cache rect and batch DOM operations
      let cachedRect = null;
      let rafId = null;
      let transformRafId = null;
      let pendingUpdate = false;

      // Save the initial transform to preserve it
      const initialTransform = window.getComputedStyle(el).transform;
      const baseTransform = initialTransform !== 'none' ? initialTransform : '';

      const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

      const cardTransform = computed(() => {
        const curvature = surfaceCurvature.value * CURVATURE_MULTIPLIER;
        const limitedX = clamp(
          mouseOffset.x / TRANSFORM_DIVISOR_X,
          -CLAMP_LIMIT_X,
          CLAMP_LIMIT_X
        );
        const limitedY = clamp(
          mouseOffset.y / TRANSFORM_DIVISOR_Y,
          -CLAMP_LIMIT_Y,
          CLAMP_LIMIT_Y
        );
        const scaleX = 1 + Math.abs(limitedX) * curvature;
        const scaleY = 1 + Math.abs(limitedY) * curvature;
        const translateX = mouseOffset.x * TRANSLATE_MULTIPLIER;
        const translateY = mouseOffset.y * TRANSLATE_MULTIPLIER;

        const distortionTransform = `scaleX(${scaleX.toFixed(3)}) scaleY(${scaleY.toFixed(
          3
        )}) translate(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px)`;

        // Combine base transform with distortion
        return baseTransform ? `${baseTransform} ${distortionTransform}` : distortionTransform;
      });

      const updateTransform = (value) => {
        // Debounce transform updates to avoid conflicts with CSS transitions
        if (transformRafId) {
          cancelAnimationFrame(transformRafId);
        }
        transformRafId = requestAnimationFrame(() => {
          el.style.setProperty("--distortion-transform", value);
          el.style.transform = value;
          transformRafId = null;
        });
      };

      // Watch with sync flush to ensure immediate updates on value changes
      watch(cardTransform, updateTransform, { flush: 'sync' });

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
        // Use cached rect if available, otherwise get fresh one
        const rect = cachedRect || el.getBoundingClientRect();

        if (typeof window === "undefined") {
          return;
        }

        // Batch all style updates together
        const lightX = (mouseOffset.x * LIGHT_X_MULTIPLIER).toFixed(2);
        const lightY = (mouseOffset.y * LIGHT_Y_MULTIPLIER).toFixed(2);
        const rotation = (mouseOffset.x * ROTATION_MULTIPLIER).toFixed(2);

        const winW = window.innerWidth || rect.width;
        const winH = window.innerHeight || rect.height;
        const baseX = ((rect.left + rect.width / 2) / winW) * 100;
        const baseY = ((rect.top + rect.height / 2) / winH) * 100;

        const parallaxX = clamp(
          baseX + PARALLAX_OFFSET_X - mouseOffset.x * parallaxIntensity.value,
          0,
          100
        );
        const parallaxY = clamp(
          baseY + PARALLAX_OFFSET_Y - mouseOffset.y * parallaxIntensity.value,
          0,
          100
        );

        // Batch all DOM writes together to avoid multiple reflows
        el.style.setProperty("--distortion-light-x", `${lightX}%`);
        el.style.setProperty("--distortion-light-y", `${lightY}%`);
        el.style.setProperty("--distortion-outline-rotation", `${rotation}deg`);
        el.style.setProperty(
          "--distortion-background-position",
          `${parallaxX.toFixed(2)}% ${parallaxY.toFixed(2)}%`
        );
      };

      watch(
        [() => mouseOffset.x, () => mouseOffset.y, parallaxIntensity],
        scheduleUpdate,
        { immediate: true }
      );

      const updateOptions = (value) => {
        const next = resolveDirectiveOptions(value);
        if (typeof next.curvature === "number") {
          surfaceCurvature.value = next.curvature;
        }
        if (typeof next.parallaxIntensity === "number") {
          parallaxIntensity.value = next.parallaxIntensity;
        }
      };

      let mouseMoveThrottled = false;

      const handleMouseMove = (event) => {
        // Ignore mousemove if not hovered (prevents race conditions on leave)
        if (!isHovered.value) {
          return;
        }

        // Throttle mousemove for better performance
        if (mouseMoveThrottled) return;
        mouseMoveThrottled = true;

        requestAnimationFrame(() => {
          // Double-check still hovered after RAF delay
          if (!isHovered.value) {
            mouseMoveThrottled = false;
            return;
          }

          // Use cached rect to avoid getBoundingClientRect on every mousemove
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
        // Cache rect on first hover for performance
        updateCachedRect();
        if (event != null) {
          handleMouseMove(event);
        }
      };

      const handleLeave = () => {
        isHovered.value = false;
        // Cancel any pending pointer variable updates
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
          pendingUpdate = false;
        }

        // Reset offsets FIRST - this will trigger sync watch
        mouseOffset.x = 0;
        mouseOffset.y = 0;

        // DON'T cancel transformRafId here - let it complete with the reset values
        // The sync watch above will schedule a new transform update

        // Clean up background position
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

    // Update cached rect on window resize
    const handleResize = () => state.updateCachedRect();
    window.addEventListener("resize", handleResize);

    // Add smooth transition with spring-like easing
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
    const instance = el._hoverDistortion;
    if (instance && typeof instance.updateOptions === "function") {
      instance.updateOptions(binding.value);
    }
  },

  unmounted(el) {
    const instance = el._hoverDistortion;
    if (!instance) return;

    el.removeEventListener("mouseenter", instance.handleEnter);
    el.removeEventListener("mouseleave", instance.handleLeave);
    el.removeEventListener("mousemove", instance.handleMouseMove);
    window.removeEventListener("resize", instance.handleResize);

    instance.scope.stop();

    el.style.removeProperty("--distortion-transform");
    el.style.removeProperty("--distortion-hovered");
    el.style.removeProperty("--distortion-light-x");
    el.style.removeProperty("--distortion-light-y");
    el.style.removeProperty("--distortion-outline-rotation");
    el.style.removeProperty("--distortion-background-position");
    el.style.removeProperty("transform");
    el.style.removeProperty("transition");
    el.style.removeProperty("transform-origin");

    delete el._hoverDistortion;
  },
};
