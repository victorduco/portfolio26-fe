export async function setupConsoleProfiling(page) {
  // Intercept console messages to collect profiling data
  const consoleMessages = [];

  page.on("console", (msg) => {
    const text = msg.text();
    if (text.includes("[PROFILE]") || text.includes("[PERF]")) {
      consoleMessages.push({
        type: msg.type(),
        text: text,
        timestamp: Date.now(),
      });
    }
  });

  await page.addInitScript(() => {
    const profileData = {
      timings: {},
      marks: {},
      measures: [],
      operations: [],
    };

    Object.defineProperty(window, "__profileData", {
      value: profileData,
      configurable: false,
      enumerable: false,
      writable: false,
    });

    // Enhanced console profiling
    const originalConsoleTime = console.time;
    const originalConsoleTimeEnd = console.timeEnd;
    const originalConsoleTimeLog = console.timeLog;

    console.time = function (label) {
      const timestamp = performance.now();
      profileData.timings[label] = { start: timestamp };
      performance.mark(`${label}-start`);
      console.log(`[PROFILE] START: ${label} @ ${timestamp.toFixed(2)}ms`);
      return originalConsoleTime.apply(console, arguments);
    };

    console.timeEnd = function (label) {
      const timestamp = performance.now();
      if (profileData.timings[label]) {
        const duration = timestamp - profileData.timings[label].start;
        profileData.timings[label].end = timestamp;
        profileData.timings[label].duration = duration;

        performance.mark(`${label}-end`);
        try {
          performance.measure(label, `${label}-start`, `${label}-end`);
        } catch (e) {
          // Ignore if marks don't exist
        }

        console.log(`[PROFILE] END: ${label} - ${duration.toFixed(2)}ms`);

        profileData.measures.push({
          label,
          start: profileData.timings[label].start,
          end: timestamp,
          duration,
        });
      }
      return originalConsoleTimeEnd.apply(console, arguments);
    };

    console.timeLog = function (label, ...data) {
      const timestamp = performance.now();
      if (profileData.timings[label]) {
        const elapsed = timestamp - profileData.timings[label].start;
        console.log(
          `[PROFILE] LOG: ${label} - ${elapsed.toFixed(2)}ms -`,
          ...data
        );
      }
      return originalConsoleTimeLog.apply(console, arguments);
    };

    // Custom profiling functions
    window.__profile = {
      start: (operation, details = {}) => {
        const timestamp = performance.now();
        console.time(operation);

        profileData.operations.push({
          operation,
          type: "start",
          timestamp,
          details,
        });
      },

      end: (operation, details = {}) => {
        const timestamp = performance.now();
        console.timeEnd(operation);

        profileData.operations.push({
          operation,
          type: "end",
          timestamp,
          details,
        });
      },

      mark: (eventName, details = {}) => {
        const timestamp = performance.now();
        performance.mark(eventName);

        profileData.marks[eventName] = {
          timestamp,
          details,
        };

        console.log(
          `[PERF] MARK: ${eventName} @ ${timestamp.toFixed(2)}ms`,
          details
        );
      },

      measure: (name, startMark, endMark) => {
        try {
          performance.measure(name, startMark, endMark);
          const measure = performance.getEntriesByName(name, "measure")[0];
          if (measure) {
            console.log(
              `[PERF] MEASURE: ${name} = ${measure.duration.toFixed(2)}ms`
            );
            return measure.duration;
          }
        } catch (e) {
          console.warn(`Failed to measure ${name}:`, e.message);
        }
        return null;
      },
    };

    // Auto-profile specific DOM operations
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          const target = mutation.target;
          const attrName = mutation.attributeName;

          // Track style changes
          if (attrName === "style" || attrName === "class") {
            const timestamp = performance.now();
            console.log(
              `[PERF] DOM: ${attrName} changed on ${target.tagName}${
                target.className ? "." + target.className : ""
              } @ ${timestamp.toFixed(2)}ms`
            );
          }
        }
      });
    });

    // Start observing after a short delay to avoid init noise
    setTimeout(() => {
      observer.observe(document.documentElement, {
        attributes: true,
        subtree: true,
        attributeFilter: ["style", "class"],
      });
    }, 1000);

    console.log("[PROFILE] Console profiling initialized");
  });

  return {
    getConsoleMessages: () => consoleMessages,
  };
}

