/**
 * Performance monitoring utilities
 */

/**
 * Inject FPS tracking into page
 */
export async function setupPerformanceTracking(page) {
  await page.evaluate(() => {
    window.performanceMetrics = {
      fps: [],
      layouts: [],
      paints: []
    };

    let lastTime = performance.now();
    let frameCount = 0;

    function measureFPS() {
      const now = performance.now();
      frameCount++;

      if (now >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        window.performanceMetrics.fps.push({
          timestamp: Date.now(),
          value: fps
        });
        frameCount = 0;
        lastTime = now;
      }

      requestAnimationFrame(measureFPS);
    }

    measureFPS();

    // Performance observer for layout/paint
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint') {
          window.performanceMetrics.paints.push({
            name: entry.name,
            startTime: entry.startTime
          });
        }
      }
    });

    observer.observe({ entryTypes: ['paint'] });
  });
}

/**
 * Get current performance metrics from page
 */
export async function getPerformanceMetrics(page) {
  return await page.evaluate(() => {
    const metrics = window.performanceMetrics || { fps: [], layouts: [], paints: [] };

    const memory = performance.memory ? {
      usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
      totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576),
      jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
    } : null;

    const currentFPS = metrics.fps[metrics.fps.length - 1]?.value || 0;

    return {
      fps: currentFPS,
      fpsHistory: metrics.fps,
      memory,
      paintCount: metrics.paints.length
    };
  });
}

/**
 * Calculate statistics from metrics array
 */
export function calculateStats(metrics) {
  if (!metrics || metrics.length === 0) {
    return {
      avg: 0,
      min: 0,
      max: 0,
      median: 0
    };
  }

  const values = metrics.map(m => m.fps || m.duration || m).filter(v => v > 0);

  if (values.length === 0) {
    return { avg: 0, min: 0, max: 0, median: 0 };
  }

  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  return {
    avg: Number(avg.toFixed(2)),
    min,
    max,
    median
  };
}
