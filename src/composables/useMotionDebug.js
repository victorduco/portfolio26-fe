import { watch, computed } from 'vue';

/**
 * Composable for debugging Motion events and values
 * Logs scroll position, motion values, transforms, and other Motion-related events
 *
 * @param {Object} options - Debug options
 * @param {string} options.componentName - Name of the component for easier identification in logs
 * @param {boolean} options.enabled - Enable/disable debug logging (default: true)
 * @param {Object} options.scrollProgress - Scroll progress from useScroll
 * @param {Object} options.motionValues - Object of motion values to track
 * @param {number} options.throttle - Throttle logging in ms (default: 100)
 * @returns {Object} Debug utilities
 */
export function useMotionDebug(options = {}) {
  const {
    componentName = 'MotionComponent',
    enabled = true,
    scrollProgress = null,
    motionValues = {},
    throttle = 100,
  } = options;

  if (!enabled) {
    return {
      logEvent: () => {},
      logValue: () => {},
    };
  }

  // Throttle helper
  let lastLogTime = 0;
  const shouldLog = () => {
    const now = Date.now();
    if (now - lastLogTime >= throttle) {
      lastLogTime = now;
      return true;
    }
    return false;
  };

  // Style for console logs
  const styles = {
    component: 'color: #00d4ff; font-weight: bold;',
    event: 'color: #ffd700; font-weight: bold;',
    value: 'color: #7fff00;',
    scroll: 'color: #ff69b4; font-weight: bold;',
    transform: 'color: #ff8c00;',
  };

  // Log events (not throttled)
  const logEvent = (eventName, data = {}) => {
    console.log(
      `%c[${componentName}]%c ${eventName}`,
      styles.component,
      styles.event,
      data
    );
  };

  // Log values (throttled)
  const logValue = (valueName, value) => {
    if (shouldLog()) {
      console.log(
        `%c[${componentName}]%c ${valueName}:`,
        styles.component,
        styles.value,
        value
      );
    }
  };

  // Watch scroll progress if provided
  if (scrollProgress) {
    watch(
      () => {
        // motion-v returns a MotionValue, access via .get() or direct property
        if (typeof scrollProgress.get === 'function') {
          return scrollProgress.get();
        }
        if (typeof scrollProgress.value === 'function') {
          return scrollProgress.value();
        }
        return scrollProgress.value || scrollProgress;
      },
      (newValue) => {
        if (shouldLog() && typeof newValue === 'number') {
          const percentage = (newValue * 100).toFixed(2);
          console.log(
            `%c[${componentName}]%c Scroll Progress:`,
            styles.component,
            styles.scroll,
            `${percentage}% (${newValue.toFixed(4)})`
          );
        }
      },
      { immediate: false }
    );
  }

  // Watch motion values if provided
  if (motionValues && typeof motionValues === 'object') {
    Object.entries(motionValues).forEach(([key, motionValue]) => {
      if (motionValue) {
        watch(
          () => {
            // motion-v MotionValue access
            if (typeof motionValue.get === 'function') {
              return motionValue.get();
            }
            if (typeof motionValue.value === 'function') {
              return motionValue.value();
            }
            if (motionValue.value !== undefined) {
              return motionValue.value;
            }
            return motionValue;
          },
          (newValue) => {
            if (shouldLog() && newValue !== undefined) {
              console.log(
                `%c[${componentName}]%c ${key}:`,
                styles.component,
                styles.transform,
                typeof newValue === 'number' ? newValue.toFixed(4) : newValue
              );
            }
          },
          { immediate: false }
        );
      }
    });
  }

  // Log component mount
  logEvent('🚀 Component Mounted');

  return {
    logEvent,
    logValue,
    styles,
  };
}

/**
 * Helper function to create a detailed scroll info logger
 * Logs scroll position, velocity, and direction
 */
export function createScrollLogger(componentName, scrollInfo) {
  const { scrollProgress, scrollVelocity } = scrollInfo;

  let lastProgress = 0;

  return watch(
    () => {
      // Handle motion-v MotionValue
      if (typeof scrollProgress.get === 'function') {
        return scrollProgress.get();
      }
      if (typeof scrollProgress.value === 'function') {
        return scrollProgress.value();
      }
      return scrollProgress.value || scrollProgress;
    },
    (newProgress) => {
      const direction = newProgress > lastProgress ? '⬇️ Down' : '⬆️ Up';

      // Get velocity value
      let velocity = 0;
      if (scrollVelocity) {
        if (typeof scrollVelocity.get === 'function') {
          velocity = scrollVelocity.get();
        } else if (typeof scrollVelocity.value === 'function') {
          velocity = scrollVelocity.value();
        } else {
          velocity = scrollVelocity.value || 0;
        }
      }

      console.group(`%c[${componentName}] Scroll Event`, 'color: #00d4ff; font-weight: bold;');
      console.log('%cProgress:', 'color: #ff69b4;', `${(newProgress * 100).toFixed(2)}%`);
      console.log('%cDirection:', 'color: #ffd700;', direction);
      console.log('%cVelocity:', 'color: #7fff00;', velocity.toFixed(4));
      console.log('%cRaw Value:', 'color: #ff8c00;', newProgress.toFixed(6));
      console.groupEnd();

      lastProgress = newProgress;
    }
  );
}

/**
 * Helper to log all transform values in a grouped format
 */
export function logTransforms(componentName, transforms = {}) {
  console.group(`%c[${componentName}] Transform Values`, 'color: #00d4ff; font-weight: bold;');

  Object.entries(transforms).forEach(([key, value]) => {
    let displayValue = value;

    // Handle motion-v MotionValue
    if (value && typeof value.get === 'function') {
      displayValue = value.get();
    } else if (value && typeof value.value === 'function') {
      displayValue = value.value();
    } else if (value && value.value !== undefined) {
      displayValue = value.value;
    }

    // Format numbers
    if (typeof displayValue === 'number') {
      displayValue = displayValue.toFixed(4);
    }

    console.log(`%c${key}:`, 'color: #ff8c00;', displayValue);
  });

  console.groupEnd();
}
