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
      paints: [],
      longTasks: [],
      measures: [],
      eventTimings: []
    };

    // Method 1: Manual FPS tracking via requestAnimationFrame
    let lastTime = performance.now();
    let frameCount = 0;
    let frameTimes = []; // Track individual frame times

    function measureFPS() {
      const now = performance.now();
      const delta = now - lastTime;

      frameCount++;
      frameTimes.push(delta);

      if (now >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));

        // Calculate avg frame time for this second
        const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;

        window.performanceMetrics.fps.push({
          timestamp: Date.now(),
          value: fps,
          avgFrameTime: avgFrameTime.toFixed(2),
          frameCount: frameCount
        });

        frameCount = 0;
        frameTimes = [];
        lastTime = now;
      }

      requestAnimationFrame(measureFPS);
    }

    measureFPS();

    // Method 2: Try to use Frame Timing API (if supported)
    try {
      const frameObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'frame') {
            // Frame timing entry
            window.performanceMetrics.frames = window.performanceMetrics.frames || [];
            window.performanceMetrics.frames.push({
              duration: entry.duration,
              startTime: entry.startTime
            });
          }
        }
      });

      frameObserver.observe({ type: 'frame', buffered: true });
    } catch (e) {
      // Frame Timing API not supported
    }

    // Performance observer for paint, layout, long tasks, events
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint') {
          window.performanceMetrics.paints.push({
            name: entry.name,
            startTime: entry.startTime
          });
        } else if (entry.entryType === 'longtask') {
          // Tasks that block the main thread for >50ms
          window.performanceMetrics.longTasks.push({
            duration: entry.duration,
            startTime: entry.startTime
          });
        } else if (entry.entryType === 'measure') {
          window.performanceMetrics.measures.push({
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime
          });
        } else if (entry.entryType === 'event') {
          // Event timing (input delay, processing time)
          window.performanceMetrics.eventTimings.push({
            name: entry.name,
            duration: entry.duration,
            processingStart: entry.processingStart,
            processingEnd: entry.processingEnd,
            startTime: entry.startTime
          });
        }
      }
    });

    // Observe multiple types (some may not be supported in WebKit)
    try {
      observer.observe({ entryTypes: ['paint', 'measure'] });

      // Try to observe longtask and event separately (may not be supported)
      try {
        observer.observe({ type: 'longtask', buffered: true });
      } catch (e) {}

      try {
        observer.observe({ type: 'event', buffered: true });
      } catch (e) {}
    } catch (e) {
      console.warn('Some performance observers not supported:', e);
    }
  });
}

/**
 * Get current performance metrics from page
 */
export async function getPerformanceMetrics(page) {
  return await page.evaluate(() => {
    const metrics = window.performanceMetrics || {
      fps: [],
      layouts: [],
      paints: [],
      longTasks: [],
      measures: [],
      eventTimings: []
    };

    const memory = performance.memory ? {
      usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
      totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576),
      jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
    } : null;

    const currentFPS = metrics.fps[metrics.fps.length - 1]?.value || 0;

    // Calculate long tasks stats
    const longTaskDurations = metrics.longTasks.map(t => t.duration);
    const totalLongTaskTime = longTaskDurations.reduce((a, b) => a + b, 0);

    // Get navigation timing
    const navTiming = performance.timing ? {
      domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
      domInteractive: performance.timing.domInteractive - performance.timing.navigationStart
    } : null;

    // Get latest frame time info
    const latestFPS = metrics.fps[metrics.fps.length - 1];
    const avgFrameTime = latestFPS?.avgFrameTime || 0;

    return {
      fps: currentFPS,
      fpsHistory: metrics.fps,
      avgFrameTime: avgFrameTime,
      memory,
      paintCount: metrics.paints.length,
      longTasks: {
        count: metrics.longTasks.length,
        totalDuration: Math.round(totalLongTaskTime),
        tasks: metrics.longTasks
      },
      eventTimings: metrics.eventTimings,
      navigation: navTiming,
      measures: metrics.measures,
      frames: metrics.frames || []
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
