import { effectScope, ref } from "vue";

export const maskElement = {
  mounted(el, binding) {
    const scope = effectScope();

    const state = scope.run(() => {
      const { sourceElementId } = binding.value || {};

      if (!sourceElementId) {
        console.warn("maskElement directive: sourceElementId is required");
        return {};
      }

      const sourceElement = ref(null);
      let rafId = null;

      // Find source element
      const findSourceElement = () => {
        sourceElement.value = document.getElementById(sourceElementId);
        if (!sourceElement.value) {
          console.warn(
            `maskElement directive: element with id "${sourceElementId}" not found`
          );
        }
      };

      // TODO: make a copy of source element

      // Sync background based on useMaskElement.js logic (lines 68-101)
      const syncBackground = () => {
        if (!sourceElement.value || !el) return;

        // Use motionElement ref if available, otherwise use el

        // Account for page scroll
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        // Get precise element coordinates
        const rect = el.getBoundingClientRect();
        const visualLeft = rect.left + scrollX;
        const visualTop = rect.top + scrollY;

        // Get border width from CSS
        const style = getComputedStyle(el);
        const bw = parseFloat(style.borderWidth) || 0;

        // Get current transform values if any
        const transform = getComputedStyle(el).transform;
        let scale = 1;
        let rotateZ = 0;
        if (transform && transform !== "none") {
          const matrix = transform.match(/matrix.*\((.+)\)/);
          if (matrix) {
            const values = matrix[1].split(", ");
            scale = parseFloat(values[0]) || 1;
            // Calculate rotation from matrix values
            const a = parseFloat(values[0]) || 1;
            const b = parseFloat(values[1]) || 0;
            rotateZ = Math.atan2(b, a) * (180 / Math.PI);
          }
        }

        const w0 = rect.width + 2 * bw;
        const h0 = rect.height + 2 * bw;

        let bgPosX = -(visualLeft / scale) + w0 / 2 - 2 * bw;
        let bgPosY = -(visualTop / scale) + h0 / 2 - 2 * bw;

        // Update CSS custom properties for background positioning
        const bgSize = `${(100 / scale).toFixed(1)}vw auto`;

        el.style.setProperty("--bg-size", bgSize);
        el.style.setProperty("--bg-pos-x", `${bgPosX}px`);
        el.style.setProperty("--bg-pos-y", `${bgPosY}px`);

        // Compensate rotation for pseudo-element (opposite direction)
        const compensatedRotation = -rotateZ;
        el.style.setProperty("--bg-rotation", `${compensatedRotation}deg`);

        // Set background image from source element
        if (sourceElement.value) {
          const sourceStyle = getComputedStyle(sourceElement.value);
          const bgImage = sourceStyle.backgroundImage;
          if (bgImage && bgImage !== "none") {
            el.style.setProperty("--bg-image", bgImage);
          }
        }
      };

      // Throttled sync function
      const throttledSync = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          syncBackground();
          rafId = null;
        });
      };

      // Initialize
      findSourceElement();

      // Add CSS class for pseudoelement
      el.classList.add('mask-element');

      // Create CSS rule for ::before pseudoelement
      if (!document.querySelector('#mask-element-styles')) {
        const style = document.createElement('style');
        style.id = 'mask-element-styles';
        style.textContent = `
          .mask-element {
            position: relative;
          }
          .mask-element::before {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background-image: var(--bg-image);
            background-size: var(--bg-size, 100vw auto);
            background-position: var(--bg-pos-x, 0px) var(--bg-pos-y, 0px);
            background-repeat: no-repeat;
            transform: rotate(var(--bg-rotation, 0deg));
            transform-origin: center;
            pointer-events: none;
            opacity: 1;
            z-index: 1;
            filter: var(--glass-filter, none);
          }
        `;
        document.head.appendChild(style);
      }

      // Initial sync
      setTimeout(syncBackground, 0);

      // Watch for changes
      let observer = null;
      if (el) {
        // Use MutationObserver to watch for style changes on element
        observer = new MutationObserver(throttledSync);
        observer.observe(el, {
          attributes: true,
          attributeFilter: ["style", "class"],
        });
      }

      // Listen for window events
      const handleResize = throttledSync;
      const handleScroll = throttledSync;

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, { passive: true });

      return {
        syncBackground,
        throttledSync,
        handleResize,
        handleScroll,
        findSourceElement,
        observer,
      };
    });

    el._maskElement = {
      scope,
      ...state,
    };
  },

  updated(el, binding) {
    // Placeholder for future updates if needed
  },

  unmounted(el) {
    const instance = el._maskElement;
    if (!instance) return;

    // Remove event listeners
    if (instance.handleResize) {
      window.removeEventListener("resize", instance.handleResize);
    }
    if (instance.handleScroll) {
      window.removeEventListener("scroll", instance.handleScroll);
    }

    // Disconnect observer
    if (instance.observer) {
      instance.observer.disconnect();
    }

    // Stop effect scope
    instance.scope?.stop();

    // Remove CSS class
    el.classList.remove('mask-element');

    // Clean up CSS properties
    el.style.removeProperty("--bg-size");
    el.style.removeProperty("--bg-pos-x");
    el.style.removeProperty("--bg-pos-y");
    el.style.removeProperty("--bg-image");
    el.style.removeProperty("--bg-rotation");

    delete el._maskElement;
  },
};
