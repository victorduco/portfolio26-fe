export const hoverDistortion = {
  mounted(el, binding) {
    // Store state for this element
    const state = {
      isHovered: false,
      mouseOffset: { x: 0, y: 0 }
    };

    const handleMouseMove = (event) => {
      const rect = el.getBoundingClientRect();
      const relativeX = ((event.clientX - rect.left) / rect.width) * 100;
      const relativeY = ((event.clientY - rect.top) / rect.height) * 100;
      state.mouseOffset.x = Math.max(-50, Math.min(50, relativeX - 50));
      state.mouseOffset.y = Math.max(-50, Math.min(50, relativeY - 50));

      if (binding.value && typeof binding.value.onMouseMove === 'function') {
        binding.value.onMouseMove(event, state.mouseOffset);
      }
    };

    const handleEnter = () => {
      state.isHovered = true;
      if (binding.value && typeof binding.value.onEnter === 'function') {
        binding.value.onEnter();
      }
    };

    const handleLeave = () => {
      state.isHovered = false;
      state.mouseOffset.x = 0;
      state.mouseOffset.y = 0;
      if (binding.value && typeof binding.value.onLeave === 'function') {
        binding.value.onLeave();
      }
    };

    // Store handlers and state on element for cleanup
    el._hoverDistortionHandlers = {
      handleEnter,
      handleLeave,
      handleMouseMove
    };
    el._hoverDistortionState = state;

    // Add event listeners
    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);
    el.addEventListener('mousemove', handleMouseMove);
  },

  unmounted(el) {
    // Clean up event listeners
    if (el._hoverDistortionHandlers) {
      const { handleEnter, handleLeave, handleMouseMove } = el._hoverDistortionHandlers;
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
      el.removeEventListener('mousemove', handleMouseMove);

      // Clean up the stored handlers and state
      delete el._hoverDistortionHandlers;
      delete el._hoverDistortionState;
    }
  }
};