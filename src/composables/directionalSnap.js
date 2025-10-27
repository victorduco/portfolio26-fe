/**
 * Directional Snap Behavior
 * Prevents snapping against scroll direction
 */

/**
 * Create directional snap callback
 * @param {Object} lenisInstance - Lenis instance
 * @param {Object} snapInstance - Snap instance to control
 * @param {Object} scrollState - Object to track scroll state
 * @returns {Function} onSnapStart callback
 */
export function createDirectionalSnapCallback(lenisInstance, snapInstance, scrollState) {
  return (snap) => {
    const currentPosition = lenisInstance.scroll;
    const scrollDirection = scrollState.direction;

    // Extract target position - Lenis passes {index, value} object
    const targetPosition = snap?.value ?? snap;

    // If snapping backwards against scroll direction, prevent it
    const shouldBlock =
      (scrollDirection > 0 && targetPosition < currentPosition) ||
      (scrollDirection < 0 && targetPosition > currentPosition);

    if (shouldBlock) {
      console.log('🚫 Blocking snap:', {
        direction: scrollDirection > 0 ? 'down' : 'up',
        current: Math.round(currentPosition),
        target: Math.round(targetPosition)
      });

      // Stop snap temporarily and let natural scroll continue
      snapInstance.stop();
      setTimeout(() => {
        snapInstance.start();
      }, 100);

      return false;
    }

    // Allow snap in scroll direction
    console.log('✅ Allowing snap:', {
      direction: scrollDirection > 0 ? 'down' : 'up',
      from: Math.round(currentPosition),
      to: Math.round(targetPosition)
    });
    return true;
  };
}

/**
 * Setup scroll direction tracking
 * @param {Object} lenisInstance - Lenis instance
 * @returns {Object} Scroll state object with direction tracking
 */
export function setupScrollDirectionTracking(lenisInstance) {
  const scrollState = {
    lastPosition: 0,
    direction: 0, // 1 = down, -1 = up
  };

  lenisInstance.on("scroll", (e) => {
    // Update scroll direction
    if (e.scroll > scrollState.lastPosition) {
      scrollState.direction = 1; // scrolling down
    } else if (e.scroll < scrollState.lastPosition) {
      scrollState.direction = -1; // scrolling up
    }
    scrollState.lastPosition = e.scroll;
  });

  return scrollState;
}
