export async function setupDetailedProfiling(page) {
  await page.addInitScript(() => {
    const detailedMetrics = {
      cpuProfiles: [],
      memorySnapshots: [],
      renderOperations: [],
      networkActivity: [],
      domMutations: [],
      styleRecalculations: [],
      layoutOperations: [],
    };

    Object.defineProperty(window, "__detailedMetrics", {
      value: detailedMetrics,
      configurable: false,
      enumerable: false,
      writable: false,
    });

    // Track rendering operations
    let lastFrameTime = performance.now();
    let frameCount = 0;

    function trackFrame(timestamp) {
      const frameDuration = timestamp - lastFrameTime;

      if (frameDuration > 16.7) {
        detailedMetrics.renderOperations.push({
          type: "dropped-frame",
          timestamp,
          duration: frameDuration,
          frameCount,
        });
      }

      lastFrameTime = timestamp;
      frameCount++;
      requestAnimationFrame(trackFrame);
    }
    requestAnimationFrame(trackFrame);

    // Track DOM mutations
    const mutationObserver = new MutationObserver((mutations) => {
      const timestamp = performance.now();
      detailedMetrics.domMutations.push({
        timestamp,
        count: mutations.length,
        types: mutations.map((m) => m.type),
        addedNodes: mutations.reduce((sum, m) => sum + m.addedNodes.length, 0),
        removedNodes: mutations.reduce(
          (sum, m) => sum + m.removedNodes.length,
          0
        ),
      });
    });

    mutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
    });

    // Track Resource Timing
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        detailedMetrics.networkActivity.push({
          name: entry.name,
          type: entry.initiatorType,
          startTime: entry.startTime,
          duration: entry.duration,
          transferSize: entry.transferSize || 0,
          encodedBodySize: entry.encodedBodySize || 0,
          decodedBodySize: entry.decodedBodySize || 0,
        });
      }
    });

    try {
      resourceObserver.observe({ type: "resource", buffered: true });
    } catch (e) {
      console.warn("Resource observer failed:", e);
    }

    // Memory tracking
    window.__detailedMetrics.takeMemorySnapshot = (label) => {
      if (performance.memory) {
        detailedMetrics.memorySnapshots.push({
          label,
          timestamp: performance.now(),
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        });
      }
    };

    // CPU profiling markers
    window.__detailedMetrics.markCPUOperation = (operation, duration) => {
      detailedMetrics.cpuProfiles.push({
        operation,
        timestamp: performance.now(),
        duration,
      });
    };

    console.log("Detailed profiling initialized");
  });
}

export function analyzeDetailedMetrics(metrics, detailedMetrics) {
  const analysis = {
    rendering: analyzeRendering(detailedMetrics),
    dom: analyzeDOMMutations(detailedMetrics),
    memory: analyzeMemoryUsage(detailedMetrics),
    network: analyzeNetworkActivity(detailedMetrics),
    bottlenecks: identifyBottlenecks(metrics, detailedMetrics),
    recommendations: [],
  };

  analysis.recommendations = generateRecommendations(analysis);
  analysis.detailedReport = generateDetailedReport(
    analysis,
    metrics,
    detailedMetrics
  );

  return analysis;
}

function analyzeRendering(detailedMetrics) {
  const droppedFrames = detailedMetrics.renderOperations || [];
  const totalFrames =
    droppedFrames.length > 0
      ? droppedFrames[droppedFrames.length - 1]?.frameCount || 0
      : 0;

  const droppedCount = droppedFrames.filter(
    (f) => f.type === "dropped-frame"
  ).length;
  const avgFrameDuration =
    droppedFrames.reduce((sum, f) => sum + f.duration, 0) /
    (droppedFrames.length || 1);

  return {
    totalFrames,
    droppedFrames: droppedCount,
    dropRate: totalFrames > 0 ? (droppedCount / totalFrames) * 100 : 0,
    avgFrameDuration,
    worstFrameDuration: Math.max(...droppedFrames.map((f) => f.duration || 0)),
  };
}

function analyzeDOMMutations(detailedMetrics) {
  const mutations = detailedMetrics.domMutations || [];
  const totalMutations = mutations.reduce((sum, m) => sum + m.count, 0);
  const totalAdded = mutations.reduce((sum, m) => sum + m.addedNodes, 0);
  const totalRemoved = mutations.reduce((sum, m) => sum + m.removedNodes, 0);

  const mutationHotspots = mutations
    .filter((m) => m.count > 10)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalMutations,
    totalAdded,
    totalRemoved,
    avgMutationsPerEvent: totalMutations / (mutations.length || 1),
    hotspots: mutationHotspots,
  };
}

