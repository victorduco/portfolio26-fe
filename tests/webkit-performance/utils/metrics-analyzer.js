export function analyzeMetrics(metrics, longTaskThreshold, frameGapThreshold) {
  const analysis = {
    longTasks: analyzeLongTasks(metrics, longTaskThreshold),
    frameDrops: analyzeFrameDrops(metrics, frameGapThreshold),
    interactions: analyzeInteractions(metrics),
    layoutShifts: analyzeLayoutShifts(metrics),
    paint: analyzePaint(metrics),
    criticalIssues: [],
  };

  analysis.summaryText = generateSummary(
    analysis,
    metrics,
    longTaskThreshold,
    frameGapThreshold
  );
  analysis.criticalIssues = identifyCriticalIssues(
    analysis,
    longTaskThreshold,
    frameGapThreshold
  );

  return analysis;
}

function analyzeLongTasks(metrics, threshold) {
  const longTasks = [...(metrics.longTasks || [])].sort(
    (a, b) => b.duration - a.duration
  );
  const overThreshold = longTasks.filter((task) => task.duration >= threshold);

  return {
    total: longTasks.length,
    overThreshold: overThreshold.length,
    worst: longTasks[0] || null,
    list: longTasks,
    totalDuration: longTasks.reduce((sum, task) => sum + task.duration, 0),
  };
}

function analyzeFrameDrops(metrics, threshold) {
  const rafGaps = [...(metrics.rafGaps || [])].sort((a, b) => b.gap - a.gap);
  const overThreshold = rafGaps.filter((gap) => gap.gap >= threshold);
  const totalStall = overThreshold.reduce(
    (sum, gap) => sum + (gap.gap - 16.7),
    0
  );
  const droppedFrames = rafGaps.filter((gap) => gap.gap > 16.7).length;

  return {
    total: rafGaps.length,
    overThreshold: overThreshold.length,
    worst: rafGaps[0] || null,
    list: rafGaps,
    totalStall,
    droppedFrames,
  };
}

function analyzeInteractions(metrics) {
  const clickEvents = (metrics.eventTimings || []).filter(
    (entry) => entry.name === "click"
  );
  const clicksWithDelay = clickEvents
    .map((entry) => ({
      ...entry,
      inputDelay:
        typeof entry.processingStart === "number"
          ? entry.processingStart - entry.startTime
          : 0,
    }))
    .sort((a, b) => b.inputDelay - a.inputDelay);

  return {
    totalClicks: clickEvents.length,
    worstDelay: clicksWithDelay[0] || null,
    avgDelay:
      clicksWithDelay.length > 0
        ? clicksWithDelay.reduce((sum, c) => sum + c.inputDelay, 0) /
          clicksWithDelay.length
        : 0,
    list: clicksWithDelay,
  };
}

function analyzeLayoutShifts(metrics) {
  const shifts = metrics.layoutShifts || [];
  const cls = shifts.reduce((sum, shift) => sum + shift.value, 0);

  return {
    total: shifts.length,
    cumulativeLayoutShift: cls,
    worst: shifts.sort((a, b) => b.value - a.value)[0] || null,
    list: shifts,
  };
}

function analyzePaint(metrics) {
  const paints = metrics.paintTimings || [];
  const fcp = paints.find((p) => p.name === "first-contentful-paint");
  const lcp = paints.find((p) => p.name === "largest-contentful-paint");

  return {
    firstContentfulPaint: fcp?.startTime || null,
    largestContentfulPaint: lcp?.startTime || null,
  };
}

function identifyCriticalIssues(analysis, longTaskThreshold, frameGapThreshold) {
  const issues = [];

  if (analysis.longTasks.overThreshold > 5) {
    issues.push(
      `High number of long tasks: ${analysis.longTasks.overThreshold} tasks ≥ ${longTaskThreshold}ms`
    );
  }

  if (analysis.longTasks.worst && analysis.longTasks.worst.duration > 500) {
    issues.push(
      `Critical long task detected: ${analysis.longTasks.worst.duration.toFixed(1)}ms`
    );
  }

  if (analysis.frameDrops.totalStall > 1000) {
    issues.push(
      `Severe frame stalling: ${analysis.frameDrops.totalStall.toFixed(1)}ms total stall time`
    );
  }

  if (
    analysis.interactions.worstDelay &&
    analysis.interactions.worstDelay.inputDelay > 100
  ) {
    issues.push(
      `Poor input responsiveness: ${analysis.interactions.worstDelay.inputDelay.toFixed(1)}ms delay`
    );
  }

  if (analysis.layoutShifts.cumulativeLayoutShift > 0.25) {
    issues.push(
      `Poor CLS score: ${analysis.layoutShifts.cumulativeLayoutShift.toFixed(3)}`
    );
  }

  return issues;
}

