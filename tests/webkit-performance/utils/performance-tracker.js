export async function setupPerformanceTracking(page) {
  await page.addInitScript(() => {
    const metrics = {
      longTasks: [],
      eventTimings: [],
      rafGaps: [],
      logs: [],
      paintTimings: [],
      layoutShifts: [],
    };

    Object.defineProperty(window, "__perfMetrics", {
      value: metrics,
      configurable: false,
      enumerable: false,
      writable: false,
    });

    if (typeof PerformanceObserver === "undefined") {
      metrics.logs.push("PerformanceObserver not supported");
      return;
    }

    // Long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          metrics.longTasks.push({
            name: entry.name,
            entryType: entry.entryType,
            startTime: entry.startTime,
            duration: entry.duration,
            attribution:
              Array.isArray(entry.attribution) && entry.attribution.length
                ? entry.attribution.map((attr) => ({
                    name: attr.name,
                    entryType: attr.entryType,
                    startTime: attr.startTime,
                    duration: attr.duration,
                    containerType: attr.containerType || null,
                    containerId: attr.containerId || null,
                    containerName: attr.containerName || null,
                    containerSrc: attr.containerSrc || null,
                  }))
                : [],
          });
        }
      });
      longTaskObserver.observe({ type: "longtask", buffered: true });
    } catch (error) {
      metrics.logs.push(`LongTask observer failed: ${error.message}`);
    }

    // Event timings
    try {
      const eventObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          metrics.eventTimings.push({
            name: entry.name,
            entryType: entry.entryType,
            startTime: entry.startTime,
            duration: entry.duration,
            processingStart: entry.processingStart || null,
            processingEnd: entry.processingEnd || null,
            target: entry.target?.tagName || null,
            interactionId: entry.interactionId || null,
          });
        }
      });
      eventObserver.observe({ type: "event", buffered: true });
    } catch (error) {
      metrics.logs.push(`Event observer failed: ${error.message}`);
    }

    // Paint timings
    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          metrics.paintTimings.push({
            name: entry.name,
            startTime: entry.startTime,
          });
        }
      });
      paintObserver.observe({ type: "paint", buffered: true });
    } catch (error) {
      metrics.logs.push(`Paint observer failed: ${error.message}`);
    }

    // Layout shifts
    try {
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.hadRecentInput) return;
          metrics.layoutShifts.push({
            value: entry.value,
            startTime: entry.startTime,
            hadRecentInput: entry.hadRecentInput,
          });
        }
      });
      layoutShiftObserver.observe({ type: "layout-shift", buffered: true });
    } catch (error) {
      metrics.logs.push(`Layout-shift observer failed: ${error.message}`);
    }

    // RAF gaps
    let lastTime = performance.now();
    const loop = (time) => {
      const gap = time - lastTime;
      if (gap > 34) {
        metrics.rafGaps.push({ gap, timestamp: time });
      }
      lastTime = time;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    metrics.markInteraction = (label) => {
      metrics.logs.push(`marker:${label}:${performance.now().toFixed(2)}ms`);
    };

    metrics.logs.push("Performance tracking initialized");
  });
}

