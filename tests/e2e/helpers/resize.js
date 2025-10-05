/**
 * Viewport resize utilities
 */

/**
 * Smooth resize animation
 */
export async function smoothResize(page, fromWidth, fromHeight, toWidth, toHeight, steps = 5) {
  const widthStep = (toWidth - fromWidth) / steps;
  const heightStep = (toHeight - fromHeight) / steps;

  for (let i = 0; i <= steps; i++) {
    const currentWidth = Math.round(fromWidth + widthStep * i);
    const currentHeight = Math.round(fromHeight + heightStep * i);

    await page.setViewportSize({ width: currentWidth, height: currentHeight });
  }
}

/**
 * Generate random viewport size
 */
export function randomViewportSize(minWidth = 400, maxWidth = 1920, minHeight = 300, maxHeight = 1200) {
  return {
    width: minWidth + Math.floor(Math.random() * (maxWidth - minWidth)),
    height: minHeight + Math.floor(Math.random() * (maxHeight - minHeight))
  };
}

/**
 * Perform resize with performance tracking
 */
export async function performTrackedResize(page, fromWidth, fromHeight, toWidth, toHeight, steps = 5) {
  const startTime = Date.now();

  await smoothResize(page, fromWidth, fromHeight, toWidth, toHeight, steps);

  const endTime = Date.now();
  const duration = endTime - startTime;

  return {
    from: { width: fromWidth, height: fromHeight },
    to: { width: toWidth, height: toHeight },
    duration,
    timestamp: startTime
  };
}
