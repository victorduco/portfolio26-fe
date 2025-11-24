/**
 * Composable for managing keypad background CSS variables and animations
 * Consolidates repeated DOM manipulation patterns for Safari compatibility
 */

/**
 * Triggers browser reflow (Safari rendering fix)
 */
export const forceReflow = () => void document.documentElement.offsetHeight;

/**
 * Executes callback after two animation frames (Safari rendering fix)
 */
export const doubleRAF = (callback) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
};

/**
 * Sets background image and mask to a specific path
 */
export const setBackgroundImage = (path) => {
  const root = document.documentElement;
  root.style.setProperty("--global-keypad-bg", `url("${path}")`);
  root.style.setProperty("--global-keypad-mask", `url("${path}")`);
};

/**
 * Clears background image and mask (sets to empty string)
 */
export const clearBackgroundImage = () => {
  const root = document.documentElement;
  root.style.setProperty("--global-keypad-bg", "");
  root.style.setProperty("--global-keypad-mask", "");
};

/**
 * Sets background to "none" (for resize)
 */
export const hideBackgroundImage = () => {
  const root = document.documentElement;
  root.style.setProperty("--global-keypad-bg", "none");
  root.style.setProperty("--global-keypad-mask", "none");
};

/**
 * Hides background with glass filter effect and cleanup
 * Used in clear and watch handlers
 */
export const hideBackgroundWithGlassEffect = () => {
  const root = document.documentElement;

  // Disable glass filter
  root.style.setProperty("--glass-filter", "none");
  forceReflow();

  // Clear background
  clearBackgroundImage();
  root.classList.add("keypad-no-bg");
  forceReflow();

  // Re-enable glass filter after render
  doubleRAF(() => {
    root.style.removeProperty("--glass-filter");
  });
};

/**
 * Shows background with glass filter effect
 * Used in resize handler
 */
export const showBackgroundWithGlassEffect = (path) => {
  const root = document.documentElement;

  // Disable glass filter
  root.style.setProperty("--glass-filter", "none");
  forceReflow();

  // Clear first
  clearBackgroundImage();
  forceReflow();

  // Set new background after render
  doubleRAF(() => {
    setBackgroundImage(path);
    forceReflow();

    // Re-enable glass filter
    requestAnimationFrame(() => {
      root.style.removeProperty("--glass-filter");
    });
  });
};