function analyzeMemoryUsage(detailedMetrics) {
  const snapshots = detailedMetrics.memorySnapshots || [];

  if (snapshots.length === 0) {
    return { available: false };
  }

  const first = snapshots[0];
  const last = snapshots[snapshots.length - 1];
  const growth = last.usedJSHeapSize - first.usedJSHeapSize;
  const growthMB = (growth / 1024 / 1024).toFixed(2);

  const peak = Math.max(...snapshots.map((s) => s.usedJSHeapSize));
  const peakMB = (peak / 1024 / 1024).toFixed(2);

  return {
    available: true,
    initialMB: (first.usedJSHeapSize / 1024 / 1024).toFixed(2),
    finalMB: (last.usedJSHeapSize / 1024 / 1024).toFixed(2),
    growthMB,
    peakMB,
    snapshots: snapshots.length,
    trend: growth > 0 ? "increasing" : "stable",
  };
}

function analyzeNetworkActivity(detailedMetrics) {
  const resources = detailedMetrics.networkActivity || [];

  const byType = {};
  let totalSize = 0;
  let totalDuration = 0;

  resources.forEach((r) => {
    if (!byType[r.type]) {
      byType[r.type] = { count: 0, size: 0, duration: 0 };
    }
    byType[r.type].count++;
    byType[r.type].size += r.transferSize;
    byType[r.type].duration += r.duration;
    totalSize += r.transferSize;
    totalDuration += r.duration;
  });

  const slowest = [...resources]
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 5);

  const largest = [...resources]
    .sort((a, b) => b.transferSize - a.transferSize)
    .slice(0, 5);

  return {
    totalResources: resources.length,
    totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
    avgDuration: (totalDuration / (resources.length || 1)).toFixed(2),
    byType,
    slowest,
    largest,
  };
}

