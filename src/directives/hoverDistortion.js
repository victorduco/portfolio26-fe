import { computed, effectScope, reactive, ref, watch } from "vue";

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

      const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

      const cardTransform = computed(() => {
        const curvature = surfaceCurvature.value * 0.5;
        const limitedX = clamp(mouseOffset.x / 120, -0.2, 0.2);
        const limitedY = clamp(mouseOffset.y / 160, -0.2, 0.2);
        const scaleX = 1 + limitedX * curvature;
        const scaleY = 1 + limitedY * curvature;
        const translateX = mouseOffset.x * 0.35;
        const translateY = mouseOffset.y * 0.35;

        return `scaleX(${scaleX.toFixed(3)}) scaleY(${scaleY.toFixed(
          3
        )}) translate(${translateX.toFixed(2)}px, ${translateY.toFixed(
          2
        )}px)`;
      });

      const updateTransform = (value) => {
        el.style.setProperty("--distortion-transform", value);
        el.style.transform = value;
      };

      watch(cardTransform, updateTransform, { immediate: true });

      watch(
        isHovered,
        (value) => {
          el.style.setProperty("--distortion-hovered", value ? "1" : "0");
        },
        { immediate: true }
      );

      const updatePointerVariables = () => {
        el.style.setProperty(
          "--distortion-light-x",
          `${(mouseOffset.x * 0.35).toFixed(2)}%`
        );
        el.style.setProperty(
          "--distortion-light-y",
          `${(mouseOffset.y * 0.22).toFixed(2)}%`
        );
        el.style.setProperty(
          "--distortion-outline-rotation",
          `${(mouseOffset.x * 1.2).toFixed(2)}deg`
        );

        if (typeof window === "undefined") {
          return;
        }

        const rect = el.getBoundingClientRect();
        const winW = window.innerWidth || rect.width;
        const winH = window.innerHeight || rect.height;
        const baseX = ((rect.left + rect.width / 2) / winW) * 100;
        const baseY = ((rect.top + rect.height / 2) / winH) * 100;
        const dx = -5.7;
        const dy = -24.9;

        const parallaxX = clamp(
          baseX + dx - mouseOffset.x * parallaxIntensity.value,
          0,
          100
        );
        const parallaxY = clamp(
          baseY + dy - mouseOffset.y * parallaxIntensity.value,
          0,
          100
        );

        el.style.setProperty(
          "--distortion-background-position",
          `${parallaxX.toFixed(2)}% ${parallaxY.toFixed(2)}%`
        );
      };

      watch(
        [() => mouseOffset.x, () => mouseOffset.y, parallaxIntensity],
        updatePointerVariables,
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

      const handleMouseMove = (event) => {
        const rect = el.getBoundingClientRect();
        const relativeX = ((event.clientX - rect.left) / rect.width) * 100;
        const relativeY = ((event.clientY - rect.top) / rect.height) * 100;

        mouseOffset.x = clamp(relativeX - 50, -50, 50);
        mouseOffset.y = clamp(relativeY - 50, -50, 50);
      };

      const handleEnter = (event) => {
        isHovered.value = true;
        if (event != null) {
          handleMouseMove(event);
        }
      };

      const handleLeave = () => {
        isHovered.value = false;
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
      };
    });

    el.addEventListener("mouseenter", state.handleEnter);
    el.addEventListener("mouseleave", state.handleLeave);
    el.addEventListener("mousemove", state.handleMouseMove);

    el.style.transition = "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)";
    el.style.transformOrigin = "center center";

    el._hoverDistortion = {
      scope,
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