export function analyzeConsoleProfiling(profileData, consoleMessages) {
  const analysis = {
    operations: [],
    slowOperations: [],
    timeline: [],
    statistics: {},
  };

  // Parse console messages
  consoleMessages.forEach((msg) => {
    const text = msg.text;

    if (text.includes("[PROFILE] START:")) {
      const match = text.match(/START: (.+?) @ ([\d.]+)ms/);
      if (match) {
        analysis.timeline.push({
          type: "start",
          operation: match[1],
          timestamp: parseFloat(match[2]),
        });
      }
    } else if (text.includes("[PROFILE] END:")) {
      const match = text.match(/END: (.+?) - ([\d.]+)ms/);
      if (match) {
        const operation = match[1];
        const duration = parseFloat(match[2]);

        analysis.operations.push({
          operation,
          duration,
        });

        analysis.timeline.push({
          type: "end",
          operation,
          duration,
        });

        if (duration > 50) {
          analysis.slowOperations.push({
            operation,
            duration,
            severity: duration > 100 ? "critical" : "warning",
          });
        }
      }
    } else if (text.includes("[PERF] MARK:")) {
      const match = text.match(/MARK: (.+?) @ ([\d.]+)ms/);
      if (match) {
        analysis.timeline.push({
          type: "mark",
          event: match[1],
          timestamp: parseFloat(match[2]),
        });
      }
    } else if (text.includes("[PERF] DOM:")) {
      const match = text.match(/DOM: (.+?) @ ([\d.]+)ms/);
      if (match) {
        analysis.timeline.push({
          type: "dom",
          change: match[1],
          timestamp: parseFloat(match[2]),
        });
      }
    }
  });

  // Calculate statistics
  const operationGroups = {};
  analysis.operations.forEach((op) => {
    if (!operationGroups[op.operation]) {
      operationGroups[op.operation] = [];
    }
    operationGroups[op.operation].push(op.duration);
  });

  Object.entries(operationGroups).forEach(([operation, durations]) => {
    const total = durations.reduce((sum, d) => sum + d, 0);
    const avg = total / durations.length;
    const max = Math.max(...durations);
    const min = Math.min(...durations);

    analysis.statistics[operation] = {
      count: durations.length,
      total: total.toFixed(2),
      avg: avg.toFixed(2),
      max: max.toFixed(2),
      min: min.toFixed(2),
    };
  });

  // Sort operations by duration
  analysis.operations.sort((a, b) => b.duration - a.duration);
  analysis.slowOperations.sort((a, b) => b.duration - a.duration);

  return analysis;
}

export function generateConsoleProfilingReport(analysis) {
  const lines = ["# Console Profiling Report", ""];

  // Summary
  lines.push("## Summary");
  lines.push(`- Total operations tracked: ${analysis.operations.length}`);
  lines.push(`- Slow operations (>50ms): ${analysis.slowOperations.length}`);
  lines.push(`- Unique operations: ${Object.keys(analysis.statistics).length}`);
  lines.push("");

  // Slow operations
  if (analysis.slowOperations.length > 0) {
    lines.push("## 🐌 Slow Operations");
    analysis.slowOperations.slice(0, 15).forEach((op, i) => {
      const emoji = op.severity === "critical" ? "🔴" : "🟡";
      lines.push(
        `${i + 1}. ${emoji} **${op.operation}** - ${op.duration.toFixed(2)}ms`
      );
    });
    lines.push("");
  }

  // Statistics
  if (Object.keys(analysis.statistics).length > 0) {
    lines.push("## 📊 Operation Statistics");
    lines.push("");
    lines.push("| Operation | Count | Total | Avg | Min | Max |");
    lines.push("|-----------|-------|-------|-----|-----|-----|");

    Object.entries(analysis.statistics)
      .sort((a, b) => parseFloat(b[1].total) - parseFloat(a[1].total))
      .forEach(([operation, stats]) => {
        lines.push(
          `| ${operation} | ${stats.count} | ${stats.total}ms | ${stats.avg}ms | ${stats.min}ms | ${stats.max}ms |`
        );
      });
    lines.push("");
  }

  // Top 10 operations by duration
  if (analysis.operations.length > 0) {
    lines.push("## ⏱️  Top Operations by Duration");
    analysis.operations.slice(0, 10).forEach((op, i) => {
      lines.push(`${i + 1}. ${op.operation} - ${op.duration.toFixed(2)}ms`);
    });
    lines.push("");
  }

  // Timeline highlights
  const marks = analysis.timeline.filter((t) => t.type === "mark");
  if (marks.length > 0) {
    lines.push("## 📍 Performance Marks");
    marks.forEach((mark, i) => {
      lines.push(`${i + 1}. ${mark.event} @ ${mark.timestamp.toFixed(2)}ms`);
    });
    lines.push("");
  }

  // DOM changes
  const domChanges = analysis.timeline.filter((t) => t.type === "dom");
  if (domChanges.length > 10) {
    lines.push("## 🔄 DOM Changes");
    lines.push(`Total DOM attribute changes detected: ${domChanges.length}`);
    lines.push("");
    lines.push("First 10 changes:");
    domChanges.slice(0, 10).forEach((change, i) => {
      lines.push(
        `${i + 1}. ${change.change} @ ${change.timestamp.toFixed(2)}ms`
      );
    });
    lines.push("");
  }

  return lines.join("\n");
}