function identifyBottlenecks(metrics, detailedMetrics) {
  const bottlenecks = [];

  // Frame drops during specific operations
  const droppedFrames = detailedMetrics.renderOperations || [];
  const mutations = detailedMetrics.domMutations || [];

  // Correlate frame drops with DOM mutations
  droppedFrames.forEach((frame) => {
    const nearbyMutations = mutations.filter(
      (m) => Math.abs(m.timestamp - frame.timestamp) < 100
    );

    if (nearbyMutations.length > 0) {
      bottlenecks.push({
        type: "dom-mutation-causing-frame-drop",
        timestamp: frame.timestamp,
        frameDrop: frame.duration,
        mutations: nearbyMutations.reduce((sum, m) => sum + m.count, 0),
        severity: frame.duration > 100 ? "critical" : "warning",
      });
    }
  });

  // Heavy frame gaps
  const rafGaps = metrics.rafGaps || [];
  const heavyGaps = rafGaps.filter((g) => g.gap > 100);

  if (heavyGaps.length > 10) {
    bottlenecks.push({
      type: "excessive-frame-gaps",
      count: heavyGaps.length,
      avgGap: (
        heavyGaps.reduce((sum, g) => sum + g.gap, 0) / heavyGaps.length
      ).toFixed(2),
      severity: "critical",
    });
  }

  return bottlenecks.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

function generateRecommendations(analysis) {
  const recommendations = [];

  // Rendering recommendations
  if (analysis.rendering.dropRate > 10) {
    recommendations.push({
      category: "Rendering",
      priority: "High",
      issue: `High frame drop rate: ${analysis.rendering.dropRate.toFixed(1)}%`,
      suggestion:
        "Consider using CSS transforms instead of layout-triggering properties. Enable GPU acceleration with will-change.",
    });
  }

  // DOM recommendations
  if (analysis.dom.avgMutationsPerEvent > 50) {
    recommendations.push({
      category: "DOM",
      priority: "High",
      issue: `Excessive DOM mutations: avg ${analysis.dom.avgMutationsPerEvent.toFixed(
        0
      )} per event`,
      suggestion:
        "Batch DOM updates using DocumentFragment or virtual DOM diffing. Consider debouncing rapid mutations.",
    });
  }

  // Memory recommendations
  if (analysis.memory.available && parseFloat(analysis.memory.growthMB) > 10) {
    recommendations.push({
      category: "Memory",
      priority: "Medium",
      issue: `Memory growth: ${analysis.memory.growthMB}MB`,
      suggestion:
        "Check for event listener leaks, detached DOM nodes, or large cached objects. Clear unused references.",
    });
  }

  // Network recommendations
  if (analysis.network.slowest.length > 0) {
    const slowest = analysis.network.slowest[0];
    if (slowest.duration > 500) {
      recommendations.push({
        category: "Network",
        priority: "Medium",
        issue: `Slow resource: ${slowest.name} (${slowest.duration.toFixed(
          0
        )}ms)`,
        suggestion:
          "Optimize resource loading with compression, caching, or lazy loading.",
      });
    }
  }

  // Bottleneck recommendations
  analysis.bottlenecks.forEach((bottleneck) => {
    if (bottleneck.type === "dom-mutation-causing-frame-drop") {
      recommendations.push({
        category: "Performance",
        priority: "Critical",
        issue: `DOM mutations causing frame drops at ${bottleneck.timestamp.toFixed(
          0
        )}ms`,
        suggestion:
          "Move DOM updates outside animation frames. Use requestIdleCallback for non-critical updates.",
      });
    }
  });

  return recommendations;
}

function generateDetailedReport(analysis, metrics, detailedMetrics) {
  const lines = ["# Detailed Performance Analysis", ""];

  // Rendering Performance
  lines.push("## 🎨 Rendering Performance");
  lines.push(`- Total frames: ${analysis.rendering.totalFrames}`);
  lines.push(
    `- Dropped frames: ${
      analysis.rendering.droppedFrames
    } (${analysis.rendering.dropRate.toFixed(1)}%)`
  );
  lines.push(
    `- Average frame duration: ${analysis.rendering.avgFrameDuration.toFixed(
      2
    )}ms`
  );
  lines.push(
    `- Worst frame duration: ${analysis.rendering.worstFrameDuration.toFixed(
      2
    )}ms`
  );
  lines.push("");

  // DOM Operations
  lines.push("## 🔧 DOM Operations");
  lines.push(`- Total mutations: ${analysis.dom.totalMutations}`);
  lines.push(`- Nodes added: ${analysis.dom.totalAdded}`);
  lines.push(`- Nodes removed: ${analysis.dom.totalRemoved}`);
  lines.push(
    `- Average mutations per event: ${analysis.dom.avgMutationsPerEvent.toFixed(
      1
    )}`
  );

  if (analysis.dom.hotspots.length > 0) {
    lines.push("");
    lines.push("### Mutation Hotspots:");
    analysis.dom.hotspots.slice(0, 5).forEach((h, i) => {
      lines.push(
        `${i + 1}. ${h.count} mutations @ ${h.timestamp.toFixed(0)}ms`
      );
    });
  }
  lines.push("");

  // Memory Analysis
  if (analysis.memory.available) {
    lines.push("## 💾 Memory Usage");
    lines.push(`- Initial: ${analysis.memory.initialMB}MB`);
    lines.push(`- Final: ${analysis.memory.finalMB}MB`);
    lines.push(
      `- Growth: ${analysis.memory.growthMB}MB (${analysis.memory.trend})`
    );
    lines.push(`- Peak: ${analysis.memory.peakMB}MB`);
    lines.push("");
  }

  // Network Activity
  lines.push("## 🌐 Network Activity");
  lines.push(`- Total resources: ${analysis.network.totalResources}`);
  lines.push(`- Total size: ${analysis.network.totalSizeMB}MB`);
  lines.push(`- Average load time: ${analysis.network.avgDuration}ms`);
  lines.push("");

  if (analysis.network.slowest.length > 0) {
    lines.push("### Slowest Resources:");
    analysis.network.slowest.forEach((r, i) => {
      const name = r.name.split("/").pop();
      lines.push(
        `${i + 1}. ${name} - ${r.duration.toFixed(0)}ms (${(
          r.transferSize / 1024
        ).toFixed(1)}KB)`
      );
    });
    lines.push("");
  }

  // Bottlenecks
  if (analysis.bottlenecks.length > 0) {
    lines.push("## 🚨 Identified Bottlenecks");
    analysis.bottlenecks.slice(0, 10).forEach((b, i) => {
      lines.push(`${i + 1}. **[${b.severity.toUpperCase()}]** ${b.type}`);
      if (b.timestamp)
        lines.push(`   - Timestamp: ${b.timestamp.toFixed(0)}ms`);
      if (b.frameDrop)
        lines.push(`   - Frame drop: ${b.frameDrop.toFixed(1)}ms`);
      if (b.mutations) lines.push(`   - Related mutations: ${b.mutations}`);
      if (b.count) lines.push(`   - Count: ${b.count}`);
      if (b.avgGap) lines.push(`   - Average gap: ${b.avgGap}ms`);
    });
    lines.push("");
  }

  // Recommendations
  if (analysis.recommendations.length > 0) {
    lines.push("## 💡 Recommendations");

    const critical = analysis.recommendations.filter(
      (r) => r.priority === "Critical"
    );
    const high = analysis.recommendations.filter((r) => r.priority === "High");
    const medium = analysis.recommendations.filter(
      (r) => r.priority === "Medium"
    );

    if (critical.length > 0) {
      lines.push("### 🔴 Critical Priority");
      critical.forEach((r) => {
        lines.push(`**${r.category}:** ${r.issue}`);
        lines.push(`→ ${r.suggestion}`);
        lines.push("");
      });
    }

    if (high.length > 0) {
      lines.push("### 🟠 High Priority");
      high.forEach((r) => {
        lines.push(`**${r.category}:** ${r.issue}`);
        lines.push(`→ ${r.suggestion}`);
        lines.push("");
      });
    }

    if (medium.length > 0) {
      lines.push("### 🟡 Medium Priority");
      medium.forEach((r) => {
        lines.push(`**${r.category}:** ${r.issue}`);
        lines.push(`→ ${r.suggestion}`);
        lines.push("");
      });
    }
  }

  return lines.join("\n");
}