function generateSummary(
  analysis,
  metrics,
  longTaskThreshold,
  frameGapThreshold
) {
  const lines = ["# WebKit Performance Analysis", ""];

  lines.push("## Overview");
  lines.push(`- Long tasks captured: ${analysis.longTasks.total}`);
  lines.push(
    `- Long tasks ≥ ${longTaskThreshold}ms: ${analysis.longTasks.overThreshold}`
  );
  lines.push(`- Frame drops detected: ${analysis.frameDrops.droppedFrames}`);
  lines.push(
    `- Frame gaps ≥ ${frameGapThreshold}ms: ${analysis.frameDrops.overThreshold}`
  );
  lines.push(`- Click interactions: ${analysis.interactions.totalClicks}`);
  lines.push(`- Layout shifts: ${analysis.layoutShifts.total}`);
  lines.push(
    `- CLS score: ${analysis.layoutShifts.cumulativeLayoutShift.toFixed(3)}`
  );
  lines.push("");

  if (
    analysis.paint.firstContentfulPaint ||
    analysis.paint.largestContentfulPaint
  ) {
    lines.push("## Paint Metrics");
    if (analysis.paint.firstContentfulPaint) {
      lines.push(
        `- First Contentful Paint: ${analysis.paint.firstContentfulPaint.toFixed(1)}ms`
      );
    }
    if (analysis.paint.largestContentfulPaint) {
      lines.push(
        `- Largest Contentful Paint: ${analysis.paint.largestContentfulPaint.toFixed(1)}ms`
      );
    }
    lines.push("");
  }

  if (analysis.criticalIssues.length > 0) {
    lines.push("## 🔴 Critical Issues");
    analysis.criticalIssues.forEach((issue) => {
      lines.push(`- ${issue}`);
    });
    lines.push("");
  }

  lines.push("## Worst Offenders");
  if (analysis.longTasks.worst) {
    lines.push(
      `- **Longest task:** ${analysis.longTasks.worst.duration.toFixed(1)}ms @ ${analysis.longTasks.worst.startTime.toFixed(1)}ms (${formatAttribution(analysis.longTasks.worst)})`
    );
  }
  if (analysis.frameDrops.worst) {
    lines.push(
      `- **Worst frame gap:** ${analysis.frameDrops.worst.gap.toFixed(1)}ms @ ${analysis.frameDrops.worst.timestamp.toFixed(1)}ms`
    );
  }
  if (analysis.interactions.worstDelay) {
    lines.push(
      `- **Worst input delay:** ${analysis.interactions.worstDelay.inputDelay.toFixed(1)}ms on ${analysis.interactions.worstDelay.target || "unknown"}`
    );
  }
  lines.push("");

  if (analysis.longTasks.overThreshold > 0) {
    lines.push(`## Long Tasks ≥ ${longTaskThreshold}ms`);
    lines.push(
      `Total blocking time: ${analysis.longTasks.totalDuration.toFixed(1)}ms`
    );
    lines.push("");
    analysis.longTasks.list
      .filter((task) => task.duration >= longTaskThreshold)
      .slice(0, 10)
      .forEach((task, index) => {
        const attribution = formatAttribution(task);
        lines.push(
          `${index + 1}. **${task.duration.toFixed(1)}ms** @ ${task.startTime.toFixed(1)}ms - ${attribution}`
        );
      });
    lines.push("");
  }

  if (analysis.frameDrops.overThreshold > 0) {
    lines.push(`## Frame Gaps ≥ ${frameGapThreshold}ms`);
    lines.push(
      `Total stall time over budget: ${analysis.frameDrops.totalStall.toFixed(1)}ms`
    );
    lines.push("");
    analysis.frameDrops.list
      .filter((gap) => gap.gap >= frameGapThreshold)
      .slice(0, 10)
      .forEach((gap, index) => {
        lines.push(
          `${index + 1}. **${gap.gap.toFixed(1)}ms** @ ${gap.timestamp.toFixed(1)}ms`
        );
      });
    lines.push("");
  }

  if (analysis.interactions.totalClicks > 0) {
    lines.push("## Click Interaction Delays");
    lines.push(`Average delay: ${analysis.interactions.avgDelay.toFixed(1)}ms`);
    lines.push("");
    analysis.interactions.list.slice(0, 10).forEach((click, index) => {
      lines.push(
        `${index + 1}. Input delay: **${click.inputDelay.toFixed(1)}ms**, Processing: ${click.duration?.toFixed(1) || "0.0"}ms (${click.target || "unknown"})`
      );
    });
    lines.push("");
  }

  if (metrics.logs?.length > 0) {
    lines.push("## Instrumentation Logs");
    metrics.logs.forEach((log) => {
      lines.push(`- ${log}`);
    });
    lines.push("");
  }

  return lines.join("\n");
}

function formatAttribution(task) {
  if (!Array.isArray(task.attribution) || task.attribution.length === 0) {
    return "unknown source";
  }

  const [first] = task.attribution;
  return (
    first.containerName ||
    first.containerId ||
    first.containerSrc ||
    first.name ||
    "unknown source"
  );
}

